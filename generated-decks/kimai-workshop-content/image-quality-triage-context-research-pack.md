# Context Research Pack

Status: PASS
Task: Explain why the new slide 1 and slide 9 generated images look lower quality than the existing KimAI deck assets.
Artifact owner: Codex
Created: 2026-06-03
Updated: 2026-06-03
Project root: /Users/sabyun/goinfre/research_ai
Brainstorming phase: preflight
Recommended next action: Regenerate slide 1 and slide 9 as high-legibility single PNGs with fewer micro-labels inside the raster image, or make the raster image the primary full-width visual while keeping glossary anchors as separate HTML.

## 1. Context Triage

### Task Classification

| field | value |
|---|---|
| 작업 유형 | deck/PPT visual quality debugging |
| 예상 산출물 | 원인 브리핑 및 수정 방향 |
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
| local search | yes | yes | n/a | `find`, `rg`, Node JSON inspection |
| web search | yes | no | local sources | Not needed for local image quality diagnosis |
| Context7 | no | no | local sources | Not relevant |
| docs/parser tool | yes | yes | local text extraction | HTML/CSS/spec JSON inspected directly |
| browser/screenshot | yes | yes | static image review | Playwright CLI screenshots and `view_image` were used |

### Must-Read Context

| path/source | why it matters | status |
|---|---|---|
| generated-decks/kimai-workshop-content/assets/visuals/kimai-new-employee-single.png | Existing high-quality KimAI character baseline | read |
| generated-decks/kimai-workshop-content/assets/visuals/kimai-company-context-blanks-single.png | Existing high-quality multi-card baseline | read |
| generated-decks/kimai-workshop-content/assets/visuals/kimai-course-outline-map-single.png | New slide 1 visual under review | read |
| generated-decks/kimai-workshop-content/assets/visuals/kimai-workflow-map-single.png | New slide 9 visual under review | read |
| generated-decks/kimai-workshop-content/slides/act0-course-outline-term-map.html | Confirms slide 1 uses a single PNG plus separate glossary anchors | read |
| generated-decks/kimai-workshop-content/slides/act0-journey-map.html | Confirms slide 9 uses a single PNG plus separate glossary anchors | read |
| generated-decks/kimai-workshop-content/assets/style.css | Determines displayed image size and scaling | read |

### Pre-Brainstorm Notes

- The current output is not CSS-drawn card art in the final visual. Slide 1 and slide 9 render single PNG files in the media column.
- The apparent quality drop is mainly caused by density and scaling: six cards plus bilingual labels are compressed into a right-column image area.

### Questions For Brainstorming

- Should the raster image carry all six bilingual labels, or should the single image be more illustrative while the left glossary anchors carry precise text?
- Should slide 1 use a wider/full-slide visual layout to preserve readability?

## 2. Brainstorming Summary

### Agreed Goal

Keep slide 1 and slide 9 as generated single images, preserve KimAI character consistency, and keep six hoverable glossary anchors on the left.

### Chosen Direction

Diagnose why the generated single images look worse than existing images before regenerating again.

### Rejected Alternatives

| alternative | why rejected |
|---|---|
| Continue editing CSS cards | User explicitly requested one image, not CSS-drawn cards |
| Ignore visual quality and only pass structural validation | User-facing deck quality is the issue |

### Research Questions After Brainstorming

- Are the new visuals lower resolution than existing visuals?
- Is the final slide rendering CSS drawing the card map?
- What display constraints make the new image look less crisp?

## 3. Targeted Research

### Search Plan

| research question | query family | example queries | source target | status |
|---|---|---|---|---|
| Compare source asset resolution | local asset inventory | PNG dimensions and file sizes under assets/visuals | local | searched |
| Confirm rendering method | generated HTML inspection | slide 1/9 `<img>` paths and glossary anchors | local | searched |
| Identify display scaling | CSS inspection | `.lc-kimai-image-frame img`, `.visual-figure img` | local | searched |
| Compare visual composition | screenshot/image review | existing KimAI images vs new outline/workflow PNGs | local | searched |
| Confirm rendered outcome | browser screenshot review | slide 1 and slide 9 screenshots from `deck.html` | local | searched |

### Search Iterations

| iteration | query families used | new evidence found | unresolved questions | next action |
|---|---|---|---|---|
| 1 | asset inventory, HTML inspection, CSS inspection, source image review, browser screenshot review | New images have sufficient source pixels but too much text density for the rendered size | Exact preferred redesign needs user/product decision | stop |

### Evidence Table

| claim id | claim | evidence | source id(s) | source type | checked date | confidence | relevance |
|---|---|---|---|---|---|---|---|
| C1 | The new slide 1 and 9 visuals are single PNGs in the generated HTML, not final CSS card drawings. | Slide HTML references `act0-course-outline-term-map-kimai-course-outline-map-single.png` and `act0-journey-map-kimai-workflow-map-single.png` in `<img>` tags. | S5, S6 | local | 2026-06-03 | high | high |
| C2 | Source resolution is not the main problem. | New images are 1586x992; existing high-quality images are usually 1536x1024 or 1672x941. | S1, S2, S3, S4 | local | 2026-06-03 | high | high |
| C3 | Slide 1 downscales the image heavily. | `.lc-kimai-image-frame` uses width up to 560px and the nested image uses `max-height: 330px`. | S7 | local | 2026-06-03 | high | high |
| C4 | Existing high-quality KimAI images carry fewer readable text elements and larger focal subjects. | Reviewed existing images show 1-4 large labels or a single central character; new images carry 6 cards and 12 label fragments inside the raster. | S1, S2, S3, S4 | local | 2026-06-03 | high | high |
| C5 | Image generation quality is constrained by asking the generator to produce exact dense text and character consistency at the same time. | Asset prompts require six exact bilingual labels, a KimAI character, no tiny text, and a single raster image; final assets needed local text compositing to make labels exact. | S8 | local | 2026-06-03 | high | high |

### Sufficiency Check

| criterion | status | evidence / note |
|---|---|---|
| enough distinct query families used | pass | Asset inventory, HTML inspection, CSS inspection, source image review, browser screenshot review |
| official/primary sources checked | n/a | Local deck files are primary sources for this issue |
| local project context checked when relevant | pass | Generated deck assets/spec/HTML/CSS checked |
| implementation/example evidence checked when relevant | pass | Existing high-quality image examples compared |
| risk/limitation/deprecation checked | pass | Main limitation is visual density and scaling, not dependency behavior |
| contradictions or uncertainty recorded | pass | The image is a PNG, but still looks CSS-like because the prompt requested a rigid card diagram |
| stop condition is explicit | pass | Enough evidence to brief cause and next options |

### Stop Condition

- Stop when the source assets, generated HTML, CSS display size, and visual comparison all point to the same likely cause.

### Limiting Constraint

| constraint type | evidence / note |
|---|---|
| none | External research was not needed; the issue is local asset composition and rendering size |

### Research State Snapshot

| state item | value |
|---|---|
| research questions tracked | 3 |
| searched query families | asset inventory, HTML rendering, CSS display constraints, source image visual comparison, browser screenshot review |
| sources reviewed | 8 local sources |
| official/primary/local sources used | local generated deck files |
| unresolved questions | preferred redesign direction |
| synthesis status | complete |

### Source Ledger

| source id | title | url/path | source type | checked date | used by claims |
|---|---|---|---|---|---|
| S1 | Existing KimAI new employee PNG | generated-decks/kimai-workshop-content/assets/visuals/kimai-new-employee-single.png | local | 2026-06-03 | C2, C4 |
| S2 | Existing KimAI company context PNG | generated-decks/kimai-workshop-content/assets/visuals/kimai-company-context-blanks-single.png | local | 2026-06-03 | C2, C4 |
| S3 | New slide 1 outline PNG | generated-decks/kimai-workshop-content/assets/visuals/kimai-course-outline-map-single.png | local | 2026-06-03 | C2, C4 |
| S4 | New slide 9 workflow PNG | generated-decks/kimai-workshop-content/assets/visuals/kimai-workflow-map-single.png | local | 2026-06-03 | C2, C4 |
| S5 | Slide 1 generated HTML | generated-decks/kimai-workshop-content/slides/act0-course-outline-term-map.html | local | 2026-06-03 | C1 |
| S6 | Slide 9 generated HTML | generated-decks/kimai-workshop-content/slides/act0-journey-map.html | local | 2026-06-03 | C1 |
| S7 | Generated deck CSS | generated-decks/kimai-workshop-content/assets/style.css | local | 2026-06-03 | C3 |
| S8 | Asset pack prompts | generated-decks/kimai-workshop-content/asset-pack.json | local | 2026-06-03 | C5 |

### Claim Support Check

| claim id | source id | support verdict | evidence locator / quote summary | reviewer note |
|---|---|---|---|---|
| C1 | S5 | supported | `<img src="../assets/visuals/act0-course-outline-term-map-kimai-course-outline-map-single.png">` | Confirms slide 1 final visual path |
| C1 | S6 | supported | `<img src="../assets/visuals/act0-journey-map-kimai-workflow-map-single.png">` | Confirms slide 9 final visual path |
| C2 | S1 | supported | PNG header and file inventory | Existing baseline source pixels are comparable |
| C2 | S2 | supported | PNG header and file inventory | Existing baseline source pixels are comparable |
| C2 | S3 | supported | PNG header and file inventory | New source pixels are comparable |
| C2 | S4 | supported | PNG header and file inventory | New source pixels are comparable |
| C3 | S7 | supported | `.lc-kimai-image-frame img { width: 100%; max-height: 330px; }` | Main slide 1 compression source |
| C4 | S1 | supported | Visual inspection | Existing image uses a large central character |
| C4 | S2 | supported | Visual inspection | Existing image uses a few large labels |
| C4 | S3 | supported | Visual inspection | New image uses six cards and many label fragments |
| C4 | S4 | supported | Visual inspection | New image uses six cards, arrows, and many label fragments |
| C5 | S8 | supported | Prompt and notes for exact bilingual labels plus local compositing | Explains generator/composition constraint |

### Local Findings

| file | finding | relevance |
|---|---|---|
| generated-decks/kimai-workshop-content/assets/style.css | Slide 1 image is capped to 330px height inside a 560px frame | Dense text becomes small |
| generated-decks/kimai-workshop-content/assets/visuals/kimai-course-outline-map-single.png | Six cards and twelve text pieces are packed into one image | Looks less polished after downscale |
| generated-decks/kimai-workshop-content/assets/visuals/kimai-new-employee-single.png | Existing quality comes from large central character and simple composition | Good baseline |
| generated-decks/kimai-workshop-content/asset-pack.json | New image prompt demands exact text, map structure, and KimAI consistency at once | Increases generation/composition difficulty |

### External Findings

| source | source type | finding | checked date |
|---|---|---|---|
| n/a | n/a | External research skipped because this is local rendering/composition diagnosis | 2026-06-03 |

### Implementation Feasibility

- 가능: Regenerate slide 1/9 as simpler single PNGs using the existing KimAI composition style and much larger cards.
- 조건부 가능: Keep all six bilingual labels inside the image only if the image gets more slide area or fewer competing elements.
- 불가능/비추천: Keep the current right-column size while packing six dense cards plus character and expect the same perceived quality as single-scene KimAI images.
- 필요한 라이브러리/도구: image_gen for raster base; local compositing only for exact Korean/English labels if needed.
- 대체안: Use a high-quality generated illustration with blank/large symbolic cards and rely on left HTML glossary anchors for exact hoverable text.

### Risks / Unknowns

- If exact bilingual text must remain inside the raster image, slide 1 may need a wider layout to preserve readability.
- If the raster image becomes a more illustrative map, the user may still want the exact text visually present, so this needs a design decision.

## 4. Context Pack For Next Agent

### Use This Context

- The quality issue is caused by visual density and rendered-size compression more than by source PNG resolution.
- Slide 1 is more affected than slide 9 because `.lc-kimai-image-frame img` caps it at 330px high.
- Existing high-quality KimAI assets keep characters and labels large with fewer text elements.

### Do Not Assume

- Do not assume the current output is still CSS-card rendering. The generated HTML uses PNG images for slide 1 and slide 9.
- Do not assume higher source resolution alone will solve the perceived quality problem.

### Recommended Next Step

- Present two implementation options: either use a full/wider image layout for these two map slides, or regenerate cleaner single PNGs with fewer/larger internal text elements and keep exact term text in the left glossary anchors.

### Install Recommendations

- none

### Raw Source List

- generated-decks/kimai-workshop-content/image-quality-triage-raw-source-list.md
