# Context Research Pack

Status: PASS
Task: Kimai generated deck desktop-only readability and layout scale-up planning
Artifact owner: Codex
Created: 2026-06-01
Updated: 2026-06-01
Project root: /Users/sabyun/goinfre/research_ai
Brainstorming phase: both
Recommended next action: use the Ouroboros plan in this pack to implement a bounded desktop-first typography/layout scale-up through harness templates, then rebuild and verify.

## 1. Context Triage

### Task Classification

| field | value |
|---|---|
| 작업 유형 | deck-harness planning / generated deck visual readability |
| 예상 산출물 | implementation plan, acceptance criteria, verification route |
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
| local search | yes | yes | n/a | `rg`, `find`, `sed`, `nl` used |
| web search | yes | yes | n/a | presentation readability sources checked on 2026-06-01 |
| Context7 | no | no | official docs / package docs | not needed; no library API decision |
| docs/parser tool | yes | yes | local text extraction | local Markdown/CSS/JS inspected |
| browser/screenshot | yes | no | existing screenshot reports | planning-only pass; implementation must rerun screenshots |

### Must-Read Context

| path/source | why it matters | status |
|---|---|---|
| `AGENTS.md` | project-local artifact and verification rules | read |
| `deck-harness/AGENTS.md` | generated-deck edits must fix harness/source layers, not only final HTML | read |
| `deck-harness/templates/assets/style.css` | source CSS template copied into generated deck outputs | read |
| `generated-decks/kimai-workshop-content/assets/style.css` | current rendered deck CSS mirrors the harness template | read |
| `deck-harness/scripts/verify-deck-quality.js` | current quality gate enforces 1024px responsive caps that conflict with desktop-only scale-up | read |
| `generated-decks/kimai-workshop-content/HANDOFF.md` | current state, template distribution, image ownership, verification commands | read |

### Pre-Brainstorm Notes

- User wants Kimai generated decks readable from farther away by using space better, enlarging text/cards and CSS-template components.
- User explicitly says desktop display can be assumed; responsive behavior may be ignored for this task.
- Image enlargement is conditional: do not grow images if it breaks layout. Prefer text/card/layout scaling first.
- Existing generated deck has many user/workflow changes in the working tree. Implementation should avoid reverting unrelated work and should operate through harness templates plus rebuild.

### Questions For Brainstorming

- Should desktop-only quality replace or bypass the current 1024/mobile gate for this deck, or should it be introduced as a separate delivery profile?
- Which screenshots count as sufficient: all 76 slides at 1366x768, plus a template gallery/contact sheet, or only representative slides?

## 2. Brainstorming Summary

### Agreed Goal

Make `generated-decks/kimai-workshop-content` more readable from classroom distance by increasing projector text/card prominence and reducing wasted space, while preserving image layout safety and the generated-deck harness workflow.

### Chosen Direction

Use a desktop-first delivery profile in the harness CSS/template layer:

- Increase default screen text and template component card sizes in `deck-harness/templates/assets/style.css`.
- Keep image max sizes conservative by default; only relax image constraints after screenshot evidence proves no clipping/overflow.
- Update or parameterize the quality gate so desktop-only Kimai delivery is not blocked by the existing 1024px responsive caps.
- Rebuild `generated-decks/kimai-workshop-content` from source and verify all desktop slides, template gallery, and representative image-heavy slides.

### Rejected Alternatives

| alternative | why rejected |
|---|---|
| Directly edit `generated-decks/.../slides/*.html` only | Violates generated-deck workflow; changes are not reusable after rebuild |
| Globally enlarge every image with text | User flagged layout-break risk; current handoff says bitmap images are visual anchors and deck owns text layer |
| Keep responsive/mobile gates unchanged while enlarging desktop typography | Existing 1024px caps would force smaller typography and conflict with desktop-only goal |
| Use browser zoom as the fix | Does not improve layout density or template/card proportions and can clip navigation/frame |

### Research Questions After Brainstorming

- What font-size range is defensible for classroom/projector readability?
- Which local CSS/template rules currently constrain text, cards, and images?
- Which validation gates must change or be run after implementation?

## 3. Targeted Research

### Search Plan

| research question | query family | example queries | source target | status |
|---|---|---|---|---|
| projector-readable text sizes | university slide design / presentation readability | `presentation slide font size projector readability official university` | official | searched |
| accessibility size baseline | WCAG large text / contrast thresholds | `WCAG large scale text definition 18 point 14 point bold` | official | searched |
| typeface and contrast constraints | accessible presentation typography | `accessible presentation sans serif contrast font weight` | official | searched |
| local implementation constraints | generated deck CSS / quality gate / handoff | `font-size`, `projector`, `mainTemplate`, `visual-figure img` | local | searched |
| image-layout risk | local asset and visual contract | `visualAssetId`, `asset-review`, `single-image-first` | local | searched |

### Search Iterations

| iteration | query families used | new evidence found | unresolved questions | next action |
|---|---|---|---|---|
| 1 | official/university slide readability and WCAG large text | multiple sources converge on 24pt minimum, 28-32pt body for in-person readability, 32-40pt titles, simple layouts | exact Korean CSS px targets need empirical screenshot fit | stop |
| 2 | local CSS/gate/handoff archaeology | source template uses h2 48px, message 24px, bullets 22px; 1024 gate caps h2 44/message 22/bullets 20; image templates have 460-500px max heights | exact overflow slides must be found after implementation | stop |

### Evidence Table

| claim id | claim | evidence | source id(s) | source type | checked date | confidence | relevance |
|---|---|---|---|---|---|---|---|
| C1 | A classroom/projector deck should target at least 24pt body-equivalent text, with 28-32pt body and 32-40pt titles as a stronger in-person target. | Stanford recommends 24px/pt-equivalent minimum for in-person PowerPoint; Ohio University suggests 40pt titles, 32pt text, 28pt subtext, and not smaller than 20pt; Waterloo recommends 32pt slide titles and 24pt main points. | S1, S2, S3 | official | 2026-06-01 | high | high |
| C2 | Slide readability also depends on fewer lines and simple layouts, not font size alone. | Ohio recommends limiting rows and avoiding clutter; UTC recommends simple wording and limited lines per slide; Uppsala recommends one message per slide and 5-6 lines. | S2, S4, S5 | official | 2026-06-01 | high | high |
| C3 | The local project already requires generated-deck issues to be fixed in the harness/source layer, not only final HTML. | `deck-harness/AGENTS.md` says visual/content defects should strengthen `slide-spec`, `asset-pack`, templates, scripts, or skills and rebuild. | S6 | local | 2026-06-01 | high | high |
| C4 | Current desktop CSS is close to standard presentation sizes but template/card details remain smaller than desired for far viewing. | Base CSS: h2 48px, message 24px, bullets 22px, presenter cues 18px; template cards include 18px cue label, checklist/card text without explicit larger font, and bridge 18px. | S7 | local | 2026-06-01 | high | high |
| C5 | The current quality gate contains a 1024px responsive cap that conflicts with a desktop-only scale-up. | `checkResponsiveProjectorRules` requires the `@media (max-width: 1100px)` h2 <= 44px, message <= 22px, bullets <= 20px, padding <= 34px. | S8 | local | 2026-06-01 | high | high |
| C6 | Image growth must be conservative because image assets are semantically reviewed visual anchors and the harness owns placement/frame/text. | Handoff records generated artifacts, asset reviews, and says bitmap images are teaching visuals only while the deck harness owns frame, placement, shadow, object-fit, and slide text. | S9 | local | 2026-06-01 | high | high |
| C7 | The current Kimai deck has 76 slides and multiple template families, so scale-up must be checked per-template and all-slide desktop capture is appropriate. | Handoff lists 76-slide verification and current mainTemplate distribution across opening-hero, kimai-structure, decision-gate, term-bridge, brief-window, workflow-strip, assertion-scene, practice-handoff, recap-map. | S9 | local | 2026-06-01 | high | high |

### Sufficiency Check

| criterion | status | evidence / note |
|---|---|---|
| enough distinct query families used | pass | official readability, accessibility baseline, typography/contrast, local CSS/gates, image contract |
| official/primary sources checked | pass | Stanford, Ohio University, Waterloo, UTC, Uppsala, WCAG understanding |
| local project context checked when relevant | pass | AGENTS, CSS template, generated CSS, quality gate, HANDOFF |
| implementation/example evidence checked when relevant | pass | current CSS values and verification scripts inspected |
| risk/limitation/deprecation checked | pass | responsive gate conflict and image scaling risk recorded |
| contradictions or uncertainty recorded | pass | exact px targets require screenshot iteration after implementation |
| stop condition is explicit | pass | enough evidence to draft an Ouroboros execution plan |

### Stop Condition

Research stopped after external sources converged on presentation text-size ranges and local inspection identified the exact harness layers and gate conflicts that determine implementation scope.

### Limiting Constraint

| constraint type | evidence / note |
|---|---|
| none | No tool blocker. Browser screenshot verification is deferred to implementation because this turn is a planning/research pass. |

### Research State Snapshot

| state item | value |
|---|---|
| research questions tracked | 3 |
| searched query families | 5 |
| sources reviewed | 9 |
| official/primary/local sources used | 9 |
| unresolved questions | exact per-template px values and overflow slides after implementation |
| synthesis status | complete |

### Source Ledger

| source id | title | url/path | source type | checked date | used by claims |
|---|---|---|---|---|---|
| S1 | Stanford UIT Fonts and Font Sizes | https://uit.stanford.edu/accessibility/learn-about/typography/fonts | official | 2026-06-01 | C1 |
| S2 | Ohio University Visual Presentation | https://www.ohio.edu/medicine/about/offices/information-learning-tech/visual-presentation | official | 2026-06-01 | C1, C2 |
| S3 | University of Waterloo Font Size Guidelines | https://ece.uwaterloo.ca/~dwharder/Presentations/Guidelines/VisualAids/TextFormat/Size/ | official | 2026-06-01 | C1 |
| S4 | University of Tennessee at Chattanooga Slide Design | https://www.utc.edu/academic-affairs/walker-center-for-teaching-and-learning/learning-technologies/slide-design | official | 2026-06-01 | C2 |
| S5 | Uppsala University Oral Presentations With Slides | https://www.uu.se/en/students/faculty/pharmacy/puff/guide-to-written-and-oral-communication/oral-presentations-with-slides | official | 2026-06-01 | C2 |
| S6 | Deck Harness Instructions | `deck-harness/AGENTS.md:10-13` | local | 2026-06-01 | C3 |
| S7 | Harness CSS Template | `deck-harness/templates/assets/style.css:49-180`, `deck-harness/templates/assets/style.css:496-650` | local | 2026-06-01 | C4 |
| S8 | Deck Quality Gate Responsive Caps | `deck-harness/scripts/verify-deck-quality.js:497-520` | local | 2026-06-01 | C5 |
| S9 | Kimai Workshop Handoff | `generated-decks/kimai-workshop-content/HANDOFF.md:1-120` | local | 2026-06-01 | C6, C7 |

### Claim Support Check

| claim id | source id | support verdict | evidence locator / quote summary | reviewer note |
|---|---|---|---|---|
| C1 | S1 | supported | font-size recommendation section | point-to-CSS mapping remains approximate |
| C1 | S2 | supported | title/text/subtext recommendation section | supports stronger classroom target |
| C1 | S3 | supported | recommended font-size table | supports title/main-point ranges |
| C2 | S2 | supported | rows-per-slide and clutter guidance | supports copy/layout limits |
| C2 | S4 | supported | readability and amount-of-information guidance | supports copy/layout limits |
| C2 | S5 | supported | one-message and line-count guidance | supports copy/layout limits |
| C3 | S6 | supported | lines 10-13 | direct local instruction |
| C4 | S7 | supported | CSS line ranges with current font/card values | exact visual fit needs screenshot |
| C5 | S8 | supported | function checks numeric caps | direct gate conflict |
| C6 | S9 | supported | lines 87-95 | direct image ownership guidance |
| C7 | S9 | supported | lines 69-83 and verification command list | all-slide verification likely justified |

### Local Findings

| file | finding | relevance |
|---|---|---|
| `deck-harness/templates/assets/style.css` | Source template and generated deck CSS currently match for core scale values. | Edit the template first, rebuild generated CSS. |
| `generated-decks/kimai-workshop-content/assets/style.css` | Generated output has same base typography and media-query structure. | Do not hand-edit unless used only for diagnosis. |
| `deck-harness/scripts/verify-deck-quality.js` | Responsive 1024 gate enforces smaller type than the desktop-only target. | Needs profile flag or desktop-only gate path. |
| `generated-decks/kimai-workshop-content/HANDOFF.md` | Current deck owns image placement in harness and has 76 slides with template distribution. | Verification must include all-slide desktop capture and image-safe review. |

### External Findings

| source | source type | finding | checked date |
|---|---|---|---|
| Stanford UIT | official | in-person PowerPoint minimum around 24px/pt-equivalent; readable fonts and weight matter | 2026-06-01 |
| Ohio University | official | 40pt title, 32pt text, 28pt subtext, simple slides, limited rows | 2026-06-01 |
| Waterloo ECE | official | 32pt slide titles, 24pt main points, 20pt secondary points | 2026-06-01 |
| UTC | official | 18-24pt minimum for projection; simple wording and limited lines | 2026-06-01 |
| Uppsala University | official | sans serif 22-24pt minimum, one message per slide, 5-6 lines | 2026-06-01 |

### Implementation Feasibility

- 가능: base headline/body/bullet/card scale-up, tighter desktop layout, template component card enlargement, all-slide screenshot verification.
- 조건부 가능: image frame/image max-size increase only after template-specific screenshot evidence shows no clipping.
- 불가능/비추천: final HTML-only patch, global browser zoom, blanket image upscaling.
- 필요한 라이브러리/도구: existing Node scripts and Playwright screenshot workflow.
- 대체안: if desktop-only gate is too disruptive, create a deck-local CSS variant/profile such as `deliveryProfile: "desktop-projector"` and keep legacy responsive rules for other decks.

### Risks / Unknowns

- Some long Korean headlines may overflow after scale-up; repair should split slides or shorten `rewrittenScreen`, not hide text.
- Larger card text can break `workflow-strip`, `term-bridge`, and `decision-gate` templates first.
- Existing git worktree is already dirty with many Kimai deck and harness changes; implementation must preserve unrelated changes and avoid reset/revert.
- Current mobile evidence will likely become obsolete or intentionally out of scope; quality reports must state desktop-only scope clearly.

## 4. Context Pack For Next Agent

### Use This Context

- Treat desktop classroom readability as the target, not mobile responsiveness.
- Work at the harness/source layer: CSS template, quality gate profile, maybe slide-spec copy if overflow remains.
- Preserve image safety: do not increase image dimensions by default; change text/card/layout first.
- Rebuild `generated-decks/kimai-workshop-content` and refresh `browser-render-report.json` with current deck output hash.

### Do Not Assume

- Do not assume current `verify-deck-quality.js` will pass unchanged after typography scale-up.
- Do not assume all slides can survive a global font-size bump; expect per-template tuning.
- Do not assume image labels are authoritative lecture text; HTML text layer remains the readable source.
- Do not assume existing screenshots are fresh after any CSS/template change.

### Recommended Next Step

Run the Ouroboros plan:

1. Add a desktop-projector delivery profile or gate option.
2. Increase base and template typography/card values in the source CSS template.
3. Rebuild the Kimai deck.
4. Capture all 76 desktop slides at 1366x768 plus template gallery/contact sheet.
5. Repair any overflow by reducing density, splitting text, or template-specific spacing; only enlarge images where screenshots prove it is safe.
6. Run final quality gates with desktop-only scope recorded in HANDOFF and quality report.

### Install Recommendations

- No new install required. Use existing deck-harness Node scripts and Playwright path.
- Context7 not required for this task.

### Raw Source List

- https://uit.stanford.edu/accessibility/learn-about/typography/fonts
- https://www.ohio.edu/medicine/about/offices/information-learning-tech/visual-presentation
- https://ece.uwaterloo.ca/~dwharder/Presentations/Guidelines/VisualAids/TextFormat/Size/
- https://www.utc.edu/academic-affairs/walker-center-for-teaching-and-learning/learning-technologies/slide-design
- https://www.uu.se/en/students/faculty/pharmacy/puff/guide-to-written-and-oral-communication/oral-presentations-with-slides
- https://www.w3.org/WAI/WCAG20/versions/understanding/wcag20-understanding-20081211-letter.pdf
- `deck-harness/AGENTS.md`
- `deck-harness/templates/assets/style.css`
- `deck-harness/scripts/verify-deck-quality.js`
- `generated-decks/kimai-workshop-content/HANDOFF.md`
