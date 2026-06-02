# Context Research Pack

Status: PASS
Task: 김아이 워크숍 전체 덱 발표 스크립트를 일반인 대상 실제 강의 원고와 키워드 진행 큐로 재구성
Artifact owner: Codex
Created: 2026-06-02
Updated: 2026-06-02
Project root: /Users/sabyun/goinfre/research_ai
Brainstorming phase: preflight
Recommended next action: 사용자 승인 후 generator, JSON/Markdown 산출물, speaker console, verifier 순서로 수정한다.

## 1. Context Triage

### Task Classification

| field | value |
|---|---|
| 작업 유형 | deck/report material + local implementation plan |
| 예상 산출물 | presentation-script.json, presentation-script.md, generator/verifier update, speaker console keyword flow display |
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
| local search | yes | yes | n/a | `rg`, `find`, `sed`, `node`로 deck/script contract 확인 |
| web search | yes | yes | local sources | 발표 노트, 키워드 큐, plain language 근거 조사 |
| Context7 | no | no | official docs / package docs | 새 라이브러리 없음 |
| docs/parser tool | yes | yes | local text extraction | JSON/Markdown/JS 직접 확인 |
| browser/screenshot | yes | no | static/server API review | 계획 단계라 아직 렌더 검증 전 |

### Must-Read Context

| path/source | why it matters | status |
|---|---|---|
| `AGENTS.md` | context research와 검증 산출물 위치 규칙 | read |
| `generated-decks/kimai-workshop-content/presentation-script-context-research-pack.md` | 기존 presentation-script 생성/편집 계약 | read |
| `generated-decks/kimai-workshop-content/presentation-script.json` | 현재 문제가 되는 산출물 | read |
| `generated-decks/kimai-workshop-content/presentation-script.md` | 공유용 출력 형식 | read |
| `deck-harness/scripts/generate-presentation-script.js` | 재현 가능한 수정의 1차 대상 | read |
| `deck-harness/scripts/verify-presentation-script.js` | 검증 계약 확장 대상 | read |
| `scripts/serve-lecture-cuts-review.js` | speaker console과 save path | read |

### Pre-Brainstorm Notes

- 현재 `presentation-script.json/md`는 각 슬라이드의 제목, note, 화면 앵커를 템플릿으로 이어 붙인 설명문이다.
- 사용자는 "슬라이드 내용만 보고 강의를 진행할 수 있는 원고"와 "키워드만 보고 다음 말을 이어갈 수 있는 진행 큐"를 둘 다 원한다.
- 기존 deck contract상 projector slide에 긴 원고를 넣지 않고 speaker script 산출물과 콘솔에 둔다.
- 76장 전체를 직접 손수 편집하면 재현성이 낮으므로 generator를 고쳐 재생성한 뒤 예외 슬라이드만 수동 보정하는 방식이 맞다.

### Questions For Brainstorming

- 원고 길이는 슬라이드당 45-90초 분량을 기본으로 하고, 여는/닫는 장과 실습 안내만 더 길게 둘지 확인하면 좋다.

## 2. Brainstorming Summary

### Agreed Goal

김아이 워크숍 전체 덱을 일반인 대상 강의로 바로 진행할 수 있게, 각 슬라이드마다 자연어 발표 원고와 진행용 키워드 플로우를 제공한다.

### Chosen Direction

`presentation-script.json`에 `script`와 별도로 `keywordFlow`를 추가한다. `script`는 실제 발화 원고, `keywordFlow`는 발표자가 한눈에 볼 수 있는 5-7개 진행 큐로 둔다. Markdown과 speaker console은 둘 다 보여 준다.

### Rejected Alternatives

| alternative | why rejected |
|---|---|
| 기존 `script`만 길게 늘리기 | 발표자는 읽을 원고와 순간 진행용 키워드가 모두 필요하다. 긴 원고만 있으면 진행 중 위치를 잃기 쉽다. |
| `speakerNote`를 덮어쓰기 | source slide contract와 생성 산출물의 역할이 섞인다. |
| 76개 JSON을 수동 편집 | 재생성/검증이 어렵고 다음 deck update 때 다시 무너진다. |
| 키워드만 제공 | 사용자가 요구한 "슬라이드 내용만 보고 강의 진행" 기준을 충족하지 못한다. |

### Research Questions After Brainstorming

- 발표 원고와 키워드 큐를 어떻게 분리해야 실제 진행성이 좋아지는가?
- 일반인 대상 설명 원고는 어떤 언어 기준을 가져야 하는가?
- 이 repo에서는 어떤 파일과 검증기를 함께 바꿔야 하는가?

## 3. Targeted Research

### Search Plan

| research question | query family | example queries | source target | status |
|---|---|---|---|---|
| 발표 원고와 키워드 큐 분리 | speaker notes cue cards keyword outline | `presentation speaker notes cue cards keywords delivery outline method` | official/secondary | searched |
| 발표 구조 | speech outline delivery | `Toastmasters speech outline keywords complete sentences` | official | searched |
| 일반인 대상 언어 | plain language general audience | `plain language presentations general audience speaker notes` | official | searched |
| speaker notes 접근성 | PowerPoint speaker notes accessibility | `PowerPoint speaker notes accessibility official guide speaker notes presentation script` | official | searched |
| 로컬 구현 위치 | generated deck presentation script | `presentation-script slide-spec speaker console keywordFlow` | local | searched |

### Search Iterations

| iteration | query families used | new evidence found | unresolved questions | next action |
|---|---|---|---|---|
| 1 | speaker notes, cue cards, plain language | full sentence outline는 읽게 만들 위험이 있고, keyword speaking outline이 prompt 역할을 한다 | 로컬 구현 | search local |
| 2 | local generator/verifier/server | generator와 verifier가 이미 있어 확장 가능 | 없음 | stop |

### Evidence Table

| claim id | claim | evidence | source id(s) | source type | checked date | confidence | relevance |
|---|---|---|---|---|---|---|---|
| C1 | 발표자는 상세 원고와 별도의 키워드 speaking outline을 함께 쓰는 방식이 적합하다. | Toastmasters는 상세 outline과 별도 keyword outline을 제안하며, full sentence outline은 읽게 만들 수 있다고 설명한다. | S1 | official | 2026-06-02 | high | 높음 |
| C2 | 일반인 대상 원고는 청중과 목적을 먼저 정하고, 가장 중요한 메시지를 먼저 두며, 논리 단위로 쪼개야 한다. | CDC plain language checklist는 audience/purpose, important message first, logical chunks를 권장한다. | S2 | official | 2026-06-02 | high | 높음 |
| C3 | speaker notes는 슬라이드 너머의 이야기를 말하거나 발표자 private reminder/talking point로 쓰는 공간이다. | Microsoft Support는 speaker notes를 slide content beyond story와 private reminders/talking points로 설명한다. | S3 | official | 2026-06-02 | high | 높음 |
| C4 | 진행용 노트는 발표자가 보기 쉬운 강조/간격/개인 reminder를 포함하고, 연습하면서 줄여야 한다. | GVSU Speech Lab은 speaker notes가 발표자를 돕는 private notes이며 강조 표시, 큰 글자, revision을 권장한다. | S4 | official | 2026-06-02 | high | 중간 |
| C5 | cue sheet에는 빠뜨리지 않을 만큼의 정보와 정확한 순서가 필요하지만, word-for-word 읽을 정도로 많으면 안 된다. | Lumen Learning은 cue sheet가 planned order와 enough information을 가져야 하지만 word-for-word reading은 too many words라고 설명한다. | S5 | secondary | 2026-06-02 | medium | 높음 |
| C6 | 현재 김아이 스크립트는 실제 발화보다 슬라이드 설명 템플릿에 가깝다. | `presentation-script.md`는 "이 슬라이드에서는...", "화면에 보이는..." 반복 패턴으로 구성되어 있다. | S7,S8 | local | 2026-06-02 | high | 높음 |
| C7 | 수정은 `generate-presentation-script.js`와 `verify-presentation-script.js`를 먼저 바꿔야 재현 가능하다. | 현재 generator가 `script`, `interactionPrompt`, `transition`을 만들고 verifier가 길이/프롬프트/전환을 검사한다. | S10,S11 | local | 2026-06-02 | high | 높음 |

### Sufficiency Check

| criterion | status | evidence / note |
|---|---|---|
| enough distinct query families used | pass | 발표 구조, keyword cue, plain language, accessibility, local implementation 분리 |
| official/primary sources checked | pass | Toastmasters, CDC, Microsoft, GVSU 확인 |
| local project context checked when relevant | pass | script JSON/MD, generator, verifier, server 확인 |
| implementation/example evidence checked when relevant | pass | 기존 generator/verifier와 speaker console path 확인 |
| risk/limitation/deprecation checked | pass | generator 기반 재생성으로 drift 완화 |
| contradictions or uncertainty recorded | pass | full script-only와 keyword-only 모두 요구사항 일부만 만족 |
| stop condition is explicit | pass | 계획 결정에 필요한 외부/로컬 근거 확보 |

### Stop Condition

- 수정 방식, 구조 필드, 검증 기준, 로컬 touchpoint가 모두 정해져 계획 브리핑 가능.

### Limiting Constraint

| constraint type | evidence / note |
|---|---|
| none | web/local search 가능. 추가 라이브러리 필요 없음. |

### Research State Snapshot

| state item | value |
|---|---|
| research questions tracked | 3 |
| searched query families | 5 |
| sources reviewed | 12+ search results, 5 opened sources, 7 local files |
| official/primary/local sources used | S1-S12 |
| unresolved questions | 원고 길이 세부 preference만 남음 |
| synthesis status | complete |

### Source Ledger

| source id | title | url/path | source type | checked date | used by claims |
|---|---|---|---|---|---|
| S1 | Toastmasters International - How to Outline Your Presentation | https://www.toastmasters.org/magazine/magazine-issues/2024/nov/outlining-presentations | official | 2026-06-02 | C1 |
| S2 | CDC Plain Language Materials & Resources | https://www.cdc.gov/health-literacy/php/develop-materials/plain-language.html | official | 2026-06-02 | C2 |
| S3 | Microsoft Support - Use a screen reader to read or add speaker notes and comments in PowerPoint | https://support.microsoft.com/en-US/Accessibility/powerpoint/use-a-screen-reader-to-read-or-add-speaker-notes-and-comments-in-powerpoint | official | 2026-06-02 | C3 |
| S4 | Grand Valley State University Speech Lab - Speaker's Notes | https://www.gvsu.edu/speechlab/speakers-notes-56.htm | official | 2026-06-02 | C4 |
| S5 | Lumen Learning - Preparation, Practice, and Delivery | https://courses.lumenlearning.com/suny-publicspeakingprinciples/chapter/chapter-12-preparation-practice-and-delivery/ | secondary | 2026-06-02 | C5 |
| S6 | Existing presentation script research pack | `generated-decks/kimai-workshop-content/presentation-script-context-research-pack.md` | local | 2026-06-02 | C7 |
| S7 | Current presentation script JSON | `generated-decks/kimai-workshop-content/presentation-script.json` | local | 2026-06-02 | C6 |
| S8 | Current presentation script Markdown | `generated-decks/kimai-workshop-content/presentation-script.md` | local | 2026-06-02 | C6 |
| S9 | Slide spec | `generated-decks/kimai-workshop-content/slide-spec.json` | local | 2026-06-02 | C7 |
| S10 | Script generator | `deck-harness/scripts/generate-presentation-script.js` | local | 2026-06-02 | C7 |
| S11 | Script verifier | `deck-harness/scripts/verify-presentation-script.js` | local | 2026-06-02 | C7 |
| S12 | Lecture cuts review server | `scripts/serve-lecture-cuts-review.js` | local | 2026-06-02 | C7 |

### Claim Support Check

| claim id | source id | support verdict | evidence locator / quote summary | reviewer note |
|---|---|---|---|---|
| C1 | S1 | supported | lines 69-72: key words/phrases prompt memory; full sentences invite reading | 직접 지원 |
| C2 | S2 | supported | lines 105-114: plain language checklist | 직접 지원 |
| C3 | S3 | supported | lines 140, 151-153, 216-218, 377: speaker notes as reminders/talking points/story beyond slide | 직접 지원 |
| C4 | S4 | supported | lines 26, 56-58: private notes, readable formatting, emphasis, revise with practice | 직접 지원 |
| C5 | S5 | supported | lines 19-24: ordered cue sheets, glance, eye contact, avoid word-for-word reading | 직접 지원 |
| C6 | S7 | supported | JSON script fields show repeated template phrasing | 직접 지원 |
| C6 | S8 | supported | first 12 Markdown slide scripts show repeated template phrasing | 직접 지원 |
| C7 | S10 | supported | generator currently defines script, interactionPrompt, transition | 직접 지원 |
| C7 | S11 | supported | verifier currently checks length, prompts, and transitions | 직접 지원 |

### Local Findings

| file | finding | relevance |
|---|---|---|
| `presentation-script.json` | editable fields are `script`, `interactionPrompt`, `transition`, `deliveryTips`; no keyword flow yet | schema extension needed |
| `presentation-script.md` | script prose repeats "이 슬라이드에서는..." and describes screen anchors | actual presenter script rewrite needed |
| `generate-presentation-script.js` | current `buildScript` joins section tone, title, note, bullet line, prompt, analogy, transition | generator should become narrative-script builder |
| `verify-presentation-script.js` | checks length and basic prompt/transition only | needs keyword-flow and anti-template checks |
| `serve-lecture-cuts-review.js` | speaker console shows script, interaction, transition | should show keyword flow in console and markdown save path |

### External Findings

| source | source type | finding | checked date |
|---|---|---|---|
| Toastmasters | official | keyword speaking outline prompts memory and avoids reading full sentences | 2026-06-02 |
| CDC | official | plain language should be audience-first, important message first, chunked, familiar wording | 2026-06-02 |
| Microsoft | official | speaker notes carry story beyond slide content and private reminders/talking points | 2026-06-02 |
| GVSU Speech Lab | official | speaker notes can use emphasis markers and should be revised after practice | 2026-06-02 |
| Lumen Learning | secondary | cue sheets need order/enough detail, but too many words cause reading | 2026-06-02 |

### Implementation Feasibility

- 가능: 기존 generator/verifier/server만 수정하면 라이브러리 추가 없이 전체 덱 script와 keyword flow를 재생성할 수 있다.
- 조건부 가능: 아주 자연스러운 76장 원고 품질은 생성 규칙 후 샘플 QA와 일부 수동 보정이 필요하다.
- 불가능/비추천: projector slide HTML에 긴 대본을 넣는 방식.
- 필요한 라이브러리/도구: 없음.
- 대체안: generator 수정 없이 `presentation-script.json`만 직접 수정할 수 있으나 재현성이 낮다.

### Risks / Unknowns

- 자동 원고가 특정 발표자의 말투와 100% 맞지는 않을 수 있다.
- 4시간 강의라 slide당 길이 조절이 중요하다. 기본은 45-90초, act 전환/실습은 90-150초로 잡는 것이 현실적이다.
- technical term은 지우지 않고 "회사 업무 비유 -> 실제 용어 -> 왜 필요한지" 순서로 풀어야 한다.

## 4. Context Pack For Next Agent

### Use This Context

- `script`는 실제 읽어도 어색하지 않은 발표 원고로 쓴다.
- `keywordFlow`는 5-7개 짧은 큐로 구성한다: `도입`, `화면앵커`, `비유`, `핵심`, `청중질문`, `다음연결`.
- `interactionPrompt`와 `transition`은 keyword flow와 중복되더라도 별도 필드로 유지해 기존 UI를 깨지 않는다.
- generator 수정 후 `presentation-script.json/md`를 재생성하고 verifier를 통과시킨다.

### Do Not Assume

- 현재 스크립트가 발표 원고로 충분하다고 보지 않는다.
- keyword cue를 전체 문장으로 길게 쓰지 않는다.
- 일반인 대상이라고 기술 용어를 삭제하지 않는다. 비유로 먼저 설명하고 실제 용어로 연결한다.

### Recommended Next Step

- 사용자 승인 후 `deck-harness/scripts/generate-presentation-script.js`를 narrative + keyword flow generator로 개편한다.
- `deck-harness/scripts/verify-presentation-script.js`에 keywordFlow 존재, cue 길이, anti-template 반복 검사, Markdown section 검사 추가.
- `scripts/serve-lecture-cuts-review.js`의 markdown generation/save path와 speaker console에 keyword flow 표시를 추가한다.
- 재생성 후 `node deck-harness/scripts/verify-presentation-script.js generated-decks/kimai-workshop-content`와 context pack validator를 실행한다.

### Install Recommendations

- 없음.

### Raw Source List

- `generated-decks/kimai-workshop-content/script-rewrite-keyword-flow-raw-source-list.md`
