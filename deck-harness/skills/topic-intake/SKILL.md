---
name: topic-intake
description: Use when a new deck topic or raw brief lacks a complete topic-intake.md contract.
---

# Topic Intake

## When to Use

Use this skill at the start of a topic-to-deck job, before research, source mapping, section planning, slide specs, or HTML deck work.

Do not use it to rewrite research findings or slide copy after `topic-intake.md` is already complete and current.

## Inputs

- User request, topic brief, source files, or client notes.
- `docs/harness/codex-session-decision-log.md` when working inside this project harness.
- `docs/harness/lecture-cuts-content-inventory.md` as the golden-reference benchmark for workshop scale and deck expectations.

## Outputs

- `generated-decks/<slug>/topic-intake.md`

The output must include:

- Topic
- Audience
- Timebox
- Desired Output
- Must Cover
- Must Avoid, or explicit `not specified`
- Source Preferences, or explicit `official sources first`
- Success Criteria

## Procedure

1. Read the user request and any provided materials.
2. If this is this project harness, read `docs/harness/codex-session-decision-log.md` before drafting and apply any stable decisions, user preferences, workflow requirements, or superseded-decision warnings that affect intake.
3. Check `docs/harness/lecture-cuts-content-inventory.md` when the requested deck should match the current `lecture-cuts/` quality bar.
4. Infer safe defaults only when the request makes them clear; otherwise ask for the missing critical item before writing.
5. Write `generated-decks/<slug>/topic-intake.md` with the required fields and concise notes on assumptions.
6. Mark inferred values explicitly so downstream agents can review them.

## Quality Bar

- Korean-first learner-facing framing unless the user asks otherwise.
- The brief is specific enough for research, source grounding, section planning, and slide-spec work to proceed without re-asking obvious questions.
- Must-cover and must-avoid boundaries are concrete, not generic.
- Success criteria describe what a finished deck must prove, not only what files should exist.

## Verification

- `rg -n "^(# |## |Topic:|Audience:|Timebox:|Desired Output:|Must Cover:|Must Avoid:|Source Preferences:|Success Criteria:)" generated-decks/<slug>/topic-intake.md`
- Confirm `Must Avoid` is not blank; use `not specified` if the user gave no constraint.
- Confirm `Source Preferences` is not blank; use `official sources first` if the user gave no preference.
- Confirm any inferred field is labeled as inferred.

## Stop Conditions

- Audience is unknown and cannot be inferred from the request.
- Timebox is missing and the user asked for a timed workshop.
- Success criteria are missing for a paid or client-facing deck.
- The request conflicts with `docs/harness/codex-session-decision-log.md` and the conflict cannot be resolved without user input.
