#!/usr/bin/env node
const { spawnSync } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const deckRoot = path.join(root, "lecture-cuts");
const hookDir = path.join(deckRoot, "hooks");
const eventName = process.argv[2] || "manual";

function readHookFiles() {
  if (!fs.existsSync(hookDir)) {
    return [];
  }
  return fs
    .readdirSync(hookDir)
    .filter((file) => file.endsWith(".json"))
    .sort()
    .map((file) => {
      const fullPath = path.join(hookDir, file);
      return {
        file,
        fullPath,
        config: JSON.parse(fs.readFileSync(fullPath, "utf8")),
      };
    });
}

function matchingHooks() {
  return readHookFiles().filter(({ config }) => Array.isArray(config.events) && config.events.includes(eventName));
}

function runCommand(hook) {
  const command = hook.config.command;
  if (!command) {
    throw new Error(`${hook.file} does not define command`);
  }

  console.log(`[lecture-cuts-hook] ${eventName}: ${hook.config.name || hook.file}`);
  console.log(`[lecture-cuts-hook] command: ${command}`);

  const result = spawnSync(command, {
    cwd: deckRoot,
    shell: true,
    stdio: "inherit",
    env: {
      ...process.env,
      LECTURE_CUTS_HOOK_EVENT: eventName,
      LECTURE_CUTS_ROOT: deckRoot,
    },
  });

  if (result.error) {
    throw result.error;
  }
  if (result.status !== 0) {
    throw new Error(`${hook.file} exited with status ${result.status}`);
  }
}

function main() {
  const hooks = matchingHooks();
  if (hooks.length === 0) {
    console.log(`[lecture-cuts-hook] ${eventName}: no matching hooks`);
    return;
  }

  hooks.forEach(runCommand);
  console.log(`[lecture-cuts-hook] ${eventName}: passed ${hooks.length} hook(s)`);
}

try {
  main();
} catch (error) {
  console.error(`[lecture-cuts-hook] ${eventName}: failed`);
  console.error(error.message);
  process.exitCode = 1;
}
