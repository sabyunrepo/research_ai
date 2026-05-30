#!/usr/bin/env node
const { spawnSync } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

const projectRoot = path.resolve(__dirname, "..");

function readInput() {
  try {
    const input = fs.readFileSync(0, "utf8").trim();
    return input ? JSON.parse(input) : {};
  } catch {
    return {};
  }
}

function writeJson(payload) {
  process.stdout.write(`${JSON.stringify(payload)}\n`);
}

function writeLog(text) {
  if (text) {
    process.stderr.write(text.endsWith("\n") ? text : `${text}\n`);
  }
}

function blockContinuation(reason) {
  writeJson({
    decision: "block",
    continue: false,
    reason,
    systemMessage: reason,
  });
  process.exit(0);
}

const hookInput = readInput();
const result = spawnSync(process.execPath, ["scripts/run-lecture-cuts-hook.js", "pre-handoff"], {
  cwd: projectRoot,
  encoding: "utf8",
  stdio: ["ignore", "pipe", "pipe"],
});

writeLog(result.stdout);
writeLog(result.stderr);

const baseReason = result.error
  ? `Project Stop hook could not start: ${result.error.message}`
  : "Project Stop hook found remaining work before final response.";
const reason = [
  baseReason,
  "Continue working instead of sending the final answer. Run `node scripts/run-lecture-cuts-hook.js pre-handoff`, fix the reported failure, and verify again.",
  result.stdout,
  result.stderr,
].filter(Boolean).join("\n").slice(0, 12000);

if (hookInput.stop_hook_active) {
  writeJson({
    continue: false,
    decision: "block",
    reason,
    systemMessage: reason,
  });
  process.exit(0);
}

if (result.status === 0) {
  writeJson({ continue: true });
  process.exit(0);
}

blockContinuation(reason);
