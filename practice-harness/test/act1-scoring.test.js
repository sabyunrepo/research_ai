const assert = require("node:assert/strict");
const path = require("node:path");
const test = require("node:test");

const { createPracticeDefinitionStore } = require("../src/practice-definition-store");

let scorePracticeAttempt;
try {
  ({ scorePracticeAttempt } = require("../src/scoring-engine"));
} catch (error) {
  throw new Error("scorePracticeAttempt is missing");
}

const practicesDir = path.join(__dirname, "..", "practices");

function loadPractice() {
  const store = createPracticeDefinitionStore({ practicesDir });
  return store.getPractice("act1-info-selection");
}

test("scores best input at 90 or higher when required choices are selected without pollution", () => {
  const practice = loadPractice();

  const result = scorePracticeAttempt({
    practice,
    input: {
      answers: {
        q1: [
          "q1-purpose-action",
          "q1-responsive-breakpoints",
          "q1-real-content",
          "q1-brand-style",
          "q1-state-verification",
          "q1-output-format",
        ],
        q2: [
          "q2-browser-size",
          "q2-user-steps",
          "q2-related-files",
          "q2-recent-changes",
          "q2-reproduction-criteria",
          "q2-post-fix-verification",
        ],
        q3: [
          "q3-audience-duration",
          "q3-learning-goal",
          "q3-core-metaphor-terms",
          "q3-edit-boundaries",
          "q3-screen-constraints",
          "q3-review-criteria",
        ],
      },
    },
  });

  assert.ok(result.score >= 90);
  assert.equal(result.maxScore, 100);
  assert.equal(result.checks.length, 4);
  assert.equal(result.verificationLog.length, result.checks.length);
  assert.ok(result.checks.every((check) => check.status === "pass"));
});

test("scores mixed input between 50 and 89 when required choices are missed and noise is selected", () => {
  const practice = loadPractice();

  const result = scorePracticeAttempt({
    practice,
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
  });

  assert.ok(result.score >= 50);
  assert.ok(result.score <= 89);
  assert.ok(result.feedback.some((item) => item.type === "missing_required"));
  assert.ok(result.feedback.some((item) => item.type === "selected_noise"));
  assert.ok(result.checks.some((check) => check.status === "partial"));
});

test("throws invalid_input when a selected choice id is unknown", () => {
  const practice = loadPractice();

  assert.throws(
    () =>
      scorePracticeAttempt({
        practice,
        input: {
          answers: {
            q1: ["q1-purpose-action", "missing-choice-id"],
          },
        },
      }),
    (error) => error.code === "invalid_input",
  );
});

test("throws invalid_input when a question answer repeats a choice id", () => {
  const practice = loadPractice();

  assert.throws(
    () =>
      scorePracticeAttempt({
        practice,
        input: {
          answers: {
            q1: ["q1-purpose-action", "q1-purpose-action"],
          },
        },
      }),
    (error) =>
      error.code === "invalid_input" &&
      error.questionId === "q1" &&
      error.choiceId === "q1-purpose-action",
  );
});
