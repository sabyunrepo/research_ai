# Act 4 Content Source: 반복 업무 매뉴얼

Generated: 2026-05-28
Workspace: `/Users/byeonsanghun/goinfre/research_ai-kimai-content`
Purpose: Act 4 설명 슬라이드와 하네스 주입 소스의 기준 문서. 실습 UI는 별도 `act4-skill-authoring` 계약에서 다룬다.

## 1. Act 4 결정

Act 4의 강의 부분은 반복되는 절차를 매번 지시문에 다시 쓰지 않고 Skill이라는 업무 매뉴얼로 분리하는 관점을 설명한다.

Practice ID:

```text
act4-skill-authoring
```

Act 4 설명 슬라이드에서 다루는 것:

- Act 3의 자료 선택 회수
- 성급하게 바로 구현하는 김아이 문제
- Skill을 반복 업무 매뉴얼로 설명
- mini-brainstorming Skill의 구조
- 별도 Skill 작성 실습 진입
- Act 5 역할 분리로 넘어가는 문제 열기

## 2. 핵심 메시지

```text
스킬은 답변 템플릿이 아니라, 김아이가 일하는 순서를 고정하는 업무 매뉴얼입니다.
```

## 3. 시간과 리듬

권장 설명 시간: 8-10분

권장 설명 슬라이드 수: 6장

리듬:

```text
Act 3 회수 -> 성급한 실행 문제 -> 매뉴얼 비유 -> 스킬 구조 -> 실습 진입 -> Act 5 브릿지
```

## 4. Slide List

### 4-1. 반복 절차는 매뉴얼로 남깁니다

- Type: transition
- Headline: `반복 절차는 매뉴얼로 남깁니다.`
- Anchors: `질문 순서`, `승인 기준`, `출력 형식`
- Visual: 같은 절차를 매번 다시 말하는 장면
- Bridge: `그래서 스킬이라는 업무 매뉴얼을 씁니다.`
- visualAssetId: `act4-repeat-procedure`

### 4-2. 모호한 요청을 받으면 김아이는 바로 실행해 버릴 수 있습니다

- Type: contrast
- Headline: `모호한 요청을 받으면 김아이는 바로 실행해 버릴 수 있습니다.`
- Anchors: `목표 미확인`, `범위 미확인`, `승인 전 구현`
- Visual: "강의 실습 좀 재밌게 바꿔줘"에 바로 아이디어를 쏟아내는 김아이
- Bridge: `먼저 물어보게 만드는 절차가 필요합니다.`
- visualAssetId: `act4-rushing-kimai`

### 4-3a. 스킬은 언제 시작할지 먼저 정합니다

- Type: concept
- Headline: `스킬은 언제 시작할지 먼저 정합니다.`
- Anchors: `호출 조건`, `입력 자료`, `멈출 조건`
- Visual: 김아이 옆의 업무 매뉴얼 첫 장에 호출 조건, 입력 자료, 멈출 조건이 표시된 손그림
- Bridge: `시작 조건이 정해지면 반복 순서를 매뉴얼로 남깁니다.`
- visualAssetId: `act4-skill-start-condition`

### 4-3b. 스킬은 반복 순서와 남길 결과를 정합니다

- Type: concept
- Headline: `스킬은 반복 순서와 남길 결과를 정합니다.`
- Anchors: `질문 순서`, `승인 기준`, `출력 형식`
- Visual: 질문, 승인, 기록 순서가 매뉴얼에 적힌 손그림
- Bridge: `오늘 만들 매뉴얼은 미니 브레인스토밍입니다.`
- visualAssetId: `act4-skill-manual`

### 4-4. 좋은 매뉴얼은 구현 전에 질문하게 합니다

- Type: system
- Headline: `좋은 매뉴얼은 구현 전에 질문하게 합니다.`
- Anchors: `한 번에 하나씩`, `접근안 비교`, `승인 후 진행`
- Visual: 질문-접근안-승인 게이트 흐름
- Bridge: `이제 이 구조를 직접 작성합니다.`
- visualAssetId: `act4-mini-brainstorming-flow`

### 4-5. 실습에서는 미니 브레인스토밍 스킬을 만듭니다

- Type: practice handoff
- Headline: `실습에서는 미니 브레인스토밍 스킬을 만듭니다.`
- Anchors: `호출 조건`, `절차`, `출력 형식`
- Visual: 실습 UI가 아니라 스킬 문서의 세 구역 안내 카드
- Bridge: `먼저 모호한 요청에서 멈추는 절차를 씁니다.`
- nextPracticeId: `act4-skill-authoring`

### 4-6. 매뉴얼이 있어도 한 명이 다 하면 판단이 섞입니다

- Type: bridge
- Headline: `매뉴얼이 있어도 한 명이 다 하면 판단이 섞입니다.`
- Anchors: `조사`, `구현`, `리뷰`
- Visual: 한 김아이가 세 모자를 동시에 쓰는 장면
- Bridge: `다음 Act에서는 역할과 도구 권한을 나눕니다.`
- visualAssetId: `act4-to-act5-roles`

## 5. Asset Requirements

Required visual assets:

```text
act4-repeat-procedure
act4-rushing-kimai
act4-skill-manual
act4-mini-brainstorming-flow
act4-to-act5-roles
```

이미지는 Skill 문법보다 반복 절차와 행동 변화가 보이게 만든다.

## 6. Additional Explanation Slides

### 4-7. 매뉴얼은 반복 업무를 매번 다시 설명하지 않기 위한 문서입니다
- Function: 현실 비유
- Headline: `매뉴얼은 반복 업무를 매번 다시 설명하지 않기 위한 문서입니다.`
- Anchors: `언제 시작할지`, `어떤 순서인지`, `무엇을 남길지`
- Bridge: `매뉴얼이 없으면 김아이는 매번 다른 순서로 시작합니다.`

### 4-8. 절차가 없으면 김아이는 매번 다른 순서로 시작합니다
- Function: 작동 원리와 문제 조건
- Headline: `절차가 없으면 김아이는 매번 다른 순서로 시작합니다.`
- Anchors: `질문 누락`, `승인 생략`, `기록 누락`
- Bridge: `AI에서 이 반복 매뉴얼이 Skill입니다.`

### 4-9. AI가 따라야 할 반복 매뉴얼이 Skill입니다
- Function: 실제 용어 연결
- Headline: `AI가 따라야 할 반복 매뉴얼이 Skill입니다.`
- Anchors: `업무 매뉴얼`, `절차 고정`, `Skill`, `Reusable Procedure`
- Bridge: `그래서 Act 4는 먼저 질문하게 만드는 매뉴얼을 쓰는 시간입니다.`

### 4-10. Act 4는 먼저 질문하게 만드는 매뉴얼을 쓰는 시간입니다
- Function: 실습 이유
- Headline: `Act 4는 먼저 질문하게 만드는 매뉴얼을 쓰는 시간입니다.`
- Anchors: `호출 조건`, `질문 순서`, `승인 후 진행`
- Bridge: `다음 Act에서는 한 명이 모든 판단을 섞지 않게 나눕니다.`
