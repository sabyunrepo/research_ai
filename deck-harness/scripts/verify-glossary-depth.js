#!/usr/bin/env node
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..", "..");
const requiredFields = ["term", "definition", "koreanLabel", "analogy", "practiceMeaning", "plainLanguage", "firstUseSlideId", "tooltipText"];

function usage() {
  console.error("Usage: node deck-harness/scripts/verify-glossary-depth.js <deck-dir>");
  process.exit(1);
}

function resolveDeckDir(input) {
  if (!input) usage();
  return path.isAbsolute(input) ? input : path.join(root, input);
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function main() {
  const deckDir = resolveDeckDir(process.argv[2]);
  const glossary = readJson(path.join(deckDir, "glossary.json"));
  const spec = readJson(path.join(deckDir, "slide-spec.json"));
  const slides = new Set((spec.slides || []).map((slide) => slide.id));
  const terms = glossary.terms || [];

  if (terms.length < 28) throw new Error(`glossary too small for 4-hour workshop: ${terms.length}/28`);
  const seen = new Set();
  terms.forEach((entry, index) => {
    requiredFields.forEach((field) => {
      if (typeof entry[field] !== "string" || !entry[field].trim()) {
        throw new Error(`glossary.terms[${index}] ${entry.term || "(missing term)"} missing ${field}`);
      }
    });
    if (seen.has(entry.term)) throw new Error(`duplicate glossary term: ${entry.term}`);
    seen.add(entry.term);
    if (!slides.has(entry.firstUseSlideId)) throw new Error(`${entry.term} firstUseSlideId does not resolve: ${entry.firstUseSlideId}`);
    if (entry.tooltipText.length < 24) throw new Error(`${entry.term} tooltipText too weak`);
  });

  console.log(`PASS glossary depth - ${terms.length} terms`);
}

try {
  main();
} catch (error) {
  console.error(`FAIL ${error.message}`);
  process.exitCode = 1;
}
