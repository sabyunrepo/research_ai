#!/usr/bin/env node

const assert = require("node:assert/strict");
const http = require("node:http");

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

const GOOD_ACT3_DOCUMENT = successfulAttemptCaseByAct(3).body.input.document;
const GOOD_ACT4_DOCUMENT = successfulAttemptCaseByAct(4).body.input.document;
const GOOD_ACT5_RECORD = successfulAttemptCaseByAct(5).body.input.record;
const GOOD_ACT6_IDS = successfulAttemptCaseByAct(6).body.input.selectedIds;

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function createServer() {
  return http.createServer(
    createPracticeApp({
      definitionStore: createPracticeDefinitionStore(),
      attemptStore: createMemoryAttemptStore(),
      judgeProvider: "none",
    }),
  );
}

function listen(server) {
  return new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", () => {
      server.off("error", reject);
      resolve(`http://127.0.0.1:${server.address().port}`);
    });
  });
}

function close(server) {
  return new Promise((resolve, reject) => {
    server.close((error) => {
      if (error) reject(error);
      else resolve();
    });
  });
}

async function postJson(baseUrl, path, body) {
  const response = await fetch(`${baseUrl}${path}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  return {
    status: response.status,
    body: await response.json(),
  };
}

function withSession(body, slug) {
  return {
    ...clone(body),
    learnerSessionId: `qa-${slug}-${Date.now()}`,
    clientAttemptId: `qa-${slug}-${Date.now()}`,
  };
}

function successCase(act) {
  const attemptCase = successfulAttemptCaseByAct(act);
  return {
    practiceId: attemptCase.practiceId,
    body: attemptCase.body,
  };
}

function act1MixedBody() {
  return {
    learnerSessionId: "qa-act1-mixed",
    input: {
      answers: {
        q1: [
          "q1-purpose-action",
          "q1-responsive-breakpoints",
          "q1-real-content",
          "q1-brand-style",
          "q1-competitor-screenshots",
          "q1-future-payment-data",
        ],
        q2: [
          "q2-browser-size",
          "q2-user-steps",
          "q2-related-files",
          "q2-recent-changes",
          "q2-support-ticket-dump",
          "q2-button-color-opinion",
        ],
        q3: [
          "q3-audience-duration",
          "q3-learning-goal",
          "q3-core-metaphor-terms",
          "q3-edit-boundaries",
          "q3-other-instructor-slides",
          "q3-hook-evaluation-plan",
        ],
      },
    },
  };
}

function act5SingleAgentRecord() {
  return `
Attempt 1
Coordinator:
- I gave one agent every responsibility: research, implementation, source judgment, review, and final report.
- The same agent edited files, decided whether sources were reliable, ran no separate reviewer step, and wrote all outputs together.
Result:
- One person handled everything without separated role outputs.
`;
}

const matrixCases = [
  ...[1, 2, 3, 4, 5, 6].map((act) => {
    const item = successCase(act);
    return {
      id: `act${act}-success`,
      practiceId: item.practiceId,
      body: item.body,
      expect: { status: 201, minScore: 90, unlocked: true },
    };
  }),
  {
    id: "act1-mixed-noisy",
    practiceId: "act1-info-selection",
    body: act1MixedBody(),
    expect: { status: 201, minScore: 50, maxScore: 89, unlocked: false },
  },
  {
    id: "act1-duplicate-choice-invalid",
    practiceId: "act1-info-selection",
    body: {
      learnerSessionId: "qa-act1-duplicate",
      input: { answers: { q1: ["q1-purpose-action", "q1-purpose-action"] } },
    },
    expect: { status: 400, errorCode: "invalid_input" },
  },
  {
    id: "act2-thin-prompt",
    practiceId: "act2-prompt-brief",
    body: {
      learnerSessionId: "qa-act2-thin",
      input: { prompt: "반응형 카드 만들어줘" },
    },
    expect: { status: 201, minScore: 1, maxScore: 89, unlocked: false },
  },
  {
    id: "act2-blank-invalid",
    practiceId: "act2-prompt-brief",
    body: {
      learnerSessionId: "qa-act2-blank",
      input: { prompt: "   \n\t" },
    },
    expect: { status: 400, errorCode: "invalid_input" },
  },
  {
    id: "act3-wrong-scope-untrimmed",
    practiceId: "act3-context-workbench",
    body: {
      learnerSessionId: "qa-act3-wrong-scope",
      input: {
        scope: "global",
        removedRuleIds: ["keep-user-changes"],
        document: GOOD_ACT3_DOCUMENT,
      },
    },
    expect: { status: 201, maxScore: 89, unlocked: false },
  },
  {
    id: "act3-dangerous-memory",
    practiceId: "act3-context-workbench",
    body: {
      learnerSessionId: "qa-act3-dangerous",
      input: {
        scope: "project",
        removedRuleIds: [
          "remove-skip-tests",
          "remove-old-purple",
          "remove-api-key",
          "remove-direct-output-edit",
        ],
        document: [
          GOOD_ACT3_DOCUMENT,
          "",
          "- 테스트가 오래 걸리면 생략해도 된다.",
          "- API 키와 개인 토큰은 예시로 CLAUDE.md에 적어둔다.",
        ].join("\n"),
      },
    },
    expect: { status: 201, maxScore: 89, unlocked: false },
  },
  {
    id: "act3-duplicate-removal-invalid",
    practiceId: "act3-context-workbench",
    body: {
      learnerSessionId: "qa-act3-duplicate",
      input: {
        scope: "project",
        removedRuleIds: ["remove-skip-tests", "remove-skip-tests"],
        document: GOOD_ACT3_DOCUMENT,
      },
    },
    expect: { status: 400, errorCode: "invalid_input" },
  },
  {
    id: "act4-starter-template-blocked",
    practiceId: "act4-mini-brainstorming-skill",
    body: {
      learnerSessionId: "qa-act4-starter",
      input: { document: "[여기에 트리거를 작성하세요]\n" + GOOD_ACT4_DOCUMENT },
    },
    expect: { status: 201, maxScore: 89, unlocked: false },
  },
  {
    id: "act4-idea-only-low-score",
    practiceId: "act4-mini-brainstorming-skill",
    body: {
      learnerSessionId: "qa-act4-idea",
      input: { document: "아이디어가 필요할 때 20개 아이디어를 제안한다." },
    },
    expect: { status: 201, maxScore: 54, unlocked: false },
  },
  {
    id: "act4-blank-invalid",
    practiceId: "act4-mini-brainstorming-skill",
    body: {
      learnerSessionId: "qa-act4-blank",
      input: { document: "" },
    },
    expect: { status: 400, errorCode: "invalid_input" },
  },
  {
    id: "act5-single-agent-low-score",
    practiceId: "act5-agent-team-runbook",
    body: {
      learnerSessionId: "qa-act5-single",
      input: { record: act5SingleAgentRecord() },
    },
    expect: { status: 201, maxScore: 69, unlocked: false },
  },
  {
    id: "act5-complete-no-checkedIds",
    practiceId: "act5-agent-team-runbook",
    body: {
      learnerSessionId: "qa-act5-no-checked",
      input: { record: GOOD_ACT5_RECORD },
    },
    expect: { status: 201, minScore: 90, unlocked: true, noCheckedIds: true },
  },
  {
    id: "act6-always-block-no-unlock",
    practiceId: "act6-stop-hook-gate",
    body: {
      learnerSessionId: "qa-act6-block",
      input: {
        selectedIds: [
          "trigger-before-final",
          "state-read-attempt",
          "stop-always-block",
          "evidence-run-tests",
        ],
      },
    },
    expect: { status: 201, maxScore: 99, unlocked: false, noUnlockArtifact: true },
  },
  {
    id: "act6-missing-loop-guard",
    practiceId: "act6-stop-hook-gate",
    body: {
      learnerSessionId: "qa-act6-missing-loop",
      input: {
        selectedIds: GOOD_ACT6_IDS.filter((id) => id !== "stop-loop-guard"),
      },
    },
    expect: { status: 201, maxScore: 99, unlocked: false, noUnlockArtifact: true },
  },
  {
    id: "act6-duplicate-invalid",
    practiceId: "act6-stop-hook-gate",
    body: {
      learnerSessionId: "qa-act6-duplicate",
      input: { selectedIds: ["trigger-before-final", "trigger-before-final"] },
    },
    expect: { status: 400, errorCode: "invalid_input" },
  },
];

function assertAttemptShape(attempt) {
  assert.equal(typeof attempt.attemptId, "string");
  assert.equal(typeof attempt.practiceId, "string");
  assert.equal(typeof attempt.learnerSessionId, "string");
  assert.equal(typeof attempt.score, "number");
  assert.equal(typeof attempt.maxScore, "number");
  assert.equal(typeof attempt.unlocked, "boolean");
  assert.ok(Array.isArray(attempt.checks));
  assert.ok(Array.isArray(attempt.feedback));
  assert.ok(Array.isArray(attempt.verificationLog));
  assert.equal(attempt.judgeResult, null);
  assert.deepEqual(attempt.providerWarnings, []);
}

function assertMatrixResult({ id, response, expect }) {
  assert.equal(response.status, expect.status, `${id}: unexpected HTTP status`);
  if (expect.errorCode) {
    assert.equal(response.body.ok, false, `${id}: error response should not be ok`);
    assert.equal(response.body.error.code, expect.errorCode, `${id}: unexpected error code`);
    return;
  }

  const attempt = response.body.attempt;
  assert.equal(response.body.ok, true, `${id}: success response should be ok`);
  assertAttemptShape(attempt);
  if (expect.minScore !== undefined) {
    assert.ok(
      attempt.score >= expect.minScore,
      `${id}: expected score >= ${expect.minScore}, got ${attempt.score}`,
    );
  }
  if (expect.maxScore !== undefined) {
    assert.ok(
      attempt.score <= expect.maxScore,
      `${id}: expected score <= ${expect.maxScore}, got ${attempt.score}`,
    );
  }
  if (expect.unlocked !== undefined) {
    assert.equal(attempt.unlocked, expect.unlocked, `${id}: unexpected unlock state`);
  }
  if (expect.noUnlockArtifact) {
    assert.equal(attempt.unlockArtifact, undefined, `${id}: unlock artifact should be absent`);
  }
  if (expect.noCheckedIds) {
    assert.equal(
      Object.prototype.hasOwnProperty.call(attempt, "checkedIds"),
      false,
      `${id}: checkedIds must not leak into the API result`,
    );
  }
}

async function runIdempotencyCase(baseUrl) {
  const item = successCase(3);
  const body = withSession(item.body, "act3-idempotent");
  const path = `/api/practices/${item.practiceId}/attempts`;
  const [first, second] = await Promise.all([
    postJson(baseUrl, path, body),
    postJson(baseUrl, path, body),
  ]);
  assert.equal(first.status, 201);
  assert.equal(second.status, 201);
  assert.equal(first.body.attempt.attemptId, second.body.attempt.attemptId);
  assert.equal(first.body.attempt.attemptNumber, second.body.attempt.attemptNumber);
  return first.body.attempt.attemptId;
}

async function main() {
  const server = createServer();
  const baseUrl = await listen(server);
  let passed = 0;
  try {
    const listResponse = await fetch(`${baseUrl}/api/practices`);
    const listJson = await listResponse.json();
    assert.equal(listResponse.status, 200);
    assert.deepEqual(
      listJson.practices.map((practice) => practice.act),
      [1, 2, 3, 4, 5, 6],
    );
    console.log("PASS practices list exposes acts 1-6");
    passed += 1;

    for (const item of matrixCases) {
      const response = await postJson(
        baseUrl,
        `/api/practices/${item.practiceId}/attempts`,
        withSession(item.body, item.id),
      );
      assertMatrixResult({ id: item.id, response, expect: item.expect });
      const score =
        response.body && response.body.attempt ? ` score=${response.body.attempt.score}` : "";
      console.log(`PASS ${item.id}: status=${response.status}${score}`);
      passed += 1;
    }

    const attemptId = await runIdempotencyCase(baseUrl);
    console.log(`PASS duplicate clientAttemptId reuses ${attemptId}`);
    passed += 1;
  } finally {
    await close(server);
  }
  console.log(`PASS practice input QA matrix (${passed} checks)`);
}

main().catch((error) => {
  console.error(error && error.stack ? error.stack : String(error));
  process.exitCode = 1;
});
