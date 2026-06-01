#!/usr/bin/env node
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..", "..");

function usage() {
  console.error("Usage: node deck-harness/scripts/verify-deck-design-contract.js <deck-dir>");
  process.exit(1);
}

function deckDir(input) {
  if (!input) usage();
  return path.isAbsolute(input) ? input : path.join(root, input);
}

function read(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

function fail(message) {
  throw new Error(message);
}

function cssBlock(css, selector) {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = css.match(new RegExp(`(?:^|\\n)${escaped}\\s*\\{([\\s\\S]*?)\\n\\}`));
  return match ? match[1] : "";
}

function numericRule(block, property) {
  const match = block.match(new RegExp(`${property}\\s*:\\s*([0-9]+)`));
  return match ? Number(match[1]) : null;
}

function main() {
  const dir = deckDir(process.argv[2]);
  const css = read(path.join(dir, "assets", "style.css"));
  const h2 = cssBlock(css, "h2");
  const bridge = cssBlock(css, ".slide-bridge");

  if (!css.includes("--font-display:")) fail("style.css must define the 디자인.md display font token");
  if (!css.includes("--font-body:")) fail("style.css must define the 디자인.md body font token");
  if (!css.includes("--font-code:")) fail("style.css must define the 디자인.md code font token");
  if (!/font-family\s*:\s*var\(--display\)/.test(h2)) fail("h2 must use the 디자인.md display font token");
  if ((numericRule(h2, "font-weight") || 0) < 700) fail("h2 font-weight must be at least 700");

  if (!bridge) fail(".slide-bridge block is missing");
  if (/border-left\s*:/.test(bridge)) fail(".slide-bridge must not use a blue accent bar");
  if (/var\(--blue\)|#2563eb/i.test(bridge)) fail(".slide-bridge must not use blue emphasis");
  if ((numericRule(bridge, "font-weight") || 999) > 400) fail(".slide-bridge font-weight must be <= 400");
  if (/background\s*:\s*(?!\s*transparent)/.test(bridge)) fail(".slide-bridge background must be transparent");

  if (!/@keyframes\s+slide-enter/.test(css)) fail("missing slide-enter motion keyframes");
  if (!/@keyframes\s+visual-rise/.test(css)) fail("missing visual-rise motion keyframes");
  if (!/prefers-reduced-motion/.test(css)) fail("missing prefers-reduced-motion fallback");

  const slideDir = path.join(dir, "slides");
  const placeholders = fs.readdirSync(slideDir)
    .filter((file) => file.endsWith(".html"))
    .filter((file) => /visual-card|TBD|TODO|placeholder/i.test(read(path.join(slideDir, file))));
  if (placeholders.length) fail(`placeholder or fallback visual text found: ${placeholders.slice(0, 8).join("; ")}`);

  console.log("PASS deck design contract");
}

try {
  main();
} catch (error) {
  console.error(`FAIL ${error.message}`);
  process.exitCode = 1;
}
