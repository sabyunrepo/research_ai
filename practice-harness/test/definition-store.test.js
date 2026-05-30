const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const test = require("node:test");

const { createPracticeDefinitionStore } = require("../src/practice-definition-store");

const practicesDir = path.join(__dirname, "..", "practices");

function createFixtureDir(t) {
  const fixtureDir = fs.mkdtempSync(path.join(os.tmpdir(), "practice-definitions-"));
  t.after(() => fs.rmSync(fixtureDir, { force: true, recursive: true }));
  return fixtureDir;
}

function writeDefinition(practicesDir, fileName, definition) {
  fs.writeFileSync(
    path.join(practicesDir, fileName),
    `${JSON.stringify(definition, null, 2)}\n`,
    "utf8",
  );
}

test("lists and loads practice definitions, and rejects unknown ids", () => {
  const store = createPracticeDefinitionStore({ practicesDir });

  assert.deepEqual(store.listPractices(), [
    {
      id: "act1-info-selection",
      title: "실습 1: 김아이에게 무엇을 알려줘야 할까요?",
      type: "multi-question-choice",
      maxScore: 100,
      unlockThreshold: 90,
      act: 1,
    },
    {
      id: "act2-prompt-brief",
      title: "실습 2: 김아이에게 제대로 업무 지시하기",
      type: "prompt-brief",
      maxScore: 100,
      unlockThreshold: 90,
      act: 2,
    },
      {
        id: "act3-context-workbench",
        title: "실습 3: CLAUDE.md 기본 기억을 정리합니다",
        type: "claude-memory",
        maxScore: 100,
      unlockThreshold: 90,
      act: 3,
    },
    {
      id: "act4-mini-brainstorming-skill",
      title: "실습 4: 미니 브레인스토밍 Skill을 만듭니다",
      type: "skill-document",
      maxScore: 100,
      unlockThreshold: 90,
      act: 4,
    },
    {
      id: "act5-agent-team-runbook",
      title: "실습 5: 로컬에서 김아이 팀을 실행합니다",
      type: "local-runbook",
      maxScore: 100,
      unlockThreshold: 80,
      act: 5,
    },
    {
      id: "act6-stop-hook-gate",
      title: "실습 6: 완료 전 Stop hook 검문소를 설계합니다",
      type: "checklist-unlock",
      maxScore: 100,
      unlockThreshold: 100,
      act: 6,
    },
  ]);

  const act1 = store.getPractice("act1-info-selection");
  assert.equal(act1.id, "act1-info-selection");
  assert.equal(act1.title, "실습 1: 김아이에게 무엇을 알려줘야 할까요?");
  assert.equal(act1.type, "multi-question-choice");
  assert.equal(act1.maxScore, 100);
  assert.equal(act1.unlockThreshold, 90);
  assert.equal(act1.act, 1);
  assert.deepEqual(
    act1.questions.map((question) => question.id),
    ["q1", "q2", "q3"],
  );

  const act6 = store.getPractice("act6-stop-hook-gate");
  assert.equal(act6.id, "act6-stop-hook-gate");
  assert.equal(act6.title, "실습 6: 완료 전 Stop hook 검문소를 설계합니다");
  assert.equal(act6.type, "checklist-unlock");
  assert.equal(act6.maxScore, 100);
  assert.equal(act6.unlockThreshold, 100);
  assert.equal(act6.act, 6);
  assert.deepEqual(
    act6.groups.map((group) => group.id),
    ["trigger", "state", "stopCondition", "evidence"],
  );
  assert.ok(
    act6.groups
      .flatMap((group) => group.items)
      .some((item) => item.id === "stop-always-block" && item.blocksUnlock === true),
  );

  assert.throws(
    () => store.getPractice("missing-practice"),
    (error) => error.code === "practice_not_found",
  );
});

test("rejects practice definitions missing required fields", (t) => {
  const fixtureDir = createFixtureDir(t);

  writeDefinition(fixtureDir, "malformed.json", {
    id: "malformed-practice",
    type: "multi-question-choice",
    maxScore: 100,
    unlockThreshold: 90,
  });

  assert.throws(
    () => createPracticeDefinitionStore({ practicesDir: fixtureDir }),
    (error) => error.code === "invalid_practice_definition",
  );
});

test("rejects practice definitions missing a positive integer act", (t) => {
  const missingActDir = createFixtureDir(t);
  writeDefinition(missingActDir, "missing-act.json", {
    id: "missing-act",
    title: "Act 누락 실습",
    type: "multi-question-choice",
    maxScore: 100,
    unlockThreshold: 90,
  });

  assert.throws(
    () => createPracticeDefinitionStore({ practicesDir: missingActDir }),
    (error) => error.code === "invalid_practice_definition" && error.field === "act",
  );

  const invalidActDir = createFixtureDir(t);
  writeDefinition(invalidActDir, "invalid-act.json", {
    id: "invalid-act",
    title: "Act 오류 실습",
    type: "multi-question-choice",
    maxScore: 100,
    unlockThreshold: 90,
    act: 0,
  });

  assert.throws(
    () => createPracticeDefinitionStore({ practicesDir: invalidActDir }),
    (error) => error.code === "invalid_practice_definition" && error.field === "act",
  );
});

test("returns immutable snapshots from getPractice and listPractices", () => {
  const store = createPracticeDefinitionStore({ practicesDir });

  const act1 = store.getPractice("act1-info-selection");
  act1.title = "mutated title";
  act1.questions[0].id = "mutated-question";

  const freshAct1 = store.getPractice("act1-info-selection");
  assert.equal(freshAct1.title, "실습 1: 김아이에게 무엇을 알려줘야 할까요?");
  assert.equal(freshAct1.questions[0].id, "q1");

  const summaries = store.listPractices();
  summaries[0].title = "mutated summary";
  summaries[0].act = 99;

  assert.deepEqual(store.listPractices()[0], {
    id: "act1-info-selection",
    title: "실습 1: 김아이에게 무엇을 알려줘야 할까요?",
    type: "multi-question-choice",
    maxScore: 100,
    unlockThreshold: 90,
    act: 1,
  });
});

test("rejects checklist definitions with missing or non-numeric item points", (t) => {
  const missingPointsDir = createFixtureDir(t);
  writeDefinition(missingPointsDir, "missing-points.json", {
    id: "missing-points",
    title: "점수 누락 실습",
    type: "checklist-unlock",
    maxScore: 100,
    unlockThreshold: 100,
    act: 6,
    groups: [
      {
        id: "trigger",
        title: "트리거",
        items: [
          {
            id: "trigger-before-final",
            label: "최종 응답 직전에 실행",
            requiredForUnlock: true,
          },
        ],
      },
    ],
  });

  assert.throws(
    () => createPracticeDefinitionStore({ practicesDir: missingPointsDir }),
    (error) =>
      error.code === "invalid_practice_definition" &&
      error.field === "groups.items.points",
  );

  const nonNumericPointsDir = createFixtureDir(t);
  writeDefinition(nonNumericPointsDir, "non-numeric-points.json", {
    id: "non-numeric-points",
    title: "숫자가 아닌 점수 실습",
    type: "checklist-unlock",
    maxScore: 100,
    unlockThreshold: 100,
    act: 6,
    groups: [
      {
        id: "trigger",
        title: "트리거",
        items: [
          {
            id: "trigger-before-final",
            label: "최종 응답 직전에 실행",
            points: "10",
            requiredForUnlock: true,
          },
        ],
      },
    ],
  });

  assert.throws(
    () => createPracticeDefinitionStore({ practicesDir: nonNumericPointsDir }),
    (error) =>
      error.code === "invalid_practice_definition" &&
      error.field === "groups.items.points",
  );
});

test("rejects duplicate practice ids", (t) => {
  const fixtureDir = createFixtureDir(t);
  const baseDefinition = {
    id: "duplicate-practice",
    title: "중복 실습",
    type: "multi-question-choice",
    maxScore: 100,
    unlockThreshold: 90,
    act: 1,
  };

  writeDefinition(fixtureDir, "a.json", baseDefinition);
  writeDefinition(fixtureDir, "b.json", {
    ...baseDefinition,
    title: "나중 중복 실습",
  });

  assert.throws(
    () => createPracticeDefinitionStore({ practicesDir: fixtureDir }),
    (error) => error.code === "duplicate_practice_id",
  );
});
