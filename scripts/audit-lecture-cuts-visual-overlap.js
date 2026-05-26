#!/usr/bin/env node
const fs = require("node:fs");
const http = require("node:http");
const path = require("node:path");
const vm = require("node:vm");

const { chromium } = require("playwright");
const sharp = require("sharp");

const root = path.resolve(__dirname, "..");
const deckRoot = path.join(root, "lecture-cuts");
const outRoot = path.join(root, "docs", "audits", "visual-overlap");
const screenshotDir = path.join(outRoot, "screenshots");
const sheetDir = path.join(outRoot, "contact-sheets");
const reportPath = path.join(outRoot, "visual-overlap-report.json");
const useFileUrl = process.argv.includes("--file-url");
const normalMode = process.argv.includes("--normal");
const viewportArg = process.argv.find((arg) => arg.startsWith("--viewport="));
const settleArg = process.argv.find((arg) => arg.startsWith("--settle-ms="));
const slidesArg = process.argv.find((arg) => arg.startsWith("--slides="));
const viewportMatch = viewportArg?.match(/^--viewport=(\d+)x(\d+)$/);
const settleMs = settleArg ? Number(settleArg.replace("--settle-ms=", "")) : 1800;
const requestedSlideNumbers = slidesArg
  ? new Set(slidesArg.replace("--slides=", "").split(",").map((value) => Number(value.trim())).filter(Number.isInteger))
  : null;
const viewport = viewportMatch
  ? { width: Number(viewportMatch[1]), height: Number(viewportMatch[2]) }
  : { width: 1920, height: 1080 };

function read(relativePath) {
  return fs.readFileSync(path.join(deckRoot, relativePath), "utf8");
}

function getSlides() {
  const context = { window: {} };
  vm.createContext(context);
  vm.runInContext(read("assets/slides.js"), context, { filename: "lecture-cuts/assets/slides.js" });
  return context.window.LECTURE_SLIDES.map((slide) => (typeof slide === "string" ? { file: slide } : slide));
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
    server.listen(0, "127.0.0.1", () => resolve({ server, origin: `http://127.0.0.1:${server.address().port}` }));
  });
}

function area(rect) {
  return Math.max(0, rect.width) * Math.max(0, rect.height);
}

function intersection(a, b) {
  const left = Math.max(a.left, b.left);
  const right = Math.min(a.right, b.right);
  const top = Math.max(a.top, b.top);
  const bottom = Math.min(a.bottom, b.bottom);
  const width = Math.max(0, right - left);
  const height = Math.max(0, bottom - top);
  return { left, top, right, bottom, width, height, area: width * height };
}

async function collectSlideIssues(page, slideIndex) {
  return page.evaluate(
    async ({ slideIndex, normalMode, settleMs }) => {
      window.setActiveSlide(slideIndex, { updateHash: false });
      if (!normalMode) {
        document.body.classList.add("is-presenting");
      }
      await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      await document.fonts?.ready;
      await Promise.all(Array.from(document.images).map((image) => {
        if (image.complete && image.naturalWidth > 0) return Promise.resolve();
        return new Promise((resolve) => {
          image.addEventListener("load", resolve, { once: true });
          image.addEventListener("error", resolve, { once: true });
        });
      }));
      await new Promise((resolve) => setTimeout(resolve, settleMs));

      const activeFrame = document.querySelector(".deck-frame.is-active");
      const slide = activeFrame?.querySelector(".slide");
      const slideInfo = window.LECTURE_SLIDES[slideIndex];
      const frameRect = activeFrame?.getBoundingClientRect();
      const issues = [];
      const candidates = [];

      if (!activeFrame || !slide || !frameRect) {
        return { slide: slideIndex + 1, file: slideInfo?.file, issues: [{ type: "missing-frame" }], candidates: [] };
      }

      const selector = [
        ".copy",
        ".slide-media",
        "h1",
        "h2",
        ".subtitle",
        ".one-liner",
        ".bullets",
        ".bullets li",
        "pre",
        "code",
        ".css-visual",
        ".code-card",
        ".compare-card",
        ".persona-card",
        ".prompt-card",
        ".flow-step",
        ".matrix-cell",
        ".expand-card",
        ".workbench-card",
        ".eval-gate",
        ".gate-row",
        ".gate-lock",
        ".handoff-session",
        ".handoff-file",
        ".evidence-window",
        ".artifact-window",
        ".deck-section-label",
        ".deck-slide-number"
      ].join(",");

      const elements = Array.from(activeFrame.querySelectorAll(selector))
        .filter((element) => {
          const style = getComputedStyle(element);
          const rect = element.getBoundingClientRect();
          return style.display !== "none" && style.visibility !== "hidden" && rect.width > 4 && rect.height > 4;
        })
        .map((element, index) => {
          const rect = element.getBoundingClientRect();
          return {
            index,
            tag: element.tagName.toLowerCase(),
            className: String(element.className || ""),
            text: element.textContent.replace(/\s+/g, " ").trim().slice(0, 90),
            left: rect.left,
            top: rect.top,
            right: rect.right,
            bottom: rect.bottom,
            width: rect.width,
            height: rect.height,
            scrollWidth: element.scrollWidth,
            clientWidth: element.clientWidth,
            scrollHeight: element.scrollHeight,
            clientHeight: element.clientHeight,
          };
        });

      elements.forEach((element) => {
        const overflowX = element.scrollWidth - element.clientWidth;
        const overflowY = element.scrollHeight - element.clientHeight;
        if (overflowX > 8 || overflowY > 8) {
          issues.push({
            type: "scroll-overflow",
            element: `${element.tag}.${element.className}`,
            text: element.text,
            overflowX,
            overflowY,
          });
        }
        if (
          element.left < frameRect.left - 2 ||
          element.right > frameRect.right + 2 ||
          element.top < frameRect.top - 2 ||
          element.bottom > frameRect.bottom + 2
        ) {
          issues.push({
            type: "outside-frame",
            element: `${element.tag}.${element.className}`,
            text: element.text,
            rect: {
              left: Math.round(element.left - frameRect.left),
              top: Math.round(element.top - frameRect.top),
              right: Math.round(element.right - frameRect.left),
              bottom: Math.round(element.bottom - frameRect.top),
            },
          });
        }
      });

      for (let i = 0; i < elements.length; i += 1) {
        for (let j = i + 1; j < elements.length; j += 1) {
          const a = elements[i];
          const b = elements[j];
          const aContainsB = a.left <= b.left && a.right >= b.right && a.top <= b.top && a.bottom >= b.bottom;
          const bContainsA = b.left <= a.left && b.right >= a.right && b.top <= a.top && b.bottom >= a.bottom;
          const sameColumnParentChild =
            aContainsB ||
            bContainsA ||
            a.className.includes("bullets") ||
            b.className.includes("bullets") ||
            a.className.includes("copy") ||
            b.className.includes("copy") ||
            a.className.includes("slide-media") ||
            b.className.includes("slide-media") ||
            a.className.includes("css-visual") ||
            b.className.includes("css-visual");
          if (sameColumnParentChild) {
            continue;
          }

          const left = Math.max(a.left, b.left);
          const right = Math.min(a.right, b.right);
          const top = Math.max(a.top, b.top);
          const bottom = Math.min(a.bottom, b.bottom);
          const overlapArea = Math.max(0, right - left) * Math.max(0, bottom - top);
          if (overlapArea > 120) {
            candidates.push({
              a: `${a.tag}.${a.className}`,
              b: `${b.tag}.${b.className}`,
              aText: a.text,
              bText: b.text,
              overlapArea: Math.round(overlapArea),
            });
          }
        }
      }

      return {
        slide: slideIndex + 1,
        file: slideInfo.file,
        title: slideInfo.reviewTitle || slideInfo.file,
        issues,
        candidates: candidates.slice(0, 20),
      };
    },
    { slideIndex, normalMode, settleMs },
  );
}

async function makeContactSheets(slides) {
  fs.mkdirSync(sheetDir, { recursive: true });
  const thumbWidth = 384;
  const thumbHeight = 216;
  const labelHeight = 34;
  const gap = 16;
  const cols = 4;
  const rows = 5;
  const pageSize = cols * rows;
  const sheetPaths = [];

  for (let start = 0; start < slides.length; start += pageSize) {
    const subset = slides.slice(start, start + pageSize);
    const width = cols * thumbWidth + (cols + 1) * gap;
    const height = rows * (thumbHeight + labelHeight) + (rows + 1) * gap;
    const composites = [];

    for (let index = 0; index < subset.length; index += 1) {
      const slide = subset[index];
      const absoluteIndex = slide.number ?? start + index + 1;
      const x = gap + (index % cols) * (thumbWidth + gap);
      const y = gap + Math.floor(index / cols) * (thumbHeight + labelHeight + gap);
      const screenshotPath = path.join(screenshotDir, `${String(absoluteIndex).padStart(2, "0")}-${slide.file}.png`);
      const thumb = await sharp(screenshotPath).resize(thumbWidth, thumbHeight, { fit: "contain", background: "#111111" }).png().toBuffer();
      const label = Buffer.from(`
        <svg width="${thumbWidth}" height="${labelHeight}" xmlns="http://www.w3.org/2000/svg">
          <rect width="100%" height="100%" fill="#ffffff"/>
          <text x="8" y="22" font-family="Arial, sans-serif" font-size="15" font-weight="700" fill="#111111">
            ${absoluteIndex}. ${slide.file.replace(/&/g, "&amp;")}
          </text>
        </svg>
      `);
      composites.push({ input: thumb, left: x, top: y });
      composites.push({ input: label, left: x, top: y + thumbHeight });
    }

    const firstNumber = subset[0]?.number ?? start + 1;
    const lastNumber = subset[subset.length - 1]?.number ?? start + subset.length;
    const sheetPath = path.join(sheetDir, `slides-${String(firstNumber).padStart(2, "0")}-${String(lastNumber).padStart(2, "0")}.png`);
    await sharp({
      create: {
        width,
        height,
        channels: 4,
        background: "#e8e8e8",
      },
    }).composite(composites).png().toFile(sheetPath);
    sheetPaths.push(sheetPath);
  }

  return sheetPaths;
}

async function main() {
  fs.rmSync(outRoot, { recursive: true, force: true });
  fs.mkdirSync(screenshotDir, { recursive: true });

  const slides = getSlides();
  const served = useFileUrl ? null : await serveStatic();
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport, deviceScaleFactor: 1 });
  const report = [];
  const targets = slides
    .map((slide, index) => ({ ...slide, index, number: index + 1 }))
    .filter((slide) => !requestedSlideNumbers || requestedSlideNumbers.has(slide.number));

  try {
    const deckUrl = useFileUrl ? `file://${path.join(deckRoot, "deck.html")}` : `${served.origin}/deck.html`;
    await page.goto(deckUrl, { waitUntil: "networkidle" });
    await page.waitForFunction((count) => document.querySelectorAll(".deck-frame").length === count, slides.length);

    for (const target of targets) {
      const result = await collectSlideIssues(page, target.index);
      report.push(result);
      const frame = page.locator(".deck-frame.is-active");
      await frame.screenshot({
        path: path.join(screenshotDir, `${String(target.number).padStart(2, "0")}-${target.file}.png`),
      });
    }
  } finally {
    await browser.close();
    served?.server.close();
  }

  const sheetPaths = await makeContactSheets(targets);
  fs.writeFileSync(reportPath, JSON.stringify({ generatedAt: new Date().toISOString(), slides: report, sheetPaths }, null, 2));

  const issueSlides = report.filter((slide) => slide.issues.length || slide.candidates.length);
  console.log(`Wrote ${reportPath}`);
  console.log(`Wrote ${sheetPaths.length} contact sheets under ${sheetDir}`);
  console.log(`Candidate slides: ${issueSlides.length}`);
  issueSlides.slice(0, 40).forEach((slide) => {
    console.log(`${slide.slide}. ${slide.file} issues=${slide.issues.length} candidates=${slide.candidates.length}`);
  });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
