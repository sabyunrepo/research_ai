#!/usr/bin/env node

const { spawnSync } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const statePath = path.join(root, ".codex/verification/capability-state.json");

function usage() {
  console.error(`Usage:
  node scripts/run-verification-orchestrator-loop.js [options]

Options:
  --max-attempts <n>              Max verifier-logic improvement attempts. Defaults to capability state or 5.
  --verify-command <command>      Target verification command. Defaults to validator.
  --target-repair-command <cmd>   Command that repairs detected target defects.
  --blind-spot-command <cmd>      Command that returns non-zero when verifier logic missed something. Defaults to the built-in blind-spot probe.
  --improve-verifier-command <cmd> Command that improves verifier logic after a blind spot.
  --max-target-repairs <n>        Max target repair loops before blocking. Defaults to 20.
`);
}

function optionValue(argv, names) {
  for (const name of names) {
    const index = argv.findIndex((arg) => arg === name);
    if (index !== -1) {
      return argv[index + 1];
    }
    const inline = argv.find((arg) => arg.startsWith(`${name}=`));
    if (inline) {
      return inline.slice(name.length + 1);
    }
  }
  return undefined;
}

function parsePositiveInteger(value, fallback, label) {
  if (value === undefined) {
    return fallback;
  }
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    console.error(`FAIL ${label} must be a positive integer: ${value}`);
    process.exit(2);
  }
  return parsed;
}

function defaultMaxAttempts() {
  try {
    const state = JSON.parse(fs.readFileSync(statePath, "utf8"));
    return Number.isInteger(state.defaultMaxAttempts) ? state.defaultMaxAttempts : 5;
  } catch {
    return 5;
  }
}

function defaultBlindSpotCommand() {
  return "node scripts/probe-verification-orchestrator-blind-spots.js";
}

function parseOptions(argv) {
  if (argv.includes("--help") || argv.includes("-h")) {
    usage();
    process.exit(0);
  }

  return {
    maxImprovements: parsePositiveInteger(
      optionValue(argv, ["--max-attempts", "--attempts"]),
      defaultMaxAttempts(),
      "max attempts",
    ),
    maxTargetRepairs: parsePositiveInteger(
      optionValue(argv, ["--max-target-repairs"]),
      20,
      "max target repairs",
    ),
    verifyCommand:
      optionValue(argv, ["--verify-command"]) ||
      "node scripts/validate-verification-orchestrator.js",
    targetRepairCommand: optionValue(argv, ["--target-repair-command"]),
    blindSpotCommand: optionValue(argv, ["--blind-spot-command"]) || defaultBlindSpotCommand(),
    improveVerifierCommand: optionValue(argv, ["--improve-verifier-command"]),
  };
}

function runCommand(label, command) {
  console.log(`=== ${label} ===`);
  console.log(`command: ${command}`);
  const result = spawnSync(command, {
    cwd: root,
    encoding: "utf8",
    shell: true,
    stdio: ["ignore", "pipe", "pipe"],
  });
  const output = `${result.stdout || ""}${result.stderr || ""}`.trim();
  if (output) {
    console.log(output);
  }
  const status = result.status === 0 ? "PASS" : "FAIL";
  console.log(`status: ${status} exit=${result.status}`);
  return { passed: result.status === 0, status: result.status, output };
}

function failBlocked(message) {
  console.error(`BLOCKED ${message}`);
  process.exit(1);
}

function main() {
  const options = parseOptions(process.argv.slice(2));
  let verifierImprovements = 0;
  let targetRepairs = 0;

  while (true) {
    const verification = runCommand("verify target", options.verifyCommand);

    if (!verification.passed) {
      if (!options.targetRepairCommand) {
        failBlocked(
          "target defect detected but no --target-repair-command was provided; repair the target and rerun.",
        );
      }
      targetRepairs += 1;
      if (targetRepairs > options.maxTargetRepairs) {
        failBlocked(`target repair loop exceeded ${options.maxTargetRepairs} attempt(s).`);
      }
      const repair = runCommand(
        `repair target ${targetRepairs}/${options.maxTargetRepairs}`,
        options.targetRepairCommand,
      );
      if (!repair.passed) {
        failBlocked(`target repair command failed with exit ${repair.status}.`);
      }
      continue;
    }

    const blindSpot = runCommand("check verifier blind spot", options.blindSpotCommand);
    if (blindSpot.passed) {
      console.log(
        `PASS no target defect or verifier blind spot detected; verifier-improvement budget used ${verifierImprovements}/${options.maxImprovements}; target repairs ${targetRepairs}`,
      );
      return;
    }

    if (!options.improveVerifierCommand) {
      failBlocked(
        "blind spot detected but no --improve-verifier-command was provided; improve verifier logic and rerun.",
      );
    }

    verifierImprovements += 1;
    if (verifierImprovements > options.maxImprovements) {
      failBlocked(`verifier improvement loop exceeded ${options.maxImprovements} attempt(s).`);
    }

    const improvement = runCommand(
      `improve verifier ${verifierImprovements}/${options.maxImprovements}`,
      options.improveVerifierCommand,
    );
    if (!improvement.passed) {
      failBlocked(`verifier improvement command failed with exit ${improvement.status}.`);
    }
  }
}

main();
