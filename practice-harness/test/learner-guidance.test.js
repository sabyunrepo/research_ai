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

test("Act 3 exposes CLAUDE.md compression goal, installer source, and split guidance", () => {
  const practice = loadPractice("act3-context-workbench");

  assertLearningBasics(practice);
  assert.equal(practice.type, "claude-memory");
  assert.match(practice.learning.goal, /CLAUDE\.md|기억/);
  assert.equal(typeof practice.learning.sourceTemplate, "string");
  assert.match(practice.learning.sourceTemplate, /Beginner Claude Code Instructions/);
  assert.ok(
    practice.learning.hints.some((hint) => /200줄|reference|그대로 복사/.test(hint)),
    "Act 3 explains compression and reference split",
  );
});

test("Act 5 exposes local execution templates, tool permissions, and runbook shape", () => {
  const practice = loadPractice("act5-agent-team-runbook");

  assertLearningBasics(practice);
  assert.match(practice.learning.goal, /로컬|역할|Tool|Skill/);
  assert.ok(Array.isArray(practice.learning.roleTemplates));
  assert.deepEqual(
    practice.learning.roleTemplates.map((item) => item.role),
    ["Coordinator", "Researcher", "Implementer", "Reviewer"],
  );
  assert.ok(Array.isArray(practice.learning.toolPermissions));
  assert.ok(practice.learning.toolPermissions.length >= 4);
  assert.equal(typeof practice.learning.teamPrompt, "string");
  assert.match(practice.learning.teamPrompt, /한 번에 복사/);
  assert.match(practice.learning.teamPrompt, /Coordinator/);
  assert.match(practice.learning.teamPrompt, /Researcher/);
  assert.match(practice.learning.teamPrompt, /Implementer/);
  assert.match(practice.learning.teamPrompt, /Reviewer/);
  assert.match(practice.learning.teamPrompt, /Superpowers/);
  assert.match(practice.learning.teamPrompt, /fresh subagent|새 subagent|새 에이전트/i);
  assert.match(practice.learning.teamPrompt, /spec compliance|스펙 준수/i);
  assert.match(practice.learning.teamPrompt, /code quality|코드 품질/i);
  assert.match(practice.learning.teamPrompt, /verification-before-completion|완료 전 검증/i);
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
