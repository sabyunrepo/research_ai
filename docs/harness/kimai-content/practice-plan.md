# Kimai Workshop Practice Plan

Generated: 2026-05-28
Purpose: 슬라이드와 분리된 실습 원본 계획. 추후 하네스 엔지니어링 워크플로우에서 `practice-spec.json`, 실습 UI, 채점기, 결과 저장 구조의 기준으로 사용한다. 이 문서는 완성품 구현이 아니라 주입 소스다.

## 1. Practice Boundary

실습은 슬라이드가 아니다. 슬라이드는 실습을 소개하거나 결과를 해석할 수 있지만, 실습 자체는 별도 activity contract로 관리한다.

Act 0에는 본격 실습이 없다.

Act 0에서 허용되는 것은 기대값 정렬, 강의 지도, glossary tooltip뿐이다. 점수, 제출, 재시도, 베스트 저장이 있는 활동은 Act 1부터 시작한다.

## 2. Shared Practice Loop

Act 1-6 실습은 같은 반복 구조를 따른다.

```text
입력 -> 산출물 생성 -> 검증 -> 피드백 -> 재시도 -> 비교 -> 베스트 저장
```

단, Act 5는 로컬 실행형 실습이므로 웹 채점 대신 실행 기록과 비교 회고를 사용한다.

## 3. Practice Overview

| Act | Practice ID | Activity Type | Learner Input | Output | Verification |
|---:|---|---|---|---|---|
| 0 | none | no-practice | 없음 | Act 1 전환 이해 | 없음 |
| 1 | act1-info-selection | selection-diagnostic | 업무별 정보 다중 선택 | 김아이 추측 빈칸 리포트 | 필수/조건부/방해 정보 점수 |
| 2 | act2-prompt-iteration | prompt-writing | 자유 입력 지시문 | HTML/CSS 카드 미리보기 | 지시문 기준표 + 미리보기 검사 |
| 3 | act3-context-workbench | context-selection | 컨텍스트 자료 선택 | 개선된 카드 미리보기 | 컨텍스트 영향/오염 분석 |
| 4 | act4-skill-authoring | skill-writing | mini-brainstorming Skill 문서 | Skill review report | 구조 검사 + 행동 검사 + LLM judge |
| 5 | act5-local-team-run | local-execution | role/tool 배정과 로컬 실행 | execution log | 체크리스트 회고 |
| 6 | act6-stop-hook-checkpoint | checklist-unlock | Hook 검문소 체크리스트 | unlock prompt + 예제 구조 | 100점 unlock scoring |

## 4. Act 0: No Practice

Practice ID: `none`

Act 0은 다음 목적만 가진다.

- 김아이 세계관 소개
- 프롬프트 예문 강의가 아니라 AI 업무 시스템 강의라는 기대값 정렬
- Act 1 정보 선별 실습으로 자연스럽게 전환

Allowed interaction:

- glossary tooltip

Not allowed:

- scored quiz
- prompt input
- context selection
- retry loop
- result save

Handoff:

```text
nextPracticeId = "act1-info-selection"
```

## 5. Act 1: 정보 선별 진단

Practice ID: `act1-info-selection`

Activity type: `selection-diagnostic`

Practice name:

```text
실습 1: 김아이에게 무엇을 알려줘야 할까요?
```

Goal:

```text
수강생이 목표를 보고 김아이에게 필요한 정보와 지금 주면 방해가 되는 정보를 구분한다.
```

Learner input:

- 3개의 업무 목표를 차례로 본다.
- 각 목표마다 정보 후보를 다중 선택한다.

Question set:

1. 제품 리뷰자료 보고서
2. 결제 버튼 오류 수정
3. 발표자료 슬라이드 다듬기

Option categories:

- `required`: 없으면 김아이가 추측해야 하는 필수 정보
- `conditional`: 상황에 따라 도움이 되지만 지금은 과하거나 순서가 이른 정보
- `distractor`: 현재 목표를 흐리거나 오래된 가정을 섞는 정보

Loop:

```text
Round 1 -> Feedback 1 -> Round 2 -> Feedback 2 -> Round 3 -> Final Score -> Review
```

Result:

- 3문항 총점
- 상사 타입 타이틀
- 잘 고른 필수 정보
- 놓친 필수 정보
- 과하거나 방해가 된 정보
- 김아이가 추측하게 될 빈칸
- 검증 로그

Scoring:

```text
required: +10~+20
conditional: +2~+6
over-scoped: -3~-8
polluting: -8~-15
```

Primary lesson:

```text
프롬프트를 쓰기 전에 먼저 알려줄 정보와 빼야 할 정보를 고른다.
```

Question 1 source:

```text
목표:
김아이에게 다음 주 경영회의에 제출할 제품 리뷰자료 보고서를 준비하게 해야 합니다.
어떤 정보를 함께 줘야 할까요? 모두 고르세요.

필수 정보:
- 어떤 제품을 다루는지
- 보고서를 볼 사람이 누구인지
- 리뷰 기간과 비교 기준
- 반드시 포함할 지표 또는 자료
- 제출 형식과 분량
- 완료 기준과 제출 기한

조건부 도움 정보:
- 지난 회의에서 나온 질문 목록
- 경쟁 제품 리뷰 기사 2~3개
- 내부에서 자주 쓰는 표현 예시

방해 정보:
- 회사 전체 연혁 자료
- 아직 확정되지 않은 다음 분기 기능 아이디어
- 관련 없는 고객 문의 전체 원문
- "임원들이 좋아할 만하게 고급스럽게"라는 단독 지시
```

## 6. Act 2: 좋은 업무 지시 작성

Practice ID: `act2-prompt-iteration`

Activity type: `prompt-writing`

Practice name:

```text
실습 2: 김아이에게 제대로 업무 지시하기
```

Goal:

```text
수강생이 반응형 카드 컴포넌트 제작 prompt를 직접 작성하고, 점수와 결과물을 보면서 개선한다.
```

Learner input:

- 자유 입력 prompt

Task:

```text
김아이에게 강의 신청 페이지에 들어갈 반응형 카드 컴포넌트를 만들라고 지시해보세요.
```

Loop:

```text
Attempt 1 -> Result -> Score -> Feedback -> Attempt 2 -> Compare -> Attempt 3 -> Save
```

Generated output:

- HTML/CSS 카드 컴포넌트 미리보기
- HTML/CSS 코드 요약
- 이전 시도 대비 점수 변화

Mechanical scoring:

```text
목표 있음: 20
대상/사용 상황 있음: 15
화면 크기 또는 반응형 조건 있음: 15
제약 조건 있음: 15
완료 기준 있음: 20
보고/출력 형식 있음: 15
```

LLM judge role:

- 지시가 초보자도 이해할 만큼 구체적인지
- 요구사항끼리 충돌하지 않는지
- 결과물이 검증 가능한 기준을 포함하는지
- 불필요하게 장황하지 않은지

Primary lesson:

```text
좋은 prompt는 예쁜 문장이 아니라 목표, 조건, 자료, 완료 기준을 고정하는 업무 지시서다.
```

## 7. Act 3: 데스크 context 선택

Practice ID: `act3-context-workbench`

Activity type: `context-selection`

Practice name:

```text
실습 3: 김아이의 데스크를 세팅합니다
```

Goal:

```text
수강생이 작업 목표에 맞는 context 자료를 고르고, 선택한 자료가 산출물을 어떻게 바꾸는지 확인한다.
```

Learner input:

- 15-20개의 context 후보 중 선택

Task:

```text
Act 2에서 만든 반응형 카드 컴포넌트를 "AI 하네스 워크숍 신청 카드"로 개선하세요.
```

Candidate types:

- 필수 context
- 유용한 context
- 조건부 context
- 오염 context
- 범위 밖 context

Loop:

```text
Attempt 1 -> Generate -> Render -> Analyze -> Feedback -> Attempt 2 -> Compare -> Save
```

Generated output:

- 개선된 카드 미리보기
- 선택 context 영향 분석
- 반영/무시/충돌/오염 자료 목록

Verification:

- final-title-check
- stale-context-check
- responsive-context-check
- style-consistency-check
- accessibility-context-check
- scope-noise-check

Primary lesson:

```text
자료를 많이 넣는 것이 아니라 현재 목표에 맞는 자료를 정확히 올려야 한다.
```

## 8. Act 4: 미니 브레인스토밍 Skill 작성

Practice ID: `act4-skill-authoring`

Activity type: `skill-writing`

Practice name:

```text
실습 4: 미니 브레인스토밍 Skill을 만듭니다
```

Goal:

```text
수강생이 열린 요청을 받았을 때 AI가 바로 구현하지 않고 먼저 목적, 범위, 접근안을 좁히도록 만드는 Skill을 작성한다.
```

Learner input:

- mini-brainstorming Skill 문서

Expected structure:

- frontmatter
- name
- description
- When to Use
- Steps
- Output Format

Loop:

```text
Attempt 1 -> Structure Check -> Behavior Check -> Feedback -> Attempt 2 -> Compare -> Attempt 3 -> Save
```

Mechanical scoring:

```text
호출 조건 명확성: 20
한 번에 하나씩 질문: 15
범위 구분: 15
접근안 2~3개와 trade-off: 15
승인 전 구현 금지: 15
결정 내용을 스펙으로 남김: 10
출력 형식: 10
```

LLM judge role:

- 성급한 구현 방지
- 질문 부담
- 결정/미결정 분리
- 실제 업무 적용성

Primary lesson:

```text
반복되는 작업 전 절차는 prompt에 매번 쓰지 말고 Skill로 분리한다.
```

## 9. Act 5: 로컬 김아이 팀 실행

Practice ID: `act5-local-team-run`

Activity type: `local-execution`

Practice name:

```text
실습 5: 로컬에서 김아이 팀을 실행합니다
```

Goal:

```text
수강생이 자기 컴퓨터의 AI 에이전트 도구에서 작은 에이전트 팀을 구성하고 실행한다.
```

Learner input:

- role prompt
- Skill assignment
- Tool permission assignment
- execution log

Team:

- Coordinator
- Researcher
- Implementer
- Reviewer

Loop:

```text
Attempt 1 -> Record -> Reflect -> Attempt 2 -> Compare -> Share
```

Verification:

웹 채점 없음. 실행 체크리스트와 결과 기록 템플릿으로 검토한다.

Checklist:

- Coordinator가 먼저 목표와 제약을 정리했는가
- mini-brainstorming Skill이 Coordinator에게 적용됐는가
- Researcher가 구현하지 않았는가
- Implementer가 출처 판단을 임의로 하지 않았는가
- Reviewer가 직접 수정하지 않았는가
- 역할별 출력이 분리되어 있는가
- 최종 보고에 남은 위험이 포함되어 있는가

Primary lesson:

```text
여러 AI를 쓰는 것이 아니라 역할, context, Skill, Tool 권한을 분리하는 것이 핵심이다.
```

Fallback:

```text
로컬 환경 문제가 생기면 관찰 모드 예제 로그를 보고 역할/권한 분리를 판정한다.
```

## 10. Act 6: Stop hook 검문소 설계

Practice ID: `act6-stop-hook-checkpoint`

Activity type: `checklist-unlock`

Practice name:

```text
실습 6: 완료 전 Stop hook 검문소를 설계합니다
```

Goal:

```text
수강생이 체크리스트형 실습 화면에서 완료 전 자동 검문소를 구성한다.
```

Learner input:

- Trigger 선택
- State 선택
- Stop 조건 선택
- 완료 증거 선택

Scoring:

```text
UserPromptSubmit으로 processing 시작: +20
Stop에서 완료 전 검사: +20
processing/complete 상태 사용: +20
attempts 또는 stop_hook_active로 무한 반복 방지: +20
완료 증거 4종 포함: +20
항상 block, 항상 complete, 감정적 완료 판단 선택: 감점
```

Unlock condition:

```text
100점을 맞추면 실제 Stop hook 생성 프롬프트와 예제 파일 구조를 제공한다.
```

Unlocked output:

- `.claude/settings.local.json`
- `scripts/agent-status-start.js`
- `scripts/agent-stop-check.js`
- `.agent-status.json`

Primary lesson:

```text
완료 선언을 믿지 말고 완료 전 증거, 상태, 재시도 제한을 확인하는 검문소를 둔다.
```

## 11. Handoff To Harness

이 문서는 사람이 검토하는 실습 계획이다. 하네스 입력은 `generated-decks/kimai-workshop-content/practice-spec.json`을 기준으로 만든다.

Required separation:

```text
slide-spec.json = 실습을 소개하거나 해석하는 슬라이드
practice-spec.json = 입력, 산출물, 채점, 피드백, 재시도, 저장 계약
```

Quality gate:

```text
1. Act 0에 practiceId가 없어야 한다.
2. Act 1-6에는 practiceId가 있어야 한다.
3. 각 practice는 learnerInput, generatedOutput, verification, retryPolicy, saveTarget을 가져야 한다.
4. 실습 화면은 단발 제출이 아니라 반복 루프를 가져야 한다.
5. Act 5는 local-execution으로 표시하고 웹 점수를 강제하지 않아야 한다.
```
