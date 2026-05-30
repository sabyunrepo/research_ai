#!/usr/bin/env node
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = path.resolve(__dirname, "..", "..");

function usage() {
  console.error("Usage: node deck-harness/scripts/verify-slide-layout-variety.js <deck-dir>");
  process.exit(1);
}

function resolveDeckDir(input) {
  if (!input) usage();
  return path.isAbsolute(input) ? input : path.join(root, input);
}

function loadRegistry(deckDir) {
  const context = { window: {} };
  vm.createContext(context);
  vm.runInContext(fs.readFileSync(path.join(deckDir, "assets", "slides.js"), "utf8"), context);
  return context.window.DECK_SLIDES || [];
}

function main() {
  const deckDir = resolveDeckDir(process.argv[2]);
  const slides = loadRegistry(deckDir);
  if (!slides.length) throw new Error("no slides found in assets/slides.js");

  const counts = new Map();
  let longestRun = 0;
  let currentRun = 0;
  let previous = "";
  slides.forEach((slide) => {
    const variant = slide.layoutVariant || "standard";
    counts.set(variant, (counts.get(variant) || 0) + 1);
    currentRun = variant === previous ? currentRun + 1 : 1;
    previous = variant;
    longestRun = Math.max(longestRun, currentRun);
  });

  const variants = [...counts.keys()];
  const largest = Math.max(...counts.values());
  const largestRatio = largest / slides.length;
  if (variants.length < 5) throw new Error(`expected at least 5 layout variants, found ${variants.length}`);
  if (largestRatio > 0.35) throw new Error(`largest layout cluster too high: ${largest}/${slides.length}`);
  if (longestRun > 3) throw new Error(`same layout repeats ${longestRun} slides in a row`);

  console.log(`PASS slide layout variety - ${variants.length} variants, largest ${largest}/${slides.length}, longest run ${longestRun}`);
}

try {
  main();
} catch (error) {
  console.error(`FAIL ${error.message}`);
  process.exitCode = 1;
}
