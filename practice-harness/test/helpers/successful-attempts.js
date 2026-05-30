const act1Attempt = {
  learnerSessionId: "verify-act1",
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
};

const act2Attempt = {
  learnerSessionId: "verify-act2",
  input: {
    prompt: [
      "강의 신청 페이지 사용자와 수강생을 위한 카드 컴포넌트를 HTML과 CSS 코드블록으로 나눠 출력해줘.",
      "375 모바일에서는 세로로 쌓고, 768과 1024 데스크톱에서는 반응형 grid로 구현해줘.",
      "색상은 2개 이하로 쓰고, 접근성을 고려하며, 외부 라이브러리 없이 overflow가 생기거나 글자가 넘치지 않게 작성해줘.",
      "hover와 focus 상태를 포함하고, 각 상태를 확인할 수 있는 검증 기준도 함께 써줘.",
    ].join(" "),
  },
};

const act3Attempt = {
  learnerSessionId: "verify-act3",
  input: {
    scope: "project",
    removedRuleIds: [
      "remove-skip-tests",
      "remove-old-purple",
      "remove-api-key",
      "remove-direct-output-edit",
    ],
    document: [
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
    ].join("\n"),
  },
};

const act4Attempt = {
  learnerSessionId: "verify-act4",
  input: {
    document: [
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
    ].join("\n"),
  },
};

const act5Attempt = {
  learnerSessionId: "verify-act5",
  input: {
    record: `
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
`,
  },
};

const act6Attempt = {
  learnerSessionId: "verify-act6",
  input: {
    selectedIds: [
      "trigger-before-final",
      "trigger-not-on-start",
      "state-read-attempt",
      "state-write-complete",
      "stop-requires-incomplete",
      "stop-loop-guard",
      "evidence-run-tests",
      "evidence-show-logs",
    ],
  },
};

const successfulAttemptCases = [
  { act: 1, practiceId: "act1-info-selection", body: act1Attempt },
  { act: 2, practiceId: "act2-prompt-brief", body: act2Attempt },
  { act: 3, practiceId: "act3-context-workbench", body: act3Attempt },
  { act: 4, practiceId: "act4-mini-brainstorming-skill", body: act4Attempt },
  { act: 5, practiceId: "act5-agent-team-runbook", body: act5Attempt },
  { act: 6, practiceId: "act6-stop-hook-gate", body: act6Attempt },
];

function cloneAttemptBody(body) {
  return JSON.parse(JSON.stringify(body));
}

function successfulAttemptCaseByAct(act) {
  const attemptCase = successfulAttemptCases.find((item) => item.act === act);
  if (!attemptCase) {
    throw new Error(`Unknown successful practice attempt fixture for act ${act}`);
  }
  return {
    ...attemptCase,
    body: cloneAttemptBody(attemptCase.body),
  };
}

module.exports = {
  cloneAttemptBody,
  successfulAttemptCaseByAct,
  successfulAttemptCases,
};
