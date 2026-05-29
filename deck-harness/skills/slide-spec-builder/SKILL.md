---
name: slide-spec-builder
description: Use when research, source map, section plan, and quality rubric exist but slide-spec.json is missing or stale.
---

# Slide Spec Builder

## When to Use

Use this skill after source grounding and section planning are complete, before any HTML/CSS slide implementation.

Do not use it when `claim-source-map.json`, `section-plan.json`, or `quality-rubric.md` is missing.

## Inputs

- `generated-decks/<slug>/research-dossier.md`
- `generated-decks/<slug>/claim-source-map.json`
- `generated-decks/<slug>/section-plan.json`
- `deck-harness/quality-rubric.md`
- `generated-decks/<slug>/glossary.json`
- `generated-decks/<slug>/asset-pack.json`
- `docs/harness/codex-session-decision-log.md` when working inside this project harness.
- `docs/harness/lecture-cuts-content-inventory.md` as the golden-reference structure benchmark.

## Outputs

- `generated-decks/<slug>/slide-spec.json`

## Procedure

1. Confirm all required inputs exist before writing `slide-spec.json`.
2. If this is this project harness, read `docs/harness/codex-session-decision-log.md` and apply stable decisions for Korean-first copy, one clear message per slide, source links, glossary treatment, presenter review, and handoff evidence.
3. Use `docs/harness/lecture-cuts-content-inventory.md` to calibrate sectioning, speaker-source separation, and benchmark quality, without copying topic-specific content.
4. Build slide entries from the section plan and research dossier.
5. Reference evidence only through `evidenceClaimIds`; do not embed raw URLs in slide bodies.
6. Reference visuals through `visualAssetId` when an image asset exists; do not duplicate long image prompts inside every slide.
7. Confirm every projector-referenced `visualAssetId` has `asset-pack.json` semantic requirements: `mustShow`, `mustNotShow`, `teachingQuestions`, and `minimumPassScore`.
8. Separate prompt-generation instructions from projector text with `xmlPrompt`:
   - `instruction`: what the deck generator should do.
   - `screenContent`: only what may appear on the slide.
   - `speakerNavigation`: what helps the presenter know the speaking order.
   - `assetRequirement`: what the visual asset must explain.
9. Keep projector text concise and put explanations, caveats, and teaching notes in speaker notes.

## Quality Bar

- Each slide has one clear message.
- Every factual or product/API claim references valid `evidenceClaimIds`.
- Difficult English or developer terms reference `glossaryTerms`.
- Image assets reference valid `visualAssetId` entries from `asset-pack.json`, and those assets define visual semantic requirements.
- XML-style boundaries prevent instructions, source text, and screen copy from being mixed.
- Speaker notes are separate from projector content.
- The declared section pacing fits the timebox in `topic-intake.md`.

## Verification

- Before writing `slide-spec.json`, run `node deck-harness/scripts/validate-deck-contract.js generated-decks/<slug>` and expect FAIL because `slide-spec.json` is not yet present.
- After writing `slide-spec.json`, run `node deck-harness/scripts/validate-deck-contract.js --stage=structure generated-decks/<slug>` and expect PASS after source map, section plan, glossary, slide spec, and asset contract shape validate. WARN lines for `planned` visual assets are acceptable at this stage and mean visual generation/review still blocks projector build.
- `rg -n "\"evidenceClaimIds\"|\"glossaryTerms\"|\"speakerNote\"|\"section\"" generated-decks/<slug>/slide-spec.json`
- Confirm no slide uses raw source URLs instead of `evidenceClaimIds`.

## Stop Conditions

- Any required input is missing.
- The pre-build validation does not fail for the expected missing `slide-spec.json` reason.
- A factual claim cannot be linked to `claim-source-map.json`.
- The generated slide count, section pacing, or speaker notes cannot satisfy the timebox or quality rubric.
