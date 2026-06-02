# Context Research Pack

Status: PASS
Task: speaker.html에서 전체 발표 원고 아래/대신, 키워드만 보고 말할 수 있는 발표자용 구조를 조사하고 재구성 방향을 잡는다.
Artifact owner: Codex
Created: 2026-06-02
Updated: 2026-06-02
Project root: /Users/sabyun/goinfre/research_ai
Brainstorming phase: preflight
Recommended next action: writing-plans

## 1. Context Triage

### Task Classification

| field | value |
|---|---|
| 작업 유형 | deck/PPT/report material + UI design |
| 예상 산출물 | speaker console keyword outline 구성안 |
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
| local search | yes | yes | n/a | speaker.html, speaker.js, style.css, presentation-script.json 확인 |
| web search | yes | yes | n/a | 대학/Toastmasters/공개 교재 자료 확인 |
| Context7 | no | no | official docs / package docs | 라이브러리 작업 아님 |
| docs/parser tool | yes | no | local text extraction | HTML/PDF 웹 소스 충분 |
| browser/screenshot | yes | no | static file review | 이번 단계는 자료조사만 수행 |

### Must-Read Context

| path/source | why it matters | status |
|---|---|---|
| deck-harness/templates/speaker.html | 발표자 콘솔의 현재 레이아웃과 삽입 지점 | read |
| deck-harness/templates/assets/speaker.js | script, keywordFlow 렌더링 방식 | read |
| deck-harness/templates/assets/style.css | speaker notes panel 스타일 | read |
| generated-decks/kimai-workshop-content/presentation-script.json | 현재 데이터에 script와 keywordFlow가 존재하는지 확인 | read |

### Pre-Brainstorm Notes

- 현재 speaker UI는 긴 원고 `script`를 `speakerPromptBody`에 먼저 보여주고, `keywordFlow`는 아래 보조 cue list로 보여준다.
- 조사 결과 기준으로는 전체 원고를 읽게 만드는 UI가 아니라, 키워드 아웃라인을 주 화면으로 두고 전체 원고는 확인용으로 낮춰야 한다.
- 현재 데이터는 `keywordFlow[{label,cue,say}]`, `transition`, `interactionPrompt`, `keywordActual`, `keywordAudience`를 이미 포함한다.

### Questions For Brainstorming

- `keywordFlow`를 원고 아래 보조로 유지할지, 원고 위의 primary delivery view로 승격할지 결정해야 한다.
- 전체 원고는 접힘 패널로 둘지, 하단 작은 참조 영역으로 둘지 결정해야 한다.
- 각 슬라이드 cue를 몇 개까지 보여줄지 결정해야 한다. 권장: 4-6개 cue.

## 2. Brainstorming Summary

### Agreed Goal

긴 발표 원고를 그대로 읽는 방식이 아니라, 발표자가 한눈에 보는 키워드와 짧은 말하기 cue를 기준으로 자연스럽게 말할 수 있게 speaker console을 재구성한다.

### Chosen Direction

`Extemporaneous delivery` 기반의 `presentation/keyword outline`을 적용한다. 화면 구조는 `핵심 메시지 -> 말할 순서 cue -> 전환/청중 질문 -> 전체 원고 접힘` 순서가 적합하다.

### Rejected Alternatives

| alternative | why rejected |
|---|---|
| 전체 원고를 더 크게 표시 | 발표자가 읽게 되어 eye contact와 자연스러운 말하기를 방해 |
| 완전 암기용 UI | 4시간 워크숍성 강의에는 준비 부담과 리스크가 큼 |
| 현재 keywordFlow를 단순 목록으로만 유지 | 이미 좋은 데이터가 있으나 발표 동작을 유도하는 구조가 약함 |

### Research Questions After Brainstorming

- RQ1: 키워드만 보고 말하는 발표 방식의 공식 명칭과 원칙은 무엇인가?
- RQ2: 키워드 아웃라인은 어느 정도 길이와 형식이어야 하는가?
- RQ3: 현재 speaker console에서는 어떤 구조가 가장 적합한가?

## 3. Targeted Research

### Search Plan

| research question | query family | example queries | source target | status |
|---|---|---|---|---|
| RQ1 | extemporaneous delivery | presentation speaking from keywords not script, extemporaneous speaking keyword outline | official/primary/secondary | searched |
| RQ2 | presentation keyword outline | tips for presentational keyword outlines, public speaking notes keyword outline | official/primary | searched |
| RQ3 | local speaker implementation | speakerPromptBody keywordFlow speakerCuePanel | local | searched |
| RQ2 | notes vs manuscript | presentation outline vs manuscript delivery, speaking notes not full script | official/primary | searched |
| RQ3 | delivery cue design | speaker cue cards transition audience question presentation | primary/secondary/local | searched |

### Search Iterations

| iteration | query families used | new evidence found | unresolved questions | next action |
|---|---|---|---|---|
| 1 | extemporaneous delivery, keyword outline, notes vs manuscript, delivery cue design, local speaker UI | extemporaneous delivery는 준비된 outline에서 대화체로 말하는 방식이며, keyword outline은 짧은 단어/구 중심이어야 함 | 실제 UI 배치 최종안은 사용자 판단 필요 | stop |

### Evidence Table

| claim id | claim | evidence | source id(s) | source type | checked date | confidence | relevance |
|---|---|---|---|---|---|---|---|
| C1 | 원고를 그대로 읽는 방식보다 outline 기반 extemporaneous delivery가 현재 목적에 맞다. | 공개 교재는 extemporaneous delivery를 준비/연습된 speech를 짧은 notes로 대화체 전달하는 방식으로 설명하고, eye contact와 audience adaptation 장점을 든다. | S1, S2 | primary | 2026-06-02 | high | high |
| C2 | 키워드 아웃라인은 단어 또는 3-5단어의 짧은 구문 중심이어야 한다. | University of Pittsburgh 자료는 keyword outline을 single words and short, 3-5 word phrases로 설명한다. | S2 | primary | 2026-06-02 | high | high |
| C3 | 발표자용 notes에는 전체 문장을 많이 넣지 말고, 핵심 키워드/구문과 필요한 직접 인용 정도만 남겨야 한다. | UWL Public Speaking Center PDF는 full sentence를 sparingly 쓰고 paragraphs/lots of full sentences를 피하라고 권한다. | S4 | primary | 2026-06-02 | high | high |
| C4 | 현재 speaker console은 `script`를 먼저 보여주고 `keywordFlow`를 보조로 보여주므로, 연구된 방식과 반대 우선순위다. | speaker.js는 `speakerPromptBody.textContent = script.script` 후 `renderCueList(script)`로 keywordFlow를 아래에 렌더링한다. | S5 | local | 2026-06-02 | high | high |
| C5 | 현재 데이터는 구현 가능한 재구성 재료를 이미 가지고 있다. | presentation-script.json에는 `script`, `keywordFlow`, `transition`, `interactionPrompt`, `keywordActual`, `keywordAudience`가 있다. | S6 | local | 2026-06-02 | high | high |

### Sufficiency Check

| criterion | status | evidence / note |
|---|---|---|
| enough distinct query families used | pass | extemporaneous delivery, keyword outline, notes vs manuscript, delivery cue design, local speaker UI |
| official/primary sources checked | pass | University of Pittsburgh, KU OpenText, UWL Public Speaking Center, Pressbooks |
| local project context checked when relevant | pass | speaker.html, speaker.js, style.css, presentation-script.json |
| implementation/example evidence checked when relevant | pass | current render path and data fields checked |
| risk/limitation/deprecation checked | pass | extemporaneous delivery requires rehearsal and can drift in timing |
| contradictions or uncertainty recorded | pass | manuscript delivery remains useful for exact quotes/stats, so full script should remain available as fallback |
| stop condition is explicit | pass | enough evidence to propose UI/content restructuring; no implementation yet |

### Stop Condition

- Stop after enough external and local evidence to propose a speaker console structure.
- Implementation is intentionally deferred because the user asked to research first.

### Limiting Constraint

| constraint type | evidence / note |
|---|---|
| none | 사용자가 자료조사를 먼저 요청했지만, 조사 범위 안에서는 충분 조건을 충족함 |

### Research State Snapshot

| state item | value |
|---|---|
| research questions tracked | 3 |
| searched query families | extemporaneous delivery, presentation keyword outline, notes vs manuscript, delivery cue design, local speaker UI |
| sources reviewed | 6 |
| official/primary/local sources used | 6 |
| unresolved questions | exact UI density and whether full script is collapsed by default |
| synthesis status | complete |

### Source Ledger

| source id | title | url/path | source type | checked date | used by claims |
|---|---|---|---|---|---|
| S1 | Ways of Delivering Speeches - Public Speaking as Performance | https://opentext.ku.edu/publicspeakingperformance/chapter/ways-of-delivering-speeches/ | primary | 2026-06-02 | C1 |
| S2 | Oral Discourse and Extemporaneous Delivery | https://www.comm.pitt.edu/oral-discourse-and-extemporaneous-delivery | primary | 2026-06-02 | C1, C2 |
| S3 | Preparing a Presentation Outline or Manuscript for an Effective Delivery | https://pressbooks.palni.org/publicspeakinganddemocraticparticipation/chapter/preparing-a-presentation-outline-or-manuscript-for-an-effective-delivery/ | primary | 2026-06-02 | C1 |
| S4 | Tips for effective presentational/keyword outlines | https://www.uwlax.edu/globalassets/offices-services/tutoring--learning-center/public-speaking-tutors/tips-for-presentational-outlines.pdf | primary | 2026-06-02 | C3 |
| S5 | speaker.js | deck-harness/templates/assets/speaker.js | local | 2026-06-02 | C4 |
| S6 | presentation-script.json | generated-decks/kimai-workshop-content/presentation-script.json | local | 2026-06-02 | C5 |

### Claim Support Check

| claim id | source id | support verdict | evidence locator / quote summary | reviewer note |
|---|---|---|---|---|
| C1 | S1 | supported | Lines 120-127 describe extemporaneous delivery as planned/rehearsed, conversational, brief notes, audience adaptation. | Strong fit |
| C1 | S2 | supported | Lines 79-81 describe outline-based, rehearsed, non-memorized delivery. | Strong fit |
| C2 | S2 | supported | Line 79 states single words and short, 3-5 word phrases. | Direct support |
| C3 | S4 | supported | PDF lines 5-7 recommend keywords/phrases, sparse full sentences, no paragraphs. | Direct support |
| C4 | S5 | supported | `speakerPromptBody.textContent = script.script`; `renderCueList(script)` follows. | Direct local support |
| C5 | S6 | supported | Existing JSON fields include script and keywordFlow. | Direct local support |

### Local Findings

| file | finding | relevance |
|---|---|---|
| deck-harness/templates/speaker.html | Notes panel has `speakerPromptBody` and `speakerCuePanel`; no dedicated keyword-first panel. | Main UI insertion point |
| deck-harness/templates/assets/speaker.js | Long script is primary body; cue list is rendered afterward. | Needs priority inversion |
| deck-harness/templates/assets/style.css | `speaker-prompt-body` and `speaker-cues` already styled; can add `speaker-outline` without new library. | Low-risk implementation |
| generated-decks/kimai-workshop-content/presentation-script.json | `keywordFlow` exists per slide and includes label, cue, say. | Reuse existing data |

### External Findings

| source | source type | finding | checked date |
|---|---|---|---|
| University of Pittsburgh | primary | Oral delivery needs repetition, clear structure, simple language; extemporaneous speaking uses keyword outline. | 2026-06-02 |
| KU OpenText | primary | Extemporaneous delivery balances prepared content and conversational delivery using brief notes. | 2026-06-02 |
| Pressbooks | primary | Extemporaneous notes recall structure, key ideas, and direct quotations/source citations. | 2026-06-02 |
| UWL Public Speaking Center | primary | Keyword outlines should avoid paragraphs and lots of full sentences; notes can include delivery reminders. | 2026-06-02 |

### Implementation Feasibility

- 가능: `presentation-script.json`의 `keywordFlow`를 primary speaker outline으로 렌더링한다.
- 가능: 전체 원고 `script`는 details/accordion 또는 하단 small reference로 둔다.
- 가능: `transition`과 `interactionPrompt`는 cue list의 마지막 두 줄로 유지한다.
- 조건부 가능: 각 cue의 `say`를 짧게 다시 생성해야 더 좋다. 현재 일부 `say`는 발표문에 가깝게 길 수 있다.
- 불가능/비추천: 전체 원고를 완전히 제거. 발표자가 길을 잃을 때 복구할 fallback이 필요하다.
- 필요한 라이브러리/도구: 없음.
- 대체안: keywordFlow 데이터가 없는 슬라이드는 script를 문장 단위로 요약해 3-5개 cue를 생성한다.

### Risks / Unknowns

- 긴 워크숍에서는 keyword-only가 시간 편차를 만들 수 있으므로 슬라이드별 예상 시간 또는 핵심 문장 하나는 유지하는 편이 안전하다.
- 직접 인용, 정확한 용어 정의, 실습 지시문은 full sentence fallback이 필요하다.
- 현재 keywordFlow 품질이 슬라이드마다 다르므로 자동 변환 후 QA가 필요하다.
- 발표 스크립트가 짧은 것 자체는 결함으로 보지 않는다. 재구성 기준은 분량 보강이 아니라 말하기 cue의 선명도와 흐름이다.

## 4. Context Pack For Next Agent

### Use This Context

- 이 작업의 공식 접근명은 `extemporaneous delivery`와 `presentation/keyword outline`.
- speaker UI는 긴 원고 primary가 아니라 keyword outline primary로 바꿔야 한다.
- 추천 구조:
  1. 핵심 메시지 한 줄
  2. 4-6개 cue card: `label`, `cue`, 짧은 `say`
  3. 청중 질문/행동
  4. 다음 장 연결
  5. 전체 원고 접힘 패널

### Do Not Assume

- 키워드만 있으면 리허설 없이 잘 말할 수 있다고 가정하지 않는다.
- 전체 원고를 삭제하지 않는다.
- `keywordFlow` 품질이 모든 슬라이드에서 충분하다고 가정하지 않는다.
- 짧은 발표 스크립트를 무조건 늘려야 한다고 가정하지 않는다.

### Recommended Next Step

- `presentation-script.json` 기준으로 각 슬라이드의 `keywordFlow`를 더 짧고 구두 cue 중심으로 재구성한다.
- `speaker.js`에서 `keywordFlow`를 primary view로 렌더링하고, `script`는 접힘 reference로 이동한다.
- 첫 적용은 3-5개 슬라이드로 QA한 뒤 전체 슬라이드에 확장한다.

### Install Recommendations

- 없음.

### Raw Source List

- https://www.comm.pitt.edu/oral-discourse-and-extemporaneous-delivery
- https://opentext.ku.edu/publicspeakingperformance/chapter/ways-of-delivering-speeches/
- https://pressbooks.palni.org/publicspeakinganddemocraticparticipation/chapter/preparing-a-presentation-outline-or-manuscript-for-an-effective-delivery/
- https://www.uwlax.edu/globalassets/offices-services/tutoring--learning-center/public-speaking-tutors/tips-for-presentational-outlines.pdf
- deck-harness/templates/speaker.html
- deck-harness/templates/assets/speaker.js
- deck-harness/templates/assets/style.css
- generated-decks/kimai-workshop-content/presentation-script.json
