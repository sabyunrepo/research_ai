# Act 3 Content Source: 데스크와 회사 규칙판

Generated: 2026-05-28
Workspace: `/Users/byeonsanghun/goinfre/research_ai-kimai-content`
Purpose: Act 3 설명 슬라이드와 하네스 주입 소스의 기준 문서. 실습 UI는 별도 `act3-context-workbench` 계약에서 다룬다.

## 1. Act 3 결정

Act 3의 강의 부분은 좋은 업무 지시만으로 충분하지 않고, 김아이의 데스크 위에 어떤 자료를 올릴지 정해야 한다는 점을 설명한다.

Practice ID:

```text
act3-context-workbench
```

Act 3 설명 슬라이드에서 다루는 것:

- Act 2의 좋은 지시 회수
- 컨텍스트를 "김아이 데스크 위 자료"로 설명
- 필요한 자료와 오래된 오염 자료 구분
- 항상 지킬 규칙은 회사 규칙판으로 분리
- 별도 context-selection 실습 진입
- Act 4 반복 매뉴얼로 넘어가는 문제 열기

설명 슬라이드에서 금지하는 것:

- 컨텍스트 선택 UI, 렌더링 미리보기, 검증 로그 구현
- CLAUDE.md 파일 경로와 로딩 순서 상세 설명
- Skill, Agent, Hook 상세 설명

## 2. 핵심 메시지

```text
좋은 지시도 김아이 데스크 위 자료가 섞이면 결과가 엉킵니다.
```

## 3. 시간과 리듬

권장 설명 시간: 8-10분

권장 설명 슬라이드 수: 6장

리듬:

```text
Act 2 회수 -> 데스크 비유 -> 오염 자료 -> 회사 규칙판 -> 실습 진입 -> Act 4 브릿지
```

## 4. Slide List

### 3-1. 좋은 지시도 자료가 섞이면 흔들립니다

- Type: transition
- Headline: `좋은 지시도 자료가 섞이면 결과가 엉킵니다.`
- Anchors: `좋은 지시`, `섞인 자료`, `흔들린 결과`
- Visual: Act 2 지시서 옆에 현재 자료와 오래된 자료가 섞인 김아이 데스크
- Bridge: `데스크 위 자료가 다음 결과를 바꿉니다.`
- visualAssetId: `act3-mixed-desk`

### 3-2. 컨텍스트는 김아이 데스크 위 자료입니다

- Type: concept
- Headline: `컨텍스트는 김아이 데스크 위 자료입니다.`
- Anchors: `필수 자료`, `유용 자료`, `오염 자료`, `범위 밖`
- Visual: 김아이 데스크 위 자료를 필수, 유용, 오염, 범위 밖으로 구분한 손그림
- Bridge: `데스크 위에 오래된 자료가 있으면 문제가 생깁니다.`
- visualAssetId: `act3-context-desk`

### 3-3. 오래된 자료는 김아이를 현재 기준으로 착각하게 합니다

- Type: contrast
- Headline: `오래된 자료는 김아이를 현재 기준으로 착각하게 합니다.`
- Anchors: `폐기된 시안`, `초기 제목`, `미확정 정책`
- Visual: 현재 자료와 오염 자료가 섞인 비교 장면
- Bridge: `그래서 자료는 많이가 아니라 맞게 골라야 합니다.`
- visualAssetId: `act3-stale-컨텍스트`

### 3-4. 매번 지킬 규칙은 회사 규칙판에 둡니다

- Type: concept
- Headline: `매번 지킬 규칙은 회사 규칙판에 둡니다.`
- Anchors: `이번 자료`, `항상 규칙`, `치울 오염`
- Visual: 데스크 자료와 벽의 회사 규칙판이 분리된 장면
- Bridge: `이제 어떤 자료를 데스크에 올릴지 실습합니다.`
- visualAssetId: `act3-rule-board`

### 3-5. 실습에서는 김아이의 데스크 자료를 고릅니다

- Type: practice handoff
- Headline: `실습에서는 김아이의 데스크 자료를 고릅니다.`
- Anchors: `자료 선택`, `카드 생성`, `오염 분석`
- Visual: 실습 UI가 아니라 선택-생성-분석 3단계 카드
- Bridge: `첫 목표는 AI 하네스 워크숍 신청 카드 개선입니다.`
- nextPracticeId: `act3-context-workbench`

### 3-6. 자료를 잘 골라도 절차를 매번 다시 말하면 불안정합니다

- Type: bridge
- Headline: `자료를 잘 골라도 절차를 매번 다시 말하면 불안정합니다.`
- Anchors: `반복 질문`, `반복 기준`, `반복 출력`
- Visual: 같은 절차를 매번 말하는 상사와 지친 김아이
- Bridge: `다음 Act에서는 반복 절차를 매뉴얼로 빼냅니다.`
- visualAssetId: `act3-to-act4-manual`

## 5. Asset Requirements

Required visual assets:

```text
act3-mixed-desk
act3-context-desk
act3-stale-컨텍스트
act3-rule-board
act3-to-act4-manual
```

모든 이미지는 데스크, 자료, 규칙판, 오염 자료가 설명 가능해야 하며 실습 UI를 포함하지 않는다.

## 6. Additional Explanation Slides

### 3-7. 데스크 자료와 회사 규칙판은 역할이 다릅니다
- Function: 현실 비유
- Headline: `데스크 자료와 회사 규칙판은 역할이 다릅니다.`
- Anchors: `데스크 자료`, `회사 규칙판`, `치울 자료`
- Bridge: `둘이 섞이면 김아이는 무엇이 현재 기준인지 헷갈립니다.`

### 3-8. 이번 자료와 항상 규칙이 섞이면 기준이 흔들립니다
- Function: 작동 원리와 문제 조건
- Headline: `이번 자료와 항상 규칙이 섞이면 기준이 흔들립니다.`
- Anchors: `임시 자료`, `항상 규칙`, `오래된 자료`
- Bridge: `AI에서는 데스크 자료가 Context, 회사 규칙판이 Project Rules입니다.`

### 3-9. 데스크 자료는 Context, 규칙판은 Project Rules입니다
- Function: 실제 용어 연결
- Headline: `데스크 자료는 Context, 규칙판은 Project Rules입니다.`
- Anchors: `데스크 자료`, `Context`, `회사 규칙판`, `Project Rules`
- Bridge: `그래서 Act 3는 이번 자료와 항상 규칙을 나누는 시간입니다.`

### 3-10. Act 3는 이번 자료와 항상 규칙을 나누는 시간입니다
- Function: 실습 이유
- Headline: `Act 3는 이번 자료와 항상 규칙을 나누는 시간입니다.`
- Anchors: `올릴 자료`, `남길 규칙`, `치울 오염`
- Bridge: `다음 Act에서는 매번 반복되는 절차를 따로 빼냅니다.`
