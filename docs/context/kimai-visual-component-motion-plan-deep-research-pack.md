# Context Research Pack

Status: PASS
Task: Deep-search references to strengthen the Kimai visual component and motion improvement plan.
Artifact owner: Codex
Created: 2026-05-30
Updated: 2026-05-30
Project root: /Users/sabyun/goinfre/research_ai
Brainstorming phase: preflight
Recommended next action: Implement a faithful lecture-cuts component adapter with motion tokens and motion-aware verification before applying to the main Kimai deck.

## 1. Context Triage

### Task Classification

| field | value |
|---|---|
| 작업 유형 | design/motion research for deck-harness plan |
| 예상 산출물 | 근거 기반 개선 계획 |
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
| local search | yes | yes | n/a | prior local gap pack used |
| web search | yes | yes | n/a | official design/performance/accessibility references |
| Context7 | no | no | official docs / package docs | not needed |
| docs/parser tool | yes | no | local text extraction | web/local text enough |
| browser/screenshot | yes | no | static source review | implementation verification later |

### Must-Read Context

| path/source | why it matters | status |
|---|---|---|
| `docs/context/kimai-visual-component-motion-gap-context-research-pack.md` | local root cause from prior diagnosis | read |
| `디자인.md` | local hand-drawn minimal contract | read |
| `lecture-cuts/assets/style.css` | golden visual/motion source | read |
| MDN animation performance docs | animation performance constraints | read |
| web.dev CSS animation guide | transform/opacity guidance | read |
| W3C WCAG 2.3.3 | reduced motion/accessibility constraint | read |
| Material motion duration/easing | timing/easing principles | read |
| Carbon motion overview | productive vs expressive motion model | read |
| Apple HIG Motion | purpose/restraint and reduced motion | read |

### Pre-Brainstorm Notes

- The earlier failure was not lack of animation; it was a partial recreation of lecture-cuts that lost the original motion grammar.
- Deep research should improve the implementation plan, not add unrelated effects.

### Questions For Brainstorming

- Which external motion principles should become concrete verifier checks?
- Which motion patterns should be copied from lecture-cuts and which should be rejected under `디자인.md`?

## 2. Brainstorming Summary

### Agreed Goal

Strengthen the plan so the next implementation improves visual quality without drifting into decorative, inaccessible, or low-performance animation.

### Chosen Direction

Use lecture-cuts as the primary implementation reference, and use external research only to set motion tokens, accessibility boundaries, and verification requirements.

### Rejected Alternatives

| alternative | why rejected |
|---|---|
| Add more CSS keyframes to kh-* | More motion does not fix the loss of original component grammar. |
| Adopt React/Framer/GSAP | Current need is static deck preview with CSS components; framework migration is not justified. |
| Use generic PPT templates directly | The local deck has a specific hand-drawn minimal contract and lecture-cuts golden reference. |

### Research Questions After Brainstorming

- RQ1: What makes web/CSS animation high-quality and performant?
- RQ2: What accessibility constraints must motion follow?
- RQ3: What duration/easing model should guide the deck components?
- RQ4: What presentation-design criteria should keep the components from becoming decorative clutter?
- RQ5: How should the plan change from the previous kh-* attempt?

## 3. Targeted Research

### Search Plan

| research question | query family | example queries | source target | status |
|---|---|---|---|---|
| RQ1 | CSS animation performance | `CSS animation performance transform opacity MDN web.dev` | official | searched |
| RQ2 | reduced motion accessibility | `WCAG 2.3.3 animation from interactions prefers-reduced-motion` | official | searched |
| RQ3 | motion duration easing | `Material Design motion duration easing`, `Carbon Design motion productive expressive` | official | searched |
| RQ4 | presentation visual hierarchy | `assertion evidence slides visual hierarchy minimal presentation design` | secondary/local | searched |
| RQ5 | local implementation gap | `lecture-cuts workbench soft-pulse connector-pulse kh-workbench` | local | searched |

### Search Iterations

| iteration | query families used | new evidence found | unresolved questions | next action |
|---|---|---|---|---|
| 1 | CSS performance, reduced motion, motion systems, presentation design, local gap | transform/opacity, reduced-motion control, short purposeful duration, productive/expressive split, assertion-evidence | exact component look still requires gallery iteration | stop |

### Evidence Table

| claim id | claim | evidence | source id(s) | source type | checked date | confidence | relevance |
|---|---|---|---|---|---|---|---|
| C1 | Motion should primarily animate transform and opacity, not layout-heavy properties. | MDN and web.dev both identify transform/opacity as optimized choices and warn about layout/paint-triggering animation. | S1, S2 | official | 2026-05-30 | high | high |
| C2 | Motion must support reduced-motion preferences and avoid non-essential interaction-triggered movement. | W3C WCAG 2.3.3 says motion animation from interaction can be disabled unless essential; Apple also recommends adapting when Reduce Motion is enabled. | S3, S4 | official | 2026-05-30 | high | high |
| C3 | Good UI motion is short, purposeful, and uses natural easing rather than slow mechanical movement. | Material motion recommends short durations, smooth acceleration/deceleration, and warns slow animation causes lag. | S5 | official | 2026-05-30 | high | high |
| C4 | Motion should distinguish routine/productive transitions from expressive emphasis. | Carbon separates productive and expressive motion, which maps well to deck component entry vs emphasis moments. | S6 | official | 2026-05-30 | medium | medium |
| C5 | Motion should convey status, feedback, or instruction, not merely decorate. | Apple HIG describes motion as conveying status, feedback, and instruction, with purpose and restraint. | S7 | official | 2026-05-30 | high | high |
| C6 | Slide visuals should support a main assertion and reduce cognitive load. | Assertion-evidence presentation guidance prioritizes a slide assertion supported by visual evidence over text-heavy slides. | S8 | secondary | 2026-05-30 | medium | medium |
| C7 | The next Kimai plan should port lecture-cuts faithful component grammar instead of continuing the kh-* recreation. | Local gap pack found kh-* is a partial recreation that lost `soft-pulse`, `connector-pulse`, `orbit-upright`, and deck-frame fit rules. | S9 | local | 2026-05-30 | high | high |

### Sufficiency Check

| criterion | status | evidence / note |
|---|---|
| enough distinct query families used | pass | 5 query families |
| official/primary sources checked | pass | MDN, web.dev, W3C, Material, Carbon, Apple |
| local project context checked when relevant | pass | local motion gap pack and design contract |
| implementation/example evidence checked when relevant | pass | local CSS/DOM source and verifier gap |
| risk/limitation/deprecation checked | pass | reduced motion and performance constraints included |
| contradictions or uncertainty recorded | pass | CSS component use must remain preview/adapter until user approves |
| stop condition is explicit | pass | enough to revise plan into implementable steps |

### Stop Condition

- Stop because the research yielded actionable criteria for implementation and verification: faithful port, transform/opacity motion, duration/easing tokens, reduced-motion support, and motion-aware verification.

### Limiting Constraint

| constraint type | evidence / note |
|---|---|
| none | No blocker; exact visual approval still requires gallery iteration. |

### Research State Snapshot

| state item | value |
|---|---|
| research questions tracked | 5 |
| searched query families | 5 |
| sources reviewed | 9 |
| official/primary/local sources used | 7 official, 1 secondary, 1 local |
| unresolved questions | final visual taste approval after faithful gallery adapter |
| synthesis status | complete |

### Source Ledger

| source id | title | url/path | source type | checked date | used by claims |
|---|---|---|---|---|---|
| S1 | MDN CSS and JavaScript animation performance | https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/CSS_JavaScript_animation_performance | official | 2026-05-30 | C1 |
| S2 | web.dev High-performance CSS animations | https://web.dev/articles/animations-guide | official | 2026-05-30 | C1 |
| S3 | W3C Understanding SC 2.3.3 Animation from Interactions | https://www.w3.org/WAI/WCAG21/Understanding/animation-from-interactions.html | official | 2026-05-30 | C2 |
| S4 | Apple Reduced Motion evaluation criteria | https://developer.apple.com/help/app-store-connect/manage-app-accessibility/reduced-motion-evaluation-criteria | official | 2026-05-30 | C2 |
| S5 | Material Design Duration and easing | https://m1.material.io/motion/duration-easing.html | official | 2026-05-30 | C3 |
| S6 | Carbon Design System Motion overview | https://carbondesignsystem.com/elements/motion/overview/ | official | 2026-05-30 | C4 |
| S7 | Apple Human Interface Guidelines Motion | https://developer.apple.com/design/human-interface-guidelines/motion | official | 2026-05-30 | C5 |
| S8 | Effective Presentation Handout | https://www.mitemainehealth.org/uploads/Effective-Presentation-Handout-Santiago-.pdf | secondary | 2026-05-30 | C6 |
| S9 | Local motion gap pack | `docs/context/kimai-visual-component-motion-gap-context-research-pack.md` | local | 2026-05-30 | C7 |

### Claim Support Check

| claim id | source id | support verdict | evidence locator / quote summary | reviewer note |
|---|---|---|---|---|
| C1 | S1 | supported | MDN performance guide explains transform/opacity and animation performance | official |
| C1 | S2 | supported | web.dev recommends transform/opacity and avoiding layout/paint properties | official |
| C2 | S3 | supported | WCAG 2.3.3 requires disabling non-essential interaction-triggered motion | official |
| C2 | S4 | supported | Apple recommends detecting Reduce Motion and changing/disabling problematic motion | official |
| C3 | S5 | supported | Material gives short duration/easing guidance and warns against slow animation | official |
| C4 | S6 | supported | Carbon productive vs expressive motion categories | official |
| C5 | S7 | supported | Apple says motion should convey status, feedback, instruction | official |
| C6 | S8 | supported | Assertion-evidence guidance favors visual evidence and reduced cognitive load | secondary |
| C7 | S9 | supported | local pack documents partial recreation and lost motion grammar | local |

### Local Findings

| file | finding | relevance |
|---|---|---|
| `docs/context/kimai-visual-component-motion-gap-context-research-pack.md` | current kh-* is not a faithful lecture-cuts port | implementation direction |
| `디자인.md` | hand-drawn minimal, no gradients/glow/blur, one message per slide | visual constraints |
| `lecture-cuts/assets/style.css` | golden source has component + motion + fit override grammar | adapter source |

### External Findings

| source | source type | finding | checked date |
|---|---|---|---|
| MDN / web.dev | official | animate transform/opacity; avoid layout/paint-heavy properties | 2026-05-30 |
| W3C / Apple | official | support reduced motion and avoid non-essential motion triggers | 2026-05-30 |
| Material / Carbon / Apple HIG | official | use short purposeful motion with natural easing and role separation | 2026-05-30 |
| presentation handout | secondary | assertion/evidence and visual support over text density | 2026-05-30 |

### Implementation Feasibility

- 가능: faithful lecture-cuts adapter, motion tokenization, reduced-motion handling, verifier upgrade.
- 조건부 가능: CSS visual components should remain gallery/prototype until user approves before main deck application.
- 불가능/비추천: add more ad hoc kh-* motion without preserving source component grammar.
- 필요한 라이브러리/도구: no new runtime library; Playwright frame screenshots or trace/video recommended for verification.
- 대체안: generated hand-drawn PNG assets for main deck, CSS components only as supporting interaction/explanation surfaces.

### Risks / Unknowns

- Motion quality is hard to judge with static screenshots only.
- Some lecture-cuts effects use shadow/pulse that may need restrained adaptation for `디자인.md`.
- Reduced-motion mode needs explicit gallery verification, not just CSS presence.

## 4. Context Pack For Next Agent

### Use This Context

- Strengthened plan: faithful adapter first, motion tokens second, verifier third, main deck application last.
- Use external research as constraints, not as a reason to introduce new libraries or decorative motion.

### Do Not Assume

- Do not assume more animation equals better quality.
- Do not assume keyframe presence means motion quality.
- Do not apply to 76-slide Kimai deck until gallery approval.

### Recommended Next Step

- Replace kh-* recreation with faithful `lecture-cuts` component adapters for workbench, harness, flow, gate, bridge, and loop.
- Add motion token CSS: entry 180-240ms, connector 420-700ms, emphasis 1.8-3.6s, reduced-motion none/fade.
- Add verifier checks for transform/opacity-only motion, reduced-motion CSS, source component parity, and Playwright multi-frame evidence.

### Install Recommendations

- No new library required.
- Use existing `npx --yes playwright` workflow for screenshot/frame capture.

### Raw Source List

- https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/CSS_JavaScript_animation_performance
- https://web.dev/articles/animations-guide
- https://www.w3.org/WAI/WCAG21/Understanding/animation-from-interactions.html
- https://developer.apple.com/help/app-store-connect/manage-app-accessibility/reduced-motion-evaluation-criteria
- https://m1.material.io/motion/duration-easing.html
- https://carbondesignsystem.com/elements/motion/overview/
- https://developer.apple.com/design/human-interface-guidelines/motion
- https://www.mitemainehealth.org/uploads/Effective-Presentation-Handout-Santiago-.pdf
- `docs/context/kimai-visual-component-motion-gap-context-research-pack.md`
