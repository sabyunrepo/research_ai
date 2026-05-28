# Act 2 Content Source: 좋은 업무 지시

Generated: 2026-05-28
Workspace: `/Users/byeonsanghun/goinfre/research_ai-kimai-content`
Purpose: 하네스 엔지니어링 워크플로우가 나중에 `section-plan.json`, `slide-spec.json`, `practice-spec.json`, `asset-pack.json`, `glossary.json`으로 변환할 Act 2 원본 발표 구성 문서. 이 문서는 완성품이 아니라 주입 소스다.

## 1. Act 2 결정

Act 2의 강의 부분은 Act 1에서 고른 정보를 바탕으로 김아이에게 업무 지시를 주는 법을 설명한다.

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
- 좋은 지시문을 "업무 지시" 비유로 설명
- 좋은 업무 지시가 해야 할 일, 참고할 자료, 지킬 기준, 완료 기준을 정한다는 흐름
- 대충 던진 지시와 빠진 곳 없는 업무 지시의 차이
- 프롬프트를 멋진 문장이 아니라 빠진 곳 없는 업무 지시로 재정의
- 별도 prompt-writing 실습으로 넘어가는 브릿지

Act 2 설명 슬라이드에서 금지하는 것:

- 지시문 입력폼을 슬라이드 안에 넣기
- 보고서 초안 미리보기, 점수판, 검증 로그를 슬라이드 안에 구현하기
- 정답 지시문을 그대로 외우게 만들기
- CLAUDE.md, Skill, Agent, Hook 상세 설명
- LLM judge 지시문 상세 구현

## 2. Act 2 핵심 메시지

```text
좋은 프롬프트는 예쁜 문장이 아니라, 김아이에게 목표와 조건과 완료 기준을 함께 주는 업무 지시입니다.
```

Act 2 설명이 끝나면 수강생은 다음 세 가지를 이해해야 한다.

1. Act 1에서 고른 자료는 업무 지시 안에서 참고할 자료로 연결되어야 한다.
2. 좋은 업무 지시는 해야 할 일, 참고할 자료, 지킬 기준, 완료 기준을 분명히 한다.
3. 실습에서는 제품 리뷰자료 보고서 업무 지시를 직접 쓰고, 피드백을 보며 다시 고친다.

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
김아이에게 다음 주 경영회의에 제출할 제품 리뷰자료 보고서를 준비하라고 지시해보세요.
```

채점 기준:

```text
보고서 목적 있음: 20
사용 상황 있음: 15
참고 자료 있음: 15
비교 기준 있음: 15
분량/톤/제외 조건 있음: 15
형식/마감/확인 기준 있음: 20
```

결과 화면에서 크게 보여 줄 것:

```text
현재 점수
빠진 업무 지시 조건
보고서 초안 미리보기
이전 시도와 현재 시도 비교
저장된 가장 나은 지시문
```

점수는 수강생 평가가 아니라 다음 시도에서 무엇을 보완할지 알려 주는 진단 장치다.

## 4. Before / After Source

Before:

```text
제품 리뷰자료 보고서 준비해줘.
```

After direction:

```text
다음 주 경영회의에서 볼 제품 리뷰자료 보고서 초안을 준비해줘.
대상 제품은 올해 2분기 출시한 모바일 앱이고, 참고 자료는 고객 리뷰 30건 요약과 경쟁 제품 리뷰 기사 3개야.
보고서는 긍정 반응, 반복 불만, 경쟁 제품과의 차이를 나눠서 정리해줘.
분량은 A4 2쪽 이내, 톤은 임원 보고용으로 간결하게, 확인이 안 된 다음 분기 기능 아이디어는 빼줘.
결과는 목차와 표 형식 요약, 마지막 확인 질문 3개로 제출해줘.
```

After는 모범답안이 아니라 방향 예시다. 실습에서는 수강생이 자기 표현으로 다시 작성한다.

## 5. 시간과 리듬

권장 시간: 8-10분

권장 설명 슬라이드 수: 11장

리듬:

```text
Act 1 책상 정리 회수 -> 모호한 지시 위험 -> 말하지 않은 부분의 상상 -> 입력/결과 원리 -> 인수인계서 비유 -> 목표와 사용 상황 -> 자료와 조건 -> 출력 형식과 완료 기준 -> Prompt 용어 연결 -> 프롬프트 재정의 -> 실습 진입
```

주의:

```text
Act 2의 Attempt, Result, Score, Feedback, Compare, Save는 실습 화면에서 진행한다.
설명 슬라이드는 업무 지시를 다시 해 볼 준비까지만 만든다.
화면 타이틀과 발표 흐름에서는 업무 지시를 기본 용어로 사용한다.
```

## 6. Slide List

### 2-1. 책상을 정리했으면 이제 일을 맡길 차례입니다

Type: transition
Estimated time: 50초
Function: Act 1 결과 회수

Screen headline:

```text
책상을 정리했으면 이제 일을 맡길 차례입니다.
```

Screen anchors:

```text
정리된 책상
```

Presenter flow:

```text
Act 1에서 김아이 책상에 올릴 자료를 골랐다고 회수한다.
일할 준비가 되었으면 김아이에게 일을 시켜야 한다고 말한다.
```

Visual:

```text
책상을 정리했으면 이제 일을 맡길 차례입니다. 장면을 설명하는 손그림.
```

Bridge:

```text
모호한 지시는 김아이가 어떤 결과를 낼지 모르게 만듭니다.
```

Harness note:

```text
visualAssetId = "act2-work-handoff"
practiceId = null
```

### 2-2. 모호한 지시는 김아이가 어떤 결과를 낼지 모르게 만듭니다

Type: problem
Estimated time: 50초
Function: 모호한 지시 위험

Screen headline:

```text
모호한 지시는 김아이가 어떤 결과를 낼지 모르게 만듭니다.
```

Screen anchors:

```text
보고서?
요약표?
리뷰 모음?
```

Presenter flow:

```text
제품 리뷰자료 보고서 준비해줘 같은 지시가 왜 결과를 예측하기 어렵게 만드는지 보여 준다.
같은 지시에서 김아이가 보고서, 요약표, 리뷰 모음을 모두 상상할 수 있다고 설명한다.
```

Visual:

```text
모호한 지시는 김아이가 어떤 결과를 낼지 모르게 만듭니다. 장면을 설명하는 손그림.
```

Bridge:

```text
말하지 않은 부분은 김아이 혼자 상상합니다.
```

Harness note:

```text
visualAssetId = "act2-vague-outcome-risk"
practiceId = null
```

### 2-3. 말하지 않은 부분은 김아이 혼자 상상합니다

Type: problem
Estimated time: 50초
Function: 지시 빈칸 추측

Screen headline:

```text
말하지 않은 부분은 김아이 혼자 상상합니다.
```

Screen anchors:

```text
목적 추측
자료 추측
완료 추측
```

Presenter flow:

```text
Act 1에서는 자료가 없으면 상상한다고 했고, Act 2에서는 지시가 없으면 상상한다고 확장한다.
지시에서 빠진 목적, 자료, 완료 기준은 김아이가 자기 방식으로 채운다고 설명한다.
```

Visual:

```text
말하지 않은 부분은 김아이 혼자 상상합니다. 장면을 설명하는 손그림.
```

Bridge:

```text
들어가는 정보가 좋아야 나오는 결과도 좋아집니다.
```

Harness note:

```text
visualAssetId = "act2-unspoken-imagination"
practiceId = null
```

### 2-4. 들어가는 정보가 좋아야 나오는 결과도 좋아집니다

Type: principle
Estimated time: 50초
Function: 입력과 결과 원리

Screen headline:

```text
들어가는 정보가 좋아야 나오는 결과도 좋아집니다.
```

Screen anchors:

```text
좋은 입력
좋은 판단
좋은 결과
```

Presenter flow:

```text
AI 결과물은 갑자기 좋아지지 않는다.
김아이에게 들어가는 지시와 자료의 품질이 판단과 결과의 품질을 만든다고 설명한다.
```

Visual:

```text
들어가는 정보가 좋아야 나오는 결과도 좋아집니다. 장면을 설명하는 손그림.
```

Bridge:

```text
그래서 김아이에게는 혼자 일할 수 있게 만드는 인수인계서가 필요합니다.
```

Harness note:

```text
visualAssetId = "act2-input-output-principle"
practiceId = null
```

### 2-5. 인수인계서는 김아이가 혼자 일할 수 있게 만드는 문서입니다

Type: analogy
Estimated time: 50초
Function: 인수인계서 비유

Screen headline:

```text
인수인계서는 김아이가 혼자 일할 수 있게 만드는 문서입니다.
```

Screen anchors:

```text
목표
자료
조건
완료 기준
```

Presenter flow:

```text
여기서 인수인계서는 반복 업무 매뉴얼이 아니라 이번 일을 시작할 수 있게 조건을 묶은 문서라고 선을 긋는다.
김아이가 혼자 움직일 수 있게 목표, 자료, 조건, 완료 기준을 한곳에 모은다고 설명한다.
```

Visual:

```text
인수인계서는 김아이가 혼자 일할 수 있게 만드는 문서입니다. 장면을 설명하는 손그림.
```

Bridge:

```text
좋은 지시서는 일의 목표와 사용 상황을 먼저 고정합니다.
```

Harness note:

```text
visualAssetId = "act2-handoff-document"
practiceId = null
```

### 2-6. 좋은 지시서는 일의 목표와 사용 상황을 먼저 고정합니다

Type: concept
Estimated time: 50초
Function: 목표와 사용 상황 고정

Screen headline:

```text
좋은 지시서는 일의 목표와 사용 상황을 먼저 고정합니다.
```

Screen anchors:

```text
무엇을 만들지
어디에 쓸지
무엇을 결정할지
```

Presenter flow:

```text
좋은 지시의 첫 부분은 목표와 사용 상황이다.
보고서인지 표인지, 어디에 쓸지, 무엇을 결정할지가 먼저 정해져야 한다고 설명한다.
```

Visual:

```text
좋은 지시서는 일의 목표와 사용 상황을 먼저 고정합니다. 장면을 설명하는 손그림.
```

Bridge:

```text
좋은 지시서는 자료와 조건을 따로 지정합니다.
```

Harness note:

```text
visualAssetId = "act2-goal-use-context"
practiceId = null
```

### 2-7. 좋은 지시서는 자료와 조건을 따로 지정합니다

Type: concept
Estimated time: 50초
Function: 자료와 조건 분리

Screen headline:

```text
좋은 지시서는 자료와 조건을 따로 지정합니다.
```

Screen anchors:

```text
제품 자료
비교 기준
분량·톤·제외 조건
```

Presenter flow:

```text
Act 1에서 정리한 책상 자료를 업무 지시와 연결한다.
자료는 무엇을 보고 일할지이고, 조건은 어떤 선을 지킬지라고 구분한다.
```

Visual:

```text
좋은 지시서는 자료와 조건을 따로 지정합니다. 장면을 설명하는 손그림.
```

Bridge:

```text
좋은 지시서는 출력 형식과 완료 기준을 정합니다.
```

Harness note:

```text
visualAssetId = "act2-materials-conditions"
practiceId = null
```

### 2-8. 좋은 지시서는 출력 형식과 완료 기준을 정합니다

Type: concept
Estimated time: 50초
Function: 출력 형식과 완료 기준

Screen headline:

```text
좋은 지시서는 출력 형식과 완료 기준을 정합니다.
```

Screen anchors:

```text
보고서 형식
마감
확인 기준
```

Presenter flow:

```text
보고서 형식과 마감, 확인 기준이 있어야 김아이가 완료를 스스로 판단하지 않는다고 설명한다.
완료 기준은 나중에 검증과도 연결된다고 짧게 예고한다.
```

Visual:

```text
좋은 지시서는 출력 형식과 완료 기준을 정합니다. 장면을 설명하는 손그림.
```

Bridge:

```text
AI에게 주는 업무 지시가 프롬프트입니다.
```

Harness note:

```text
visualAssetId = "act2-output-done-criteria"
practiceId = null
```

### 2-9. AI에게 주는 업무 지시가 프롬프트입니다

Type: term mapping
Estimated time: 50초
Function: Prompt 용어 연결

Screen headline:

```text
AI에게 주는 업무 지시가 프롬프트입니다.
```

Screen anchors:

```text
업무 지시
인수인계서
Prompt
Task Specification
```

Presenter flow:

```text
여기서 처음으로 Prompt라는 실제 용어를 붙인다.
프롬프트는 AI에게 이번 일을 맡기는 업무 지시이자 조건을 고정하는 작업 명세라고 설명한다.
```

Visual:

```text
AI에게 주는 업무 지시가 프롬프트입니다. 장면을 설명하는 손그림.
```

Bridge:

```text
프롬프트는 멋진 문장이 아니라 빠진 곳 없는 업무 지시입니다.
```

Harness note:

```text
visualAssetId = "act2-prompt-term-mapping"
practiceId = null
```

### 2-10. 프롬프트는 멋진 문장이 아니라 빠진 곳 없는 업무 지시입니다

Type: reframe
Estimated time: 50초
Function: 프롬프트 관점 전환

Screen headline:

```text
프롬프트는 멋진 문장이 아니라 빠진 곳 없는 업무 지시입니다.
```

Screen anchors:

```text
해야 할 일
참고할 것
끝난 기준
```

Presenter flow:

```text
좋은 프롬프트를 글쓰기 기술로 보지 않게 한다.
해야 할 일, 참고할 것, 끝난 기준이 빠지지 않는 업무 지시라고 정리한다.
```

Visual:

```text
프롬프트는 멋진 문장이 아니라 빠진 곳 없는 업무 지시입니다. 장면을 설명하는 손그림.
```

Bridge:

```text
첫 실습은 김아이에게 업무 지시를 다시 해 보는 일입니다.
```

Harness note:

```text
visualAssetId = "act2-prompt-reframing"
practiceId = null
```

### 2-11. 첫 실습은 김아이에게 업무 지시를 다시 해 보는 일입니다

Type: practice handoff
Estimated time: 50초
Function: 별도 실습 진입

Screen headline:

```text
첫 실습은 김아이에게 업무 지시를 다시 해 보는 일입니다.
```

Screen anchors:

```text
대충 지시 보기
업무 지시 고치기
피드백 보고 다시 쓰기
```

Presenter flow:

```text
이제 별도 실습 화면으로 넘어간다고 말한다.
첫 지시는 완벽하지 않아도 되고 피드백을 보고 다시 지시하면 된다고 안내한다.
```

Visual:

```text
첫 실습은 김아이에게 업무 지시를 다시 해 보는 일입니다. 장면을 설명하는 손그림.
```

Bridge:

```text
첫 지시는 완벽하지 않아도 됩니다. 피드백을 보고 다시 지시하면 됩니다.
```

Harness note:

```text
visualAssetId = "act2-practice-handoff"
practiceId = null
```


## 7. Asset Requirements

Act 2의 이미지는 지시문 작성 팁 카드가 아니라 업무 지시의 흐름을 설명해야 한다.

Required visual assets:

```text
act2-work-handoff
act2-vague-outcome-risk
act2-unspoken-imagination
act2-input-output-principle
act2-handoff-document
act2-goal-use-context
act2-materials-conditions
act2-output-done-criteria
act2-prompt-term-mapping
act2-prompt-reframing
act2-practice-handoff
```

자산 생성 원칙:

- `act2-work-handoff`는 Act 1에서 정리한 책상이 업무 지시로 이어지는 장면이어야 한다.
- `act2-input-output-principle`은 들어가는 정보와 나오는 결과의 관계를 단순하게 보여 줘야 한다.
- `act2-handoff-document`는 인수인계서가 이번 일을 혼자 수행할 조건 묶음이라는 점을 보여 줘야 한다.
- `act2-goal-use-context`, `act2-materials-conditions`, `act2-output-done-criteria`는 좋은 지시서의 세 구간을 각각 한 메시지로 설명해야 한다.
- `act2-vague-outcome-risk`와 `act2-unspoken-imagination`은 모호한 지시가 결과를 흔들고 빈칸을 상상으로 채우게 만든다는 문제를 보여 줘야 한다.
- `act2-prompt-term-mapping`과 `act2-prompt-reframing`은 업무 지시 비유를 Prompt / Task Specification 실제 용어로 연결해야 한다.
- `act2-practice-handoff`는 실제 입력 UI가 아니라 별도 실습으로 넘어가는 장면만 보여 줘야 한다.
- 실습 UI, 보고서 초안 미리보기, 제출 버튼, 검증 로그는 이 설명 슬라이드 이미지에 넣지 않는다.

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
2. Act 1에서 고른 정보가 업무 지시로 이어지는가?
3. 좋은 지시문이 예쁜 문장이 아니라 업무 지시로 설명되는가?
4. 해야 할 일, 참고할 자료, 지킬 기준, 완료 기준이 한 장에 압축되지 않고 순서대로 설명되는가?
5. Prompt 실제 용어가 비유 뒤에 자연스럽게 붙는가?
6. 마지막 슬라이드가 별도 Act 2 실습으로 자연스럽게 넘어가는가?
```
