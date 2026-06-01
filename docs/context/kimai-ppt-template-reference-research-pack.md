# Context Research Pack

Status: PASS
Task: 김아이 덱에 맞는 PPT 템플릿/슬라이드/모션 레퍼런스 조사
Artifact owner: Codex
Created: 2026-05-30
Updated: 2026-05-30
Project root: /Users/sabyun/goinfre/research_ai
Brainstorming phase: preflight
Recommended next action: 사용자와 새 템플릿 방향 선택 후 `deck-harness` 템플릿 계약 재설계

## 1. Context Triage

### Task Classification

| field | value |
|---|---|
| 작업 유형 | deck/PPT/report material, visual reference research |
| 예상 산출물 | 김아이 덱 템플릿 재설계를 위한 외부 레퍼런스와 적용 후보 |
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
| local search | yes | yes | n/a | `rg`, `sed`로 현재 CSS/디자인 계약 확인 |
| web search | yes | yes | n/a | PPT template, design system motion, assertion-evidence 자료 검색 |
| Context7 | no | no | official web docs | 라이브러리/API 구현이 아니라 사용하지 않음 |
| docs/parser tool | yes | yes | local text | HTML/PDF text extraction 확인 |
| browser/screenshot | partial | no | source pages and text evidence | 이번 요청은 조사 우선. 구현 전 screenshot audit는 다음 단계 |

### Must-Read Context

| path/source | why it matters | status |
|---|---|---|
| `deck-harness/AGENTS.md` | generated deck은 하네스 레이어에서 수정해야 하고 hand-drawn minimal 방향을 유지해야 함 | read |
| `디자인.md` | 흑백 + 포인트 1색, hand-drawn minimal, gradient/glow/glass 금지 | read |
| `deck-harness/templates/assets/style.css` | 현재 CSS variant, motion, reduced-motion, typography 확인 | read |
| `docs/context/issue-3-kimai-template-selection-context-research-pack.md` | 이전 결론: 의미 기반 템플릿 계약 부재가 문제 | read |

### Pre-Brainstorm Notes

- 현재 적용된 임시 semantic template은 실제로 덱에 반영됐지만, 사용자가 "템플릿이 별로"라고 판단했다.
- 따라서 이번 조사는 새 템플릿을 바로 구현하지 않고, 외부 PPT/slide reference에서 어떤 방향을 가져올지 판단하기 위한 근거다.
- 김아이 덱은 단순 PPT 템플릿 미학보다 하네스 계약으로 재사용 가능한 template grammar가 필요하다.

### Questions For Brainstorming

- 외부 레퍼런스 중 어느 축을 우선할 것인가: sketchnote/hand-drawn, assertion-evidence, clean workshop, product-style UI explanation?
- 템플릿을 "화면 모양" 중심으로 잡을지, "학습 동작 + 화면 슬롯" 중심으로 잡을지 결정해야 한다.
- motion은 현재 CSS의 `slide-enter`/`visual-rise`를 유지할지, semantic motion token으로 재정의할지 결정해야 한다.

## 2. Brainstorming Summary

### Agreed Goal

실제 인터넷의 PPT 템플릿, 슬라이드 구조, CSS motion에 참고할 수 있는 design-system 레퍼런스를 조사해 김아이 덱에 맞는 새 템플릿 방향을 제안한다.

### Chosen Direction

구현은 아직 하지 않는다. 외부 PPT 템플릿은 그대로 복제하지 않고, 현재 프로젝트의 hand-drawn minimal 제약과 CSS motion 계약에 맞는 패턴만 추출한다.

### Rejected Alternatives

| alternative | why rejected |
|---|---|
| Slidesgo/Canva/SlidesCarnival 템플릿을 그대로 복제 | 라이선스/attribution 문제가 있고 김아이 덱의 하네스 계약과 맞지 않음 |
| 화려한 doodle education 템플릿 그대로 채택 | 학생용 장식과 밝은 색상이 강해 현재 흑백+1색 시스템과 충돌 |
| animation-heavy PPT 템플릿 채택 | Material/Carbon 근거상 반복되는 lecture deck에는 짧고 의미 있는 motion이 적합 |
| 현재 임시 8-template 체계 유지 | 사용자가 템플릿 품질을 거부했으므로 재설계 필요 |

### Research Questions After Brainstorming

- RQ1: hand-drawn/minimal PPT 템플릿 중 김아이 덱에 맞는 reference는 무엇인가?
- RQ2: assertion-evidence 구조를 김아이 덱 템플릿 grammar로 가져올 수 있는가?
- RQ3: 현재 CSS animation과 맞는 motion 원칙은 무엇인가?
- RQ4: 최종 후보 템플릿 세트는 어떤 시각 패턴으로 정리해야 하는가?

## 3. Targeted Research

### Search Plan

| research question | query family | example queries | source target | status |
|---|---|---|---|---|
| RQ1 | hand-drawn PPT templates | `hand drawn education PowerPoint template minimalist`, `simple doodle PowerPoint template` | template galleries | searched |
| RQ1 | sketchnote education templates | `education sketchnotes PowerPoint template`, `sketchbook lesson presentation template` | template galleries | searched |
| RQ2 | assertion-evidence templates | `assertion evidence slide template PowerPoint`, `sentence headline visual evidence slide` | primary/official | searched |
| RQ3 | motion design systems | `Material Design motion duration easing`, `Carbon motion choreography semantic consistency` | official design systems | searched |
| RQ4 | local deck constraints | `@keyframes`, `slide--`, `prefers-reduced-motion`, `디자인.md` | local | searched |

### Search Iterations

| iteration | query families used | new evidence found | unresolved questions | next action |
|---|---|---|---|---|
| 1 | hand-drawn/minimal PPT templates | Slidesgo, SlidesMania, SlidesCarnival, Canva, Microsoft template sources 확인 | 실제 김아이 적용 후보 세트 | design system motion 조사 |
| 2 | motion design systems | Material duration/easing, Carbon productive/expressive and semantic consistency 확인 | 구현 방식 | template grammar 제안 |
| 3 | assertion-evidence | Penn State template/guideline 확인 | 없음 | stop |

### Evidence Table

| claim id | claim | evidence | source id(s) | source type | checked date | confidence | relevance |
|---|---|---|---|---|---|---|---|
| C1 | 김아이 덱에는 "decorative PPT theme"보다 hand-drawn minimal + large-message 구조가 맞다. | 로컬 `디자인.md`는 손글씨 제목, 낙서형 일러스트, 흑백+포인트 1색, gradient/glow/glass 금지를 명시한다. | S1, S2 | local | 2026-05-30 | high | high |
| C2 | Slidesgo Hand-drawn Assignments는 hand-drawn icon, 16:9, editable layout의 참고가 되지만 색상/장식은 줄여야 한다. | 해당 template은 hand-drawn illustration/icon, 31 slides, five colors, graphs/maps/tables/timelines/mockups, PowerPoint/Google Slides/Canva 지원을 제시한다. | S3 | template gallery | 2026-05-30 | high | high |
| C3 | SlidesMania Jones는 김아이와 더 가까운 단순 doodle reference다. | "simple presentation template with hand drawn doodles"이며 black/yellow palette를 쉽게 변경 가능하다고 설명한다. | S4 | template gallery | 2026-05-30 | high | high |
| C4 | SlidesCarnival Education Sketchnotes는 visual-learning/sketchnote 패턴 참고로 유용하지만 색상과 학생용 톤은 절제해야 한다. | sketchnotes style, hand drawn school icons, different layouts to break monotony, 25 slides, 16:9 지원을 제시한다. | S5 | template gallery | 2026-05-30 | high | medium |
| C5 | Microsoft template gallery는 "customizable layouts" 관점의 기준 참고는 되지만 김아이 스타일 직접 레퍼런스로는 약하다. | Microsoft는 templates를 colors/logos/fonts/custom background로 쉽게 customize할 수 있다고 설명한다. | S6 | official/product | 2026-05-30 | medium | medium |
| C6 | Assertion-evidence는 bullet-heavy 템플릿 대체의 강한 구조 근거다. | Penn State guideline은 sentence assertion headline, visual evidence, avoid bullet lists를 제안한다. | S7 | primary/academic guidance | 2026-05-30 | high | high |
| C7 | 현재 CSS motion은 Material guideline과 대체로 맞으며, 더 화려한 PPT animation보다 150-200ms desktop motion + natural easing 계열이 적합하다. | Material은 desktop animation을 faster/simpler, 150-200ms로 권장하고 smooth acceleration/deceleration을 설명한다. | S8, S11 | official/local | 2026-05-30 | high | high |
| C8 | motion은 템플릿별 의미와 연결되어야 한다. | Carbon은 same meaning/function에 same motion을 쓰라고 하며, productive vs expressive motion을 구분한다. | S9, S10 | official design system | 2026-05-30 | high | high |
| C9 | 다음 템플릿 세트는 `layoutTemplate` 이름보다 화면 슬롯과 teaching job을 먼저 정의해야 한다. | 기존 이슈 조사팩은 의미 기반 계약 부재를 문제로 봤고, 이번 외부 레퍼런스도 slot/layout/motion consistency가 핵심임을 뒷받침한다. | S12, S3, S7, S10 | local + external | 2026-05-30 | high | high |

### Recommended Reference Directions

| direction | strongest references | fit | caution |
|---|---|---|---|
| Whiteboard Sketchnote System | SlidesMania Jones, SlidesCarnival Education Sketchnotes | 김아이 hand-drawn character/line visual과 잘 맞음 | 색상/아이콘 과다 사용 금지 |
| Assertion + Visual Evidence | Penn State assertion-evidence template | bullet 반복을 줄이고 큰 문장 + 이미지/도식 중심으로 재구성 가능 | 모든 장을 scientific AE처럼 만들면 workshop rhythm이 딱딱해짐 |
| Minimal Workshop Cards | Microsoft/Canva simple templates | section, exercise, checklist, recap 구조를 빠르게 구성 가능 | 너무 일반 SaaS/비즈니스 deck처럼 보일 수 있음 |
| Productive Motion Tokens | Material, Carbon | 현재 CSS `slide-enter`, `visual-rise`, reduced-motion과 연결 쉬움 | expressive motion은 Act opening/transition 정도로 제한 |

### Candidate Template Grammar

구현 전 사용자 확인이 필요한 후보 세트다.

| candidate template | source inspiration | screen slots | motion |
|---|---|---|---|
| `one-line-claim` | assertion-evidence | section label, sentence headline, one supporting drawing, one bridge | text fade 150-200ms, visual rise 200ms |
| `sketch-explain` | sketchnote/hand-drawn templates | large drawing left or center, 2-3 label callouts, short message | label stagger only when labels are sequential |
| `workbench-before-after` | workshop/problem-solving deck | before state, after state, manager/Kimai note | horizontal reveal, no diagonal motion |
| `term-translation` | glossary bridge | company metaphor term, actual harness term, one-line relation | two-step reveal: metaphor then actual term |
| `process-strip` | sketchnote flow/timeline | 3 stations max, arrow/connector, one sentence outcome | connector pulse or sequential fade |
| `decision-check` | checklist/workshop template | question, 3 criteria, pass/hold marker | productive check reveal |
| `practice-launch` | handoff slide | exercise name, expected action, open practice surface cue | no image; single expressive entrance |
| `recap-map` | closing map | small map of artifacts/acts, next use cue | slow but short map settle, reduced-motion fallback |

### Sufficiency Check

| criterion | status | evidence / note |
|---|---|
| enough distinct query families used | pass | hand-drawn templates, sketchnote templates, assertion-evidence, motion design systems, local CSS |
| official/primary sources checked | pass | Microsoft, Material, Carbon, Penn State |
| local project context checked when relevant | pass | `디자인.md`, `deck-harness/AGENTS.md`, CSS, prior issue pack |
| implementation/example evidence checked when relevant | pass | current CSS motion/variant constraints checked |
| risk/limitation/deprecation checked | pass | template licenses/attribution and over-decoration risks recorded |
| contradictions or uncertainty recorded | pass | hand-drawn templates fit style but many are too colorful/childlike |
| stop condition is explicit | pass | enough references to choose a design direction; implementation intentionally deferred |

### Stop Condition

조사는 새 템플릿 방향을 선택하기에 충분하다. 추가 검색은 유사한 template gallery 반복이 많고, 다음 효율적인 단계는 사용자가 선호 방향을 고른 뒤 하네스 template grammar를 재설계하는 것이다.

### Limiting Constraint

| constraint type | evidence / note |
|---|---|
| none | Search covered local design constraints, external template galleries, assertion-evidence guidance, and official motion-system guidance. Direct template copying is intentionally out of scope; external sources are references only. |

### Research State Snapshot

| state item | value |
|---|---|
| research questions tracked | 4 |
| searched query families | hand-drawn PPT, sketchnote education, assertion-evidence, motion design system, local CSS |
| sources reviewed | 12 ledger items |
| official/primary/local sources used | 6 |
| unresolved questions | exact visual direction and template set require user choice |
| synthesis status | complete |

### Source Ledger

| source id | title | url/path | source type | checked date | used by claims |
|---|---|---|---|---|---|
| S1 | Deck harness instructions | `deck-harness/AGENTS.md` | local | 2026-05-30 | C1 |
| S2 | Presentation Design: Hand-drawn Minimal | `디자인.md` | local | 2026-05-30 | C1 |
| S3 | Slidesgo Hand-drawn Assignments | https://slidesgo.com/theme/hand-drawn-assignments | template gallery | 2026-05-30 | C2, C9 |
| S4 | SlidesMania Jones | https://slidesmania.com/jones-free-presentation-template/ | template gallery | 2026-05-30 | C3 |
| S5 | SlidesCarnival Education Sketchnotes | https://www.slidescarnival.com/template/knight-free-presentation-template/9770 | template gallery | 2026-05-30 | C4 |
| S6 | Microsoft PowerPoint presentation templates | https://powerpoint.cloud.microsoft/create/en/presentation-templates/ | official/product | 2026-05-30 | C5 |
| S7 | Penn State Assertion-Evidence slide guidelines | https://www.writing.engr.psu.edu/guidelines_AE_slides.pdf | primary/academic guidance | 2026-05-30 | C6, C9 |
| S8 | Material Design duration and easing | https://m1.material.io/motion/duration-easing.html | official design system | 2026-05-30 | C7 |
| S9 | Carbon motion overview | https://carbondesignsystem.com/elements/motion/overview/ | official design system | 2026-05-30 | C8 |
| S10 | Carbon motion choreography | https://carbondesignsystem.com/elements/motion/choreography/ | official design system | 2026-05-30 | C8, C9 |
| S11 | Deck harness CSS | `deck-harness/templates/assets/style.css` | local | 2026-05-30 | C7 |
| S12 | Issue 3 context research pack | `docs/context/issue-3-kimai-template-selection-context-research-pack.md` | local | 2026-05-30 | C9 |

### Claim Support Check

| claim id | source id | support verdict | evidence locator / quote summary | reviewer note |
|---|---|---|---|---|
| C1 | S1 | supported | local instructions require generated decks to stay in harness/source/template layers | direct local constraint |
| C1 | S2 | supported | local design note requires hand-drawn minimal, black/white + one accent, no gradients/glow/glass | direct local constraint |
| C2 | S3 | supported | Slidesgo page lists hand-drawn illustrations/icons, 31 slides, multi-format support | useful but over-decorated risk |
| C3 | S4 | supported | SlidesMania Jones is simple hand drawn doodles and editable palette | strongest style fit among template galleries |
| C4 | S5 | supported | SlidesCarnival says sketchnotes style, hand drawn icons, different layouts | useful rhythm reference |
| C5 | S6 | supported | Microsoft official page describes customizable layouts, colors, logos, fonts | generic but credible |
| C6 | S7 | supported | AE guideline says sentence assertion headline, visual evidence, avoid bullet lists | strong template grammar basis |
| C7 | S8 | supported | Material desktop 150-200ms and smooth easing guidance | direct implementation guidance |
| C7 | S11 | supported | local CSS already uses short visual rise and reduced-motion | direct implementation guidance |
| C8 | S9 | supported | Carbon distinguishes productive and expressive motion | useful for CSS motion semantics |
| C8 | S10 | supported | Carbon choreography guidance supports semantic and spatial consistency | useful for CSS motion semantics |
| C9 | S12 | supported | prior issue pack identifies meaning-based template contract gap | synthesis claim |
| C9 | S3 | supported | template gallery evidence points to reusable slots and layout forms | synthesis claim |
| C9 | S7 | supported | assertion-evidence guidance supports slot grammar over bullet structure | synthesis claim |
| C9 | S10 | supported | motion choreography guidance supports meaning-linked template behavior | synthesis claim |

### Install Recommendations

- 없음.

### Raw Source List

- `docs/context/kimai-ppt-template-reference-raw-source-list.md`
- Slidesgo Hand-drawn Assignments: https://slidesgo.com/theme/hand-drawn-assignments
- SlidesMania Jones: https://slidesmania.com/jones-free-presentation-template/
- SlidesCarnival Education Sketchnotes: https://www.slidescarnival.com/template/knight-free-presentation-template/9770
- Microsoft PowerPoint presentation templates: https://powerpoint.cloud.microsoft/create/en/presentation-templates/
- Penn State Assertion-Evidence slide guidelines: https://www.writing.engr.psu.edu/guidelines_AE_slides.pdf
- Material Design duration and easing: https://m1.material.io/motion/duration-easing.html
- Carbon motion overview: https://carbondesignsystem.com/elements/motion/overview/
- Carbon motion choreography: https://carbondesignsystem.com/elements/motion/choreography/

## 4. Context Pack For Next Agent

### Use This Context

- 사용자는 현재 임시 템플릿이 별로라고 판단했다. 구현을 계속하지 말고 새 template grammar를 먼저 합의해야 한다.
- 가장 적합한 외부 방향은 `SlidesMania Jones` 같은 simple doodle + `Penn State assertion-evidence` 구조 + `Material/Carbon` motion token이다.
- Slidesgo/SlidesCarnival/Canva 계열은 reference로만 쓰고, 컬러풀한 학생용 장식은 줄여야 한다.
- 새 템플릿은 `layoutTemplate` 이름보다 screen slots, motion role, teaching job을 함께 정의해야 한다.

### Do Not Assume

- 외부 PPT 템플릿을 그대로 가져와도 된다고 가정하지 않는다.
- hand-drawn이면 무조건 좋은 템플릿이라고 보지 않는다. 색상, 장식, 아이콘 밀도가 많으면 김아이 덱과 충돌한다.
- motion을 많이 넣으면 템플릿 품질이 좋아진다고 가정하지 않는다.

### Recommended Next Step

사용자에게 2-3개 visual direction을 보여주고 하나를 고른 뒤, `deck-harness`의 template grammar를 다시 작성한다.

추천 선택지:

1. Whiteboard Workshop: 흰 배경, 큰 문장, 작은 손그림, 1색 포인트.
2. Sketchnote Map: 핵심 개념을 지도/라벨/연결선으로 정리.
3. Assertion Evidence Lecture: 문장형 headline + 한 장면/도식 + 거의 bullet 없음.
