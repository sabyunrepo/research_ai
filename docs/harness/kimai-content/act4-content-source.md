# Act 4 Content Source: 반복 업무 매뉴얼

Generated: 2026-05-29
Workspace: `/Users/byeonsanghun/goinfre/research_ai-kimai-content`
Purpose: Act 4 설명 슬라이드와 하네스 주입 소스의 기준 문서. 실습 UI는 별도 `act4-skill-authoring` 계약에서 다룬다.

## 1. Act 결정

Practice ID:

```text
act4-skill-authoring
```

이 Act에서 설명하는 것:

- 반복 업무를 매번 말로 다시 설명하지 않기 위해 업무 매뉴얼로 남기는 이유
- `CLAUDE.md = 항상 지켜야 하는 기준`, `Skill = 특정 반복 업무를 처리하는 순서`라는 구분
- Skill의 시작 조건, 질문 순서, 확인 순서, 남길 결과
- 좋은 Skill이 바로 실행하지 않고 먼저 필요한 질문을 하게 만드는 이유
- 별도 미니 브레인스토밍 Skill 작성 실습으로 넘어가는 브릿지

이 Act에서 설명하지 않는 것:

- Skill을 좋은 프롬프트 예시나 답변 템플릿으로 외우게 만들기
- CLAUDE.md 적용 범위와 적용 강도를 다시 자세히 설명하기
- 실습 UI, 점수판, 입력 폼, 검증 로그를 설명 슬라이드 안에 넣기
- Agent 역할 분리와 Tool Permission을 자세히 설명하기
- Hook, Evaluation, Quality Gate를 자세히 설명하기

이전 Act에서 회수하는 것:

```text
Act 3에서 정리한 회사 내규는 항상 지켜야 하는 기준입니다.
하지만 기준만 있어서는 반복 업무를 어떤 순서로 처리할지까지 정해지지 않습니다.
Act 4는 내규와 매뉴얼을 분리해, 반복 실행 순서를 별도로 만드는 구간입니다.
```

다음 Act로 넘기는 문제:

```text
매뉴얼이 있어도 한 명이 조사, 구현, 검토를 모두 맡으면 판단이 섞입니다.
다음 Act에서는 역할 카드와 도구 열쇠를 나눕니다.
```

## 2. 핵심 메시지

```text
Skill은 답변 템플릿이 아니라, 김아이가 반복 업무를 같은 순서로 처리하게 만드는 업무 매뉴얼입니다.
```

## 3. 시간과 리듬

권장 설명 시간: 10-12분

예상 설명 슬라이드 수: 9장

흐름:

```text
Act 3 내규 회수 -> 업무 매뉴얼(Skill) 시작 -> 기준과 절차 구분 -> 반복 설명 문제 -> 매뉴얼 시작 조건 -> 매뉴얼 질문/확인 순서 -> 매뉴얼 결과물 -> Skill 구조 정리 -> 질문 먼저 하는 좋은 Skill -> 실습 이유 -> Act 5 브릿지
```

## 4. Slide List

### 4-1. 업무 매뉴얼(Skill)은 반복 업무의 실행 순서입니다.

- Type: transition
- Headline: `업무 매뉴얼(Skill)은 반복 업무의 실행 순서입니다.`
- Anchors: `반복 업무`, `실행 순서`, `업무 매뉴얼(Skill)`
- Visual Intent: 김아이가 같은 종류의 업무 요청을 여러 번 받는 장면을 손그림으로 보여 준다.
- Speaker Flow: Act 0 목차에서 본 업무 매뉴얼(Skill)을 다시 회수한다. 반복 작업은 자연스럽게 반복 지시를 만들고, 그 실행 순서를 매번 다시 말하지 않기 위해 업무 매뉴얼(Skill)로 고정한다고 말한다.
- Bridge: `반복 지시를 매번 다시 말하면 일이 사람에게 묶입니다.`
- visualAssetId: `act4-repeated-work-instructions`

### 4-2. 반복 지시를 매번 다시 말하면 일이 사람에게 묶입니다.

- Type: problem
- Headline: `반복 지시를 매번 다시 말하면 일이 사람에게 묶입니다.`
- Anchors: `팀장이 매번 설명`, `사람마다 다른 표현`, `이전 순서 재사용 어려움`
- Visual Intent: 팀장이 매번 같은 일을 다시 설명하고, 김아이가 이전 설명을 재사용하지 못하는 장면.
- Speaker Flow: 반복 지시가 사람의 기억과 말솜씨에 묶이면 매번 설명해야 한다고 말한다. 설명하는 사람마다 표현이 달라지고, 김아이는 안정적인 작업 순서를 다시 쓰기 어렵다.
- Bridge: `매번 다른 지시는 김아이의 시작점을 흔듭니다.`
- visualAssetId: `act4-human-bound-instructions`

### 4-3. 매번 다른 지시는 김아이의 시작점을 흔듭니다.

- Type: problem
- Headline: `매번 다른 지시는 김아이의 시작점을 흔듭니다.`
- Anchors: `어떤 날은 먼저 질문`, `어떤 날은 바로 작성`, `어떤 날은 확인 없이 종료`
- Visual Intent: 같은 업무를 받은 김아이가 날마다 다른 시작점으로 움직이는 세 컷 손그림.
- Speaker Flow: 같은 반복 업무라도 지시가 매번 다르면 김아이의 시작점이 흔들린다고 설명한다. 어느 날은 질문하고, 어느 날은 바로 작성하고, 어느 날은 확인 없이 끝낸다.
- Bridge: `작업별 업무 매뉴얼을 만들어 사용해 봅시다.`
- visualAssetId: `act4-different-instruction-starts`

### 4-4. 작업별 업무 매뉴얼을 만들어 사용해 봅시다.

- Type: concept
- Headline: `작업별 업무 매뉴얼을 만들어 사용해 봅시다.`
- Anchors: `김아이 머릿속에 맡기지 않음`, `팀장 기억에 맡기지 않음`, `문서로 같은 순서 유지`
- Visual Intent: 작업별 매뉴얼이 책상 밖에 문서로 놓이고 김아이가 그 순서를 따라가는 장면.
- Speaker Flow: 업무 매뉴얼은 작업 순서를 김아이의 즉흥 판단이나 팀장 기억에 맡기지 않고 밖에 문서로 고정하는 장치라고 설명한다.
- Bridge: `먼저 이 일을 매뉴얼로 만들 가치가 있는지 따집니다.`
- visualAssetId: `act4-task-manual-outside`

### 4-5. 먼저 이 일을 매뉴얼로 만들 가치가 있는지 따집니다.

- Type: decision
- Headline: `먼저 이 일을 매뉴얼로 만들 가치가 있는지 따집니다.`
- Anchors: `자주 반복되는 일`, `같은 기준이 필요한 일`, `실수 비용이 큰 일`
- Visual Intent: 업무 후보 카드들이 매뉴얼 후보 판정표 앞에서 걸러지는 손그림.
- Speaker Flow: 모든 일을 매뉴얼로 만들면 관리 비용이 커진다. 자주 반복되고, 같은 기준으로 판단해야 하고, 실수했을 때 다시 고치는 비용이 큰 일이 매뉴얼 후보라고 설명한다.
- Bridge: `매뉴얼 후보가 아니면 지금 업무 지시로 충분합니다.`
- visualAssetId: `act4-manual-candidate-check`

### 4-6. 매뉴얼 후보가 아니면 지금 업무 지시로 충분합니다.

- Type: boundary
- Headline: `매뉴얼 후보가 아니면 지금 업무 지시로 충분합니다.`
- Anchors: `한 번만 할 일`, `기준이 아직 흔들리는 일`, `상황이 매번 다른 일`
- Visual Intent: 매뉴얼로 만들지 않을 업무가 업무 지시 카드로 남는 장면.
- Speaker Flow: 매뉴얼은 많이 만들수록 좋은 것이 아니다. 한 번만 할 일, 기준이 아직 정리되지 않은 일, 상황이 매번 완전히 다른 일은 지금 업무 지시로 충분하다고 말한다.
- Bridge: `매뉴얼은 어떤 요청에서 켜고 멈출지 먼저 정합니다.`
- visualAssetId: `act4-not-everything-manual`

### 4-7. 매뉴얼은 어떤 요청에서 켜고 멈출지 먼저 정합니다.

- Type: concept
- Headline: `매뉴얼은 어떤 요청에서 켜고 멈출지 먼저 정합니다.`
- Anchors: `어떤 요청에서 켤지`, `시작 전에 확인할 재료`, `무엇이 부족하면 멈출지`
- Visual Intent: 업무 매뉴얼 첫 장에 시작 조건, 필요한 입력, 멈출 조건이 크게 표시된 손그림.
- Speaker Flow: 매뉴얼 후보가 정해지면 먼저 시작 조건을 쓴다. 언제 이 매뉴얼을 꺼낼지, 어떤 입력이 있어야 시작할지, 무엇이 부족하면 멈출지를 정한다고 설명한다.
- Bridge: `매뉴얼 본문에는 실행 순서와 결과물 형식을 짧게 씁니다.`
- visualAssetId: `act4-manual-start-conditions`

### 4-8. 매뉴얼 본문에는 실행 순서와 결과물 형식을 짧게 씁니다.

- Type: concept
- Headline: `매뉴얼 본문에는 실행 순서와 결과물 형식을 짧게 씁니다.`
- Anchors: `실행 전 확인 조건`, `차례대로 할 작업 단계`, `중간 점검 기준`, `결과물 형식`, `남길 기록`
- Visual Intent: 실행 전 확인 조건, 작업 단계, 점검 기준, 결과물 형식, 남길 기록이 짧게 적힌 업무 매뉴얼 본문.
- Speaker Flow: 매뉴얼 본문은 긴 설명서가 아니라 김아이가 바로 따라야 할 짧은 실행 절차라고 설명한다. 실행 전 확인 조건, 작업 단계, 중간 점검 기준, 결과물 형식, 남길 기록이 보이면 된다.
- Bridge: `긴 예시와 판단 기준은 매뉴얼 본문 밖에 둡니다.`
- visualAssetId: `act4-short-procedure`

### 4-9. 긴 예시와 판단 기준은 매뉴얼 본문 밖에 둡니다.

- Type: structure
- Headline: `긴 예시와 판단 기준은 매뉴얼 본문 밖에 둡니다.`
- Anchors: `예시 자료`, `체크리스트`, `판단 기준표`, `실행 재료`
- Visual Intent: 짧은 매뉴얼 본문 옆에 예시, 체크리스트, 기준표, 실행 재료가 별도 상자로 정리된 장면.
- Speaker Flow: 매뉴얼 본문에 모든 것을 넣으면 읽기 어려워진다. 길게 봐야 하는 예시, 판단 기준표, 실행 재료는 따로 두고 필요할 때 꺼내게 한다고 설명한다.
- Bridge: `AI가 읽는 반복 업무 매뉴얼이 Skill입니다.`
- visualAssetId: `act4-manual-supporting-materials`

### 4-10. 업무 매뉴얼(Skill)은 호출 조건과 절차가 분리되어야 합니다.

- Type: consolidation
- Headline: `업무 매뉴얼(Skill)은 호출 조건과 절차가 분리되어야 합니다.`
- Anchors: `호출 조건`, `짧은 절차`, `참고자료`, `출력 형식`
- Visual Intent: 업무 매뉴얼(Skill)의 호출 조건, 짧은 절차, 참고자료, 출력 형식이 분리된 손그림.
- Speaker Flow: Act 0과 Act 4 첫 장에서 이미 본 업무 매뉴얼(Skill)을 다시 회수한다. Skill은 답변 템플릿이 아니라 호출 조건, 짧은 절차, 참고자료, 출력 형식이 있는 재사용 절차라고 정리한다.
- Bridge: `실습에서는 미니 브레인스토밍 Skill로 구조를 연습합니다.`
- visualAssetId: `act4-skill-term-mapping`

### 4-11. 실습에서는 미니 브레인스토밍 Skill로 구조를 연습합니다.

- Type: practice handoff
- Headline: `실습에서는 미니 브레인스토밍 Skill로 구조를 연습합니다.`
- Anchors: `Skill이 켜지는 조건`, `실행 전 확인할 질문`, `접근안 비교 순서`, `마지막 결정 기록`
- Visual Intent: 실습 UI가 아니라 Skill 문서 구조를 미니 브레인스토밍 예시로 보여 주는 안내 카드.
- Speaker Flow: 여기서 특정 실습으로 좁힌다. 미니 브레인스토밍은 Skill 전체 개념의 한 예시이며, 시작 조건, 절차, 참고 예시, 남길 결과를 연습하기 위해 선택한 과제라고 설명한다.
- Bridge: `매뉴얼이 있어도 역할 판단은 분리해야 합니다.`
- nextPracticeId: `act4-skill-authoring`

### 4-12. 매뉴얼이 있어도 역할 판단은 분리해야 합니다.

- Type: bridge
- Headline: `매뉴얼이 있어도 역할 판단은 분리해야 합니다.`
- Anchors: `조사 판단`, `구현 판단`, `검토 판단`
- Visual Intent: 한 김아이가 조사, 구현, 검토 판단을 동시에 들고 있어 역할 분리 필요성이 보이는 장면.
- Speaker Flow: Skill은 반복 절차를 안정시키지만, 조사 판단과 구현 판단과 검토 판단을 한 역할이 모두 맡으면 여전히 섞일 수 있다고 설명한다.
- Bridge: `다음 Act에서는 역할과 도구 권한을 나눕니다.`
- visualAssetId: `act4-to-act5-roles`

## 5. Asset Requirements

### act4-regulation-vs-manual

- teachingRole: CLAUDE.md와 Skill의 차이를 첫 장에서 분명히 구분한다.
- semanticRequirements: 회사 내규 문서와 업무 매뉴얼 문서가 분리되어 보여야 한다. `기준`과 `순서` 라벨이 커야 한다. 김아이가 두 문서를 헷갈리지 않고 비교하는 장면이어야 한다.
- generationPrompt: `Hand-drawn minimal Korean lecture illustration. Kimai compares two documents on a white desk: 회사 내규 CLAUDE.md labeled 기준, and 업무 매뉴얼 Skill labeled 순서. Use black linework and one blue accent. Large readable Korean labels.`
- forbiddenElements: 실습 입력폼, 코드 화면, 복잡한 파일 트리, 그라데이션, 작은 글씨

### act4-repeat-verbal-drift

- teachingRole: 반복 업무를 매번 말로 설명하면 실행 순서가 흔들리는 문제를 설명한다.
- semanticRequirements: 같은 요청이 세 번 반복되지만 김아이가 매번 다른 순서로 시작하는 모습이 보여야 한다. 질문 누락, 승인 생략, 기록 누락이 시각적으로 구분되어야 한다.
- generationPrompt: `Hand-drawn minimal Korean lecture illustration. Three small panels show the same repeated request, but Kimai starts differently each time: 질문함, 바로 실행, 기록 누락. White background, black linework, one blue accent.`
- forbiddenElements: 비난 장면, 복잡한 UI, 장식용 추상 배경, 작은 글씨

### act4-manual-trigger

- teachingRole: Skill 매뉴얼은 호출 조건, 필요한 입력, 멈출 조건을 먼저 정해야 함을 설명한다.
- semanticRequirements: 업무 매뉴얼 첫 장에 세 칸이 크고 읽히게 보여야 한다. 바로 실행하지 않고 시작 조건을 확인하는 김아이가 보여야 한다.
- generationPrompt: `Hand-drawn minimal Korean lecture illustration. A manual first page has three large fields: 호출 조건, 필요한 입력, 멈출 조건. Kimai pauses before implementation and reads it. White background, one blue accent.`
- forbiddenElements: 앱 UI, 코드, 그라데이션, 작은 글씨

### act4-manual-sequence

- teachingRole: 좋은 매뉴얼은 질문, 접근안 비교, 승인 후 진행 순서를 정한다는 점을 설명한다.
- semanticRequirements: 질문 -> 접근안 비교 -> 승인 후 진행 흐름이 한눈에 보여야 한다. 각 단계는 매뉴얼 절차처럼 보여야 한다.
- generationPrompt: `Hand-drawn minimal Korean lecture illustration. A simple workflow in a manual: 질문 -> 접근안 비교 -> 승인 후 진행. Kimai follows the steps before making anything. White background, black linework, one blue accent.`
- forbiddenElements: 점수판, 긴 문단, 복잡한 다이어그램, 작은 글씨

### act4-manual-output

- teachingRole: 매뉴얼은 답변 한 번이 아니라 남길 결과와 다음 단계를 정한다는 점을 설명한다.
- semanticRequirements: 결정 기록, 다음 단계, 재사용 가능한 형식이 결과물로 남는 장면이어야 한다.
- generationPrompt: `Hand-drawn minimal Korean lecture illustration. At the end of a manual, Kimai leaves three output cards: 결정 기록, 다음 단계, 재사용 형식. White background, one blue accent, readable labels.`
- forbiddenElements: 코드 파일 중심, 실습 UI, 추상 아이콘만 나열

### act4-skill-term-mapping

- teachingRole: 업무 매뉴얼 비유를 Skill / Reusable Procedure 용어로 연결한다.
- semanticRequirements: 현실 비유, 작동 원리, 문제 조건, 실제 용어, 실습 증거가 순서대로 이어져야 한다.
- generationPrompt: `Hand-drawn minimal Korean lecture illustration. A five-step bridge: 업무 매뉴얼 -> 절차 고정 -> 순서 흔들림 방지 -> Skill / Reusable Procedure -> 질문 먼저 하기. White background, black linework, one blue accent.`
- forbiddenElements: 코드 중심, 영어 용어만 나열, 작은 글씨

### act4-question-first-skill

- teachingRole: 좋은 Skill은 구현 전에 질문하게 만드는 절차임을 설명한다.
- semanticRequirements: 모호한 요청과 구현으로 달려가는 길 사이에 질문 카드가 먼저 놓여야 한다. 목표, 범위, 승인 확인이 보여야 한다.
- generationPrompt: `Hand-drawn minimal Korean lecture illustration. Kimai receives a vague request but stops at three question cards: 목표 확인, 범위 확인, 승인 확인 before implementation. White background, one blue accent.`
- forbiddenElements: 실습 입력폼, 점수판, 복잡한 UI

### act4-to-act5-roles

- teachingRole: 매뉴얼 다음 문제로 역할 분리 필요성을 열어 준다.
- semanticRequirements: 한 김아이가 조사, 구현, 검토를 동시에 맡아 판단이 섞이는 모습이어야 한다.
- generationPrompt: `Hand-drawn minimal Korean lecture illustration. One Kimai wears three simple hats labeled 조사, 구현, 검토 and the papers overlap. White background, black linework, one blue accent.`
- forbiddenElements: 여러 AI를 단순히 많이 나열, 복잡한 조직도, 코드 화면

## 6. Verification Checklist

- Act 0~3과 용어가 이어지는가?
- 비유 → 원리 → 문제 → 실제 용어 → 실습 이유 순서가 보이는가?
- 실습 UI가 설명 슬라이드에 섞이지 않았는가?
- 한 슬라이드에 두 개 이상의 핵심 메시지가 섞이지 않았는가?
- 오래된 Act 3 context 중심 표현이 Act 4에 남아 있지 않은가?
- `CLAUDE.md = 기준`, `Skill = 순서` 구분이 먼저 보이는가?
- visualAssetId가 asset-pack에 존재하는가?
- JSON parse가 통과하는가?
