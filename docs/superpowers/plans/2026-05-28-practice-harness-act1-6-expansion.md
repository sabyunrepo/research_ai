# Practice Harness Act 1-6 Expansion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Act 1부터 Act 6까지 전체 강의 실습을 같은 practice harness lifecycle 안에서 실행, 제출, 채점, 비교, 저장할 수 있게 만든다.

**Architecture:** 기존 `practice-harness/`의 definition store, scoring engine, attempt store, provider fallback, HTTP app을 유지하고 실습 타입만 확장한다. Act 2~4는 웹 채점형 실습, Act 5는 로컬 실행형 실습을 안내/기록/체크하는 실습, Act 6은 기존 checklist unlock 실습으로 유지한다. 프론트는 정적 learner UI로 시작하고, 백엔드는 deterministic scoring을 우선한다.

**Tech Stack:** Node.js CommonJS, Node `http`, Node test runner, JSON practice definitions, in-memory attempt store, vanilla HTML/CSS/JS learner UI.

---

## 현재 확인 결과

현재 구현된 practice definition은 두 개뿐이다.

```text
practice-harness/practices/act1-info-selection.json
practice-harness/practices/act6-stop-hook-gate.json
```

원본 강의 설계인 `docs/harness/lecture-cuts-redesign-master-spec.md`에는 Act 1~6 전체가 정의되어 있다.

```text
Act 1: 정보 선별 - 김아이에게 무엇을 알려줘야 하는지 고른다.
Act 2: 좋은 업무 지시 - 프롬프트를 직접 쓰고 점수와 결과물을 개선한다.
Act 3: 컨텍스트 작업대 - 자료 후보를 고르고 오염/충돌을 확인한다.
Act 4: 미니 브레인스토밍 Skill - Skill 문서를 작성하고 구조/행동을 검증한다.
Act 5: 로컬 김아이 팀 - 역할, Skill, Tool 권한을 나눠 로컬 실행 기록을 남긴다.
Act 6: Stop hook 검문소 - 완료 전 검증 게이트를 설계하고 unlock artifact를 받는다.
```

## 파일 구조

새로 만들거나 수정할 파일:

```text
practice-harness/practices/
  act2-prompt-brief.json
  act3-context-workbench.json
  act4-mini-brainstorming-skill.json
  act5-agent-team-runbook.json

practice-harness/src/
  scoring-engine.js
  feedback-renderer.js
  unlock-policy.js
  create-practice-app.js
  practice-definition-store.js

practice-harness/public/
  index.html
  assets/practice-ui.css
  assets/practice-ui.js

practice-harness/test/
  act2-scoring.test.js
  act3-scoring.test.js
  act4-scoring.test.js
  act5-runbook.test.js
  definition-store.test.js
  http-app.test.js

scripts/
  serve-practice-harness.js
  verify-practice-harness.js
```

## 실습 타입 결정

```text
multi-question-choice
- Act 1
- 이미 구현됨.

prompt-brief
- Act 2
- 자유 텍스트 프롬프트를 받아 6칸 업무 지시 기준으로 채점한다.

context-selection
- Act 3
- 자료 후보 selectedIds를 받아 필수/유용/조건부/오염/범위 밖 컨텍스트를 채점한다.

skill-document
- Act 4
- 붙여넣은 Markdown/YAML Skill 문서를 구조 검사와 행동 검사로 채점한다.

local-runbook
- Act 5
- 웹 채점형이 아니라 템플릿, 체크리스트, 실행 기록 제출을 받는다.
- deterministic 점수는 "기록 완성도와 역할 분리 자기 점검"에만 사용한다.

checklist-unlock
- Act 6
- 이미 구현됨.
```

## Task 1: Definition Store를 Act 1~6 기준으로 확장

**Files:**
- Modify: `practice-harness/test/definition-store.test.js`
- Create: `practice-harness/practices/act2-prompt-brief.json`
- Create: `practice-harness/practices/act3-context-workbench.json`
- Create: `practice-harness/practices/act4-mini-brainstorming-skill.json`
- Create: `practice-harness/practices/act5-agent-team-runbook.json`
- Modify: `practice-harness/src/practice-definition-store.js`

- [ ] **Step 1: Write failing definition test**

`definition-store.test.js`에 6개 id가 순서대로 로드되는 테스트를 추가한다.

```js
assert.deepEqual(
  store.listPractices().map((practice) => practice.id),
  [
    "act1-info-selection",
    "act2-prompt-brief",
    "act3-context-workbench",
    "act4-mini-brainstorming-skill",
    "act5-agent-team-runbook",
    "act6-stop-hook-gate",
  ],
);
```

- [ ] **Step 2: Run failing test**

```bash
node --test practice-harness/test/definition-store.test.js
```

Expected: Act 2~5 definitions missing.

- [ ] **Step 3: Add minimal Act 2~5 definitions**

각 definition은 다음 공통 필드를 가진다.

```json
{
  "id": "act2-prompt-brief",
  "title": "실습 2: 김아이에게 제대로 업무 지시하기",
  "type": "prompt-brief",
  "maxScore": 100,
  "unlockThreshold": 90,
  "act": 2
}
```

Act별 title/type:

```text
act2-prompt-brief / prompt-brief / 실습 2: 김아이에게 제대로 업무 지시하기
act3-context-workbench / context-selection / 실습 3: 김아이의 작업대를 세팅합니다
act4-mini-brainstorming-skill / skill-document / 실습 4: 미니 브레인스토밍 Skill을 만듭니다
act5-agent-team-runbook / local-runbook / 실습 5: 로컬에서 김아이 팀을 실행합니다
```

- [ ] **Step 4: Sort listPractices by act**

`listPractices()`는 `act` 숫자 기준으로 반환한다. `act`가 없으면 파일명/id fallback을 쓰지 말고 invalid definition으로 실패시킨다.

- [ ] **Step 5: Verify**

```bash
node --test practice-harness/test/definition-store.test.js
```

Expected: PASS.

## Task 2: Act 2 prompt-brief scoring 구현

**Files:**
- Create: `practice-harness/test/act2-scoring.test.js`
- Modify: `practice-harness/practices/act2-prompt-brief.json`
- Modify: `practice-harness/src/scoring-engine.js`
- Modify: `practice-harness/src/feedback-renderer.js`

- [ ] **Step 1: Write failing tests**

테스트 케이스:

```text
best prompt: 목표, 대상/사용 상황, 반응형 조건, 제약, 완료 기준, 출력 형식이 모두 있으면 score 90 이상
thin prompt: "반응형 카드 만들어줘"는 partial score와 missing criteria feedback 반환
invalid prompt: prompt가 빈 문자열이면 invalid_input
```

- [ ] **Step 2: Run failing test**

```bash
node --test practice-harness/test/act2-scoring.test.js
```

Expected: `prompt-brief` scorer unsupported.

- [ ] **Step 3: Add Act 2 criteria**

Definition에 criteria를 둔다.

```json
{
  "criteria": [
    { "id": "goal", "label": "목표", "points": 20, "patterns": ["카드", "컴포넌트", "만들", "구현", "작성"] },
    { "id": "audience-context", "label": "대상/사용 상황", "points": 15, "patterns": ["강의", "신청", "페이지", "사용자", "수강생"] },
    { "id": "responsive-condition", "label": "화면 크기 또는 반응형 조건", "points": 15, "patterns": ["375", "768", "1024", "모바일", "데스크톱", "반응형", "grid", "세로"] },
    { "id": "constraints", "label": "제약 조건", "points": 15, "patterns": ["HTML", "CSS", "색상", "접근성", "라이브러리", "overflow"] },
    { "id": "completion-criteria", "label": "완료 기준", "points": 20, "patterns": ["hover", "focus", "넘치지", "확인", "검증", "상태"] },
    { "id": "output-format", "label": "보고/출력 형식", "points": 15, "patterns": ["코드블록", "HTML과 CSS", "나눠", "출력"] }
  ]
}
```

- [ ] **Step 4: Implement prompt scorer**

`scorePracticeAttempt`에서 `practice.type === "prompt-brief"`를 분기한다.

Input contract:

```json
{
  "prompt": "강의 신청 페이지에서 사용할 카드 컴포넌트를 HTML/CSS로..."
}
```

Scoring:

```text
criterion pattern 중 하나 이상 있으면 full points
약한 일반 동사만 있으면 partial points
없으면 0
checks: prompt-goal-check, audience-context-check, responsive-condition-check, constraints-check, completion-criteria-check, output-format-check
feedback: 빠진 criteria별 다음 시도 문장
verificationLog: 각 criterion status
```

- [ ] **Step 5: Verify**

```bash
node --test practice-harness/test/act2-scoring.test.js
```

Expected: PASS.

## Task 3: Act 3 context-selection scoring 구현

**Files:**
- Create: `practice-harness/test/act3-scoring.test.js`
- Modify: `practice-harness/practices/act3-context-workbench.json`
- Modify: `practice-harness/src/scoring-engine.js`

- [ ] **Step 1: Write failing tests**

테스트 케이스:

```text
clean context set: 필수 컨텍스트와 유용한 컨텍스트를 포함하고 오염 자료가 없으면 score 90 이상
polluted context set: 폐기 시안/초기 제목/미확정 할인 정책 포함 시 score 감점 및 pollution feedback
duplicate/unknown selectedIds는 invalid_input
```

- [ ] **Step 2: Add context candidate pool**

Definition에는 `items` 배열을 둔다.

Kinds:

```text
required
helpful
conditional
pollution
out-of-scope
```

필수 항목 예:

```json
{
  "id": "final-title",
  "label": "강의 최종 제목: AI 에이전트 하네스 엔지니어링",
  "kind": "required",
  "points": 12,
  "missingFeedback": "최종 제목이 없으면 김아이가 오래된 제목을 사용할 수 있습니다."
}
```

오염 항목 예:

```json
{
  "id": "stale-purple-gradient",
  "label": "지난달 폐기한 보라색 그라디언트 시안",
  "kind": "pollution",
  "points": -20,
  "feedback": "폐기된 시안은 현재 디자인 조건처럼 오해될 수 있습니다."
}
```

- [ ] **Step 3: Implement context-selection scorer**

Input contract:

```json
{
  "selectedIds": ["current-audience", "final-title", "mobile-cta-visible"]
}
```

Checks:

```text
required-context-check
stale-context-check
responsive-context-check
accessibility-context-check
scope-noise-check
```

- [ ] **Step 4: Verify**

```bash
node --test practice-harness/test/act3-scoring.test.js
```

Expected: PASS.

## Task 4: Act 4 skill-document scoring 구현

**Files:**
- Create: `practice-harness/test/act4-scoring.test.js`
- Modify: `practice-harness/practices/act4-mini-brainstorming-skill.json`
- Modify: `practice-harness/src/scoring-engine.js`

- [ ] **Step 1: Write failing tests**

테스트 케이스:

```text
complete skill document: frontmatter, name, description, steps, approval gate, output format이 있으면 score 90 이상
idea-template only: 질문 절차와 승인 게이트가 없으면 55 미만
empty document: invalid_input
```

- [ ] **Step 2: Add Act 4 criteria**

Definition criteria:

```text
trigger-description: 20
one-question-at-a-time: 15
scope-boundary: 15
approach-comparison: 15
approval-gate: 15
spec-output: 10
output-format: 10
```

- [ ] **Step 3: Implement skill-document scorer**

Input contract:

```json
{
  "document": "---\nname: mini-brainstorming\n..."
}
```

Mechanical checks use string/section matching:

```text
frontmatter-check: starts with ---
name-check: frontmatter has name:
description-trigger-check: description mentions open-ended/new feature/scope
one-question-at-a-time-check: document mentions one question at a time
approval-gate-check: document blocks implementation before user approval
spec-output-check: document requires spec/summary/decision record
```

- [ ] **Step 4: Verify**

```bash
node --test practice-harness/test/act4-scoring.test.js
```

Expected: PASS.

## Task 5: Act 5 local-runbook 실습 구현

**Files:**
- Create: `practice-harness/test/act5-runbook.test.js`
- Modify: `practice-harness/practices/act5-agent-team-runbook.json`
- Modify: `practice-harness/src/scoring-engine.js`

- [ ] **Step 1: Write failing tests**

테스트 케이스:

```text
complete runbook record: roles, skill/tool assignment, attempt1 log, attempt2 change, result reflection이 있으면 score 90 이상
single-agent record: 역할 분리 없이 한 명에게 모두 맡기면 role-separation-check fail
missing local execution note: 실행 기록이 없으면 score 낮음
```

- [ ] **Step 2: Add Act 5 templates**

Definition에 templates를 둔다.

```json
{
  "roles": ["Coordinator", "Researcher", "Implementer", "Reviewer"],
  "checklist": [
    "Coordinator가 먼저 목표와 제약을 정리했는가",
    "Researcher가 구현하지 않았는가",
    "Reviewer가 직접 수정하지 않았는가",
    "역할별 출력이 분리되어 있는가",
    "2차 시도에서 역할이나 도구 권한을 바꿔봤는가"
  ]
}
```

- [ ] **Step 3: Implement local-runbook scorer**

Input contract:

```json
{
  "checkedIds": ["coordinator-goal", "researcher-no-implementation"],
  "record": "## Attempt 1\n..."
}
```

Act 5는 웹에서 실제 로컬 실행을 검증하지 않는다. 점수는 제출된 실행 기록의 완성도와 역할 분리 자기 점검만 반영한다.

- [ ] **Step 4: Verify**

```bash
node --test practice-harness/test/act5-runbook.test.js
```

Expected: PASS.

## Task 6: HTTP/API tests를 Act 1~6으로 확장

**Files:**
- Modify: `practice-harness/test/http-app.test.js`
- Modify: `scripts/verify-practice-harness.js`

- [ ] **Step 1: Extend GET /api/practices expectation**

Expected ids:

```text
act1-info-selection
act2-prompt-brief
act3-context-workbench
act4-mini-brainstorming-skill
act5-agent-team-runbook
act6-stop-hook-gate
```

- [ ] **Step 2: Add POST smoke for Act 2~5**

Smoke payloads:

```json
{
  "act2": { "learnerSessionId": "verify-act2", "input": { "prompt": "강의 신청 페이지용 카드 컴포넌트를 HTML/CSS로 만들어줘. 375px에서는 세로, 1024px에서는 3열로 보여줘. 텍스트 overflow 없이 hover/focus 상태를 포함하고 HTML과 CSS 코드블록으로 나눠줘." } },
  "act3": { "learnerSessionId": "verify-act3", "input": { "selectedIds": ["current-audience", "required-copy", "final-title", "mobile-cta-visible", "desktop-three-column", "no-price", "focus-state"] } },
  "act4": { "learnerSessionId": "verify-act4", "input": { "document": "---\nname: mini-brainstorming\ndescription: 범위가 열린 새 기능이나 화면 개선 요청 전에 사용한다.\n---\n# Mini Brainstorming\n## Steps\n1. 목표를 한 문장으로 다시 말한다.\n2. 한 번에 하나의 질문만 한다.\n3. 원하는 것과 원하지 않는 범위를 구분한다.\n4. 2~3개 접근안을 비교한다.\n5. 사용자가 승인하기 전 구현하지 않는다.\n## Output Format\n- 목표\n- 제약\n- 접근안\n- 결정 스펙\n" } },
  "act5": { "learnerSessionId": "verify-act5", "input": { "checkedIds": ["coordinator-goal", "coordinator-skill", "researcher-no-implementation", "reviewer-no-edit", "separated-outputs", "attempt2-change"], "record": "## Attempt 1\nCoordinator, Researcher, Implementer, Reviewer를 나눴다.\n## Attempt 2 Change\nReviewer 권한을 Preview only로 줄였다.\n## Result\n역할별 출력이 분리됐다." } }
}
```

- [ ] **Step 3: Verify**

```bash
node --test practice-harness/test/http-app.test.js
node scripts/verify-practice-harness.js
```

Expected: PASS and smoke lines for Act 1~6.

## Task 7: Learner frontend 추가

**Files:**
- Create: `practice-harness/public/index.html`
- Create: `practice-harness/public/assets/practice-ui.css`
- Create: `practice-harness/public/assets/practice-ui.js`
- Modify: `scripts/serve-practice-harness.js`
- Modify: `practice-harness/test/http-app.test.js`

- [ ] **Step 1: Add static route tests**

Tests:

```text
GET / returns text/html
GET /assets/practice-ui.js returns JavaScript
GET /assets/practice-ui.css returns CSS
GET /api/practices still returns JSON
```

- [ ] **Step 2: Build UI**

UI requirements:

```text
Act selector lists Act 1~6
Act 1: multi-question checkboxes
Act 2: prompt textarea
Act 3: context item checkboxes
Act 4: skill document textarea
Act 5: checklist + record textarea
Act 6: checklist unlock
Submit button posts to /api/practices/:id/attempts
Result panel shows score, maxScore, unlocked, checks, feedback, verificationLog, unlockArtifact
Attempt history shows previous attempts for current browser session
```

- [ ] **Step 3: Verify in browser**

Run:

```bash
node scripts/serve-practice-harness.js --port 4173
```

Then browser QA:

```text
Open http://127.0.0.1:4173/
Submit Act 2 prompt
Submit Act 3 selected context
Submit Act 4 skill document
Submit Act 5 runbook
Submit Act 6 checklist and confirm unlock artifact
```

## Task 8: Final verification and documentation

**Files:**
- Modify: `docs/superpowers/plans/2026-05-28-practice-harness-backend.md` only if the old plan needs a cross-reference.
- Modify: `docs/superpowers/plans/2026-05-28-practice-harness-act1-6-expansion.md`

- [ ] **Step 1: Run full tests**

```bash
node --test practice-harness/test/*.test.js
node scripts/verify-practice-harness.js
```

Expected:

```text
all tests pass
PASS practice harness tests
PASS act1 smoke attempt
PASS act2 smoke attempt
PASS act3 smoke attempt
PASS act4 smoke attempt
PASS act5 smoke attempt
PASS act6 smoke attempt
PASS lecture integration smoke
```

- [ ] **Step 2: Browser QA**

Use cmux browser if available. If cmux browser list is empty, use Playwright with system Chrome.

Required checks:

```text
GET / renders learner UI
Act 1 submit works
Act 2 submit works
Act 3 submit works
Act 4 submit works
Act 5 submit works
Act 6 submit works and shows unlockArtifact
```

- [ ] **Step 3: Report gaps honestly**

If LLM provider integration is still `none`, report it as intentional MVP scope. Deterministic scoring must be complete before provider adapters are added.

## Execution recommendation

Recommended execution mode: `superpowers:subagent-driven-development`.

Order:

```text
1. Definition expansion
2. Act 2 scorer
3. Act 3 scorer
4. Act 4 scorer
5. Act 5 runbook scorer
6. HTTP + verify script update
7. Learner frontend
8. Browser QA and final review
```

Each scorer task should have:

```text
worker implementation
spec compliance review
code quality review
fresh test verification
```

