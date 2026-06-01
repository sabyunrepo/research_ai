# Context Research Pack

Status: PASS
Task: 김아이 워크숍 덱의 일반인 대상 발표 스크립트 생성과 편집 UI 구현
Artifact owner: Codex
Created: 2026-06-01
Updated: 2026-06-01
Project root: /Users/sabyun/goinfre/research_ai
Brainstorming phase: both
Recommended next action: generated script를 presenter가 직접 읽어 보고 표현만 조정한다.

## 1. Context Triage

### Task Classification

| field | value |
|---|---|
| 작업 유형 | deck/report material + code implementation |
| 예상 산출물 | presentation-script.json, presentation-script.md, script editor server, verifier |
| 위험도 | medium |
| 최신성 필요 | yes |
| 로컬 조사 필요 | yes |
| 외부 검색 필요 | yes |
| 라이브러리/API 문서 필요 | no |
| PPT/deck/report 자료 필요 | yes |
| high-stakes domain | no |

### Tool Detection

| tool | available | used | fallback | note |
|---|---:|---:|---|---|
| local search | yes | yes | n/a | `rg`, `find`, `node`로 deck contract 확인 |
| web search | yes | yes | local sources | 접근성/발표 노트 원칙 확인 |
| Context7 | no | no | official docs / package docs | 라이브러리 추가 없음 |
| docs/parser tool | yes | yes | local text extraction | JSON/HTML 직접 파싱 |
| browser/screenshot | yes | no | static/API verification | 렌더 변경이 아니라 편집 서버 API 중심 |

### Must-Read Context

| path/source | why it matters | status |
|---|---|---|
| `AGENTS.md` | context research와 verification 산출물 위치 규칙 | read |
| `deck-harness/AGENTS.md` | generated deck, speaker note, slide quality contract | read |
| `docs/harness/kimai-content/AGENTS.md` | 김아이 비유, Act topic map, 일반인 대상 scope | read |
| `generated-decks/kimai-workshop-content/slide-spec.json` | 76장 슬라이드의 원천 메시지와 notes | read |
| `deck-harness/templates/assets/presenter-review.js` | 기존 presenter note 노출 방식 | read |

### Pre-Brainstorm Notes

- 김아이 덱은 이미 76장 모두 `speakerNote`와 `presenterCues`를 가진다.
- 사용자 요청은 단순 notes 확인이 아니라 슬라이드별 원고형 발표 스크립트와 수정 가능한 UI다.
- 정식 화면 덱에 긴 대본을 넣으면 가독성/프로젝터 계약을 깨므로 별도 `presentation-script.*` 산출물이 적합하다.

### Questions For Brainstorming

- 별도 편집 UI를 정적 HTML로 둘지, 저장 가능한 로컬 Node 서버로 둘지 결정해야 한다.

## 2. Brainstorming Summary

### Agreed Goal

김아이 덱의 전체 흐름과 각 슬라이드 메시지를 읽어 일반인 대상 발표자가 말할 수 있는 스크립트를 만들고, 프로젝트 루트에서 덱을 선택해 수정/저장할 수 있게 한다.

### Chosen Direction

`slide-spec.json`을 source of truth로 삼아 `presentation-script.json`과 `presentation-script.md`를 생성하고, 로컬 Node 서버가 `generated-decks/*/presentation-script.json`을 편집/저장한다.

### Rejected Alternatives

| alternative | why rejected |
|---|---|
| `speakerNote`만 길게 덮어쓰기 | 기존 deck contract는 짧은 speaker note와 presenter cue를 요구하며, 원고형 스크립트와 역할이 다르다. |
| 정적 HTML textarea만 제공 | 브라우저에서 파일 저장이 불안정하고 프로젝트 루트 산출물로 남기기 어렵다. |
| 새 프론트엔드 의존성 도입 | Node 기본 모듈만으로 충분하고, repo에 별도 앱 빌드 체인을 늘릴 이유가 없다. |

### Research Questions After Brainstorming

- 일반인 대상 발표 스크립트는 어떤 품질 기준을 가져야 하는가?
- 접근성 관점에서 speaker notes/script를 어떻게 다뤄야 하는가?
- 이 repo에서 스크립트와 편집 UI는 어떤 레이어에 위치해야 하는가?

## 3. Targeted Research

### Search Plan

| research question | query family | example queries | source target | status |
|---|---|---|---|---|
| 발표 스크립트 접근성 기준 | accessible speaker notes | `accessible presentations speaker notes script transcript` | official | searched |
| 일반인 대상 발표 언어 | plain language presentation | `presentation notes clear simple language audience` | official | searched |
| 성인 학습자 대상 설명 | adult learning relevance | `adult learning principles relevant immediate application` | secondary | searched |
| 로컬 구현 위치 | deck harness speaker script | `speakerNote presenterCues presentation-script local` | local | searched |
| 편집 UI 저장 방식 | local editor persistence | `node http local json editor save generated deck script` | local | searched |

### Search Iterations

| iteration | query families used | new evidence found | unresolved questions | next action |
|---|---|---|---|---|
| 1 | accessible speaker notes, plain language, adult learning, local deck contract | speaker notes는 공유 가능한 접근성 자료가 될 수 있고, 쉬운 언어/핵심 요약/사전 자료 제공이 중요함 | 편집 저장 방식 | search again |
| 2 | local editor persistence, deck harness implementation | 정적 HTML보다 Node local server가 repo 파일 저장에 적합하고 새 의존성이 필요 없음 | 없음 | stop |

### Evidence Table

| claim id | claim | evidence | source id(s) | source type | checked date | confidence | relevance |
|---|---|---|---|---|---|---|---|
| C1 | 발표 스크립트는 화면 슬라이드가 아니라 speaker notes/별도 자료로 분리하는 것이 적합하다. | TMU 접근성 가이드는 speaker notes에 script를 포함하면 접근 가능한 handout을 만들 수 있다고 설명한다. | S1 | official | 2026-06-01 | high | 높음 |
| C2 | 일반인 대상 발표는 쉬운 언어와 큰 핵심 메시지를 우선해야 한다. | University at Buffalo 접근성 문서는 모든 청중이 이해하기 쉬운 clear/simple language와 speaker notes 활용을 권장한다. | S2 | official | 2026-06-01 | high | 높음 |
| C3 | 발표 시작/활동 안내/자료 사전 제공은 접근성과 이해도를 높인다. | UC Merced presenter guidance는 발표 시작/종료 안내와 활동 계획 안내, 사전 자료 제공을 권장한다. | S3 | official | 2026-06-01 | high | 중간 |
| C4 | 김아이 deck contract는 긴 대본을 projector slide에 넣지 않고 speaker note/presenter review로 분리한다. | `deck-harness/AGENTS.md`는 화면에는 긴 대본을 넣지 말고 speaker note와 presenter navigation을 분리하라고 규정한다. | S4 | local | 2026-06-01 | high | 높음 |
| C5 | 김아이 덱은 76장 모두 기본 speaker note와 presenter cues가 있어 원고형 확장 입력으로 사용할 수 있다. | `slide-spec.json` 파싱 결과 slides=76, withSpeakerNote=76, withPresenterCues=76. | S5 | local | 2026-06-01 | high | 높음 |

### Sufficiency Check

| criterion | status | evidence / note |
|---|---|---|
| enough distinct query families used | pass | 접근성, 쉬운 언어, 성인 학습, 로컬 contract를 분리 조사 |
| official/primary sources checked | pass | 대학 접근성 가이드 3개 확인 |
| local project context checked when relevant | pass | AGENTS, deck harness, slide spec 확인 |
| implementation/example evidence checked when relevant | pass | 기존 presenter-review와 build script 구조 확인 |
| risk/limitation/deprecation checked | pass | 외부 라이브러리 없이 Node 기본 모듈 사용 |
| contradictions or uncertainty recorded | pass | full script를 화면에 넣는 방식은 로컬 규칙과 충돌하므로 배제 |
| stop condition is explicit | pass | 구현 결정에 필요한 기준이 모두 채워져 stop |

### Stop Condition

- 스크립트를 별도 산출물로 둘 근거, 일반인 대상 언어 기준, 로컬 deck contract, 구현 위치가 모두 확인되어 조사 종료.

### Limiting Constraint

| constraint type | evidence / note |
|---|---|
| none | Web/local search 가능. Context7은 필요 없음. |

### Research State Snapshot

| state item | value |
|---|---|
| research questions tracked | 3 |
| searched query families | 5 |
| sources reviewed | 5 |
| official/primary/local sources used | S1, S2, S3, S4, S5 |
| unresolved questions | 없음 |
| synthesis status | complete |

### Source Ledger

| source id | title | url/path | source type | checked date | used by claims |
|---|---|---|---|---|---|
| S1 | How to create accessible presentations | https://www.torontomu.ca/accessibility/guides-resources/document-accessibility/presentations.html | official | 2026-06-01 | C1 |
| S2 | PowerPoint Accessibility | https://www.buffalo.edu/access/digital/content/documents/ppt.html | official | 2026-06-01 | C2 |
| S3 | Communication Considerations for Presenters | https://accessibility.ucmerced.edu/resources/planning-accessible-events/communication-considerations-presenters | official | 2026-06-01 | C3 |
| S4 | Deck Harness Instructions | `deck-harness/AGENTS.md` | local | 2026-06-01 | C4 |
| S5 | Kimai slide spec | `generated-decks/kimai-workshop-content/slide-spec.json` | local | 2026-06-01 | C5 |

### Claim Support Check

| claim id | source id | support verdict | evidence locator / quote summary | reviewer note |
|---|---|---|---|---|
| C1 | S1 | supported | speaker notes can include script for accessible handout | 직접 지원 |
| C2 | S2 | supported | clear/simple language and notes guidance | 직접 지원 |
| C3 | S3 | supported | event opening and planned activity notice | 직접 지원 |
| C4 | S4 | supported | Slide Quality Rules and Prompt boundaries | 직접 지원 |
| C5 | S5 | supported | local JSON parse result | 직접 지원 |

### Local Findings

| file | finding | relevance |
|---|---|---|
| `generated-decks/kimai-workshop-content/slide-spec.json` | 76개 슬라이드에 `speakerNote`, `presenterCues`, `bridge`, `glossaryTerms` 포함 | script 생성 입력 |
| `deck-harness/templates/assets/presenter-review.js` | 기존 review surface는 note/cue를 읽기 전용으로 노출 | 새 편집 UI는 별도 서버가 필요 |
| `deck-harness/scripts/build-deck-from-spec.js` | `slide-spec`에서 projector/presenter 산출물을 빌드 | 스크립트 생성은 projector build와 분리 |

### External Findings

| source | source type | finding | checked date |
|---|---|---|---|
| TMU Accessibility | official | speaker notes에 script를 담아 accessible handout으로 활용 가능 | 2026-06-01 |
| University at Buffalo Accessibility | official | clear/simple language와 speaker notes 활용 권장 | 2026-06-01 |
| UC Merced Accessibility | official | 사전 자료 제공, 발표 시작/종료 및 활동 안내 권장 | 2026-06-01 |

### Implementation Feasibility

- 가능: Node 기본 모듈로 deck list/read/write API와 편집 화면 구현.
- 조건부 가능: 브라우저 UI 검증은 서버 실행 후 수동/자동 브라우저 확인 가능.
- 불가능/비추천: static HTML만으로 repo 파일에 안정적으로 저장하는 방식.
- 필요한 라이브러리/도구: 없음.
- 대체안: JSON/Markdown만 생성하고 에디터는 기존 텍스트 편집기로 처리.

### Risks / Unknowns

- 자동 생성 원고는 최종 발표자의 말투와 호흡에 맞춰 한 차례 읽으면서 다듬어야 한다.
- 슬라이드 메시지가 바뀌면 `presentation-script.json`은 재생성 또는 수동 동기화가 필요하다.

## 4. Context Pack For Next Agent

### Use This Context

- `presentation-script.json`은 편집 가능한 원천이다.
- `presentation-script.md`는 검토/공유용이다.
- 로컬 편집은 `node scripts/serve-deck-script-editor.js`로 실행한다.

### Do Not Assume

- `speakerNote`를 원고형 스크립트로 덮어쓰지 않는다.
- projector slide에 긴 스크립트를 넣지 않는다.

### Recommended Next Step

- presenter가 편집 UI에서 실제 말투로 다듬고 `deck-harness/scripts/verify-presentation-script.js`를 다시 실행한다.

### Install Recommendations

- 없음.

### Raw Source List

- `presentation-script-raw-source-list.md`
