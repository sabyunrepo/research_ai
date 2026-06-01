# Context Research Pack

Status: PASS
Task: Diagnose why the Kimai template-gallery visual component subset feels lower quality than lecture-cuts and define a repair plan.
Artifact owner: Codex
Created: 2026-05-30
Updated: 2026-05-30
Project root: /Users/sabyun/goinfre/research_ai
Brainstorming phase: preflight
Recommended next action: Replace the partial kh-* recreation with a faithful adapter layer around selected lecture-cuts components, then verify with motion-aware browser evidence.

## 1. Context Triage

### Task Classification

| field | value |
|---|---|
| 작업 유형 | deck visual/motion diagnosis |
| 예상 산출물 | 브리핑과 개선 계획 |
| 위험도 | medium |
| 최신성 필요 | no |
| 로컬 조사 필요 | yes |
| 외부 검색 필요 | no |
| 라이브러리/API 문서 필요 | no |
| PPT/deck/report 자료 필요 | yes |
| high-stakes domain | no |

### Tool Detection

| tool | available | used | fallback | note |
|---|---:|---:|---|---|
| local search | yes | yes | n/a | `rg`, `nl`, `sed`로 CSS/HTML 비교 |
| web search | yes | no | local sources | 원인은 로컬 CSS/DOM 이식 문제라 외부 검색 불필요 |
| Context7 | no | no | local source review | 라이브러리 API 작업 아님 |
| docs/parser tool | yes | no | local text extraction | HTML/CSS 직접 확인 |
| browser/screenshot | yes | yes | n/a | 이전 갤러리 캡처와 render check 사용 |

### Must-Read Context

| path/source | why it matters | status |
|---|---|---|
| `디자인.md` | 손그림 minimal, CSS 도형 제한, motion 절제 기준 | read |
| `deck-harness/AGENTS.md` | generated deck workflow와 visual contract | read |
| `lecture-cuts/assets/style.css` | golden deck visual/motion 원본 | read |
| `lecture-cuts/*.html` | 원본 component DOM 구조 | read |
| `deck-harness/templates/assets/style.css` | 현재 kh-* 포팅 상태 | read |
| `deck-harness/templates/assets/template-gallery.js` | 현재 gallery DOM/motion trigger | read |

### Pre-Brainstorm Notes

- 현재 `kh-*`는 lecture-cuts를 그대로 가져온 것이 아니라 유사 구조를 축약 재구현한 것이다.
- lecture-cuts의 품질은 CSS 하나가 아니라 DOM 구조, viewport scale, deck-frame override, keyframe 조합이 같이 만든다.

### Questions For Brainstorming

- faithful adapter로 원본 component를 더 보존할지, 김아이 전용으로 새 component를 다시 설계할지 결정해야 한다.

## 2. Brainstorming Summary

### Agreed Goal

김아이 template-gallery의 visual component subset이 `디자인.md` 기준과 lecture-cuts golden quality에 더 가까워지도록 원인을 정확히 분리하고 개선 계획을 세운다.

### Chosen Direction

원본 lecture-cuts component를 선별하되, 임의 재구현이 아니라 adapter layer로 DOM/CSS/motion을 최대한 보존한다.

### Rejected Alternatives

| alternative | why rejected |
|---|---|
| 현재 kh-*를 계속 미세 조정 | 원본 motion grammar와 layout 보정이 빠져 품질 격차가 계속 남음 |
| React 전환 | 현재 문제는 프레임워크가 아니라 CSS/DOM/motion 이식 품질 문제 |
| 외부 PPT 템플릿 재조사 | 지금 결함은 외부 레퍼런스 부족이 아니라 로컬 golden component를 잘못 옮긴 문제 |

### Research Questions After Brainstorming

- RQ1: lecture-cuts motion이 더 좋아 보이는 구체적 이유는 무엇인가?
- RQ2: 현재 kh-*에서 어떤 요소가 빠졌거나 잘못 바뀌었는가?
- RQ3: 다음 개선은 어떤 순서로 해야 검증 가능하고 되돌리기 쉬운가?

## 3. Targeted Research

### Search Plan

| research question | query family | example queries | source target | status |
|---|---|---|---|---|
| RQ1 | local golden CSS motion | `workbench-visual`, `soft-pulse`, `connector-pulse`, `deck-frame` | local | searched |
| RQ1 | local golden DOM | `workbench-visual`, `handoff-bridge-visual`, `loop-visual` in `lecture-cuts/*.html` | local | searched |
| RQ2 | current kh subset | `kh-workbench`, `kh-line-draw`, `data-motion-cue` | local | searched |
| RQ3 | verification contract | `verify-template-gallery`, browser render report | local | searched |
| RQ3 | design contract | `디자인.md`, `deck-harness/AGENTS.md` | local | searched |

### Search Iterations

| iteration | query families used | new evidence found | unresolved questions | next action |
|---|---|---|---|---|
| 1 | golden CSS/DOM vs kh subset | 원본은 size, shadow, persistent pulse, connector-pulse, deck-frame override가 결합됨 | exact implementation choice | stop |

### Evidence Table

| claim id | claim | evidence | source id(s) | source type | checked date | confidence | relevance |
|---|---|---|---|---|---|---|---|
| C1 | 현재 kh-*는 lecture-cuts 원본을 그대로 가져온 것이 아니라 축약 재구현이다. | kh-*는 `kh-workbench`, `kh-harness` 등 새 클래스와 별도 DOM을 사용한다. | S3, S4 | local | 2026-05-30 | high | high |
| C2 | lecture-cuts 원본은 component 크기와 motion의 기본값이 더 풍부하다. | `.css-visual` width 620/min-height 430, workbench min-height 500, `soft-pulse`, `layer-pop`, `connector-pulse` 사용. | S1 | local | 2026-05-30 | high | high |
| C3 | lecture-cuts는 deck-frame용 축소 보정 레이어를 별도로 가진다. | `.deck-frame .workbench-visual`, `.deck-frame .workbench-card`, `.deck-frame .handoff-*` override가 존재한다. | S1 | local | 2026-05-30 | high | high |
| C4 | 현재 kh-* motion은 재생 trigger는 있지만 원본의 지속적 motion grammar를 대부분 잃었다. | `kh-soft-pop`, `kh-line-draw`, `kh-attention`은 대부분 일회성이고 `connector-pulse`, `soft-pulse`, `orbit-upright`를 그대로 쓰지 않는다. | S1, S3 | local | 2026-05-30 | high | high |
| C5 | loop는 특히 원본보다 나빠질 위험이 크다. | lecture-cuts는 `orbit-upright`로 아이템을 돌리면서 글자를 반대로 보정하지만, kh는 ring 전체를 회전시켜 라벨 방향 품질이 떨어진다. | S1, S3 | local | 2026-05-30 | high | medium |
| C6 | verifier는 존재 여부를 보지만 visual quality parity는 아직 검증하지 못한다. | verifier는 `kh-*`, `data-motion-cue`, keyframe 존재를 확인하나 원본 component parity나 motion frame comparison은 없다. | S5 | local | 2026-05-30 | high | high |

### Sufficiency Check

| criterion | status | evidence / note |
|---|---|---|
| enough distinct query families used | pass | golden CSS, golden DOM, kh CSS/JS, verifier checked |
| official/primary sources checked | pass | primary local source files checked |
| local project context checked when relevant | pass | AGENTS, 디자인.md, lecture-cuts, deck-harness checked |
| implementation/example evidence checked when relevant | pass | specific CSS/HTML lines reviewed |
| risk/limitation/deprecation checked | pass | parity and verifier gap recorded |
| contradictions or uncertainty recorded | pass | CSS shape vs generated-image rule remains a design constraint |
| stop condition is explicit | pass | root cause identified enough for planning |

### Stop Condition

- Stop because the main quality gap is explained by local source comparison: partial recreation, lost motion grammar, lost deck-frame adaptations, and weak verifier parity.

### Limiting Constraint

| constraint type | evidence / note |
|---|---|
| none | External research was unnecessary because the root cause is local implementation drift. |

### Research State Snapshot

| state item | value |
|---|---|
| research questions tracked | 3 |
| searched query families | golden CSS/DOM, kh CSS/JS, verifier |
| sources reviewed | 5 |
| official/primary/local sources used | local project sources |
| unresolved questions | exact visual direction approval before implementation |
| synthesis status | complete |

### Source Ledger

| source id | title | url/path | source type | checked date | used by claims |
|---|---|---|---|---|---|
| S1 | lecture-cuts style | `lecture-cuts/assets/style.css` | local | 2026-05-30 | C2,C3,C4,C5 |
| S2 | lecture-cuts component HTML | `lecture-cuts/*.html` | local | 2026-05-30 | C2,C3 |
| S3 | Kimai template style | `deck-harness/templates/assets/style.css` | local | 2026-05-30 | C1,C4,C5 |
| S4 | Kimai template gallery JS | `deck-harness/templates/assets/template-gallery.js` | local | 2026-05-30 | C1,C4 |
| S5 | Kimai gallery verifier | `deck-harness/scripts/verify-template-gallery.js` | local | 2026-05-30 | C6 |

### Claim Support Check

| claim id | source id | support verdict | evidence locator / quote summary | reviewer note |
|---|---|---|---|---|
| C1 | S3 | supported | kh-* classes | current implementation evidence |
| C1 | S4 | supported | custom visual renderer | current implementation evidence |
| C2 | S1 | supported | lines around `.css-visual`, `.workbench-*`, keyframes | direct CSS |
| C3 | S1 | supported | `.deck-frame` overrides for component fit | direct CSS |
| C4 | S1 | supported | golden keyframe names and usage | direct CSS comparison |
| C4 | S3 | supported | kh keyframe names and usage differ | direct CSS comparison |
| C5 | S1 | supported | `orbit-upright` keeps labels upright | direct CSS comparison |
| C5 | S3 | supported | kh loop rotates ring directly | direct CSS comparison |
| C6 | S5 | supported | verifier checks presence, not visual parity | direct script review |

### Local Findings

| file | finding | relevance |
|---|---|---|
| `lecture-cuts/assets/style.css` | 원본은 base component, motion keyframes, deck-frame override가 결합되어 있음 | faithful port 기준 |
| `deck-harness/templates/assets/style.css` | 현재 kh-*는 축약 재구현이며 line draw/attention 중심 | 품질 하락 원인 |
| `deck-harness/templates/assets/template-gallery.js` | DOM도 원본과 달라 원본 CSS를 제대로 재사용하지 못함 | 이식 전략 변경 필요 |
| `deck-harness/scripts/verify-template-gallery.js` | motion/selector 존재만 확인 | parity verifier 필요 |

### External Findings

| source | source type | finding | checked date |
|---|---|---|---|
| n/a | n/a | Local root cause only; no web research needed. | 2026-05-30 |

### Implementation Feasibility

- 가능: lecture-cuts 원본 component를 namespaced adapter로 더 충실히 포팅.
- 조건부 가능: `디자인.md`의 “HTML/CSS 도형 제한”과 충돌하지 않게 갤러리/검증 preview 전용으로 먼저 유지.
- 불가능/비추천: 현재 kh-*를 계속 임의로 미세 조정하며 “lecture-cuts 재사용”이라고 부르는 것.
- 필요한 라이브러리/도구: 추가 라이브러리 없음. Playwright screenshot/video 또는 frame capture 필요.
- 대체안: hand-drawn PNG asset 기반 preview로 전환하고 CSS component는 최소 보조만 담당.

### Risks / Unknowns

- `디자인.md`의 적용 규칙은 본편 컷에 생성 이미지 기반 손그림 일러스트를 요구하므로, CSS component는 갤러리/검증 preview 또는 상호작용 설명에 제한해야 한다.
- motion quality는 정적 screenshot만으로는 충분히 검증되지 않는다.

## 4. Context Pack For Next Agent

### Use This Context

- 문제는 React/HTML 자체가 아니라 원본 lecture-cuts component를 부분 재구현하면서 motion grammar와 fit override를 잃은 것이다.
- 다음 구현은 원본 DOM/CSS를 최대한 보존하는 adapter-first 방식이어야 한다.

### Do Not Assume

- `kh-*`가 이미 lecture-cuts와 동등하다고 보지 말 것.
- keyframe 이름이 있다고 motion quality가 통과한다고 보지 말 것.
- 본편 김아이 덱에 바로 적용하지 말 것. 먼저 gallery에서 승인받을 것.

### Recommended Next Step

- `template-gallery.js`에서 `kh-*` DOM을 원본 lecture-cuts component DOM에 가깝게 바꾸고, CSS는 `lc-*` or `kh-lc-*` namespaced faithful subset으로 교체한다.
- `verify-template-gallery.js`에 parity checks를 추가한다: 원본 keyframe usage, deck-frame fit rules, component DOM shape, motion frame capture artifact.

### Install Recommendations

- 추가 설치 없음.

### Raw Source List

- `lecture-cuts/assets/style.css`
- `lecture-cuts/*.html`
- `deck-harness/templates/assets/style.css`
- `deck-harness/templates/assets/template-gallery.js`
- `deck-harness/scripts/verify-template-gallery.js`
