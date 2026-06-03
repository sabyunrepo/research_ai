# Context Research Pack

Status: WARN
Task: KimAI generated deck term-bilingual outline and glossary planning
Artifact owner: Codex
Created: 2026-06-03
Updated: 2026-06-03
Project root: /Users/sabyun/goinfre/research_ai
Brainstorming phase: preflight
Recommended next action: user approval, then source/spec/asset implementation

## 1. Context Triage

### Task Classification

| field | value |
|---|---|
| 작업 유형 | deck/PPT/report material, local repo archaeology |
| 예상 산출물 | KimAI generated deck source/spec/asset/glossary edit plan |
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
| local search | yes | yes | n/a | Used `rg`, Node JSON reads, and screenshots already in deck directory. |
| web search | yes | no | local sources | Not relevant because request depends on local deck contracts and wording. |
| Context7 | no | no | local sources | Library/API docs were not relevant. |
| docs/parser tool | yes | no | local text extraction | Files are local JSON/Markdown/JS, so no parser was needed. |
| browser/screenshot | yes | yes | static file review | Existing slide 9 review screenshot was inspected. |

### Must-Read Context

| path/source | why it matters | status |
|---|---|---|
| `docs/harness/kimai-content/AGENTS.md` | KimAI content source and metaphor dictionary rules | read |
| `deck-harness/AGENTS.md` | Generated deck source-first workflow rules | read |
| `generated-decks/kimai-workshop-content/slide-spec.json` | Slide order, Act opener titles, slide 1 and slide 9 source data | read |
| `generated-decks/kimai-workshop-content/section-plan.json` | Section labels and Act ordering | read |
| `generated-decks/kimai-workshop-content/glossary.json` | Tooltip source terms and definitions | read |
| `generated-decks/kimai-workshop-content/asset-pack.json` | KimAI image generation and character consistency contract | read |
| `generated-decks/kimai-workshop-content/assets/glossary-tooltips.js` | Runtime tooltip matching behavior | read |
| `generated-decks/kimai-workshop-content/review-screenshots/deck-1366x768-slide9.png` | Current visual evidence for slide 9 | read |

### Pre-Brainstorm Notes

- The user wants visible Korean metaphor labels first, with original terms in parentheses.
- The first outline slide should become more visual, not only text bullets.
- Slide 9 should keep KimAI character consistency but regenerate labels with the same six bilingual pairs.
- Tooltip coverage should include easy Korean labels as well as original technical terms where practical.

### Questions For Brainstorming

- None blocking. Assumption: use correct English spellings `Context` and `Skill`, not the typos `Contexxt` or `skiil`.

## 2. Brainstorming Summary

### Agreed Goal

Standardize the KimAI deck around one repeated vocabulary system: easy Korean metaphor label first, original technical term in parentheses.

### Chosen Direction

Use these six canonical visible labels in the first outline slide, slide 9 journey map, Act opener section labels, and relevant recap/final map surfaces:

| order | visible label |
|---|---|
| 1 | 책상 위 자료(Context) |
| 2 | 업무 지시(Prompt) |
| 3 | 회사 내규(CLAUDE.md) |
| 4 | 업무 매뉴얼(Skill) |
| 5 | 역할 카드(Agent) |
| 6 | 완료 검문소(Hook) |

Keep expanded terms such as `Agent/Subagent`, `Evaluation`, and `Quality Gate` in detailed Act slides and glossary entries, but avoid overloading the first outline image.

### Rejected Alternatives

| alternative | why rejected |
|---|---|
| Keep slide 1 text-only | User requested a more image-based outline. |
| Use `정보 선별(Context)` as the first map item | User explicitly prefers the ongoing desk/material metaphor: `책상 위 자료(Context)`. |
| Put every related term in the six-item map | Too dense for a first-viewport outline; detailed terms can remain in Act-specific slides and tooltips. |

### Research Questions After Brainstorming

- Which files own the source wording?
- Which current slides must be changed?
- Which glossary/tooltips are missing?
- Which image assets should be regenerated?
- Which quality gates should close the work?

## 3. Targeted Research

### Search Plan

| research question | query family | example queries | source target | status |
|---|---|---|---|---|
| Which source files own the change? | source rules | `AGENTS.md`, KimAI content rules | local | searched |
| Which slides currently carry the map/Act opener terms? | slide structure | slide IDs, section labels, Act openers, slide 1, slide 9 | local | searched |
| How are tooltips applied? | glossary runtime | `DECK_GLOSSARY`, `glossaryTerms`, tooltip wrapping | local | searched |
| How should image regeneration stay character-consistent? | image asset contract | `kimai-workflow-map`, `characterRefs`, `generationPrompt` | local | searched |
| Which quality gates should close the work? | verification path | build, contract, presentation script, browser render, deck quality | local | searched |

### Search Iterations

| iteration | query families used | new evidence found | unresolved questions | next action |
|---|---|---|---|---|
| 1 | source rules, slide structure, glossary runtime, image asset contract, verification path | Identified source files, slide 1/9 mismatch, missing glossary terms, image prompt constraints, and verification commands | No blocking questions | stop |

### Evidence Table

| claim id | claim | evidence | source id(s) | source type | checked date | confidence | relevance |
|---|---|---|---|---|---|---|---|
| C1 | KimAI Act content and generated deck inputs are source-owned, not final HTML-owned. | Local instructions define Act source docs and generated inputs such as `section-plan.json`, `slide-spec.json`, `asset-pack.json`, and `glossary.json` as the work surface. | S1 | local | 2026-06-03 | high | high |
| C2 | Generated deck fixes should be made in spec/template/asset contracts and then rebuilt. | Deck harness instructions say not to fix only final generated HTML and to rerun build/quality gates. | S2 | local | 2026-06-03 | high | high |
| C3 | Current slide 1 is text-only and uses `정보 선별(Context)` as the first item. | Slide 1 has no `visualAssetId`, uses `single-concept`, and its bullets include `정보 선별(Context)`. | S3 | local | 2026-06-03 | high | high |
| C4 | Current slide 9 uses `kimai-workflow-map` and short labels only. | Slide 9 references `visualAssetId: kimai-workflow-map`, and the render screenshot shows labels `자료`, `지시`, `내규`, `매뉴얼`, `역할`, `검증`. | S3, S8 | local | 2026-06-03 | high | high |
| C5 | Runtime tooltip coverage is term-string based, so Korean metaphor labels need glossary entries or explicit rendered term strings. | The tooltip script builds a regex from `window.DECK_GLOSSARY` terms and wraps matching text nodes. | S5, S7 | local | 2026-06-03 | high | high |
| C6 | Several slides mention terms that are not included in `glossaryTerms`. | Local scan found missing `CLAUDE.md` on slide 1 and 30, `Context` on slide 9, and `Stop Hook` on Act 6 slides. | S3, S5 | local | 2026-06-03 | high | high |
| C7 | The existing image asset contract already supports KimAI character consistency. | Asset definitions use `characterRefs: ["kimai"]` and prompts describe minimal black linework, one blue accent, and KimAI identity. | S6 | local | 2026-06-03 | high | high |

### Sufficiency Check

| criterion | status | evidence / note |
|---|---|---|
| enough distinct query families used | pass | Five local query families used. |
| official/primary sources checked | pass | Local project instructions and source specs are primary for this task. |
| local project context checked when relevant | pass | AGENTS, slide spec, section plan, glossary, assets, runtime, screenshot checked. |
| implementation/example evidence checked when relevant | pass | Existing render screenshot and asset contract checked. |
| risk/limitation/deprecation checked | pass | Image regeneration and tooltip matching risks identified. |
| contradictions or uncertainty recorded | pass | User typos noted; plan assumes correct `Context` and `Skill`. |
| stop condition is explicit | pass | Research stopped after source ownership, mismatch, and implementation layer were identified. |

### Stop Condition

- Stopped because all implementation surfaces are locally identified and no external/current facts are needed.

### Limiting Constraint

| constraint type | evidence / note |
|---|---|
| local_only | Image generation has not been executed in this planning pass; final acceptance must include regeneration and visual QA. |

### Research State Snapshot

| state item | value |
|---|---|
| research questions tracked | 4 |
| searched query families | source rules, slide structure, glossary runtime, image asset contract, verification path |
| sources reviewed | 8 |
| official/primary/local sources used | local project instructions, generated deck specs, runtime JS, screenshot |
| unresolved questions | none blocking |
| synthesis status | complete |

### Source Ledger

| source id | title | url/path | source type | checked date | used by claims |
|---|---|---|---|---|---|
| S1 | KimAI content rules | `docs/harness/kimai-content/AGENTS.md` | local | 2026-06-03 | C1 |
| S2 | Deck harness rules | `deck-harness/AGENTS.md` | local | 2026-06-03 | C2 |
| S3 | KimAI slide spec | `generated-decks/kimai-workshop-content/slide-spec.json` | local | 2026-06-03 | C3, C4, C6 |
| S4 | KimAI section plan | `generated-decks/kimai-workshop-content/section-plan.json` | local | 2026-06-03 | C1 |
| S5 | KimAI glossary | `generated-decks/kimai-workshop-content/glossary.json` | local | 2026-06-03 | C5, C6 |
| S6 | KimAI asset pack | `generated-decks/kimai-workshop-content/asset-pack.json` | local | 2026-06-03 | C7 |
| S7 | Glossary tooltip runtime | `generated-decks/kimai-workshop-content/assets/glossary-tooltips.js` | local | 2026-06-03 | C5 |
| S8 | Slide 9 render screenshot | `generated-decks/kimai-workshop-content/review-screenshots/deck-1366x768-slide9.png` | local | 2026-06-03 | C4 |

### Claim Support Check

| claim id | source id | support verdict | evidence locator / quote summary | reviewer note |
|---|---|---|---|---|
| C1 | S1 | supported | KimAI content source scope and document role rules | Directly supports source ownership. |
| C2 | S2 | supported | Generated deck workflow rules | Directly supports source-first rebuild workflow. |
| C3 | S3 | supported | Slide 1 fields | Directly supports current mismatch. |
| C4 | S3 | supported | Slide 9 fields | Directly supports current asset mapping. |
| C4 | S8 | supported | Screenshot labels | Directly supports current short labels. |
| C5 | S5 | supported | Glossary term registry | Supports available tooltip source strings. |
| C5 | S7 | supported | Tooltip regex logic | Directly supports string-match runtime behavior. |
| C6 | S3 | supported | Slide text and glossaryTerms scan | Directly supports missing slide term registration. |
| C6 | S5 | supported | Glossary term registry | Shows terms exist but are not always referenced. |
| C7 | S6 | supported | `characterRefs` and generation prompts | Directly supports consistency mechanism. |

### Local Findings

| file | finding | relevance |
|---|---|---|
| `generated-decks/kimai-workshop-content/slide-spec.json` | Slide 1 uses text-only `single-concept`, no `visualAssetId`. | Needs new visual outline asset or template change. |
| `generated-decks/kimai-workshop-content/slide-spec.json` | Slide 9 uses `kimai-workflow-map`, currently short labels. | Regenerate this image and update bullets/anchors. |
| `generated-decks/kimai-workshop-content/glossary.json` | Has technical terms and some Korean metaphor entries, but not all canonical Korean labels. | Add/adjust glossary coverage for repeated visible labels. |
| `generated-decks/kimai-workshop-content/assets/glossary-tooltips.js` | Runtime wraps terms by glossary term text. | Korean labels need entries or explicit matching support. |
| `generated-decks/kimai-workshop-content/asset-pack.json` | Existing image prompts use KimAI character refs and style constraints. | Reuse these constraints for new/regenerated images. |

### External Findings

| source | source type | finding | checked date |
|---|---|---|---|
| n/a | secondary | External research not needed for local deck wording and asset contracts. | 2026-06-03 |

### Implementation Feasibility

- 가능: source/spec/glossary/asset-pack edits, image regeneration, deck rebuild, and browser QA.
- 조건부 가능: tooltip for Korean labels either by adding glossary entries or enhancing tooltip aliases in the runtime/build layer.
- 불가능/비추천: final slide HTML only edits, because rebuild would overwrite them.
- 필요한 라이브러리/도구: existing deck harness scripts, Playwright render checks, image generation if new bitmap assets are required.
- 대체안: if image generation is unstable, use deterministic HTML/CSS visual cards for slide 1 and only regenerate slide 9.

### Risks / Unknowns

- Generated images may miss exact Korean text; semantic review must check every label.
- A large glossary alias expansion may over-wrap common Korean words if terms are too generic.
- Section label changes affect navigation, scripts, and generated registry, so rebuild and script sync checks are required.

## 4. Context Pack For Next Agent

### Use This Context

- Canonical first-level labels should be: `책상 위 자료(Context)`, `업무 지시(Prompt)`, `회사 내규(CLAUDE.md)`, `업무 매뉴얼(Skill)`, `역할 카드(Agent)`, `완료 검문소(Hook)`.
- Use correct English spellings `Context` and `Skill`.
- Keep detailed terms like `Agent/Subagent`, `Evaluation`, `Quality Gate`, and `Stop Hook` in Act-specific detail slides and glossary.

### Do Not Assume

- Do not assume final generated HTML is a durable edit target.
- Do not assume current tooltip coverage catches Korean metaphor labels.
- Do not assume image labels are acceptable until screenshots are visually inspected.

### Recommended Next Step

- Ask for approval, then update source/spec/glossary/asset-pack, regenerate the two requested visual assets, rebuild, and run deck quality gates.

### Install Recommendations

- none

### Raw Source List

- `generated-decks/kimai-workshop-content/term-bilingual-outline-raw-source-list.md`
