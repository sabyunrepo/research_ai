#!/usr/bin/env node

const { spawn } = require("node:child_process");
const http = require("node:http");
const net = require("node:net");
const path = require("node:path");

const { createPracticeApp } = require("../practice-harness/src/create-practice-app");
const {
  createPracticeDefinitionStore,
} = require("../practice-harness/src/practice-definition-store");
const {
  createMemoryAttemptStore,
} = require("../practice-harness/src/stores/memory-attempt-store");
const {
  successfulAttemptCaseByAct,
} = require("../practice-harness/test/helpers/successful-attempts");

const HOST = "127.0.0.1";
const TEST_TIMEOUT_MS = 30_000;
const FETCH_TIMEOUT_MS = 5_000;
const CHILD_KILL_GRACE_MS = 1_000;
const LECTURE_SERVER_READY_TEXT = "Presenter review server:";

function runPracticeHarnessTests() {
  return new Promise((resolve, reject) => {
    let settled = false;
    const child = spawn("node --test practice-harness/test/*.test.js", {
      shell: true,
      stdio: "inherit",
    });
    const timeout = setTimeout(() => {
      if (settled) return;
      child.kill("SIGTERM");
      setTimeout(() => {
        if (!settled) child.kill("SIGKILL");
      }, CHILD_KILL_GRACE_MS).unref();
    }, TEST_TIMEOUT_MS);

    function finish(callback) {
      if (settled) return;
      settled = true;
      clearTimeout(timeout);
      callback();
    }

    child.on("error", (error) => {
      finish(() => reject(error));
    });
    child.on("close", (code, signal) => {
      if (code === 0) {
        finish(resolve);
        return;
      }

      finish(() =>
        reject(
          new Error(
            signal
              ? `practice harness tests terminated by ${signal}`
              : `practice harness tests exited with status ${code}`,
          ),
        ),
      );
    });
  });
}

function listen(server) {
  return new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, HOST, () => {
      server.off("error", reject);
      resolve();
    });
  });
}

function closeServer(server) {
  return new Promise((resolve, reject) => {
    server.close((error) => {
      if (error) reject(error);
      else resolve();
    });
  });
}

async function fetchJson(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    signal: options.signal || AbortSignal.timeout(FETCH_TIMEOUT_MS),
  });
  const responseText = await response.text();
  let body = {};
  try {
    body = responseText ? JSON.parse(responseText) : {};
  } catch (error) {
    throw new Error(
      `${options.method || "GET"} ${url} returned non-JSON HTTP ${
        response.status
      }: ${responseText.slice(0, 240)}`,
    );
  }

  return { response, body };
}

async function postAttempt({ baseUrl, practiceId, body }) {
  const url = `${baseUrl}/api/practices/${practiceId}/attempts`;
  const response = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
  });
  const responseText = await response.text();
  let responseBody;
  try {
    responseBody = responseText ? JSON.parse(responseText) : {};
  } catch (error) {
    throw new Error(
      `POST ${practiceId} returned non-JSON HTTP ${response.status} from ${url}: ${responseText.slice(
        0,
        240,
      )}`,
    );
  }

  if (response.status !== 201 || responseBody.ok !== true) {
    throw new Error(
      `POST ${practiceId} failed with HTTP ${response.status} from ${url}: ${JSON.stringify(
        responseBody,
      )}`,
    );
  }

  if (!responseBody.attempt || responseBody.attempt.unlocked !== true) {
    throw new Error(`POST ${practiceId} did not produce an unlocked attempt`);
  }

  return responseBody.attempt;
}

async function runSmokeChecks() {
  const passedSmokeActs = new Set();
  function logSmokePass(act) {
    passedSmokeActs.add(act);
    console.log(`PASS ${act} smoke attempt`);
  }

  const server = http.createServer(
    createPracticeApp({
      definitionStore: createPracticeDefinitionStore(),
      attemptStore: createMemoryAttemptStore(),
      judgeProvider: "none",
    }),
  );

  await listen(server);
  const { port } = server.address();
  const baseUrl = `http://${HOST}:${port}`;

  try {
    for (const actNumber of [1, 2, 3, 4, 5, 6]) {
      const attemptCase = successfulAttemptCaseByAct(actNumber);
      const attempt = await postAttempt({
        baseUrl,
        practiceId: attemptCase.practiceId,
        body: attemptCase.body,
      });
      if (actNumber === 6 && !attempt.unlockArtifact) {
        throw new Error("POST act6-stop-hook-gate did not return an unlock artifact");
      }
      logSmokePass(`act${actNumber}`);
    }

    for (const act of ["act1", "act2", "act3", "act4", "act5", "act6"]) {
      if (!passedSmokeActs.has(act)) {
        throw new Error(`Missing PASS ${act} smoke attempt`);
      }
    }

    const act1Attempt = successfulAttemptCaseByAct(1);
    const duplicateBody = {
      ...act1Attempt.body,
      learnerSessionId: "verify-double-click",
      clientAttemptId: "verify-act1-double-click-001",
    };
    const duplicateResponses = await Promise.all([
      postAttempt({
        baseUrl,
        practiceId: act1Attempt.practiceId,
        body: duplicateBody,
      }),
      postAttempt({
        baseUrl,
        practiceId: act1Attempt.practiceId,
        body: duplicateBody,
      }),
    ]);
    if (duplicateResponses[0].attemptId !== duplicateResponses[1].attemptId) {
      throw new Error("duplicate clientAttemptId created more than one attempt");
    }
    console.log("PASS duplicate-click idempotency smoke");

    const learnerIds = Array.from({ length: 8 }, (_, index) => `verify-learner-${index + 1}`);
    const concurrentAttempts = await Promise.all(
      learnerIds.map((learnerSessionId) =>
        postAttempt({
          baseUrl,
          practiceId: act1Attempt.practiceId,
          body: {
            ...act1Attempt.body,
            learnerSessionId,
            clientAttemptId: `${learnerSessionId}-attempt-001`,
          },
        }),
      ),
    );
    const concurrentAttemptIds = new Set(concurrentAttempts.map((attempt) => attempt.attemptId));
    if (concurrentAttemptIds.size !== learnerIds.length) {
      throw new Error("concurrent learner submissions were not stored separately");
    }
    for (const [index, attempt] of concurrentAttempts.entries()) {
      if (
        attempt.learnerSessionId !== learnerIds[index] ||
        attempt.attemptNumber !== 1
      ) {
        throw new Error("concurrent learner attempt metadata was mixed");
      }
    }
    console.log("PASS concurrent learner smoke");
  } finally {
    await closeServer(server);
  }
}

function parseLectureServerBaseUrl(stdout) {
  const match = stdout.match(/Presenter review server: (http:\/\/[^\s/]+)(?:\/|\s|$)/);
  if (!match) return null;
  return match[1];
}

function formatChildOutput({ stdout, stderr }) {
  return [`stdout:\n${stdout || "(empty)"}`, `stderr:\n${stderr || "(empty)"}`].join(
    "\n",
  );
}

function terminateChild(child) {
  return new Promise((resolve) => {
    if (child.exitCode !== null || child.signalCode !== null) {
      resolve();
      return;
    }

    const killTimeout = setTimeout(() => {
      child.kill("SIGKILL");
    }, CHILD_KILL_GRACE_MS);
    child.once("exit", () => {
      clearTimeout(killTimeout);
      resolve();
    });
    child.kill("SIGTERM");
  });
}

function startLectureServer({ audienceOnly = false }) {
  return new Promise((resolve, reject) => {
    const args = [
      path.join("scripts", "serve-lecture-cuts-review.js"),
      "--port",
      "0",
    ];
    if (audienceOnly) args.push("--audience-only");

    const child = spawn(process.execPath, args, {
      cwd: path.resolve(__dirname, ".."),
      stdio: ["ignore", "pipe", "pipe"],
    });
    let stdout = "";
    let stderr = "";
    let settled = false;

    async function fail(error) {
      if (settled) return;
      settled = true;
      clearTimeout(timeout);
      await terminateChild(child);
      reject(error);
    }

    const timeout = setTimeout(() => {
      fail(
        new Error(
          `lecture server did not start within ${FETCH_TIMEOUT_MS}ms\n${formatChildOutput(
            { stdout, stderr },
          )}`,
        ),
      );
    }, FETCH_TIMEOUT_MS);

    function finish(callback) {
      if (settled) return;
      settled = true;
      clearTimeout(timeout);
      callback();
    }

    child.stdout.on("data", (chunk) => {
      stdout += chunk.toString("utf8");
      const baseUrl = parseLectureServerBaseUrl(stdout);
      if (stdout.includes(LECTURE_SERVER_READY_TEXT) && baseUrl) {
        finish(() =>
          resolve({ baseUrl, child, stdout: () => stdout, stderr: () => stderr }),
        );
      }
    });
    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString("utf8");
    });
    child.on("error", (error) => {
      fail(error);
    });
    child.on("exit", (code, signal) => {
      finish(() =>
        reject(
          new Error(
            signal
              ? `lecture server terminated by ${signal}\n${formatChildOutput({
                  stdout,
                  stderr,
                })}`
              : `lecture server exited with status ${code}\n${formatChildOutput({
                  stdout,
                  stderr,
                })}`,
          ),
        ),
      );
    });
  });
}

async function stopLectureServer(child) {
  await terminateChild(child);
}

async function withLectureServer(options, callback) {
  const server = await startLectureServer(options);
  try {
    return await callback(server.baseUrl);
  } finally {
    await stopLectureServer(server.child);
  }
}

async function assertOkJson({ method = "GET", url, expectedStatus = 200 }) {
  const { response, body } = await fetchJson(url, {
    method,
    headers: method === "GET" ? undefined : { "content-type": "application/json" },
  });
  if (response.status !== expectedStatus || body.ok !== true) {
    throw new Error(
      `${method} ${url} expected HTTP ${expectedStatus} ok=true, got HTTP ${
        response.status
      }: ${JSON.stringify(body)}`,
    );
  }
  return body;
}

function assertAct1ThroughAct6PracticeSummaries(practicesBody) {
  if (!Array.isArray(practicesBody.practices)) {
    throw new Error("GET /api/practices did not return a practices array");
  }

  const summaries = practicesBody.practices.map((practice) => ({
    id: practice.id,
    act: practice.act,
  }));
  const expectedSummaries = [
    { id: "act1-info-selection", act: 1 },
    { id: "act2-prompt-brief", act: 2 },
    { id: "act3-context-workbench", act: 3 },
    { id: "act4-mini-brainstorming-skill", act: 4 },
    { id: "act5-agent-team-runbook", act: 5 },
    { id: "act6-stop-hook-gate", act: 6 },
  ];

  for (const expectedSummary of expectedSummaries) {
    if (
      !summaries.some(
        (summary) =>
          summary.id === expectedSummary.id && summary.act === expectedSummary.act,
      )
    ) {
      throw new Error(
        `GET /api/practices missing ${expectedSummary.id} act ${expectedSummary.act}`,
      );
    }
  }
}

function rawHttpRequest({ port, requestText }) {
  return new Promise((resolve, reject) => {
    let responseText = "";
    const socket = net.createConnection({ host: HOST, port }, () => {
      socket.write(requestText);
    });
    const timeout = setTimeout(() => {
      socket.destroy();
      reject(new Error("raw HTTP request timed out"));
    }, FETCH_TIMEOUT_MS);

    socket.setEncoding("utf8");
    socket.on("data", (chunk) => {
      responseText += chunk;
    });
    socket.on("end", () => {
      clearTimeout(timeout);
      resolve(responseText);
    });
    socket.on("error", (error) => {
      clearTimeout(timeout);
      reject(error);
    });
  });
}

function portFromBaseUrl(baseUrl) {
  return Number(new URL(baseUrl).port);
}

async function runLectureIntegrationSmoke() {
  await withLectureServer({ audienceOnly: false }, async (baseUrl) => {
    await assertOkJson({ url: `${baseUrl}/api/presentation/state` });
    const practices = await assertOkJson({ url: `${baseUrl}/api/practices` });
    assertAct1ThroughAct6PracticeSummaries(practices);
    const act1Attempt = successfulAttemptCaseByAct(1);
    await postAttempt({
      baseUrl,
      practiceId: act1Attempt.practiceId,
      body: act1Attempt.body,
    });
    const presentationTypo = await fetch(`${baseUrl}/api/presentation/stateXYZ`, {
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });
    if (presentationTypo.status === 200) {
      throw new Error("GET /api/presentation/stateXYZ unexpectedly matched state route");
    }
    const audienceTypo = await fetch(`${baseUrl}/api/audience/slidesXYZ`, {
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });
    if (audienceTypo.status === 200) {
      throw new Error("GET /api/audience/slidesXYZ unexpectedly matched slides route");
    }
  });

  await withLectureServer({ audienceOnly: true }, async (baseUrl) => {
    assertAct1ThroughAct6PracticeSummaries(
      await assertOkJson({ url: `${baseUrl}/api/practices` }),
    );
    const malformed = await fetch(`${baseUrl}/%EA`, {
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });
    if (malformed.status !== 400) {
      throw new Error(`malformed audience-only path expected HTTP 400, got ${malformed.status}`);
    }
    const rawMalformed = await rawHttpRequest({
      port: portFromBaseUrl(baseUrl),
      requestText: `GET http://% HTTP/1.1\r\nHost: ${HOST}:${portFromBaseUrl(
        baseUrl,
      )}\r\nConnection: close\r\n\r\n`,
    });
    if (!rawMalformed.startsWith("HTTP/1.1 400")) {
      throw new Error(
        `malformed absolute-form request expected HTTP 400, got ${rawMalformed
          .split("\r\n")[0]
          .trim()}`,
      );
    }
    assertAct1ThroughAct6PracticeSummaries(
      await assertOkJson({ url: `${baseUrl}/api/practices` }),
    );
    const response = await fetch(`${baseUrl}/api/presentation/state`, {
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });
    if (response.status !== 404) {
      throw new Error(
        `audience-only GET /api/presentation/state expected HTTP 404, got ${response.status}`,
      );
    }
  });

  console.log("PASS lecture integration smoke");
}

async function main() {
  await runPracticeHarnessTests();
  console.log("PASS practice harness tests");

  await runSmokeChecks();

  await runLectureIntegrationSmoke();
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exitCode = 1;
});
