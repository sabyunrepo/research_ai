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
const rawInput = JSON.stringify(hookInput);
if (/<hook_prompt\b|hook_run_id=|남은 작업이나 진행 중인 계획이 감지되었습니다/.test(rawInput)) {
  const previous = fs.existsSync(STATUS_PATH)
    ? JSON.parse(fs.readFileSync(STATUS_PATH, "utf8"))
    : {};
  const now = new Date().toISOString();
  fs.writeFileSync(
    STATUS_PATH,
    `${JSON.stringify(
      {
        ...previous,
        status: "finished",
        stop_hook_active: false,
        last_checked_at: now,
        finished_at: previous.finished_at || now,
        last_reason: "Stop hook reminder prompt ignored by UserPromptSubmit.",
      },
      null,
      2,
    )}\n`,
    "utf8",
  );
  process.exit(0);
}

const status = {
  status: "processing",
  attempts: 0,
  max_block_attempts: 3,
  stop_hook_active: false,
  started_at: new Date().toISOString(),
  session_id: hookInput.session_id || hookInput.sessionId,
};

fs.writeFileSync(STATUS_PATH, `${JSON.stringify(status, null, 2)}\n`, "utf8");
