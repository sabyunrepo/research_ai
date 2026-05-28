const assert = require("node:assert/strict");
const path = require("node:path");
const test = require("node:test");

const { createPracticeDefinitionStore } = require("../src/practice-definition-store");
const { scorePracticeAttempt } = require("../src/scoring-engine");

const practicesDir = path.join(__dirname, "..", "practices");

function loadPractice() {
  const store = createPracticeDefinitionStore({ practicesDir });
  return store.getPractice("act4-mini-brainstorming-skill");
}

const EXPECTED_CHECK_IDS = [
  "frontmatter-check",
  "name-check",
  "description-trigger-check",
  "steps-check",
  "skill-structure-depth-check",
  "output-format-check",
  "one-question-at-a-time-check",
  "scope-boundary-check",
  "approach-comparison-check",
  "approval-gate-check",
  "spec-output-check",
];

function completeSkillDocument() {
  return [
    "---",
    "name: mini-brainstorming",
    "description: Use when a user has a vague idea and needs a scoped brainstorming session before implementation.",
    "---",
    "",
    "# Mini Brainstorming Skill",
    "",
    "## Steps",
    "1. Confirm the trigger: the user has an unclear idea, feature, or lesson flow and needs help shaping it.",
    "2. Ask exactly one question at a time, then wait for the answer before asking the next question.",
    "3. Keep the scope boundary explicit: do not design unrelated features or implementation details outside the selected idea.",
    "4. Compare at least two approaches with a short tradeoff for each before recommending one.",
    "5. Ask for approval before moving from brainstorming into writing the final spec or implementation plan.",
    "6. Produce a compact spec with goal, audience, constraints, chosen approach, rejected alternatives, and next step.",
    "",
    "## Output Format",
    "- Trigger summary",
    "- One current question",
    "- Approach comparison",
    "- Approval request",
    "- Final spec",
  ].join("\n");
}

function keywordSoupSkillDocument() {
  return [
    "---",
    "name: mini-brainstorming",
    "description: Use when a user has a vague idea and needs brainstorming before implementation.",
    "---",
    "",
    "# Mini Brainstorming Skill",
    "",
    "## Steps",
    "- one question at a time scope boundary compare approaches tradeoff approval before moving final spec goal audience constraints chosen approach rejected alternatives",
    "",
    "## Output Format",
    "- Trigger summary",
    "- One current question",
    "- Approach comparison",
    "- Approval request",
    "- Final spec",
  ].join("\n");
}

test("complete skill document scores at least 90 and passes deterministic checks", () => {
  const practice = loadPractice();

  const result = scorePracticeAttempt({
    practice,
    input: {
      document: completeSkillDocument(),
    },
  });

  assert.ok(result.score >= 90);
  assert.equal(result.maxScore, 100);
  assert.deepEqual(
    result.checks.map((check) => check.id),
    EXPECTED_CHECK_IDS,
  );
  assert.ok(result.checks.every((check) => check.status === "pass"));
  assert.equal(result.feedback.length, 0);
  assert.deepEqual(
    result.verificationLog.map((entry) => entry.checkId),
    result.checks.map((check) => check.id),
  );
});

test("starter template is only a scaffold and cannot unlock the practice by itself", () => {
  const practice = loadPractice();

  const result = scorePracticeAttempt({
    practice,
    input: {
      document: practice.learning.starterTemplate,
    },
  });

  assert.ok(result.score < practice.unlockThreshold);
  assert.ok(
    result.feedback.length > 0 || result.checks.some((check) => check.status === "fail"),
    "starter template should leave visible learner work",
  );
});

test("keyword soup skill document stays below unlock threshold and reports structure depth", () => {
  const practice = loadPractice();

  const result = scorePracticeAttempt({
    practice,
    input: {
      document: keywordSoupSkillDocument(),
    },
  });

  assert.ok(result.score < 90);
  assert.equal(
    result.checks.find((check) => check.id === "skill-structure-depth-check").status,
    "fail",
  );
  assert.ok(result.feedback.some((item) => item.type === "skill_structure"));
  assert.ok(
    result.verificationLog.some((entry) => entry.checkId === "skill-structure-depth-check"),
  );
});

test("missing name or Steps structure caps score below unlock threshold", () => {
  const practice = loadPractice();
  const withoutName = completeSkillDocument().replace("name: mini-brainstorming\n", "");
  const withoutSteps = completeSkillDocument().replace("## Steps", "## Procedure");

  for (const document of [withoutName, withoutSteps]) {
    const result = scorePracticeAttempt({
      practice,
      input: {
        document,
      },
    });

    assert.ok(result.score < 90);
    assert.ok(result.feedback.some((item) => item.type === "skill_structure"));
  }
});

test("idea-template only document stays below 55 and reports approval and spec gaps", () => {
  const practice = loadPractice();

  const result = scorePracticeAttempt({
    practice,
    input: {
      document: "아이디어가 필요할 때 20개 아이디어를 제안한다.",
    },
  });

  assert.ok(result.score < 55);
  assert.ok(result.feedback.some((item) => item.type === "missing_criterion"));
  assert.ok(result.feedback.some((item) => item.criterionId === "approval-gate"));
  assert.ok(result.feedback.some((item) => item.criterionId === "spec-output"));
  assert.equal(
    result.checks.find((check) => check.id === "approval-gate-check").status,
    "fail",
  );
  assert.equal(
    result.checks.find((check) => check.id === "spec-output-check").status,
    "fail",
  );
});

test("throws invalid_input when document is blank or missing", () => {
  const practice = loadPractice();

  for (const input of [undefined, null, {}, { document: "" }, { document: "   \n\t" }]) {
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
