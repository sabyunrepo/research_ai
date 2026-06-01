#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.resolve(__dirname, "..", "..");
const imagePreferredTemplates = new Set(["assertion-scene", "term-bridge", "workflow-strip"]);

function usage() {
  console.error("Usage: node deck-harness/scripts/verify-template-component-fit.js <deck-dir>");
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function visibleHtml(html) {
  return html
    .replace(/<div class="source-anchor-parity" hidden>[\s\S]*?<\/div>/g, "")
    .replace(/<script[\s\S]*?<\/script>/g, "")
    .replace(/<style[\s\S]*?<\/style>/g, "");
}

function plainText(html) {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, "\"")
    .replace(/\s+/g, " ")
    .trim();
}

function mediaHtml(html) {
  const match = html.match(/<section class="slide-media"[\s\S]*?<\/section>\s*<\/main>/);
  return match ? match[0] : html;
}

function loadRegistry(deckDir) {
  const registryPath = path.join(deckDir, "assets", "slides.js");
  if (!fs.existsSync(registryPath)) return new Map();
  const context = { window: {} };
  vm.createContext(context);
  vm.runInContext(fs.readFileSync(registryPath, "utf8"), context, { filename: registryPath });
  return new Map((context.window.DECK_SLIDES || []).map((slide) => [slide.id, slide]));
}

function main() {
  const deckDir = process.argv[2] ? path.resolve(root, process.argv[2]) : "";
  if (!deckDir) {
    usage();
    process.exit(2);
  }
  const spec = readJson(path.join(deckDir, "slide-spec.json"));
  const css = fs.readFileSync(path.join(deckDir, "assets", "style.css"), "utf8");
  const failures = [];
  const warnings = [];
  const existingImageSlides = [];
  const registry = loadRegistry(deckDir);

  if (/text-overflow\s*:\s*ellipsis|-webkit-line-clamp|line-clamp\s*:/.test(css)) {
    failures.push("template CSS must not hide visible component text with ellipsis or line-clamp");
  }
  if (!css.includes(".lc-evidence-tags")) {
    failures.push("assertion-scene visual must group evidence labels in .lc-evidence-tags");
  }
  if (!/\.lc-handoff-bridge-visual section span,\s*[\s\S]*?\.lc-handoff-bridge-visual section em/.test(css)) {
    failures.push("term-bridge visual must style bridge span/em labels together for wrapping");
  }

  for (const [index, slide] of (spec.slides || []).entries()) {
    const slideNumber = index + 1;
    const htmlPath = path.join(deckDir, "slides", `${slide.id}.html`);
    if (!fs.existsSync(htmlPath)) {
      failures.push(`${slideNumber}:${slide.id} rendered HTML missing`);
      continue;
    }
    const html = visibleHtml(fs.readFileSync(htmlPath, "utf8"));
    const visualHtml = mediaHtml(html);
    const text = plainText(visualHtml);
    const registered = registry.get(slide.id);
    const renderContract = registered?.visualRenderContract || {};
    const renderKind = renderContract.renderKind || "";
    const imagePreferred = imagePreferredTemplates.has(slide.mainTemplate);
    if (/\.\.\.|…/.test(text)) {
      failures.push(`${slideNumber}:${slide.id} visible slide text contains ellipsis/truncation marker`);
    }
    if (imagePreferred && renderKind === "image-asset") {
      if (!registered?.renderedVisualAsset || !visualHtml.includes("<img ")) {
        failures.push(`${slideNumber}:${slide.id} image-preferred template must render an image asset`);
      }
      if (registered?.assetCrop || registered?.sourceAssetId) {
        failures.push(`${slideNumber}:${slide.id} image-preferred template must use a standalone image, not crop metadata`);
      }
    }
    if (slide.mainTemplate === "assertion-scene" && renderKind !== "image-asset") {
      if (!html.includes("lc-evidence-tags")) failures.push(`${slideNumber}:${slide.id} assertion-scene missing evidence tag row`);
      if (/신입은 한 번에 완|빠진 내용잘못|기준어색/.test(text)) {
        failures.push(`${slideNumber}:${slide.id} assertion-scene has clipped or concatenated evidence copy`);
      }
    }
    if (slide.mainTemplate === "term-bridge" && renderKind !== "image-asset") {
      if (/김아이의 업무 환경\.\.\.|Harness En\.\.\.|Engineering로|설계을/.test(text)) {
        failures.push(`${slideNumber}:${slide.id} term-bridge has clipped or awkward bridge copy: ${text.slice(0, 160)}`);
      }
    }
    if (["opening-hero", "single-concept", "assertion-scene", "term-bridge", "workflow-strip", "decision-gate", "brief-window", "practice-handoff", "recap-map"].includes(slide.mainTemplate)) {
      const cssTemplateExpected = !imagePreferred || renderKind !== "image-asset";
      if (cssTemplateExpected && registered?.renderedVisualAsset) {
        failures.push(`${slideNumber}:${slide.id} css-template slide must not advertise an image renderedVisualAsset`);
      }
      if (cssTemplateExpected && renderKind !== "css-template-component") {
        failures.push(`${slideNumber}:${slide.id} css-template slide missing visualRenderContract.renderKind=css-template-component`);
      }
    }
    if (renderContract.usesExistingImage && renderContract.projectedImage) {
      existingImageSlides.push(`${slideNumber}:${slide.id}:${slide.visualAssetId || "no-asset-id"}`);
    }
  }

  if (existingImageSlides.length) {
    warnings.push(`projected existing-image contract still present on ${existingImageSlides.length} slides; examples: ${existingImageSlides.slice(0, 5).join(", ")}`);
  }

  if (failures.length) {
    console.error(["FAIL template component fit", ...failures, ...warnings.map((warning) => `WARN ${warning}`)].join("\n"));
    process.exit(1);
  }
  warnings.forEach((warning) => console.log(`WARN ${warning}`));
  console.log(`PASS template component fit: ${spec.slides.length} slides`);
}

try {
  main();
} catch (error) {
  console.error(`FAIL template component fit: ${error.message}`);
  process.exit(1);
}
