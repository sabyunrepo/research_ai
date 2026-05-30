#!/usr/bin/env node
const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const projectRoot = path.resolve(__dirname, "..");

function readInput() {
  try {
    const input = fs.readFileSync(0, "utf8").trim();
    return input ? JSON.parse(input) : {};
  } catch {
    return {};
  }
}

const hookInput = readInput();
const result = spawnSync(process.execPath, ["scripts/agent-stop-check.js", "--allow-empty-evidence"], {
  cwd: projectRoot,
  input: `${JSON.stringify(hookInput)}\n`,
  encoding: "utf8",
  stdio: ["pipe", "pipe", "pipe"],
});

if (result.stderr) {
  process.stderr.write(result.stderr);
}

if (result.stdout) {
  try {
    const payload = JSON.parse(result.stdout.trim().split(/\n/).at(-1));
    if (payload.decision === "block") {
      process.stdout.write(`${JSON.stringify({
        decision: "block",
        continue: false,
        reason: payload.reason || payload.systemMessage || "Project Stop hook found remaining work.",
        systemMessage: payload.systemMessage || payload.reason || "Project Stop hook found remaining work.",
      })}\n`);
    } else {
      process.stdout.write(`${JSON.stringify({ continue: true })}\n`);
    }
  } catch {
    process.stdout.write(`${JSON.stringify({
      continue: true,
      reason: "Project Stop hook returned unparsable output, so Codex wrapper allowed to avoid invalid JSON failure.",
    })}\n`);
  }
  process.exit(0);
}

const reason = result.error
  ? `Project Stop hook could not start: ${result.error.message}`
  : "Project Stop hook did not return JSON.";
process.stdout.write(`${JSON.stringify({ decision: "allow", continue: true, reason })}\n`);
