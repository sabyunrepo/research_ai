const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const test = require("node:test");

const { loadEnvFileIfPresent } = require("../src/env-loader");

test("loads missing environment values from a dotenv file without overriding existing values", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "practice-env-"));
  const envFile = path.join(dir, ".env");
  fs.writeFileSync(
    envFile,
    [
      "OPEN_AI_API=file-key",
      "OPENAI_MODEL=\"gpt-5.1\"",
      "PRACTICE_JUDGE_PROVIDER=openai",
    ].join("\n"),
  );
  const env = {
    OPEN_AI_API: "existing-key",
  };

  loadEnvFileIfPresent({ env, filePath: envFile });

  assert.equal(env.OPEN_AI_API, "existing-key");
  assert.equal(env.OPENAI_MODEL, "gpt-5.1");
  assert.equal(env.PRACTICE_JUDGE_PROVIDER, "openai");
});

test("ignores missing dotenv files", () => {
  const env = {};

  loadEnvFileIfPresent({
    env,
    filePath: path.join(os.tmpdir(), "missing-practice-harness.env"),
  });

  assert.deepEqual(env, {});
});
