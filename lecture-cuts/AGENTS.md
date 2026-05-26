# Lecture Cuts Agent Instructions

## Instruction Ownership

전역/사용자 레벨 AGENTS.md는 비워 두고, 이 프로젝트의 지침은 이 파일에서 관리한다.
Shared agent rules may be added here only when they preserve this directory's slide contract, source metadata, and verification gates.

## Scope

These instructions apply to `lecture-cuts/` and its children.

## Required Reads Before Editing Slides

1. Read `lecture-cuts/source.md`.
2. Read `lecture-cuts/slide-spec.json`.
3. Read `docs/harness/lecture-cuts-content-inventory.md`.
4. Read `docs/harness/lecture-cuts-source-map.json` when changing factual claims or source metadata.
5. Read `docs/harness/codex-session-decision-log.md` when changing harness behavior, agents, skills, or handoff rules.
6. Read `lecture-cuts/skills/korean-copy-review/SKILL.md` when changing Korean slide copy, presenter scripts, terminology, or slide-script alignment.
7. Read `lecture-cuts/skills/slide-script-composition-review/SKILL.md` when reviewing whether slide structure, presenter script, and neighboring flow work together as a teachable presentation.

## Rules

1. Treat `lecture-cuts/slide-spec.json` as the current reproduction contract.
2. Keep visible deck output stable unless the task explicitly asks for copy, source, or visual changes.
3. Manage slide copy and presenter script as one unit:
   - If slide HTML, title, subtitle, bullets, visual evidence, or `div.note` changes, update the matching presenter script in `lecture-cuts/assets/slides.js` or `lecture-cuts/presenter-preview.html` in the same change.
   - If a presenter script changes the teaching point, claim, example, order, or timing, update the matching slide HTML and `div.note` in the same change.
   - Do not leave generic presenter text in place when the visible slide carries a specific example, code sample, diagram, or source-sensitive claim.
4. Update source metadata with any content claim change.
5. Regenerate `slide-spec.json` after intentional slide content or presenter script changes.
6. Do not hide verification failures by removing checks, weakening tests, or deleting warnings.
7. Update `lecture-cuts/HANDOFF.md` and `docs/harness/lecture-cuts-agent-handoff.md` when work affects harness state.
8. For Korean copy rewrites, preserve official file names and commands but keep learner-facing explanation Korean-first.
9. For slide/script composition reviews, produce a concrete report before editing and classify each finding by screen, script, flow, or load.

## Verification

Before final completion, run:

```sh
node scripts/export-lecture-cuts-contract.js --check-confidence
node scripts/validate-lecture-cuts-contract.js
node scripts/audit-lecture-cuts.js
node scripts/audit-lecture-cuts-korean-copy.js
node scripts/audit-lecture-cuts-speaker-sync.js
node scripts/verify-lecture-cuts-harness.js
```

If a slide changed intentionally, run this first:

```sh
node scripts/export-lecture-cuts-contract.js
```
