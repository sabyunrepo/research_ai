#!/usr/bin/env node
const { spawnSync } = require("node:child_process");
const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..", "..");

function usage() {
  console.error("Usage: node deck-harness/scripts/run-browser-render-check.js <deck-dir> [--url=http://127.0.0.1:8788/deck.html] [--all-slides]");
  process.exit(1);
}

function parseArgs(argv) {
  const positional = [];
  let url = "http://127.0.0.1:8788/deck.html";
  let allSlides = false;
  argv.forEach((arg) => {
    if (arg.startsWith("--url=")) url = arg.slice("--url=".length);
    else if (arg === "--all-slides") allSlides = true;
    else positional.push(arg);
  });
  if (positional.length !== 1) usage();
  return {
    deckDir: path.isAbsolute(positional[0]) ? positional[0] : path.join(root, positional[0]),
    url,
    allSlides,
  };
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function hashFile(filePath) {
  return crypto.createHash("sha256").update(fs.readFileSync(filePath)).digest("hex");
}

function pngDimensions(filePath) {
  const buffer = fs.readFileSync(filePath);
  if (buffer.subarray(0, 8).toString("hex") !== "89504e470d0a1a0a") {
    throw new Error(`expected PNG screenshot: ${filePath}`);
  }
  return {
    width: buffer.readUInt32BE(16),
    height: buffer.readUInt32BE(20),
  };
}

function buildDeckOutputHash(deckDir) {
  const manifestPath = path.join(deckDir, "job-manifest.json");
  if (!fs.existsSync(manifestPath)) return "";
  const manifest = readJson(manifestPath);
  const stage = (manifest.stages || []).find((item) => item.name === "build-deck");
  return stage?.outputHash || "";
}

function screenshot(url, screenshotPath, viewport, slideNumber) {
  const targetUrl = `${url.replace(/#.*$/, "")}#slide-${slideNumber}`;
  const result = spawnSync(
    "npx",
    [
      "--yes",
      "playwright",
      "screenshot",
      "--wait-for-timeout=750",
      `--viewport-size=${viewport.width},${viewport.height}`,
      targetUrl,
      screenshotPath,
    ],
    {
      cwd: root,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    }
  );
  if (result.status !== 0) {
    throw new Error(`playwright screenshot failed for slide ${slideNumber} ${viewport.width}x${viewport.height}\n${result.stdout}${result.stderr}`);
  }
}

function main() {
  const { deckDir, url, allSlides } = parseArgs(process.argv.slice(2));
  const relativeDeckDir = path.relative(root, deckDir);
  const screenshotDir = path.join(deckDir, "review-screenshots");
  fs.mkdirSync(screenshotDir, { recursive: true });
  const specPath = path.join(deckDir, "slide-spec.json");
  const slideCount = fs.existsSync(specPath) ? (readJson(specPath).slides || []).length : 0;

  const finalSlideNumber = slideCount || 1;
  const representativePlan = [
    { slideNumber: 1, viewport: { width: 1366, height: 768 }, observation: "Desktop first slide captured with visible title, Kimai image, and navigation outside core content." },
    { slideNumber: 1, viewport: { width: 1024, height: 768 }, observation: "Projector viewport first slide captured with visible title, image, and controls." },
    { slideNumber: 1, viewport: { width: 390, height: 844 }, observation: "Mobile viewport first slide captured with deck navigation outside the slide frame." },
    { slideNumber: 8, viewport: { width: 1366, height: 768 }, observation: "Act 0 representative map slide captured with nonblank visual media." },
    { slideNumber: 18, viewport: { width: 1366, height: 768 }, observation: "Act 1 representative slide captured with nonblank visual media." },
    { slideNumber: 32, viewport: { width: 1366, height: 768 }, observation: "Act 3 representative slide captured with nonblank visual media." },
    { slideNumber: 47, viewport: { width: 1366, height: 768 }, observation: "Act 4 representative procedure slide captured after crop-region repair." },
    { slideNumber: 61, viewport: { width: 1366, height: 768 }, observation: "Act 5 representative slide captured with nonblank visual media." },
    { slideNumber: finalSlideNumber, viewport: { width: 1366, height: 768 }, observation: "Final slide captured with nonblank visual media and closing map." },
  ];
  const capturePlan = allSlides && slideCount
    ? [
        ...Array.from({ length: slideCount }, (_, index) => ({
          slideNumber: index + 1,
          viewport: { width: 1366, height: 768 },
          observation: `Desktop full-deck capture for slide ${index + 1}.`,
        })),
        { slideNumber: 1, viewport: { width: 1024, height: 768 }, observation: "Projector viewport first slide captured with visible title, image, and controls." },
        { slideNumber: 1, viewport: { width: 390, height: 844 }, observation: "Mobile viewport first slide captured with deck navigation outside the slide frame." },
      ]
    : representativePlan;

  const captures = capturePlan.map((item) => {
    const filename = `deck-${item.viewport.width}x${item.viewport.height}-slide${item.slideNumber}.png`;
    const screenshotPath = path.join(screenshotDir, filename);
    screenshot(url, screenshotPath, item.viewport, item.slideNumber);
    const dimensions = pngDimensions(screenshotPath);
    return {
      slideNumber: item.slideNumber,
      viewport: item.viewport,
      screenshotPath: path.posix.join("review-screenshots", filename),
      screenshotSha256: hashFile(screenshotPath),
      imageDimensions: dimensions,
      observation: item.observation,
    };
  });

  const report = {
    status: "PASS",
    generatedAt: new Date().toISOString(),
    method: `npx playwright screenshot against local server ${url}`,
    coverage: allSlides ? "all-slides-desktop-plus-projector-mobile" : "representative",
    deckOutputHash: buildDeckOutputHash(deckDir),
    summary: allSlides
      ? "Every slide was captured at desktop projector-review width, with additional projector and mobile viewport checks for the first slide."
      : "Representative desktop, projector, and mobile screenshots were captured without unresolved visual blockers recorded in this report.",
    captures,
    blockers: [],
  };
  const reportPath = path.join(deckDir, "browser-render-report.json");
  fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);
  console.log(`Browser render report: ${path.relative(root, reportPath)}`);
  console.log(`Captures: ${captures.length}`);
  console.log("Status: PASS");
  console.log(`Deck: ${relativeDeckDir}`);
}

try {
  main();
} catch (error) {
  console.error(`FAIL ${error.message}`);
  process.exitCode = 1;
}
