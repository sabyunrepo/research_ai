# Act 6 Content Source: 완료 검문소(Hook)

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
- 품질검문소가 작업 기록, 기준 대조, 남은 위험을 확인해야 한다는 점
- Hook을 코드 이벤트가 아니라 완료 직전에 켜지는 검문소로 이해시키기
- Evaluation, LLM Judge, Quality Gate를 검문소의 통과 기준으로 연결하기
- State(상태 기록)와 Loop Control(반복 제어)이 없으면 재검토가 끝없이 반복될 수 있다는 점
- Stop hook 생성 프롬프트와 예제 구조가 unlock artifact로 열리는 이유
- Act 1~6 전체 하네스 구조 정리

이 Act에서 설명하지 않는 것:

- Hook을 코드 이벤트나 설정 파일 문법으로 바로 설명하기
- Evaluation을 단순 점수표로만 설명하기
- 실습 UI의 점수판, 검증 로그, 컴포넌트를 설명 슬라이드에 과하게 넣기
- 100점 달성만으로 마무리하기
- Agent 역할 설계를 다시 자세히 설명하기

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
Act 1~5 회수 -> 완료 검문소(Hook) 시작 -> 제출 전 필수검증 -> 완료 선언은 증거가 아님 -> 품질검문소는 증거를 봄 -> 작업 기록 -> 목표와 기준 대조 -> 남은 위험 보고 -> Stop Hook 구조 정리 -> Evaluation/Quality Gate -> State -> Loop Control -> 실습과 unlock artifact -> 전체 하네스 지도
```

## 4. Slide List

### 6-1. 완료 검문소(Hook)는 제출 직전 자동 확인입니다.

- Type: transition
- Headline: `완료 검문소(Hook)는 제출 직전 자동 확인입니다.`
- Anchors: `제출 직전`, `자동 확인`, `통과 또는 보류`
- Harness concept: `Quality Gate(품질검문소)` - 완료로 인정하기 전에 통과해야 하는 필수 검증 단계
- Visual Intent: 김아이 팀의 결과물이 팀장에게 가기 전 제출 전 확인대에 놓인 손그림
- Speaker Flow: Act 0 목차에서 본 완료 검문소(Hook)를 다시 회수한다. 김아이, 최아이, 박아이 팀이 결과물을 만들었어도 팀장에게 바로 제출하지 않고, 제출 직전에 자동 확인으로 빠진 항목과 기준 충족 여부를 본다고 말한다.
- Bridge: `검증이 없으면 “끝냈습니다”라는 말만 남습니다.`
- visualAssetId: `act6-required-pre-submit-check`

### 6-2. 검증이 없으면 “끝냈습니다”라는 말만 남습니다.

- Type: problem
- Headline: `검증이 없으면 “끝냈습니다”라는 말만 남습니다.`
- Anchors: `완료 보고`, `확인 없음`, `빈 증거`
- Harness concept: `Completion Claim Check(완료 선언 확인)` - 완료했다는 말을 그대로 믿지 않고 증거를 요구하는 검증 관점
- Visual Intent: 김아이가 끝났다고 보고하지만 확인자와 증거칸이 비어 있는 손그림
- Speaker Flow: 완료 보고는 품질 증거가 아니라고 설명한다. 검증 과정이 없으면 김아이가 실제로 무엇을 했는지 확인할 방법이 없고 말만 남는다.
- Bridge: `품질검문소는 완료 보고 대신 증거를 봅니다.`
- visualAssetId: `act6-completion-claim-no-evidence`

### 6-3. 품질검문소는 완료 보고 대신 증거를 봅니다.

- Type: analogy
- Headline: `품질검문소는 완료 보고 대신 증거를 봅니다.`
- Anchors: `작업 기록`, `기준 대조`, `남은 위험`
- Harness concept: `Quality Gate(품질검문소)` - 작업 기록, 평가 기준, 남은 위험을 보고 통과 여부를 정하는 문
- Visual Intent: 검문소가 완료 보고 말풍선이 아니라 작업 기록, 기준 대조, 남은 위험 카드를 보는 장면
- Speaker Flow: 여기서 품질검문소를 세운다. 검문소는 말이 아니라 세 가지 증거를 본다: 작업 기록, 기준 대조, 남은 위험이다.
- Bridge: `검증하려면 김아이가 작업 기록을 남겨야 합니다.`
- visualAssetId: `act6-quality-gate-evidence-over-claim`

### 6-4. 검증하려면 김아이가 작업 기록을 남겨야 합니다.

- Type: evidence
- Headline: `검증하려면 김아이가 작업 기록을 남겨야 합니다.`
- Anchors: `무엇을 했는지`, `어떤 순서로 했는지`, `어떤 증거가 남았는지`
- Harness concept: `Evidence(증거)`, `Work Log(작업 기록)` - Stop Hook이나 Quality Gate가 확인할 검증 재료
- Visual Intent: 김아이가 작업 순서와 결과를 기록 카드로 남기는 장면
- Speaker Flow: 검증은 말만으로 할 수 없다. 김아이가 작업 기록을 남겨야 검문소가 실제 작업 여부를 확인할 수 있다. 기록 요구는 김아이가 체크리스트처럼 더 명확하게 일하게 만든다.
- Bridge: `검증은 처음 목표와 제출 기준에 맞는지 대조합니다.`
- visualAssetId: `act6-work-log-evidence`

### 6-5. 검증은 처음 목표와 제출 기준에 맞는지 대조합니다.

- Type: criteria
- Headline: `검증은 처음 목표와 제출 기준에 맞는지 대조합니다.`
- Anchors: `처음 목표`, `제출 기준`, `빠진 항목`
- Harness concept: `Evaluation Criteria(평가 기준)`, `Rubric(기준표)` - Quality Gate가 통과/보류를 판단할 기준
- Visual Intent: 결과물이 처음 목표 카드와 제출 기준표에 대조되는 손그림
- Speaker Flow: 만들었다는 사실과 목표에 맞는다는 사실은 다르다. 처음 맡긴 목표와 제출 기준에 맞는지 다시 대조하고, 빠진 항목이 있으면 보완 항목으로 본다.
- Bridge: `남은 위험을 숨기지 않아야 다음 조치를 정할 수 있습니다.`
- visualAssetId: `act6-goal-rubric-check`

### 6-6. 남은 위험을 숨기지 않아야 다음 조치를 정할 수 있습니다.

- Type: handoff
- Headline: `남은 위험을 숨기지 않아야 다음 조치를 정할 수 있습니다.`
- Anchors: `못 한 확인`, `남은 위험`, `다음 조치`
- Harness concept: `Risk Report(위험 보고)`, `Handoff Note(인수인계 기록)` - 아직 남은 위험과 다음 사람이 이어서 볼 내용을 남기는 기록
- Visual Intent: 남은 위험과 다음 조치가 인수인계 카드로 정리되는 손그림
- Speaker Flow: 통과가 아니면 무엇이 남았는지 숨기지 않는다. 못 한 확인, 남은 위험, 다음 조치를 남겨야 다음 사람이 이어받을 수 있다.
- Bridge: `완료 직전에 품질검문소를 켜는 장치가 Stop Hook입니다.`
- visualAssetId: `act6-risk-handoff-note`

### 6-7. Stop Hook은 완료 검문소를 켜는 구체적인 장치입니다.

- Type: consolidation
- Headline: `Stop Hook은 완료 검문소를 켜는 구체적인 장치입니다.`
- Anchors: `완료 직전`, `자동 실행`, `Stop Hook`
- Harness concept: `Hook(자동 실행 장치)`, `Stop Hook(완료 직전 검문소)` - AI가 멈추거나 완료하려는 순간 켜지는 검문소
- Visual Intent: 김아이 팀이 완료하려는 순간 Stop Hook 검문소가 자동으로 켜지는 장면
- Speaker Flow: Act 0과 Act 6 첫 장에서 이미 본 완료 검문소(Hook)를 다시 회수한다. Hook은 코드 문법보다 먼저 자동으로 켜지는 검문소로 이해하고, Stop Hook은 김아이가 멈추거나 완료하려는 순간 품질검문소를 켜는 구체적인 장치라고 정리한다.
- Bridge: `통과와 보류를 가르는 기준이 Evaluation입니다.`
- visualAssetId: `act6-stop-hook-quality-gate`

### 6-8. 통과와 보류를 가르는 기준이 Evaluation입니다.

- Type: term mapping
- Headline: `통과와 보류를 가르는 기준이 Evaluation입니다.`
- Anchors: `기준표`, `AI 판정관`, `통과 기준`
- Harness concept: `Evaluation(평가/검증)`, `LLM Judge(AI 판정관)`, `Quality Gate Criteria(품질검문소 통과 기준)`
- Visual Intent: 기준표와 AI 판정관이 통과/보류를 판정하는 손그림
- Speaker Flow: Evaluation은 단순 점수표가 아니다. 무엇을 통과로 볼지 정하는 기준과 판정 과정이며, LLM Judge는 정성적인 품질을 기준표에 맞춰 보는 보조 검토자 역할을 할 수 있다.
- Bridge: `검문소에는 지금 상태를 적는 상태표가 필요합니다.`
- visualAssetId: `act6-evaluation-pass-hold`

### 6-9. 검문소에는 지금 상태를 적는 상태표가 필요합니다.

- Type: system
- Headline: `검문소에는 지금 상태를 적는 상태표가 필요합니다.`
- Anchors: `처리 중`, `완료`, `시도 횟수`
- Harness concept: `State(상태 기록)`, `Status File(상태 파일)` - 지금 처리 중인지, 완료됐는지, 몇 번 시도했는지 남기는 기록
- Visual Intent: 품질검문소 옆 상태표에 처리 중, 완료, 시도 횟수가 기록되는 장면
- Speaker Flow: 검문소도 지금 일이 처리 중인지, 완료됐는지, 몇 번 시도했는지 알아야 한다. 상태표가 없으면 실패했는데 완료로 넘어가거나 같은 검사를 반복할 수 있다.
- Bridge: `재검토 규칙이 없으면 일이 끝없이 되돌아갑니다.`
- visualAssetId: `act6-state-status-file`

### 6-10. 재검토 규칙이 없으면 일이 끝없이 되돌아갑니다.

- Type: system
- Headline: `재검토 규칙이 없으면 일이 끝없이 되돌아갑니다.`
- Anchors: `다시 볼 조건`, `최대 시도`, `멈출 조건`
- Harness concept: `Loop Control(반복 제어)`, `Retry Limit(재시도 제한)` - 실패했을 때 다시 볼지, 몇 번까지 볼지, 언제 멈출지 정하는 규칙
- Visual Intent: 재검토 화살표가 최대 시도와 멈출 조건을 지나 통과 또는 보류로 나뉘는 손그림
- Speaker Flow: 실패하면 다시 보게 하는 구조는 좋지만, 언제까지 다시 볼지 없으면 끝나지 않는다. 재시도와 종료 기준이 같이 있어야 한다.
- Bridge: `실습에서는 제출 전 Stop Hook 검문소를 설계합니다.`
- visualAssetId: `act6-loop-control-recheck`

### 6-11. 실습에서는 제출 전 Stop Hook 검문소를 설계합니다.

- Type: practice handoff
- Headline: `실습에서는 제출 전 Stop Hook 검문소를 설계합니다.`
- Anchors: `언제 켤지`, `어떤 증거를 볼지`, `언제 멈출지`
- Harness concept: `Stop Hook Design(완료 직전 검문소 설계)`, `Trigger / Evidence / State / Loop(켜지는 조건 / 볼 증거 / 상태 기록 / 반복 제어)`
- Visual Intent: 실습 UI가 아니라 Stop Hook 검문소 설계 카드 세 묶음이 보이는 안내 장면
- Speaker Flow: 실습은 점수판을 보는 것이 아니라 완료 직전 검문소를 설계하는 일이다. 언제 켜고, 무엇을 보고, 언제 멈출지 정한다.
- Bridge: `검문소 설계가 통과되면 생성 프롬프트와 예제 구조가 열립니다.`
- nextPracticeId: `act6-stop-hook-checkpoint`

### 6-12. 검문소 설계가 통과되면 생성 프롬프트와 예제 구조가 열립니다.

- Type: unlock explanation
- Headline: `검문소 설계가 통과되면 생성 프롬프트와 예제 구조가 열립니다.`
- Anchors: `Stop Hook 생성 프롬프트`, `settings 예제`, `status file 예제`, `stop check 예제`
- Harness concept: `Unlock Artifact(통과 후 열리는 산출물)`, `Hook Scaffold(훅 예제 구조)` - 실제 Hook을 만들기 위한 설정, 상태 파일, 검사 스크립트 예제
- Visual Intent: 통과한 체크리스트가 잠금을 열고 생성 프롬프트와 예제 구조 카드가 드러나는 손그림
- Speaker Flow: Act 6은 100점 달성으로 끝나지 않는다. 설계가 통과되면 실제 Stop Hook을 만들기 위한 프롬프트와 예제 구조가 열린다.
- Bridge: `하네스는 김아이 팀이 흔들려도 돌아오게 만드는 업무 환경입니다.`
- visualAssetId: `act6-unlock-structure`

### 6-13. 하네스는 김아이 팀이 흔들려도 돌아오게 만드는 업무 환경입니다.

- Type: final system
- Headline: `하네스는 김아이 팀이 흔들려도 돌아오게 만드는 업무 환경입니다.`
- Anchors: `책상 정리`, `업무 지시`, `회사 내규`, `업무 매뉴얼`, `역할 카드(Agent)`, `완료 검문소`
- Harness concept: `End-to-End Harness(전체 업무 하네스)` - Prompt, Context, CLAUDE.md, Skill, Agent, Tool Permission, Hook을 연결한 업무 환경
- Visual Intent: Act 1~6 장치가 하나의 김아이 팀 업무 환경으로 연결된 최종 지도
- Speaker Flow: 오늘 배운 장치를 하나로 묶는다. 하네스는 좋은 프롬프트 하나가 아니라 김아이 팀이 흔들려도 다시 기준으로 돌아오게 만드는 업무 환경이다.
- Bridge: `이제 내 업무에 가져갈 장치부터 고르면 됩니다.`
- visualAssetId: `act6-final-harness-map`

## 5. Asset Requirements

### act6-required-pre-submit-check

- teachingRole: 팀장에게 결과물을 제출하기 전 필수검증을 거치는 장면을 설명한다.
- semanticRequirements: 제출 전 확인, 빠진 항목 확인, 통과 또는 보류가 보여야 한다.
- generationPrompt: `Hand-drawn minimal Korean lecture illustration. Before submitting to the manager, Kimai team output goes through a pre-submit check desk labeled 제출 전 확인, 빠진 항목 확인, 통과 또는 보류. White background, one blue accent.`
- forbiddenElements: 점수판 중심, 코드 화면, 복잡한 UI, 작은 글씨

### act6-completion-claim-no-evidence

- teachingRole: 검증이 없으면 끝냈다는 완료 보고만 남는 문제를 설명한다.
- semanticRequirements: 완료 보고, 확인 없음, 빈 증거가 함께 보여야 한다.
- generationPrompt: `Hand-drawn minimal Korean lecture illustration. Kimai says 끝냈습니다, but there is no checker and evidence boxes are empty. White background, one blue accent.`
- forbiddenElements: 처벌 장면, 복잡한 로그, 코드 화면

### act6-quality-gate-evidence-over-claim

- teachingRole: 품질검문소가 완료 보고 대신 작업 기록, 기준 대조, 남은 위험을 본다는 점을 설명한다.
- semanticRequirements: 품질검문소가 작업 기록, 기준 대조, 남은 위험 카드를 확인해야 한다.
- generationPrompt: `Hand-drawn minimal Korean lecture illustration. A Quality Gate ignores a speech bubble and checks three cards: 작업 기록, 기준 대조, 남은 위험. White background, one blue accent.`
- forbiddenElements: 완료 보고만 강조, 점수판만 표시, 작은 글씨

### act6-work-log-evidence

- teachingRole: 검증을 위해 김아이가 작업 기록을 남겨야 함을 설명한다.
- semanticRequirements: 무엇을 했는지, 어떤 순서로 했는지, 어떤 증거가 남았는지가 보여야 한다.
- generationPrompt: `Hand-drawn minimal Korean lecture illustration. Kimai leaves work log cards: 무엇을 했는지, 어떤 순서로 했는지, 어떤 증거가 남았는지. White background, one blue accent.`
- forbiddenElements: 긴 로그, 코드 중심, 작은 글씨

### act6-goal-rubric-check

- teachingRole: 처음 목표와 제출 기준에 맞는지 대조하는 Evaluation Criteria를 설명한다.
- semanticRequirements: 처음 목표, 제출 기준, 빠진 항목이 기준표와 함께 보여야 한다.
- generationPrompt: `Hand-drawn minimal Korean lecture illustration. Output is compared with 처음 목표 and 제출 기준 checklist, missing items marked. White background, one blue accent.`
- forbiddenElements: 점수만 강조, 복잡한 수식, 코드 화면

### act6-risk-handoff-note

- teachingRole: 남은 위험과 다음 조치를 인수인계 기록으로 남겨야 함을 설명한다.
- semanticRequirements: 못 한 확인, 남은 위험, 다음 조치가 인수인계 기록으로 정리되어야 한다.
- generationPrompt: `Hand-drawn minimal Korean lecture illustration. Pending cards 못 한 확인, 남은 위험, 다음 조치 are written as a handoff note. White background, one blue accent.`
- forbiddenElements: 실패를 처벌하는 장면, 장식용 배경, 작은 글씨

### act6-stop-hook-quality-gate

- teachingRole: 완료 직전에 품질검문소를 켜는 Stop Hook을 설명한다.
- semanticRequirements: 완료 직전, 자동 실행, Stop Hook, 품질검문소가 함께 보여야 한다.
- generationPrompt: `Hand-drawn minimal Korean lecture illustration. Just before completion, a Stop Hook automatically opens the Quality Gate for Kimai team. White background, one blue accent.`
- forbiddenElements: JSON 중심, 코드 이벤트 설명, 작은 글씨

### act6-evaluation-pass-hold

- teachingRole: Evaluation이 통과와 보류를 가르는 기준임을 설명한다.
- semanticRequirements: 기준표, AI 판정관, 통과 기준, 통과 또는 보류가 보여야 한다.
- generationPrompt: `Hand-drawn minimal Korean lecture illustration. A rubric and AI judge decide 통과 or 보류 at a gate. White background, one blue accent.`
- forbiddenElements: 점수만 강조, 복잡한 수식, 코드 화면

### act6-state-status-file

- teachingRole: 검문소에 처리 상태를 적는 상태표가 필요함을 설명한다.
- semanticRequirements: 처리 중, 완료, 시도 횟수가 상태표에 기록되어야 한다.
- generationPrompt: `Hand-drawn minimal Korean lecture illustration. A status board beside the checkpoint shows 처리 중, 완료, 시도 횟수. White background, one blue accent.`
- forbiddenElements: 영어 상태값만 표시, 무한 복잡한 루프, 코드 중심

### act6-loop-control-recheck

- teachingRole: 재검토 규칙과 재시도 제한으로 무한 반복을 막는 구조를 설명한다.
- semanticRequirements: 다시 볼 조건, 최대 시도, 멈출 조건이 재검토 흐름을 제어해야 한다.
- generationPrompt: `Hand-drawn minimal Korean lecture illustration. Recheck loop goes through 다시 볼 조건, 최대 시도, 멈출 조건 before 통과 or 보류. White background, one blue accent.`
- forbiddenElements: 혼란스러운 화살표 과잉, 코드 화면, 작은 글씨

### act6-unlock-structure

- teachingRole: 검문소 설계 통과 후 Stop Hook 생성 프롬프트와 예제 구조가 열림을 설명한다.
- semanticRequirements: Stop Hook 생성 프롬프트, settings 예제, status file 예제, stop check 예제가 잠금 해제되어야 한다.
- generationPrompt: `Hand-drawn minimal Korean lecture illustration. Passed checkpoint design unlocks Stop Hook 생성 프롬프트, settings 예제, status file 예제, stop check 예제. White background, one blue accent.`
- forbiddenElements: 긴 코드, 복잡한 JSON, 점수판만 표시

### act6-final-harness-map

- teachingRole: Act 1~6 장치가 김아이 팀 업무 환경으로 연결됨을 정리한다.
- semanticRequirements: 책상 정리, 업무 지시, 회사 내규, 업무 매뉴얼, 역할 카드(Agent), 완료 검문소가 하나의 지도에 연결되어야 한다.
- generationPrompt: `Hand-drawn minimal Korean lecture illustration. Final Kimai team harness map connects 책상 정리, 업무 지시, 회사 내규, 업무 매뉴얼, 역할 카드(Agent), 완료 검문소. White background, one blue accent.`
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
