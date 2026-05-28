# Act 5 Content Source: 역할 분리와 도구 권한

Generated: 2026-05-28
Workspace: `/Users/byeonsanghun/goinfre/research_ai-kimai-content`
Purpose: Act 5 설명 슬라이드와 하네스 주입 소스의 기준 문서. 실습은 별도 로컬 실행형 `act5-local-team-run` 계약에서 다룬다.

## 1. Act 5 결정

Act 5의 강의 부분은 한 명의 김아이에게 조사, 구현, 리뷰를 모두 맡기지 않고 역할, Skill, Tool 권한을 분리하는 구조를 설명한다.

Practice ID:

```text
act5-local-team-run
```

Act 5 설명 슬라이드에서 다루는 것:

- Act 4의 mini-brainstorming Skill 회수
- 역할 분리의 이유
- Coordinator, Researcher, Implementer, Reviewer 책임
- Skill 배정과 Tool 권한 제한
- MCP를 도구 연결 통로로 짧게 설명
- 별도 로컬 실행 실습 진입

## 2. 핵심 메시지

```text
김아이 팀은 AI를 늘리는 것이 아니라, 역할과 Skill과 도구 권한을 분리하는 구조입니다.
```

## 3. 시간과 리듬

권장 설명 시간: 8-10분

권장 설명 슬라이드 수: 6장

리듬:

```text
Act 4 회수 -> 한 명이 다 하는 문제 -> 역할 카드 -> Skill/Tool 배정 -> 로컬 실습 진입 -> Act 6 브릿지
```

## 4. Slide List

### 5-1. 한 명이 조사, 구현, 리뷰를 모두 맡으면 판단이 섞입니다

- Type: transition
- Headline: `한 명이 조사, 구현, 리뷰를 모두 맡으면 판단이 섞입니다.`
- Anchors: `조사`, `구현`, `리뷰`
- Visual: 한 김아이가 세 역할을 동시에 처리하며 혼란스러운 장면
- Bridge: `역할을 나누면 판단 기준도 나뉩니다.`
- visualAssetId: `act5-one-kimai-problem`

### 5-2. 역할은 사람 수가 아니라 책임의 경계입니다

- Type: concept
- Headline: `역할은 사람 수가 아니라 책임의 경계입니다.`
- Anchors: `Coordinator`, `Implementer`, `Reviewer`
- Visual: 역할 카드가 분리된 김아이 팀
- Bridge: `각 역할에는 다른 매뉴얼과 도구가 필요합니다.`
- visualAssetId: `act5-role-boundaries`

### 5-3. 스킬은 필요한 역할에게만 붙입니다

- Type: system
- Headline: `스킬은 필요한 역할에게만 붙입니다.`
- Anchors: `Coordinator`, `mini-brainstorming`, `직접 구현 금지`
- Visual: Act 4 Skill이 Coordinator 역할 카드에만 연결되는 장면
- Bridge: `도구 권한도 같은 방식으로 좁힙니다.`
- visualAssetId: `act5-skill-assignment`

### 5-4. 도구는 많이 열어 주는 것이 아니라 필요한 역할에게만 줍니다

- Type: system
- Headline: `도구는 많이 열어 주는 것이 아니라 필요한 역할에게만 줍니다.`
- Anchors: `읽기 도구`, `쓰기 도구`, `실행 도구`, `외부 연결`
- Visual: 역할별 도구 열쇠가 다르게 배정된 장면
- Bridge: `외부 도구는 연결 통로를 통해 붙입니다.`
- visualAssetId: `act5-tool-permission`

### 5-5. 실습에서는 로컬에서 김아이 팀을 실행합니다

- Type: practice handoff
- Headline: `실습에서는 로컬에서 김아이 팀을 실행합니다.`
- Anchors: `역할 프롬프트`, `권한 배정`, `실행 기록`
- Visual: 실습 UI가 아니라 로컬 실행 체크리스트와 로그 템플릿
- Bridge: `환경이 안 맞으면 관찰 모드 로그로 판단합니다.`
- nextPracticeId: `act5-local-team-run`

### 5-6. 역할과 도구를 나눠도 완료 선언만으로는 충분하지 않습니다

- Type: bridge
- Headline: `역할과 도구를 나눠도 완료 선언만으로는 충분하지 않습니다.`
- Anchors: `완료 선언`, `증거`, `검문소`
- Visual: 역할별 결과가 모였지만 검문소가 아직 없는 장면
- Bridge: `다음 Act에서는 완료 전 자동 검문소를 세웁니다.`
- visualAssetId: `act5-to-act6-checkpoint`

## 5. Asset Requirements

Required visual assets:

```text
act5-one-kimai-problem
act5-role-boundaries
act5-skill-assignment
act5-tool-permission
act5-to-act6-checkpoint
```

이미지는 역할, Skill, Tool 권한의 분리가 설명 가능해야 하며 MCP 서버 구현 세부는 넣지 않는다.

## 6. Additional Explanation Slides

### 5-7. 역할 카드는 한 사람이 모든 판단을 섞지 않게 하는 책임표입니다
- Function: 현실 비유
- Headline: `역할 카드는 한 사람이 모든 판단을 섞지 않게 하는 책임표입니다.`
- Anchors: `조사 담당`, `구현 담당`, `검토 담당`
- Bridge: `역할과 도구 열쇠가 없으면 일이 뒤섞입니다.`

### 5-8. 역할과 도구 열쇠가 없으면 일이 뒤섞입니다
- Function: 작동 원리와 문제 조건
- Headline: `역할과 도구 열쇠가 없으면 일이 뒤섞입니다.`
- Anchors: `조사자가 수정`, `구현자가 셀프 리뷰`, `검토자가 기준 없이 판단`
- Bridge: `AI에서는 역할을 Agent로, 도구 열쇠를 Tool Permission으로 나눕니다.`

### 5-9. 역할은 Agent, 도구 열쇠는 Tool Permission입니다
- Function: 실제 용어 연결
- Headline: `역할은 Agent, 도구 열쇠는 Tool Permission입니다.`
- Anchors: `역할 카드`, `Agent Role`, `도구 열쇠`, `Tool Permission`
- Bridge: `그래서 Act 5는 누가 무엇을 보고 어떤 도구를 쓸지 나누는 시간입니다.`

### 5-10. Act 5는 역할과 도구 권한을 나누는 시간입니다
- Function: 실습 이유
- Headline: `Act 5는 역할과 도구 권한을 나누는 시간입니다.`
- Anchors: `책임`, `볼 자료`, `쓸 도구`
- Bridge: `다음 Act에서는 완료했다는 말 대신 증거를 확인합니다.`
