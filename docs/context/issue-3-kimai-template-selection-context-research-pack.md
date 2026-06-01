# Context Research Pack

Status: PASS
Task: GitHub issue #3 김아이 덱 의미 기반 슬라이드 템플릿 선택 조사
Artifact owner: Codex
Created: 2026-05-30
Updated: 2026-05-30
Project root: /Users/sabyun/goinfre/research_ai
Brainstorming phase: both
Recommended next action: 완료

## 1. Context Triage

### Task Classification

| field | value |
|---|---|
| 작업 유형 | 덱/발표자료 조사, 로컬 저장소 조사, 설계 근거 조사 |
| 예상 산출물 | GitHub issue #3 개선 방향을 판단하기 위한 근거 조사팩 |
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
| local search | yes | yes | n/a | `rg`, `sed`, `node`, `gh`로 로컬 파일과 이슈 확인 |
| web search | yes | yes | n/a | 슬라이드 설계와 학습 설계 근거 확인 |
| Context7 | no | no | 공식 문서 / 로컬 문서 | 이번 작업은 외부 API 구현이 아니라 사용하지 않음 |
| docs/parser tool | yes | yes | 로컬 텍스트 확인 | JSON, JS, MD를 직접 확인 |
| browser/screenshot | yes | no | 정적 파일 검토 | 자료조사 범위에서는 불필요 |

### Must-Read Context

| path/source | why it matters | status |
|---|---|---|
| GitHub issue #3 | 사용자가 말한 “깃이슈 3번”의 실제 문제 정의와 완료 조건 | read |
| `deck-harness/AGENTS.md` | 생성 덱은 최종 HTML 직접 수정이 아니라 하네스 레이어에서 고쳐야 함 | read |
| `docs/harness/kimai-content/AGENTS.md` | 김아이 Act 구조, 비유 사전, 문서 소유권 규칙 | read |
| `generated-decks/kimai-workshop-content/slide-spec.json` | 현재 김아이 덱 입력 구조와 누락된 의미 메타데이터 확인 | read |
| `deck-harness/scripts/build-deck-from-spec.js` | 현재 템플릿/레이아웃 선택 방식 확인 | read |
| `deck-harness/scripts/verify-slide-layout-variety.js` | 현재 다양성 검증이 무엇을 보는지 확인 | read |
| `deck-harness/scripts/verify-deck-quality.js` | 전체 품질 게이트가 의미 기반 템플릿을 보는지 확인 | read |
| `deck-harness/slide-spec.schema.json` | 현재 의미 메타데이터 계약이 있는지 확인 | read |

### Pre-Brainstorm Notes

- 이슈 #3은 특정 슬라이드 한 장을 예쁘게 고치는 문제가 아니다. `title/message/bullets/footer` 구조가 반복되는 생성 파이프라인 문제다.
- 현재 덱은 기존 레이아웃 다양성 게이트를 통과한다. 하지만 그 게이트는 `layoutVariant` 분포만 보고, 슬라이드 의도나 템플릿 슬롯 적합성은 보지 않는다.
- 현재 `slide-spec.json` 76장에는 `layoutTemplate`, `teachingMove`, `audienceAction`, `visualMode`, `xmlPrompt`가 없다.
- 현재 bullet 구조는 여전히 일정하다. 76장 중 57장은 bullet 3개, 15장은 bullet 4개다.
- 현재 visual 구조도 좁다. 73장은 `generated-image`, 3장은 `minimal-diagram`이다.

### Questions For Brainstorming

- 현재 필드만으로는 의미 기반 템플릿 선택 여부를 판단하기 어렵다.
- `layoutTemplate` 같은 상위 의미 계약은 현재 source contract에 없다.
- 기존 76장 덱은 품질 게이트를 통과하지만, 그 게이트가 의미 기반 반복까지 확인하지는 않는다.

## 2. Brainstorming Summary

### Agreed Goal

자료조사 목표는 이슈 #3의 문제를 로컬 증거와 외부 근거로 확인하고, “왜 현재 덱이 일정해 보이는지”와 “어떤 설계 근거가 의미 기반 템플릿 선택을 뒷받침하는지”를 정리하는 것이다.

### Chosen Direction

조사 결과는 `layoutTemplate`, `teachingMove`, `audienceAction`, `visualMode` 같은 의미 메타데이터의 부재가 사용자가 느낀 “일정함”과 연결된다는 해석을 뒷받침한다. 이번 작업은 자료조사이므로 코드, 덱, GitHub 이슈 본문은 변경하지 않았다.

### Rejected Alternatives

| alternative | why rejected |
|---|---|
| 생성된 HTML 슬라이드 직접 수정 | 사용자는 자료조사를 요청했고, 하네스 규칙상 반복 문제는 출력 HTML 직접 수정으로 해결하지 않는다 |
| 현재 `layoutVariant` 개수만 보고 충분하다고 판단 | 기존 게이트는 통과하지만 사용자가 느끼는 “일정함”을 설명하지 못한다 |
| raw source bullet을 더 많이 추가하는 방식 | 이슈 #3 자체가 입력을 무작정 늘리는 것보다 selector/enricher를 우선한다고 명시한다 |
| `index % n` 방식의 순환 레이아웃 | 겉보기 다양성만 만들고 슬라이드 의미와 맞지 않을 수 있다 |

### Research Questions After Brainstorming

- RQ1: bullet/topic slide를 claim/visual-evidence 또는 one-job slide로 바꾸는 근거는 무엇인가?
- RQ2: `teachingMove`와 `audienceAction`을 어떤 학습 설계 분류로 잡을 수 있는가?
- RQ3: 렌더러나 QA 게이트에 반영할 수 있는 인지부하/멀티미디어 학습 원칙은 무엇인가?
- RQ4: 자동 생성 슬라이드 평가에서 검증 가능성을 높이는 방식은 무엇인가?
- RQ5: 로컬 하네스에서 selector, enricher, renderer slot, gate의 책임 위치는 어디인가?

## 3. Targeted Research

### Search Plan

| research question | query family | example queries | source target | status |
|---|---|---|---|---|
| RQ1 | assertion-evidence 슬라이드 연구 | assertion evidence slide design research, slideware visual evidence checklist | primary | searched |
| RQ2 | 학습 설계 분류 | ABC Learning Design acquisition practice production, Merrill activation demonstration application | official/primary | searched |
| RQ3 | 멀티미디어 학습/인지부하 | Mayer coherence signaling redundancy spatial contiguity, cognitive load slide design | primary | searched |
| RQ4 | 자동 슬라이드 평가 | slide generation benchmark fine grained rubric binary checklist | primary | searched |
| RQ5 | 로컬 하네스 조사 | `layoutVariant`, `verify-slide-layout-variety`, `slide-spec.schema`, `build-deck-from-spec` | local | searched |

### Search Iterations

| iteration | query families used | new evidence found | unresolved questions | next action |
|---|---|---|---|---|
| 1 | 로컬 이슈와 하네스 파일 | 이슈 #3은 `build-deck-from-spec.js` 선택 로직과 다양성 게이트에 직접 연결됨 | 새 게이트 강도 | 외부 근거 조사 |
| 2 | assertion-evidence, 멀티미디어 학습, 학습 설계 | claim/evidence, 활동 유형, 인지부하 게이트 근거 확인 | 김아이 템플릿 enum 최종값 | 로컬 제약 확인 |
| 3 | 자동 슬라이드 평가와 현재 덱 통계 | binary checklist 방식이 하네스 QA 관점과 잘 맞음 | 없음 | stop |

### Evidence Table

| claim id | claim | evidence | source id(s) | source type | checked date | confidence | relevance |
|---|---|---|---|---|---|---|---|
| C1 | 현재 김아이 덱 문제는 출력 한 장의 문제가 아니라 source contract 레벨의 의미 메타데이터 부재다. | `slide-spec.json` 76장 중 `layoutTemplate`, `teachingMove`, `audienceAction`, `visualMode`, `layoutVariant`가 있는 슬라이드는 0장이다. | S3 | local | 2026-05-30 | high | high |
| C2 | 기존 다양성 게이트는 필요하지만 충분하지 않다. | `verify-slide-layout-variety.js`는 `layoutVariant` 개수, 최대 비율, 연속 반복만 본다. 슬라이드 의도나 템플릿 슬롯 적합성은 보지 않는다. | S8 | local | 2026-05-30 | high | high |
| C3 | 현재 렌더러는 학습 의도가 아니라 휴리스틱으로 variant를 고른다. | `build-deck-from-spec.js`는 act opening regex, bullet 개수, `index % 5`로 `layoutVariant`를 결정한다. | S7 | local | 2026-05-30 | high | high |
| C4 | assertion-evidence 연구는 bullet 목록보다 명확한 주장과 시각 근거를 우선하는 방향을 뒷받침한다. | Penn State는 문장형 headline과 visual evidence 기반 슬라이드가 이해와 기억에 유리했다는 연구를 요약한다. Harvard Catalyst는 이를 점검하는 checklist를 제공한다. | S10, S11 | primary/official | 2026-05-30 | high | high |
| C5 | `teachingMove`는 표면 레이아웃이 아니라 수업 활동 유형에서 나와야 한다. | ABC Learning Design은 acquisition, discussion, investigation, practice, collaboration, production 같은 활동 유형을 제시한다. Merrill은 activation, demonstration, application, integration을 제시한다. | S13, S15 | official/primary | 2026-05-30 | high | high |
| C6 | QA 게이트는 장식, 중복, 떨어진 라벨, 과도한 텍스트를 걸러야 한다. | Mayer는 coherence, signaling, redundancy, spatial contiguity, temporal contiguity 원칙으로 불필요한 인지부하를 줄여야 한다고 설명한다. | S12 | primary | 2026-05-30 | high | high |
| C7 | UDL의 Engagement, Representation, Action & Expression은 `audienceAction`과 `visualMode` 설계 참고로 쓸 수 있다. | CAST는 UDL을 학습자의 참여, 표현 방식, 행동/표현 방식으로 설명한다. | S14 | official | 2026-05-30 | medium | medium |
| C8 | 자동 생성 슬라이드 평가는 세부 binary checklist와 잘 맞는다. | PresentBench는 전체 인상 평가보다 instance별 세부 binary checklist가 슬라이드 생성 평가에 유효하다고 제안한다. | S16 | primary | 2026-05-30 | medium | high |
| C9 | 현재 덱은 기존 품질 게이트를 통과하므로, 조사 결론은 “품질 게이트 실패”가 아니라 “의미 계약 공백”이다. | `verify-slide-layout-variety.js`는 7 variants, largest 24/76, longest run 3으로 PASS했고, quality report도 PASS다. | S4, S5, S8 | local | 2026-05-30 | high | high |

### Sufficiency Check

| criterion | status | evidence / note |
|---|---|---|
| enough distinct query families used | pass | 로컬 하네스, assertion-evidence, 학습 설계, 멀티미디어 학습, 자동 슬라이드 평가를 확인 |
| official/primary sources checked | pass | Penn State, Harvard Catalyst, Cambridge/Mayer, CAST, Bath, Merrill, arXiv 확인 |
| local project context checked when relevant | pass | 이슈, AGENTS, generated deck, renderer, schema, gate 확인 |
| implementation/example evidence checked when relevant | pass | 현재 renderer/gate 동작을 이슈 #3 조사 근거로 매핑 |
| risk/limitation/deprecation checked | pass | 기존 덱은 통과 중이라 조사 결론을 품질 실패로 단정하지 않음 |
| contradictions or uncertainty recorded | pass | 기존 게이트 PASS와 사용자 체감 “일정함”의 차이를 semantic-vs-surface gap으로 기록 |
| stop condition is explicit | pass | 로컬 구조와 외부 근거가 같은 결론으로 수렴해 중단 |

### Stop Condition

- 자료조사에 필요한 근거가 충분했다. 추가 검색은 하네스 계약으로 옮기기 어려운 일반 디자인 조언이 많아 중단했다.

### Limiting Constraint

| constraint type | evidence / note |
|---|---|
| none | 네트워크, GitHub CLI, 로컬 검색, validator 사용 가능. Context7은 이번 조사에 필요 없었음. |

### Research State Snapshot

| state item | value |
|---|---|
| research questions tracked | 5 |
| searched query families | 로컬 하네스, assertion-evidence, 학습 설계, 멀티미디어/인지부하, 생성 슬라이드 평가 |
| sources reviewed | 16개 source ledger 항목 |
| official/primary/local sources used | 16 |
| unresolved questions | 없음. 구현 방식 선택은 이번 자료조사 범위 밖 |
| synthesis status | complete |

### Source Ledger

| source id | title | url/path | source type | checked date | used by claims |
|---|---|---|---|---|---|
| S1 | GitHub issue #3 | https://github.com/sabyunrepo/research_ai/issues/3 | primary | 2026-05-30 | C1, C2, C3 |
| S2 | Deck harness instructions | `deck-harness/AGENTS.md` | local | 2026-05-30 | C9 |
| S3 | Kimai workshop slide spec | `generated-decks/kimai-workshop-content/slide-spec.json` | local | 2026-05-30 | C1 |
| S4 | Kimai handoff | `generated-decks/kimai-workshop-content/HANDOFF.md` | local | 2026-05-30 | C9 |
| S5 | Kimai quality gate report | `generated-decks/kimai-workshop-content/quality-gate-report.md` | local | 2026-05-30 | C9 |
| S6 | Slide spec schema | `deck-harness/slide-spec.schema.json` | local | 2026-05-30 | C1 |
| S7 | Deck builder | `deck-harness/scripts/build-deck-from-spec.js` | local | 2026-05-30 | C3 |
| S8 | Layout variety verifier | `deck-harness/scripts/verify-slide-layout-variety.js` | local | 2026-05-30 | C2, C9 |
| S9 | Deck quality verifier | `deck-harness/scripts/verify-deck-quality.js` | local | 2026-05-30 | C9 |
| S10 | Penn State Assertion-Evidence slide research | https://www.writing.engr.psu.edu/research.html | primary | 2026-05-30 | C4 |
| S11 | Harvard Catalyst Assertion Evidence Slide Checklist | https://catalyst.harvard.edu/publications-documents/assertion-evidence-slide-checklist/ | official | 2026-05-30 | C4 |
| S12 | Mayer, principles for reducing extraneous processing | https://www.cambridge.org/core/books/abs/cambridge-handbook-of-multimedia-learning/principles-for-reducing-extraneous-processing-in-multimedia-learning-coherence-signaling-redundancy-spatial-contiguity-and-temporal-contiguity-principles/C98AB3A6CE760DD63C048936EA0B3B44 | primary | 2026-05-30 | C6 |
| S13 | ABC Learning Design overview | https://teachinghub.bath.ac.uk/guide/abc-learning-design-overview/ | official | 2026-05-30 | C5 |
| S14 | CAST Universal Design for Learning | https://www.cast.org/what-we-do/universal-design-for-learning/ | official | 2026-05-30 | C7 |
| S15 | Merrill, First Principles of Instruction | https://www.unthsc.edu/center-for-innovative-learning/wp-content/uploads/sites/35/2017/08/firstprinciplesbymerrill.pdf | primary | 2026-05-30 | C5 |
| S16 | PresentBench | https://arxiv.org/abs/2603.07244 | primary | 2026-05-30 | C8 |

### Claim Support Check

| claim id | source id | support verdict | evidence locator / quote summary | reviewer note |
|---|---|---|---|---|
| C1 | S3 | supported | node로 slide field 확인 | 로컬 명령 근거 |
| C2 | S8 | supported | verifier가 variant count/run만 확인 | 직접 소스 |
| C3 | S7 | supported | builder가 bullet count와 index modulo 사용 | 직접 소스 |
| C4 | S10 | supported | sentence headline + visual evidence 연구 요약 | 직접 근거 |
| C4 | S11 | supported | assertion-evidence checklist 자료 | 실무 점검 근거 |
| C5 | S13 | supported | activity type 목록과 balanced learning design | 직접 근거 |
| C5 | S15 | supported | activation, demonstration, application, integration 원칙 | 직접 근거 |
| C6 | S12 | supported | extraneous overload와 coherence/signaling 원칙 | 직접 근거 |
| C7 | S14 | supported | Engagement, Representation, Action & Expression | 직접 근거 |
| C8 | S16 | supported | fine-grained binary checklist 평가 | 직접 근거 |
| C9 | S4 | supported | handoff에 검증 통과 기록 | 로컬 산출물 |
| C9 | S5 | supported | quality report의 PASS verdict | 로컬 산출물 |
| C9 | S8 | supported | layout variety local command PASS | 로컬 명령 근거 |

### Local Findings

| file | finding | relevance |
|---|---|---|
| `deck-harness/scripts/build-deck-from-spec.js` | 현재 selector는 regex, bullet count, `index % 5` 기반이다 | 겉보기 다양성과 의미 다양성이 달라지는 이유 |
| `deck-harness/scripts/verify-slide-layout-variety.js` | 현재 gate는 distribution-only다 | 의미 기반 반복은 놓칠 수 있음 |
| `deck-harness/scripts/verify-deck-quality.js` | 4개 이상 variant와 placeholder 여부는 보지만 semantic template slot은 보지 않는다 | 현재 품질 게이트의 blind spot |
| `deck-harness/slide-spec.schema.json` | `layoutTemplate`, `teachingMove`, `audienceAction`, `visualMode` enum이 없다 | source contract 공백 |
| `generated-decks/kimai-workshop-content/slide-spec.json` | 76장 모두 semantic metadata가 없고, 57장은 bullet 3개 구조다 | 사용자가 느낀 일정함의 로컬 근거 |
| `generated-decks/kimai-workshop-content/HANDOFF.md` | 현재 덱은 기존 quality workflow를 통과한다 | “실패”가 아니라 “게이트가 보지 않는 문제”로 해석 |

### External Findings

| source | source type | finding | checked date |
|---|---|---|---|
| Penn State Assertion-Evidence | primary | topic/bullet보다 message headline + visual evidence가 학습에 유리하다는 근거 | 2026-05-30 |
| Mayer/Cambridge | primary | coherence, signaling, redundancy, contiguity가 반복/중복 문제 해석에 유용함 | 2026-05-30 |
| ABC Learning Design | official | 학습 활동 유형이 표면 레이아웃과 별개라는 근거 | 2026-05-30 |
| Merrill First Principles | primary | activation, demonstration, application, integration 같은 수업 진행 유형 근거 | 2026-05-30 |
| CAST UDL | official | audienceAction과 접근성 관점의 다양성을 해석하는 참고 근거 | 2026-05-30 |
| PresentBench | primary | 생성 슬라이드는 binary checklist 기반 평가가 적합함 | 2026-05-30 |

### Implementation Feasibility

- 이번 자료조사에서는 구현 가능성 검토를 별도 작업으로 진행하지 않았다.
- 확인한 범위는 이슈 #3의 문제 정의, 현재 하네스의 선택/검증 방식, 그리고 관련 외부 근거다.
- `index % n` 또는 bullet count 기반 선택은 의미 기반 다양성을 설명하기 어렵다는 점만 조사 결론으로 남긴다.

### Risks / Unknowns

- 기존 덱은 이미 PASS라서, 이번 조사 결론을 현재 덱의 품질 게이트 실패로 해석하면 안 된다.
- presenter review, Canvas, semantic gate 같은 항목은 이슈 #3 본문에 등장하지만 이번 자료조사에서는 구현 판단을 하지 않았다.

## 4. Context Pack For Next Agent

### Use This Context

- 조사 결론은 “시각적 레이아웃 수가 부족하다”가 아니라 “의미 기반 템플릿 계약이 없다”이다.
- 이슈 #3의 템플릿 세트는 표면 장식이 아니라 학습 의도 기반으로 선택될 때 외부 근거와 맞는다.
- 핵심 근거는 assertion-evidence, ABC Learning Design, Merrill, Mayer, PresentBench다.

### Do Not Assume

- 7개 `layoutVariant`가 있다고 해서 의미적으로 다양한 덱이라고 가정하지 않는다.
- 모든 `generated-image` 슬라이드가 `story-scene`이어야 한다고 가정하지 않는다.
- 생성된 HTML 슬라이드를 직접 고치는 것이 이슈 #3 해결이라고 가정하지 않는다.
- lecture deck 안에 practice UI를 섞어 넣는 방향으로 해석하지 않는다.

### Recommended Next Step

완료.

### Research-Only Boundary

- 이 문서는 자료조사 산출물이며 작업 지시서가 아니다.
- issue #3 관련 코드, 생성 덱 HTML, GitHub issue 본문은 변경하지 않았다.

### Install Recommendations

- 없음.

### Raw Source List

- `docs/context/issue-3-kimai-template-selection-raw-source-list.md`
