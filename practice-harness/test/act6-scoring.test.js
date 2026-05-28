const assert = require("node:assert/strict");
const path = require("node:path");
const test = require("node:test");

const { createPracticeDefinitionStore } = require("../src/practice-definition-store");
const { scorePracticeAttempt } = require("../src/scoring-engine");

const practicesDir = path.join(__dirname, "..", "practices");

function loadPractice() {
  const store = createPracticeDefinitionStore({ practicesDir });
  return store.getPractice("act6-stop-hook-gate");
}

const SAFE_COMPLETE_IDS = [
  "trigger-before-final",
  "trigger-not-on-start",
  "state-read-attempt",
  "state-write-complete",
  "stop-requires-incomplete",
  "stop-loop-guard",
  "evidence-run-tests",
  "evidence-show-logs",
];

test("safe complete checklist scores 100 and unlocks the prompt artifact", () => {
  const practice = loadPractice();

  const result = scorePracticeAttempt({
    practice,
    input: {
      selectedIds: SAFE_COMPLETE_IDS,
    },
  });

  assert.equal(result.score, 100);
  assert.equal(result.maxScore, 100);
  assert.equal(result.unlocked, true);
  assert.deepEqual(
    result.checks.map((check) => check.id),
    ["loop-safety-check", "completion-evidence-check", "state-machine-check"],
  );
  assert.ok(result.checks.every((check) => check.status === "pass"));
  assert.equal(result.unlockArtifact.kind, "prompt");
  assert.equal(
    result.unlockArtifact.title,
    "Claude Code용 OMX 스타일 계속진행 Stop hook 생성 프롬프트",
  );
  assert.doesNotMatch(result.unlockArtifact.body, /\.\.\.|<|TODO|TBD/);
  assert.match(result.unlockArtifact.body, /UserPromptSubmit hook/);
  assert.match(result.unlockArtifact.body, /Stop hook/);
  assert.match(result.unlockArtifact.body, /\.agent-status\.json/);
  assert.match(result.unlockArtifact.body, /stop_hook_active/);
  assert.match(result.unlockArtifact.body, /scripts\/agent-status-start\.js/);
  assert.match(result.unlockArtifact.body, /scripts\/agent-stop-check\.js/);
  assert.match(result.unlockArtifact.body, /decision.*block/s);
  assert.match(result.unlockArtifact.body, /status.*finished/s);
  assert.match(result.unlockArtifact.body, /finished|blocked|failed|askuserQuestion/);
  assert.match(result.unlockArtifact.body, /OMX|oh-my-codex|native Stop continuation/);
  assert.match(result.unlockArtifact.body, /max_block_attempts|반복 제한/);
});

test("always-block selection prevents unlock even with some correct items selected", () => {
  const practice = loadPractice();

  const result = scorePracticeAttempt({
    practice,
    input: {
      selectedIds: [
        "trigger-before-final",
        "state-read-attempt",
        "stop-always-block",
        "evidence-run-tests",
      ],
    },
  });

  assert.equal(result.unlocked, false);
  assert.ok(result.score < 100);
  assert.ok(result.feedback.some((item) => item.itemId === "stop-always-block"));
  assert.equal(result.unlockArtifact, undefined);
});

test("missing loop guard scores below 100 and does not unlock", () => {
  const practice = loadPractice();

  const result = scorePracticeAttempt({
    practice,
    input: {
      selectedIds: SAFE_COMPLETE_IDS.filter((id) => id !== "stop-loop-guard"),
    },
  });

  assert.ok(result.score < 100);
  assert.equal(result.unlocked, false);
  assert.equal(
    result.checks.find((check) => check.id === "loop-safety-check").status,
    "fail",
  );
  assert.equal(result.unlockArtifact, undefined);
});

test("throws invalid_input when a selected checklist id is unknown", () => {
  const practice = loadPractice();

  assert.throws(
    () =>
      scorePracticeAttempt({
        practice,
        input: {
          selectedIds: ["trigger-before-final", "missing-checklist-id"],
        },
      }),
    (error) => error.code === "invalid_input" && error.itemId === "missing-checklist-id",
  );
});

test("throws invalid_input when a selected checklist id is duplicated", () => {
  const practice = loadPractice();

  assert.throws(
    () =>
      scorePracticeAttempt({
        practice,
        input: {
          selectedIds: ["trigger-before-final", "trigger-before-final"],
        },
      }),
    (error) => error.code === "invalid_input" && error.itemId === "trigger-before-final",
  );
});

test("throws invalid_input when checklist input is missing, non-object, or empty", () => {
  const practice = loadPractice();

  for (const input of [undefined, null, "selectedIds", [], {}]) {
    assert.throws(
      () =>
        scorePracticeAttempt({
          practice,
          input,
        }),
      (error) => error.code === "invalid_input",
    );
  }
});

test("throws invalid_input when selectedIds is not an array", () => {
  const practice = loadPractice();

  for (const selectedIds of ["trigger-before-final", {}, null, 1]) {
    assert.throws(
      () =>
        scorePracticeAttempt({
          practice,
          input: {
            selectedIds,
          },
        }),
      (error) => error.code === "invalid_input",
    );
  }
});
