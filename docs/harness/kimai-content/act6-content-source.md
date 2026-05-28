# Act 6 Content Source: 검증과 하네스 구조

Generated: 2026-05-28
Workspace: `/Users/byeonsanghun/goinfre/research_ai-kimai-content`
Purpose: Act 6 설명 슬라이드와 하네스 주입 소스의 기준 문서. 실습 UI는 별도 `act6-stop-hook-checkpoint` 계약에서 다룬다.

## 1. Act 6 결정

Act 6의 강의 부분은 김아이의 완료 선언을 그대로 믿지 않고, 완료 직전에 증거와 상태를 확인하는 자동 검문소를 설명한다.

Practice ID:

```text
act6-stop-hook-checkpoint
```

Act 6 설명 슬라이드에서 다루는 것:

- Act 5 역할/도구 분리 회수
- 완료 선언과 완료 증거의 차이
- Hook을 완료 전 자동 검문소로 설명
- processing/complete 상태와 무한 반복 방지
- 별도 체크리스트 실습 진입
- Act 1~6 전체 하네스 구조 정리

## 2. 핵심 메시지

```text
완료는 말이 아니라, 자동 검문소를 통과한 증거로 판단해야 합니다.
```

## 3. 시간과 리듬

권장 설명 시간: 8-10분

권장 설명 슬라이드 수: 6장

리듬:

```text
Act 5 회수 -> 완료 선언의 한계 -> 자동 검문소 -> 상태와 반복 제어 -> 실습 진입 -> 전체 하네스 지도
```

## 4. Slide List

### 6-1. 완료했습니다라는 말은 증거가 아닙니다

- Type: transition
- Headline: `"완료했습니다"라는 말은 증거가 아닙니다.`
- Anchors: `무엇을 했나`, `무엇을 검증했나`, `무엇이 남았나`
- Visual: 완료 선언 말풍선과 비어 있는 증거칸
- Bridge: `완료 직전에 자동 검문소가 필요합니다.`
- visualAssetId: `act6-complete-is-not-proof`

### 6-2. 훅은 완료 전에 켜지는 자동 검문소입니다

- Type: concept
- Headline: `자동 검문소는 완료 직전에 켜집니다.`
- Anchors: `멈추기 직전`, `증거 확인`, `통과 또는 재시도`
- Visual: 김아이가 완료물을 검문소에 제출하는 장면
- Bridge: `하지만 검문소도 끝낼 때를 알아야 합니다.`
- visualAssetId: `act6-stop-checkpoint`

### 6-3. 검문소에는 상태표가 있어야 무한 반복을 막습니다

- Type: system
- Headline: `검문소에는 상태표가 있어야 무한 반복을 막습니다.`
- Anchors: `processing`, `complete`, `attempts`
- Visual: 업무 진행표와 검문소가 연결된 장면
- Bridge: `이제 체크리스트로 검문소를 설계합니다.`
- visualAssetId: `act6-state-loop-guard`

### 6-4. 실습에서는 완료 전 검문소를 체크리스트로 만듭니다

- Type: practice handoff
- Headline: `실습에서는 완료 전 검문소를 체크리스트로 만듭니다.`
- Anchors: `Trigger`, `State`, `완료 증거`
- Visual: 실습 UI가 아니라 세 묶음 체크리스트 안내 카드
- Bridge: `검문소 설계가 통과되면 실제 Stop hook 생성 프롬프트가 열립니다.`
- nextPracticeId: `act6-stop-hook-checkpoint`

### 6-5. 검문소 설계가 통과되면 생성 프롬프트와 예제 구조가 열립니다

- Type: unlock explanation
- Headline: `검문소 설계가 통과되면 생성 프롬프트와 예제 구조가 열립니다.`
- Anchors: `settings`, `status file`, `stop check`
- Visual: 설정 파일, 상태 파일, 검사 스크립트가 연결된 구조
- Bridge: `이제 오늘 만든 장치들을 하나로 묶어 봅니다.`
- visualAssetId: `act6-unlock-structure`

### 6-6. 하네스는 김아이가 흔들려도 돌아오게 만드는 업무 환경입니다

- Type: final system
- Headline: `하네스는 김아이가 흔들려도 돌아오게 만드는 업무 환경입니다.`
- Anchors: `정보와 지시`, `자료와 매뉴얼`, `역할과 검증`
- Visual: Act 1~6 결과물이 하나의 김아이 업무 환경으로 연결된 지도
- Bridge: `이제 내 업무에 가져갈 장치부터 고르면 됩니다.`
- visualAssetId: `act6-final-harness-map`

## 5. Asset Requirements

Required visual assets:

```text
act6-complete-is-not-proof
act6-stop-checkpoint
act6-state-loop-guard
act6-unlock-structure
act6-final-harness-map
```

이미지는 Hook JSON보다 완료 검문소, 상태표, 증거, 재시도 제어를 먼저 설명할 수 있어야 한다.

## 6. Additional Explanation Slides

### 6-7. 검문소는 완료라고 말하기 전에 증거를 확인하는 자리입니다
- Function: 현실 비유
- Headline: `검문소는 완료라고 말하기 전에 증거를 확인하는 자리입니다.`
- Anchors: `무엇을 했나`, `무엇을 확인했나`, `무엇이 남았나`
- Bridge: `검문소가 없으면 완료 선언을 그대로 믿게 됩니다.`

### 6-8. 검문소가 없으면 완료 선언을 그대로 믿게 됩니다
- Function: 작동 원리와 문제 조건
- Headline: `검문소가 없으면 완료 선언을 그대로 믿게 됩니다.`
- Anchors: `증거 없음`, `기준 없음`, `재시도 없음`
- Bridge: `AI에서는 Hook, Evaluation, State가 이 일을 나눠 맡습니다.`

### 6-9. Hook은 켜는 순간, Evaluation은 통과 기준입니다
- Function: 실제 용어 연결
- Headline: `Hook은 켜는 순간, Evaluation은 통과 기준입니다.`
- Anchors: `검문소`, `Hook`, `Evaluation`, `State / Loop`
- Bridge: `그래서 Act 6는 완료 전에 무엇을 확인하고 언제 재시도할지 정하는 시간입니다.`

### 6-10. Act 6는 완료 전 증거와 재시도 기준을 정하는 시간입니다
- Function: 실습 이유
- Headline: `Act 6는 완료 전 증거와 재시도 기준을 정하는 시간입니다.`
- Anchors: `완료 증거`, `통과 기준`, `재시도 조건`
- Bridge: `오늘 만든 장치들을 내 업무에 가져갈 차례입니다.`
