#!/usr/bin/env node
const { spawnSync } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..", "..");

function usage() {
  console.error("Usage: node deck-harness/scripts/export-deck-pdf.js <deck-dir> [output.pdf]");
  process.exit(1);
}

function resolveDeckDir(input) {
  if (!input) usage();
  return path.isAbsolute(input) ? input : path.join(root, input);
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function findChrome() {
  const candidates = [
    process.env.CHROME_BIN,
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Chromium.app/Contents/MacOS/Chromium",
    "/usr/bin/google-chrome",
    "/usr/bin/chromium",
    "/usr/bin/chromium-browser",
  ].filter(Boolean);
  return candidates.find((candidate) => fs.existsSync(candidate));
}

function extractMain(html, file) {
  const match = html.match(/<main\b[\s\S]*?<\/main>/);
  if (!match) throw new Error(`missing slide main in ${file}`);
  return match[0]
    .replaceAll('src="../assets/', 'src="assets/')
    .replaceAll('href="../assets/', 'href="assets/');
}

function main() {
  const deckDir = resolveDeckDir(process.argv[2]);
  const outputPath = process.argv[3]
    ? path.resolve(root, process.argv[3])
    : path.join(deckDir, "kimai-workshop-content-slides.pdf");
  const specPath = path.join(deckDir, "slide-spec.json");
  const spec = JSON.parse(fs.readFileSync(specPath, "utf8"));
  const slides = spec.slides || [];
  if (!slides.length) throw new Error("slide-spec.json has no slides");

  const pages = slides.map((slide, index) => {
    const slidePath = path.join(deckDir, "slides", `${slide.id}.html`);
    const slideHtml = extractMain(fs.readFileSync(slidePath, "utf8"), path.relative(root, slidePath));
    return `<section class="print-page" aria-label="Slide ${index + 1}: ${escapeHtml(slide.title || slide.id)}">${slideHtml}</section>`;
  });

  const printHtmlPath = path.join(deckDir, "deck-print.html");
  const html = `<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(spec.title || "Generated Deck")} PDF Export</title>
  <link rel="stylesheet" href="assets/style.css">
  <style>
    @page { size: 16in 9in; margin: 0; }
    * { box-sizing: border-box; }
    html, body { margin: 0; padding: 0; background: #fff; }
    .print-page {
      width: 16in;
      height: 9in;
      margin: 0;
      overflow: hidden;
      page-break-after: always;
      break-after: page;
      background: #fff;
    }
    .print-page:last-child {
      page-break-after: auto;
      break-after: auto;
    }
    .print-page > .slide {
      width: 100%;
      height: 100%;
      animation: none !important;
      transition: none !important;
    }
  </style>
</head>
<body>
${pages.join("\n")}
</body>
</html>
`;
  fs.writeFileSync(printHtmlPath, html);

  const chrome = findChrome();
  if (!chrome) throw new Error("Chrome/Chromium binary not found. Set CHROME_BIN.");
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  const result = spawnSync(chrome, [
    "--headless=new",
    "--disable-gpu",
    "--no-pdf-header-footer",
    `--print-to-pdf=${outputPath}`,
    `file://${printHtmlPath}`,
  ], {
    cwd: root,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
  if (result.status !== 0) {
    throw new Error(`Chrome PDF export failed\n${result.stdout}${result.stderr}`);
  }
  console.log(`Print HTML: ${path.relative(root, printHtmlPath)}`);
  console.log(`PDF: ${path.relative(root, outputPath)}`);
  console.log(`Slides: ${slides.length}`);
}

try {
  main();
} catch (error) {
  console.error(`FAIL ${error.message}`);
  process.exitCode = 1;
}
