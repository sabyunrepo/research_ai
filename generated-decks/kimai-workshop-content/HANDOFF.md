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

## Verification

Command:

```sh
node deck-harness/scripts/prepare-asset-generation-prompts.js generated-decks/kimai-workshop-content
node deck-harness/scripts/build-asset-pack.js generated-decks/kimai-workshop-content
node deck-harness/scripts/build-asset-pack.js --check generated-decks/kimai-workshop-content
node deck-harness/scripts/validate-deck-contract.js generated-decks/kimai-workshop-content
node deck-harness/scripts/build-deck-from-spec.js generated-decks/kimai-workshop-content
node deck-harness/scripts/run-browser-render-check.js generated-decks/kimai-workshop-content --url=http://127.0.0.1:8788/deck.html
node deck-harness/scripts/verify-deck-quality.js generated-decks/kimai-workshop-content
```

Exit Code: 0

## Agent Findings

The critical visual verifier report is `visual-generation-verifier-report.md`. It should be refreshed after any image regeneration, crop change, semantic review change, or browser screenshot refresh. The quality gate now fails stale visual reviews when asset hashes or semanticRequirements hashes no longer match the current files, and fails stale browser evidence when `browser-render-report.json.deckOutputHash` no longer matches the latest deck build.

## Blocked Risks

- none

## Non-Blocking Risks

- Some generated sheet cells contain more Korean text than ideal for projector crops.
- Generated image text should be checked by a human before final workshop delivery.
- `asset-review.json` includes per-label evidence paths and hashes, but a stricter independent visual review can still improve semantic confidence.

## Next Prompt

Review the generated Kimai deck in browser, check cropped image readability slide by slide, refresh `asset-review.json` with new hashes if any image or semanticRequirements contract is regenerated, rerun `node deck-harness/scripts/run-browser-render-check.js generated-decks/kimai-workshop-content --url=http://127.0.0.1:8788/deck.html`, then rerun `node deck-harness/scripts/verify-deck-quality.js generated-decks/kimai-workshop-content`.
