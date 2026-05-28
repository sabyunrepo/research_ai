# Kimai Act 0 Harness Prototype Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build one Act 0 example slide through the existing deck harness, improving the harness where needed instead of hand-writing a one-off slide.

**Architecture:** Keep `deck-harness/` as the reusable pipeline. Extend the slide spec and builder with optional visual, presenter-navigation, and interaction fields, then generate `generated-decks/kimai-act0-prototype` from contract files. The sample uses the existing hand-drawn visual direction from `디자인.md`.

**Tech Stack:** Node.js scripts, JSON contracts, HTML/CSS deck templates, existing `deck-harness` verification scripts.

**Status:** Completed on 2026-05-28. The final Act 0 prototype was later upgraded from the original baseline image plan to the Kimai image-sheet and visual semantic review workflow. Canonical output is `generated-decks/kimai-act0-prototype/`.

---

### Task 1: Extend Harness Contract For Presentation Navigation

**Files:**
- Modify: `deck-harness/slide-spec.schema.json`
- Modify: `deck-harness/scripts/validate-deck-contract.js`

- [x] Add optional fields to each slide: `presenterCues`, `bridge`, `visualType`, `visualAsset`, `visualPrompt`, and `interaction`.
- [x] Validate allowed `visualType` values: `generated-image`, `existing-image`, `practice-ui`, `artifact`, `minimal-diagram`.
- [x] Keep all source metadata out of `slide-spec.json`; evidence still goes through `evidenceClaimIds`.

### Task 2: Improve Harness Builder Output Quality

**Files:**
- Modify: `deck-harness/scripts/build-deck-from-spec.js`
- Modify: `deck-harness/templates/assets/style.css`
- Modify: `deck-harness/templates/assets/deck.js`
- Modify: `deck-harness/templates/assets/presenter-review.js`

- [x] Render visual assets as real images when `visualAsset` exists.
- [x] Render `presenterCues` and `bridge` in slide HTML as concise screen navigation, not hidden script.
- [x] Add custom glossary tooltip behavior from `glossary.json`.
- [x] Move template CSS toward the hand-drawn minimal style: white background, black text, blue accent, no gradient/glass/glow.
- [x] Surface visual requirements and presenter cues in presenter review.

### Task 3: Generate Act 0 Prototype Through Harness

**Files:**
- Create/modify: `generated-decks/kimai-act0-prototype/*`

- [x] Scaffold the deck with `node deck-harness/scripts/scaffold-deck.js kimai-act0-prototype`.
- [x] Fill `topic-intake.md`, `claim-source-map.json`, `section-plan.json`, `glossary.json`, and `slide-spec.json`.
- [x] Use one slide: `act0-workflow-map`.
- [x] Use an existing hand-drawn asset from `lecture-cuts/assets/handdrawn/12-workflow.png` as the visual baseline.
- [x] Build the deck with `node deck-harness/scripts/build-deck-from-spec.js generated-decks/kimai-act0-prototype`.

Note: the baseline visual was intentionally superseded by `kimai-journey-map`, cropped from `lecture-cuts/assets/generated/kimai-work-environment-sheet.png`, after the visual semantic asset gate was added.

### Task 4: Verify Harness Output

**Files:**
- Modify: `generated-decks/kimai-act0-prototype/HANDOFF.md`

- [x] Run `node deck-harness/scripts/validate-deck-contract.js generated-decks/kimai-act0-prototype`.
- [x] Run `node deck-harness/scripts/verify-deck-quality.js generated-decks/kimai-act0-prototype`.
- [x] Update `HANDOFF.md` with commands, results, output URL, and remaining risks.
- [x] Report any harness gaps that should be addressed before generating the full deck.

Final verification:

```text
PASS generated deck contract
PASS visual semantic reviews
PASS responsive projector rules
PASS projector fit
PASS browser render
EXIT_CODE=0
```
