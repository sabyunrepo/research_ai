# Kimai Workshop Content Handoff

## Current State

Kimai lecture deck source, visual assets, generated HTML deck, presenter review, and quality artifacts are present for `generated-decks/kimai-workshop-content`.

## Inputs

- `claim-source-map.json`
- `section-plan.json`
- `slide-spec.json`
- `glossary.json`
- `asset-pack.json`
- `asset-generation-prompts.md`
- `디자인.md`

## Evidence Map Status

All `evidenceClaimIds` referenced by `slide-spec.json` resolve through `claim-source-map.json`.

## Source Coverage

The deck covers Act 0 through Act 6 lecture content. Practice UI/runtime is intentionally outside this generated lecture deck scope.

## Generated Artifacts

- `deck.html`
- `presenter-review.html`
- `template-gallery.html`
- `single-image-generated-review.html`
- `assets/slides.js`
- `slides/*.html`
- `assets/visuals/*.png`
- `asset-review.json` with current asset SHA-256 and semanticRequirements SHA-256 evidence for projector-referenced visuals
- `browser-render-report.json`
- `review-screenshots/*.png`

## Quality Gate Artifacts

- `asset-build-report.md`
- `quality-gate-report.md`
- `visual-generation-verifier-report.md`
- `browser-render-report.json`
- `evaluation-log.md`

## Template Application Evidence

The harness now resolves semantic metadata in `assets/slides.js` and rendered slide HTML:

- `layoutTemplate`, `teachingMove`, `audienceAction`, `visualMode`, `templateSelectionReason`
- `mainTemplate`, mirrored into each slide as `data-main-template` and `slide-template--*`

Representative rendered template mappings:

- `act0-journey-map`: `layoutTemplate=concept-map`, `mainTemplate=workflow-strip`; selected because the slide introduces the session map.
- `act2-prompt-reframing`: `layoutTemplate=concept-map`, `mainTemplate=workflow-strip`; selected because the slide reframes prompt writing as a work instruction flow.
- `act4-short-procedure`: `layoutTemplate=concept-map`, `mainTemplate=workflow-strip`; selected because the slide describes execution order and output format.
- `act0-kimai-capable`: `layoutTemplate=story-scene`, `mainTemplate=kimai-structure`; selected because the slide uses an existing Kimai generated image as the main explanatory structure.
- `act0-company-context`: `layoutTemplate=checklist`, `mainTemplate=decision-gate`; selected because the slide asks for required context checks.
- `act6-loop-control-recheck`: `layoutTemplate=checklist`, `mainTemplate=decision-gate`; selected because the slide is about pass/hold recheck rules.
- `act0-harness-concept`: `layoutTemplate=glossary-bridge`, `mainTemplate=term-bridge`; selected because it is the first glossary bridge for Harness Engineering.

Gallery visual evidence:

- `review-screenshots/template-gallery-kimai-structure.png`
- `review-screenshots/template-gallery-three-step-flow-bold.png`
- `review-screenshots/single-image-generated-review.png`

Current `mainTemplate` distribution after rebuild:

```json
{
  "opening-hero": 4,
  "kimai-structure": 17,
  "decision-gate": 5,
  "term-bridge": 24,
  "brief-window": 5,
  "workflow-strip": 10,
  "assertion-scene": 4,
  "practice-handoff": 6,
  "recap-map": 1
}
```

`term-bridge` remains the largest group because this workshop source has many glossary/metaphor-to-real-term bridge slides. Process and sequence slides are no longer absorbed by checklist templates before process detection runs.

## Single Image Asset Application

The prior crop warning path has been applied to the real deck as `single-image-first` assets.

- 24 warning crop assets are now standalone generated PNG files at `assets/visuals/<asset-id>-single.png`.
- `asset-pack.json` keeps `generationMode: "single-image-first"`, `previousCropRegion`, and `deterministicComposition` for each converted asset.
- The deck harness owns final frame, placement, shadow, object-fit, and slide text. The bitmap images are teaching visuals only.
- `assets/slides.js` records the rendered copy for the active slide in `renderedVisualAsset`, such as `../assets/visuals/act1-info-baskets-act1-info-baskets-single.png`.
- Previous undeclared crop/source PNGs for those 24 assets were removed from `assets/visuals` so the active visual directory matches `asset-pack.json` and the build manifest.

Review surfaces:

- `http://127.0.0.1:8788/deck.html`
- `http://127.0.0.1:8788/single-image-generated-review.html`

Representative visual review screenshots:

- slide 13 `act1-info-baskets`: three baskets and Korean labels are visible, with no panel number or crop boundary contamination.
- slide 26 `act2-prompt-term-mapping`: business handoff metaphor connects to `Prompt` and `Task Specification` without frame clipping.
- slide 38 `act3-to-act4-manual`: `회사 내규` and `업무 매뉴얼` contrast is readable as the Act 4 bridge.
- slide 59 `act5-new-hire-skill-assignment`: role-specific skill manuals are visible inside the harness-owned frame.

## Verification

Command:

```sh
node deck-harness/scripts/prepare-asset-generation-prompts.js generated-decks/kimai-workshop-content
node deck-harness/scripts/build-asset-pack.js generated-decks/kimai-workshop-content
node deck-harness/scripts/build-asset-pack.js --check generated-decks/kimai-workshop-content
node deck-harness/scripts/validate-deck-contract.js generated-decks/kimai-workshop-content
node deck-harness/scripts/build-deck-from-spec.js generated-decks/kimai-workshop-content
node deck-harness/scripts/verify-single-image-contract.js generated-decks/kimai-workshop-content
node deck-harness/scripts/verify-asset-crops.js generated-decks/kimai-workshop-content
node deck-harness/scripts/verify-slide-layout-variety.js generated-decks/kimai-workshop-content
node deck-harness/scripts/verify-template-gallery.js generated-decks/kimai-workshop-content
node deck-harness/scripts/run-browser-render-check.js generated-decks/kimai-workshop-content --all-slides
node deck-harness/scripts/verify-deck-quality.js generated-decks/kimai-workshop-content
```

Exit Code: 0

## Agent Findings

The critical visual verifier report is `visual-generation-verifier-report.md`. It should be refreshed after any image regeneration, crop change, semantic review change, or browser screenshot refresh. The quality gate now fails stale visual reviews when asset hashes or semanticRequirements hashes no longer match the current files, and fails stale browser evidence when `browser-render-report.json.deckOutputHash` no longer matches the latest deck build.

## Blocked Risks

- none

## Non-Blocking Risks

- Generated image text is treated as a visual anchor, not as the authoritative lecture copy. The exact Korean teaching text remains in the HTML text layer.
- Final workshop delivery can still benefit from one human pass over `single-image-generated-review.html` for small handwritten label polish.
- `asset-review.json` includes per-label evidence paths and hashes, but a stricter independent visual review can still improve semantic confidence.

## Next Prompt

If any single-image PNG, `asset-pack.json`, or semanticRequirements entry changes, rebuild the deck, rerun the single-image contract, refresh browser screenshots, then rerun `node deck-harness/scripts/verify-deck-quality.js generated-decks/kimai-workshop-content`.
