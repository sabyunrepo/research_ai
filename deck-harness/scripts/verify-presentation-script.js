#!/usr/bin/env node
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..", "..");

function usage() {
  console.error("Usage: node deck-harness/scripts/verify-presentation-script.js <deck-dir>");
  process.exit(1);
}

function resolveDeckDir(input) {
  if (!input) usage();
  return path.isAbsolute(input) ? input : path.join(root, input);
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function fail(message) {
  console.error(`FAIL ${message}`);
  process.exit(1);
}

function warn(message) {
  console.error(`WARN ${message}`);
}

function hasPlaceholder(text) {
  return /TODO|FIXME|TBD|작성\s*필요|추가\s*필요|\{\{|\}\}|undefined|null/i.test(String(text || ""));
}

function countKoreanChars(text) {
  return (String(text || "").match(/[가-힣]/g) || []).length;
}

function main() {
  const deckDir = resolveDeckDir(process.argv[2]);
  const specPath = path.join(deckDir, "slide-spec.json");
  const scriptPath = path.join(deckDir, "presentation-script.json");
  const markdownPath = path.join(deckDir, "presentation-script.md");
  if (!fs.existsSync(specPath)) fail(`missing slide-spec.json in ${deckDir}`);
  if (!fs.existsSync(scriptPath)) fail(`missing presentation-script.json in ${deckDir}`);
  if (!fs.existsSync(markdownPath)) fail(`missing presentation-script.md in ${deckDir}`);

  const spec = readJson(specPath);
  const script = readJson(scriptPath);
  const slides = spec.slides || [];
  const scriptSlides = script.slides || [];
  if (scriptSlides.length !== slides.length) {
    fail(`slide count mismatch: slide-spec has ${slides.length}, presentation-script has ${scriptSlides.length}`);
  }
  if (script.audience !== "일반인 대상 강의") {
    fail(`audience must be "일반인 대상 강의"`);
  }

  const specById = new Map(slides.map((slide, index) => [slide.id, { slide, index }]));
  let shortCount = 0;
  let missingQuestionCount = 0;
  let missingTransitionCount = 0;

  scriptSlides.forEach((entry, index) => {
    const match = specById.get(entry.id);
    if (!match) fail(`script slide ${index + 1} has unknown id: ${entry.id}`);
    if (match.index !== index) fail(`script slide order mismatch at ${index + 1}: ${entry.id}`);
    if (entry.title !== match.slide.title) fail(`title mismatch for ${entry.id}`);
    if (entry.section !== (match.slide.section || "")) fail(`section mismatch for ${entry.id}`);
    if (hasPlaceholder(entry.script) || hasPlaceholder(entry.interactionPrompt) || hasPlaceholder(entry.transition)) {
      fail(`placeholder text remains in ${entry.id}`);
    }
    if (countKoreanChars(entry.script) < 120) shortCount += 1;
    if (!/[?？]|질문|생각|대입|확인|멈추고|짚/.test(entry.interactionPrompt || "")) missingQuestionCount += 1;
    if (countKoreanChars(entry.transition) < 10) missingTransitionCount += 1;
    if (!Array.isArray(entry.deliveryTips) || entry.deliveryTips.length === 0) {
      fail(`missing delivery tips for ${entry.id}`);
    }
  });

  if (shortCount > 0) fail(`${shortCount} slide scripts are too short for presenter use`);
  if (missingQuestionCount > Math.ceil(scriptSlides.length * 0.15)) {
    fail(`${missingQuestionCount} slides lack audience-oriented prompts`);
  }
  if (missingTransitionCount > 0) fail(`${missingTransitionCount} slides have weak transitions`);

  const markdown = fs.readFileSync(markdownPath, "utf8");
  if (!markdown.includes("## 1.") || !markdown.includes("### 발표 스크립트")) {
    fail("presentation-script.md does not expose per-slide script sections");
  }
  if (markdown.length < scriptSlides.length * 250) {
    warn("presentation-script.md is shorter than expected; inspect manually if this deck is unusually brief");
  }

  console.log(`PASS presentation script contract - ${scriptSlides.length} slides`);
}

main();
