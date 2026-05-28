# Quality Gate Report

## Commands

```sh
node deck-harness/scripts/validate-deck-contract.js generated-decks/kimai-act0-prototype
node deck-harness/scripts/build-deck-from-spec.js generated-decks/kimai-act0-prototype
node deck-harness/scripts/verify-deck-quality.js generated-decks/kimai-act0-prototype
```

## Result

PASS

## Evidence

```text
PASS generated deck contract
PASS source map schema - 2 claims
PASS slide spec schema - 1 slides
PASS evidence claim resolution
PASS glossary registry
PASS asset pack - 4 assets
PASS local references
PASS presenter review
PASS presenter evidence surface
PASS spec-to-render parity
PASS XML instruction separation
PASS evidence claim resolution
PASS glossary registry
PASS partial glossary matching
PASS visual semantic reviews
PASS handoff parser
PASS responsive projector rules
PASS projector fit
PASS browser render
EXIT_CODE=0
```

## Semantic Review Status

The current projector slide references `kimai-journey-map`. Its `asset-review.json` row is `PASS` with score 90 and concrete observed evidence for each semantic requirement.

Task 2 completed the image registration and crop traceability:

- `kimai-work-environment-sheet`
- `kimai-journey-map`
- `prompts/kimai-work-environment-sheet.xml`
- `lecture-cuts/assets/generated/kimai-work-environment-sheet.png`
- `assets/visuals/act0-workflow-map-kimai-journey-map.png`

The generated crop is embedded in `assets/slides.js` and passes semantic review.

## Remaining Risks

- Task 4 browser/Playwright visual inspection is still pending.
- The single wide map may still be dense for smaller classrooms; Task 4 must inspect 1024x768 readability.
