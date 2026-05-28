# Deck Harness

`deck-harness/` is the reusable topic-to-deck contract for building a new HTML/CSS lecture deck from raw material while keeping the same quality bar as `lecture-cuts/`.

## Existing Deck Separation

`deck-harness/` must improve the workflow logic without silently changing an existing deck output. Treat `lecture-cuts/` as a golden reference unless the user explicitly asks to edit the visible deck.

- Do not change `lecture-cuts/deck.html`, `lecture-cuts/presenter-review.html`, or presentation runtime JS during workflow-only work.
- Keep harness metadata, agents, skills, schemas, source maps, and validation scripts separate from rendered deck output.
- Use `lecture-cuts/slide-spec.json` as a reproduction contract for the current result, not as permission to rewrite the result.
- Future deck improvements such as glossary behavior, source precision, and overflow policy should be enforced in `deck-harness/` first, then applied to an output deck only after an explicit output-change request.

## Workflow Order

1. Fill `topic-intake.md`.
2. Write `research-dossier.md`.
3. Create `claim-source-map.json`.
4. Create `section-plan.json`.
5. Create `glossary.json`.
6. Create `asset-pack.json` with generated-image requirements, source paths, sprite/crop metadata, teaching anchors, and semantic requirements for projector-referenced visual assets.
7. Record stage status in `job-manifest.json`.
8. Create `slide-spec.json`.
9. Draft speaker script and visual system.
10. Create `asset-review.json` after visual inspection or an equivalent image review.
11. Build the HTML/CSS deck.
12. Review presenter view.
13. Run verification gates.
14. Finish `HANDOFF.md` with commands, evidence, risks, and next prompt.

Slide HTML must not start until `research-dossier.md`, `claim-source-map.json`, `section-plan.json`, `glossary.json`, `asset-pack.json`, `job-manifest.json`, and `slide-spec.json` exist.

## File Roles

- `workflow.md`: stage order, required inputs, and blocking rules.
- `quality-rubric.md`: pass/fail bar for content, pedagogy, visual quality, and verification.
- `*.template.md`: starter documents for intake, research, visual system, evaluation, and handoff.
- `*.schema.json`: JSON contracts for evidence, sections, slides, glossary, and job manifest.
- `asset-pack.schema.json`: reusable generated-image and image-crop contract. Slides reference image assets by `visualAssetId`; crop regions are materialized into real files under `assets/visuals/` during build. Projector-referenced visual assets must include `semanticRequirements` with `mustShow`, `mustNotShow`, `teachingQuestions`, and `minimumPassScore`.
- `asset-review.schema.json`: visual semantic review contract. `forbiddenElementFindings.observed: true` means a forbidden `semanticRequirements.mustNotShow` element was seen and blocks projector PASS.
- `asset-review.json`: visual semantic review artifact for each projector-referenced `visualAssetId`. Final projector PASS requires a PASS review, all required `mustShow` checks passing, exactly one forbidden-element finding for each `mustNotShow` label with `observed: false`, and a score at or above `minimumPassScore`.
- `allowlists/overflow-allowlist.json`: temporary overflow exceptions. Empty by default; each active item must include slide id, selector, reason, owner, and expiry date. Expired or selector-missing allowlist entries are FAIL.

## Visual Semantic Asset Workflow

Visual assets are not complete when they merely render. For every projector slide that uses `visualAssetId`, define the visible meaning in `asset-pack.json` under `semanticRequirements`, then review the actual rendered asset in `asset-review.json`.

Final projector PASS requires:

1. `asset-pack.json` includes `semanticRequirements`.
2. `asset-review.json` marks the asset `PASS`.
3. `asset-review.json` includes one `mustShowResults` row for every `mustShow` label, and one `forbiddenElementFindings` row for every `mustNotShow` label.
4. No `forbiddenElementFindings` row has `observed: true`.
5. `node deck-harness/scripts/build-deck-from-spec.js generated-decks/<slug>` refreshes the registry and presenter review.
6. `node deck-harness/scripts/verify-deck-quality.js generated-decks/<slug>` passes the semantic gate.
7. Visual inspection screenshots confirm the asset is readable and explains the teaching role.

## Completion Conditions

- Every schema JSON file parses as valid JSON.
- The source map validates and every `evidenceClaimIds` item resolves to `claim-source-map.json`.
- The asset pack validates and every `visualAssetId` item resolves to `asset-pack.json`.
- Every projector-referenced `visualAssetId` has semantic requirements and a passing visual semantic review.
- The slide spec contains no source URLs, checked dates, source types, confidence values, or source summaries.
- Instruction prompts, screen text, speaker navigation, and asset requirements are separated with `xmlPrompt` blocks instead of being mixed in slide-visible copy.
- Every glossary term used by a slide resolves to the glossary registry.
- Rendered deck and presenter review match `slide-spec.json`.
- Desktop/mobile browser checks pass with no text overlap; overflow is blocked unless covered by a valid unexpired allowlist entry.
- Final handoff includes commands, evidence paths, and remaining risks.
