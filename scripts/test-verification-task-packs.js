#!/usr/bin/env node

const { spawnSync } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const matrixPath = path.join(root, ".codex/skills/verification-orchestrator/matrices/task-to-verifier.json");
const packsDir = path.join(root, ".codex/skills/verification-orchestrator/packs");
const resolver = "node scripts/resolve-verification-task.js --json";

const requiredPackTypes = [
  "code-change",
  "slide-deck",
  "pptx-deck",
  "schedule-plan",
  "document-review",
  "ops-checklist",
];

const sampleCases = [
  {
    name: "code bugfix resolves to code-change",
    description: "코드 API 버그 수정과 테스트 회귀 검증",
    expectType: "code-change",
    expectPatterns: ["code-no-focused-regression"],
  },
  {
    name: "generated slide deck resolves to slide-deck",
    description: "강의자료 슬라이드 덱 생성물 렌더링과 발표 흐름 검증",
    expectType: "slide-deck",
    expectPatterns: ["slide-render-only-meaning-miss", "slide-desktop-only-mobile-miss"],
  },
  {
    name: "pptx deck resolves to pptx-deck",
    description: "클라이언트 PPTX 파워포인트 파일 검증",
    expectType: "pptx-deck",
    expectPatterns: ["pptx-unopened-file-pass"],
  },
  {
    name: "schedule plan resolves to schedule-plan",
    description: "다음 주 일정 마감 캘린더와 의존성 체크",
    expectType: "schedule-plan",
    expectPatterns: ["schedule-ownerless-task-pass"],
  },
  {
    name: "document review resolves to document-review",
    description: "PRD 문서 보고서 근거와 모순 검토",
    expectType: "document-review",
    expectPatterns: ["document-unsupported-claim-pass"],
  },
  {
    name: "ops checklist resolves to ops-checklist",
    description: "배포 운영 체크리스트 롤백 런북 확인",
    expectType: "ops-checklist",
    expectPatterns: ["ops-no-rollback-pass"],
  },
  {
    name: "unknown work falls back to generic-code-change",
    description: "분류하기 어려운 일반 작업",
    expectType: "generic-code-change",
    expectPatterns: [],
  },
];

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function fail(message) {
  console.error(`FAIL ${message}`);
  process.exitCode = 1;
}

function validatePacks() {
  const matrix = readJson(matrixPath);
  const matrixTypes = new Set(matrix.taskTypes.map((task) => task.id));

  for (const taskType of requiredPackTypes) {
    const filePath = path.join(packsDir, `${taskType}.json`);
    if (!fs.existsSync(filePath)) {
      fail(`missing task pack: ${taskType}`);
      continue;
    }
    const pack = readJson(filePath);
    if (pack.schemaVersion !== 1) {
      fail(`${taskType} pack schemaVersion must be 1`);
    }
    if (pack.taskType !== taskType) {
      fail(`${taskType} pack has mismatched taskType ${pack.taskType}`);
    }
    if (!matrixTypes.has(taskType)) {
      fail(`${taskType} pack has no matrix route`);
    }
    for (const field of ["verificationAxes", "blindSpotPatterns", "sampleTasks"]) {
      if (!Array.isArray(pack[field]) || pack[field].length === 0) {
        fail(`${taskType} pack must define non-empty ${field}`);
      }
    }
    for (const pattern of pack.blindSpotPatterns) {
      for (const field of ["id", "severity", "description", "detector"]) {
        if (typeof pattern[field] !== "string" || pattern[field].trim() === "") {
          fail(`${taskType} blindSpotPatterns entries require ${field}`);
        }
      }
    }
    for (const sampleTask of pack.sampleTasks) {
      for (const field of ["id", "description", "mustSelect", "mustDetect"]) {
        if (sampleTask[field] === undefined) {
          fail(`${taskType} sampleTasks entries require ${field}`);
        }
      }
    }
  }
}

function runResolver(description) {
  const result = spawnSync(`${resolver} --task ${JSON.stringify(description)}`, {
    cwd: root,
    encoding: "utf8",
    shell: true,
    stdio: ["ignore", "pipe", "pipe"],
  });
  if (result.status !== 0) {
    throw new Error(`${result.stderr || result.stdout}`);
  }
  return JSON.parse(result.stdout);
}

function validateSampleCases() {
  for (const testCase of sampleCases) {
    let resolved;
    try {
      resolved = runResolver(testCase.description);
    } catch (error) {
      fail(`${testCase.name}: resolver failed: ${error.message}`);
      continue;
    }
    if (resolved.taskType !== testCase.expectType) {
      fail(`${testCase.name}: expected ${testCase.expectType}, got ${resolved.taskType}`);
      continue;
    }
    if (!Array.isArray(resolved.evidenceCommands) || resolved.evidenceCommands.length === 0) {
      fail(`${testCase.name}: missing evidence commands`);
    }
    if (!Array.isArray(resolved.blocksHandoffWhen) || resolved.blocksHandoffWhen.length === 0) {
      fail(`${testCase.name}: missing block conditions`);
    }
    const patternIds = new Set((resolved.blindSpotPatterns || []).map((pattern) => pattern.id));
    for (const expectedPattern of testCase.expectPatterns) {
      if (!patternIds.has(expectedPattern)) {
        fail(`${testCase.name}: missing blind spot pattern ${expectedPattern}`);
      }
    }
    console.log(`PASS ${testCase.name}`);
  }
}

validatePacks();
validateSampleCases();

if (process.exitCode) {
  process.exit(process.exitCode);
}

console.log(`PASS verification task packs ${sampleCases.length}/${sampleCases.length}`);
