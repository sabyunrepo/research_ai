# Deck Handoff

## Current State

Fixture deck inputs are authored for a 3-slide local smoke test.

## Inputs

- `topic-intake.md`
- `research-dossier.md`
- `claim-source-map.json`
- `section-plan.json`
- `slide-spec.json`
- `glossary.json`

## Evidence Map Status

PASS: 2 local claims exist and all slide `evidenceClaimIds` resolve.

## Source Coverage

PASS: This fixture intentionally uses local source claims only.

## Generated Artifacts

- `deck.html`
- `presenter-review.html`
- `assets/slides.js`
- `slides/slide-001.html`
- `slides/slide-002.html`
- `slides/slide-003.html`

## Quality Gate Artifacts

- `evaluation-log.md`

## Verification

Command: node deck-harness/scripts/verify-deck-quality.js generated-decks/sample-topic-fixture
Exit Code: pending
Artifact Path: generated-decks/sample-topic-fixture/evaluation-log.md

## Agent Findings

Status: PASS
Evidence path: generated-decks/sample-topic-fixture/HANDOFF.md

## Blocked Risks

- None.

## Non-Blocking Risks

- This is a mechanics fixture and does not test external research quality.

## Next Prompt

Build and verify this fixture deck, then use the same workflow for a source-sensitive sample.
