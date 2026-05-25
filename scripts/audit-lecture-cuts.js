#!/usr/bin/env node
const fs = require("node:fs");
const http = require("node:http");
const os = require("node:os");
const path = require("node:path");
const vm = require("node:vm");
const { execFileSync, spawn } = require("node:child_process");

const root = path.resolve(__dirname, "..");
const deckRoot = path.join(root, "lecture-cuts");
const results = [];

function record(level, name, detail = "") {
  results.push({ level, name, detail });
}

function pass(name, detail = "") {
  record("PASS", name, detail);
}

function warn(name, detail = "") {
  record("WARN", name, detail);
}

function fail(name, detail = "") {
  record("FAIL", name, detail);
}

function readDeckFile(relativePath) {
  return fs.readFileSync(path.join(deckRoot, relativePath), "utf8");
}

function deckFileExists(relativePath) {
  return fs.existsSync(path.join(deckRoot, relativePath));
}

function getSlides() {
  const code = readDeckFile("assets/slides.js");
  const context = { window: {} };
  vm.createContext(context);
  vm.runInContext(code, context, { filename: "lecture-cuts/assets/slides.js" });
  const slides = context.window.LECTURE_SLIDES;
  if (!Array.isArray(slides) || slides.length === 0) {
    throw new Error("window.LECTURE_SLIDES must be a non-empty array");
  }
  return slides.map((slide) => (typeof slide === "string" ? { file: slide } : slide));
}

function walkFiles(relativeDir) {
  const base = path.join(deckRoot, relativeDir);
  return fs.readdirSync(base, { withFileTypes: true }).flatMap((entry) => {
    const relativePath = path.join(relativeDir, entry.name);
    if (entry.isDirectory()) {
      return walkFiles(relativePath);
    }
    return relativePath;
  });
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
        target: value.split("#")[0].split("?")[0],
      });
    }
  }

  return references;
}

function parseNavTargets(html) {
  const navMatch = html.match(/<nav\b[^>]*class=["'][^"']*\bnav\b[^"']*["'][^>]*>([\s\S]*?)<\/nav>/i);
  if (!navMatch) {
    return {};
  }

  const anchors = Array.from(navMatch[1].matchAll(/<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi));
  const targets = {};
  anchors.forEach((anchor) => {
    const label = anchor[2].replace(/<[^>]+>/g, "").trim().toLowerCase();
    const href = anchor[1].split("#")[0].split("?")[0];
    if (label === "prev" || label === "previous") {
      targets.prev = href;
    } else if (label === "next") {
      targets.next = href;
    }
  });
  return targets;
}

function runStaticAudit(slides) {
  pass("slide registry", `${slides.length} slides in lecture-cuts/assets/slides.js`);

  const missingSlides = slides.map((slide) => slide.file).filter((file) => !deckFileExists(file));
  if (missingSlides.length) {
    fail("registered slide files", missingSlides.join(", "));
  } else {
    pass("registered slide files", `${slides.length} files found`);
  }

  const malformedSlides = slides
    .filter((slide) => deckFileExists(slide.file))
    .filter((slide) => !readDeckFile(slide.file).includes('class="slide"') && !readDeckFile(slide.file).includes("class='slide'"))
    .map((slide) => slide.file);
  if (malformedSlides.length) {
    fail("slide markup", malformedSlides.join(", "));
  } else {
    pass("slide markup", "all registered slide files include .slide");
  }

  const htmlAndCss = walkFiles(".").filter((file) => /\.(html|css)$/.test(file));
  const brokenLinks = [];
  htmlAndCss.forEach((file) => {
    const text = readDeckFile(file);
    extractLocalReferences(file, text).forEach((reference) => {
      const target = path.normalize(path.join(path.dirname(reference.from), reference.target));
      if (!deckFileExists(target)) {
        brokenLinks.push(`${reference.from} -> ${reference.target}`);
      }
    });
  });

  if (brokenLinks.length) {
    fail("local references", brokenLinks.slice(0, 20).join("; "));
  } else {
    pass("local references", "0 broken local links/assets");
  }

  const noSpeaker = slides.filter((slide) => !slide.speaker).map((slide) => slide.file);
  if (noSpeaker.length) {
    warn("slides without inline speaker script", `${noSpeaker.length}: ${noSpeaker.slice(0, 25).join(", ")}`);
  } else {
    pass("slides without inline speaker script", "0");
  }

  const navMismatches = [];
  slides.forEach((slide, index) => {
    if (!deckFileExists(slide.file)) {
      return;
    }
    const nav = parseNavTargets(readDeckFile(slide.file));
    const expectedPrev = index > 0 ? slides[index - 1].file : undefined;
    const expectedNext = index < slides.length - 1 ? slides[index + 1].file : undefined;
    if (nav.prev && expectedPrev && nav.prev !== expectedPrev) {
      navMismatches.push(`${slide.file} prev=${nav.prev} expected=${expectedPrev}`);
    }
    if (nav.next && expectedNext && nav.next !== expectedNext) {
      navMismatches.push(`${slide.file} next=${nav.next} expected=${expectedNext}`);
    }
  });

  if (navMismatches.length) {
    warn("standalone nav order", navMismatches.slice(0, 20).join("; "));
  } else {
    pass("standalone nav order", "standalone Prev/Next links match registry where present");
  }
}

function runReproductionContractAudit() {
  try {
    const output = execFileSync(process.execPath, [path.join(root, "scripts", "validate-lecture-cuts-contract.js")], {
      cwd: root,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    });
    pass("reproduction contract", "slide-spec.json matches the current lecture-cuts deck");

    const sourceWarnings = output
      .split("\n")
      .filter((line) => line.startsWith("WARN source coverage"))
      .join("; ");
    if (sourceWarnings) {
      warn("source coverage", sourceWarnings.replace(/^WARN source coverage - /, ""));
    }
  } catch (error) {
    const detail = [error.stdout, error.stderr, error.message].filter(Boolean).join("\n").trim();
    fail("reproduction contract", detail);
  }
}

function findChrome() {
  return [
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Chromium.app/Contents/MacOS/Chromium",
    "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
  ].find((candidate) => fs.existsSync(candidate));
}

function serveStatic() {
  const server = http.createServer((request, response) => {
    const url = new URL(request.url, "http://127.0.0.1");
    const requested = decodeURIComponent(url.pathname) === "/" ? "/deck.html" : decodeURIComponent(url.pathname);
    const filePath = path.normalize(path.join(deckRoot, requested));

    if (filePath !== deckRoot && !filePath.startsWith(`${deckRoot}${path.sep}`)) {
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
      const contentType = {
        ".html": "text/html; charset=utf-8",
        ".css": "text/css; charset=utf-8",
        ".js": "text/javascript; charset=utf-8",
        ".json": "application/json; charset=utf-8",
        ".png": "image/png",
      }[path.extname(filePath)] || "application/octet-stream";
      response.writeHead(200, { "content-type": contentType });
      response.end(body);
    });
  });

  return new Promise((resolve) => {
    server.listen(0, "127.0.0.1", () => {
      resolve({ server, origin: `http://127.0.0.1:${server.address().port}` });
    });
  });
}

function launchChrome(chromePath) {
  const userDataDir = fs.mkdtempSync(path.join(os.tmpdir(), "lecture-cuts-audit-"));
  const chrome = spawn(chromePath, [
    "--headless=new",
    "--disable-gpu",
    "--disable-dev-shm-usage",
    "--no-first-run",
    "--no-default-browser-check",
    "--remote-debugging-port=0",
    `--user-data-dir=${userDataDir}`,
    "about:blank",
  ], { stdio: ["ignore", "ignore", "pipe"] });

  const exitPromise = new Promise((resolve) => chrome.once("exit", resolve));
  const wsPromise = new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("Chrome did not expose a DevTools endpoint")), 10000);
    chrome.stderr.on("data", (chunk) => {
      const match = chunk.toString().match(/DevTools listening on (ws:\/\/[^\s]+)/);
      if (match) {
        clearTimeout(timer);
        resolve(match[1]);
      }
    });
    chrome.on("exit", (code) => reject(new Error(`Chrome exited early with code ${code}`)));
  });

  return { chrome, userDataDir, wsPromise, exitPromise };
}

async function createPage(browserWs, url) {
  const endpoint = new URL(browserWs);
  const response = await fetch(`http://${endpoint.host}/json/new?${encodeURIComponent(url)}`, { method: "PUT" });
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
        },
      });
    });
    socket.addEventListener("error", () => reject(new Error("Chrome WebSocket failed")));
  });
}

async function evaluate(client, expression) {
  const result = await client.send("Runtime.evaluate", {
    expression,
    returnByValue: true,
    awaitPromise: true,
  });
  return result.result.value;
}

async function waitFor(client, expression, timeoutMs = 10000) {
  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    if (await evaluate(client, expression)) {
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
    mobile: viewport.mobile,
  });
  await client.send("Page.enable");
  await client.send("Page.navigate", { url });
  await waitFor(client, "document.readyState === 'complete'");
}

async function runBrowserAudit(slides) {
  const chromePath = findChrome();
  if (!chromePath) {
    warn("browser runtime", "Chrome, Chromium, or Edge was not found");
    return;
  }

  const { server, origin } = await serveStatic();
  const { chrome, userDataDir, wsPromise, exitPromise } = launchChrome(chromePath);

  try {
    const browserWs = await wsPromise;
    const pageWs = await createPage(browserWs, `${origin}/deck.html`);
    const client = await cdpClient(pageWs);

    for (const viewport of [
      { name: "projector render", width: 1280, height: 720, mobile: false, requireViewportFit: true },
      { name: "desktop render", width: 1366, height: 768, mobile: false },
      { name: "mobile render", width: 390, height: 844, mobile: true },
    ]) {
      await navigate(client, `${origin}/deck.html`, viewport);
      await waitFor(client, `document.querySelectorAll(".deck-frame").length === ${slides.length}`);
      const report = await evaluate(client, `
        (async () => {
          const issues = [];
          const viewportIssues = [];
          const imageIssues = [];
          const tolerance = 3;
          for (let index = 0; index < window.LECTURE_SLIDES.length; index += 1) {
            window.setActiveSlide(index, { updateHash: false });
            await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
            const activeFrame = document.querySelector(".deck-frame.is-active");
            const activeSlide = activeFrame?.querySelector(".slide");
            if (!activeFrame || !activeSlide) {
              issues.push({ slide: index + 1, reason: "missing active slide" });
              continue;
            }
            const frameRect = activeFrame.getBoundingClientRect();
            if (frameRect.bottom > window.innerHeight + tolerance || frameRect.top < -tolerance) {
              viewportIssues.push({
                slide: window.LECTURE_SLIDES[index].file,
                top: Math.round(frameRect.top),
                bottom: Math.round(frameRect.bottom),
                viewportHeight: window.innerHeight
              });
            }
            [activeSlide, ...activeSlide.querySelectorAll("*")].forEach((element) => {
              if (element.scrollWidth > element.clientWidth + tolerance || element.scrollHeight > element.clientHeight + tolerance) {
                issues.push({
                  slide: window.LECTURE_SLIDES[index].file,
                  tag: element.tagName.toLowerCase(),
                  className: String(element.className || ""),
                  scrollWidth: element.scrollWidth,
                  clientWidth: element.clientWidth,
                  scrollHeight: element.scrollHeight,
                  clientHeight: element.clientHeight
                });
              }
            });
            activeSlide.querySelectorAll("img").forEach((image) => {
              if (!image.complete || image.naturalWidth === 0) {
                imageIssues.push({ slide: window.LECTURE_SLIDES[index].file, src: image.getAttribute("src") });
              }
            });
          }
          return {
            frameCount: document.querySelectorAll(".deck-frame").length,
            noteCount: document.querySelectorAll("#deck .note").length,
            errors: Array.from(document.querySelectorAll(".deck-error")).map((node) => node.textContent.trim()),
            issues,
            viewportIssues,
            imageIssues
          };
        })()
      `);

      if (report.errors.length) {
        fail(`${viewport.name} errors`, report.errors.join("; "));
      } else {
        pass(`${viewport.name} load`, `${report.frameCount} frames loaded`);
      }

      if (report.noteCount > 0) {
        fail(`${viewport.name} note exposure`, `${report.noteCount} .note elements exposed`);
      } else {
        pass(`${viewport.name} note exposure`, "0 .note elements in deck");
      }

      if (report.imageIssues.length) {
        fail(`${viewport.name} images`, JSON.stringify(report.imageIssues.slice(0, 10)));
      } else {
        pass(`${viewport.name} images`, "all visible slide images loaded");
      }

      if (viewport.requireViewportFit) {
        if (report.viewportIssues.length) {
          fail("projector viewport fit", JSON.stringify(report.viewportIssues.slice(0, 20)));
        } else {
          pass("projector viewport fit", `${slides.length} slides checked`);
        }
      }

      if (report.issues.length) {
        warn(`${viewport.name} overflow`, JSON.stringify(report.issues.slice(0, 20)));
      } else {
        pass(`${viewport.name} overflow`, `${slides.length} slides checked`);
      }
    }

    await navigate(client, `${origin}/presenter-review.html`, { width: 1280, height: 900, mobile: false });
    await waitFor(client, `document.querySelectorAll(".review-cut").length === ${slides.length}`);
    const presenterReport = await evaluate(client, `
      ({
        cuts: document.querySelectorAll(".review-cut").length,
        placeholders: Array.from(document.querySelectorAll(".review-script-body"))
          .filter((node) => node.textContent.includes("등록된 스크립트가 없습니다."))
          .map((node) => node.closest(".review-cut")?.querySelector(".deck-frame")?.dataset.source || "unknown")
      })
    `);

    if (presenterReport.placeholders.length) {
      warn("presenter scripts", `${presenterReport.placeholders.length} placeholder scripts: ${presenterReport.placeholders.slice(0, 25).join(", ")}`);
    } else {
      pass("presenter scripts", `${presenterReport.cuts} review scripts resolved`);
    }

    client.close();
  } catch (error) {
    fail("browser audit", error.message);
  } finally {
    server.close();
    chrome.kill();
    await Promise.race([exitPromise, new Promise((resolve) => setTimeout(resolve, 1200))]);
    fs.rmSync(userDataDir, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 });
  }
}

async function main() {
  try {
    const slides = getSlides();
    runStaticAudit(slides);
    runReproductionContractAudit();
    await runBrowserAudit(slides);
  } catch (error) {
    fail("audit", error.message);
  }

  results.forEach((result) => {
    console.log(`${result.level} ${result.name}${result.detail ? ` - ${result.detail}` : ""}`);
  });

  if (results.some((result) => result.level === "FAIL")) {
    process.exitCode = 1;
  }
}

main();
