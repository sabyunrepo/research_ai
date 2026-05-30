const assert = require("node:assert/strict");
const path = require("node:path");
const test = require("node:test");

const { createPracticeDefinitionStore } = require("../src/practice-definition-store");
const { scorePracticeAttempt } = require("../src/scoring-engine");
const {
  successfulAttemptCaseByAct,
  successfulAttemptCases,
} = require("./helpers/successful-attempts");

const practicesDir = path.join(__dirname, "..", "practices");

function loadPractice(practiceId) {
  const store = createPracticeDefinitionStore({ practicesDir });
  return store.getPractice(practiceId);
}

function score(practiceId, input) {
  const practice = loadPractice(practiceId);
  return scorePracticeAttempt({
    practice,
    input,
  });
}

function isUnlocked(practiceId, result) {
  const practice = loadPractice(practiceId);
  return result.unlocked !== undefined ? result.unlocked : result.score >= practice.unlockThreshold;
}

function assertLockedWithUsefulFeedback(practiceId, result, label) {
  assert.equal(isUnlocked(practiceId, result), false, `${label}: must not unlock`);
  assert.ok(result.score < result.maxScore, `${label}: must not return a perfect score`);
  assert.ok(result.feedback.length > 0, `${label}: must explain what to fix`);
  assert.ok(
    result.checks.some((check) => check.status !== "pass"),
    `${label}: at least one check must fail or be partial`,
  );
  assert.ok(
    result.verificationLog.some((entry) => entry.status !== "pass"),
    `${label}: verification log must show the failed or partial evidence`,
  );
}

test("all intended success fixtures unlock with passing evidence", () => {
  for (const item of successfulAttemptCases) {
    const result = score(item.practiceId, item.body.input);

    assert.equal(isUnlocked(item.practiceId, result), true, `act${item.act}: should unlock`);
    assert.ok(result.score >= 90, `act${item.act}: expected high score, got ${result.score}`);
    assert.ok(result.checks.length > 0, `act${item.act}: checks are required`);
    assert.ok(
      result.checks.every((check) => check.status === "pass"),
      `act${item.act}: every success check should pass`,
    );
    assert.equal(
      result.verificationLog.length,
      result.checks.length,
      `act${item.act}: verification log must mirror checks`,
    );
  }
});

test("Act 1 random or noisy choices cannot pass the information-selection contract", () => {
  const result = score("act1-info-selection", {
    answers: {
      q1: ["q1-old-design-system"],
      q2: ["q2-button-color-opinion"],
      q3: ["q3-design-moodboard"],
    },
  });

  assertLockedWithUsefulFeedback("act1-info-selection", result, "act1 random/noisy choices");
  assert.ok(result.score < 50, `act1 random/noisy choices: expected low score, got ${result.score}`);
  assert.ok(result.feedback.some((item) => item.type === "missing_required"));
  assert.ok(result.feedback.some((item) => item.type === "selected_noise"));
});

test("Act 2 vague prompt remains locked and reports missing brief structure", () => {
  const result = score("act2-prompt-brief", {
    prompt: "반응형 카드 만들어줘",
  });

  assertLockedWithUsefulFeedback("act2-prompt-brief", result, "act2 vague prompt");
  assert.ok(result.score < 60, `act2 vague prompt: expected low score, got ${result.score}`);
});

test("Act 3 wrong scope or unsafe memory remains locked", () => {
  const good = successfulAttemptCaseByAct(3).body.input;
  const result = score("act3-context-workbench", {
    scope: "global",
    removedRuleIds: ["keep-user-changes"],
    document: [
      good.document,
      "",
      "- 테스트가 오래 걸리면 생략해도 된다.",
      "- API 키와 개인 토큰은 예시로 CLAUDE.md에 적어둔다.",
    ].join("\n"),
  });

  assertLockedWithUsefulFeedback("act3-context-workbench", result, "act3 wrong scope or unsafe memory");
  assert.ok(result.score < 90, `act3 wrong scope or unsafe memory: got ${result.score}`);
});

test("Act 4 starter scaffold alone cannot unlock a reusable Skill", () => {
  const good = successfulAttemptCaseByAct(4).body.input;
  const result = score("act4-mini-brainstorming-skill", {
    document: "[여기에 트리거를 작성하세요]\n" + good.document,
  });

  assertLockedWithUsefulFeedback("act4-mini-brainstorming-skill", result, "act4 starter scaffold");
});

test("Act 5 single-agent runbook remains locked because roles are not separated", () => {
  const result = score("act5-agent-team-runbook", {
    record: `
Attempt 1
Coordinator:
- I gave one agent every responsibility: research, implementation, source judgment, review, and final report.
- The same agent edited files, decided whether sources were reliable, ran no separate reviewer step, and wrote all outputs together.
Result:
- One person handled everything without separated role outputs.
`,
  });

  assertLockedWithUsefulFeedback("act5-agent-team-runbook", result, "act5 single-agent runbook");
  assert.ok(result.score < 70, `act5 single-agent runbook: expected low score, got ${result.score}`);
});

test("Act 6 missing loop guard never unlocks the Stop hook artifact", () => {
  const good = successfulAttemptCaseByAct(6).body.input;
  const result = score("act6-stop-hook-gate", {
    selectedIds: good.selectedIds.filter((id) => id !== "stop-loop-guard"),
  });

  assertLockedWithUsefulFeedback("act6-stop-hook-gate", result, "act6 missing loop guard");
  assert.equal(result.unlockArtifact, undefined);
});
