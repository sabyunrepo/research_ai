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

function extractMain(html, file) {
  const match = html.match(/<main\b[\s\S]*?<\/main>/);
  if (!match) throw new Error(`missing slide main in ${file}`);
  return match[0]
    .replaceAll('src="../assets/', 'src="assets/')
    .replaceAll('href="../assets/', 'href="assets/');
}

function createPdfWithPlaywright({ printHtmlPath, outputPath }) {
  const exporterCode = `
const { chromium } = require("playwright");

(async () => {
  const [url, outputPath] = process.argv.slice(1);
  let browser;
  try {
    browser = await chromium.launch({ channel: "chrome", headless: true });
  } catch {
    browser = await chromium.launch({ headless: true });
  }
  const page = await browser.newPage({ viewport: { width: 1600, height: 900 } });
  await page.goto(url, { waitUntil: "networkidle" });
  await page.emulateMedia({ media: "screen" });
  await page.evaluate(() => document.fonts ? document.fonts.ready : undefined);
  await page.pdf({
    path: outputPath,
    width: "16in",
    height: "9in",
    margin: { top: "0", right: "0", bottom: "0", left: "0" },
    displayHeaderFooter: false,
    preferCSSPageSize: true,
    printBackground: true,
  });
  await browser.close();
})().catch(async (error) => {
  console.error(error && error.stack ? error.stack : error);
  process.exit(1);
});
`;
  const result = spawnSync("npm", [
    "exec",
    "--yes",
    "--package=playwright",
    "--",
    "sh",
    "-c",
    "NODE_PATH=$(dirname $(dirname $(which playwright))) node -e \"$PDF_EXPORT_CODE\" \"$1\" \"$2\"",
    "playwright-pdf-export",
    `file://${printHtmlPath}`,
    outputPath,
  ], {
    cwd: root,
    encoding: "utf8",
    env: {
      ...process.env,
      PDF_EXPORT_CODE: exporterCode,
    },
    stdio: ["ignore", "pipe", "pipe"],
  });
  if (result.status !== 0) {
    throw new Error(`Playwright PDF export failed\n${result.stdout}${result.stderr}`);
  }
}

function main() {
  const deckDir = resolveDeckDir(process.argv[2]);
  const outputPath = process.argv[3]
    ? path.resolve(root, process.argv[3])
    : path.join(deckDir, "kimai-workshop-content-slides.pdf");
  const specPath = path.join(deckDir, "slide-spec.json");
  const spec = JSON.parse(fs.readFileSync(specPath, "utf8"));
  const deckCssPath = path.join(deckDir, "assets", "style.css");
  const deckCss = fs.readFileSync(deckCssPath, "utf8");
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
  <style>
${deckCss}
    @page { size: 16in 9in; margin: 0; }
    * { box-sizing: border-box; }
    html, body {
      margin: 0;
      padding: 0;
      background: #fff;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    * {
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
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

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  createPdfWithPlaywright({ printHtmlPath, outputPath });
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
