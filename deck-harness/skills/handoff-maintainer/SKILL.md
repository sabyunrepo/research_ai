---
name: handoff-maintainer
description: Use when a generated deck needs a reproduction contract, risk ledger, and next-session prompt before completion.
---

# Handoff Maintainer

## When to Use

Use this skill after deck generation and quality gates have run, before ending a deck session or handing work to another agent.

Do not use it to claim completion when verification evidence is stale or missing.

## Inputs

- `generated-decks/<slug>/topic-intake.md`
- `generated-decks/<slug>/research-dossier.md`
- `generated-decks/<slug>/claim-source-map.json`
- `generated-decks/<slug>/section-plan.json`
- `generated-decks/<slug>/slide-spec.json`
- `generated-decks/<slug>/glossary.json`
- `generated-decks/<slug>/quality-gate-report.md`
- `generated-decks/<slug>/deck.html`
- `generated-decks/<slug>/presenter-review.html`
- `docs/harness/codex-session-decision-log.md` when working inside this project harness.

## Outputs

- `generated-decks/<slug>/HANDOFF.md`

`HANDOFF.md` must include:

- Current State
- Inputs
- Evidence Map Status
- Source Coverage
- Generated Artifacts
- Quality Gate Artifacts
- Verification
- Agent Findings
- Blocked Risks
- Non-Blocking Risks
- Next Prompt

## Procedure

1. If this is this project harness, read `docs/harness/codex-session-decision-log.md` and apply the rule that handoff is a reproduction contract, not a loose status memo.
2. Read every listed input and confirm generated artifacts exist.
3. Record the exact latest verification commands, their PASS/FAIL status, and evidence paths.
4. Summarize agent findings into findings, actions, judgment, unresolved items, and evidence; do not paste raw agent logs.
5. Keep blocked risks and non-blocking risks separate and non-empty. Use `Reviewed: none found` only when the check was performed.
6. Write a next prompt that lets a future session resume without relying on hidden context.

## Quality Bar

- A future worker can reproduce the deck status from `HANDOFF.md` alone.
- Verification entries match the most recent commands and artifacts.
- Generated artifact paths are exact and exist.
- Source coverage distinguishes official, primary, secondary, weak, and unchecked sources.
- Risks name owner, symptom, retry condition, and next action.

## Verification

- `rg -n "^## (Current State|Inputs|Evidence Map Status|Source Coverage|Generated Artifacts|Quality Gate Artifacts|Verification|Agent Findings|Blocked Risks|Non-Blocking Risks|Next Prompt)" generated-decks/<slug>/HANDOFF.md`
- `rg -n "node deck-harness/scripts/validate-deck-contract.js|node deck-harness/scripts/verify-deck-quality.js|PASS|FAIL|WARN|generated-decks/<slug>" generated-decks/<slug>/HANDOFF.md`
- Confirm every generated artifact listed in `HANDOFF.md` exists.
- Confirm blocked and non-blocking risk sections are not empty.

## Stop Conditions

- `HANDOFF.md` Verification does not match the last executed verification commands.
- Remaining risk sections are empty.
- Any generated artifact listed in the handoff does not exist.
- Any PASS claim lacks command output or artifact path.
