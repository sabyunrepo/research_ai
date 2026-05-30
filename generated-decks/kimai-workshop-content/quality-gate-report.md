# Quality Gate Report

## Current Verdict

PASS.

The Kimai lecture deck source contracts, generated visual assets, projector deck build, presenter review, and deterministic quality gate now pass.

## Scope

- Included: Kimai lecture deck contracts and generated HTML deck in `generated-decks/kimai-workshop-content`.
- Excluded: `practice-harness/` runtime, scoring, LLM judge, and practice UI.

## Commands

```sh
node deck-harness/scripts/prepare-asset-generation-prompts.js generated-decks/kimai-workshop-content
node deck-harness/scripts/build-asset-pack.js generated-decks/kimai-workshop-content
node deck-harness/scripts/build-asset-pack.js --check generated-decks/kimai-workshop-content
node deck-harness/scripts/validate-deck-contract.js generated-decks/kimai-workshop-content
node deck-harness/scripts/build-deck-from-spec.js generated-decks/kimai-workshop-content
node deck-harness/scripts/run-browser-render-check.js generated-decks/kimai-workshop-content --url=http://127.0.0.1:8788/deck.html
node deck-harness/scripts/verify-deck-quality.js generated-decks/kimai-workshop-content
```

## Results

- Prompt queue: PASS, `asset-generation-prompts.md` generated from `asset-pack.json` and `디자인.md`.
- Asset materialization: PASS; 0 pending projector blockers, 20 pending unused planned assets, and 0 failed assets.
- Asset review freshness: PASS; 71 projector-referenced visual reviews include current asset SHA-256 and semanticRequirements SHA-256 evidence.
- Browser render evidence: PASS; 9 Playwright screenshots captured across desktop, projector, and mobile viewports with current build output hash.
- Projector contract: PASS.
- HTML deck build: PASS, 76 slides built.
- Quality gate: PASS.

## Final Verification Output

```text
PASS source map schema - 10 claims
PASS slide spec schema - 76 slides
PASS evidence claim resolution
PASS glossary registry
PASS asset pack - 99 assets
PASS generated deck contract (projector)
PASS local references
PASS presenter review
PASS presenter evidence surface
PASS spec-to-render parity
PASS XML instruction separation
PASS evidence claim resolution
PASS glossary registry
PASS partial glossary matching
PASS visual semantic reviews
PASS visual directory inventory
PASS handoff parser
PASS responsive projector rules
PASS projector fit
PASS browser render evidence
```

## Residual Risk

- Some generated image crops contain more text than ideal for final classroom projection.
- Human slide-by-slide visual review is still recommended before delivery.
