---
name: deck-quality-gate
description: Use when a generated HTML/CSS deck must be verified before handoff or client-facing delivery.
---

# Deck Quality Gate

## When to Use

Use this skill after HTML/CSS deck files are built and before declaring a deck ready, writing final handoff, or presenting PASS status.

Do not use it as a replacement for source research or slide-spec review.

## Inputs

- `generated-decks/<slug>/`
- `generated-decks/<slug>/slide-spec.json`
- `generated-decks/<slug>/claim-source-map.json`
- `generated-decks/<slug>/glossary.json`
- `generated-decks/<slug>/asset-build-report.md`
- `generated-decks/<slug>/asset-review.json`
- `generated-decks/<slug>/browser-render-report.json`
- `generated-decks/<slug>/HANDOFF.md`
- `deck-harness/allowlists/overflow-allowlist.json`
- `docs/harness/codex-session-decision-log.md` when working inside this project harness.
- `docs/harness/lecture-cuts-content-inventory.md` for golden-reference quality expectations.

## Outputs

- `generated-decks/<slug>/quality-gate-report.md`
- Updated verification evidence paths in `generated-decks/<slug>/HANDOFF.md`

## Procedure

1. If this is this project harness, read `docs/harness/codex-session-decision-log.md` and include observed quality failures as regression checks: warnings, duplicate content, tooltip partial matching, overflow, missing sources, placeholder output, and mock artifacts.
2. Run the mandatory validation commands exactly against the generated deck path.
3. Inspect PASS/FAIL output and artifact paths; do not summarize a command as PASS without captured output or a saved evidence path.
4. Check `docs/harness/lecture-cuts-content-inventory.md` when comparing against the current golden reference.
5. Write or update `generated-decks/<slug>/quality-gate-report.md`.
6. Block handoff if any required PASS condition fails.

## Quality Bar

PASS requires:

- Schemas validate.
- Every `evidenceClaimId` resolves.
- Every `glossaryTerms` item resolves.
- Rendered screen text matches `slide-spec.json`.
- Presenter review shows `speakerNote` and `evidenceClaimIds`.
- No native title tooltip appears for glossary terms.
- No partial glossary match appears.
- No desktop or mobile overflow exists unless an active allowlist entry is valid.
- Every projector-referenced visual review records the current asset SHA-256 and current semanticRequirements SHA-256, so old PASS reviews fail after asset or contract changes.
- Browser render PASS is based on fresh screenshot evidence, not a hard-coded success line. `browser-render-report.json` must match the latest build output hash and include desktop, projector, and mobile captures.
- Kimai decks must also pass design contract, layout variety, and glossary depth gates.
- `HANDOFF.md` contains current command evidence and non-empty risk sections.

## Verification

- `node deck-harness/scripts/validate-deck-contract.js generated-decks/<slug>`
- `node deck-harness/scripts/build-asset-pack.js --check generated-decks/<slug>`
- `node deck-harness/scripts/run-browser-render-check.js generated-decks/<slug> --url=<local-deck-url>`
- `node deck-harness/scripts/verify-deck-design-contract.js generated-decks/<slug>`
- `node deck-harness/scripts/verify-asset-crops.js generated-decks/<slug>`
- `node deck-harness/scripts/verify-slide-layout-variety.js generated-decks/<slug>`
- `node deck-harness/scripts/verify-glossary-depth.js generated-decks/<slug>`
- `node deck-harness/scripts/verify-deck-quality.js generated-decks/<slug>`
- `rg -n "PASS|FAIL|WARN|evidenceClaimId|glossary|overflow|HANDOFF" generated-decks/<slug>/quality-gate-report.md generated-decks/<slug>/HANDOFF.md`
- Confirm the command outputs or artifact paths in `HANDOFF.md` match the latest executed commands.

## Stop Conditions

- Any mandatory command fails.
- `asset-build-report.md` lists pending projector blockers or failed assets.
- `asset-review.json` has stale asset hashes, stale semanticRequirements hashes, or missing review rows for projector-referenced assets.
- `browser-render-report.json` is missing, stale, WARN/FAIL, lacks required viewports, or references missing screenshots.
- Any PASS claim lacks command output or artifact path.
- Any source, glossary, presenter-review, tooltip, overflow, or handoff check fails without an active allowlist entry.
- `HANDOFF.md` has empty remaining-risk sections.
