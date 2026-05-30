#!/usr/bin/env node
const fs = require("node:fs");
const path = require("node:path");

const PROJECT_ROOT = path.resolve(__dirname, "..");
const STATUS_PATH = path.join(PROJECT_ROOT, ".agent-status.json");

const status = {
  status: "processing",
  attempts: 0,
  max_block_attempts: 3,
  stop_hook_active: false,
  started_at: new Date().toISOString(),
};

fs.writeFileSync(STATUS_PATH, `${JSON.stringify(status, null, 2)}\n`, "utf8");

