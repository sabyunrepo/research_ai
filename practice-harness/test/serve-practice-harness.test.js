const assert = require("node:assert/strict");
const fs = require("node:fs/promises");
const path = require("node:path");
const test = require("node:test");

const PROJECT_ROOT = path.join(__dirname, "..", "..");

test("practice harness server creates judge provider from environment", async () => {
  const script = await fs.readFile(
    path.join(PROJECT_ROOT, "scripts", "serve-practice-harness.js"),
    "utf8",
  );

  assert.match(script, /createJudgeProviderFromEnv/);
  assert.match(script, /judgeProvider:\s*createJudgeProviderFromEnv\(process\.env\)/);
});
