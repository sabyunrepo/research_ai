# Lecture Cuts Korean Copy Review

Date: 2026-05-25
Scope: `lecture-cuts` 87-slide HTML deck, presenter scripts, and slide/script alignment
Method: three read-only reviewer agents plus local Korean copy audit harness

## Summary

### 발견

이번 검토의 핵심 문제는 단순 맞춤법보다 강의 전달 품질입니다.

- 화면 문구는 전반적으로 읽히지만 `Context/context/컨텍스트`, `Persona/persona/페르소나`, `deck/spec/slide spec/명세`, `Hook/훅`, `handoff/이어받기`가 섞여 있습니다.
- 발표자 스크립트는 87장 모두 채워져 있지만, 생성형 템플릿 문장인 "이 장의 핵심은...", "화면에서는 ...를 먼저 짚습니다", "발표자는 이 내용을...", "다음 장..." 패턴이 반복됩니다.
- 슬라이드와 대본의 주제는 대체로 맞지만, `Final Workflow`, `MCP`, `Evaluation`, `Skill` 구간은 화면이 구체적인 파일명과 예시를 보여주는 데 비해 대본이 일반론으로 남는 곳이 있습니다.
- 로컬 하네스 기준으로 치명 오류는 없고, 긴 제목/문장과 용어 혼용만 `WARN`으로 잡혔습니다.

### 수행

세 축으로 나누어 병렬 검토했습니다.

- 화면 문구 교정 에이전트: `lecture-cuts/*.html`의 제목, 부제, bullet, note, 프리뷰 문구를 검토했습니다.
- 발표자 스크립트 문장 검증 에이전트: `lecture-cuts/assets/slides.js`의 87개 `speaker.heading/html`을 검토했습니다.
- 슬라이드-스크립트 정합성 에이전트: HTML 화면의 핵심 bullet, note, code 예시와 presenter script 의미를 대조했습니다.

추가로 `scripts/audit-lecture-cuts-korean-copy.js`를 추가해 긴 제목, 긴 bullet, 긴 발표 문장, 영문/한국어 용어 혼용, 기본 띄어쓰기 후보, 인접 문장 시작 반복을 기계적으로 점검하도록 했습니다. 이 감사 스크립트는 `scripts/verify-lecture-cuts-harness.js`에도 연결했습니다.

### 판단

교정 우선순위는 아래 순서가 맞습니다.

1. 발표자 스크립트의 생성 템플릿 문장을 실제 구어체 원고로 재작성합니다.
2. 화면 문구의 핵심 용어 표기를 고정합니다. 공식 제품명과 명령어는 유지하되, 설명어는 한국어로 통일합니다.
3. 슬라이드가 구체 예시를 보여주는 구간은 대본도 같은 파일명, 체크 항목, 실습값을 직접 언급하도록 보강합니다.
4. Final 섹션은 슬라이드 순서와 대본 연결 문장을 함께 재검토합니다.

### 미해결

초기 검토 뒤 1차 적용으로 핵심 화면 문구와 발표자 스크립트 일부를 같은 변경 단위로 수정했습니다. 남은 항목은 긴 제목, 긴 발표 문장, 일부 용어 혼용 같은 비차단 편집 후보입니다. 다음 단계에서도 한쪽만 바꾸지 않고, HTML 슬라이드 문구와 `assets/slides.js`의 발표자 스크립트를 같은 변경 단위로 관리해야 합니다.

## Local Harness Result

Command:

```bash
node --check scripts/audit-lecture-cuts-korean-copy.js && node scripts/audit-lecture-cuts-korean-copy.js
```

Result:

- `WARN long visible titles`: 5 slides after the first applied pass
- `WARN long subtitles`: 1 slide
- `PASS long bullet lines`: 0 after the first applied pass
- `WARN long speaker sentences`: 1 sentence
- `WARN mixed Korean/English terms`: 7 reported examples after the first applied pass
- `PASS spacing candidates`: 0
- `PASS duplicate adjacent sentence starts`: 0

## High-Priority Fix Candidates

| Area | File | Current issue | Recommended direction |
| --- | --- | --- | --- |
| 화면 문구 | `18-1-mcp-bridge.html` | "Host app", "MCP client", "server"가 한 문장에 섞임 | "호스트 앱", "MCP 클라이언트", "서버"처럼 설명어를 한국어화 |
| 화면 문구 | `06-1-good-few-shot.html` | `deck slide spec`, `source/layout/visual/verification`가 초심자에게 딱딱함 | "덱 슬라이드 명세", "원본/레이아웃/시각 기준/검증 기준"으로 풀기 |
| 화면 문구 | `05-2-persona-rubric.html` | `Persona/persona/페르소나` 혼용 | 본문 표기는 "페르소나"로 통일하고 공식 개념 소개 때만 원문 병기 |
| 화면 문구 | `09-1-context-budget.html` | 제목의 `Context`와 본문 표기가 섞임 | "컨텍스트" 중심으로 통일 |
| 화면 문구 | `14-3-research-subagent-example.html` | `main`, `tradeoff`가 내부 메모처럼 보임 | "메인 에이전트", "더 나은 선택지/절충점"으로 교정 |
| 화면 문구 | `21-4-team-retrospective.html` | "AI가 두 번 이상 틀린 것"이 회고 문장으로 거침 | "AI가 두 번 이상 반복한 실수"로 구체화 |
| 발표 스크립트 | 다수 | "이 장의 핵심은...", "다음 장..." 전환문 반복 | 슬라이드별 첫 문장과 전환문을 실제 강의 흐름으로 재작성 |
| 발표 스크립트 | `05-1-persona-weak.html` | 겹따옴표와 제목 반복으로 구어체 어색함 | "'시니어처럼 해줘'라는 말은 너무 넓습니다."처럼 바로 말하기 |
| 발표 스크립트 | `19-3-human-checks.html` | "배포 승인를" 조사 오류 | "배포 승인처럼 사람이 결정해야 하는 지점"으로 수정 |
| 발표 스크립트 | `21-9-practice-personal-harness.html` | "마무리 AI가..."로 잘못 붙어 읽힘 | "마무리에서는 'AI가 두 번 이상 틀린 행동...' 기준을 확인합니다." |
| 정합성 | `10-skills.html` | 화면의 `description`, `본문`, `references` bullet을 대본이 직접 설명하지 않음 | 세 bullet의 역할을 대본에 추가 |
| 정합성 | `18-mcp.html` | 화면 예시인 `GitHub`, `DB`, `Slack`, `Browser`가 대본에 부족함 | 실무 연결 예시를 대본에 직접 언급 |
| 정합성 | `19-evaluation.html` | `reviewer`, `LLM-as-judge`, `rubric`이 대본에서 뭉뚱그려짐 | 세 검증 축을 직접 설명 |
| 정합성 | `21-1-final-artifact-structure.html` | `lecture-deck/`와 `.claude/skills/` 경계가 대본에 빠짐 | 워크숍 산출물과 실제 설치 경로 차이를 설명 |
| 정합성 | `21-2-bug-request-flow.html` | `source.md`, `slide-spec.json`, `few-shots.md`, `deck-builder Skill` 순서가 대본에서 약함 | 파일명 기반 workflow를 대본에 고정 |
| 정합성 | `21-6-handoff-template.html` | HANDOFF 템플릿 항목을 대본이 일반론으로 설명 | `Current State`, `Decisions`, `Verification`, `Remaining Work`, `Next Prompt`를 예시와 함께 설명 |

## Rewrite Plan

### 1. 용어 표기 기준 고정

수정 전에 용어표를 먼저 정합니다. 예시는 아래 기준을 권장합니다.

- `Skill`: 첫 등장 "Skill(스킬)", 이후 "Skill" 또는 "스킬" 중 하나로 고정
- `Hook`: 첫 등장 "Hook(훅)", 이후 자동화 개념이면 "Hook", 구어 설명이면 "훅" 중 하나로 고정
- `Context`: "컨텍스트"로 통일
- `Persona`: "페르소나"로 통일
- `Subagent`: 첫 등장 "Subagent(서브에이전트)", 이후 한 표기로 통일
- `spec`: 설명 문맥에서는 "명세", 파일명이나 코드에서는 원문 유지
- `handoff`: 문서명은 `HANDOFF.md`, 개념 설명은 "이어받기"

### 2. 발표자 스크립트 템플릿 제거

`assets/slides.js`의 speaker script를 섹션 단위로 재작성합니다. 특히 "발표자는", "대본은", "화면에서는 ...를 먼저 짚습니다"처럼 제작 메모로 들리는 문장은 실제 청중에게 말하는 문장으로 바꿉니다.

### 3. 화면-대본 동시 수정 원칙

슬라이드 HTML 문구를 바꾸면 같은 변경에서 presenter script도 함께 바꿉니다. 반대로 대본에 새 개념이나 파일명을 넣으면 화면 bullet/note가 그 내용을 뒷받침하는지 확인합니다.

수정 단위는 아래처럼 묶습니다.

- 화면 문구만 바뀌는 경우: HTML 수정 후 `assets/slides.js`의 같은 슬라이드 speaker 문구를 검토합니다.
- 대본만 바뀌는 경우: `assets/slides.js` 수정 후 HTML의 제목, bullet, note와 의미가 어긋나지 않는지 확인합니다.
- 순서가 바뀌는 경우: HTML 파일 순서, `assets/slides.js`, `slide-spec.json`, source map, handoff 문서를 함께 갱신합니다.

### 4. 정합성 취약 구간 우선 보강

1차 수정 대상은 `10-skills.html`, `18-mcp.html`, `19-evaluation.html`, `21-1-final-artifact-structure.html`, `21-2-bug-request-flow.html`, `21-6-handoff-template.html`, `21-8-practice-handoff.html`입니다. 이 구간은 실습 workflow를 직접 가르치므로 대본이 화면의 파일명과 체크 항목을 놓치면 수강생이 실제 작업 순서를 잘못 가져갈 수 있습니다.

### 5. 검증 게이트

수정 후 아래 순서로 검증합니다.

```bash
node scripts/audit-lecture-cuts-korean-copy.js
node scripts/audit-lecture-cuts-speaker-sync.js
node scripts/verify-lecture-cuts-harness.js
```

브라우저에서는 `presenter-review.html`로 발표자 스크립트를 보고, `deck.html`로 실제 슬라이드 줄바꿈과 overflow를 확인합니다.
