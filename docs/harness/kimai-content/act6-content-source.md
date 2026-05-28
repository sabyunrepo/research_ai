# Act 6 Content Source: 검증과 하네스 구조

Generated: 2026-05-29
Workspace: `/Users/byeonsanghun/goinfre/research_ai-kimai-content`
Purpose: Act 6 설명 슬라이드와 하네스 주입 소스의 기준 문서. 실습 UI는 별도 `act6-stop-hook-checkpoint` 계약에서 다룬다.

## 1. Act 결정

Practice ID:

```text
act6-stop-hook-checkpoint
```

이 Act에서 설명하는 것:

- 김아이의 완료 선언과 완료 증거의 차이
- 완료 전에는 무엇을 했는지, 무엇을 검증했는지, 무엇이 남았는지 확인해야 한다는 점
- Hook을 코드 이벤트가 아니라 완료 직전에 켜지는 검문소로 이해시키기
- Evaluation, LLM Judge, Quality Gate를 검문소의 통과 기준으로 연결하기
- State와 Loop 제어가 없으면 재시도가 끝나지 않을 수 있다는 점
- Stop hook 생성 프롬프트와 예제 구조가 unlock artifact로 열리는 이유
- Act 1~6 전체 하네스 구조 정리

이 Act에서 설명하지 않는 것:

- Hook을 코드 이벤트나 설정 파일 문법으로 바로 설명하기
- Evaluation을 단순 점수표로만 설명하기
- 실습 UI의 점수판, 검증 로그, 컴포넌트를 설명 슬라이드에 과하게 넣기
- 100점 달성만으로 마무리하기
- Agent/Subagent 역할 설계를 다시 자세히 설명하기

이전 Act에서 회수하는 것:

```text
Act 1: 필요한 자료를 골랐습니다.
Act 2: 좋은 업무 지시를 썼습니다.
Act 3: 회사 내규를 정했습니다.
Act 4: 반복 업무 매뉴얼을 만들었습니다.
Act 5: 역할과 도구 권한을 나눴습니다.
그래도 마지막에는 증거로 확인해야 합니다.
```

다음 Act로 넘기는 문제:

```text
Act 6은 마지막 Act다.
검문소 설계가 통과되면 Stop hook 생성 프롬프트와 예제 구조가 열리고,
오늘 만든 장치들이 하나의 하네스 업무 환경으로 묶인다.
```

## 2. 핵심 메시지

```text
완료는 말이 아니라, 검문소를 통과한 증거로 판단해야 합니다.
```

## 3. 시간과 리듬

권장 설명 시간: 12-14분

예상 설명 슬라이드 수: 13장

흐름:

```text
Act 1~5 회수 -> 완료 선언은 증거가 아님 -> 무엇을 했는지 확인 -> 무엇을 검증했는지 확인 -> 무엇이 남았는지 확인 -> 검문소 비유 -> Hook 용어 연결 -> Evaluation/Quality Gate -> State -> Loop 제어 -> 실습과 unlock artifact -> 전체 하네스 지도
```

## 4. Slide List

### 6-1. 필요한 장치를 다 세워도 마지막에는 증거가 필요합니다.

- Type: transition
- Headline: `필요한 장치를 다 세워도 마지막에는 증거가 필요합니다.`
- Anchors: `자료`, `지시`, `내규`, `매뉴얼`, `역할과 도구`
- Visual Intent: Act 1~5 장치가 체크된 지도 끝에 빈 증거칸이 남아 있는 손그림
- Speaker Flow: 지금까지 만든 장치를 빠르게 회수한다. 자료를 골랐고, 지시를 썼고, 내규와 매뉴얼을 정했고, 역할과 도구를 나눴지만 마지막에는 실제 증거가 필요하다고 말한다.
- Bridge: `"완료했습니다"라는 말은 증거가 아닙니다.`
- visualAssetId: `act6-act1-5-recap`

### 6-2. "완료했습니다"라는 말은 증거가 아닙니다.

- Type: problem
- Headline: `"완료했습니다"라는 말은 증거가 아닙니다.`
- Anchors: `말풍선`, `빈 증거칸`, `확인 전 상태`
- Visual Intent: 김아이가 완료했다고 말하지만 무엇을 했는지, 검증했는지, 남았는지 칸이 비어 있는 손그림
- Speaker Flow: 완료 선언은 출발점일 뿐이라고 설명한다. 사람이든 AI든 "했습니다"라는 말만으로는 제출 가능한지 알 수 없다.
- Bridge: `완료 전에는 무엇을 했는지 확인해야 합니다.`
- visualAssetId: `act6-complete-is-not-proof`

### 6-3. 완료 전에는 무엇을 했는지 확인해야 합니다.

- Type: evidence
- Headline: `완료 전에는 무엇을 했는지 확인해야 합니다.`
- Anchors: `수정한 것`, `만든 것`, `남긴 기록`
- Visual Intent: 완료물 옆에 작업 내역 증거 카드가 채워지는 손그림
- Speaker Flow: 먼저 산출 행위의 증거가 있어야 한다고 말한다. 어떤 파일을 만들었는지, 어떤 항목을 고쳤는지, 어떤 기록을 남겼는지 확인해야 한다.
- Bridge: `완료 전에는 무엇을 검증했는지 확인해야 합니다.`
- visualAssetId: `act6-done-work-evidence`

### 6-4. 완료 전에는 무엇을 검증했는지 확인해야 합니다.

- Type: evidence
- Headline: `완료 전에는 무엇을 검증했는지 확인해야 합니다.`
- Anchors: `기준 대조`, `테스트 결과`, `리뷰 결과`
- Visual Intent: 산출물이 기준표, 테스트 결과, 리뷰 결과와 대조되는 손그림
- Speaker Flow: 결과물을 만들었다는 사실과 기준을 통과했다는 사실은 다르다고 설명한다. 검증은 확인한 기준과 결과를 함께 남겨야 한다.
- Bridge: `완료 전에는 무엇이 남았는지 확인해야 합니다.`
- visualAssetId: `act6-validation-evidence`

### 6-5. 완료 전에는 무엇이 남았는지 확인해야 합니다.

- Type: evidence
- Headline: `완료 전에는 무엇이 남았는지 확인해야 합니다.`
- Anchors: `남은 위험`, `못 한 검증`, `다음 조치`
- Visual Intent: 남은 위험과 다음 조치가 작은 보류 카드로 정리되는 손그림
- Speaker Flow: 모든 일을 한 번에 끝내지 못할 수 있다. 중요한 것은 남은 위험을 숨기지 않고, 어떤 검증을 못 했고 다음에 무엇을 해야 하는지 남기는 것이라고 설명한다.
- Bridge: `검문소는 완료라고 말하기 전에 증거를 확인하는 자리입니다.`
- visualAssetId: `act6-remaining-risk`

### 6-6. 검문소는 완료라고 말하기 전에 증거를 확인하는 자리입니다.

- Type: analogy
- Headline: `검문소는 완료라고 말하기 전에 증거를 확인하는 자리입니다.`
- Anchors: `무엇을 했나`, `무엇을 검증했나`, `무엇이 남았나`
- Visual Intent: 완료물과 세 가지 증거 카드를 들고 통과 또는 재시도 문 앞에 선 김아이 손그림
- Speaker Flow: 검문소 비유로 정리한다. 검문소는 벌주는 곳이 아니라 완료 선언 전에 증거를 확인하는 자리라고 말한다.
- Bridge: `AI에서 완료 직전에 켜지는 장치가 Hook입니다.`
- visualAssetId: `act6-checkpoint-gate`

### 6-7. AI에서 완료 직전에 켜지는 장치가 Hook입니다.

- Type: term mapping
- Headline: `AI에서 완료 직전에 켜지는 장치가 Hook입니다.`
- Anchors: `완료 직전`, `자동 실행`, `Stop Hook`
- Visual Intent: 김아이가 멈추기 직전에 자동으로 켜지는 Stop Hook 검문소 장면
- Speaker Flow: Hook을 코드 이벤트로 설명하지 않는다. 특정 순간, 특히 작업을 멈추거나 완료하려는 순간에 자동으로 켜지는 검문소라고 설명한다.
- Bridge: `Evaluation은 검문소의 통과 기준입니다.`
- visualAssetId: `act6-stop-hook`

### 6-8. Evaluation은 검문소의 통과 기준입니다.

- Type: term mapping
- Headline: `Evaluation은 검문소의 통과 기준입니다.`
- Anchors: `기준표`, `LLM Judge`, `Quality Gate`
- Visual Intent: 검문소 안에 기준표가 있고, 사람 리뷰와 AI 판정관이 같은 기준을 보는 손그림
- Speaker Flow: Evaluation은 점수 자체가 목적이 아니라 무엇을 통과로 볼지 정하는 기준이라고 설명한다. 정성 품질은 LLM Judge가 보조 판정할 수 있고, 최종 통과 기준은 Quality Gate라고 연결한다.
- Bridge: `State는 지금 검문소가 처리 중인지 완료됐는지 기록합니다.`
- visualAssetId: `act6-evaluation-criteria`

### 6-9. State는 지금 검문소가 처리 중인지 완료됐는지 기록합니다.

- Type: system
- Headline: `State는 지금 검문소가 처리 중인지 완료됐는지 기록합니다.`
- Anchors: `processing`, `complete`, `attempts`
- Visual Intent: 검문소 옆 상태표에 processing, complete, attempts가 크게 표시된 손그림
- Speaker Flow: 검문소도 현재 상태를 알아야 한다고 설명한다. 처리 중인지, 통과했는지, 몇 번 시도했는지를 기록해야 다음 행동을 정할 수 있다.
- Bridge: `Loop 제어가 없으면 재시도가 끝나지 않을 수 있습니다.`
- visualAssetId: `act6-state-board`

### 6-10. Loop 제어가 없으면 재시도가 끝나지 않을 수 있습니다.

- Type: system
- Headline: `Loop 제어가 없으면 재시도가 끝나지 않을 수 있습니다.`
- Anchors: `재시도 조건`, `최대 시도`, `멈출 조건`
- Visual Intent: 재시도 화살표가 상태표의 최대 시도와 멈출 조건을 지나 통과 또는 보류로 나뉘는 손그림
- Speaker Flow: 실패하면 다시 시도하는 구조는 좋지만, 언제까지 다시 시도할지 없으면 끝나지 않을 수 있다고 설명한다. 재시도 조건과 멈출 조건이 있어야 검문소가 업무를 돕는다.
- Bridge: `실습에서는 완료 전 Stop hook 검문소를 설계합니다.`
- visualAssetId: `act6-loop-control`

### 6-11. 실습에서는 완료 전 Stop hook 검문소를 설계합니다.

- Type: practice handoff
- Headline: `실습에서는 완료 전 Stop hook 검문소를 설계합니다.`
- Anchors: `언제 켤지`, `무엇을 볼지`, `언제 멈출지`
- Visual Intent: 실습 UI가 아니라 Stop hook 설계 카드 세 묶음이 보이는 안내 장면
- Speaker Flow: 다음 화면은 설명 슬라이드가 아니라 별도 실습이라고 말한다. 수강생은 완료 직전에 켜지는 검문소의 trigger, evidence, state/loop 조건을 설계한다.
- Bridge: `검문소 설계가 통과되면 생성 프롬프트와 예제 구조가 열립니다.`
- nextPracticeId: `act6-stop-hook-checkpoint`

### 6-12. 검문소 설계가 통과되면 생성 프롬프트와 예제 구조가 열립니다.

- Type: unlock explanation
- Headline: `검문소 설계가 통과되면 생성 프롬프트와 예제 구조가 열립니다.`
- Anchors: `Stop hook 생성 프롬프트`, `settings 예제`, `status file 예제`, `stop check 예제`
- Visual Intent: 통과한 체크리스트가 잠금을 열고 생성 프롬프트와 예제 구조 카드가 드러나는 손그림
- Speaker Flow: Act 6은 100점으로 끝나는 실습이 아니라고 말한다. 설계가 통과되면 실제 Stop hook을 만들기 위한 생성 프롬프트와 예제 구조가 unlock artifact로 열린다.
- Bridge: `하네스는 김아이가 흔들려도 돌아오게 만드는 업무 환경입니다.`
- visualAssetId: `act6-unlock-structure`

### 6-13. 하네스는 김아이가 흔들려도 돌아오게 만드는 업무 환경입니다.

- Type: final system
- Headline: `하네스는 김아이가 흔들려도 돌아오게 만드는 업무 환경입니다.`
- Anchors: `정보 선별`, `업무 지시`, `회사 내규`, `업무 매뉴얼`, `역할과 도구`, `완료 검문소`
- Visual Intent: Act 1~6 장치가 하나의 김아이 업무 환경으로 연결된 최종 지도
- Speaker Flow: 오늘의 전체 메시지를 닫는다. 좋은 프롬프트 하나가 아니라, 김아이가 흔들려도 다시 돌아올 수 있는 자료, 지시, 내규, 매뉴얼, 역할, 도구, 검문소를 만든 것이라고 정리한다.
- Bridge: `이제 내 업무에 가져갈 장치부터 고르면 됩니다.`
- visualAssetId: `act6-final-harness-map`

## 5. Asset Requirements

### act6-act1-5-recap

- teachingRole: Act 1~5 장치를 회수하고 마지막 증거 확인의 필요성을 연다.
- semanticRequirements: 정보, 지시, 내규, 매뉴얼, 역할/도구가 체크되어 있고 마지막 증거칸이 비어 있어야 한다.
- generationPrompt: `Hand-drawn minimal Korean lecture illustration. A workflow map checks Act 1 정보, Act 2 지시, Act 3 내규, Act 4 매뉴얼, Act 5 역할/도구, then shows an empty final evidence box. White background, one blue accent.`
- forbiddenElements: 복잡한 기술 다이어그램, 추상 아이콘만 나열, 작은 글씨

### act6-complete-is-not-proof

- teachingRole: 완료 선언과 완료 증거가 다르다는 점을 설명한다.
- semanticRequirements: 완료했습니다 말풍선과 빈 증거칸이 함께 보여야 한다.
- generationPrompt: `Hand-drawn minimal Korean lecture illustration. Kimai says 완료했습니다, but evidence boxes labeled 무엇을 했나, 무엇을 검증했나, 무엇이 남았나 are empty. White background, one blue accent.`
- forbiddenElements: 처벌 장면, 복잡한 로그, 코드 화면

### act6-done-work-evidence

- teachingRole: 완료 전에는 실제로 무엇을 했는지 확인해야 함을 설명한다.
- semanticRequirements: 수정한 것, 만든 것, 남긴 기록이 증거 카드로 보여야 한다.
- generationPrompt: `Hand-drawn minimal Korean lecture illustration. Evidence cards beside a finished task: 수정한 것, 만든 것, 남긴 기록. Kimai points to the cards. White background, one blue accent.`
- forbiddenElements: 긴 로그, 코드 중심, 작은 글씨

### act6-validation-evidence

- teachingRole: 완료 전에는 무엇을 검증했는지 확인해야 함을 설명한다.
- semanticRequirements: 기준 대조, 테스트 결과, 리뷰 결과가 함께 보여야 한다.
- generationPrompt: `Hand-drawn minimal Korean lecture illustration. A task output is checked against 기준 대조, 테스트 결과, 리뷰 결과 cards. White background, black linework, one blue accent.`
- forbiddenElements: 점수판만 크게 표시, 복잡한 UI, 작은 글씨

### act6-remaining-risk

- teachingRole: 완료 전에는 남은 위험과 다음 조치를 밝혀야 함을 설명한다.
- semanticRequirements: 남은 위험, 못 한 검증, 다음 조치가 보류 카드로 정리되어야 한다.
- generationPrompt: `Hand-drawn minimal Korean lecture illustration. Three pending cards: 남은 위험, 못 한 검증, 다음 조치 are placed beside a nearly finished task. White background, one blue accent.`
- forbiddenElements: 실패를 처벌하는 장면, 장식용 배경, 작은 글씨

### act6-checkpoint-gate

- teachingRole: 검문소 비유로 완료 전 증거 확인을 설명한다.
- semanticRequirements: 검문소가 완료물과 세 증거 카드를 확인하고 통과/재시도 문으로 나누어야 한다.
- generationPrompt: `Hand-drawn minimal Korean lecture illustration. Kimai brings output and three evidence cards to a checkpoint gate. The gate branches to 통과 and 재시도. White background, one blue accent.`
- forbiddenElements: 위협적인 장면, 코드 화면, 복잡한 로그

### act6-stop-hook

- teachingRole: Hook을 완료 직전에 자동으로 켜지는 Stop Hook 검문소로 설명한다.
- semanticRequirements: 완료 직전, 자동 실행, Stop Hook 라벨이 보여야 한다.
- generationPrompt: `Hand-drawn minimal Korean lecture illustration. Just before Kimai exits with 완료, a Stop Hook checkpoint automatically opens and asks for evidence. White background, black linework, one blue accent.`
- forbiddenElements: JSON 중심, 코드 이벤트 설명, 작은 글씨

### act6-evaluation-criteria

- teachingRole: Evaluation, LLM Judge, Quality Gate를 검문소의 통과 기준으로 연결한다.
- semanticRequirements: 기준표, AI 판정관, Quality Gate가 한 검문소 안에서 연결되어야 한다.
- generationPrompt: `Hand-drawn minimal Korean lecture illustration. Inside a checkpoint, a 기준표, an AI 판정관 labeled LLM Judge, and a Quality Gate decide 통과 기준. White background, one blue accent.`
- forbiddenElements: 점수만 강조, 복잡한 수식, 코드 화면

### act6-state-board

- teachingRole: State가 검문소의 처리 상태와 시도 횟수를 기록한다는 점을 설명한다.
- semanticRequirements: processing, complete, attempts가 큰 상태표로 보여야 한다.
- generationPrompt: `Hand-drawn minimal Korean lecture illustration. A status board beside a checkpoint shows processing, complete, attempts. Kimai checks current state before retrying. White background, one blue accent.`
- forbiddenElements: 무한 복잡한 루프, 코드 중심, 작은 글씨

### act6-loop-control

- teachingRole: Loop 제어가 없으면 재시도가 끝나지 않을 수 있음을 설명한다.
- semanticRequirements: 재시도 조건, 최대 시도, 멈출 조건이 재시도 루프를 제어하는 모습이어야 한다.
- generationPrompt: `Hand-drawn minimal Korean lecture illustration. A retry loop passes through cards 재시도 조건, 최대 시도, 멈출 조건 before 통과 or 보류. White background, one blue accent.`
- forbiddenElements: 혼란스러운 화살표 과잉, 코드 화면, 작은 글씨

### act6-unlock-structure

- teachingRole: 설계 통과 후 Stop hook 생성 프롬프트와 예제 구조가 unlock artifact로 열린다는 점을 설명한다.
- semanticRequirements: Stop hook 생성 프롬프트, settings 예제, status file 예제, stop check 예제가 잠금 해제되어야 한다.
- generationPrompt: `Hand-drawn minimal Korean lecture illustration. A passed checkpoint checklist unlocks four cards: Stop hook 생성 프롬프트, settings 예제, status file 예제, stop check 예제. White background, one blue accent.`
- forbiddenElements: 긴 코드, 복잡한 JSON, 점수판만 표시

### act6-final-harness-map

- teachingRole: Act 1~6의 정보, 지시, 내규, 매뉴얼, 역할/도구, 검문소가 하나의 하네스 업무 환경으로 연결됨을 정리한다.
- semanticRequirements: 여섯 장치가 하나의 업무 환경 안에서 연결되어야 한다. 김아이가 흔들려도 다시 돌아오는 구조가 보여야 한다.
- generationPrompt: `Hand-drawn minimal Korean lecture illustration. A final Kimai workflow map connects six stations: 정보 선별, 업무 지시, 회사 내규, 업무 매뉴얼, 역할/도구, 완료 검문소. White background, black linework, one blue accent.`
- forbiddenElements: 추상 아이콘만 나열, 복잡한 기술 다이어그램, 그라데이션

## 6. Verification Checklist

- Act 0~5와 용어가 이어지는가?
- 비유 → 원리 → 문제 → 실제 용어 → 실습 이유 순서가 보이는가?
- 실습 UI가 설명 슬라이드에 섞이지 않았는가?
- 한 슬라이드에 두 개 이상의 핵심 메시지가 섞이지 않았는가?
- Hook, Evaluation, State, Loop가 한 장에 몰리지 않고 필요한 만큼 분리되었는가?
- 100점 달성이 아니라 unlock artifact, Stop hook 생성 프롬프트, 예제 구조로 연결되는가?
- visualAssetId가 asset-pack에 존재하는가?
- JSON parse가 통과하는가?
