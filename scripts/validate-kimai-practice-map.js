#!/usr/bin/env node
const fs = require("node:fs");
const path = require("node:path");

const { createPracticeDefinitionStore } = require("../practice-harness/src/practice-definition-store");

const root = path.resolve(__dirname, "..");
const deckRoot = path.join(root, "generated-decks", "kimai-workshop-content");
const mapPath = path.join(deckRoot, "practice-map.json");
const specPath = path.join(deckRoot, "slide-spec.json");
const scriptPath = path.join(deckRoot, "presentation-script.json");
const definitionStore = createPracticeDefinitionStore();

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function fail(message) {
  console.error(message);
  process.exit(1);
}

for (const filePath of [mapPath, specPath, scriptPath]) {
  if (!fs.existsSync(filePath)) {
    fail(`Missing required file: ${path.relative(root, filePath)}`);
  }
}

const practiceMap = readJson(mapPath);
const slideSpec = readJson(specPath);
const script = readJson(scriptPath);
const practices = Array.isArray(practiceMap.practices) ? practiceMap.practices : [];
const specSlideIds = new Set((slideSpec.slides || []).map((slide) => slide.id).filter(Boolean));
const scriptSlideIds = new Set((script.slides || []).map((slide) => slide.id).filter(Boolean));

if (practiceMap.deckId !== "kimai-workshop-content") {
  fail(`Unexpected practice-map deckId: ${practiceMap.deckId}`);
}
if (practices.length !== 6) {
  fail(`Expected 6 Kimai practice mappings, found ${practices.length}`);
}

const seen = new Set();
for (const entry of practices) {
  if (!entry.afterSlideId || !entry.practiceId) {
    fail("Each practice-map entry must include afterSlideId and practiceId");
  }
  if (seen.has(entry.afterSlideId)) {
    fail(`Duplicate afterSlideId: ${entry.afterSlideId}`);
  }
  seen.add(entry.afterSlideId);
  if (!specSlideIds.has(entry.afterSlideId)) {
    fail(`Mapped slide is missing from slide-spec.json: ${entry.afterSlideId}`);
  }
  if (!scriptSlideIds.has(entry.afterSlideId)) {
    fail(`Mapped slide is missing from presentation-script.json: ${entry.afterSlideId}`);
  }
  try {
    definitionStore.getPractice(entry.practiceId);
  } catch (error) {
    fail(`Unknown practiceId ${entry.practiceId}: ${error.message}`);
  }
}

console.log(`PASS kimai practice-map: ${practices.length} mappings validated`);
