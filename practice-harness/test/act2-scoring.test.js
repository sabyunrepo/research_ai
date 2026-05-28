const assert = require("node:assert/strict");
const path = require("node:path");
const test = require("node:test");

const { createPracticeDefinitionStore } = require("../src/practice-definition-store");
const { scorePracticeAttempt } = require("../src/scoring-engine");

const practicesDir = path.join(__dirname, "..", "practices");

function loadPractice() {
  const store = createPracticeDefinitionStore({ practicesDir });
  return store.getPractice("act2-prompt-brief");
}

const EXPECTED_CHECK_IDS = [
  "prompt-goal-check",
  "audience-context-check",
  "responsive-condition-check",
  "constraints-check",
  "completion-criteria-check",
  "output-format-check",
];

test("best prompt scores at least 90 and passes every prompt brief criterion", () => {
  const practice = loadPractice();

  const result = scorePracticeAttempt({
    practice,
    input: {
      prompt: [
        "강의 신청 페이지 사용자와 수강생을 위한 카드 컴포넌트를 HTML과 CSS 코드블록으로 나눠 출력해줘.",
        "375 모바일에서는 세로로 쌓고, 768과 1024 데스크톱에서는 반응형 grid로 구현해줘.",
        "색상은 2개 이하로 쓰고, 접근성을 고려하며, 외부 라이브러리 없이 overflow가 생기거나 글자가 넘치지 않게 작성해줘.",
        "hover와 focus 상태를 포함하고, 각 상태를 확인할 수 있는 검증 기준도 함께 써줘.",
      ].join(" "),
    },
  });

  assert.ok(result.score >= 90);
  assert.equal(result.score, 100);
  assert.equal(result.maxScore, 100);
  assert.deepEqual(result.checks.slice(0, EXPECTED_CHECK_IDS.length).map((check) => check.id), EXPECTED_CHECK_IDS);
  assert.equal(
    result.checks.find((check) => check.id === "brief-structure-check").status,
    "pass",
  );
  assert.ok(result.checks.every((check) => check.status === "pass"));
  assert.ok(
    EXPECTED_CHECK_IDS.every((checkId) =>
      result.verificationLog.some((entry) => entry.checkId === checkId),
    ),
  );
  assert.equal(result.feedback.length, 0);
});

test("thin prompt receives partial score and feedback for missing criteria", () => {
  const practice = loadPractice();

  const result = scorePracticeAttempt({
    practice,
    input: {
      prompt: "반응형 카드 만들어줘",
    },
  });

  assert.ok(result.score > 0);
  assert.ok(result.score < 90);
  assert.equal(result.maxScore, 100);
  assert.ok(result.checks.some((check) => check.status === "pass"));
  assert.ok(result.checks.some((check) => check.status === "fail"));
  assert.ok(result.feedback.length > 0);
  assert.ok(result.feedback.some((item) => item.type === "missing_criterion"));
  assert.ok(result.feedback.some((item) => item.criterionId === "audience-context"));
  assert.ok(result.feedback.some((item) => item.criterionId === "constraints"));
  assert.deepEqual(
    result.verificationLog.map((entry) => entry.checkId),
    result.checks.map((check) => check.id),
  );
});

test("keyword-only prompt stays below unlock threshold even when it mentions many criteria", () => {
  const practice = loadPractice();

  const result = scorePracticeAttempt({
    practice,
    input: {
      prompt: "카드 강의 모바일 HTML hover 코드블록",
    },
  });

  assert.ok(result.score > 0);
  assert.ok(result.score < 90);
  assert.ok(result.checks.some((check) => check.status === "partial"));
  assert.ok(result.feedback.some((item) => item.type === "partial_criterion"));
});

test("full keyword soup stays below unlock threshold and reports weak brief structure", () => {
  const practice = loadPractice();

  const result = scorePracticeAttempt({
    practice,
    input: {
      prompt: "카드 만들 강의 모바일 데스크톱 HTML 색상 hover 검증 코드블록",
    },
  });

  assert.ok(result.score > 0);
  assert.ok(result.score < 90);
  assert.equal(
    result.checks.find((check) => check.id === "brief-structure-check").status,
    "fail",
  );
  assert.ok(result.feedback.some((item) => item.type === "brief_structure"));
  assert.ok(
    result.verificationLog.some((entry) => entry.checkId === "brief-structure-check"),
  );
});

test("throws invalid_input when prompt is blank or missing", () => {
  const practice = loadPractice();

  for (const input of [undefined, null, {}, { prompt: "" }, { prompt: "   \n\t" }]) {
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

test("throws invalid_practice_definition when practice type is unknown", () => {
  assert.throws(
    () =>
      scorePracticeAttempt({
        practice: {
          id: "unknown-practice",
          type: "mystery-type",
          maxScore: 100,
        },
        input: {},
      }),
    (error) =>
      error.code === "invalid_practice_definition" &&
      error.practiceId === "unknown-practice" &&
      error.practiceType === "mystery-type",
  );
});
