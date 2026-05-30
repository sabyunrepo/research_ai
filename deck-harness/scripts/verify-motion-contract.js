#!/usr/bin/env node
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..", "..");

function usage() {
  console.error("Usage: node deck-harness/scripts/verify-motion-contract.js <deck-dir>");
  process.exit(1);
}

function deckDir(input) {
  if (!input) usage();
  return path.isAbsolute(input) ? input : path.join(root, input);
}

function fail(message) {
  throw new Error(message);
}

function main() {
  const dir = deckDir(process.argv[2]);
  const deckJs = fs.readFileSync(path.join(dir, "assets", "deck.js"), "utf8");
  const css = fs.readFileSync(path.join(dir, "assets", "style.css"), "utf8");

  if (!/function\s+runSlideMotion/.test(deckJs)) fail("deck.js must define runSlideMotion choreography");
  if (!/\.animate\s*\(/.test(deckJs)) fail("deck.js must use Web Animations API Element.animate");
  if (!/prefers-reduced-motion/.test(deckJs) || !/prefers-reduced-motion/.test(css)) fail("motion must respect prefers-reduced-motion in JS and CSS");
  [".eyebrow", "h2", ".message", ".bullets li, .bullets span, .handoff-actions span", ".slide-media", ".slide-bridge"].forEach((selector) => {
    if (!deckJs.includes(selector)) fail(`motion choreography missing selector ${selector}`);
  });
  if (!/stagger/.test(deckJs)) fail("motion choreography must include staggered list/item timing");
  if (!/data-motion-state/.test(deckJs) && !/dataset\.motionState/.test(deckJs)) fail("motion runtime must expose data-motion-state evidence");
  if (!/@keyframes\s+slide-enter/.test(css) || !/@keyframes\s+visual-rise/.test(css)) fail("CSS fallback keyframes are missing");

  console.log("PASS motion contract");
}

try {
  main();
} catch (error) {
  console.error(`FAIL ${error.message}`);
  process.exitCode = 1;
}
