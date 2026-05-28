#!/usr/bin/env node

const http = require("node:http");

const { createPracticeApp } = require("../practice-harness/src/create-practice-app");
const {
  createPracticeStaticApp,
} = require("../practice-harness/src/create-practice-static-app");
const {
  createPracticeDefinitionStore,
} = require("../practice-harness/src/practice-definition-store");
const {
  createMemoryAttemptStore,
} = require("../practice-harness/src/stores/memory-attempt-store");
const {
  createJudgeProviderFromEnv,
} = require("../practice-harness/src/judge-providers/provider-registry");
const { loadEnvFileIfPresent } = require("../practice-harness/src/env-loader");

function parsePort(argv) {
  const portIndex = argv.indexOf("--port");
  if (portIndex === -1) return 4173;

  const rawPort = argv[portIndex + 1];
  const port = Number(rawPort);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error("--port must be an integer between 1 and 65535");
  }

  return port;
}

async function main() {
  loadEnvFileIfPresent({ env: process.env, filePath: ".env" });
  const port = parsePort(process.argv.slice(2));
  const host = process.env.HOST || "127.0.0.1";
  const apiApp = createPracticeApp({
    definitionStore: createPracticeDefinitionStore(),
    attemptStore: createMemoryAttemptStore(),
    judgeProvider: createJudgeProviderFromEnv(process.env),
  });
  const server = http.createServer(createPracticeStaticApp({ apiApp }));

  await new Promise((resolve) => server.listen(port, host, resolve));
  const address = server.address();
  const actualPort = typeof address === "object" && address ? address.port : port;
  console.log(`Practice harness server: http://${host}:${actualPort}/`);
  console.log(`Practice harness API: http://${host}:${actualPort}/api/practices`);
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
