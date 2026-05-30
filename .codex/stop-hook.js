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
const result = spawnSync(process.execPath, ["scripts/agent-stop-check.js"], {
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
        reason: payload.reason || payload.systemMessage || "Project Stop hook found remaining work.",
      })}\n`);
    } else {
      process.stdout.write(`${JSON.stringify({ continue: true })}\n`);
    }
  } catch {
    process.stdout.write(`${JSON.stringify({ continue: true })}\n`);
  }
  process.exit(0);
}

process.stdout.write(`${JSON.stringify({ continue: true })}\n`);
