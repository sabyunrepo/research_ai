#!/usr/bin/env node

const fs = require("node:fs");
const http = require("node:http");
const os = require("node:os");
const path = require("node:path");
const { spawn } = require("node:child_process");

const { createPracticeApp } = require("../practice-harness/src/create-practice-app");
const {
  createPracticeStaticApp,
} = require("../practice-harness/src/create-practice-static-app");
const {
  createPracticeDefinitionStore,
} = require("../practice-harness/src/practice-definition-store");
const {
  createMemoryAttemptStore,
} = require("../practice-harness/src/stores/memory-attempt-store");

const DEFAULT_CHROME_PATHS = [
  process.env.CHROME_BIN,
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Chromium.app/Contents/MacOS/Chromium",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
].filter(Boolean);

const VIEWPORTS = [
  { label: "desktop", width: 1440, height: 900, mobile: false },
  { label: "mobile", width: 390, height: 844, mobile: true },
];

function parseArgs(argv) {
  const args = { outDir: path.join(".tmp", "practice-browser-qa") };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--chrome-bin") {
      args.chromeBin = argv[index + 1];
      index += 1;
    } else if (arg === "--out-dir") {
      args.outDir = argv[index + 1];
      index += 1;
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }
  return args;
}

function findChrome(chromeBin) {
  const candidates = chromeBin ? [chromeBin] : DEFAULT_CHROME_PATHS;
  const found = candidates.find((candidate) => fs.existsSync(candidate));
  if (!found) {
    throw new Error("Chrome/Chromium binary not found. Set CHROME_BIN or pass --chrome-bin.");
  }
  return found;
}

function createServer() {
  const apiApp = createPracticeApp({
    definitionStore: createPracticeDefinitionStore(),
    attemptStore: createMemoryAttemptStore(),
    judgeProvider: null,
  });
  return http.createServer(createPracticeStaticApp({ apiApp }));
}

function listen(server) {
  return new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", () => {
      server.off("error", reject);
      const address = server.address();
      resolve(`http://127.0.0.1:${address.port}`);
    });
  });
}

function close(server) {
  return new Promise((resolve, reject) => {
    server.close((error) => {
      if (error) reject(error);
      else resolve();
    });
  });
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function waitForExit(child, timeoutMs) {
  return new Promise((resolve) => {
    let settled = false;
    const timer = setTimeout(() => {
      if (settled) return;
      settled = true;
      resolve(false);
    }, timeoutMs);
    child.once("exit", () => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      resolve(true);
    });
  });
}

async function stopChrome(child) {
  if (child.exitCode !== null || child.signalCode) return;
  child.kill("SIGTERM");
  const exited = await waitForExit(child, 1500);
  if (!exited) {
    child.kill("SIGKILL");
    await waitForExit(child, 1500);
  }
}

async function waitForDevToolsPort(userDataDir, timeoutMs = 10000) {
  const activePortPath = path.join(userDataDir, "DevToolsActivePort");
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    if (fs.existsSync(activePortPath)) {
      const [port] = fs.readFileSync(activePortPath, "utf8").trim().split("\n");
      if (port) return Number(port);
    }
    await delay(100);
  }
  throw new Error("Chrome did not expose a DevTools port in time.");
}

async function getPageWebSocketUrl(port) {
  const deadline = Date.now() + 10000;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(`http://127.0.0.1:${port}/json/list`);
      const pages = await response.json();
      const page = pages.find((item) =>
        item.type === "page" &&
        item.webSocketDebuggerUrl &&
        !String(item.url || "").startsWith("chrome-extension://")
      );
      if (page) return page.webSocketDebuggerUrl;
    } catch (error) {
      // Chrome is still starting.
    }
    await delay(100);
  }
  throw new Error("Chrome DevTools page target was not available in time.");
}

class CdpClient {
  constructor(webSocketUrl) {
    this.nextId = 1;
    this.pending = new Map();
    this.loadResolvers = [];
    this.socket = new WebSocket(webSocketUrl);
    this.socket.addEventListener("message", (event) => this.handleMessage(event));
  }

  async open() {
    if (this.socket.readyState === WebSocket.OPEN) return;
    await new Promise((resolve, reject) => {
      this.socket.addEventListener("open", resolve, { once: true });
      this.socket.addEventListener("error", reject, { once: true });
    });
  }

  handleMessage(event) {
    const message = JSON.parse(event.data);
    if (message.id && this.pending.has(message.id)) {
      const { resolve, reject } = this.pending.get(message.id);
      this.pending.delete(message.id);
      if (message.error) reject(new Error(message.error.message));
      else resolve(message.result || {});
      return;
    }
    if (message.method === "Page.loadEventFired") {
      const resolvers = this.loadResolvers.splice(0);
      resolvers.forEach((resolve) => resolve());
    }
  }

  send(method, params = {}) {
    const id = this.nextId;
    this.nextId += 1;
    this.socket.send(JSON.stringify({ id, method, params }));
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
    });
  }

  waitForLoad(timeoutMs = 8000) {
    return new Promise((resolve) => {
      const timer = setTimeout(resolve, timeoutMs);
      this.loadResolvers.push(() => {
        clearTimeout(timer);
        resolve();
      });
    });
  }

  close() {
    this.socket.close();
  }
}

async function captureScreenshot({ chromeBin, baseUrl, outDir, act, viewport }) {
  if (typeof WebSocket !== "function") {
    throw new Error("This script requires a Node.js runtime with global WebSocket support.");
  }

  const userDataDir = fs.mkdtempSync(path.join(os.tmpdir(), "practice-chrome-"));
  const screenshotPath = path.join(outDir, `act${act}-${viewport.label}.png`);
  const chrome = spawn(
    chromeBin,
    [
      "--headless=new",
      "--disable-gpu",
      "--disable-background-networking",
      "--disable-component-update",
      "--disable-default-apps",
      "--disable-extensions",
      "--disable-features=MediaRouter,OptimizationHints",
      "--disable-sync",
      "--hide-scrollbars",
      "--metrics-recording-only",
      "--no-first-run",
      "--remote-debugging-port=0",
      `--user-data-dir=${userDataDir}`,
      `--window-size=${viewport.width},${viewport.height}`,
      "about:blank",
    ],
    { stdio: "ignore" },
  );

  let client;
  try {
    const port = await waitForDevToolsPort(userDataDir);
    client = new CdpClient(await getPageWebSocketUrl(port));
    await client.open();
    await client.send("Page.enable");
    await client.send("Runtime.enable");
    await client.send("Emulation.setDeviceMetricsOverride", {
      width: viewport.width,
      height: viewport.height,
      deviceScaleFactor: 1,
      mobile: viewport.mobile,
    });
    await client.send("Page.navigate", { url: `${baseUrl}/act/${act}` });
    await client.waitForLoad();
    await client.send("Runtime.evaluate", {
      expression: "document.fonts && document.fonts.ready ? document.fonts.ready.then(() => true) : true",
      awaitPromise: true,
    });
    await delay(250);
    const captured = await client.send("Page.captureScreenshot", {
      format: "png",
      fromSurface: true,
    });
    fs.writeFileSync(screenshotPath, Buffer.from(captured.data, "base64"));
  } finally {
    if (client) client.close();
    await stopChrome(chrome);
    fs.rmSync(userDataDir, { force: true, recursive: true });
  }

  const size = fs.existsSync(screenshotPath) ? fs.statSync(screenshotPath).size : 0;
  if (size < 20000) {
    throw new Error(
      `Browser capture produced an unexpectedly small file for act ${act} ${viewport.label}: ${size} bytes`,
    );
  }
  return { screenshotPath, size };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const chromeBin = findChrome(args.chromeBin);
  const outDir = path.resolve(args.outDir);
  fs.rmSync(outDir, { force: true, recursive: true });
  fs.mkdirSync(outDir, { recursive: true });

  const server = createServer();
  const baseUrl = await listen(server);
  try {
    for (const act of [1, 2, 3, 4, 5, 6]) {
      for (const viewport of VIEWPORTS) {
        const shot = await captureScreenshot({ chromeBin, baseUrl, outDir, act, viewport });
        console.log(
          `PASS browser screenshot act${act} ${viewport.label}: ${path.relative(process.cwd(), shot.screenshotPath)} (${shot.size} bytes)`,
        );
      }
    }
  } finally {
    await close(server);
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
