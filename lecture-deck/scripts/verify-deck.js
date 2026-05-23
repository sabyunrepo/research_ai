#!/usr/bin/env node
const fs = require("node:fs");
const http = require("node:http");
const os = require("node:os");
const path = require("node:path");
const { spawn } = require("node:child_process");

const root = path.resolve(__dirname, "..");
const results = [];

function pass(name, detail = "") {
  results.push({ ok: true, name, detail });
}

function fail(name, detail) {
  results.push({ ok: false, name, detail });
}

function readText(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

function fileExists(relativePath) {
  return fs.existsSync(path.join(root, relativePath));
}

function getSpec() {
  const spec = JSON.parse(readText("slide-spec.json"));
  if (!Array.isArray(spec.slides) || spec.slides.length === 0) {
    throw new Error("slide-spec.json must include a non-empty slides array");
  }
  return spec;
}

function extractLocalReferences(relativePath, text) {
  const references = [];
  const attrPattern = /\b(?:href|src)=["']([^"']+)["']/g;
  const cssPattern = /url\(["']?([^"')]+)["']?\)/g;

  for (const pattern of [attrPattern, cssPattern]) {
    let match;
    while ((match = pattern.exec(text))) {
      const value = match[1].trim();
      if (!value || value.startsWith("#") || /^(https?:|mailto:|tel:|data:|javascript:)/.test(value)) {
        continue;
      }
      references.push({
        from: relativePath,
        target: value.split("#")[0].split("?")[0]
      });
    }
  }

  return references;
}

function walkFiles(dir) {
  const entries = fs.readdirSync(path.join(root, dir), { withFileTypes: true });
  return entries.flatMap((entry) => {
    const relativePath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      return walkFiles(relativePath);
    }
    return relativePath;
  });
}

function runStaticChecks(spec) {
  const files = [
    "source.md",
    "slide-spec.json",
    "CLAUDE.md",
    "few-shots.md",
    "HANDOFF.md",
    "skills/deck-builder/SKILL.md",
    "agents/researcher.md",
    "agents/slide-reviewer.md",
    "agents/visual-reviewer.md",
    "hooks/verify-deck.json",
    "scripts/verify-deck.js",
    "evaluation-template.md",
    "deck.html",
    "presenter-review.html",
    "assets/style.css",
    "assets/slides.js",
    "assets/deck.js",
    "assets/presenter-review.js",
    ...spec.slides.map((slide) => slide.file)
  ];

  const missing = files.filter((file) => !fileExists(file));
  if (missing.length) {
    fail("missing files", missing.join(", "));
  } else {
    pass("missing files", `${files.length} required files found`);
  }

  pass("slide count", `${spec.slides.length} slides in slide-spec.json`);

  const invalidSlides = spec.slides.filter((slide) => {
    return !slide.id || !slide.file || !slide.title || !slide.message || !slide.visual || !slide.speakerNote || !Array.isArray(slide.evidence);
  });

  if (invalidSlides.length) {
    fail("slide spec shape", invalidSlides.map((slide) => slide.id || slide.file || "unknown").join(", "));
  } else {
    pass("slide spec shape", `${spec.slides.length} slides`);
  }

  const allHtmlAndCss = walkFiles(".").filter((file) => /\.(html|css)$/.test(file));
  const brokenLinks = [];

  allHtmlAndCss.forEach((file) => {
    const text = readText(file);
    extractLocalReferences(file, text).forEach((reference) => {
      const targetPath = path.normalize(path.join(path.dirname(reference.from), reference.target));
      if (!fileExists(targetPath)) {
        brokenLinks.push(`${reference.from} -> ${reference.target}`);
      }
    });
  });

  if (brokenLinks.length) {
    fail("broken links", brokenLinks.join("; "));
  } else {
    pass("broken links", "0 broken local references");
  }
}

function findChrome() {
  const candidates = [
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Chromium.app/Contents/MacOS/Chromium",
    "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge"
  ];
  return candidates.find((candidate) => fs.existsSync(candidate));
}

function serveStatic() {
  const server = http.createServer((request, response) => {
    const url = new URL(request.url, "http://127.0.0.1");
    const decodedPath = decodeURIComponent(url.pathname);
    const requested = decodedPath === "/" ? "/deck.html" : decodedPath;
    const filePath = path.normalize(path.join(root, requested));

    if (filePath !== root && !filePath.startsWith(`${root}${path.sep}`)) {
      response.writeHead(403);
      response.end("Forbidden");
      return;
    }

    fs.readFile(filePath, (error, body) => {
      if (error) {
        response.writeHead(404);
        response.end("Not found");
        return;
      }

      const ext = path.extname(filePath);
      const contentType = {
        ".html": "text/html; charset=utf-8",
        ".css": "text/css; charset=utf-8",
        ".js": "text/javascript; charset=utf-8",
        ".json": "application/json; charset=utf-8"
      }[ext] || "application/octet-stream";

      response.writeHead(200, { "content-type": contentType });
      response.end(body);
    });
  });

  return new Promise((resolve) => {
    server.listen(0, "127.0.0.1", () => {
      const { port } = server.address();
      resolve({ server, origin: `http://127.0.0.1:${port}` });
    });
  });
}

function launchChrome(chromePath) {
  const userDataDir = fs.mkdtempSync(path.join(os.tmpdir(), "deck-verify-"));
  const chrome = spawn(chromePath, [
    "--headless=new",
    "--disable-gpu",
    "--disable-dev-shm-usage",
    "--no-first-run",
    "--no-default-browser-check",
    "--remote-debugging-port=0",
    `--user-data-dir=${userDataDir}`,
    "about:blank"
  ], { stdio: ["ignore", "ignore", "pipe"] });
  const exitPromise = new Promise((resolve) => chrome.once("exit", resolve));

  const wsPromise = new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("Chrome did not expose a DevTools endpoint")), 10000);
    chrome.stderr.on("data", (chunk) => {
      const text = chunk.toString();
      const match = text.match(/DevTools listening on (ws:\/\/[^\s]+)/);
      if (match) {
        clearTimeout(timer);
        resolve(match[1]);
      }
    });
    chrome.on("exit", (code) => {
      reject(new Error(`Chrome exited early with code ${code}`));
    });
  });

  return { chrome, userDataDir, wsPromise, exitPromise };
}

async function createPage(browserWs, url) {
  const endpoint = new URL(browserWs);
  const targetUrl = `http://${endpoint.host}/json/new?${encodeURIComponent(url)}`;
  const response = await fetch(targetUrl, { method: "PUT" });
  if (!response.ok) {
    throw new Error(`Unable to create Chrome target: ${response.status}`);
  }
  const target = await response.json();
  return target.webSocketDebuggerUrl;
}

function cdpClient(pageWs) {
  const socket = new WebSocket(pageWs);
  let nextId = 1;
  const pending = new Map();

  socket.addEventListener("message", (event) => {
    const message = JSON.parse(event.data);
    if (!message.id || !pending.has(message.id)) {
      return;
    }
    const { resolve, reject } = pending.get(message.id);
    pending.delete(message.id);
    if (message.error) {
      reject(new Error(message.error.message));
    } else {
      resolve(message.result);
    }
  });

  return new Promise((resolve, reject) => {
    socket.addEventListener("open", () => {
      resolve({
        send(method, params = {}) {
          const id = nextId++;
          socket.send(JSON.stringify({ id, method, params }));
          return new Promise((commandResolve, commandReject) => {
            pending.set(id, { resolve: commandResolve, reject: commandReject });
          });
        },
        close() {
          socket.close();
        }
      });
    });
    socket.addEventListener("error", () => reject(new Error("Chrome WebSocket failed")));
  });
}

async function waitForExpression(client, expression, timeoutMs = 10000) {
  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    const result = await client.send("Runtime.evaluate", {
      expression,
      returnByValue: true,
      awaitPromise: true
    });
    if (result.result.value) {
      return;
    }
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error(`Timed out waiting for ${expression}`);
}

async function navigate(client, url, viewport) {
  await client.send("Emulation.setDeviceMetricsOverride", {
    width: viewport.width,
    height: viewport.height,
    deviceScaleFactor: 1,
    mobile: viewport.mobile
  });
  await client.send("Page.enable");
  await client.send("Page.navigate", { url });
  await waitForExpression(client, "document.readyState === 'complete'");
}

async function evaluate(client, expression) {
  const result = await client.send("Runtime.evaluate", {
    expression,
    returnByValue: true,
    awaitPromise: true
  });
  return result.result.value;
}

async function runBrowserChecks(spec) {
  const chromePath = findChrome();
  if (!chromePath) {
    fail("browser runtime", "Chrome, Chromium, or Edge was not found");
    return;
  }

  const { server, origin } = await serveStatic();
  const { chrome, userDataDir, wsPromise, exitPromise } = launchChrome(chromePath);

  try {
    const browserWs = await wsPromise;
    const pageWs = await createPage(browserWs, `${origin}/deck.html`);
    const client = await cdpClient(pageWs);

    const viewports = [
      { name: "desktop overflow", width: 1366, height: 768, mobile: false },
      { name: "mobile overflow", width: 390, height: 844, mobile: true }
    ];
    let deckNoteCount = 0;

    for (const viewport of viewports) {
      await navigate(client, `${origin}/deck.html`, viewport);
      await waitForExpression(client, "window.DECK_READY === true");
      const report = await evaluate(client, `
        (async () => {
          const issues = [];
          const tolerance = 3;
          const slides = window.DECK_API.getSlides();
          for (let index = 0; index < slides.length; index += 1) {
            window.DECK_API.goTo(index);
            await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
            const active = document.querySelector(".deck-frame.is-active .slide");
            const elements = [active, ...active.querySelectorAll("*")];
            elements.forEach((element) => {
              if (element.scrollWidth > element.clientWidth + tolerance || element.scrollHeight > element.clientHeight + tolerance) {
                issues.push({
                  slide: slides[index].id,
                  tag: element.tagName.toLowerCase(),
                  className: element.className || "",
                  scrollWidth: element.scrollWidth,
                  clientWidth: element.clientWidth,
                  scrollHeight: element.scrollHeight,
                  clientHeight: element.clientHeight
                });
              }
            });
          }
          return {
            noteCount: document.querySelectorAll("#deck .note").length,
            activeCount: document.querySelectorAll(".deck-frame.is-active").length,
            issues
          };
        })()
      `);

      if (report.issues.length) {
        fail(viewport.name, JSON.stringify(report.issues.slice(0, 5)));
      } else {
        pass(viewport.name, `${spec.slides.length} slides checked`);
      }

      deckNoteCount = Math.max(deckNoteCount, report.noteCount);
    }

    if (deckNoteCount > 0) {
      fail("deck note exposure", `${deckNoteCount} .note elements visible in deck`);
    } else {
      pass("deck note exposure", "0 .note elements in deck");
    }

    await navigate(client, `${origin}/presenter-review.html`, { width: 1280, height: 900, mobile: false });
    await waitForExpression(client, "window.PRESENTER_REVIEW_READY === true");
    const presenterReport = await evaluate(client, `
      ({
        cards: document.querySelectorAll(".review-card").length,
        scripts: Array.from(document.querySelectorAll(".presenter-script")).filter((node) => node.textContent.trim().length > 0).length
      })
    `);

    if (presenterReport.cards === spec.slides.length && presenterReport.scripts === spec.slides.length) {
      pass("presenter script", `${presenterReport.scripts} scripts visible`);
    } else {
      fail("presenter script", JSON.stringify(presenterReport));
    }

    client.close();
  } catch (error) {
    fail("browser checks", error.message);
  } finally {
    server.close();
    chrome.kill();
    await Promise.race([
      exitPromise,
      new Promise((resolve) => setTimeout(resolve, 1200))
    ]);
    fs.rmSync(userDataDir, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 });
  }
}

async function main() {
  let spec;
  try {
    spec = getSpec();
    runStaticChecks(spec);
    await runBrowserChecks(spec);
  } catch (error) {
    fail("verify-deck", error.message);
  }

  results.forEach((result) => {
    const prefix = result.ok ? "PASS" : "FAIL";
    console.log(`${prefix} ${result.name}${result.detail ? ` - ${result.detail}` : ""}`);
  });

  if (results.some((result) => !result.ok)) {
    process.exitCode = 1;
  }
}

main();
