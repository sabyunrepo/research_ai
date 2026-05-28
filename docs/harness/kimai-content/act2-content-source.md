# Act 2 Content Source: 좋은 업무 지시

Generated: 2026-05-28
Workspace: `/Users/byeonsanghun/goinfre/research_ai-kimai-content`
Purpose: 하네스 엔지니어링 워크플로우가 나중에 `section-plan.json`, `slide-spec.json`, `practice-spec.json`, `asset-pack.json`, `glossary.json`으로 변환할 Act 2 원본 발표 구성 문서. 이 문서는 완성품이 아니라 주입 소스다.

## 1. Act 2 결정

Act 2의 강의 부분은 Act 1에서 고른 정보를 실제 업무 지시서로 묶는 법을 설명한다.

Act 2의 실습 자체는 이 문서의 슬라이드 안에 넣지 않는다. 실습은 별도 activity contract인 `act2-prompt-iteration`에서 처리한다.

Practice ID:

```text
act2-prompt-iteration
```

Activity type:

```text
prompt-writing
```

Act 2 설명 슬라이드에서 다루는 것:

- Act 1의 정보 선별 결과 회수
- 좋은 지시문을 "업무 지시서" 비유로 설명
- 좋은 업무 지시의 6칸 소개
- 짧은 지시와 구체적 지시 비교
- 점수를 빠진 칸을 찾는 진단 장치로 설명
- 별도 prompt-writing 실습으로 넘어가는 브릿지

Act 2 설명 슬라이드에서 금지하는 것:

- 지시문 입력폼을 슬라이드 안에 넣기
- HTML/CSS 미리보기, 점수판, 검증 로그를 슬라이드 안에 구현하기
- 정답 지시문을 그대로 외우게 만들기
- CLAUDE.md, Skill, Agent, Hook 상세 설명
- LLM judge 지시문 상세 구현

## 2. Act 2 핵심 메시지

```text
좋은 프롬프트는 예쁜 문장이 아니라, 김아이에게 목표와 조건과 완료 기준을 함께 주는 업무 지시서입니다.
```

Act 2 설명이 끝나면 수강생은 다음 세 가지를 이해해야 한다.

1. Act 1에서 고른 자료는 목표와 조건을 담은 업무 지시서로 정리해야 한다.
2. 좋은 지시서는 목표, 사용 상황, 반응형 조건, 제약, 완료 기준, 출력 형식을 분명히 한다.
3. 실습에서는 반응형 카드 컴포넌트 지시를 직접 쓰고, 점수와 결과를 보며 다시 고친다.

## 3. 실습 계약 요약

실습 이름:

```text
실습 2: 김아이에게 제대로 업무 지시하기
```

전체 루프:

```text
Attempt 1 -> Result -> Score -> Feedback -> Attempt 2 -> Compare -> Attempt 3 -> Save
```

과제:

```text
김아이에게 강의 신청 페이지에 들어갈 반응형 카드 컴포넌트를 만들라고 지시해보세요.
```

채점 기준:

```text
목표 있음: 20
대상/사용 상황 있음: 15
화면 크기 또는 반응형 조건 있음: 15
제약 조건 있음: 15
완료 기준 있음: 20
보고/출력 형식 있음: 15
```

결과 화면에서 크게 보여 줄 것:

```text
현재 점수
빠진 지시서 칸
HTML/CSS 카드 미리보기
이전 시도와 현재 시도 비교
저장된 가장 나은 지시문
```

점수는 수강생 평가가 아니라 다음 시도에서 무엇을 보완할지 알려 주는 진단 장치다.

## 4. Before / After Source

Before:

```text
반응형 카드 만들어줘.
```

After direction:

```text
강의 신청 페이지에서 사용할 카드 컴포넌트를 HTML/CSS로 만들어줘.
375px에서는 세로로 쌓이고, 1024px 이상에서는 3열 그리드로 보여줘.
텍스트가 카드 밖으로 넘치지 않아야 하고, 버튼 hover/focus 상태를 포함해줘.
결과는 HTML과 CSS 코드블록으로 나눠서 보여줘.
```

After는 모범답안이 아니라 방향 예시다. 실습에서는 수강생이 자기 표현으로 다시 작성한다.

## 5. 시간과 리듬

권장 시간: 8-10분

권장 설명 슬라이드 수: 6장

리듬:

```text
Act 1 결과 회수 -> 정보와 지시의 차이 -> 업무 지시서 6칸 -> 짧은 지시의 빈칸 -> before/after 비교 -> 점수 진단과 실습 진입
```

주의:

```text
Act 2의 Attempt, Result, Score, Feedback, Compare, Save는 실습 화면에서 진행한다.
설명 슬라이드는 prompt-writing 실습을 시작할 준비까지만 만든다.
```

## 6. Slide List

### 2-1. 고른 자료는 업무 지시서에 담아야 합니다

Type: transition
Estimated time: 40초
Function: Act 1 결과 회수

Screen headline:

```text
고른 자료는 업무 지시서에 담아야 합니다.
```

Screen subline:

```text
김아이에게 맡길 수 있는 업무 지시서로 묶어야 합니다.
```

Presenter flow:

```text
Act 1에서 필요한 정보와 방해 정보를 골랐다고 회수한다.
하지만 정보 카드가 흩어져 있으면 김아이는 아직 무엇을 먼저 해야 하는지 모를 수 있다고 말한다.
Act 2에서는 고른 정보를 실제 업무 지시로 묶는다고 안내한다.
```

Visual:

```text
흩어진 정보 카드가 하나의 업무 지시서로 모이는 손그림.
```

Bridge:

```text
좋은 지시서는 김아이가 추측할 조건을 남기지 않습니다.
```

Harness note:

```text
slideType = "story-transition"
visualAssetId = "act2-info-to-instruction"
practiceId = null
```

### 2-2a. 좋은 지시서는 목표와 대상을 먼저 고정합니다

Type: concept slide
Estimated time: 45초
Function: 목표와 대상 고정

Screen headline:

```text
좋은 지시서는 목표와 대상을 먼저 고정합니다.
```

Screen anchors:

```text
목표
대상
사용 상황
```

Presenter flow:

```text
김아이에게 가장 먼저 필요한 것은 무엇을 왜 만드는지다.
대상과 사용 상황이 없으면 같은 지시도 전혀 다른 결과가 된다.
좋은 지시서는 목표, 대상, 사용 상황을 먼저 고정한다고 말한다.
```

Visual:

```text
업무 지시서 첫 구역에 목표, 대상, 사용 상황 칸이 크게 보이는 손그림.
```

Bridge:

```text
그다음에는 김아이가 참고할 자료와 지킬 조건을 정합니다.
```

Harness note:

```text
visualAssetId = "act2-instruction-goal-audience"
practiceId = null
```

### 2-2b. 좋은 지시서는 자료와 조건을 따로 지정합니다

Type: concept slide
Estimated time: 45초
Function: 자료와 조건 고정

Screen headline:

```text
좋은 지시서는 자료와 조건을 따로 지정합니다.
```

Screen anchors:

```text
참고 자료
지킬 조건
빼야 할 것
```

Presenter flow:

```text
자료와 조건은 섞지 않고 따로 지정한다.
김아이가 무엇을 보고 일할지, 무엇을 지킬지, 무엇은 쓰지 말아야 할지를 분명히 한다.
이렇게 해야 자료가 많아도 방향이 흐려지지 않는다.
```

Visual:

```text
업무 지시서 중간 구역에 참고 자료, 지킬 조건, 빼야 할 것 칸이 보이는 손그림.
```

Bridge:

```text
마지막으로 결과물이 어떤 모양이면 끝인지 정합니다.
```

Harness note:

```text
visualAssetId = "act2-instruction-material-constraints"
practiceId = null
```

### 2-2c. 좋은 지시서는 출력 형식과 완료 기준을 정합니다

Type: concept slide
Estimated time: 45초
Function: 출력과 완료 기준 고정

Screen headline:

```text
좋은 지시서는 출력 형식과 완료 기준을 정합니다.
```

Screen anchors:

```text
출력 형식
완료 기준
확인 방법
```

Presenter flow:

```text
마지막으로 결과물이 어떤 모양으로 나와야 하는지 정한다.
완료 기준과 확인 방법이 없으면 김아이는 스스로 끝났다고 판단한다.
Act 2 실습에서는 이 빠진 조건을 채우는 일을 하게 된다고 연결한다.
```

Visual:

```text
업무 지시서 마지막 구역에 출력 형식, 완료 기준, 확인 방법 칸이 보이는 손그림.
```

Bridge:

```text
빠진 조건이 있으면 김아이는 자기 방식으로 채웁니다.
```

Harness note:

```text
visualAssetId = "act2-instruction-output-done"
practiceId = null
```

### 2-3. 짧은 요청은 김아이에게 너무 많은 결정을 맡깁니다

Type: contrast setup
Estimated time: 70초
Function: 짧은 지시의 빈칸

Screen headline:

```text
짧은 요청은 김아이에게 너무 많은 결정을 맡깁니다.
```

Screen anchors:

```text
어떤 화면인가
어떤 크기인가
어떻게 확인하나
```

Presenter flow:

```text
이 문장은 익숙하고 짧지만, 김아이 입장에서는 사용 화면, 화면 크기, 완료 기준이 비어 있다고 설명한다.
김아이는 이런 빈칸을 보통의 카드 모양으로 추측할 가능성이 크다고 말한다.
```

Visual:

```text
짧은 지시 문장 옆에 세 개의 빈칸 말풍선이 뜨는 손그림.
```

Bridge:

```text
필요한 조건을 채우면 결과 방향이 달라집니다.
```

Harness note:

```text
visualAssetId = "act2-short-prompt-gaps"
practiceId = null
```

### 2-4. 조건을 채우면 결과의 방향이 달라집니다

Type: before/after contrast
Estimated time: 80초
Function: 좋은 지시 방향 예시

Screen headline:

```text
조건을 채우면 결과의 방향이 달라집니다.
```

Screen anchors:

```text
강의 신청 페이지
375px과 1024px
넘침 없음
```

Presenter flow:

```text
Before와 After를 정답 암기가 아니라 방향 비교로 보여 준다.
After는 목표, 사용 상황, 반응형 조건, 완료 기준, 출력 형식을 더 많이 채운 예시라고 설명한다.
수강생이 그대로 따라 쓰는 것이 아니라 자기 표현으로 다시 쓰게 될 것이라고 말한다.
```

Visual:

```text
왼쪽에는 짧은 지시, 오른쪽에는 6칸이 채워진 업무 지시서가 있는 비교 손그림.
```

Bridge:

```text
점수는 빠진 조건을 보여 줍니다.
```

Harness note:

```text
visualAssetId = "act2-before-after-instruction"
practiceId = null
```

### 2-5. 점수는 다음에 채울 조건을 알려 줍니다

Type: system explanation
Estimated time: 70초
Function: scoring 의미 설명

Screen headline:

```text
점수는 다음에 채울 조건을 알려 줍니다.
```

Screen anchors:

```text
있음
부분적
빠짐
```

Presenter flow:

```text
점수는 수강생 평가가 아니라 다음 시도에서 무엇을 보완할지 알려 주는 장치라고 설명한다.
기계 채점은 목표, 사용 상황, 반응형 조건, 제약, 완료 기준, 출력 형식의 유무를 본다.
LLM judge는 충돌 여부와 검증 가능성을 보조로 본다고 짧게만 연결한다.
```

Visual:

```text
업무 지시서 6칸 옆에 있음/부분적/빠짐 스탬프가 찍히는 손그림.
```

Bridge:

```text
이 기준으로 첫 지시서를 써 봅니다.
```

Harness note:

```text
visualAssetId = "act2-score-diagnostic"
glossaryTerms = ["Evaluation"]
practiceId = null
```

### 2-6. 첫 지시서는 실행해 보고 고칩니다

Type: practice handoff
Estimated time: 50초
Function: 별도 실습 진입

Screen headline:

```text
첫 지시서는 실행해 보고 고칩니다.
```

Screen anchors:

```text
지시문 쓰기
결과 보기
다시 고치기
```

Presenter flow:

```text
이제 별도 실습 화면으로 넘어간다고 말한다.
과제는 강의 신청 페이지의 반응형 카드 컴포넌트다.
처음부터 완벽하게 쓰지 말고 점수와 결과를 보고 세 번 고치는 흐름이라고 안내한다.
```

Visual:

```text
실습 UI 자체가 아니라, Attempt 1 -> Score -> Retry -> Best Save 흐름 카드만 보여 준다.
```

Bridge:

```text
처음부터 완벽할 필요는 없습니다. 결과를 보고 채우면 됩니다.
```

Harness note:

```text
practiceId = null
nextPracticeId = "act2-prompt-iteration"
handoffOnly = true
```

## 7. Asset Requirements

Act 2의 이미지는 지시문 작성 팁 카드가 아니라 업무 지시서 구조를 설명해야 한다.

Required visual assets:

```text
act2-info-to-instruction
act2-six-slot-instruction
act2-short-prompt-gaps
act2-before-after-instruction
act2-score-diagnostic
```

자산 생성 원칙:

- `act2-info-to-instruction`은 Act 1에서 고른 정보 카드가 업무 지시서로 묶이는 장면이어야 한다.
- `act2-six-slot-instruction`은 6칸을 모두 보여 주되 화면 앵커는 세 묶음으로 설명 가능해야 한다.
- `act2-short-prompt-gaps`는 짧은 지시문의 빈칸을 비난이 아니라 진단으로 보여 줘야 한다.
- `act2-before-after-instruction`은 정답 지시문 암기가 아니라 지시서 칸이 채워지는 차이를 보여 줘야 한다.
- `act2-score-diagnostic`은 점수를 성적표가 아니라 빠진 칸 찾기 도구로 보여 줘야 한다.
- 실습 UI, HTML/CSS 미리보기, 제출 버튼, 검증 로그는 이 설명 슬라이드 이미지에 넣지 않는다.

## 8. Handoff To Harness

Suggested transformation:

```text
act2-content-source.md
-> section-plan.json: Act 2 설명 시간, slide ids, nextPracticeId
-> slide-spec.json: screen headline, message, anchors, bridge, presenter cues
-> practice-spec.json: prompt-writing task, scoring, retry loop
-> asset-pack.json: Act 2 teaching images and semantic requirements
-> glossary.json: Prompt / Evaluation tooltip seed
```

Required checks before deck build:

```text
1. Act 2 설명 슬라이드가 지시문 입력 UI를 포함하지 않는가?
2. Act 1에서 고른 정보가 업무 지시서로 이어지는가?
3. 좋은 지시문이 예쁜 문장이 아니라 업무 지시서로 설명되는가?
4. 6칸을 한 장에 길게 압축하지 않고 세 묶음으로 설명하는가?
5. 점수는 평가가 아니라 빠진 칸 진단으로 보이는가?
6. 마지막 슬라이드가 별도 Act 2 실습으로 자연스럽게 넘어가는가?
```

## 9. Additional Explanation Slides

### 2-7. 업무 지시서는 신입이 바로 움직일 수 있게 만드는 문서입니다
- Function: 현실 비유
- Headline: `업무 지시서는 신입이 바로 움직일 수 있게 만드는 문서입니다.`
- Anchors: `무엇을 만들지`, `무엇을 지킬지`, `언제 끝나는지`
- Bridge: `지시서에 빈칸이 있으면 김아이는 스스로 기준을 정합니다.`

### 2-8. 비어 있는 조건은 김아이가 자기 기준으로 채웁니다
- Function: 작동 원리와 문제 조건
- Headline: `비어 있는 조건은 김아이가 자기 기준으로 채웁니다.`
- Anchors: `사용자 추측`, `조건 추측`, `완료 추측`
- Bridge: `AI에게 주는 업무 지시가 프롬프트입니다.`

### 2-9. AI에게 주는 업무 지시가 프롬프트입니다
- Function: 실제 용어 연결
- Headline: `AI에게 주는 업무 지시가 프롬프트입니다.`
- Anchors: `업무 지시서`, `실행 조건`, `Prompt`, `Task Specification`
- Bridge: `그래서 Act 2는 김아이가 추측하지 않게 조건을 채우는 시간입니다.`

### 2-10. Act 2에서는 김아이가 추측하지 않게 조건을 채웁니다
- Function: 실습 이유
- Headline: `Act 2에서는 김아이가 추측하지 않게 조건을 채웁니다.`
- Anchors: `목표`, `조건`, `완료 기준`
- Bridge: `다음 Act에서는 이 지시서가 어떤 자료를 보고 실행되는지 다룹니다.`
