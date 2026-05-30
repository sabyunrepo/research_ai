#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");

const requiredFiles = [
  ".codex/skills/verification-orchestrator/SKILL.md",
  ".codex/skills/verification-orchestrator/matrices/task-to-verifier.json",
  ".codex/skills/verification-orchestrator/templates/review-brief.md",
  ".codex/skills/verification-orchestrator/templates/verdict.md",
  ".codex/skills/verification-orchestrator/templates/improvement-proposal.md",
  ".codex/skills/verification-orchestrator/schema/capability-state.schema.json",
  ".codex/skills/verification-orchestrator/examples/practice-ui-review-brief.md",
  ".codex/skills/verification-orchestrator/examples/lecture-cuts-review-brief.md",
  ".codex/skills/verification-orchestrator/packs/code-change.json",
  ".codex/skills/verification-orchestrator/packs/slide-deck.json",
  ".codex/skills/verification-orchestrator/packs/pptx-deck.json",
  ".codex/skills/verification-orchestrator/packs/schedule-plan.json",
  ".codex/skills/verification-orchestrator/packs/document-review.json",
  ".codex/skills/verification-orchestrator/packs/ops-checklist.json",
  ".codex/skills/verification-orchestrator/negative-fixtures/probe-of-probe.json",
  ".codex/verification/capability-state.json",
  ".codex/verification/promotion-log.md",
  "scripts/probe-verification-orchestrator-blind-spots.js",
  "scripts/resolve-verification-task.js",
  "scripts/run-verification-orchestrator-loop.js",
  "scripts/test-verification-probe-of-probe.js",
  "scripts/test-verification-task-packs.js",
  "scripts/test-verification-orchestrator-loop.js"
];

const requiredTaskTypes = [
  "practice-ui",
  "lecture-cuts",
  "deck-harness",
  "context-research",
  "code-change",
  "slide-deck",
  "pptx-deck",
  "schedule-plan",
  "document-review",
  "ops-checklist",
  "security-sensitive",
  "generic-code-change"
];

const generatedAgentPaths = new Set(["generated-from-brief"]);
const allowedPromotionDecisions = new Set(["promoted", "rejected", "blocked"]);
const allowedSeverities = new Set(["P0", "P1", "P2", "P3"]);

const forbiddenWeakeningPatterns = [
  /weaken PASS criteria/i,
  /delete failing checks/i,
  /edit global\/user instructions/i,
  /grant new tools or permissions/i,
  /persist full private transcripts/i
];

const errors = [];
const warnings = [];

function readText(relativePath) {
  const fullPath = path.join(root, relativePath);
  if (!fs.existsSync(fullPath)) {
    errors.push(`missing required file: ${relativePath}`);
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

function assertArray(value, label) {
  if (!Array.isArray(value)) {
    errors.push(`${label} must be an array`);
    return [];
  }
  return value;
}

function assertString(value, label) {
  if (typeof value !== "string" || value.trim() === "") {
    errors.push(`${label} must be a non-empty string`);
  }
}

function isObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function hasOwn(object, key) {
  return Object.prototype.hasOwnProperty.call(object, key);
}

function assertInteger(value, label, minimum = 0) {
  if (!Number.isInteger(value) || value < minimum) {
    errors.push(`${label} must be an integer >= ${minimum}`);
  }
}

function assertStringArray(value, label) {
  const items = assertArray(value, label);
  for (const [index, item] of items.entries()) {
    assertString(item, `${label}[${index}]`);
  }
  return items;
}

function assertNoGlobalArtifactPath(text, relativePath) {
  const globalPathPattern = /(?:~|\$HOME|\/Users\/[^/\s]+|\/home\/[^/\s]+|\/root)\/\.(?:codex|agents|claude|config)\//;
  if (globalPathPattern.test(text)) {
    errors.push(`${relativePath} references a global/user agent or config artifact path`);
  }
}

function assertForbiddenPolicyPresent(text, relativePath) {
  for (const pattern of forbiddenWeakeningPatterns) {
    if (!pattern.test(text)) {
      errors.push(`${relativePath} must explicitly forbid: ${pattern.source.replace(/\\\//g, "/")}`);
    }
  }
}

function validateSkill() {
  const text = readText(".codex/skills/verification-orchestrator/SKILL.md");
  if (!text) {
    return;
  }
  const requiredPhrases = [
    "task classifier",
    "verifier registry",
    "review brief generator",
    "evidence collector",
    "improvement proposer",
    "promotion gate",
    "capability state store",
    "defaultMaxAttempts",
    "Target-Fix / Verifier-Improve Loop",
    "node scripts/validate-verification-orchestrator.js",
    "node scripts/probe-verification-orchestrator-blind-spots.js",
    "node scripts/resolve-verification-task.js",
    "Task-Specific Verification Packs",
    "run-verification-orchestrator-loop.js",
    "--target-repair-command",
    "--blind-spot-command",
    "--improve-verifier-command",
    "Context-based edge-case inference",
    "Multi-dimensional heuristic scoring",
    "Decoupled and idempotent verification environment",
    "Meta-cognitive failure diagnosis",
    "Blind Spot Detection",
    "Verification Conditions",
    "regression suite",
    "Human Approval Gate",
    "Level 4",
    "Level 5",
    "Probe-of-Probe",
    "negative fixtures",
    "mutation",
    "pptx-deck",
    "schedule-plan",
    "document-review",
    "ops-checklist",
    "code-change",
    "node scripts/test-verification-orchestrator-loop.js"
  ];
  for (const phrase of requiredPhrases) {
    if (!text.includes(phrase)) {
      errors.push(`SKILL.md is missing required phrase: ${phrase}`);
    }
  }
  assertForbiddenPolicyPresent(text, "SKILL.md");
  assertNoGlobalArtifactPath(text, "SKILL.md");
}

function validateLoopRunner() {
  const text = readText("scripts/run-verification-orchestrator-loop.js");
  if (!text) {
    return;
  }
  const requiredPhrases = [
    "--verify-command",
    "--target-repair-command",
    "--blind-spot-command",
    "--improve-verifier-command",
    "defaultBlindSpotCommand",
    "probe-verification-orchestrator-blind-spots.js",
    "verifierImprovements += 1",
    "targetRepairs += 1",
    "target repair command failed",
    "maxImprovements",
    "maxTargetRepairs",
    "blind spot detected",
    "target defect detected",
    "verifier improvement command failed"
  ];
  for (const phrase of requiredPhrases) {
    if (!text.includes(phrase)) {
      errors.push(`run-verification-orchestrator-loop.js missing loop phrase: ${phrase}`);
    }
  }
  if (text.includes("no blind-spot check configured")) {
    errors.push("run-verification-orchestrator-loop.js must not PASS without a blind-spot probe");
  }
}

function validateBlindSpotProbe() {
  const text = readText("scripts/probe-verification-orchestrator-blind-spots.js");
  if (!text) {
    return;
  }
  const requiredPhrases = [
    "knownFailurePatterns",
    "edge cases",
    "false-positive",
    "false-negative",
    "idempotent",
    "Human approval required",
    "test-verification-probe-of-probe.js",
    "test-verification-task-packs.js",
    "test-verification-orchestrator-loop.js",
    "run-verification-orchestrator-loop.js",
    "process.exit(1)"
  ];
  for (const phrase of requiredPhrases) {
    if (!text.includes(phrase)) {
      errors.push(`probe-verification-orchestrator-blind-spots.js missing probe phrase: ${phrase}`);
    }
  }
}

function validateProbeOfProbeFixtures() {
  const fixture = readJson(".codex/skills/verification-orchestrator/negative-fixtures/probe-of-probe.json");
  if (!fixture) {
    return;
  }
  if (fixture.schemaVersion !== 1) {
    errors.push("probe-of-probe fixture schemaVersion must be 1");
  }
  const fixtures = assertArray(fixture.fixtures, "probe-of-probe fixtures");
  const coveredTaskTypes = new Set();
  for (const [index, item] of fixtures.entries()) {
    if (!isObject(item)) {
      errors.push(`probe-of-probe fixtures[${index}] must be an object`);
      continue;
    }
    for (const field of ["id", "taskType", "mutation", "expectedDetector", "risk"]) {
      assertString(item[field], `probe-of-probe fixtures[${index}].${field}`);
    }
    coveredTaskTypes.add(item.taskType);
  }
  for (const taskType of [
    "code-change",
    "slide-deck",
    "pptx-deck",
    "schedule-plan",
    "document-review",
    "ops-checklist",
  ]) {
    if (!coveredTaskTypes.has(taskType)) {
      errors.push(`probe-of-probe fixtures missing taskType: ${taskType}`);
    }
  }
}

function validateProbeOfProbeScript() {
  const text = readText("scripts/test-verification-probe-of-probe.js");
  if (!text) {
    return;
  }
  const requiredPhrases = [
    "validatePackForProbe",
    "mutatePack",
    "removeBlindSpotPatterns",
    "removeSampleTasks",
    "clearSampleMustDetect",
    "removeVerificationAxes",
    "blankImproveStrategy",
    "blankRepairStrategy",
    "PASS verification probe-of-probe negative fixtures"
  ];
  for (const phrase of requiredPhrases) {
    if (!text.includes(phrase)) {
      errors.push(`test-verification-probe-of-probe.js missing phrase: ${phrase}`);
    }
  }
}

function validateTaskResolver() {
  const text = readText("scripts/resolve-verification-task.js");
  if (!text) {
    return;
  }
  const requiredPhrases = [
    "classifyTask",
    "loadPacks",
    "resolveTask",
    "pptx-deck",
    "schedule-plan",
    "document-review",
    "ops-checklist",
    "blindSpotPatterns",
    "--task-type",
    "--task"
  ];
  for (const phrase of requiredPhrases) {
    if (!text.includes(phrase)) {
      errors.push(`resolve-verification-task.js missing resolver phrase: ${phrase}`);
    }
  }
}

function validateTaskPacks() {
  const requiredPacks = [
    "code-change",
    "slide-deck",
    "pptx-deck",
    "schedule-plan",
    "document-review",
    "ops-checklist"
  ];
  const matrix = readJson(".codex/skills/verification-orchestrator/matrices/task-to-verifier.json");
  const matrixIds = new Set(matrix && Array.isArray(matrix.taskTypes) ? matrix.taskTypes.map((task) => task.id) : []);
  for (const taskType of requiredPacks) {
    const relativePath = `.codex/skills/verification-orchestrator/packs/${taskType}.json`;
    const pack = readJson(relativePath);
    if (!pack) {
      continue;
    }
    if (pack.schemaVersion !== 1) {
      errors.push(`${relativePath} schemaVersion must be 1`);
    }
    if (pack.taskType !== taskType) {
      errors.push(`${relativePath} taskType must be ${taskType}`);
    }
    if (!matrixIds.has(taskType)) {
      errors.push(`${relativePath} has no matrix route`);
    }
    for (const field of ["purpose", "repairStrategy", "improveStrategy"]) {
      assertString(pack[field], `${relativePath}.${field}`);
    }
    for (const field of ["verificationAxes", "blindSpotPatterns", "sampleTasks"]) {
      if (assertArray(pack[field], `${relativePath}.${field}`).length === 0) {
        errors.push(`${relativePath}.${field} must not be empty`);
      }
    }
    for (const [index, pattern] of assertArray(pack.blindSpotPatterns, `${relativePath}.blindSpotPatterns`).entries()) {
      if (!isObject(pattern)) {
        errors.push(`${relativePath}.blindSpotPatterns[${index}] must be an object`);
        continue;
      }
      for (const field of ["id", "severity", "description", "detector"]) {
        assertString(pattern[field], `${relativePath}.blindSpotPatterns[${index}].${field}`);
      }
    }
    for (const [index, sampleTask] of assertArray(pack.sampleTasks, `${relativePath}.sampleTasks`).entries()) {
      if (!isObject(sampleTask)) {
        errors.push(`${relativePath}.sampleTasks[${index}] must be an object`);
        continue;
      }
      for (const field of ["id", "description"]) {
        assertString(sampleTask[field], `${relativePath}.sampleTasks[${index}].${field}`);
      }
      assertStringArray(sampleTask.mustSelect, `${relativePath}.sampleTasks[${index}].mustSelect`);
      assertStringArray(sampleTask.mustDetect, `${relativePath}.sampleTasks[${index}].mustDetect`);
    }
  }
}

function validateLoopFixtures() {
  const text = readText("scripts/test-verification-orchestrator-loop.js");
  if (!text) {
    return;
  }
  const requiredPhrases = [
    "default validator pass runs default blind spot probe",
    "target repair success loops back to verification and passes",
    "target repair command failure blocks immediately",
    "target repair limit blocks repeated target defects",
    "blind spot improvement success consumes one improvement budget and passes",
    "verifier improvement command failure blocks immediately",
    "verifier improvement limit blocks repeated blind spots",
    "PASS verification orchestrator loop fixtures"
  ];
  for (const phrase of requiredPhrases) {
    if (!text.includes(phrase)) {
      errors.push(`test-verification-orchestrator-loop.js missing fixture phrase: ${phrase}`);
    }
  }
}

function validateMatrix() {
  const matrix = readJson(".codex/skills/verification-orchestrator/matrices/task-to-verifier.json");
  if (!matrix) {
    return;
  }
  if (matrix.schemaVersion !== 1) {
    errors.push("task-to-verifier schemaVersion must be 1");
  }
  if (matrix.defaultTaskType !== "generic-code-change") {
    errors.push("task-to-verifier defaultTaskType must be generic-code-change");
  }
  const taskTypes = assertArray(matrix.taskTypes, "taskTypes");
  const ids = new Set();
  for (const task of taskTypes) {
    assertString(task.id, "taskTypes[].id");
    if (ids.has(task.id)) {
      errors.push(`duplicate task type id: ${task.id}`);
    }
    ids.add(task.id);
    assertString(task.description, `${task.id}.description`);
    if (assertArray(task.verifierProfiles, `${task.id}.verifierProfiles`).length === 0) {
      errors.push(`${task.id} must define at least one verifier profile`);
    }
    for (const [index, profile] of assertArray(task.verifierProfiles, `${task.id}.verifierProfiles`).entries()) {
      if (!isObject(profile)) {
        errors.push(`${task.id}.verifierProfiles[${index}] must be an object`);
        continue;
      }
      assertString(profile.id, `${task.id}.verifierProfiles[${index}].id`);
      assertString(profile.agentPath, `${task.id}.verifierProfiles[${index}].agentPath`);
      assertString(profile.role, `${task.id}.verifierProfiles[${index}].role`);
      if (profile.agentPath && !generatedAgentPaths.has(profile.agentPath)) {
        const agentFullPath = path.join(root, profile.agentPath);
        if (!fs.existsSync(agentFullPath)) {
          errors.push(`${task.id}.verifierProfiles[${index}].agentPath does not exist: ${profile.agentPath}`);
        }
      }
    }
    if (assertArray(task.mandatoryReads, `${task.id}.mandatoryReads`).length === 0) {
      errors.push(`${task.id} must define mandatoryReads`);
    }
    if (assertArray(task.evidenceCommands, `${task.id}.evidenceCommands`).length === 0) {
      errors.push(`${task.id} must define evidenceCommands`);
    }
    if (assertArray(task.blocksHandoffWhen, `${task.id}.blocksHandoffWhen`).length === 0) {
      errors.push(`${task.id} must define blocksHandoffWhen`);
    }
  }
  for (const required of requiredTaskTypes) {
    if (!ids.has(required)) {
      errors.push(`missing required task type: ${required}`);
    }
  }
  const practice = taskTypes.find((task) => task.id === "practice-ui");
  if (practice && !practice.evidenceCommands.includes("npm run qa:practice")) {
    errors.push("practice-ui route must require npm run qa:practice");
  }
  const lecture = taskTypes.find((task) => task.id === "lecture-cuts");
  if (lecture && !lecture.evidenceCommands.includes("node scripts/run-lecture-cuts-hook.js pre-handoff")) {
    errors.push("lecture-cuts route must require pre-handoff hook");
  }
}

function validatePromotedCheck(check, label) {
  if (!isObject(check)) {
    errors.push(`${label} must be an object`);
    return;
  }
  for (const field of ["id", "taskType", "description", "evidence", "validationCommand", "promotedAt"]) {
    assertString(check[field], `${label}.${field}`);
  }
  assertInteger(check.level, `${label}.level`, 1);
}

function validateKnownFailurePattern(pattern, label) {
  if (!isObject(pattern)) {
    errors.push(`${label} must be an object`);
    return;
  }
  for (const field of ["id", "taskType", "description", "detection"]) {
    assertString(pattern[field], `${label}.${field}`);
  }
  if (!allowedSeverities.has(pattern.severity)) {
    errors.push(`${label}.severity must be one of ${Array.from(allowedSeverities).join(", ")}`);
  }
}

function validatePromotionRecord(record, label) {
  if (!isObject(record)) {
    errors.push(`${label} must be an object`);
    return;
  }
  for (const field of ["id", "attemptId", "changeType", "evidence", "validationCommand", "validatedAt"]) {
    assertString(record[field], `${label}.${field}`);
  }
  assertInteger(record.fromLevel, `${label}.fromLevel`, 0);
  assertInteger(record.toLevel, `${label}.toLevel`, 0);
  if (!allowedPromotionDecisions.has(record.decision)) {
    errors.push(`${label}.decision must be one of ${Array.from(allowedPromotionDecisions).join(", ")}`);
  }
}

function validateTemplates() {
  const templates = [
    ".codex/skills/verification-orchestrator/templates/review-brief.md",
    ".codex/skills/verification-orchestrator/templates/verdict.md",
    ".codex/skills/verification-orchestrator/templates/improvement-proposal.md"
  ];
  for (const relativePath of templates) {
    const text = readText(relativePath);
    if (!text) {
      continue;
    }
    assertNoGlobalArtifactPath(text, relativePath);
    if (!/PASS|WARN|FAIL/.test(text)) {
      errors.push(`${relativePath} must include PASS/WARN/FAIL status language`);
    }
    if (!/Evidence/i.test(text)) {
      errors.push(`${relativePath} must include evidence requirements`);
    }
  }
  const verdict = readText(".codex/skills/verification-orchestrator/templates/verdict.md");
  for (const phrase of [
    "엣지 케이스 및 우회 검증",
    "다차원 점수",
    "false-positive risk",
    "false-negative risk",
    "Root cause category",
    "Regression suite required before promotion"
  ]) {
    if (!verdict.includes(phrase)) {
      errors.push(`templates/verdict.md missing advanced verifier phrase: ${phrase}`);
    }
  }
  const proposal = readText(".codex/skills/verification-orchestrator/templates/improvement-proposal.md");
  for (const phrase of [
    "Root Cause Category",
    "context_gap",
    "reasoning_error",
    "knowledge_gap",
    "environment_coupling",
    "Regression Gate",
    "Negative failure example",
    "Human approval required"
  ]) {
    if (!proposal.includes(phrase)) {
      errors.push(`templates/improvement-proposal.md missing diagnosis phrase: ${phrase}`);
    }
  }
  const brief = readText(".codex/skills/verification-orchestrator/templates/review-brief.md");
  for (const phrase of [
    "Edge-case and bypass coverage",
    "Decoupled and idempotent environment",
    "Heuristic score calibration",
    "Root-cause diagnosis readiness",
    "Human approval gate",
    "Blind Spot Probe",
    "Negative examples or adversarial cases",
    "Regression suite evidence",
    "Approval evidence for persistent verifier changes"
  ]) {
    if (!brief.includes(phrase)) {
      errors.push(`templates/review-brief.md missing mature verifier phrase: ${phrase}`);
    }
  }
  assertForbiddenPolicyPresent(
    readText(".codex/skills/verification-orchestrator/templates/improvement-proposal.md"),
    "templates/improvement-proposal.md"
  );
}

function validateStateSchema() {
  const schema = readJson(".codex/skills/verification-orchestrator/schema/capability-state.schema.json");
  if (!schema) {
    return;
  }
  const required = assertArray(schema.required, "capability-state schema required");
  for (const field of [
    "schemaVersion",
    "currentLevel",
    "defaultMaxAttempts",
    "promotedChecks",
    "knownFailurePatterns",
    "verifierProfiles",
    "projectAdapters",
    "promotionHistory"
  ]) {
    if (!required.includes(field)) {
      errors.push(`capability-state schema missing required field: ${field}`);
    }
  }
}

function validateState() {
  const state = readJson(".codex/verification/capability-state.json");
  if (!state) {
    return;
  }
  if (state.schemaVersion !== 1) {
    errors.push("capability-state schemaVersion must be 1");
  }
  if (!Number.isInteger(state.currentLevel) || state.currentLevel < 0) {
    errors.push("capability-state currentLevel must be a non-negative integer");
  }
  if (state.currentLevel !== 5) {
    errors.push("capability-state currentLevel must be 5 after Level 5 promotion");
  }
  if (state.defaultMaxAttempts !== 5) {
    errors.push("capability-state defaultMaxAttempts must be 5 for the initial project contract");
  }
  assertArray(state.promotedChecks, "capability-state promotedChecks").forEach((check, index) =>
    validatePromotedCheck(check, `capability-state promotedChecks[${index}]`)
  );
  const promotedCheckIds = new Set(
    Array.isArray(state.promotedChecks)
      ? state.promotedChecks.map((check) => check && check.id)
      : [],
  );
  for (const requiredCheck of [
    "task-specific-verification-packs",
    "task-resolver-sample-regression",
    "mandatory-blind-spot-probe",
    "promotion-gated-self-improvement",
    "probe-of-probe-negative-fixtures",
    "mutation-tested-blind-spot-packs"
  ]) {
    if (!promotedCheckIds.has(requiredCheck)) {
      errors.push(`capability-state promotedChecks missing promoted check: ${requiredCheck}`);
    }
  }
  assertArray(state.knownFailurePatterns, "capability-state knownFailurePatterns").forEach((pattern, index) =>
    validateKnownFailurePattern(pattern, `capability-state knownFailurePatterns[${index}]`)
  );
  const failurePatternIds = new Set(
    Array.isArray(state.knownFailurePatterns)
      ? state.knownFailurePatterns.map((pattern) => pattern && pattern.id)
      : [],
  );
  for (const requiredPattern of [
    "happy-path-only-verification",
    "heuristic-without-risk-cost",
    "coupled-or-contaminated-verification",
    "self-improvement-without-regression-gate"
  ]) {
    if (!failurePatternIds.has(requiredPattern)) {
      errors.push(`capability-state knownFailurePatterns missing required pattern: ${requiredPattern}`);
    }
  }
  assertArray(state.promotionHistory, "capability-state promotionHistory").forEach((record, index) =>
    validatePromotionRecord(record, `capability-state promotionHistory[${index}]`)
  );
  if (!isObject(state.verifierProfiles)) {
    errors.push("capability-state verifierProfiles must be an object");
  }
  if (!isObject(state.projectAdapters)) {
    errors.push("capability-state projectAdapters must be an object");
  }
  const matrix = readJson(".codex/skills/verification-orchestrator/matrices/task-to-verifier.json");
  const expectedProfileIds = new Set();
  if (matrix && Array.isArray(matrix.taskTypes)) {
    for (const task of matrix.taskTypes) {
      for (const profile of Array.isArray(task.verifierProfiles) ? task.verifierProfiles : []) {
        if (profile && profile.id) {
          expectedProfileIds.add(profile.id);
        }
      }
    }
  }
  for (const profileId of expectedProfileIds) {
    if (!state.verifierProfiles || !hasOwn(state.verifierProfiles, profileId)) {
      errors.push(`capability-state verifierProfiles missing matrix profile: ${profileId}`);
    }
  }
  if (state.verifierProfiles) {
    for (const [profileId, profileState] of Object.entries(state.verifierProfiles)) {
      if (!isObject(profileState)) {
        errors.push(`capability-state verifierProfiles.${profileId} must be an object`);
        continue;
      }
      assertInteger(profileState.level, `capability-state verifierProfiles.${profileId}.level`, 0);
      if (typeof profileState.lastValidatedAt !== "string") {
        errors.push(`capability-state verifierProfiles.${profileId}.lastValidatedAt must be a string`);
      }
    }
  }
  const adapter = state.projectAdapters && state.projectAdapters.research_ai;
  if (!adapter) {
    errors.push("capability-state must define research_ai project adapter");
  } else {
    assertInteger(adapter.level, "research_ai adapter level", 0);
    if (adapter.level !== 5) {
      errors.push("research_ai adapter level must be 5 after Level 5 promotion");
    }
    assertStringArray(adapter.commands, "research_ai adapter commands");
    for (const command of [
      "npm test",
      "npm run qa:practice",
      "node scripts/run-lecture-cuts-hook.js pre-handoff",
      "node scripts/probe-verification-orchestrator-blind-spots.js",
      "node scripts/test-verification-probe-of-probe.js",
      "node scripts/resolve-verification-task.js --task \"<description>\"",
      "node scripts/run-verification-orchestrator-loop.js --max-attempts 10",
      "node scripts/test-verification-task-packs.js",
      "node scripts/test-verification-orchestrator-loop.js"
    ]) {
      if (!adapter.commands.includes(command)) {
        errors.push(`research_ai adapter missing command: ${command}`);
      }
    }
  }
}

function validatePromotionLog() {
  const text = readText(".codex/verification/promotion-log.md");
  if (!text) {
    return;
  }
  for (const phrase of ["Current level: 5", "Default max verifier-improvement attempts: 5", "Level 4 promotion", "Level 5 promotion"]) {
    if (!text.includes(phrase)) {
      errors.push(`promotion-log.md missing initial phrase: ${phrase}`);
    }
  }
  for (const phrase of ["root cause category", "regression suite or negative example evidence", "human approval evidence when required"]) {
    if (!text.includes(phrase)) {
      errors.push(`promotion-log.md missing promotion evidence phrase: ${phrase}`);
    }
  }
  assertNoGlobalArtifactPath(text, "promotion-log.md");
}

function validateExamples() {
  const examples = [
    {
      path: ".codex/skills/verification-orchestrator/examples/practice-ui-review-brief.md",
      command: "npm run qa:practice"
    },
    {
      path: ".codex/skills/verification-orchestrator/examples/lecture-cuts-review-brief.md",
      command: "node scripts/run-lecture-cuts-hook.js pre-handoff"
    }
  ];
  for (const example of examples) {
    const text = readText(example.path);
    if (!text) {
      continue;
    }
    if (!text.includes(example.command)) {
      errors.push(`${example.path} missing command: ${example.command}`);
    }
    if (!/Max verifier-improvement attempts: `5`/.test(text)) {
      errors.push(`${example.path} must show default verifier-improvement attempts as 5`);
    }
    assertNoGlobalArtifactPath(text, example.path);
  }
}

for (const file of requiredFiles) {
  if (!fs.existsSync(path.join(root, file))) {
    errors.push(`missing required file: ${file}`);
  }
}

validateSkill();
validateLoopRunner();
validateBlindSpotProbe();
validateProbeOfProbeFixtures();
validateProbeOfProbeScript();
validateTaskResolver();
validateLoopFixtures();
validateMatrix();
validateTaskPacks();
validateTemplates();
validateStateSchema();
validateState();
validatePromotionLog();
validateExamples();

if (warnings.length > 0) {
  for (const warning of warnings) {
    console.warn(`WARN ${warning}`);
  }
}

if (errors.length > 0) {
  for (const error of errors) {
    console.error(`FAIL ${error}`);
  }
  process.exit(1);
}

console.log("PASS verification-orchestrator contract");
