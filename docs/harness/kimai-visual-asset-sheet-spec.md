# Kimai Visual Asset Sheet Spec

Generated: 2026-05-28

## Purpose

이 문서는 `신입 AI 김아이` 강의 덱에서 사용할 이미지 자산 시트의 정의서다.

현재 `generated-decks/kimai-act0-prototype`는 하네스 구조는 갖췄지만, 실제 이미지는 김아이 중심 여정 지도가 아니라 일반 워크플로우 아이콘에 가깝다. 따라서 `asset-review.json`은 의도적으로 `FAIL` 상태다.

이 문서의 목적은 다음 구현 단계에서 생성해야 할 이미지 자산을 명확히 정의하고, 생성된 이미지가 `asset-pack.semanticRequirements`와 `asset-review.json`을 통과할 수 있는 기준을 제공하는 것이다.

## Scope

### Included

- 김아이 캐릭터가 중심에 있는 이미지 시트 정의
- Act 0 전체 여정 지도용 crop 정의
- 이후 Act 1-6에서 재사용 가능한 이미지 영역 정의
- 각 이미지 영역의 teaching role, explanation anchors, semantic requirements
- 이미지 생성 프롬프트 작성 기준
- asset-review 통과 기준

### Excluded

- 실제 이미지 생성
- 이미지 파일 저장
- `asset-pack.json` 실제 변경
- `asset-review.json` PASS 변경
- 슬라이드 HTML 직접 수정

이 문서는 다음 작업의 기준 문서이며, 구현은 별도 단계에서 하네스 경로로 진행한다.

## Design Direction

이미지 스타일은 기존 `디자인.md`와 lecture-cuts 규칙을 따른다.

```text
white background
minimal black linework
one blue accent
hand-drawn lecture illustration
no photorealism
no gradient
no glossy treatment
no dark cinematic background
no decorative stock illustration
```

이미지는 장식이 아니라 발표자가 직접 짚으며 설명하는 teaching artifact여야 한다.

금지한다.

- 의미 없는 추상 도형
- 캐릭터 없는 일반 아이콘 나열
- 너무 작아서 발표장에서 구분되지 않는 라벨
- 배경 분위기만 있고 강의 개념이 보이지 않는 이미지
- 사진풍, 3D 렌더, 네온, 글로우, glass, 과한 그림자

## Core Visual Metaphor

김아이는 빠르고 성실한 AI 신입사원이다. 하지만 회사 맥락, 팀 규칙, 완료 기준을 스스로 알지는 못한다.

이미지 시트는 이 메시지를 계속 반복해서 보여줘야 한다.

```text
김아이는 혼자 똑똑해서 잘하는 것이 아니라,
좋은 업무 환경 안에 들어왔을 때 안정적으로 일한다.
```

따라서 모든 핵심 이미지에는 다음 중 최소 하나가 보여야 한다.

- 김아이
- 상사 또는 업무 요청자
- 업무 지시서
- 자료/맥락 더미
- 회사 규칙판
- 반복 업무 매뉴얼
- 역할이 나뉜 팀
- 도구와 권한
- 검증 게이트
- 결과물/완료 확인

## Primary Image Sheet

### Asset ID

```text
kimai-work-environment-sheet
```

### Intended Use

이 시트는 Act 0-6에서 필요한 주요 이미지를 한 번에 생성하고, `crop-region`으로 실제 파일 분할해서 사용하기 위한 원본이다.

시트는 16:9 비율로 만든다.

권장 구성:

```text
top row: 김아이 전체 여정 지도
middle row: Act 1-3 핵심 장면 4개
bottom row: Act 4-6 핵심 장면 5개
```

### Required Sheet Regions

| Region ID | Purpose | Used In |
|---|---|---|
| `kimai-journey-map` | 전체 강의 여정 지도 | Act 0 |
| `kimai-bad-brief` | 대충 시킨 업무 지시와 추측 결과 | Act 1 |
| `kimai-good-brief` | 목표, 조건, 완료 기준이 있는 좋은 지시 | Act 2 |
| `kimai-context-desk` | 필요한 자료와 오염 자료가 섞인 작업대 | Act 3 |
| `kimai-rule-board` | 반복 규칙을 회사 규칙판으로 분리 | Act 3 |
| `kimai-skill-manual` | 반복 업무 매뉴얼 조립 | Act 4 |
| `kimai-agent-team` | 역할이 나뉜 김아이 팀 | Act 5 |
| `kimai-tool-permission` | 도구와 권한을 좁혀 연결 | Act 5 |
| `kimai-stop-hook-gate` | 완료 전 자동 검문소 | Act 6 |
| `kimai-evaluation-harness` | 채점표, 판정관, 결과 리포트 | Act 6 |

## Region Specs

### 1. `kimai-journey-map`

#### Teaching Role

김아이를 중심으로 업무 지시, 자료/맥락, 회사 규칙, 업무 매뉴얼, 역할 분리, 도구 권한, 검증 게이트가 연결된다는 전체 여정을 설명한다.

#### Must Show

- 김아이 또는 AI 신입사원이 중앙에 있다.
- 상사 또는 업무 요청자가 왼쪽에서 업무를 준다.
- 업무 지시서가 첫 단계로 보인다.
- 자료/맥락 더미가 업무 지시와 별도 요소로 보인다.
- 회사 규칙판 또는 반복 규칙이 별도 요소로 보인다.
- 업무 매뉴얼 또는 Skill 책자가 보인다.
- 역할이 나뉜 작은 팀 또는 분리된 작업 모자가 보인다.
- 도구/권한 연결이 보인다.
- 완료 전 검증 게이트와 체크 표시가 마지막에 보인다.

#### Must Not Show

- 김아이 없이 일반 아이콘만 일렬로 나열된 워크플로우
- 추상적 도형만 있는 프로세스 다이어그램
- 어두운 미래형 관제실
- 설명할 요소가 없는 장식 배경

#### Explanation Anchors

- 김아이는 빠르지만 회사 맥락은 모른다.
- 지시, 자료, 규칙, 매뉴얼은 서로 다른 역할이다.
- 역할과 도구를 나누면 판단이 덜 섞인다.
- 완료는 말이 아니라 검증 게이트로 확인한다.
- 오늘 4시간 동안 이 환경을 하나씩 만든다.

#### Teaching Questions

- 슬라이드의 글과 함께 볼 때 오늘 배울 전체 흐름을 30초 안에 설명할 수 있는가?
- 그림이 맡은 설명 구간은 그림만 보고도 말할 수 있을 만큼 구체적인가?
- 지시, 자료, 규칙, 매뉴얼, 검증이 서로 다른 요소로 보이는가?
- 김아이가 중심에 있어 신입 AI 비유가 유지되는가?

#### Minimum Pass Score

```text
85
```

### 2. `kimai-bad-brief`

#### Teaching Role

상사가 “알아서 예쁘게 만들어줘”라고 말했을 때 김아이가 빈칸을 추측하고 엉뚱한 결과를 만드는 장면이다.

#### Must Show

- 상사의 모호한 말풍선
- 당황하거나 추측하는 김아이
- 서로 다른 방향으로 갈라지는 결과 후보
- 완료 기준이 비어 있는 표시

#### Must Not Show

- 김아이가 정확히 이해한 것처럼 보이는 장면
- 성공 완료 체크만 있는 장면

#### Explanation Anchors

- 모호한 지시는 김아이에게 추측 일을 시킨다.
- 빠진 조건이 많을수록 결과는 운에 가까워진다.
- Act 1 실습은 무엇을 넣어야 하는지 고르는 진단이다.

#### Minimum Pass Score

```text
80
```

### 3. `kimai-good-brief`

#### Teaching Role

목표, 대상, 조건, 완료 기준, 출력 형식이 들어간 업무 지시가 김아이의 행동을 안정시키는 장면이다.

#### Must Show

- 잘 정리된 업무 지시서
- 목표, 대상, 조건, 완료 기준이 구분된 체크 영역
- 김아이가 지시서를 보고 작업을 시작하는 모습
- 결과물 미리보기 카드

#### Must Not Show

- 긴 대본처럼 빽빽한 문서
- 프롬프트 문장만 크게 있는 이미지

#### Explanation Anchors

- 좋은 프롬프트는 긴 문장이 아니라 빠진 판단을 줄이는 업무 지시서다.
- 완료 기준이 있어야 결과를 비교할 수 있다.
- Act 2 실습은 직접 프롬프트를 써 보고 점수와 결과물을 확인한다.

#### Minimum Pass Score

```text
80
```

### 4. `kimai-context-desk`

#### Teaching Role

김아이의 작업대에 지금 필요한 자료, 항상 필요한 규칙, 필요할 때만 볼 자료, 제거해야 할 오염 자료가 섞여 있는 장면이다.

#### Must Show

- 김아이의 책상 또는 작업대
- 여러 자료 카드가 섞여 있다.
- 일부 자료에는 오래됨, 충돌, 불필요함을 암시하는 표시가 있다.
- 선택한 자료에 따라 결과물이 달라질 수 있음을 암시한다.

#### Must Not Show

- 모든 자료가 너무 명확하게 좋거나 나쁜 자료로 보이는 장면
- 단순 파일 폴더 아이콘만 나열된 장면

#### Explanation Anchors

- 컨텍스트는 많이 넣는 것이 아니라 지금 필요한 것을 고르는 일이다.
- 오래된 자료는 김아이를 오염시킨다.
- Act 3 실습은 선택한 자료로 실제 결과물을 만들고 차이를 본다.

#### Minimum Pass Score

```text
80
```

### 5. `kimai-rule-board`

#### Teaching Role

매번 반복해서 말해야 하는 회사 규칙을 김아이 옆 규칙판에 고정하는 장면이다.

#### Must Show

- 회사 규칙판
- 반복 실수 예시
- 고정 규칙 3개
- 김아이가 규칙판을 참고하는 모습

#### Must Not Show

- CLAUDE.md 같은 도구명만 크게 보이는 장면
- 개발자 설정 파일처럼 보이는 코드 화면

#### Explanation Anchors

- 초반에는 도구명이 아니라 회사 규칙판으로 설명한다.
- 매번 말할 규칙은 프롬프트 밖에 둔다.
- 나중에 Claude Code에서는 이런 규칙판을 CLAUDE.md로 연결한다.

#### Minimum Pass Score

```text
80
```

### 6. `kimai-skill-manual`

#### Teaching Role

반복되는 업무 절차를 Skill, 즉 업무 매뉴얼로 조립하는 장면이다.

#### Must Show

- 업무 매뉴얼 책자 또는 카드 조립
- 트리거, 절차, 예시, 검증 항목이 구분된다.
- 김아이가 매번 새로 묻지 않고 매뉴얼을 펴 보는 모습

#### Must Not Show

- 마법 능력처럼 보이는 슈퍼파워 표현
- 코드만 가득한 개발자용 문서

#### Explanation Anchors

- Skill은 반복 업무 매뉴얼이다.
- 좋은 매뉴얼은 언제 쓰는지, 어떤 순서인지, 어떻게 확인하는지를 포함한다.
- Act 4 실습은 자료조사 Skill을 직접 작성하고 검증한다.

#### Minimum Pass Score

```text
80
```

### 7. `kimai-agent-team`

#### Teaching Role

한 명의 김아이가 모든 판단을 맡는 대신, 구현자, 리뷰어, 리서처, 보안 담당자로 역할을 나누는 장면이다.

#### Must Show

- 중앙의 김아이 또는 팀 리더
- 역할이 다른 3-4명의 작은 에이전트
- 각 역할이 가진 정보와 도구가 다르다.
- 역할 사이에 검토 흐름이 있다.

#### Must Not Show

- 단순히 캐릭터가 여러 명 복제된 장면
- 역할 차이가 보이지 않는 팀 그림

#### Explanation Anchors

- Agent는 단순히 많이 만드는 것이 아니라 판단 공간을 나누는 것이다.
- 역할마다 필요한 정보와 도구가 다르다.
- Act 5 실습은 로컬에서 김아이 팀을 구성해 실행해 본다.

#### Minimum Pass Score

```text
80
```

### 8. `kimai-tool-permission`

#### Teaching Role

김아이 팀이 필요한 도구를 쓰되, 역할별로 권한을 좁혀 연결하는 장면이다.

#### Must Show

- 도구 상자 또는 외부 서비스 연결
- 역할별 권한 배지
- 허용된 도구와 막힌 도구의 차이
- 과도한 권한을 막는 잠금 표시

#### Must Not Show

- 모든 도구가 무제한 연결된 장면
- 보안 위험을 긍정적으로 보이게 하는 장면

#### Explanation Anchors

- MCP와 도구 연결은 편의가 아니라 권한 설계 문제다.
- 역할별로 필요한 도구만 연결해야 한다.
- 일반인에게는 도구 연결보다 권한 범위가 핵심이다.

#### Minimum Pass Score

```text
80
```

### 9. `kimai-stop-hook-gate`

#### Teaching Role

작업 종료 전 자동 검문소가 빠진 작업, 미완료 상태, 추가 작업 필요 여부를 확인하는 장면이다.

#### Must Show

- 완료 직전의 검문소
- 상태 표시: processing / complete
- 빠진 항목 체크리스트
- 통과하면 완료, 막히면 다시 작업으로 돌아가는 루프

#### Must Not Show

- 무한 반복처럼 보이는 장면
- 검증 없이 바로 완료 체크만 있는 장면

#### Explanation Anchors

- Stop hook은 완료라고 말하기 전에 마지막 확인을 한다.
- 할 일이 남아 있으면 다시 작업으로 돌려보낸다.
- complete 상태가 되면 멈춰야 무한 반복을 막는다.

#### Minimum Pass Score

```text
80
```

### 10. `kimai-evaluation-harness`

#### Teaching Role

결과물을 채점표, 기계 규칙, LLM 판정관, 결과 리포트로 검증하는 하네스 구조를 보여준다.

#### Must Show

- 사용자 입력
- 규칙 기반 채점표
- LLM 판정관
- 결과 미리보기
- 피드백 리포트
- 검증 로그

#### Must Not Show

- 점수만 있고 이유가 없는 장면
- AI 판정관이 단독 최종 권한을 가진 것처럼 보이는 장면

#### Explanation Anchors

- 하네스는 결과만 보여주는 것이 아니라 어떻게 검증했는지도 보여준다.
- 기계 채점과 LLM judge의 역할은 분리한다.
- 최종 목표는 재시도 가능한 피드백 루프다.

#### Minimum Pass Score

```text
80
```

## Image Generation Prompt Contract

이미지 생성 프롬프트는 반드시 다음 구조를 가진다.

```xml
<image_instruction>
Create a single 16:9 hand-drawn lecture illustration sheet for a Korean general-audience AI workshop.
</image_instruction>

<style_constraints>
white background; minimal black linework; one blue accent; hand-drawn lecture illustration; no photorealism; no gradients; no glossy treatment; no dark cinematic background
</style_constraints>

<main_character>
Kimai is a friendly AI new employee. Kimai should be visually recognizable across all regions: small rounded robot or office new-hire character, simple face, blue accent.
</main_character>

<sheet_layout>
Top row: full journey map centered on Kimai.
Middle row: bad brief, good brief, context desk, rule board.
Bottom row: skill manual, agent team, tool permissions, stop hook gate, evaluation harness.
</sheet_layout>

<teaching_requirement>
Each region must be explainable while presenting. The viewer should be able to point at visible elements and explain the concept without reading a script.
</teaching_requirement>

<forbidden>
Do not create generic icons without Kimai. Do not use neon, glow, 3D, cinematic darkness, stock illustration style, or abstract process diagrams.
</forbidden>
```

## Asset-Pack Target Structure

구현 시 `asset-pack.json`은 다음 구조로 이동한다.

```json
{
  "id": "kimai-work-environment-sheet",
  "kind": "single-image",
  "status": "generated",
  "sourcePath": "lecture-cuts/assets/generated/kimai-work-environment-sheet.png",
  "teachingRole": "Act 0-6 김아이 업무 환경 이미지를 잘라 쓰기 위한 원본 이미지 시트",
  "generationPrompt": "Use the XML prompt contract from docs/harness/kimai-visual-asset-sheet-spec.md#image-generation-prompt-contract.",
  "styleConstraints": [
    "white background",
    "minimal black linework",
    "one blue accent",
    "hand-drawn lecture illustration",
    "no photorealism",
    "no gradient",
    "no glossy treatment"
  ],
  "explanationAnchors": [
    "김아이 중심",
    "업무 환경 구성",
    "Act별 crop region",
    "반복 가능한 이미지 자산 관리"
  ],
  "semanticRequirements": {
    "mustShow": [
      "김아이 또는 AI 신입사원이 중심에 있어야 한다",
      "Act 0-6의 주요 업무 환경 요소가 분리되어 보여야 한다",
      "각 crop region이 발표 중 설명 가능한 시각 요소를 가져야 한다"
    ],
    "mustNotShow": [
      "김아이 없이 일반 아이콘만 나열된 워크플로우",
      "강의 내용과 무관한 장식용 배경",
      "발표자가 설명할 수 없는 추상 도형"
    ],
    "teachingQuestions": [
      "이 시트에서 Act 0-6의 이미지 자산을 잘라 쓸 수 있는가?",
      "각 영역이 김아이 세계관을 유지하는가?"
    ],
    "minimumPassScore": 85
  },
  "alt": "김아이 업무 환경 이미지 시트",
  "notes": "Generated source sheet for Kimai-centered lecture visuals."
}
```

각 crop asset은 `sourceAssetId: "kimai-work-environment-sheet"`를 참조한다.

## Review Contract

이미지 생성 후 `asset-review.json`은 최소 다음 항목을 만족해야 한다.

```text
reviewedAt: YYYY-MM-DD
reviewMethod: manual-visual-inspection 또는 llm-vision-review
assets[].status: PASS
assets[].score: minimumPassScore 이상
mustShowResults: 모든 mustShow 항목이 PASS
forbiddenElementFindings: 모든 mustNotShow 항목이 observed=false
```

`kimai-journey-map`이 PASS가 되려면 다음 판단이 가능해야 한다.

```text
1. 김아이가 중심 캐릭터로 보인다.
2. 일반 워크플로우 아이콘 나열이 아니다.
3. 지시, 자료, 규칙, 매뉴얼, 역할, 도구, 검증이 서로 다른 시각 요소다.
4. 발표자가 슬라이드의 글과 그림을 함께 보며 해당 슬라이드의 설명을 진행할 수 있다.
5. 그림으로 설명해야 하는 구간은 그림 안의 요소만 짚어도 말할 수 있을 만큼 구체적이다.
6. 1024px 프로젝터 화면에서도 주요 요소가 보인다.
```

## Implementation Handoff

다음 구현 작업은 이 문서 기준으로 진행한다.

권장 순서:

1. `asset-pack.json`에 `kimai-work-environment-sheet`와 `kimai-journey-map` crop asset을 추가한다.
2. 이미지 생성 프롬프트를 이 문서의 XML 구조로 만든다.
3. 이미지 생성 후 `sourcePath`에 저장한다.
4. crop region을 지정하고 `build-deck-from-spec`로 실제 분할 파일을 생성한다.
5. `asset-review.json`을 작성한다.
6. `verify-deck-quality`가 PASS하는지 확인한다.
7. Playwright로 `deck.html`과 `presenter-review.html`을 시각 확인한다.

## Completion Criteria

이 스펙은 다음 조건을 만족할 때 구현 완료로 본다.

- `kimai-journey-map`이 현재 generic workflow 이미지를 대체한다.
- `asset-review.json`에서 `kimai-journey-map`이 PASS다.
- `verify-deck-quality`가 visual semantic review를 포함해 PASS한다.
- Act 0 예제 슬라이드에서 발표자가 화면의 글과 그림을 함께 보며 전체 강의 여정을 설명할 수 있다.
- 그림이 담당하는 설명 구간은 발표자가 그림 안의 요소를 짚는 것만으로 설명할 수 있다.
- 화면에 보이는 이미지는 김아이 중심이며, 일반 아이콘 나열로 보이지 않는다.
