# Kimai Readability Scale-Up Ouroboros Plan

Status: ready for implementation
Created: 2026-06-01
Ouroboros session: `auto_e19bc85da499`
Ouroboros seed: `seed_a1fd8d7d034f`
Context pack: `generated-decks/kimai-workshop-content/readability-scale-up-context-research-pack.md`

## Goal

Make `generated-decks/kimai-workshop-content` easier to read from classroom distance by scaling text, cards, and CSS-template components for a desktop-only projector environment, while preserving the generated-deck harness workflow and avoiding image-driven layout breakage.

## Constraints

- Planning-only artifact; implementation files are not changed in this pass.
- Assume desktop/projector delivery, not responsive/mobile delivery.
- Edit source/harness layers first: `deck-harness/templates/assets/style.css`, relevant quality gate/profile scripts, and source/spec copy only when overflow needs content repair.
- Do not patch final `slides/*.html` as the primary fix.
- Do not enlarge images by default. Increase image max sizes only after screenshot evidence proves the relevant template remains stable.
- Preserve the current dirty worktree. Do not reset or revert unrelated user/agent changes.

## Acceptance Criteria

1. Desktop readability contract is explicit:
   - normal body/message text target is at least 28px where layout permits;
   - bullet/card/action text target is at least 24px, with smaller text treated as review debt unless it is navigation or tooltip UI;
   - h2/headline targets are larger than current defaults where layout permits, with template-specific caps to avoid Korean headline overflow.
2. Generated-deck workflow is preserved:
   - source template and harness/gate files are the owner of reusable layout rules;
   - generated Kimai output is rebuilt from those sources;
   - final HTML-only edits are not used as the solution.
3. Image policy is enforced:
   - image dimensions remain unchanged in the first implementation pass;
   - any image enlargement has before/after screenshots and no clipping/overflow evidence.
4. Quality gate/profile conflict is handled:
   - the current 1024px/mobile-oriented caps are not allowed to block the desktop-only target silently;
   - either a `desktop-projector` validation profile is added or the existing gate is parameterized with a documented desktop-only mode.
5. Verification evidence is refreshed:
   - all 76 projector slides have 1366x768 desktop screenshots after the latest rebuild;
   - template gallery/contact sheet evidence is refreshed;
   - representative image-heavy and CSS-template slides are reviewed for overflow, clipping, and text fit.
6. Reports are updated:
   - `HANDOFF.md`, `quality-gate-report.md`, and `browser-render-report.json` state the desktop-only scope and latest output hash.

## Implementation Phases

### Phase 1: Baseline Inventory

- Run a read-only baseline:
  - `node deck-harness/scripts/verify-deck-quality.js generated-decks/kimai-workshop-content`
  - `node deck-harness/scripts/run-browser-render-check.js generated-decks/kimai-workshop-content --all-slides`
- Build a per-template list of likely risk slides from `assets/slides.js`:
  - longest Korean headline/message/bullet strings;
  - `term-bridge`, `workflow-strip`, `decision-gate`, `brief-window`, `kimai-structure` examples;
  - image-heavy slides with `renderedVisualAsset`.

### Phase 2: Desktop Profile / Gate

- Add a desktop-only validation path before typography changes.
- Preferred shape:
  - `verify-deck-quality.js --profile=desktop-projector generated-decks/kimai-workshop-content`
  - `run-browser-render-check.js --all-slides --viewport=1366x768`
- Keep the legacy 1024/mobile checks available for decks that still need responsive delivery.

### Phase 3: Typography And Card Scale

- Update `deck-harness/templates/assets/style.css`, then rebuild.
- Initial target direction:
  - base `h2`: moderate increase from 48px, with per-template caps;
  - `.message`: 28px target;
  - `.bullets`: 24-26px target;
  - `.presenter-cues li`, `.handoff-actions span`, checklist cards, workflow cards, term chips: raise card text and spacing together;
  - reduce excessive padding/gaps before reducing font size.
- Keep image max-height/width unchanged in this phase.

### Phase 4: Rebuild And Desktop Screenshot Review

- Rebuild the deck:
  - `node deck-harness/scripts/build-deck-from-spec.js generated-decks/kimai-workshop-content`
- Refresh screenshots:
  - `node deck-harness/scripts/run-browser-render-check.js generated-decks/kimai-workshop-content --all-slides`
- Review failures by template, not only by slide number.
- Repair order:
  1. tighten layout spacing;
  2. shorten/split visible copy in source/spec;
  3. add template-specific rule;
  4. only then consider image sizing.

### Phase 5: Final Verification And Handoff

- Run the full feasible gate set:
  - `node deck-harness/scripts/build-asset-pack.js --check generated-decks/kimai-workshop-content`
  - `node deck-harness/scripts/validate-deck-contract.js generated-decks/kimai-workshop-content`
  - `node deck-harness/scripts/verify-single-image-contract.js generated-decks/kimai-workshop-content`
  - `node deck-harness/scripts/verify-asset-crops.js generated-decks/kimai-workshop-content`
  - `node deck-harness/scripts/verify-slide-layout-variety.js generated-decks/kimai-workshop-content`
  - `node deck-harness/scripts/verify-template-gallery.js generated-decks/kimai-workshop-content`
  - `node deck-harness/scripts/verify-deck-quality.js --profile=desktop-projector generated-decks/kimai-workshop-content`
- Update `HANDOFF.md` and `quality-gate-report.md` with the new profile and residual risks.

## Risks And Mitigations

| risk | mitigation |
|---|---|
| Long Korean headlines overflow after global scale-up | use per-template caps and split/shorten copy in source/spec |
| Existing 1024 responsive gate blocks larger desktop type | introduce explicit desktop-projector profile instead of weakening legacy gate silently |
| Larger cards collide with image columns | reduce gaps/padding and keep image sizes unchanged first |
| Image labels remain too small | keep HTML text layer authoritative; image enlargement only with screenshot proof |
| Dirty worktree contains unrelated changes | inspect `git diff --name-only` before edits and avoid revert/reset |
| Old screenshots still pass by stale report | require current `deckOutputHash` in `browser-render-report.json` |

## Verification Commands

```sh
node scripts/validate-context-research-pack.js generated-decks/kimai-workshop-content/readability-scale-up-context-research-pack.md
node deck-harness/scripts/build-asset-pack.js --check generated-decks/kimai-workshop-content
node deck-harness/scripts/validate-deck-contract.js generated-decks/kimai-workshop-content
node deck-harness/scripts/build-deck-from-spec.js generated-decks/kimai-workshop-content
node deck-harness/scripts/verify-single-image-contract.js generated-decks/kimai-workshop-content
node deck-harness/scripts/verify-asset-crops.js generated-decks/kimai-workshop-content
node deck-harness/scripts/verify-slide-layout-variety.js generated-decks/kimai-workshop-content
node deck-harness/scripts/verify-template-gallery.js generated-decks/kimai-workshop-content
node deck-harness/scripts/run-browser-render-check.js generated-decks/kimai-workshop-content --all-slides
node deck-harness/scripts/verify-deck-quality.js --profile=desktop-projector generated-decks/kimai-workshop-content
```

If `--profile=desktop-projector` does not exist yet, implementing that gate/profile is part of Phase 2.
