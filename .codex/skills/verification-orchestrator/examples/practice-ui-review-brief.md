# Verification Brief

Task type: `practice-ui`
Current verifier level: `0`
Max verifier-improvement attempts: `5`
Target files: `practice-harness/react-src/App.jsx`, `practice-harness/public/practice-app.js`, `practice-harness/public/styles.css`, `practice-harness/practices/*.json`
Verifier profiles: `critical-practice-harness-verifier`
Evidence required: `npm run qa:practice`, Act 1-6 desktop/mobile screenshots under `.tmp/practice-browser-qa/`
Blocks handoff when: browser QA is missing, modal result flow regresses, required learner guidance is absent, or score/unlock behavior is inconsistent.

## Required Reads

- `AGENTS.md`
- `practice-harness/agents/critical-practice-harness-verifier-agent.md`
- `docs/harness/lecture-cuts-redesign-master-spec.md`
- `docs/superpowers/plans/2026-05-28-practice-harness-act1-6-expansion.md`
- `practice-harness/practices/*.json`
- `practice-harness/react-src/App.jsx`

## Verification Axes

- Learner can see goal, hints, retry path, score, missing items, and unlock artifact.
- Result appears in a modal dialog with loading state.
- Act 1-6 flows align with the practice plan.
- Glossary tooltips use custom accessible popovers.
- Built bundle matches source after `npm run build:practice-ui`.

## Commands To Run

```sh
npm run qa:practice
```

## PASS Criteria

- `npm run qa:practice` exits 0.
- All Act 1-6 desktop/mobile screenshot checks pass.
- Verifier report names strongest remaining risk even on PASS.
