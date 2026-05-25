---
name: html-css-deck-builder
description: Use when slide-spec.json exists for a generated deck and HTML/CSS deck files need to be created or refreshed.
---

# HTML CSS Deck Builder

## When to Use

Use this skill only after `slide-spec.json` and its supporting contracts exist and validate.

Do not start slide HTML from research notes, outline text, or visual inspiration alone.

## Inputs

- `generated-decks/<slug>/slide-spec.json`
- `generated-decks/<slug>/claim-source-map.json`
- `generated-decks/<slug>/glossary.json`
- `generated-decks/<slug>/job-manifest.json`
- `deck-harness/templates/deck.html`
- `deck-harness/templates/presenter-review.html`
- `deck-harness/templates/assets/style.css`
- `deck-harness/templates/assets/deck.js`
- `deck-harness/templates/assets/presenter-review.js`
- `docs/harness/codex-session-decision-log.md` when working inside this project harness.

## Outputs

- `generated-decks/<slug>/deck.html`
- `generated-decks/<slug>/presenter-review.html`
- `generated-decks/<slug>/assets/slides.js`
- `generated-decks/<slug>/assets/style.css`
- `generated-decks/<slug>/assets/deck.js`
- `generated-decks/<slug>/assets/presenter-review.js`
- `generated-decks/<slug>/slides/<slide-id>.html`

## Procedure

1. Run the contract validator first; do not write HTML until `slide-spec.json` exists and validates with its source map, section plan, glossary, and manifest.
2. If this is this project harness, read `docs/harness/codex-session-decision-log.md` and apply requirements for browser-rendered HTML/CSS, 1280x720 projector fit, desktop/mobile audit, custom glossary tooltip behavior, presenter review, and reproducible handoff evidence.
3. Preserve screen/speaker separation: projector slides show concise screen text; presenter review shows `speakerNote` and `evidenceClaimIds`.
4. Use `glossary.json` for difficult English or developer terms and avoid native `title` tooltip behavior.
5. Generate one slide HTML file per slide id plus shared assets.
6. Run the quality gate before handoff.

## Quality Bar

- The deck renders as HTML/CSS/JS and fits a 1280x720 projector frame.
- Presenter review exposes speaker notes and evidence for every slide.
- Rendered screen text matches `slide-spec.json`.
- Glossary matching avoids native title tooltips and partial matches.
- No desktop or mobile overflow remains unless covered by a valid allowlist entry.

## Verification

- `node deck-harness/scripts/validate-deck-contract.js generated-decks/<slug>`
- `node deck-harness/scripts/verify-deck-quality.js generated-decks/<slug>`
- `rg -n "speakerNote|evidenceClaimIds|glossary" generated-decks/<slug>/presenter-review.html generated-decks/<slug>/assets/presenter-review.js generated-decks/<slug>/assets/slides.js`
- Confirm every slide id in `slide-spec.json` has `generated-decks/<slug>/slides/<slide-id>.html`.

## Stop Conditions

- `slide-spec.json` does not exist or does not validate.
- Any required output path cannot be generated.
- Screen content and presenter-only content are mixed.
- The quality gate fails and the failure is not a documented, active allowlist exception.
