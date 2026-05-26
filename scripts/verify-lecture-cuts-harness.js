#!/usr/bin/env node
const { spawnSync } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const handoffPath = path.join(root, "lecture-cuts", "HANDOFF.md");
const agentHandoffPath = path.join(root, "docs", "harness", "lecture-cuts-agent-handoff.md");

function run(label, command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: root,
    encoding: "utf8",
    stdio: options.inherit ? "inherit" : ["ignore", "pipe", "pipe"],
  });
  if (result.error) {
    throw result.error;
  }
  if (result.status !== 0) {
    const output = [result.stdout, result.stderr].filter(Boolean).join("\n").trim();
    throw new Error(`${label} failed with exit code ${result.status}${output ? `\n${output}` : ""}`);
  }
  return result.stdout || "";
}

function assertIncludes(text, needle, label) {
  if (!text.includes(needle)) {
    throw new Error(`${label} missing ${needle}`);
  }
}

function assertPattern(text, pattern, label) {
  if (!pattern.test(text)) {
    throw new Error(`${label} missing ${pattern}`);
  }
}

function validateHandoffOnly() {
  if (!fs.existsSync(handoffPath)) {
    throw new Error("lecture-cuts/HANDOFF.md is missing");
  }
  if (!fs.existsSync(agentHandoffPath)) {
    throw new Error("docs/harness/lecture-cuts-agent-handoff.md is missing");
  }

  const handoff = fs.readFileSync(handoffPath, "utf8");
  const agentHandoff = fs.readFileSync(agentHandoffPath, "utf8");
  [
    "## Current State",
    "## Inputs",
    "## Evidence Map Status",
    "## Source Coverage",
    "## Decisions",
    "## Changed Files",
    "## Generated Artifacts",
    "## Quality Gate Artifacts",
    "## Verification",
    "## Agent Findings",
    "## Blocked Risks",
    "## Non-Blocking Risks",
    "## Next Prompt",
  ].forEach((heading) => assertIncludes(handoff, heading, "lecture-cuts/HANDOFF.md"));

  [
    "node scripts/validate-lecture-cuts-contract.js",
    "node scripts/audit-lecture-cuts.js",
    "node scripts/verify-lecture-cuts-harness.js",
    "Exit Code:",
    "Artifact Path:",
    "PASS",
    "WARN",
  ].forEach((needle) => assertIncludes(handoff, needle, "lecture-cuts/HANDOFF.md"));

  assertPattern(agentHandoff, /Status:\s*(PASS|WARN|FAIL)/, "lecture-cuts-agent-handoff.md");
  assertPattern(agentHandoff, /Evidence path:/, "lecture-cuts-agent-handoff.md");
  assertPattern(agentHandoff, /### 발견[\s\S]*### 수행[\s\S]*### 판단[\s\S]*### 미해결[\s\S]*### 근거/, "lecture-cuts-agent-handoff.md");

  const blocked = handoff.match(/## Blocked Risks\s+([\s\S]*?)\n## /);
  const nonBlocking = handoff.match(/## Non-Blocking Risks\s+([\s\S]*?)\n## /);
  const nextPrompt = handoff.match(/## Next Prompt\s+([\s\S]*)$/);
  if (!blocked || !blocked[1].trim()) {
    throw new Error("lecture-cuts/HANDOFF.md Blocked Risks is empty");
  }
  if (!nonBlocking || !nonBlocking[1].trim()) {
    throw new Error("lecture-cuts/HANDOFF.md Non-Blocking Risks is empty");
  }
  if (!nextPrompt || !nextPrompt[1].trim()) {
    throw new Error("lecture-cuts/HANDOFF.md Next Prompt is empty");
  }

  console.log("PASS handoff parser");
}

function main() {
  if (process.argv.includes("--handoff-only")) {
    validateHandoffOnly();
    return;
  }

  run("slides syntax", process.execPath, ["--check", "lecture-cuts/assets/slides.js"]);
  run("slide html cache syntax", process.execPath, ["--check", "lecture-cuts/assets/slide-html.js"]);
  run("deck syntax", process.execPath, ["--check", "lecture-cuts/assets/deck.js"]);
  run("presenter review syntax", process.execPath, ["--check", "lecture-cuts/assets/presenter-review.js"]);
  run("presenter review save server syntax", process.execPath, ["--check", "scripts/serve-lecture-cuts-review.js"]);
  run("slide-script composition audit syntax", process.execPath, [
    "--check",
    "scripts/audit-lecture-cuts-slide-script-composition.js",
  ]);
  console.log("PASS syntax checks");

  run("reproduction contract", process.execPath, ["scripts/validate-lecture-cuts-contract.js"]);
  console.log("PASS reproduction contract");

  run("lecture-cuts audit", process.execPath, ["scripts/audit-lecture-cuts.js"]);
  console.log("PASS lecture-cuts audit");

  run("lecture-cuts speaker sync audit", process.execPath, ["scripts/audit-lecture-cuts-speaker-sync.js"]);
  console.log("PASS lecture-cuts speaker sync audit");

  run("lecture-cuts Korean copy audit", process.execPath, ["scripts/audit-lecture-cuts-korean-copy.js"]);
  console.log("PASS lecture-cuts Korean copy audit");

  run("lecture-cuts slide redundancy audit", process.execPath, ["scripts/audit-lecture-cuts-slide-redundancy.js", "--slides", "6,7"]);
  console.log("PASS lecture-cuts slide redundancy audit");

  run("lecture-cuts slide-script composition audit", process.execPath, ["scripts/audit-lecture-cuts-slide-script-composition.js"]);
  console.log("PASS lecture-cuts slide-script composition audit");

  run("pre-handoff hooks", process.execPath, ["scripts/run-lecture-cuts-hook.js", "pre-handoff"], { inherit: true });
  console.log("PASS pre-handoff hooks");
}

try {
  main();
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
