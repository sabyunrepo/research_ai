# Lecture Cuts Agent Instructions

## Scope

These instructions apply to `lecture-cuts/` and its children.

## Required Reads Before Editing Slides

1. Read `lecture-cuts/source.md`.
2. Read `lecture-cuts/slide-spec.json`.
3. Read `docs/harness/lecture-cuts-content-inventory.md`.
4. Read `docs/harness/lecture-cuts-source-map.json` when changing factual claims or source metadata.
5. Read `docs/harness/codex-session-decision-log.md` when changing harness behavior, agents, skills, or handoff rules.

## Rules

1. Treat `lecture-cuts/slide-spec.json` as the current reproduction contract.
2. Keep visible deck output stable unless the task explicitly asks for copy, source, or visual changes.
3. Update speaker notes and source metadata with any content claim change.
4. Regenerate `slide-spec.json` after intentional slide content changes.
5. Do not hide verification failures by removing checks, weakening tests, or deleting warnings.
6. Update `lecture-cuts/HANDOFF.md` and `docs/harness/lecture-cuts-agent-handoff.md` when work affects harness state.

## Verification

Before final completion, run:

```sh
node scripts/export-lecture-cuts-contract.js --check-confidence
node --check lecture-cuts/assets/glossary.js
node scripts/validate-lecture-cuts-contract.js
node scripts/audit-lecture-cuts.js
node scripts/verify-lecture-cuts-harness.js
```

If a slide changed intentionally, run this first:

```sh
node scripts/export-lecture-cuts-contract.js
```
