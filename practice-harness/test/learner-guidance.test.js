const assert = require("node:assert/strict");
const test = require("node:test");

const { createPracticeDefinitionStore } = require("../src/practice-definition-store");

function loadPractice(id) {
  return createPracticeDefinitionStore().getPractice(id);
}

function assertLearningBasics(practice) {
  assert.equal(typeof practice.learning.goal, "string", `${practice.id} goal`);
  assert.ok(practice.learning.goal.length >= 20, `${practice.id} goal is specific`);
  assert.equal(typeof practice.learning.task, "string", `${practice.id} task`);
  assert.ok(practice.learning.task.length >= 20, `${practice.id} task is specific`);
  assert.ok(Array.isArray(practice.learning.hints), `${practice.id} hints`);
  assert.ok(practice.learning.hints.length >= 3, `${practice.id} has starter hints`);
}

test("Act 2 exposes visible prompt-writing goal, six ingredients, and before example", () => {
  const practice = loadPractice("act2-prompt-brief");

  assertLearningBasics(practice);
  assert.match(practice.learning.goal, /반응형 카드|Act 1/);
  assert.ok(Array.isArray(practice.learning.ingredients));
  assert.deepEqual(
    practice.learning.ingredients.map((item) => item.label),
    ["목표", "대상/사용 상황", "반응형 조건", "제약 조건", "완료 기준", "출력 형식"],
  );
  assert.equal(typeof practice.learning.beforeExample, "string");
  assert.match(practice.learning.beforeExample, /반응형 카드/);
  assert.ok(Array.isArray(practice.learning.retryPrompts));
  assert.ok(practice.learning.retryPrompts.length >= 2);
});

test("Act 1 exposes information-selection goal, hints, and Act 2 bridge", () => {
  const practice = loadPractice("act1-info-selection");

  assertLearningBasics(practice);
  assert.match(practice.learning.goal, /정보|추측|김아이/);
  assert.match(practice.learning.task, /필요한 정보|불필요한 정보/);
  assert.match(practice.learning.bridge, /Act 2|프롬프트|업무 지시/);
  assert.ok(
    practice.learning.hints.some((hint) => /완벽한 프롬프트/.test(hint)),
    "Act 1 explains it is not prompt writing yet",
  );
});

test("Act 3 exposes the provided CLAUDE.md source and split guidance", () => {
  const practice = loadPractice("act3-context-workbench");

  assertLearningBasics(practice);
  assert.equal(practice.type, "claude-memory");
  assert.match(practice.learning.goal, /CLAUDE\.md|회사 내규/);
  assert.equal(typeof practice.learning.sourceTemplate, "string");
  assert.match(practice.learning.sourceTemplate, /Beginner Claude Code Instructions/);
  assert.match(practice.learning.sourceTemplate, /최초 적용 모드/);
  assert.equal(typeof practice.learning.defaultDocument, "string");
  assert.match(practice.learning.defaultDocument, /# CLAUDE\.md/);
  assert.match(practice.learning.defaultDocument, /사용자 변경 보존/);
  assert.ok(Array.isArray(practice.learning.scopeOptions));
  assert.ok(practice.learning.scopeOptions.some((option) => option.id === "project"));
  assert.ok(Array.isArray(practice.learning.ruleCards));
  assert.ok(practice.learning.ruleCards.some((rule) => rule.kind === "remove"));
  assert.ok(
    practice.learning.hints.some((hint) => /로드 순서|project|reference/.test(hint)),
    "Act 3 explains scope and reference split",
  );
});

test("Act 5 exposes a single local agent-team prompt", () => {
  const practice = loadPractice("act5-agent-team-runbook");

  assertLearningBasics(practice);
  assert.match(practice.learning.goal, /하나의 프롬프트|로컬/);
  assert.equal(practice.learning.singlePromptOnly, true);
  assert.equal(typeof practice.learning.teamPrompt, "string");
  assert.match(practice.learning.teamPrompt, /김아이 에이전트팀 실행 프롬프트/);
  assert.match(practice.learning.teamPrompt, /Coordinator/);
  assert.match(practice.learning.teamPrompt, /Researcher/);
  assert.match(practice.learning.teamPrompt, /Implementer/);
  assert.match(practice.learning.teamPrompt, /Reviewer/);
  assert.match(practice.learning.teamPrompt, /작업 주제/);
  assert.match(practice.learning.teamPrompt, /요구사항 확인|요구사항 충족/);
  assert.match(practice.learning.teamPrompt, /code quality|코드 품질/i);
  assert.match(practice.learning.teamPrompt, /완료.*검증|검증.*완료/i);
  assert.ok(Array.isArray(practice.learning.localTestGuide));
  assert.ok(practice.learning.localTestGuide.length >= 5);
});

test("Act 4 exposes Skill-writing goal, hints, and starter template", () => {
  const practice = loadPractice("act4-mini-brainstorming-skill");

  assertLearningBasics(practice);
  assert.match(practice.learning.goal, /Skill|브레인스토밍/);
  assert.equal(typeof practice.learning.starterTemplate, "string");
  assert.match(practice.learning.starterTemplate, /name: mini-brainstorming/);
  assert.match(practice.learning.starterTemplate, /## Steps/);
  assert.match(practice.learning.starterTemplate, /## Output Format/);
  assert.match(practice.learning.starterTemplate, /Superpowers/);
  assert.match(practice.learning.starterTemplate, /HARD-GATE|hard gate|하드 게이트/i);
  assert.match(practice.learning.starterTemplate, /Explore project context|프로젝트 맥락/i);
  assert.match(practice.learning.starterTemplate, /one question at a time|한 번에 하나/i);
  assert.match(practice.learning.starterTemplate, /2-3 approaches|2-3개 접근안|2~3개 접근안/i);
  assert.ok(Array.isArray(practice.learning.retryPrompts));
  assert.ok(practice.learning.retryPrompts.length >= 2);
});

test("Act 6 explains the completion gate and labels the unlock artifact", () => {
  const practice = loadPractice("act6-stop-hook-gate");

  assertLearningBasics(practice);
  assert.match(practice.learning.goal, /Stop hook|검문소/);
  assert.ok(Array.isArray(practice.learning.kindLegend));
  assert.equal(typeof practice.learning.unlockIntro, "string");
  assert.match(practice.learning.unlockIntro, /100점|프롬프트|예제/);
});
