const assert = require("node:assert/strict");
const test = require("node:test");

const { createMemoryAttemptStore } = require("../src/stores/memory-attempt-store");

test("keeps same-practice attempts separated by learner session", () => {
  const store = createMemoryAttemptStore();

  const learnerAFirst = store.createAttempt({
    practiceId: "act1-info-selection",
    learnerSessionId: "learner-a",
    input: { answers: { q1: ["q1-purpose-action"] } },
    result: { score: 20 },
  });
  const learnerBFirst = store.createAttempt({
    practiceId: "act1-info-selection",
    learnerSessionId: "learner-b",
    input: { answers: { q1: ["q1-real-content"] } },
    result: { score: 30 },
  });
  const learnerASecond = store.createAttempt({
    practiceId: "act1-info-selection",
    learnerSessionId: "learner-a",
    input: { answers: { q1: ["q1-brand-style"] } },
    result: { score: 40 },
  });

  assert.equal(learnerAFirst.attemptNumber, 1);
  assert.equal(learnerBFirst.attemptNumber, 1);
  assert.equal(learnerASecond.attemptNumber, 2);

  assert.match(learnerAFirst.attemptId, /^attempt_\d{6}$/);
  assert.notEqual(learnerAFirst.attemptId, learnerBFirst.attemptId);
  assert.notEqual(learnerAFirst.attemptId, learnerASecond.attemptId);
  assert.notEqual(learnerBFirst.attemptId, learnerASecond.attemptId);

  assert.deepEqual(
    store
      .listAttempts({
        practiceId: "act1-info-selection",
        learnerSessionId: "learner-a",
      })
      .map((attempt) => ({
        attemptId: attempt.attemptId,
        attemptNumber: attempt.attemptNumber,
        score: attempt.result.score,
      })),
    [
      {
        attemptId: learnerAFirst.attemptId,
        attemptNumber: 1,
        score: 20,
      },
      {
        attemptId: learnerASecond.attemptId,
        attemptNumber: 2,
        score: 40,
      },
    ],
  );

  assert.deepEqual(
    store
      .listAttempts({
        practiceId: "act1-info-selection",
        learnerSessionId: "learner-b",
      })
      .map((attempt) => ({
        attemptId: attempt.attemptId,
        attemptNumber: attempt.attemptNumber,
        score: attempt.result.score,
      })),
    [
      {
        attemptId: learnerBFirst.attemptId,
        attemptNumber: 1,
        score: 30,
      },
    ],
  );
});

test("stores immutable snapshots and never exposes mutable internals", () => {
  const store = createMemoryAttemptStore();
  const originalAttempt = {
    practiceId: "act6-stop-hook-gate",
    learnerSessionId: "learner-a",
    input: {
      selectedIds: ["trigger-before-final"],
      metadata: { source: "initial" },
    },
    result: {
      checks: [{ id: "state-machine-check", status: "partial" }],
    },
  };

  const created = store.createAttempt(originalAttempt);
  originalAttempt.input.selectedIds.push("state-read-attempt");
  originalAttempt.input.metadata.source = "mutated-after-create";
  originalAttempt.result.checks[0].status = "pass";
  created.input.selectedIds.push("state-write-complete");
  created.result.checks[0].status = "fail";

  const read = store.getAttempt({
    practiceId: "act6-stop-hook-gate",
    attemptId: created.attemptId,
  });

  assert.deepEqual(read.input, {
    selectedIds: ["trigger-before-final"],
    metadata: { source: "initial" },
  });
  assert.deepEqual(read.result.checks, [
    { id: "state-machine-check", status: "partial" },
  ]);

  read.input.selectedIds.push("stop-requires-incomplete");
  read.input.metadata.source = "mutated-after-read";
  read.result.checks[0].status = "pass";

  const listed = store.listAttempts({
    practiceId: "act6-stop-hook-gate",
    learnerSessionId: "learner-a",
  });
  listed[0].input.selectedIds.push("evidence-run-tests");
  listed[0].result.checks[0].status = "fail";

  assert.deepEqual(
    store.getAttempt({
      practiceId: "act6-stop-hook-gate",
      attemptId: created.attemptId,
    }),
    {
      practiceId: "act6-stop-hook-gate",
      learnerSessionId: "learner-a",
      input: {
        selectedIds: ["trigger-before-final"],
        metadata: { source: "initial" },
      },
      result: {
        checks: [{ id: "state-machine-check", status: "partial" }],
      },
      attemptId: created.attemptId,
      attemptNumber: 1,
    },
  );
});

test("throws attempt_not_found for missing attempts", () => {
  const store = createMemoryAttemptStore();

  assert.throws(
    () =>
      store.getAttempt({
        practiceId: "act1-info-selection",
        attemptId: "attempt_999999",
      }),
    (error) => error.code === "attempt_not_found",
  );
});

test("optionally caps stored attempts while keeping attempt numbers monotonic", () => {
  const store = createMemoryAttemptStore({ maxAttempts: 2 });

  const first = store.createAttempt({
    practiceId: "act1-info-selection",
    learnerSessionId: "learner-a",
    input: { answers: { q1: ["q1-purpose-action"] } },
  });
  const second = store.createAttempt({
    practiceId: "act1-info-selection",
    learnerSessionId: "learner-b",
    input: { answers: { q1: ["q1-real-content"] } },
  });
  const third = store.createAttempt({
    practiceId: "act1-info-selection",
    learnerSessionId: "learner-a",
    input: { answers: { q1: ["q1-brand-style"] } },
  });

  assert.equal(first.attemptNumber, 1);
  assert.equal(second.attemptNumber, 1);
  assert.equal(third.attemptNumber, 2);

  assert.throws(
    () =>
      store.getAttempt({
        practiceId: "act1-info-selection",
        attemptId: first.attemptId,
      }),
    (error) => error.code === "attempt_not_found",
  );
  assert.deepEqual(
    store
      .listAttempts({
        practiceId: "act1-info-selection",
        learnerSessionId: "learner-a",
      })
      .map((attempt) => attempt.attemptId),
    [third.attemptId],
  );
  assert.equal(
    store.getAttempt({
      practiceId: "act1-info-selection",
      attemptId: second.attemptId,
    }).attemptId,
    second.attemptId,
  );
});

test("rejects invalid maxAttempts option", () => {
  assert.throws(
    () => createMemoryAttemptStore({ maxAttempts: 0 }),
    /maxAttempts must be a positive integer/,
  );
});
