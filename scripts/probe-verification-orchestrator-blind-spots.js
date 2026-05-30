#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const packsDir = path.join(root, ".codex/skills/verification-orchestrator/packs");
const errors = [];

function readText(relativePath) {
  const fullPath = path.join(root, relativePath);
  if (!fs.existsSync(fullPath)) {
    errors.push(`missing file: ${relativePath}`);
    return "";
  }
  return fs.readFileSync(fullPath, "utf8");
}

function readJson(relativePath) {
  const text = readText(relativePath);
  if (!text) {
    return null;
  }
  try {
    return JSON.parse(text);
  } catch (error) {
    errors.push(`${relativePath} is not valid JSON: ${error.message}`);
    return null;
  }
}

function requirePhrase(text, relativePath, phrase) {
  if (!text.includes(phrase)) {
    errors.push(`${relativePath} missing blind-spot probe phrase: ${phrase}`);
  }
}

function requirePattern(text, relativePath, pattern, label) {
  if (!pattern.test(text)) {
    errors.push(`${relativePath} missing blind-spot probe pattern: ${label}`);
  }
}

function assertNoGlobalArtifactPath(text, relativePath) {
  const globalPathPattern = /(?:~|\$HOME|\/Users\/[^/\s]+|\/home\/[^/\s]+|\/root)\/\.(?:codex|agents|claude|config)\//;
  if (globalPathPattern.test(text)) {
    errors.push(`${relativePath} references a global/user agent or config artifact path`);
  }
}

function validateKnownFailurePatterns() {
  const state = readJson(".codex/verification/capability-state.json");
  if (!state) {
    return;
  }
  const patterns = Array.isArray(state.knownFailurePatterns) ? state.knownFailurePatterns : [];
  const ids = new Set(patterns.map((pattern) => pattern && pattern.id));
  for (const id of [
    "happy-path-only-verification",
    "heuristic-without-risk-cost",
    "coupled-or-contaminated-verification",
    "self-improvement-without-regression-gate",
  ]) {
    if (!ids.has(id)) {
      errors.push(`capability-state knownFailurePatterns missing blind-spot detector: ${id}`);
    }
  }
  const combinedText = patterns
    .map((pattern) => `${pattern.description || ""} ${pattern.detection || ""}`)
    .join("\n");
  for (const phrase of [
    "edge cases",
    "false-positive",
    "false-negative",
    "idempotent",
    "regression",
  ]) {
    requirePhrase(combinedText, "capability-state knownFailurePatterns", phrase);
  }
  const adapter = state.projectAdapters && state.projectAdapters.research_ai;
  const commands = adapter && Array.isArray(adapter.commands) ? adapter.commands : [];
  for (const command of [
    "node scripts/probe-verification-orchestrator-blind-spots.js",
    "node scripts/test-verification-orchestrator-loop.js",
  ]) {
    if (!commands.includes(command)) {
      errors.push(`research_ai adapter missing blind-spot command: ${command}`);
    }
  }
}

function validateTaskPacks() {
  const matrix = readJson(".codex/skills/verification-orchestrator/matrices/task-to-verifier.json");
  if (!matrix) {
    return;
  }
  const matrixTypes = new Set((matrix.taskTypes || []).map((task) => task.id));
  for (const taskType of [
    "code-change",
    "slide-deck",
    "pptx-deck",
    "schedule-plan",
    "document-review",
    "ops-checklist",
  ]) {
    const packPath = `.codex/skills/verification-orchestrator/packs/${taskType}.json`;
    const fullPath = path.join(root, packPath);
    if (!fs.existsSync(fullPath)) {
      errors.push(`missing Level 4 task-specific blind-spot pack: ${packPath}`);
      continue;
    }
    if (!matrixTypes.has(taskType)) {
      errors.push(`matrix missing Level 4 task route: ${taskType}`);
    }
    const pack = readJson(packPath);
    if (!pack) {
      continue;
    }
    if (!Array.isArray(pack.blindSpotPatterns) || pack.blindSpotPatterns.length < 2) {
      errors.push(`${packPath} must define at least two task-specific blindSpotPatterns`);
    }
    if (!Array.isArray(pack.sampleTasks) || pack.sampleTasks.length === 0) {
      errors.push(`${packPath} must define sampleTasks for Level 4 validation`);
    }
    const patternIds = new Set(
      Array.isArray(pack.blindSpotPatterns)
        ? pack.blindSpotPatterns.map((pattern) => pattern && pattern.id)
        : [],
    );
    for (const [index, sampleTask] of (pack.sampleTasks || []).entries()) {
      if (!Array.isArray(sampleTask.mustDetect) || sampleTask.mustDetect.length === 0) {
        errors.push(`${packPath} sampleTasks[${index}] must detect at least one blind spot pattern`);
        continue;
      }
      for (const patternId of sampleTask.mustDetect) {
        if (!patternIds.has(patternId)) {
          errors.push(`${packPath} sampleTasks[${index}] references unknown blind spot pattern: ${patternId}`);
        }
      }
    }
  }
  if (!fs.existsSync(packsDir)) {
    errors.push("verification-orchestrator packs directory is missing");
  }
}

function validateProbeOfProbeFixtures() {
  const fixturePath = ".codex/skills/verification-orchestrator/negative-fixtures/probe-of-probe.json";
  const fixture = readJson(fixturePath);
  if (!fixture) {
    return;
  }
  if (!Array.isArray(fixture.fixtures) || fixture.fixtures.length < 6) {
    errors.push(`${fixturePath} must include negative fixtures for every Level 4 task pack`);
    return;
  }
  const coveredTaskTypes = new Set(fixture.fixtures.map((item) => item && item.taskType));
  for (const taskType of [
    "code-change",
    "slide-deck",
    "pptx-deck",
    "schedule-plan",
    "document-review",
    "ops-checklist",
  ]) {
    if (!coveredTaskTypes.has(taskType)) {
      errors.push(`${fixturePath} missing negative fixture for ${taskType}`);
    }
  }
  for (const [index, item] of fixture.fixtures.entries()) {
    for (const field of ["id", "taskType", "mutation", "expectedDetector", "risk"]) {
      if (typeof item[field] !== "string" || item[field].trim() === "") {
        errors.push(`${fixturePath} fixtures[${index}] missing ${field}`);
      }
    }
  }
}

function validateTemplates() {
  const templatePaths = [
    ".codex/skills/verification-orchestrator/templates/review-brief.md",
    ".codex/skills/verification-orchestrator/templates/verdict.md",
    ".codex/skills/verification-orchestrator/templates/improvement-proposal.md",
  ];
  for (const relativePath of templatePaths) {
    const text = readText(relativePath);
    assertNoGlobalArtifactPath(text, relativePath);
  }
  const brief = readText(".codex/skills/verification-orchestrator/templates/review-brief.md");
  for (const phrase of [
    "Edge-case and bypass coverage",
    "Heuristic score calibration",
    "Decoupled and idempotent environment",
    "Negative examples or adversarial cases",
    "Regression suite evidence",
    "Blind Spot Probe",
  ]) {
    requirePhrase(brief, "templates/review-brief.md", phrase);
  }
  const verdict = readText(".codex/skills/verification-orchestrator/templates/verdict.md");
  for (const phrase of [
    "false-positive risk",
    "false-negative risk",
    "Root cause category",
    "Regression suite required before promotion",
  ]) {
    requirePhrase(verdict, "templates/verdict.md", phrase);
  }
  const proposal = readText(".codex/skills/verification-orchestrator/templates/improvement-proposal.md");
  for (const phrase of [
    "Root Cause Category",
    "Regression Gate",
    "Negative failure example",
    "Human approval required",
  ]) {
    requirePhrase(proposal, "templates/improvement-proposal.md", phrase);
  }
}

function validateRunnerAndFixtures() {
  const runner = readText("scripts/run-verification-orchestrator-loop.js");
  for (const phrase of [
    "defaultBlindSpotCommand",
    "probe-verification-orchestrator-blind-spots.js",
    "check verifier blind spot",
    "blind spot detected",
    "improve verifier",
  ]) {
    requirePhrase(runner, "run-verification-orchestrator-loop.js", phrase);
  }
  if (runner.includes("no blind-spot check configured")) {
    errors.push("run-verification-orchestrator-loop.js still allows PASS without blind-spot probing");
  }

  const fixtures = readText("scripts/test-verification-orchestrator-loop.js");
  for (const phrase of [
    "default validator pass runs default blind spot probe",
    "target repair success loops back to verification and passes",
    "blind spot improvement success consumes one improvement budget and passes",
    "verifier improvement limit blocks repeated blind spots",
  ]) {
    requirePhrase(fixtures, "test-verification-orchestrator-loop.js", phrase);
  }

  const taskPackFixtures = readText("scripts/test-verification-task-packs.js");
  for (const phrase of [
    "code bugfix resolves to code-change",
    "pptx deck resolves to pptx-deck",
    "schedule plan resolves to schedule-plan",
    "document review resolves to document-review",
    "ops checklist resolves to ops-checklist",
    "PASS verification task packs",
  ]) {
    requirePhrase(taskPackFixtures, "test-verification-task-packs.js", phrase);
  }

  const probeOfProbeFixtures = readText("scripts/test-verification-probe-of-probe.js");
  for (const phrase of [
    "validatePackForProbe",
    "mutatePack",
    "PASS negative fixture",
    "PASS verification probe-of-probe negative fixtures",
  ]) {
    requirePhrase(probeOfProbeFixtures, "test-verification-probe-of-probe.js", phrase);
  }
}

function validateValidatorCoverage() {
  const validator = readText("scripts/validate-verification-orchestrator.js");
  for (const phrase of [
    "probe-verification-orchestrator-blind-spots.js",
    "validateBlindSpotProbe",
    "validateTaskPacks",
    "defaultBlindSpotCommand",
    "Blind Spot Probe",
  ]) {
    requirePhrase(validator, "validate-verification-orchestrator.js", phrase);
  }
}

function validateSkillContract() {
  const skill = readText(".codex/skills/verification-orchestrator/SKILL.md");
  assertNoGlobalArtifactPath(skill, "SKILL.md");
  for (const phrase of [
    "default blind spot probe",
    "Blind Spot Detection",
    "Verification Conditions",
    "If verification passes, always run blind-spot detection",
  ]) {
    requirePhrase(skill, "SKILL.md", phrase);
  }
  requirePattern(skill, "SKILL.md", /Target verification condition/i, "target verification condition");
  requirePattern(skill, "SKILL.md", /Verifier blind-spot condition/i, "verifier blind-spot condition");
}

validateKnownFailurePatterns();
validateTaskPacks();
validateProbeOfProbeFixtures();
validateTemplates();
validateRunnerAndFixtures();
validateValidatorCoverage();
validateSkillContract();

if (errors.length > 0) {
  for (const error of errors) {
    console.error(`FAIL ${error}`);
  }
  process.exit(1);
}

console.log("PASS verification-orchestrator blind-spot probe");
