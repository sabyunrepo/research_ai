#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const packsDir = path.join(root, ".codex/skills/verification-orchestrator/packs");
const fixturePath = path.join(
  root,
  ".codex/skills/verification-orchestrator/negative-fixtures/probe-of-probe.json",
);

const requiredTaskTypes = [
  "code-change",
  "slide-deck",
  "pptx-deck",
  "schedule-plan",
  "document-review",
  "ops-checklist",
];

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function validatePackForProbe(pack) {
  const errors = [];
  if (!pack || typeof pack !== "object" || Array.isArray(pack)) {
    return ["pack must be an object"];
  }
  if (!Array.isArray(pack.verificationAxes) || pack.verificationAxes.length === 0) {
    errors.push("pack must define task-specific verificationAxes");
  }
  if (!Array.isArray(pack.blindSpotPatterns) || pack.blindSpotPatterns.length < 2) {
    errors.push("pack must define at least two task-specific blindSpotPatterns");
  }
  if (!Array.isArray(pack.sampleTasks) || pack.sampleTasks.length === 0) {
    errors.push("pack must define sampleTasks for mutation regression");
  }
  if (typeof pack.repairStrategy !== "string" || pack.repairStrategy.trim() === "") {
    errors.push("pack must define repairStrategy");
  }
  if (typeof pack.improveStrategy !== "string" || pack.improveStrategy.trim() === "") {
    errors.push("pack must define improveStrategy");
  }

  const patternIds = new Set(
    Array.isArray(pack.blindSpotPatterns)
      ? pack.blindSpotPatterns.map((pattern) => pattern && pattern.id)
      : [],
  );
  for (const [index, sampleTask] of (pack.sampleTasks || []).entries()) {
    if (!Array.isArray(sampleTask.mustDetect) || sampleTask.mustDetect.length === 0) {
      errors.push(`sampleTasks[${index}] must detect at least one declared blind spot pattern`);
      continue;
    }
    for (const patternId of sampleTask.mustDetect) {
      if (!patternIds.has(patternId)) {
        errors.push(`sampleTasks[${index}] references unknown blind spot pattern: ${patternId}`);
      }
    }
  }
  return errors;
}

function mutatePack(pack, mutation) {
  const mutated = clone(pack);
  if (mutation === "removeBlindSpotPatterns") {
    mutated.blindSpotPatterns = [];
  } else if (mutation === "removeSampleTasks") {
    mutated.sampleTasks = [];
  } else if (mutation === "clearSampleMustDetect") {
    mutated.sampleTasks = (mutated.sampleTasks || []).map((sampleTask) => ({
      ...sampleTask,
      mustDetect: [],
    }));
  } else if (mutation === "removeVerificationAxes") {
    mutated.verificationAxes = [];
  } else if (mutation === "blankImproveStrategy") {
    mutated.improveStrategy = "";
  } else if (mutation === "blankRepairStrategy") {
    mutated.repairStrategy = "";
  } else {
    throw new Error(`unknown mutation: ${mutation}`);
  }
  return mutated;
}

function fail(message) {
  console.error(`FAIL ${message}`);
  process.exitCode = 1;
}

function validateRealPacksPass() {
  for (const taskType of requiredTaskTypes) {
    const pack = readJson(path.join(packsDir, `${taskType}.json`));
    const errors = validatePackForProbe(pack);
    if (errors.length > 0) {
      fail(`${taskType} real pack failed probe-of-probe validation: ${errors.join("; ")}`);
    } else {
      console.log(`PASS real pack probe coverage ${taskType}`);
    }
  }
}

function validateNegativeFixturesFail() {
  const fixtureDoc = readJson(fixturePath);
  if (fixtureDoc.schemaVersion !== 1) {
    fail("probe-of-probe fixture schemaVersion must be 1");
    return;
  }
  if (!Array.isArray(fixtureDoc.fixtures) || fixtureDoc.fixtures.length < requiredTaskTypes.length) {
    fail("probe-of-probe fixtures must cover every required task type");
    return;
  }

  for (const fixture of fixtureDoc.fixtures) {
    const pack = readJson(path.join(packsDir, `${fixture.taskType}.json`));
    const mutated = mutatePack(pack, fixture.mutation);
    const errors = validatePackForProbe(mutated);
    if (!errors.some((error) => error.includes(fixture.expectedDetector))) {
      fail(
        `${fixture.id}: expected detector "${fixture.expectedDetector}" but got ${
          errors.length ? errors.join("; ") : "no errors"
        }`,
      );
    } else {
      console.log(`PASS negative fixture ${fixture.id}`);
    }
  }
}

validateRealPacksPass();
validateNegativeFixturesFail();

if (process.exitCode) {
  process.exit(process.exitCode);
}

console.log("PASS verification probe-of-probe negative fixtures");
