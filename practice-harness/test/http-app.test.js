const assert = require("node:assert/strict");
const http = require("node:http");
const test = require("node:test");

const { createPracticeApp } = require("../src/create-practice-app");
const { createPracticeDefinitionStore } = require("../src/practice-definition-store");
const { createMemoryAttemptStore } = require("../src/stores/memory-attempt-store");
const {
  cloneAttemptBody,
  successfulAttemptCaseByAct,
} = require("./helpers/successful-attempts");

async function createTestServer({ judgeProvider = "none" } = {}) {
  const server = http.createServer(
    createPracticeApp({
      definitionStore: createPracticeDefinitionStore(),
      attemptStore: createMemoryAttemptStore(),
      judgeProvider,
    }),
  );

  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const { port } = server.address();

  return {
    baseUrl: `http://127.0.0.1:${port}`,
    async close() {
      await new Promise((resolve, reject) => {
        server.close((error) => (error ? reject(error) : resolve()));
      });
    },
  };
}

async function requestJson(baseUrl, path, options = {}) {
  const headers = { ...(options.headers || {}) };
  let body = options.body;

  if (body !== undefined && typeof body !== "string" && !Buffer.isBuffer(body)) {
    body = JSON.stringify(body);
    headers["content-type"] = "application/json";
  }

  const response = await fetch(`${baseUrl}${path}`, {
    method: options.method || "GET",
    headers,
    body,
  });

  return {
    status: response.status,
    body: await response.json(),
  };
}

function assertSuccessfulUnlockedAttempt({ response, practiceId, learnerSessionId }) {
  assert.equal(response.status, 201);
  assert.equal(response.body.ok, true);
  assert.match(response.body.attempt.attemptId, /^attempt_\d{6}$/);
  assert.equal(response.body.attempt.practiceId, practiceId);
  assert.equal(response.body.attempt.learnerSessionId, learnerSessionId);
  assert.ok(response.body.attempt.score > 0);
  assert.equal(response.body.attempt.maxScore, 100);
  assert.equal(response.body.attempt.unlocked, true);
  assert.equal(response.body.attempt.judgeResult, null);
  assert.deepEqual(response.body.attempt.providerWarnings, []);
  assert.match(response.body.attempt.createdAt, /^\d{4}-\d{2}-\d{2}T/);
  assert.ok(Array.isArray(response.body.attempt.checks));
  assert.ok(response.body.attempt.checks.length > 0);
  assert.ok(Array.isArray(response.body.attempt.feedback));
  assert.ok(Array.isArray(response.body.attempt.verificationLog));
  assert.ok(response.body.attempt.verificationLog.length > 0);
}

function assertAttemptCorePersisted({ postAttempt, getAttempt }) {
  for (const field of [
    "attemptId",
    "practiceId",
    "learnerSessionId",
    "attemptNumber",
    "score",
    "maxScore",
    "unlocked",
    "checks",
    "feedback",
    "verificationLog",
    "unlockArtifact",
    "judgeResult",
    "providerWarnings",
    "createdAt",
  ]) {
    assert.deepEqual(getAttempt[field], postAttempt[field], `${field} persisted`);
  }
}

test("GET /api/practices returns act1 through act6 summaries", async () => {
  const server = await createTestServer();
  try {
    const response = await requestJson(server.baseUrl, "/api/practices");

    assert.equal(response.status, 200);
    assert.equal(response.body.ok, true);
    assert.deepEqual(response.body.practices, [
      {
        id: "act1-info-selection",
        title: "실습 1: 김아이에게 무엇을 알려줘야 할까요?",
        type: "multi-question-choice",
        maxScore: 100,
        unlockThreshold: 90,
        act: 1,
      },
      {
        id: "act2-prompt-brief",
        title: "실습 2: 김아이에게 제대로 업무 지시하기",
        type: "prompt-brief",
        maxScore: 100,
        unlockThreshold: 90,
        act: 2,
      },
      {
        id: "act3-context-workbench",
        title: "실습 3: CLAUDE.md 기본 기억을 정리합니다",
        type: "claude-memory",
        maxScore: 100,
        unlockThreshold: 90,
        act: 3,
      },
      {
        id: "act4-mini-brainstorming-skill",
        title: "실습 4: 미니 브레인스토밍 Skill을 만듭니다",
        type: "skill-document",
        maxScore: 100,
        unlockThreshold: 90,
        act: 4,
      },
      {
        id: "act5-agent-team-runbook",
        title: "실습 5: 로컬에서 김아이 팀을 실행합니다",
        type: "local-runbook",
        maxScore: 100,
        unlockThreshold: 80,
        act: 5,
      },
      {
        id: "act6-stop-hook-gate",
        title: "실습 6: 완료 전 Stop hook 검문소를 설계합니다",
        type: "checklist-unlock",
        maxScore: 100,
        unlockThreshold: 100,
        act: 6,
      },
    ]);
  } finally {
    await server.close();
  }
});

test("GET /api/practices/:id returns full practice definition for UI rendering", async () => {
  const server = await createTestServer();
  try {
    const response = await requestJson(server.baseUrl, "/api/practices/act5-agent-team-runbook");

    assert.equal(response.status, 200);
    assert.equal(response.body.ok, true);
    assert.equal(response.body.practice.id, "act5-agent-team-runbook");
    assert.equal(response.body.practice.type, "local-runbook");
    assert.equal(response.body.practice.act, 5);
    assert.ok(Array.isArray(response.body.practice.roles));
    assert.equal(Object.prototype.hasOwnProperty.call(response.body.practice, "checklist"), false);
    assert.equal(typeof response.body.practice.learning.teamPrompt, "string");
    assert.equal(typeof response.body.practice.learning.runbookTemplate, "string");
  } finally {
    await server.close();
  }
});

for (const act of [2, 3, 4, 5]) {
  test(`POST /api/practices act${act} successful attempt unlocks`, async () => {
    const server = await createTestServer();
    const attemptCase = successfulAttemptCaseByAct(act);
    try {
      const response = await requestJson(
        server.baseUrl,
        `/api/practices/${attemptCase.practiceId}/attempts`,
        {
          method: "POST",
          body: attemptCase.body,
        },
      );

      assertSuccessfulUnlockedAttempt({
        response,
        practiceId: attemptCase.practiceId,
        learnerSessionId: attemptCase.body.learnerSessionId,
      });
    } finally {
      await server.close();
    }
  });
}

test("GET attempt preserves successful act3 attempt core fields", async () => {
  const server = await createTestServer();
  const attemptCase = successfulAttemptCaseByAct(3);
  try {
    const postResponse = await requestJson(
      server.baseUrl,
      `/api/practices/${attemptCase.practiceId}/attempts`,
      {
        method: "POST",
        body: attemptCase.body,
      },
    );

    assertSuccessfulUnlockedAttempt({
      response: postResponse,
      practiceId: attemptCase.practiceId,
      learnerSessionId: attemptCase.body.learnerSessionId,
    });

    const getResponse = await requestJson(
      server.baseUrl,
      `/api/practices/${attemptCase.practiceId}/attempts/${postResponse.body.attempt.attemptId}`,
    );

    assert.equal(getResponse.status, 200);
    assert.equal(getResponse.body.ok, true);
    assertAttemptCorePersisted({
      postAttempt: postResponse.body.attempt,
      getAttempt: getResponse.body.attempt,
    });
  } finally {
    await server.close();
  }
});

test("POST /api/practices/act1-info-selection/attempts returns attempt JSON", async () => {
  const server = await createTestServer();
  const attemptCase = successfulAttemptCaseByAct(1);
  try {
    const response = await requestJson(
      server.baseUrl,
      `/api/practices/${attemptCase.practiceId}/attempts`,
      {
        method: "POST",
        body: attemptCase.body,
      },
    );

    assert.equal(response.status, 201);
    assert.equal(response.body.ok, true);
    assert.match(response.body.attempt.attemptId, /^attempt_\d{6}$/);
    assert.equal(response.body.attempt.practiceId, attemptCase.practiceId);
    assert.equal(response.body.attempt.learnerSessionId, attemptCase.body.learnerSessionId);
    assert.equal(response.body.attempt.attemptNumber, 1);
    assert.equal(response.body.attempt.score, 100);
    assert.equal(response.body.attempt.maxScore, 100);
    assert.equal(response.body.attempt.unlocked, true);
    assert.equal(response.body.attempt.judgeResult, null);
    assert.deepEqual(response.body.attempt.providerWarnings, []);
    assert.match(response.body.attempt.createdAt, /^\d{4}-\d{2}-\d{2}T/);
    assert.ok(Array.isArray(response.body.attempt.checks));
    assert.ok(Array.isArray(response.body.attempt.feedback));
    assert.ok(Array.isArray(response.body.attempt.questionScores));
    assert.equal(response.body.attempt.questionScores.length, 3);
    assert.equal(response.body.attempt.questionScores[0].questionId, "q1");
    assert.equal(response.body.attempt.questionScores[0].score, 36);
    assert.ok(Array.isArray(response.body.attempt.verificationLog));
  } finally {
    await server.close();
  }
});

test("concurrent duplicate submissions with the same clientAttemptId reuse one attempt", async () => {
  const server = await createTestServer();
  const attemptCase = successfulAttemptCaseByAct(1);
  const body = {
    ...attemptCase.body,
    learnerSessionId: "learner-double-click",
    clientAttemptId: "act1-submit-click-001",
  };

  try {
    const responses = await Promise.all([
      requestJson(server.baseUrl, `/api/practices/${attemptCase.practiceId}/attempts`, {
        method: "POST",
        body,
      }),
      requestJson(server.baseUrl, `/api/practices/${attemptCase.practiceId}/attempts`, {
        method: "POST",
        body,
      }),
    ]);

    assert.equal(responses[0].status, 201);
    assert.equal(responses[1].status, 201);
    assert.equal(responses[0].body.attempt.attemptId, responses[1].body.attempt.attemptId);
    assert.equal(responses[0].body.attempt.attemptNumber, 1);
    assert.equal(responses[1].body.attempt.attemptNumber, 1);
  } finally {
    await server.close();
  }
});

test("concurrent submissions from different learners remain separated", async () => {
  const server = await createTestServer();
  const attemptCase = successfulAttemptCaseByAct(1);
  const learnerIds = Array.from({ length: 8 }, (_, index) => `learner-${index + 1}`);

  try {
    const responses = await Promise.all(
      learnerIds.map((learnerSessionId) =>
        requestJson(server.baseUrl, `/api/practices/${attemptCase.practiceId}/attempts`, {
          method: "POST",
          body: {
            ...attemptCase.body,
            learnerSessionId,
            clientAttemptId: `${learnerSessionId}-click-001`,
          },
        }),
      ),
    );

    const attemptIds = new Set();
    for (const [index, response] of responses.entries()) {
      assert.equal(response.status, 201);
      assert.equal(response.body.attempt.learnerSessionId, learnerIds[index]);
      assert.equal(response.body.attempt.attemptNumber, 1);
      attemptIds.add(response.body.attempt.attemptId);
    }
    assert.equal(attemptIds.size, learnerIds.length);
  } finally {
    await server.close();
  }
});

test("invalid attempt body returns ok false with invalid_input", async () => {
  const server = await createTestServer();
  try {
    const response = await requestJson(
      server.baseUrl,
      "/api/practices/act1-info-selection/attempts",
      {
        method: "POST",
        body: { learnerSessionId: "learner-a", input: { answers: "not-an-object" } },
      },
    );

    assert.equal(response.status, 400);
    assert.deepEqual(response.body, {
      ok: false,
      error: {
        code: "invalid_input",
        message: "input.answers must be an object",
      },
    });
  } finally {
    await server.close();
  }
});

test("GET unknown attempt returns attempt_not_found", async () => {
  const server = await createTestServer();
  try {
    const response = await requestJson(
      server.baseUrl,
      "/api/practices/act1-info-selection/attempts/attempt_999999",
    );

    assert.equal(response.status, 404);
    assert.deepEqual(response.body, {
      ok: false,
      error: {
        code: "attempt_not_found",
        message: "Practice attempt not found: attempt_999999",
      },
    });
  } finally {
    await server.close();
  }
});

test("oversized POST body returns HTTP 400 JSON without resetting the connection", async () => {
  const server = await createTestServer();
  try {
    let fetchError;
    let response;
    try {
      response = await requestJson(
        server.baseUrl,
        "/api/practices/act1-info-selection/attempts",
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            learnerSessionId: "learner-a",
            input: {
              answers: {},
              padding: "x".repeat(70 * 1024),
            },
          }),
        },
      );
    } catch (error) {
      fetchError = error;
    }

    assert.equal(fetchError, undefined);
    assert.equal(response.status, 400);
    assert.equal(response.body.ok, false);
    assert.equal(response.body.error.code, "invalid_input");
    assert.match(response.body.error.message, /bytes or smaller/);
  } finally {
    await server.close();
  }
});

test("POST and GET act6 safe complete expose unlockArtifact", async () => {
  const server = await createTestServer();
  try {
    const postResponse = await requestJson(
      server.baseUrl,
      "/api/practices/act6-stop-hook-gate/attempts",
      {
        method: "POST",
        body: {
          learnerSessionId: "learner-act6",
          input: cloneAttemptBody(successfulAttemptCaseByAct(6).body.input),
        },
      },
    );

    assert.equal(postResponse.status, 201);
    assert.equal(postResponse.body.ok, true);
    assert.equal(postResponse.body.attempt.unlocked, true);
    assert.equal(postResponse.body.attempt.unlockArtifact.kind, "prompt");
    assert.match(postResponse.body.attempt.unlockArtifact.title, /Stop hook/);
    assert.ok(postResponse.body.attempt.unlockArtifact.body);

    const getResponse = await requestJson(
      server.baseUrl,
      `/api/practices/act6-stop-hook-gate/attempts/${postResponse.body.attempt.attemptId}`,
    );

    assert.equal(getResponse.status, 200);
    assert.deepEqual(
      getResponse.body.attempt.unlockArtifact,
      postResponse.body.attempt.unlockArtifact,
    );
  } finally {
    await server.close();
  }
});

test("injected async provider returns JSON-safe judgeResult in attempt response", async () => {
  const server = await createTestServer({
    judgeProvider: {
      name: "json-safe-provider",
      async evaluate() {
        return {
          label: "reviewed",
          confidence: 0.97,
          hints: ["필수 정보가 충분합니다."],
        };
      },
    },
  });

  try {
    const response = await requestJson(
      server.baseUrl,
      "/api/practices/act1-info-selection/attempts",
      {
        method: "POST",
        body: {
          learnerSessionId: "learner-provider",
          input: { answers: {} },
        },
      },
    );

    assert.equal(response.status, 201);
    assert.deepEqual(response.body.attempt.judgeResult, {
      label: "reviewed",
      confidence: 0.97,
      hints: ["필수 정보가 충분합니다."],
    });
    assert.deepEqual(response.body.attempt.providerWarnings, []);
  } finally {
    await server.close();
  }
});

test("non-JSON-safe provider result degrades to warning without failing attempt", async () => {
  const server = await createTestServer({
    judgeProvider: {
      name: "bigint-provider",
      async evaluate() {
        return { scoreAdjustment: 1n };
      },
    },
  });

  try {
    const response = await requestJson(
      server.baseUrl,
      "/api/practices/act1-info-selection/attempts",
      {
        method: "POST",
        body: {
          learnerSessionId: "learner-provider",
          input: { answers: {} },
        },
      },
    );

    assert.equal(response.status, 201);
    assert.equal(response.body.ok, true);
    assert.equal(response.body.attempt.judgeResult, null);
    assert.equal(response.body.attempt.providerWarnings.length, 1);
    assert.equal(response.body.attempt.providerWarnings[0].provider, "bigint-provider");
    assert.match(response.body.attempt.providerWarnings[0].message, /JSON-safe/);
  } finally {
    await server.close();
  }
});

test("throwing provider degrades to warning without failing learner attempt", async () => {
  const server = await createTestServer({
    judgeProvider: {
      name: "openai-test-provider",
      async evaluate() {
        throw new Error("simulated provider outage");
      },
    },
  });

  try {
    const response = await requestJson(
      server.baseUrl,
      "/api/practices/act3-context-workbench/attempts",
      {
        method: "POST",
        body: successfulAttemptCaseByAct(3).body,
      },
    );

    assert.equal(response.status, 201);
    assert.equal(response.body.ok, true);
    assert.equal(response.body.attempt.unlocked, true);
    assert.equal(response.body.attempt.judgeResult, null);
    assert.equal(response.body.attempt.providerWarnings.length, 1);
    assert.equal(response.body.attempt.providerWarnings[0].provider, "openai-test-provider");
    assert.match(
      response.body.attempt.providerWarnings[0].message,
      /기본 채점 결과/,
    );
    assert.doesNotMatch(
      JSON.stringify(response.body.attempt.providerWarnings),
      /simulated provider outage|OPEN_AI_API|Bearer|sk-|CLAUDE\.md 기본 기억/,
    );
  } finally {
    await server.close();
  }
});
