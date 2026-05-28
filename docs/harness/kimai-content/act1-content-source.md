# Act 1 Content Source: 정보 선별

Generated: 2026-05-28
Workspace: `/Users/byeonsanghun/goinfre/research_ai-kimai-content`
Purpose: 하네스 엔지니어링 워크플로우가 나중에 `section-plan.json`, `slide-spec.json`, `practice-spec.json`, `asset-pack.json`, `glossary.json`으로 변환할 Act 1 원본 발표 구성 문서. 이 문서는 완성품이 아니라 주입 소스다.

## 1. Act 1 결정

Act 1의 강의 부분은 첫 실습을 시작하기 전에 수강생이 "정보 선별"의 의미를 이해하게 만드는 구간이다.

Act 1의 실습 자체는 이 문서의 슬라이드 안에 넣지 않는다. 실습은 별도 activity contract인 `act1-info-selection`에서 처리한다.

Practice ID:

```text
act1-info-selection
```

Activity type:

```text
selection-diagnostic
```

Act 1 설명 슬라이드에서 다루는 것:

- Act 0의 제품 리뷰자료 보고서 장면 회수
- 목표만 있는 업무 지시가 왜 흔들리는지 설명
- 김아이가 추측하는 빈칸에 이름 붙이기
- 필수 정보, 있으면 도움, 방해 정보 구분
- Context Curation을 회사 업무 비유로 연결
- 별도 실습 화면으로 넘어가는 브릿지

Act 1 설명 슬라이드에서 금지하는 것:

- 실습 UI를 슬라이드 안에 넣기
- 점수판, 제출 버튼, 선택지 목록, 검증 로그 표시
- 자유 입력 지시문 작성
- HTML/CSS 산출물 생성
- 컨텍스트 파일 업로드
- 스킬 문서 작성
- Hook 체크리스트 설계
- LLM judge rubric 상세 설명

## 2. Act 1 핵심 메시지

```text
좋은 지시를 쓰기 전에, 김아이가 추측하지 않도록 알려줄 정보를 먼저 골라야 합니다.
```

Act 1 설명이 끝나면 수강생은 다음 세 가지를 이해해야 한다.

1. 업무 목표만 주면 김아이는 제품, 독자, 기준, 형식, 기한을 추측한다.
2. 필요한 정보와 방해되는 정보를 구분하는 일이 좋은 지시보다 먼저다.
3. 첫 실습에서는 제품 리뷰자료 보고서에 함께 줄 자료를 고른다.

## 3. 실습 계약 요약

실습 이름:

```text
실습 1: 김아이에게 무엇을 알려줘야 할까요?
```

전체 루프:

```text
Round 1 -> Feedback 1 -> Round 2 -> Feedback 2 -> Round 3 -> Final Score -> Review
```

문항:

```text
1. 제품 리뷰자료 보고서
2. 결제 버튼 오류 수정
3. 발표자료 슬라이드 다듬기
```

선택지 유형:

```text
required: 없으면 김아이가 추측해야 하는 필수 정보
conditional: 상황에 따라 도움이 되지만 지금은 과하거나 순서가 이른 정보
distractor: 현재 목표를 흐리거나 오래된 가정을 섞는 정보
```

결과 화면에서 크게 보여 줄 것:

```text
놓친 필수 정보
과하게 넣은 정보
김아이가 추측하게 될 빈칸
검증 로그
```

점수는 보조 장치다. 수강생 평가가 아니라 정보 선별 습관을 진단하기 위한 것이다.

## 4. Question 1 Source

목표:

```text
김아이에게 다음 주 경영회의에 제출할 제품 리뷰자료 보고서를 준비하게 해야 합니다.
어떤 정보를 함께 줘야 할까요? 모두 고르세요.
```

Required options:

```text
어떤 제품을 다루는지
보고서를 볼 사람이 누구인지
리뷰 기간과 비교 기준
반드시 포함할 지표 또는 자료
제출 형식과 분량
완료 기준과 제출 기한
```

Conditional options:

```text
지난 회의에서 나온 질문 목록
경쟁 제품 리뷰 기사 2~3개
내부에서 자주 쓰는 표현 예시
```

Distractor options:

```text
회사 전체 연혁 자료
아직 확정되지 않은 다음 분기 기능 아이디어
관련 없는 고객 문의 전체 원문
"임원들이 좋아할 만하게 고급스럽게"라는 단독 지시
```

Feedback principle:

```text
선택이 틀렸다고 말하지 않는다.
김아이가 무엇을 모르게 되는지, 또는 어떤 방향으로 오해할 수 있는지를 보여 준다.
```

## 5. 시간과 리듬

권장 시간: 8-10분

권장 설명 슬라이드 수: 9장

리듬:

```text
Act 0 회수 -> 책상 원리 -> 빈 책상 문제 -> 어지러운 책상 문제 -> 세 바구니 분류 -> 오늘 보고서 자료 -> Context 연결 -> Context Curation 의미 -> 실습 진입
```

주의:

```text
Act 1의 Round, Feedback, Final Review는 실습 화면에서 진행한다.
설명 슬라이드는 실습을 시작할 준비까지만 만든다.
보고서 작성법으로 깊게 들어가지 않고, 필요한 자료를 고르는 책상 정리에 집중한다.
```

## 6. Slide List

### 1-1. 우수사원 프로젝트의 첫 단계는 김아이 책상 정리입니다

Type: Takahashi transition
Estimated time: 20초
Function: Act 0 회수

Screen headline:

```text
우수사원 프로젝트의 첫 단계는 김아이 책상 정리입니다.
```

Screen subline:

```text
프롬프트를 쓰기 전에 김아이가 무엇을 보고 일할지 정합니다.
```

Presenter flow:

```text
Act 0의 우수사원 프로젝트를 회수한다.
첫 실습은 문장을 잘 쓰는 일이 아니라, 김아이 책상에 올릴 자료를 고르는 일이라고 말한다.
```

Visual:

```text
우수사원 프로젝트 지도에서 첫 단계 책상 정리가 강조되는 손그림.
```

Bridge:

```text
김아이는 책상 위에 올라온 자료를 보고 일합니다.
```

Harness note:

```text
visualAssetId = "act1-desk-cleanup-open"
practiceId = null
```

### 1-2. 김아이는 책상 위에 올라온 자료를 보고 일합니다

Type: principle slide
Estimated time: 50초
Function: 책상 원리

Screen headline:

```text
김아이는 책상 위에 올라온 자료를 보고 일합니다.
```

Screen anchors:

```text
보고 있는 자료
같이 놓인 기준
없는 정보
```

Presenter flow:

```text
김아이가 보는 자료가 결과에 바로 반영된다고 설명한다.
기준도 책상 위에 있어야 판단 방향이 정해진다.
없는 정보는 김아이가 직접 상상하게 된다고 다음 장으로 넘긴다.
```

Visual:

```text
김아이 책상 위에 자료, 기준, 빈칸 카드가 놓인 손그림.
```

Bridge:

```text
책상에 필요한 자료가 없으면 김아이는 상상하기 시작합니다.
```

Harness note:

```text
visualAssetId = "act1-desk-principle"
practiceId = null
```

### 1-3. 책상에 필요한 자료가 없으면 김아이는 상상하기 시작합니다

Type: problem slide
Estimated time: 60초
Function: 빈 책상 문제

Screen headline:

```text
책상에 필요한 자료가 없으면 김아이는 상상하기 시작합니다.
```

Screen example:

```text
"제품 리뷰자료 보고서 준비해줘."
```

Screen anchors:

```text
어떤 제품?
누가 보는지?
무엇과 비교?
```

Presenter flow:

```text
제품 리뷰자료 보고서 예시를 짧게 회수한다.
이 장은 보고서 작성법이 아니라 김아이가 추측하게 되는 빈칸을 보여 주는 장이다.
빈칸을 알면 책상 위에 올릴 자료가 보인다고 말한다.
```

Visual:

```text
필요한 자료가 없는 책상 위에 제품, 보는 사람, 비교 기준 빈칸이 떠 있고 김아이가 상상하기 시작하는 손그림.
```

Bridge:

```text
필요한 자료가 없어도 문제지만, 필요 없는 자료가 많아도 문제입니다.
```

Harness note:

```text
visualAssetId = "act1-missing-materials"
practiceId = null
```

### 1-4. 책상이 어지러워도 김아이의 판단은 흔들립니다

Type: contrast slide
Estimated time: 60초
Function: 어지러운 책상 문제

Screen headline:

```text
책상이 어지러워도 김아이의 판단은 흔들립니다.
```

Screen anchors:

```text
너무 많은 자료
관련 없는 자료
오래된 자료
```

Presenter flow:

```text
자료 부족만 문제가 아니라 자료 과다와 오염도 문제라고 설명한다.
중요한 자료가 묻히거나, 다른 제품 자료와 오래된 기준이 현재 판단을 흔들 수 있다고 말한다.
```

Visual:

```text
김아이 책상 위에 자료 더미, 다른 제품 자료, 지난 기준이 섞인 손그림.
```

Bridge:

```text
그래서 책상 위 자료는 세 바구니로 나눕니다.
```

Harness note:

```text
visualAssetId = "act1-messy-desk"
practiceId = null
```

### 1-5. 책상 위 자료는 세 바구니로 나눕니다

Type: classification slide
Estimated time: 70초
Function: 자료 분류

Screen headline:

```text
책상 위 자료는 세 바구니로 나눕니다.
```

Screen anchors:

```text
꼭 필요
있으면 도움
지금은 치움
```

Presenter flow:

```text
정보 선별은 많이 주는 일이 아니라 지금 업무에 맞게 고르는 일이라고 설명한다.
꼭 필요한 자료는 없으면 김아이가 추측하는 자료다.
있으면 도움이 되는 자료는 참고가 되지만, 지금은 치워야 하는 자료도 있다고 말한다.
```

Visual:

```text
세 개의 바구니에 자료 카드가 나뉘는 손그림. 바구니 이름만 크게 보인다.
```

Bridge:

```text
오늘 보고서에 필요한 자료만 책상 위에 올립니다.
```

Harness note:

```text
visualAssetId = "act1-info-baskets"
practiceId = null
```

### 1-6. 오늘 보고서에 필요한 자료만 책상 위에 올립니다

Type: example slide
Estimated time: 60초
Function: 보고서 자료 예시

Screen headline:

```text
오늘 보고서에 필요한 자료만 책상 위에 올립니다.
```

Screen anchors:

```text
제품 자료
보는 사람
비교 기준
보고서 형식
```

Presenter flow:

```text
보고서 분석으로 길게 들어가지 않고, 오늘 업무에 필요한 자료 예시만 보여 준다.
제품 자료, 보는 사람, 비교 기준, 보고서 형식이 책상 위에 있어야 김아이가 덜 추측한다고 말한다.
```

Visual:

```text
김아이 책상 위에 제품 자료, 보는 사람, 비교 기준, 보고서 형식 카드만 정돈된 손그림.
```

Bridge:

```text
김아이의 책상이 바로 컨텍스트입니다.
```

Harness note:

```text
visualAssetId = "act1-report-desk-materials"
practiceId = null
```

### 1-7. 김아이의 책상이 바로 컨텍스트입니다

Type: term mapping
Estimated time: 70초
Function: 실제 용어 연결

Screen headline:

```text
김아이의 책상이 바로 컨텍스트입니다.
```

Screen anchors:

```text
책상
판단 재료
Context
Context Curation
```

Presenter flow:

```text
먼저 책상 비유를 다시 말하고, 책상 위 자료가 결과에 영향을 준다는 작동 원리를 설명한다.
그 다음 실제 용어 Context를 붙인다.
Context Curation은 책상에 올릴 것과 치울 것을 고르는 일이라고 연결한다.
```

Visual:

```text
책상, 판단 재료, Context, Context Curation이 연결되는 용어 매핑 화면.
```

Bridge:

```text
컨텍스트 정리는 책상에 올릴 것과 치울 것을 정하는 일입니다.
```

Harness note:

```text
visualAssetId = "act1-context-mapping"
practiceId = null
```

### 1-8. 컨텍스트 정리는 책상에 올릴 것과 치울 것을 정하는 일입니다

Type: concept close
Estimated time: 60초
Function: Context Curation 의미 정리

Screen headline:

```text
컨텍스트 정리는 책상에 올릴 것과 치울 것을 정하는 일입니다.
```

Screen anchors:

```text
올릴 자료
옆에 둘 자료
치울 자료
```

Presenter flow:

```text
Context Curation을 어려운 용어로 설명하지 않는다.
이번 작업에 바로 쓸 자료, 참고할 자료, 판단을 흐리면 치울 자료로 나눈다고 정리한다.
```

Visual:

```text
책상 위에 올릴 자료, 옆에 둘 자료, 치울 자료가 분리되는 손그림.
```

Bridge:

```text
첫 실습은 김아이 책상을 직접 정리하는 일입니다.
```

Harness note:

```text
visualAssetId = "act1-context-curation-close"
practiceId = null
```

### 1-9. 첫 실습은 김아이 책상을 직접 정리하는 일입니다

Type: practice handoff
Estimated time: 50초
Function: 별도 실습 진입

Screen headline:

```text
첫 실습은 김아이 책상을 직접 정리하는 일입니다.
```

Screen anchors:

```text
보고서 목표 읽기
자료 바구니 나누기
빈칸 리포트 보기
```

Presenter flow:

```text
이제 별도 실습 화면으로 넘어간다고 말한다.
수강생은 보고서 목표를 읽고, 자료를 세 바구니로 나누고, 김아이가 무엇을 추측할지 확인한다.
```

Visual:

```text
실습 UI 자체가 아니라 보고서 목표 읽기, 자료 바구니 나누기, 빈칸 리포트 보기 흐름 카드만 보여 준다.
```

Bridge:

```text
첫 문제는 제품 리뷰자료 보고서입니다.
```

Harness note:

```text
nextPracticeId = "act1-info-selection"
practiceId = null
handoffOnly = true
```


## 7. Asset Requirements

Act 1의 이미지는 장식이 아니라 발표자가 설명할 수 있는 정보 선별 개념을 담아야 한다.

Required visual assets:

```text
kimai-report-request-gap
act1-report-blank-taxonomy
act1-info-baskets
act1-desk-curation
```

자산 생성 원칙:

- `kimai-report-request-gap`은 Act 0의 보고서 빈칸 장면을 회수한다.
- `act1-report-blank-taxonomy`는 제품, 독자, 기간, 비교 기준, 형식/기한이 세 묶음으로 정리되는 장면이어야 한다.
- `act1-info-baskets`는 필수 정보, 있으면 도움, 방해 정보를 구분하는 teaching image여야 한다.
- `act1-desk-curation`은 Context Curation을 김아이 데스크 정리 비유로 설명해야 한다.
- 실습 UI, 점수, 검증 로그, 결과 리포트는 이 설명 슬라이드 이미지에 넣지 않는다.

## 8. Handoff To Harness

Suggested transformation:

```text
act1-content-source.md
-> section-plan.json: Act 1 설명 시간, slide ids, nextPracticeId
-> slide-spec.json: screen headline, message, anchors, bridge, presenter cues
-> practice-spec.json: product-review-report question seed and scoring categories
-> asset-pack.json: Act 1 teaching images and semantic requirements
-> glossary.json: Context / Context Curation tooltip seed
```

Required checks before deck build:

```text
1. Act 1 설명 슬라이드가 실습 UI를 포함하지 않는가?
2. Act 0의 보고서 장면을 회수하되 같은 설명을 반복하지 않는가?
3. 각 슬라이드가 하나의 메시지만 갖는가?
4. 정보 선별이 좋은 지시문보다 먼저라는 점이 보이는가?
5. 이미지는 장식이 아니라 발표자가 가리키며 설명할 수 있는가?
6. 마지막 슬라이드가 별도 Act 1 실습으로 자연스럽게 넘어가는가?
```
