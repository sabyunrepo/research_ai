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

- 김아이 혼자 자료 찾기, 결과물 만들기, 제출 전 확인을 모두 맡으면 헷갈리는 문제
- 회사에서 담당자, 검토자, 승인자를 나누는 방식의 비유
- 김아이, 최아이, 박아이에게 서로 다른 역할을 맡기는 구조
- 각 신입사원이 자기 자리의 매뉴얼(Skill)만 보는 이유
- 보안 권한과 접근 구역을 맡은 일에 맞게 주는 Tool Permission 개념
- MCP를 협력사에 요청을 보내는 공식 창구로 설명하는 흐름
- 에이전트 팀 구현실습으로 넘어가는 브릿지

이 Act에서 설명하지 않는 것:

- Agent를 여러 AI를 동시에 많이 쓰는 기술로만 설명하기
- MCP 서버 구현 세부, 설정 파일, 서버 코드를 설명하기
- 영어 역할명만 먼저 던지기
- 웹 채점형 실습 UI처럼 점수판, 입력 폼, 제출 버튼을 설명 슬라이드에 넣기
- Hook/Evaluation 검문소를 자세히 설명하기

이전 Act에서 회수하는 것:

```text
Act 4에서 작업별 업무 매뉴얼을 만들었습니다.
하지만 매뉴얼이 있어도 김아이 혼자 자료 찾기, 결과물 만들기, 제출 전 확인을 모두 맡으면 일이 섞입니다.
```

다음 Act로 넘기는 문제:

```text
김아이, 최아이, 박아이 팀이 작업을 끝냈다고 해도 제출 전 확인은 별도로 필요합니다.
다음 Act에서는 완료 전 검문소를 세웁니다.
```

## 2. 핵심 메시지

```text
김아이 팀은 역할 신입사원마다 맡은 일과 매뉴얼(Skill), 보안 권한, 접근 구역을 다르게 주는 구조입니다.
```

## 3. 시간과 리듬

권장 설명 시간: 10-12분

예상 설명 슬라이드 수: 10장

흐름:

```text
Act 4 매뉴얼 회수 -> 김아이 혼자 하는 문제 -> 회사 결재 비유 -> 김아이/최아이/박아이 합류 -> 역할별 일 -> Agent/Subagent 용어 연결 -> 매뉴얼(Skill) 배정 -> 보안 권한/접근 구역 -> MCP 협력사 창구 -> 에이전트 팀 구현실습 -> Act 6 브릿지
```

## 4. Slide List

### 5-1. 김아이에게 매뉴얼을 줘도 모든 일을 혼자 맡기면 헷갈립니다.

- Type: transition
- Headline: `김아이에게 매뉴얼을 줘도 모든 일을 혼자 맡기면 헷갈립니다.`
- Anchors: `자료 찾기`, `결과물 만들기`, `제출 전 확인`
- Visual Intent: 김아이가 자료 찾기, 결과물 만들기, 제출 전 확인을 한 책상에서 동시에 처리하며 헷갈리는 손그림
- Speaker Flow: Act 4의 매뉴얼을 회수한다. 매뉴얼이 있어도 김아이 한 명에게 자료 찾기, 결과물 만들기, 제출 전 확인을 모두 맡기면 판단이 섞인다고 설명한다.
- Bridge: `회사에서는 한 사람이 모든 결재를 혼자 하지 않습니다.`
- visualAssetId: `act5-kimai-does-everything`

### 5-2. 회사에서는 한 사람이 모든 결재를 혼자 하지 않습니다.

- Type: analogy
- Headline: `회사에서는 한 사람이 모든 결재를 혼자 하지 않습니다.`
- Anchors: `담당자`, `검토자`, `승인자`
- Visual Intent: 회사 결재 흐름에서 담당자, 검토자, 승인자가 구분된 손그림
- Speaker Flow: 회사에서는 일을 만든 사람, 검토하는 사람, 승인하는 사람이 나뉜다고 설명한다. AI 업무도 같은 식으로 책임을 나눌 수 있다고 연결한다.
- Bridge: `해야 할 일이 많아지면 다른 신입사원을 데려옵니다.`
- visualAssetId: `act5-company-approval-roles`

### 5-3. 해야 할 일이 많아지면 다른 신입사원을 데려옵니다.

- Type: concept
- Headline: `해야 할 일이 많아지면 다른 신입사원을 데려옵니다.`
- Anchors: `김아이`, `최아이`, `박아이`
- Visual Intent: 김아이 옆에 최아이와 박아이가 새로 합류해 각자 다른 자리표를 받는 손그림
- Speaker Flow: 원래 김아이 혼자 하던 일을 이제 김아이, 최아이, 박아이로 나눠 맡긴다고 설명한다. 핵심은 사람 수를 늘리는 것이 아니라 책임 자리를 나누는 것이다.
- Bridge: `김아이는 근거를 찾고 모르는 것을 표시합니다.`
- visualAssetId: `act5-new-hires-team`

### 5-4. 김아이는 근거를 찾고 모르는 것을 표시합니다.

- Type: role explanation
- Headline: `김아이는 근거를 찾고 모르는 것을 표시합니다.`
- Anchors: `자료 찾기`, `출처 남기기`, `모르는 것 표시`
- Visual Intent: 김아이가 자료와 출처 메모를 정리하고 모르는 것 카드를 표시하는 손그림
- Speaker Flow: 김아이는 조사 역할을 맡는다. 결과물을 바로 고치지 않고 근거를 찾고, 출처를 남기고, 모르는 것은 모른다고 표시한다.
- Bridge: `최아이는 정해진 지시와 자료로 결과물을 만듭니다.`
- visualAssetId: `act5-kimai-research-role`

### 5-5. 최아이는 정해진 지시와 자료로 결과물을 만듭니다.

- Type: role explanation
- Headline: `최아이는 정해진 지시와 자료로 결과물을 만듭니다.`
- Anchors: `지시서 보기`, `정해진 자료 사용`, `보고서 초안 작성`
- Visual Intent: 최아이가 지시서와 정해진 자료만 보고 보고서 초안을 작성하는 손그림
- Speaker Flow: 최아이는 작성 역할을 맡는다. 새 근거를 마음대로 만들어내거나 범위를 확장하지 않고, 정해진 지시와 자료 안에서 결과물을 만든다.
- Bridge: `박아이는 제출 기준에 맞는지 확인합니다.`
- visualAssetId: `act5-choi-writing-role`

### 5-6. 박아이는 제출 기준에 맞는지 확인합니다.

- Type: role explanation
- Headline: `박아이는 제출 기준에 맞는지 확인합니다.`
- Anchors: `기준표 대조`, `빠진 항목 찾기`, `보류 또는 통과 표시`
- Visual Intent: 박아이가 기준표와 결과물을 대조하고 보류/통과 도장을 찍는 손그림
- Speaker Flow: 박아이는 검토 역할을 맡는다. 작성자가 스스로 괜찮다고 말하는 것을 그대로 믿지 않고, 제출 기준표에 맞는지 확인한다.
- Bridge: `이런 역할 김아이를 Agent 또는 Subagent라고 부릅니다.`
- visualAssetId: `act5-park-review-role`

### 5-7. 이런 역할 김아이를 Agent 또는 Subagent라고 부릅니다.

- Type: term mapping
- Headline: `이런 역할 김아이를 Agent 또는 Subagent라고 부릅니다.`
- Anchors: `역할 지시문`, `따로 보는 자료`, `따로 맡은 책임`
- Visual Intent: 김아이, 최아이, 박아이 역할 카드가 Agent/Subagent 용어로 연결되는 손그림
- Speaker Flow: 이제 실제 용어를 연결한다. 역할을 나눠 맡은 김아이, 최아이, 박아이 같은 작업 단위를 Agent 또는 Subagent라고 부른다. 각 역할은 지시문, 보는 자료, 맡은 책임이 다를 수 있다.
- Bridge: `각 신입사원은 자기 자리의 매뉴얼(Skill)만 봅니다.`
- visualAssetId: `act5-agent-term-mapping`

### 5-8. 각 신입사원은 자기 자리의 매뉴얼(Skill)만 봅니다.

- Type: system
- Headline: `각 신입사원은 자기 자리의 매뉴얼(Skill)만 봅니다.`
- Anchors: `조사 매뉴얼(Skill)`, `작성 매뉴얼(Skill)`, `검토 매뉴얼(Skill)`
- Visual Intent: 김아이, 최아이, 박아이에게 각자 다른 매뉴얼(Skill)이 배정된 손그림
- Speaker Flow: Act 4의 Skill을 회수한다. 모든 신입사원이 같은 매뉴얼을 보는 것이 아니라, 맡은 자리마다 필요한 매뉴얼(Skill)이 다르다고 설명한다.
- Bridge: `보안 권한과 접근 구역도 맡은 일에 맞게 줍니다.`
- visualAssetId: `act5-new-hire-skill-assignment`

### 5-9. 보안 권한과 접근 구역도 맡은 일에 맞게 줍니다.

- Type: system
- Headline: `보안 권한과 접근 구역도 맡은 일에 맞게 줍니다.`
- Anchors: `자료 열람 권한`, `문서 작성 권한`, `실행/검증 권한`, `접근 가능한 구역`
- Visual Intent: 각 신입사원에게 다른 출입증과 접근 구역이 부여된 손그림
- Speaker Flow: 도구 권한을 회사 보안 권한으로 설명한다. 모든 신입사원에게 모든 열쇠를 주지 않고, 맡은 일에 맞는 권한과 접근 구역만 준다.
- Bridge: `MCP는 협력사에 요청을 보내는 공식 창구입니다.`
- visualAssetId: `act5-security-permissions`

### 5-10. MCP는 협력사에 요청을 보내는 공식 창구입니다.

- Type: term mapping
- Headline: `MCP는 협력사에 요청을 보내는 공식 창구입니다.`
- Anchors: `외부 자료 요청`, `외부 도구 요청`, `허가된 통로`, `요청 기록`
- Visual Intent: 회사 내부의 신입사원이 공식 창구를 통해 협력사에 자료나 도구 요청을 보내는 손그림
- Speaker Flow: MCP를 서버 구현이 아니라 협력사 요청 창구로 설명한다. 외부 자료나 외부 도구가 필요할 때 아무 통로로 나가는 것이 아니라 허가된 공식 창구를 통해 요청하고 기록을 남긴다고 설명한다.
- Bridge: `실습에서는 에이전트 팀을 구현해 봅니다.`
- visualAssetId: `act5-mcp-partner-window`

### 5-11. 실습에서는 에이전트 팀을 구현해 봅니다.

- Type: practice handoff
- Headline: `실습에서는 에이전트 팀을 구현해 봅니다.`
- Anchors: `김아이 역할`, `최아이 역할`, `박아이 역할`, `실행 기록`
- Visual Intent: 실습 UI가 아니라 김아이, 최아이, 박아이 역할 카드와 실행 기록 템플릿을 보여 주는 안내 장면
- Speaker Flow: 다음은 웹 채점 화면이 아니라 로컬 실행형 실습이라고 분명히 말한다. 역할 지시문, 매뉴얼(Skill), 권한, 실행 기록을 연결해 에이전트 팀을 구현해 본다.
- Bridge: `팀이 작업을 끝냈어도 제출 전 확인은 필요합니다.`
- nextPracticeId: `act5-local-team-run`

### 5-12. 팀이 작업을 끝냈어도 제출 전 확인은 필요합니다.

- Type: bridge
- Headline: `팀이 작업을 끝냈어도 제출 전 확인은 필요합니다.`
- Anchors: `역할별 결과`, `완료 보고`, `제출 전 증거`, `다음 Act: 검문소`
- Visual Intent: 김아이 팀이 결과물을 모았지만 제출 전 검문소의 증거칸이 아직 비어 있는 손그림
- Speaker Flow: 역할과 권한 분리는 판단 섞임을 줄이지만, 팀이 끝냈다고 말해도 제출 전 확인은 별도로 필요하다고 설명한다.
- Bridge: `다음 Act에서는 완료 전 검문소를 세웁니다.`
- visualAssetId: `act5-team-to-act6-checkpoint`

## 5. Asset Requirements

### act5-kimai-does-everything

- teachingRole: 김아이 혼자 자료 찾기, 결과물 만들기, 제출 전 확인을 모두 맡으면 헷갈리는 문제를 설명한다.
- semanticRequirements: 김아이 한 명이 세 가지 일을 동시에 처리하며 헷갈리는 모습이어야 한다. 자료 찾기, 결과물 만들기, 제출 전 확인 라벨이 커야 한다.
- generationPrompt: `Hand-drawn minimal Korean lecture illustration. Kimai tries to do 자료 찾기, 결과물 만들기, 제출 전 확인 at one desk and looks confused. White background, black linework, one blue accent.`
- forbiddenElements: 여러 AI 군단, 복잡한 조직도, 코드 화면, 실습 입력폼

### act5-company-approval-roles

- teachingRole: 회사에서는 담당자, 검토자, 승인자가 나뉜다는 비유를 설명한다.
- semanticRequirements: 담당자, 검토자, 승인자가 결재 흐름 안에서 분리되어 보여야 한다.
- generationPrompt: `Hand-drawn minimal Korean lecture illustration. Company approval flow with three separate stations: 담당자, 검토자, 승인자. White background, one blue accent, readable labels.`
- forbiddenElements: 복잡한 조직도, 영어 역할명만 나열, 작은 글씨

### act5-new-hires-team

- teachingRole: 일이 많아지면 김아이, 최아이, 박아이로 책임 자리를 나눈다는 장면을 설명한다.
- semanticRequirements: 김아이 옆에 최아이와 박아이가 합류하고, 각자 다른 자리표를 받아야 한다.
- generationPrompt: `Hand-drawn minimal Korean lecture illustration. Kimai is joined by two new hires named 최아이 and 박아이. Each receives a different role card. White background, one blue accent.`
- forbiddenElements: 로봇 군단, 기술 다이어그램, 서버 코드

### act5-kimai-research-role

- teachingRole: 김아이가 근거를 찾고 모르는 것을 표시하는 역할임을 설명한다.
- semanticRequirements: 자료 찾기, 출처 남기기, 모르는 것 표시가 보여야 한다.
- generationPrompt: `Hand-drawn minimal Korean lecture illustration. Kimai researches materials, writes 출처, and marks 모르는 것. White background, one blue accent.`
- forbiddenElements: 결과물 작성 장면, 검토 도장, 코드 화면

### act5-choi-writing-role

- teachingRole: 최아이가 정해진 지시와 자료로 결과물을 만드는 역할임을 설명한다.
- semanticRequirements: 최아이가 지시서와 정해진 자료만 보고 보고서 초안을 작성해야 한다.
- generationPrompt: `Hand-drawn minimal Korean lecture illustration. Choi-ai reads a 지시서 and 정해진 자료, then writes 보고서 초안. White background, one blue accent.`
- forbiddenElements: 근거를 새로 지어내는 장면, 검토 도장, 복잡한 UI

### act5-park-review-role

- teachingRole: 박아이가 제출 기준에 맞는지 확인하는 역할임을 설명한다.
- semanticRequirements: 기준표 대조, 빠진 항목 찾기, 보류 또는 통과 표시가 보여야 한다.
- generationPrompt: `Hand-drawn minimal Korean lecture illustration. Park-ai checks an output against 기준표, marks 빠진 항목, and stamps 보류 or 통과. White background, one blue accent.`
- forbiddenElements: 새 산출물 작성 장면, 점수판 중심, 처벌 장면

### act5-agent-term-mapping

- teachingRole: 역할 김아이 비유를 Agent/Subagent 용어로 연결한다.
- semanticRequirements: 김아이, 최아이, 박아이 역할 카드가 Agent/Subagent 용어로 이어져야 한다. 역할 지시문, 따로 보는 자료, 따로 맡은 책임이 보여야 한다.
- generationPrompt: `Hand-drawn minimal Korean lecture illustration. Role cards 김아이, 최아이, 박아이 connect to terms Agent and Subagent. Labels: 역할 지시문, 따로 보는 자료, 따로 맡은 책임. White background, one blue accent.`
- forbiddenElements: 하네스라는 단어를 큰 제목으로 사용, 복잡한 기술 다이어그램, 작은 글씨

### act5-new-hire-skill-assignment

- teachingRole: 각 신입사원이 자기 자리의 매뉴얼(Skill)만 보는 구조를 설명한다.
- semanticRequirements: 조사 매뉴얼(Skill), 작성 매뉴얼(Skill), 검토 매뉴얼(Skill)이 각각 다른 신입사원에게 연결되어야 한다.
- generationPrompt: `Hand-drawn minimal Korean lecture illustration. Kimai, Choi-ai, and Park-ai each read only their own manual labeled Skill: 조사 매뉴얼, 작성 매뉴얼, 검토 매뉴얼. White background, one blue accent.`
- forbiddenElements: 모두에게 같은 매뉴얼 연결, 코드 파일 트리, 작은 글씨

### act5-security-permissions

- teachingRole: 보안 권한과 접근 구역을 맡은 일에 맞게 주는 Tool Permission 개념을 설명한다.
- semanticRequirements: 자료 열람 권한, 문서 작성 권한, 실행/검증 권한, 접근 가능한 구역이 역할별로 다르게 보여야 한다.
- generationPrompt: `Hand-drawn minimal Korean lecture illustration. New hires receive different security badges and access zones: 자료 열람 권한, 문서 작성 권한, 실행/검증 권한, 접근 가능한 구역. White background, one blue accent.`
- forbiddenElements: 모든 권한이 모두에게 열림, 서버 구현, 복잡한 UI

### act5-mcp-partner-window

- teachingRole: MCP를 협력사에 요청을 보내는 공식 창구로 설명한다.
- semanticRequirements: 회사 내부에서 협력사 공식 창구로 외부 자료 요청과 외부 도구 요청을 보내고 요청 기록이 남아야 한다.
- generationPrompt: `Hand-drawn minimal Korean lecture illustration. A company official partner request window labeled MCP sends 외부 자료 요청 and 외부 도구 요청 to a 협력사, with 요청 기록. White background, one blue accent.`
- forbiddenElements: 서버 코드, 네트워크 다이어그램 과잉, 외부 회사 로고

### act5-team-to-act6-checkpoint

- teachingRole: 팀이 작업을 끝냈어도 제출 전 확인이 필요하다는 Act 6 브릿지를 설명한다.
- semanticRequirements: 김아이, 최아이, 박아이의 역할별 결과가 모였지만 제출 전 증거칸 또는 검문소가 아직 남아 있어야 한다.
- generationPrompt: `Hand-drawn minimal Korean lecture illustration. Kimai, Choi-ai, and Park-ai submit role outputs, but evidence boxes before final 제출 are still empty at a 검문소. White background, one blue accent.`
- forbiddenElements: 점수판 중심, 코드 화면, 복잡한 조직도

## 6. Verification Checklist

- Act 0~4와 용어가 이어지는가?
- 비유 → 원리 → 문제 → 실제 용어 → 실습 이유 순서가 보이는가?
- 실습 UI가 설명 슬라이드에 섞이지 않았는가?
- 한 슬라이드에 두 개 이상의 핵심 메시지가 섞이지 않았는가?
- Agent를 여러 AI 동시 사용으로만 설명하지 않는가?
- MCP가 구현 세부가 아니라 외부 도구 연결 통로로 짧게 남아 있는가?
- visualAssetId가 asset-pack에 존재하는가?
- JSON parse가 통과하는가?
