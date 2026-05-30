#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const matrixPath = path.join(root, ".codex/skills/verification-orchestrator/matrices/task-to-verifier.json");
const packsDir = path.join(root, ".codex/skills/verification-orchestrator/packs");

function usage() {
  console.error(`Usage:
  node scripts/resolve-verification-task.js --task-type <type>
  node scripts/resolve-verification-task.js --task "<free text description>"

Options:
  --json              Emit JSON only.
`);
}

function optionValue(argv, name) {
  const index = argv.indexOf(name);
  if (index !== -1) {
    return argv[index + 1];
  }
  const inline = argv.find((arg) => arg.startsWith(`${name}=`));
  return inline ? inline.slice(name.length + 1) : undefined;
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function loadPacks() {
  const packs = new Map();
  for (const entry of fs.readdirSync(packsDir)) {
    if (!entry.endsWith(".json")) {
      continue;
    }
    const pack = readJson(path.join(packsDir, entry));
    packs.set(pack.taskType, pack);
  }
  return packs;
}

function classifyTask(description, matrix) {
  const text = description.toLowerCase();
  const rules = [
    ["pptx-deck", ["pptx", "powerpoint", ".pptx", "파워포인트", "피피티", "ppt"]],
    ["slide-deck", ["slide", "deck", "lecture", "슬라이드", "덱", "강의자료"]],
    ["schedule-plan", ["schedule", "calendar", "deadline", "roadmap", "일정", "마감", "캘린더", "로드맵"]],
    ["ops-checklist", ["checklist", "runbook", "release", "rollback", "운영", "체크리스트", "런북", "배포"]],
    ["document-review", ["document", "report", "prd", "policy", "문서", "보고서", "기획안", "정책"]],
    ["context-research", ["research", "source", "citation", "자료조사", "근거", "출처"]],
    ["security-sensitive", ["security", "auth", "secret", "permission", "보안", "권한", "시크릿"]],
    ["code-change", ["code", "test", "api", "bug", "refactor", "코드", "테스트", "버그", "리팩터"]],
  ];
  const knownTypes = new Set(matrix.taskTypes.map((task) => task.id));
  for (const [type, keywords] of rules) {
    if (knownTypes.has(type) && keywords.some((keyword) => text.includes(keyword))) {
      return type;
    }
  }
  return matrix.defaultTaskType;
}

function resolveTask(taskType, packs, matrix) {
  const matrixTask = matrix.taskTypes.find((task) => task.id === taskType);
  if (!matrixTask) {
    throw new Error(`unknown task type: ${taskType}`);
  }
  const pack = packs.get(taskType) || null;
  return {
    taskType,
    verifierProfiles: matrixTask.verifierProfiles,
    mandatoryReads: matrixTask.mandatoryReads,
    evidenceCommands: matrixTask.evidenceCommands,
    evidenceArtifacts: matrixTask.evidenceArtifacts,
    blocksHandoffWhen: matrixTask.blocksHandoffWhen,
    verificationAxes: pack ? pack.verificationAxes : [],
    blindSpotPatterns: pack ? pack.blindSpotPatterns : [],
    repairStrategy: pack ? pack.repairStrategy : "Repair the target in the owning layer and rerun verification.",
    improveStrategy: pack
      ? pack.improveStrategy
      : "Add task-specific evidence, failure pattern, or validator coverage to the verifier harness.",
    sampleTasks: pack ? pack.sampleTasks : [],
  };
}

function main() {
  const argv = process.argv.slice(2);
  if (argv.includes("--help") || argv.includes("-h")) {
    usage();
    process.exit(0);
  }

  const matrix = readJson(matrixPath);
  const packs = loadPacks();
  const explicitType = optionValue(argv, "--task-type");
  const description = optionValue(argv, "--task") || "";
  const taskType = explicitType || classifyTask(description, matrix);
  const resolved = resolveTask(taskType, packs, matrix);

  if (argv.includes("--json")) {
    process.stdout.write(`${JSON.stringify(resolved, null, 2)}\n`);
    return;
  }

  console.log(`taskType: ${resolved.taskType}`);
  console.log(`verifierProfiles: ${resolved.verifierProfiles.map((profile) => profile.id).join(", ")}`);
  console.log(`evidenceCommands: ${resolved.evidenceCommands.join(" | ")}`);
  console.log(`blindSpotPatterns: ${resolved.blindSpotPatterns.map((pattern) => pattern.id).join(", ") || "none"}`);
}

main();
