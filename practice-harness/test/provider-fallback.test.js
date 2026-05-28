const assert = require("node:assert/strict");
const { setTimeout: delay } = require("node:timers/promises");
const test = require("node:test");

let evaluateWithJudgeProvider;
try {
  ({ evaluateWithJudgeProvider } = require("../src/judge-provider"));
} catch (error) {
  throw new Error("evaluateWithJudgeProvider is missing");
}

const practice = {
  id: "fallback-practice",
  type: "multi-question-choice",
};

const attempt = {
  id: "attempt-1",
  input: {
    answers: {
      q1: ["choice-1"],
    },
  },
};

function deterministicResult() {
  return {
    practiceId: practice.id,
    score: 84,
    maxScore: 100,
    checks: [{ id: "required-info-check", status: "pass" }],
    feedback: [{ type: "positive", message: "필수 정보가 충분합니다." }],
    verificationLog: [{ checkId: "required-info-check", status: "pass" }],
  };
}

function busyWait(ms) {
  const startedAt = Date.now();
  while (Date.now() - startedAt <= ms) {
  }
}

test("none provider returns null judgeResult and no warnings", async () => {
  const result = await evaluateWithJudgeProvider({
    provider: "none",
    practice,
    attempt,
    deterministicResult: deterministicResult(),
    timeoutMs: 20,
  });

  assert.deepEqual(result, {
    judgeResult: null,
    providerWarnings: [],
  });
});

test("throwing provider produces providerWarnings but keeps deterministic score unchanged", async () => {
  const scored = deterministicResult();

  const result = await evaluateWithJudgeProvider({
    provider: {
      name: "throwing-judge",
      evaluate() {
        throw new Error("provider unavailable");
      },
    },
    practice,
    attempt,
    deterministicResult: scored,
    timeoutMs: 20,
  });

  assert.equal(scored.score, 84);
  assert.equal(result.judgeResult, null);
  assert.equal(result.providerWarnings.length, 1);
  assert.equal(result.providerWarnings[0].provider, "throwing-judge");
  assert.match(result.providerWarnings[0].message, /provider unavailable/);
});

test("slow provider times out and keeps deterministic score unchanged", async () => {
  const scored = deterministicResult();

  const result = await evaluateWithJudgeProvider({
    provider: {
      name: "slow-judge",
      evaluate() {
        return new Promise((resolve) => {
          setTimeout(() => resolve({ note: "too late" }), 50);
        });
      },
    },
    practice,
    attempt,
    deterministicResult: scored,
    timeoutMs: 5,
  });

  assert.equal(scored.score, 84);
  assert.equal(result.judgeResult, null);
  assert.equal(result.providerWarnings.length, 1);
  assert.equal(result.providerWarnings[0].provider, "slow-judge");
  assert.match(result.providerWarnings[0].message, /timed out/i);
});

test("synchronous provider result is a contract violation and keeps deterministic score unchanged", async () => {
  const scored = deterministicResult();

  const result = await evaluateWithJudgeProvider({
    provider: {
      name: "sync-judge",
      evaluate() {
        return { comment: "returned synchronously" };
      },
    },
    practice,
    attempt,
    deterministicResult: scored,
    timeoutMs: 20,
  });

  assert.equal(scored.score, 84);
  assert.equal(result.judgeResult, null);
  assert.equal(result.providerWarnings.length, 1);
  assert.equal(result.providerWarnings[0].provider, "sync-judge");
  assert.match(result.providerWarnings[0].message, /contract violation/i);
  assert.match(result.providerWarnings[0].message, /Promise/i);
});

test("provider that blocks before returning a promise is rejected and keeps deterministic score unchanged", async () => {
  const scored = deterministicResult();

  const result = await evaluateWithJudgeProvider({
    provider: {
      name: "blocking-judge",
      evaluate() {
        busyWait(15);
        return Promise.resolve({ comment: "too late before promise" });
      },
    },
    practice,
    attempt,
    deterministicResult: scored,
    timeoutMs: 5,
  });

  assert.equal(scored.score, 84);
  assert.equal(result.judgeResult, null);
  assert.equal(result.providerWarnings.length, 1);
  assert.equal(result.providerWarnings[0].provider, "blocking-judge");
  assert.match(result.providerWarnings[0].message, /contract violation|timed out/i);
});

test("discarded blocking provider promise rejection is observed", async () => {
  const scored = deterministicResult();
  const unhandledRejections = [];
  const onUnhandledRejection = (reason) => {
    unhandledRejections.push(reason);
  };

  process.on("unhandledRejection", onUnhandledRejection);
  try {
    const result = await evaluateWithJudgeProvider({
      provider: {
        name: "late-rejecting-judge",
        evaluate() {
          busyWait(15);
          return new Promise((_, reject) => {
            setTimeout(() => reject(new Error("late provider rejection")), 5);
          });
        },
      },
      practice,
      attempt,
      deterministicResult: scored,
      timeoutMs: 5,
    });

    assert.equal(scored.score, 84);
    assert.equal(result.judgeResult, null);
    assert.equal(result.providerWarnings.length, 1);
    assert.equal(result.providerWarnings[0].provider, "late-rejecting-judge");
    assert.match(result.providerWarnings[0].message, /contract violation|timed out/i);

    await delay(25);
    assert.deepEqual(unhandledRejections, []);
  } finally {
    process.off("unhandledRejection", onUnhandledRejection);
  }
});

test("async provider result still succeeds", async () => {
  const result = await evaluateWithJudgeProvider({
    provider: {
      name: "async-judge",
      evaluate() {
        return Promise.resolve({ comment: "provider ran" });
      },
    },
    practice,
    attempt,
    deterministicResult: deterministicResult(),
    timeoutMs: 20,
  });

  assert.deepEqual(result, {
    judgeResult: { comment: "provider ran" },
    providerWarnings: [],
  });
});

test("deterministicResult is not mutated by provider runner", async () => {
  const scored = deterministicResult();
  const before = structuredClone(scored);

  const result = await evaluateWithJudgeProvider({
    provider: {
      name: "mutating-judge",
      async evaluate({ deterministicResult: providerResult }) {
        providerResult.score = 0;
        providerResult.feedback.push({ type: "provider", message: "changed" });
        return { comment: "provider ran" };
      },
    },
    practice,
    attempt,
    deterministicResult: scored,
    timeoutMs: 20,
  });

  assert.deepEqual(scored, before);
  assert.deepEqual(result, {
    judgeResult: { comment: "provider ran" },
    providerWarnings: [],
  });
});
