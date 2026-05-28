# Deck Handoff

## Current State

`kimai-act0-prototype` is a one-slide Act 0 sample generated through `deck-harness`, not a one-off hand-written slide. The harness was improved to support presenter cues, bridge text, visual assets, visual prompts, interaction metadata, `asset-pack.json`, and XML-style prompt boundaries in `slide-spec.json`.

Task 3 of the Kimai image sheet implementation is complete: `lecture-cuts/assets/generated/kimai-work-environment-sheet.png` exists, `kimai-journey-map` is cropped into a real projector asset, `slide-spec.json` references `kimai-journey-map`, and `asset-review.json` records concrete PASS evidence for the generated crop.

The deck now passes the semantic asset review gate and Task 4 browser/Playwright visual inspection across viewports.

## Inputs

- topic-intake.md
- research-dossier.md
- claim-source-map.json
- section-plan.json
- slide-spec.json
- glossary.json
- asset-pack.json
- prompts/kimai-work-environment-sheet.xml
- lecture-cuts/assets/generated/kimai-work-environment-sheet.png

## Evidence Map Status

PASS. The slide references `claim-001`, which resolves to the local redesign master spec. `claim-002` is retained as speaker-note visual-system support.

## Source Coverage

- `claim-001`: `docs/harness/lecture-cuts-redesign-master-spec.md`
- `claim-002`: `디자인.md`

## Generated Artifacts

- deck.html
- presenter-review.html
- assets/slides.js
- assets/style.css
- assets/deck.js
- assets/presenter-review.js
- assets/visuals/act0-workflow-map-kimai-journey-map.png
- slides/act0-workflow-map.html

## Quality Gate Artifacts

- evaluation-log.md
- quality-gate-report.md
- visual-inspection-report.md

## Verification

Command: node deck-harness/scripts/validate-deck-contract.js generated-decks/kimai-act0-prototype
Exit Code: 0
Artifact Path: terminal output

Command: node deck-harness/scripts/build-deck-from-spec.js generated-decks/kimai-act0-prototype
Exit Code: 0
Artifact Path: generated-decks/kimai-act0-prototype/assets/slides.js

Command: node deck-harness/scripts/verify-deck-quality.js generated-decks/kimai-act0-prototype
Exit Code: 0
Artifact Path: generated-decks/kimai-act0-prototype/quality-gate-report.md

Browser Check:
URL: http://127.0.0.1:4178/generated-decks/kimai-act0-prototype/deck.html
Viewports: 1440x900, 1024x768
Result: PASS. Wide visual layout renders the Kimai journey map at 1120x214 on 1440x900 and 900x172 on 1024x768 without overflow.

Presenter Review Check:
URL: http://127.0.0.1:4178/generated-decks/kimai-act0-prototype/presenter-review.html
Viewport: 1440x900
Result: PASS. Visual Semantic Contract, Visual Review Status, Status PASS, Score 90, Asset Trace, sourceAssetId, assetCrop, renderedVisualAsset, and Forbidden Element Findings are visible.

Visual Inspection Evidence:
- generated-decks/kimai-act0-prototype/visual-inspection/kimai-act0-deck-1440x900.png
- generated-decks/kimai-act0-prototype/visual-inspection/kimai-act0-deck-1024x768.png
- generated-decks/kimai-act0-prototype/visual-inspection/kimai-act0-presenter-review-1440x900.png
- generated-decks/kimai-act0-prototype/visual-inspection/kimai-act0-deck-1440x900-snapshot.md
- generated-decks/kimai-act0-prototype/visual-inspection/kimai-act0-deck-1024x768-snapshot.md
- generated-decks/kimai-act0-prototype/visual-inspection/kimai-act0-presenter-review-snapshot.md

Screen/Presenter Separation:
Projector slide HTML is rendered from `xmlPrompt.screenContent` only. Presenter cues, asset teaching roles, explanation anchors, and XML generator instructions are retained in `assets/slides.js` and presenter review metadata, but are not shown in `slides/act0-workflow-map.html`.

## Agent Findings

Status: PASS
Evidence path: generated-decks/kimai-act0-prototype/asset-review.json

`kimai-journey-map` is reviewed as PASS with score 90. The review cites concrete observed elements: central Kimai, left manager request, instruction clipboard, context/material panel, company rules board, skill/manual panel, role-split agent team, tools/permissions panel, and final verification gate.

## Blocked Risks

- None for Act 0 prototype Task 4.

## Non-Blocking Risks

- The old `kimai-workflow-map` asset remains in `asset-pack.json` as historical baseline, but `slide-spec.json` now points to `kimai-journey-map`.
- The Act 0 journey map is visually usable at 1024x768, but some small in-image Korean labels may be hard to read from the back of a classroom. Treat the image as a visual anchor, not as text content.
- Full deck production should still compare one-slide and two-slide versions for Act 0.

## Next Prompt

Proceed to the next implementation plan: register and review Act 1-6 crop assets one by one, or start integrating the Kimai asset sheet into the full lecture-cuts deck.
