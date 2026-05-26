#!/usr/bin/env node
const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = path.resolve(__dirname, "..");
const deckRoot = path.join(root, "lecture-cuts");
const specPath = path.join(deckRoot, "slide-spec.json");
const registryPath = path.join(deckRoot, "assets", "slides.js");
const slideHtmlCachePath = path.join(deckRoot, "assets", "slide-html.js");
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

function readText(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

function sha256(text) {
  return `sha256:${crypto.createHash("sha256").update(text).digest("hex")}`;
}

function loadSlides() {
  const code = readText(registryPath);
  const context = { window: {} };
  vm.createContext(context);
  vm.runInContext(code, context, { filename: "lecture-cuts/assets/slides.js" });
  const slides = context.window.LECTURE_SLIDES;
  if (!Array.isArray(slides) || slides.length === 0) {
    throw new Error("window.LECTURE_SLIDES must be a non-empty array");
  }
  return slides.map((slide) => (typeof slide === "string" ? { file: slide } : slide));
}

function loadSlideHtmlCache() {
  if (!fs.existsSync(slideHtmlCachePath)) {
    fail("slide html cache", "lecture-cuts/assets/slide-html.js is missing");
    return null;
  }
  try {
    const context = { window: {} };
    vm.createContext(context);
    vm.runInContext(readText(slideHtmlCachePath), context, { filename: "lecture-cuts/assets/slide-html.js" });
    const cache = context.window.LECTURE_SLIDE_HTML;
    if (!cache || typeof cache !== "object" || Array.isArray(cache)) {
      fail("slide html cache", "window.LECTURE_SLIDE_HTML must be an object");
      return null;
    }
    return cache;
  } catch (error) {
    fail("slide html cache", error.message);
    return null;
  }
}

function extractMainSlideHtml(html) {
  const match = html.match(/<main\b[^>]*class=["'][^"']*\bslide\b[^"']*["'][^>]*>[\s\S]*?<\/main>/i);
  if (!match) {
    throw new Error("missing <main class=\"slide\">");
  }
  return match[0];
}

function loadSpec() {
  if (!fs.existsSync(specPath)) {
    fail("contract file", "lecture-cuts/slide-spec.json is missing");
    return null;
  }
  try {
    const spec = JSON.parse(readText(specPath));
    if (!Array.isArray(spec.slides)) {
      fail("contract shape", "slide-spec.json must contain slides[]");
      return null;
    }
    return spec;
  } catch (error) {
    fail("contract json", error.message);
    return null;
  }
}

function checkCount(registrySlides, contractSlides) {
  if (registrySlides.length !== contractSlides.length) {
    fail("contract slide count", `registry=${registrySlides.length} contract=${contractSlides.length}`);
    return;
  }
  pass("contract slide count", `${registrySlides.length}`);
}

function checkOrder(registrySlides, contractSlides) {
  const mismatches = [];
  registrySlides.forEach((slide, index) => {
    const contractSlide = contractSlides[index];
    if (!contractSlide || contractSlide.file !== slide.file) {
      mismatches.push(`#${index + 1} registry=${slide.file} contract=${contractSlide?.file || "missing"}`);
    }
  });

  if (mismatches.length) {
    fail("contract order", mismatches.slice(0, 20).join("; "));
  } else {
    pass("contract order", "registry order matches slide-spec.json");
  }
}

function checkFilesAndHashes(contractSlides) {
  const missing = [];
  const hashDrift = [];
  const missingTitle = [];
  const missingSpeaker = [];

  contractSlides.forEach((slide) => {
    const slidePath = path.join(deckRoot, slide.file);
    if (!fs.existsSync(slidePath)) {
      missing.push(slide.file);
      return;
    }
    const actualHash = sha256(readText(slidePath));
    if (slide.contentHash !== actualHash) {
      hashDrift.push(`${slide.file} expected=${slide.contentHash || "missing"} actual=${actualHash}`);
    }
    if (!slide.title || !String(slide.title).trim()) {
      missingTitle.push(slide.file);
    }
    if (!slide.speakerSource || slide.speakerSource === "missing") {
      missingSpeaker.push(slide.file);
    }
  });

  if (missing.length) {
    fail("registered slide files", missing.join(", "));
  } else {
    pass("registered slide files", `${contractSlides.length} files found`);
  }

  if (hashDrift.length) {
    fail("contract hashes", hashDrift.slice(0, 20).join("; "));
  } else {
    pass("contract hashes", `${contractSlides.length} slide hashes match current HTML`);
  }

  if (missingTitle.length) {
    fail("contract titles", missingTitle.join(", "));
  } else {
    pass("contract titles", `${contractSlides.length} titles present`);
  }

  if (missingSpeaker.length) {
    fail("contract speaker sources", missingSpeaker.join(", "));
  } else {
    pass("contract speaker sources", `${contractSlides.length} speaker sources resolved`);
  }
}

function checkSourceSensitiveCoverage(registrySlides, contractSlides) {
  const byFile = new Map(contractSlides.map((slide) => [slide.file, slide]));
  const missingSlideSources = [];
  const deckGlobalOnly = [];
  const allowDeckGlobal = [];

  registrySlides.forEach((registrySlide) => {
    const contractSlide = byFile.get(registrySlide.file);
    if (!contractSlide) {
      return;
    }
    const requiresSlideSource = Array.isArray(registrySlide.sources) && registrySlide.sources.length > 0;
    const allowsDeckGlobal = registrySlide.sourcePolicy === "allow-deck-global";
    const hasSlideSource = Array.isArray(contractSlide.sources) && contractSlide.sources.some((source) => source.sourceScope === "slide");
    const hasAnySource = Array.isArray(contractSlide.sources) && contractSlide.sources.length > 0;

    if (requiresSlideSource && !hasSlideSource) {
      missingSlideSources.push(registrySlide.file);
    } else if (allowsDeckGlobal && !hasSlideSource) {
      allowDeckGlobal.push(registrySlide.file);
    } else if (!requiresSlideSource && !hasSlideSource && hasAnySource) {
      deckGlobalOnly.push(registrySlide.file);
    } else if (!hasAnySource) {
      deckGlobalOnly.push(`${registrySlide.file} (no sources)`);
    }
  });

  if (missingSlideSources.length) {
    fail("source-sensitive slide coverage", missingSlideSources.join(", "));
  } else {
    pass("source-sensitive slide coverage", "all slides marked with per-slide sources retain slide-level evidence");
  }

  if (deckGlobalOnly.length) {
    warn("source coverage", `${deckGlobalOnly.length} slides rely on deck-global source appendix only`);
  }
  if (allowDeckGlobal.length) {
    pass("source coverage allowlist", `${allowDeckGlobal.length} slides explicitly allow deck-global coverage`);
  }
}

function checkSlideHtmlCache(registrySlides) {
  const cache = loadSlideHtmlCache();
  if (!cache) {
    return;
  }

  const expectedFiles = registrySlides.map((slide) => slide.file);
  const actualFiles = Object.keys(cache);
  const missing = expectedFiles.filter((file) => !Object.prototype.hasOwnProperty.call(cache, file));
  const extra = actualFiles.filter((file) => !expectedFiles.includes(file));
  const orderMismatches = expectedFiles
    .map((file, index) => (actualFiles[index] === file ? null : `#${index + 1} cache=${actualFiles[index] || "missing"} expected=${file}`))
    .filter(Boolean);
  const drift = [];

  expectedFiles.forEach((file) => {
    if (!Object.prototype.hasOwnProperty.call(cache, file)) {
      return;
    }
    try {
      const expectedHtml = extractMainSlideHtml(readText(path.join(deckRoot, file)));
      if (cache[file] !== expectedHtml) {
        drift.push(file);
      }
    } catch (error) {
      drift.push(`${file} (${error.message})`);
    }
  });

  if (missing.length || extra.length || orderMismatches.length) {
    fail("slide html cache order", [
      missing.length ? `missing=${missing.join(", ")}` : "",
      extra.length ? `extra=${extra.join(", ")}` : "",
      orderMismatches.length ? orderMismatches.slice(0, 10).join("; ") : "",
    ].filter(Boolean).join(" | "));
  } else {
    pass("slide html cache order", `${expectedFiles.length} cached fragments match registry order`);
  }

  if (drift.length) {
    fail("slide html cache drift", drift.slice(0, 20).join(", "));
  } else {
    pass("slide html cache drift", `${expectedFiles.length} cached fragments match slide HTML`);
  }
}

function main() {
  let registrySlides = [];
  try {
    registrySlides = loadSlides();
  } catch (error) {
    fail("slide registry", error.message);
  }

  const spec = loadSpec();
  if (registrySlides.length && spec) {
    checkCount(registrySlides, spec.slides);
    checkOrder(registrySlides, spec.slides);
    checkFilesAndHashes(spec.slides);
    checkSourceSensitiveCoverage(registrySlides, spec.slides);
    checkSlideHtmlCache(registrySlides);
  }

  results.forEach((result) => {
    console.log(`${result.level} ${result.name}${result.detail ? ` - ${result.detail}` : ""}`);
  });

  if (results.some((result) => result.level === "FAIL")) {
    process.exitCode = 1;
  }
}

main();
