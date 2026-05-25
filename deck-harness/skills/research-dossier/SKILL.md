---
name: research-dossier
description: Use when a generated deck needs evidence-backed research before claims, section planning, or slide specs.
---

# Research Dossier

## When to Use

Use this skill after `topic-intake.md` exists and before writing `claim-source-map.json`, `section-plan.json`, or `slide-spec.json`.

Do not use it to make final slide-order decisions; research supplies evidence and risk, not curriculum structure.

## Inputs

- `generated-decks/<slug>/topic-intake.md`
- User-provided source files or links, if any.
- Official documentation, standards, product pages, or primary sources for technical, product, API, or current claims.
- `docs/harness/codex-session-decision-log.md` when working inside this project harness.
- `docs/harness/lecture-cuts-content-inventory.md` for source-count and speaker-note benchmark expectations.

## Outputs

- `generated-decks/<slug>/research-dossier.md`
- `generated-decks/<slug>/raw-source-list.md`

## Procedure

1. Read `generated-decks/<slug>/topic-intake.md`.
2. If this is this project harness, read `docs/harness/codex-session-decision-log.md` and apply requirements for checked dates, official API/tool claims, Korean-first summaries, and evidence-backed deck work.
3. Prefer official or primary sources first. For technical, product, or API topics, use at least two official sources unless `research-dossier.md` records why official sources are unavailable.
4. Record checked dates for current, tool, product, API, version, price, policy, or schedule claims.
5. Summarize sources in Korean and separate durable concepts from date-sensitive claims.
6. Write claims to use, claims to avoid, source notes, confidence, and open risks.

## Quality Bar

- `Claims To Use` contains only claims supported by sources or clearly marked as user-provided assumptions.
- `Claims To Avoid` is non-empty or contains `Reviewed: none found`.
- Every current/tool/API claim includes a checked date.
- Source summaries are understandable to general Korean learners and preserve important original English terms.
- Weak, secondary, or conflicting sources are flagged instead of silently blended.

## Verification

- `rg -n "^## (Source Summary|Claims To Use|Claims To Avoid|Checked Dates|Open Risks)" generated-decks/<slug>/research-dossier.md`
- `rg -n "official|Official|primary|Checked:|checked date|Reviewed: none found" generated-decks/<slug>/research-dossier.md generated-decks/<slug>/raw-source-list.md`
- For technical/product/API topics, confirm at least two official sources exist in `generated-decks/<slug>/raw-source-list.md`, or confirm the dossier explains why they are unavailable.
- Confirm `Claims To Avoid` is not blank.

## Stop Conditions

- Required official sources are unavailable and no explicit unavailability note can be justified.
- Date-sensitive claims cannot be checked with the available sources.
- `Claims To Avoid` is empty.
- Source conflicts would materially change the deck message and need user or lead-agent judgment.
