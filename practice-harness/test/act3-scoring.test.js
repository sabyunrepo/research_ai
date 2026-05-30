const assert = require("node:assert/strict");
const path = require("node:path");
const test = require("node:test");

const { createPracticeDefinitionStore } = require("../src/practice-definition-store");
const { scorePracticeAttempt } = require("../src/scoring-engine");

const practicesDir = path.join(__dirname, "..", "practices");

const EXPECTED_CHECK_IDS = [
  "scope-selection-check",
  "rule-trim-check",
  "line-limit-check",
  "core-sections-check",
  "safety-rules-check",
  "verification-rules-check",
  "reference-split-check",
  "installer-noise-check",
  "dangerous-memory-check",
];

function loadPractice() {
  const store = createPracticeDefinitionStore({ practicesDir });
  return store.getPractice("act3-context-workbench");
}

function goodClaudeMd() {
  return [
    "# CLAUDE.md",
    "",
    "## 프로젝트 목표",
    "- 비개발자도 따라갈 수 있는 강의 실습 자료를 안전하게 만든다.",
    "",
    "## 작업 전 확인",
    "- 수정 전 관련 파일과 기존 지침을 먼저 읽고 확인한 근거를 바탕으로 작업한다.",
    "- git 저장소라면 현재 변경 상태를 확인한다.",
    "",
    "## 사용자 변경 보존",
    "- 사용자가 명시하지 않은 기존 변경사항은 되돌리지 않는다.",
    "- 삭제, 초기화, 대량 변경은 사용자 승인 없이 실행하지 않는다.",
    "",
    "## 구현 원칙",
    "- 현재 요청 범위만 작게 수정하고 관련 없는 리팩터링은 하지 않는다.",
    "- 긴 반복 절차는 CLAUDE.md에 모두 넣지 않고 Skill 또는 reference 문서로 분리한다.",
    "",
    "## 테스트와 확인",
    "- 검증하지 못했으면 완료했다고 말하지 않고 실행하지 못한 이유를 보고한다.",
    "- 관련 테스트, 빌드, 브라우저 확인 중 가능한 검증을 직접 실행한다.",
    "",
    "## QA/보안 리뷰",
    "- 작업 후 사용자 흐름과 예외 상황을 QA 관점으로 확인한다.",
    "- 토큰, API key, 개인정보는 CLAUDE.md나 로그에 남기지 않는다.",
    "",
    "## 프로젝트 참조",
    "| 규칙 | Master |",
    "| ---- | ------ |",
    "| 긴 QA/보안 체크리스트 | `docs/claude-review-checklists.md` |",
  ].join("\n");
}

test("act3 definition is a CLAUDE.md scope and rule-trimming practice", () => {
  const practice = loadPractice();

  assert.equal(practice.type, "claude-memory");
  assert.match(practice.title, /CLAUDE\.md/);
  assert.ok(Array.isArray(practice.learning.scopeOptions));
  assert.ok(Array.isArray(practice.learning.ruleCards));
  assert.ok(practice.learning.scopeOptions.some((option) => option.id === "project"));
  assert.match(practice.learning.task, /CLAUDE\.md/);
});

test("good compressed CLAUDE.md scores at least 90 with every check passing", () => {
  const practice = loadPractice();

  const result = scorePracticeAttempt({
    practice,
    input: {
      scope: "project",
      removedRuleIds: [
        "remove-skip-tests",
        "remove-old-purple",
        "remove-api-key",
        "remove-direct-output-edit",
      ],
      document: goodClaudeMd(),
    },
  });

  assert.ok(result.score >= 90);
  assert.equal(result.maxScore, 100);
  assert.deepEqual(
    result.checks.map((check) => check.id),
    EXPECTED_CHECK_IDS,
  );
  assert.ok(result.checks.every((check) => check.status === "pass"));
  assert.deepEqual(
    result.verificationLog.map((entry) => entry.checkId),
    result.checks.map((check) => check.id),
  );
});

test("wrong scope and untrimmed rule cards stay below unlock threshold", () => {
  const practice = loadPractice();

  const result = scorePracticeAttempt({
    practice,
    input: {
      scope: "global",
      removedRuleIds: ["keep-user-changes"],
      document: goodClaudeMd(),
    },
  });

  assert.ok(result.score < practice.unlockThreshold);
  assert.equal(
    result.checks.find((check) => check.id === "scope-selection-check").status,
    "fail",
  );
  assert.equal(
    result.checks.find((check) => check.id === "rule-trim-check").status,
    "fail",
  );
  assert.ok(result.feedback.some((item) => item.type === "wrong_scope"));
  assert.ok(result.feedback.some((item) => item.type === "rule_overload"));
});

test("dangerous or stale memory rules lower the score and explain the risk", () => {
  const practice = loadPractice();

  const result = scorePracticeAttempt({
    practice,
    input: {
      scope: "project",
      removedRuleIds: [
        "remove-skip-tests",
        "remove-old-purple",
        "remove-api-key",
        "remove-direct-output-edit",
      ],
      document: [
        goodClaudeMd(),
        "",
        "- 테스트가 오래 걸리면 생략해도 된다.",
        "- 예전에는 보라색 그라디언트를 기본 스타일로 썼다.",
        "- API 키와 개인 토큰은 예시로 CLAUDE.md에 적어둔다.",
      ].join("\n"),
    },
  });

  assert.ok(result.score < practice.unlockThreshold);
  assert.equal(
    result.checks.find((check) => check.id === "dangerous-memory-check").status,
    "fail",
  );
  assert.ok(result.feedback.some((item) => item.type === "dangerous_memory"));
});

test("throws invalid_input when CLAUDE.md scope, removed rule ids, or document are invalid", () => {
  const practice = loadPractice();

  for (const input of [
    undefined,
    null,
    {},
    { scope: "project", removedRuleIds: [], document: "" },
    { scope: "project", removedRuleIds: [], document: " \n\t" },
    { scope: "missing", removedRuleIds: [], document: goodClaudeMd() },
    { scope: "project", removedRuleIds: "remove-skip-tests", document: goodClaudeMd() },
    { scope: "project", removedRuleIds: ["missing-rule"], document: goodClaudeMd() },
    {
      scope: "project",
      removedRuleIds: ["remove-skip-tests", "remove-skip-tests"],
      document: goodClaudeMd(),
    },
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
