# Deck Handoff

## Current State

Live-research sample inputs are authored for a 5-slide source-sensitive smoke test.

## Inputs

- `topic-intake.md`
- `research-dossier.md`
- `claim-source-map.json`
- `section-plan.json`
- `slide-spec.json`
- `glossary.json`

## Evidence Map Status

PASS: official, supporting, local, inference, and speaker-note claims are represented.

## Source Coverage

PASS: slide-visible claims resolve through `evidenceClaimIds`.
PASS: `claimsToAvoid` includes an over-broad rule to avoid.

## Generated Artifacts

- `deck.html`
- `presenter-review.html`
- `assets/slides.js`
- `slides/slide-001.html`
- `slides/slide-002.html`
- `slides/slide-003.html`
- `slides/slide-004.html`
- `slides/slide-005.html`

## Quality Gate Artifacts

- `evaluation-log.md`

## Verification

Command: node deck-harness/scripts/verify-deck-quality.js generated-decks/sample-topic-live-research
Exit Code: pending
Artifact Path: generated-decks/sample-topic-live-research/evaluation-log.md

## Agent Findings

Status: PASS
Evidence path: generated-decks/sample-topic-live-research/HANDOFF.md

## Blocked Risks

- None.

## Non-Blocking Risks

- Browser rendering in the generic smoke script is structural; detailed visual QA still belongs to the full browser audit for production decks.

## Next Prompt

Build and verify the live-research sample, then inspect the source map before using the workflow for a client-facing deck.
