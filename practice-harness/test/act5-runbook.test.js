const assert = require("node:assert/strict");
const path = require("node:path");
const test = require("node:test");

const { createPracticeDefinitionStore } = require("../src/practice-definition-store");
const { scorePracticeAttempt } = require("../src/scoring-engine");

const practicesDir = path.join(__dirname, "..", "practices");

function loadPractice() {
  const store = createPracticeDefinitionStore({ practicesDir });
  return store.getPractice("act5-agent-team-runbook");
}

const COMPLETE_RECORD = `
Attempt 1
Coordinator:
- Goal: make the local slide harness pass by using the existing deck-builder rules.
- Constraints: do not edit generated HTML directly, keep changes in the harness layer, and report remaining risk.
- Skill: applied mini-brainstorming Skill before assigning work.
Researcher:
- Read the AGENTS.md, design.md, and verification scripts.
- Did not implement or edit files.
Implementer:
- Ran local execution: node scripts/build-deck-from-spec.js && node scripts/verify-deck-quality.js.
- Implemented only the agreed harness change and did not make source-quality judgments.
Reviewer:
- Reviewed diff, test output, and verification log.
- Did not edit files directly.
Result:
- Build passed locally, deck-quality gate passed, role outputs are separated.

Attempt 2
Coordinator:
- Changed role assignment so Reviewer owned quality gate only.
- Changed tool permission so Implementer could run build/test commands, while Researcher remained read-only.
Result:
- Local execution note: node --test practice-harness/test/act5-runbook.test.js passed.
Final report:
- Remaining risk: Korean slide copy may still need instructor review before the live lecture.
`;

const SINGLE_AGENT_RECORD = `
Attempt 1
Coordinator:
- I gave one agent every responsibility: research, implementation, source judgment, review, and final report.
- The same agent edited files, decided whether sources were reliable, ran no separate reviewer step, and wrote all outputs together.
Result:
- One person handled everything without separated role outputs.
`;

const KEYWORD_SOUP_RECORD = `
Attempt 1
Coordinator:
- Goal constraints mini-brainstorming Skill.
Researcher:
- read-only research no implementation.
Implementer:
- implementation permission no source judgment.
Reviewer:
- review no edit.
Result:
- local execution build pass.

Attempt 2
Coordinator:
- changed role assignment and tool permission.
Result:
- pass.
Final report:
- remaining risk.
`;

test("complete runbook record scores at least 90 and passes deterministic checks", () => {
  const practice = loadPractice();

  const result = scorePracticeAttempt({
    practice,
    input: {
      record: COMPLETE_RECORD,
    },
  });

  assert.ok(result.score >= 90);
  assert.equal(result.maxScore, 100);
  assert.deepEqual(
    result.checks.map((check) => check.id),
    [
      "role-separation-check",
      "skill-assignment-check",
      "tool-permission-check",
      "execution-record-check",
      "iteration-check",
    ],
  );
  assert.ok(result.checks.every((check) => check.status === "pass"));
  assert.deepEqual(
    result.verificationLog.map((entry) => entry.checkId),
    result.checks.map((check) => check.id),
  );
});

test("complete team runbook record can unlock without checklist scoring", () => {
  const practice = loadPractice();

  const result = scorePracticeAttempt({
    practice,
    input: {
      record: COMPLETE_RECORD,
    },
  });

  assert.ok(result.score >= 90);
  assert.ok(result.checks.every((check) => check.status === "pass"));
  assert.equal(Object.prototype.hasOwnProperty.call(result, "checkedIds"), false);
});

test("keyword soup with headings stays below unlock threshold", () => {
  const practice = loadPractice();

  const result = scorePracticeAttempt({
    practice,
    input: {
      record: KEYWORD_SOUP_RECORD,
    },
  });

  assert.ok(result.score < practice.unlockThreshold);
  assert.ok(
    ["execution-record-check", "iteration-check"].some(
      (checkId) =>
        result.checks.find((check) => check.id === checkId).status === "fail",
    ),
  );
  assert.ok(
    result.feedback.some((item) => item.type === "record_structure"),
  );
});

test("single-agent record scores below 70 and fails role separation", () => {
  const practice = loadPractice();

  const result = scorePracticeAttempt({
    practice,
    input: {
      record: SINGLE_AGENT_RECORD,
    },
  });

  assert.ok(result.score < 70);
  assert.equal(
    result.checks.find((check) => check.id === "role-separation-check").status,
    "fail",
  );
  assert.ok(
    result.feedback.some((item) => item.type === "record_structure"),
  );
});

test("short record without local execution note scores low and returns structure feedback", () => {
  const practice = loadPractice();

  const result = scorePracticeAttempt({
    practice,
    input: {
      record: `
Attempt 1
Coordinator:
- Goal and constraints were listed.
Researcher:
- Read context.
Implementer:
- Changed the harness.
Reviewer:
- Reviewed the output.
Result:
- Done.
`,
    },
  });

  assert.ok(result.score < 90);
  assert.equal(
    result.checks.find((check) => check.id === "execution-record-check").status,
    "partial",
  );
  assert.ok(
    result.feedback.some(
      (item) =>
        item.type === "record_structure" &&
        item.checkId === "execution-record-check",
    ),
  );
});

test("throws invalid_input for blank or missing records", () => {
  const practice = loadPractice();

  for (const input of [
    undefined,
    null,
    {},
    { record: "" },
  ]) {
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
