---
name: deck-builder
description: Use when editing or rebuilding the lecture-cuts 87-slide HTML/CSS workshop deck.
---

# Lecture Cuts Deck Builder

## When to Use

Use this skill when a task changes `lecture-cuts/` slide HTML, deck metadata, speaker notes, source metadata, visual assets, or presenter-review behavior for the 87-slide workshop deck.

Do not use this skill for the generic `deck-harness/` workflow or unrelated `lecture-deck/` sample deck work.

## Inputs

- `lecture-cuts/source.md`
- `lecture-cuts/slide-spec.json`
- `docs/harness/lecture-cuts-content-inventory.md`
- `docs/harness/lecture-cuts-source-map.json`
- `docs/harness/codex-session-decision-log.md`
- Existing slide HTML under `lecture-cuts/*.html`
- Existing shared runtime files under `lecture-cuts/assets/`
- Existing presenter review at `lecture-cuts/presenter-review.html`
- Existing sources appendix at `lecture-cuts/sources.html`

## Outputs

- Updated slide HTML under `lecture-cuts/*.html`, when explicitly requested.
- Updated shared runtime files under `lecture-cuts/assets/`, when required by the requested deck change.
- Updated `lecture-cuts/slide-spec.json` after intentional content changes.
- Updated source metadata in `docs/harness/lecture-cuts-source-map.json` when slide-visible claims change.
- Updated speaker notes in `lecture-cuts/assets/slides.js` or `lecture-cuts/presenter-preview.html`, matching the slide that changed.
- Verification evidence from `node scripts/verify-lecture-cuts-harness.js`.

## Procedure

1. Read `lecture-cuts/source.md`.
2. Read `lecture-cuts/slide-spec.json`.
3. Read `docs/harness/lecture-cuts-content-inventory.md`.
4. Read `docs/harness/lecture-cuts-source-map.json` and `docs/harness/codex-session-decision-log.md` before using session-derived or source-sensitive rules.
5. Confirm the target slide id, file path, current section, title, speaker source, sources, and `contentHash` from the contract files.
6. Edit slide HTML only after contract context is loaded.
7. Preserve the current 87-slide order and section assignment unless the task explicitly asks to change structure.
8. Keep projector-visible copy concise and Korean-first; keep presenter-only explanation in notes or presenter-review data.
9. Update speaker notes and source metadata with the slide.
10. Regenerate `lecture-cuts/slide-spec.json` after intentional content changes.
11. Run `node scripts/verify-lecture-cuts-harness.js` before handoff.

## Quality Bar

- The visible deck remains a browser-rendered HTML/CSS deck for 1280x720 projector use.
- Every changed slide keeps one clear message and fits its section flow.
- Screen text, speaker notes, source metadata, and presenter review stay synchronized.
- Technical or product/API claims point to source evidence through `docs/harness/lecture-cuts-source-map.json`.
- Speaker notes remain separated from projector deck output.
- Glossary behavior must not introduce native browser title tooltip leakage or partial term matching.
- The reproduction contract is updated only for intentional content changes; accidental `contentHash` drift is a failure.

## Verification

Run these checks before reporting completion:

```sh
node scripts/export-lecture-cuts-contract.js
node scripts/export-lecture-cuts-contract.js --check-confidence
node scripts/verify-lecture-cuts-harness.js
```

For a narrow content edit, also inspect changed slide coverage:

```sh
rg -n "<slide-id>|contentHash|speakerSource|sources" lecture-cuts/slide-spec.json docs/harness/lecture-cuts-content-inventory.md docs/harness/lecture-cuts-source-map.json
```

PASS means the regenerated contract reflects intentional edits, confidence checks pass, and the unified harness verifier exits with status 0. Any `FAIL`, missing slide source, or unexplained hash drift blocks handoff.

## Stop Conditions

- `lecture-cuts/source.md`, `lecture-cuts/slide-spec.json`, or `docs/harness/lecture-cuts-content-inventory.md` is missing when slide editing is required.
- The requested change would alter slide count, order, or section assignment without explicit approval.
- A content edit changes a factual claim but no source evidence can be mapped.
- A speaker note or presenter review update cannot be kept in sync with the slide.
- Contract regeneration or `node scripts/verify-lecture-cuts-harness.js` fails.
