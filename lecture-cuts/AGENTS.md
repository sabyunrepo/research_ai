# Lecture Cuts Agent Instructions

## Instruction Ownership

전역/사용자 레벨 AGENTS.md는 비워 두고, 이 프로젝트의 지침은 이 파일에서 관리한다.
Shared agent rules may be added here only when they preserve this directory's slide contract, source metadata, and verification gates.

## Scope

These instructions apply to `lecture-cuts/` and its children.

## Required Reads Before Editing Slides

1. Read `lecture-cuts/source.md`.
2. Read `lecture-cuts/slide-spec.json`.
3. Read `docs/harness/lecture-cuts-content-inventory.md`.
4. Read `docs/harness/lecture-cuts-source-map.json` when changing factual claims or source metadata.
5. Read `docs/harness/codex-session-decision-log.md` when changing harness behavior, agents, skills, or handoff rules.
6. Read `lecture-cuts/skills/korean-copy-review/SKILL.md` when changing Korean slide copy, presenter scripts, terminology, or slide-script alignment.
7. Read `lecture-cuts/skills/slide-script-composition-review/SKILL.md` when reviewing whether slide structure, presenter script, and neighboring flow work together as a teachable presentation.

## Rules

1. Treat `lecture-cuts/slide-spec.json` as the current reproduction contract.
2. Keep visible deck output stable unless the task explicitly asks for copy, source, or visual changes.
3. Manage slide copy and presenter script as one unit:
   - If slide HTML, title, subtitle, bullets, visual evidence, or `div.note` changes, update the matching presenter script in `lecture-cuts/assets/slides.js` or `lecture-cuts/presenter-preview.html` in the same change.
   - If a presenter script changes the teaching point, claim, example, order, or timing, update the matching slide HTML and `div.note` in the same change.
   - Do not leave generic presenter text in place when the visible slide carries a specific example, code sample, diagram, or source-sensitive claim.
4. Update source metadata with any content claim change.
5. Regenerate `slide-spec.json` after intentional slide content or presenter script changes.
6. Do not hide verification failures by removing checks, weakening tests, or deleting warnings.
7. Update `lecture-cuts/HANDOFF.md` and `docs/harness/lecture-cuts-agent-handoff.md` when work affects harness state.
8. For Korean copy rewrites, preserve official file names and commands but keep learner-facing explanation Korean-first.
9. For slide/script composition reviews, produce a concrete report before editing and classify each finding by screen, script, flow, or load.

## Presentation Surface Contract

1. `deck.html` is the actual stage screen shown on the presentation display. It must show only audience-safe slide content and must not expose speaker notes, raw prompts, source-only metadata, or presenter scripts.
2. `speaker.html` is the presenter-owned console. It provides the current slide, next slide, presenter prompt, timer, and previous/next controls for the person running the lecture.
3. `audience.html` is the attendee review screen. Attendees may navigate only through slides the presenter has already reached; they must not advance the live stage state.
4. `deck.html`, `speaker.html`, and `audience.html` share the same server-held presentation state when served through the lecture-cuts review server.
5. Public or attendee-facing routes must not expose raw slide HTML, `assets/slides.js`, `.note` content, presenter scripts, raw generation prompts, or source-only metadata.

## Design And Build Direction

1. Use the repository-level `디자인.md` as the default visual direction for lecture-cuts work.
2. Preserve the hand-drawn minimal system:
   - handwritten-feeling headlines
   - readable sans-serif body text
   - white background
   - black text
   - one primary accent color, with a second accent only when justified
   - simple line-based generated illustrations
3. Do not lower visual quality by hand-writing one-off slide HTML outside the established slide contract.
4. Do not replace the existing generated-image and hand-drawn asset direction with dense CSS diagrams, dashboards, gradients, glass effects, glow effects, or decorative card grids.
5. Use generated-image or existing hand-drawn assets for conceptual slides when the visual is meant to carry the teaching metaphor.
6. Use CSS visuals only when they represent an actual interactive practice state, validation log, checklist, form, preview, or tool output that the learner needs to inspect.
7. Build improvements by adapting the existing deck skills and harness:
   - `lecture-cuts/skills/deck-builder/SKILL.md` for lecture-cuts slide edits
   - `lecture-cuts/skills/slide-script-composition-review/SKILL.md` for slide-as-navigation review
   - `lecture-cuts/skills/korean-copy-review/SKILL.md` for Korean learner-facing copy
   - `deck-harness/skills/slide-spec-builder/SKILL.md` before new generated deck HTML
   - `deck-harness/skills/html-css-deck-builder/SKILL.md` for HTML/CSS generation from a validated spec
   - `deck-harness/skills/deck-quality-gate/SKILL.md` before handoff or PASS claims
8. For redesigned slides, define `slide-spec` first: message, screen text, visual intent, generated-image need, glossary terms, speaker note, evidence IDs, interaction requirement, and acceptance criteria.
9. For image generation, write the prompt as a reusable asset requirement before generating the image. The prompt must preserve the deck style: simple hand-drawn line illustration, white background, minimal black linework, one blue accent, no glossy or photorealistic treatment.
10. Store lecture-specific visual assets in an asset-pack style contract before slide implementation. The contract must include asset id, teaching role, generation prompt, style constraints, explanation anchors, source path, and crop metadata when a larger generated sheet is sliced into per-slide assets. Crop regions must be materialized into real image files during build, not left as CSS crop views in projector slides.
11. Redesigned slides should reference assets by id, not by repeatedly pasting long image prompts or file paths into every slide.
12. Use XML-style boundaries when prompting or documenting slide generation:
   - `<instruction>` contains the generator instruction.
   - `<screen_content>` contains only what may appear on the projector slide.
   - `<speaker_navigation>` contains the short cues that let the presenter speak without a separate script.
   - `<asset_requirement>` contains what the image must explain.
13. Do not let raw source text, generation instructions, or image prompts leak into projector-visible slide content.
14. For general-audience terminology, attach glossary/tooltip behavior through the existing glossary system rather than native browser `title` attributes.
15. For interactive practice slides, keep the lecture slide visually minimal and move dense controls, scoring, logs, and previews into the practice UI section or audience page.

## Verification

Before final completion, run:

```sh
node scripts/export-lecture-cuts-contract.js --check-confidence
node scripts/validate-lecture-cuts-contract.js
node scripts/audit-lecture-cuts.js
node scripts/audit-lecture-cuts-korean-copy.js
node scripts/audit-lecture-cuts-speaker-sync.js
node scripts/verify-lecture-cuts-harness.js
```

If a slide changed intentionally, run this first:

```sh
node scripts/export-lecture-cuts-contract.js
```
