# Act 5 Content Source: 역할 분리와 도구 권한

Generated: 2026-05-29
Workspace: `/Users/byeonsanghun/goinfre/research_ai-kimai-content`
Purpose: Act 5 설명 슬라이드와 하네스 주입 소스의 기준 문서. 실습은 별도 로컬 실행형 `act5-local-team-run` 계약에서 다룬다.

## 1. Act 결정

Practice ID:

```text
act5-local-team-run
```

이 Act에서 설명하는 것:

- 매뉴얼이 있어도 한 명이 조사, 구현, 검토를 모두 맡으면 판단이 섞이는 문제
- 역할은 사람 수가 아니라 책임의 경계라는 관점
- 조사 담당, 구현 담당, 검토 담당이 보는 자료와 판단 기준이 달라져야 하는 이유
- 역할마다 붙는 Skill과 Tool Permission이 달라질 수 있다는 점
- MCP는 외부 도구와 자료를 연결하는 통로라는 짧은 설명
- 별도 로컬 실행형 실습으로 넘어가는 브릿지

이 Act에서 설명하지 않는 것:

- Agent를 여러 AI를 동시에 많이 쓰는 기술로만 설명하기
- MCP 서버 구현 세부, 설정 파일, 서버 코드를 설명하기
- Coordinator, Reviewer 같은 영어 역할명만 먼저 던지기
- 웹 채점형 실습 UI처럼 점수판, 입력 폼, 제출 버튼을 설명 슬라이드에 넣기
- Hook/Evaluation 검문소를 자세히 설명하기

이전 Act에서 회수하는 것:

```text
Act 4에서 반복 업무 매뉴얼을 만들었습니다.
하지만 매뉴얼이 있어도 한 명이 모든 판단을 맡으면 조사 근거, 구현 선택, 검토 기준이 섞입니다.
```

다음 Act로 넘기는 문제:

```text
역할과 도구 권한을 나눠도, 마지막에 "완료했습니다"라는 말만 믿으면 품질을 보장할 수 없습니다.
다음 Act에서는 완료 전 검문소를 세웁니다.
```

## 2. 핵심 메시지

```text
김아이 팀은 AI를 많이 늘리는 것이 아니라, 책임과 도구 권한을 분리하는 구조입니다.
```

## 3. 시간과 리듬

권장 설명 시간: 10-12분

예상 설명 슬라이드 수: 10장

흐름:

```text
Act 4 매뉴얼 회수 -> 한 명이 모든 판단을 섞는 문제 -> 역할은 책임 경계 -> 조사 담당 -> 구현 담당 -> 검토 담당 -> 역할별 매뉴얼 -> 역할별 도구 열쇠 -> MCP 연결 통로 -> 로컬 실습 이유 -> Act 6 브릿지
```

## 4. Slide List

### 5-1. 매뉴얼이 있어도 한 명이 모든 일을 하면 판단이 섞입니다.

- Type: transition
- Headline: `매뉴얼이 있어도 한 명이 모든 일을 하면 판단이 섞입니다.`
- Anchors: `조사 판단`, `구현 판단`, `검토 판단`
- Visual Intent: 한 김아이가 조사 자료, 구현 파일, 리뷰 체크를 한 책상에서 동시에 처리하며 종이가 겹치는 손그림
- Speaker Flow: Act 4의 매뉴얼을 회수한다. 매뉴얼은 순서를 잡아 주지만, 한 역할이 모든 결정을 하면 어떤 근거로 조사했고 어떤 기준으로 만들었고 어떤 기준으로 검토했는지가 섞인다고 설명한다.
- Bridge: `역할은 사람 수가 아니라 책임의 경계입니다.`
- visualAssetId: `act5-one-kimai-problem`

### 5-2. 역할은 사람 수가 아니라 책임의 경계입니다.

- Type: concept
- Headline: `역할은 사람 수가 아니라 책임의 경계입니다.`
- Anchors: `누가 무엇을 보는가`, `누가 무엇을 판단하는가`, `누가 어떤 도구를 쓰는가`
- Visual Intent: 사람 수가 늘어나는 그림이 아니라 역할 카드 세 장에 책임 경계선이 그어진 손그림
- Speaker Flow: 역할을 나눈다는 말은 AI를 많이 부르는 것이 아니라 책임을 분리한다는 뜻이라고 설명한다. 각 역할은 봐야 할 자료, 내려야 할 판단, 쓸 수 있는 도구가 다르다.
- Bridge: `먼저 조사 담당은 근거를 찾고 정리합니다.`
- visualAssetId: `act5-role-boundaries`

### 5-3. 조사 담당은 근거를 찾고 정리합니다.

- Type: role explanation
- Headline: `조사 담당은 근거를 찾고 정리합니다.`
- Anchors: `자료 확인`, `출처 기록`, `모르는 것 표시`
- Visual Intent: 조사 담당 역할 카드가 읽기 자료와 출처 메모만 다루고 수정 도구는 잠겨 있는 손그림
- Speaker Flow: 조사 담당은 결과물을 고치는 사람이 아니라 근거를 찾고 정리하는 사람이라고 설명한다. 모르는 것을 지어내지 않고 모르는 상태로 표시하는 것도 조사 담당의 책임이다.
- Bridge: `구현 담당은 정해진 지시와 자료로 결과물을 만듭니다.`
- visualAssetId: `act5-research-role`

### 5-4. 구현 담당은 정해진 지시와 자료로 결과물을 만듭니다.

- Type: role explanation
- Headline: `구현 담당은 정해진 지시와 자료로 결과물을 만듭니다.`
- Anchors: `지시 따르기`, `산출물 만들기`, `임의 확장 금지`
- Visual Intent: 구현 담당 역할 카드가 지시서와 자료를 받아 산출물을 만들고, 조사 카드에는 손대지 않는 손그림
- Speaker Flow: 구현 담당은 조사까지 새로 판단하지 않고, 받은 지시와 자료 안에서 결과물을 만든다고 설명한다. 마음대로 범위를 넓히지 않는 것이 역할 분리의 핵심이다.
- Bridge: `검토 담당은 기준에 맞는지 확인합니다.`
- visualAssetId: `act5-implement-role`

### 5-5. 검토 담당은 기준에 맞는지 확인합니다.

- Type: role explanation
- Headline: `검토 담당은 기준에 맞는지 확인합니다.`
- Anchors: `기준 대조`, `빠진 것 찾기`, `통과/보류 판단`
- Visual Intent: 검토 담당 역할 카드가 체크리스트와 기준표를 들고 산출물을 대조하는 손그림
- Speaker Flow: 검토 담당은 구현자의 자기 확신을 그대로 믿지 않고 기준에 맞는지 본다. 검토 역할은 새로 만들기보다 빠진 것과 위험을 드러내는 책임이라고 설명한다.
- Bridge: `역할마다 붙는 매뉴얼도 달라질 수 있습니다.`
- visualAssetId: `act5-review-role`

### 5-6. 역할마다 붙는 매뉴얼이 달라질 수 있습니다.

- Type: system
- Headline: `역할마다 붙는 매뉴얼이 달라질 수 있습니다.`
- Anchors: `조사 매뉴얼`, `구현 매뉴얼`, `검토 매뉴얼`
- Visual Intent: 역할 카드마다 서로 다른 업무 매뉴얼이 연결된 손그림
- Speaker Flow: Act 4에서 배운 Skill은 모든 역할에게 똑같이 붙지 않는다. 조사 담당에게는 근거 정리 매뉴얼, 구현 담당에게는 산출물 작성 매뉴얼, 검토 담당에게는 기준 점검 매뉴얼이 붙을 수 있다고 설명한다.
- Bridge: `도구도 필요한 역할에게만 열어 줍니다.`
- visualAssetId: `act5-role-skill-assignment`

### 5-7. 도구는 많이 열어 주는 것이 아니라 필요한 역할에게만 줍니다.

- Type: system
- Headline: `도구는 많이 열어 주는 것이 아니라 필요한 역할에게만 줍니다.`
- Anchors: `읽기 열쇠`, `쓰기 열쇠`, `실행 열쇠`, `외부 연결 열쇠`
- Visual Intent: 역할 카드마다 서로 다른 도구 열쇠가 배정되고, 필요 없는 열쇠는 잠겨 있는 손그림
- Speaker Flow: 도구 권한은 많을수록 좋은 것이 아니라고 설명한다. 조사 담당에게 수정 권한을 주면 근거 정리가 산출물 변경으로 번질 수 있고, 검토 담당에게 기준 없는 실행 권한을 주면 검토가 흔들릴 수 있다.
- Bridge: `외부 도구와 자료를 잇는 통로가 MCP입니다.`
- visualAssetId: `act5-tool-permission`

### 5-8. 외부 도구와 자료를 잇는 통로가 MCP입니다.

- Type: term mapping
- Headline: `외부 도구와 자료를 잇는 통로가 MCP입니다.`
- Anchors: `회사 시스템 출입구`, `역할별 접근`, `필요한 도구만 연결`
- Visual Intent: 역할 카드가 하나의 표준 출입구를 통해 외부 도구에 접근하고, 역할별로 열린 문이 다른 손그림
- Speaker Flow: MCP는 오늘 서버 구현을 배우는 주제가 아니라고 선을 긋는다. 회사 시스템에 들어가는 표준 출입구처럼, 외부 도구와 자료를 AI에게 연결하는 통로라고 짧게 설명한다.
- Bridge: `실습에서는 로컬에서 김아이 팀을 실행합니다.`
- visualAssetId: `act5-mcp-passage`

### 5-9. 실습에서는 로컬에서 김아이 팀을 실행합니다.

- Type: practice handoff
- Headline: `실습에서는 로컬에서 김아이 팀을 실행합니다.`
- Anchors: `역할별 프롬프트`, `Skill 배정`, `Tool 권한`, `실행 기록`
- Visual Intent: 실습 UI가 아니라 로컬 실행 체크리스트와 실행 기록 템플릿이 놓인 안내 장면
- Speaker Flow: 다음은 웹 채점 화면이 아니라 로컬 실행형 실습이라고 분명히 말한다. 수강생은 역할별 프롬프트, Skill 배정, Tool 권한 안내, 실행 기록 템플릿을 확인한다.
- Bridge: `역할과 도구를 나눠도 완료 선언만으로는 충분하지 않습니다.`
- nextPracticeId: `act5-local-team-run`

### 5-10. 역할과 도구를 나눠도 완료 선언만으로는 충분하지 않습니다.

- Type: bridge
- Headline: `역할과 도구를 나눠도 완료 선언만으로는 충분하지 않습니다.`
- Anchors: `역할별 결과`, `완료 선언`, `검증 증거`
- Visual Intent: 역할별 결과물이 모였지만 마지막 검문소의 증거칸이 비어 있는 손그림
- Speaker Flow: 역할과 도구 분리는 판단 섞임을 줄이지만, 마지막에 완료라고 말하는 것만으로 품질이 보장되지는 않는다고 설명한다.
- Bridge: `다음 Act에서는 완료 전 검문소를 세웁니다.`
- visualAssetId: `act5-to-act6-checkpoint`

## 5. Asset Requirements

### act5-one-kimai-problem

- teachingRole: 한 명이 조사, 구현, 검토를 모두 맡으면 판단이 섞이는 문제를 설명한다.
- semanticRequirements: 한 김아이와 세 업무가 한 책상에 겹쳐 보여야 한다. 조사 근거, 구현 선택, 검토 기준이 섞이는 느낌이 있어야 한다.
- generationPrompt: `Hand-drawn minimal Korean lecture illustration. One Kimai handles 조사, 구현, 검토 at the same desk; papers overlap and labels show 판단 섞임. White background, black linework, one blue accent.`
- forbiddenElements: 여러 AI를 많이 나열, 복잡한 조직도, 도구 UI 중심

### act5-role-boundaries

- teachingRole: 역할은 사람 수가 아니라 책임의 경계라는 점을 설명한다.
- semanticRequirements: 역할 카드와 책임 경계가 보여야 한다. 영어 역할명만 크게 보이지 않고 한국어 책임 설명이 함께 있어야 한다.
- generationPrompt: `Hand-drawn minimal Korean lecture illustration. Three role cards with clear boundaries: 조사 담당, 구현 담당, 검토 담당. Labels show 볼 자료, 판단, 쓸 도구. White background, one blue accent.`
- forbiddenElements: 작은 로봇 군단, 복잡한 org chart, 영어 용어만 나열

### act5-research-role

- teachingRole: 조사 담당은 근거를 찾고 정리하며 모르는 것을 표시하는 역할임을 설명한다.
- semanticRequirements: 자료 확인, 출처 기록, 모르는 것 표시가 보여야 한다. 수정 도구는 잠겨 있어야 한다.
- generationPrompt: `Hand-drawn minimal Korean lecture illustration. A 조사 담당 role card reads materials, writes 출처 기록, marks 모르는 것. A 수정 도구 key is locked. White background, one blue accent.`
- forbiddenElements: 산출물 수정 장면, 서버 코드, 복잡한 UI

### act5-implement-role

- teachingRole: 구현 담당은 정해진 지시와 자료 안에서 산출물을 만드는 역할임을 설명한다.
- semanticRequirements: 지시서와 자료를 받아 산출물을 만드는 장면이어야 한다. 임의 확장 금지 라벨이 보여야 한다.
- generationPrompt: `Hand-drawn minimal Korean lecture illustration. A 구현 담당 role card uses a fixed instruction sheet and selected materials to make an output. Label 임의 확장 금지. White background, one blue accent.`
- forbiddenElements: 조사와 리뷰까지 모두 하는 장면, 복잡한 코드 화면

### act5-review-role

- teachingRole: 검토 담당은 기준에 맞는지 확인하고 빠진 것을 찾는 역할임을 설명한다.
- semanticRequirements: 기준표, 빠진 것 찾기, 통과/보류 판단이 보여야 한다.
- generationPrompt: `Hand-drawn minimal Korean lecture illustration. A 검토 담당 role card compares an output with a 기준표, marks 빠진 것, and chooses 통과 or 보류. White background, one blue accent.`
- forbiddenElements: 새 산출물 작성 장면, 점수판 중심, 처벌 장면

### act5-role-skill-assignment

- teachingRole: 역할마다 붙는 Skill 매뉴얼이 달라질 수 있음을 설명한다.
- semanticRequirements: 조사 매뉴얼, 구현 매뉴얼, 검토 매뉴얼이 각 역할 카드에 다르게 연결되어야 한다.
- generationPrompt: `Hand-drawn minimal Korean lecture illustration. Three role cards receive different manuals: 조사 매뉴얼, 구현 매뉴얼, 검토 매뉴얼. White background, black linework, one blue accent.`
- forbiddenElements: 모든 역할에 같은 매뉴얼 연결, 코드 화면, 복잡한 파일 트리

### act5-tool-permission

- teachingRole: Tool Permission은 역할별로 필요한 도구 열쇠만 주는 구조임을 설명한다.
- semanticRequirements: 읽기, 쓰기, 실행, 외부 연결 열쇠가 역할별로 다르게 배정되어야 한다. 모든 도구가 모두에게 열린 모습은 금지한다.
- generationPrompt: `Hand-drawn minimal Korean lecture illustration. Role cards receive different tool keys: 읽기, 쓰기, 실행, 외부 연결. Some keys are locked for roles that do not need them. White background, one blue accent.`
- forbiddenElements: 모든 도구가 모두에게 열림, 서버 구현, 복잡한 UI

### act5-mcp-passage

- teachingRole: MCP를 외부 도구와 자료를 잇는 표준 연결 통로로 짧게 설명한다.
- semanticRequirements: MCP가 서버 코드가 아니라 통로로 보여야 한다. 역할별 접근 차이가 보여야 한다.
- generationPrompt: `Hand-drawn minimal Korean lecture illustration. A standard doorway labeled MCP connects Kimai role cards to external tools and 자료. Different roles have different access doors. White background, one blue accent.`
- forbiddenElements: 서버 코드, 네트워크 다이어그램 과잉, 로고, 작은 글씨

### act5-to-act6-checkpoint

- teachingRole: 역할과 도구를 나눠도 마지막 검문소가 필요하다는 Act 6 브릿지를 설명한다.
- semanticRequirements: 역할별 결과물이 모였지만 검증 증거칸이 비어 있어야 한다.
- generationPrompt: `Hand-drawn minimal Korean lecture illustration. Outputs from 조사, 구현, 검토 arrive together, but final evidence boxes are empty beside a 검문소 gate. White background, one blue accent.`
- forbiddenElements: 점수판 중심, 코드 중심, 복잡한 조직도

## 6. Verification Checklist

- Act 0~4와 용어가 이어지는가?
- 비유 → 원리 → 문제 → 실제 용어 → 실습 이유 순서가 보이는가?
- 실습 UI가 설명 슬라이드에 섞이지 않았는가?
- 한 슬라이드에 두 개 이상의 핵심 메시지가 섞이지 않았는가?
- Agent를 여러 AI 동시 사용으로만 설명하지 않는가?
- MCP가 구현 세부가 아니라 외부 도구 연결 통로로 짧게 남아 있는가?
- visualAssetId가 asset-pack에 존재하는가?
- JSON parse가 통과하는가?
