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
9. Run structure validation before image generation:
   `node deck-harness/scripts/validate-deck-contract.js --stage=structure generated-decks/<slug>`.
10. Draft speaker script and visual system.
11. Export the design-grounded image prompt queue:
   `node deck-harness/scripts/prepare-asset-generation-prompts.js generated-decks/<slug>`.
12. Create or map visual assets for every projector-referenced `visualAssetId` from `asset-generation-prompts.md`.
13. Materialize the asset pack and crop outputs:
   `node deck-harness/scripts/build-asset-pack.js generated-decks/<slug>`.
14. Create `asset-review.json` after visual inspection or an equivalent image review.
15. Run projector validation:
   `node deck-harness/scripts/validate-deck-contract.js generated-decks/<slug>`.
16. Build the HTML/CSS deck.
17. Review presenter view.
18. Run verification gates.
19. Finish `HANDOFF.md` with commands, evidence, risks, and next prompt.

Slide HTML must not start until `research-dossier.md`, `claim-source-map.json`, `section-plan.json`, `glossary.json`, `asset-pack.json`, `job-manifest.json`, and `slide-spec.json` exist.

`--stage=structure` is the pre-asset gate. It validates source, section, glossary, slide, manifest, and asset-contract shape while allowing referenced visual assets to remain `planned`. Planned projector assets are reported as WARN and still block the default projector gate. The default validation stage is `projector`; it requires every referenced `visualAssetId` to be generated, mapped, or cropped before HTML/CSS deck build.

`build-asset-pack.js` is the asset materialization gate between structure validation and projector validation. It records `asset-build-report.md`, creates concrete crop-region image files under `assets/visuals/`, and exits non-zero while any projector-referenced source image, generated image, or crop source is still pending. Planned assets that no slide currently references are reported as pending unused items. Use `--check` for read-only reviewer verification.

`prepare-asset-generation-prompts.js` is the image-generation handoff gate. It reads `asset-pack.json` plus `디자인.md`, then writes `asset-generation-prompts.md` so image generation agents use the same hand-drawn minimal constraints as the deck harness.

`run-browser-render-check.js` is the browser evidence gate. It captures representative desktop, projector, and mobile screenshots through Playwright, writes `browser-render-report.json`, and records the current build output hash so stale screenshots fail the final quality gate.

The Kimai visual QA gates are split for reviewability:

- `verify-deck-design-contract.js`: title font, footer weight, motion, and placeholder rules.
- `verify-slide-layout-variety.js`: layout variant count, largest cluster, and consecutive repetition.
- `verify-glossary-depth.js`: glossary size and tooltip/depth fields for a 4-hour workshop.
- `verify-asset-crops.js`: crop-region files, declared sprite-sheet layout/cell indexes, image dimensions, and fresh crop hashes.

## File Roles

- `workflow.md`: stage order, required inputs, and blocking rules.
- `quality-rubric.md`: pass/fail bar for content, pedagogy, visual quality, and verification.
- `*.template.md`: starter documents for intake, research, visual system, evaluation, and handoff.
- `*.schema.json`: JSON contracts for evidence, sections, slides, glossary, and job manifest.
- `asset-pack.schema.json`: reusable generated-image and image-crop contract. Slides reference image assets by `visualAssetId`; crop regions are materialized into real files under `assets/visuals/` during build. Projector-referenced visual assets must include `semanticRequirements` with `mustShow`, `mustNotShow`, `teachingQuestions`, and `minimumPassScore`.
- `asset-review.schema.json`: visual semantic review contract. `forbiddenElementFindings.observed: true` means a forbidden `semanticRequirements.mustNotShow` element was seen and blocks projector PASS. Each review also records the reviewed `sourcePath`, current asset file SHA-256, and current `semanticRequirements` SHA-256 so stale PASS reviews fail after image, crop, or semantic-contract changes.
- `asset-crop-review.json`: deterministic crop verification artifact. Final projector PASS requires this report to prove every crop-region was cut from the declared source sheet, `sheetLayout`, and `sheetCellIndex`, with current source/crop file hashes.
- `asset-review.json`: visual semantic review artifact for each projector-referenced `visualAssetId`. Final projector PASS requires a PASS review, all required `mustShow` checks passing, exactly one forbidden-element finding for each `mustNotShow` label with `observed: false`, a score at or above `minimumPassScore`, and fresh hash evidence for the actual image file and semantic contract under review.
- `browser-render-report.json`: browser screenshot evidence for the generated deck. Final projector PASS requires status `PASS`, current `deckOutputHash`, existing screenshot files, desktop/projector/mobile viewport coverage, and no unresolved blockers.
- `allowlists/overflow-allowlist.json`: temporary overflow exceptions. Empty by default; each active item must include slide id, selector, reason, owner, and expiry date. Expired or selector-missing allowlist entries are FAIL.

## Visual Semantic Asset Workflow

Visual assets are not complete when they merely render. For every projector slide that uses `visualAssetId`, define the visible meaning in `asset-pack.json` under `semanticRequirements`, then review the actual rendered asset in `asset-review.json`.

Final projector PASS requires:

1. `asset-pack.json` includes `semanticRequirements`.
2. `asset-review.json` marks the asset `PASS`.
3. `asset-review.json` includes one `mustShowResults` row for every `mustShow` label, and one `forbiddenElementFindings` row for every `mustNotShow` label.
4. No `forbiddenElementFindings` row has `observed: true`.
5. `asset-review.json` records `sourcePath`, `assetSha256`, and `semanticRequirementsSha256` matching the current asset file and current `asset-pack.json` semantic contract.
6. `node deck-harness/scripts/build-asset-pack.js generated-decks/<slug>` has no pending projector blockers or failed assets.
7. `node deck-harness/scripts/build-deck-from-spec.js generated-decks/<slug>` refreshes the registry and presenter review.
8. `node deck-harness/scripts/run-browser-render-check.js generated-decks/<slug> --url=<local-deck-url>` writes fresh screenshot evidence after the latest deck build.
9. `node deck-harness/scripts/verify-deck-quality.js generated-decks/<slug>` passes the semantic and browser-evidence gates.
10. Visual inspection screenshots confirm the asset is readable and explains the teaching role.

## Completion Conditions

- Every schema JSON file parses as valid JSON.
- `node deck-harness/scripts/validate-deck-contract.js --stage=structure generated-decks/<slug>` passes before visual generation begins.
- The source map validates and every `evidenceClaimIds` item resolves to `claim-source-map.json`.
- The asset pack validates and every `visualAssetId` item resolves to `asset-pack.json`.
- `node deck-harness/scripts/prepare-asset-generation-prompts.js generated-decks/<slug>` writes `asset-generation-prompts.md` before new image generation begins.
- `node deck-harness/scripts/build-asset-pack.js generated-decks/<slug>` exits 0 and `asset-build-report.md` has zero pending projector blockers and failed assets.
- `node deck-harness/scripts/build-asset-pack.js --check generated-decks/<slug>` exits 0 during read-only reviewer verification.
- Every projector-referenced `visualAssetId` has semantic requirements and a passing visual semantic review whose recorded asset and semantic hashes match the current files.
- `node deck-harness/scripts/run-browser-render-check.js generated-decks/<slug> --url=<local-deck-url>` refreshes browser screenshot evidence after the latest deck build.
- `node deck-harness/scripts/verify-deck-design-contract.js generated-decks/<slug>`, `verify-slide-layout-variety.js`, and `verify-glossary-depth.js` pass before handoff.
- The slide spec contains no source URLs, checked dates, source types, confidence values, or source summaries.
- Instruction prompts, screen text, speaker navigation, and asset requirements are separated with `xmlPrompt` blocks instead of being mixed in slide-visible copy.
- Every glossary term used by a slide resolves to the glossary registry.
- `node deck-harness/scripts/validate-deck-contract.js generated-decks/<slug>` passes before projector deck build.
- Rendered deck and presenter review match `slide-spec.json`.
- Desktop/mobile browser checks pass with no text overlap; overflow is blocked unless covered by a valid unexpired allowlist entry.
- Final handoff includes commands, evidence paths, and remaining risks.
