#!/usr/bin/env node
const fs = require("node:fs");
const path = require("node:path");

const PROJECT_ROOT = path.resolve(__dirname, "..");
const STATUS_PATH = path.join(PROJECT_ROOT, ".agent-status.json");

function readInput() {
  try {
    const raw = fs.readFileSync(0, "utf8").trim();
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

const hookInput = readInput();
const status = {
  status: "processing",
  attempts: 0,
  max_block_attempts: 3,
  stop_hook_active: false,
  started_at: new Date().toISOString(),
  session_id: hookInput.session_id || hookInput.sessionId,
};

fs.writeFileSync(STATUS_PATH, `${JSON.stringify(status, null, 2)}\n`, "utf8");
