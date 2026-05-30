#!/usr/bin/env node

const { spawnSync } = require("node:child_process");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const runner = "node scripts/run-verification-orchestrator-loop.js";

const cases = [
  {
    name: "default validator pass runs default blind spot probe",
    command: `${runner}`,
    expectStatus: 0,
    expectOutput: [
      "check verifier blind spot",
      "node scripts/probe-verification-orchestrator-blind-spots.js",
      "no target defect or verifier blind spot detected",
      "verifier-improvement budget used 0/5",
      "target repairs 0",
    ],
  },
  {
    name: "target repair success loops back to verification and passes",
    command: [
      runner,
      "--verify-command \"node -e \\\"const fs=require('fs'); const p='.tmp/verification-loop-target-fixed'; process.exit(fs.existsSync(p)?0:1)\\\"\"",
      "--target-repair-command \"mkdir -p .tmp && touch .tmp/verification-loop-target-fixed\"",
      "--max-target-repairs 2",
    ].join(" "),
    setup: "rm -f .tmp/verification-loop-target-fixed",
    cleanup: "rm -f .tmp/verification-loop-target-fixed",
    expectStatus: 0,
    expectOutput: ["repair target 1/2", "target repairs 1"],
  },
  {
    name: "target repair command failure blocks immediately",
    command: [
      runner,
      "--verify-command \"node -e \\\"process.exit(1)\\\"\"",
      "--target-repair-command \"node -e \\\"process.exit(2)\\\"\"",
    ].join(" "),
    expectStatus: 1,
    expectOutput: ["BLOCKED target repair command failed with exit 2"],
  },
  {
    name: "target repair limit blocks repeated target defects",
    command: [
      runner,
      "--verify-command \"node -e \\\"process.exit(1)\\\"\"",
      "--target-repair-command \"node -e \\\"process.exit(0)\\\"\"",
      "--max-target-repairs 2",
    ].join(" "),
    expectStatus: 1,
    expectOutput: ["BLOCKED target repair loop exceeded 2 attempt(s)."],
  },
  {
    name: "blind spot improvement success consumes one improvement budget and passes",
    command: [
      runner,
      "--max-attempts 5",
      "--verify-command \"node -e \\\"process.exit(0)\\\"\"",
      "--blind-spot-command \"node -e \\\"const fs=require('fs'); const p='.tmp/verification-loop-blind-spot-fixed'; process.exit(fs.existsSync(p)?0:1)\\\"\"",
      "--improve-verifier-command \"mkdir -p .tmp && touch .tmp/verification-loop-blind-spot-fixed\"",
    ].join(" "),
    setup: "rm -f .tmp/verification-loop-blind-spot-fixed",
    cleanup: "rm -f .tmp/verification-loop-blind-spot-fixed",
    expectStatus: 0,
    expectOutput: ["improve verifier 1/5", "verifier-improvement budget used 1/5"],
  },
  {
    name: "verifier improvement command failure blocks immediately",
    command: [
      runner,
      "--verify-command \"node -e \\\"process.exit(0)\\\"\"",
      "--blind-spot-command \"node -e \\\"process.exit(1)\\\"\"",
      "--improve-verifier-command \"node -e \\\"process.exit(3)\\\"\"",
    ].join(" "),
    expectStatus: 1,
    expectOutput: ["BLOCKED verifier improvement command failed with exit 3"],
  },
  {
    name: "verifier improvement limit blocks repeated blind spots",
    command: [
      runner,
      "--max-attempts 2",
      "--verify-command \"node -e \\\"process.exit(0)\\\"\"",
      "--blind-spot-command \"node -e \\\"process.exit(1)\\\"\"",
      "--improve-verifier-command \"node -e \\\"process.exit(0)\\\"\"",
    ].join(" "),
    expectStatus: 1,
    expectOutput: ["BLOCKED verifier improvement loop exceeded 2 attempt(s)."],
  },
];

function runShell(command) {
  return spawnSync(command, {
    cwd: root,
    encoding: "utf8",
    shell: true,
    stdio: ["ignore", "pipe", "pipe"],
  });
}

function runCase(testCase) {
  if (testCase.setup) {
    runShell(testCase.setup);
  }

  const result = runShell(testCase.command);
  const output = `${result.stdout || ""}${result.stderr || ""}`;

  if (testCase.cleanup) {
    runShell(testCase.cleanup);
  }

  const errors = [];
  if (result.status !== testCase.expectStatus) {
    errors.push(`expected exit ${testCase.expectStatus}, got ${result.status}`);
  }
  for (const expected of testCase.expectOutput) {
    if (!output.includes(expected)) {
      errors.push(`missing output: ${expected}`);
    }
  }

  if (errors.length > 0) {
    console.error(`FAIL ${testCase.name}`);
    console.error(errors.join("\n"));
    console.error(output.trim());
    return false;
  }

  console.log(`PASS ${testCase.name}`);
  return true;
}

let passed = 0;
for (const testCase of cases) {
  if (runCase(testCase)) {
    passed += 1;
  }
}

if (passed !== cases.length) {
  console.error(`FAIL verification orchestrator loop fixtures ${passed}/${cases.length}`);
  process.exit(1);
}

console.log(`PASS verification orchestrator loop fixtures ${passed}/${cases.length}`);
