# Verification Orchestrator Promotion Log

Current level: 5
Default max verifier-improvement attempts: 5

## Policy

Record only validated verifier-harness improvements here.

Each promotion must include:

- attempt id,
- task type,
- observed failure or missing evidence,
- root cause category,
- improvement type,
- changed verifier-harness artifact,
- validation command and exit status,
- regression suite or negative example evidence,
- human approval evidence when required,
- from level and to level,
- rollback path,
- decision.

The attempt count is consumed only by verifier-logic improvements. Target repairs and rechecks do not consume the verifier-improvement budget.

The executable loop is `node scripts/run-verification-orchestrator-loop.js --max-attempts <n>`. A target verification failure triggers target repair when a target repair command is configured. After target verification passes, the loop always runs the default blind spot probe unless a custom `--blind-spot-command` is provided. A verifier blind spot triggers verifier-logic improvement when an improve-verifier command is configured.

Level 4 promotion requires task-specific verifier packs and sample regression fixtures. Validate with `node scripts/test-verification-task-packs.js`.

Level 5 promotion requires probe-of-probe negative fixtures and mutation-tested blind spot packs. Validate with `node scripts/test-verification-probe-of-probe.js`.

Do not record full private transcripts. Do not use this log to grant new tool permissions or weaken PASS criteria.

## Promotions

### Level 4 promotion - verification-orchestrator-level-4

- attempt id: `verification-orchestrator-level-4`
- task type: `generic-code-change`
- observed failure or missing evidence: generic fallback could route code, slide, pptx, schedule, document, and ops work without task-specific evidence or blind-spot checks.
- root cause category: `policy_gap`
- improvement type: task-specific verifier packs, task resolver, sample regression fixtures, and default blind-spot enforcement.
- changed verifier-harness artifact: `.codex/skills/verification-orchestrator/matrices/task-to-verifier.json`, `.codex/skills/verification-orchestrator/packs/*.json`, `scripts/resolve-verification-task.js`, `scripts/test-verification-task-packs.js`, `scripts/probe-verification-orchestrator-blind-spots.js`.
- validation command and exit status: `node scripts/test-verification-task-packs.js`, expected exit 0.
- regression suite or negative example evidence: resolver fixtures cover code, slide, pptx, schedule, document, ops, and generic fallback routes; each pack includes blind-spot patterns and sample tasks.
- human approval evidence when required: not required; change adds verifier-harness checks and does not alter global/user instructions, tool permissions, security severity, or business acceptance thresholds.
- from level and to level: 0 -> 4 through recorded state history.
- rollback path: revert Level 4 pack, resolver, fixture, state, and log changes; rerun `node scripts/validate-verification-orchestrator.js`.
- decision: promoted.

### Level 5 promotion - verification-orchestrator-level-5

- attempt id: `verification-orchestrator-level-5`
- task type: `generic-code-change`
- observed failure or missing evidence: a blind spot probe could be too weak and still pass if no negative fixture proves that deliberately broken verifier packs fail.
- root cause category: `regression-suite_gap`
- improvement type: probe-of-probe negative fixtures and mutation-tested blind spot pack validation.
- changed verifier-harness artifact: `.codex/skills/verification-orchestrator/negative-fixtures/probe-of-probe.json`, `scripts/test-verification-probe-of-probe.js`, `scripts/probe-verification-orchestrator-blind-spots.js`, `scripts/validate-verification-orchestrator.js`, `.codex/verification/capability-state.json`.
- validation command and exit status: `node scripts/test-verification-probe-of-probe.js`, expected exit 0.
- regression suite or negative example evidence: mutations remove blindSpotPatterns, sampleTasks, sample detector links, verificationAxes, improveStrategy, and repairStrategy; each must fail through its expected detector.
- human approval evidence when required: not required; change adds verifier-harness checks and does not alter global/user instructions, tool permissions, security severity, or business acceptance thresholds.
- from level and to level: 4 -> 5.
- rollback path: revert Level 5 negative fixture, probe-of-probe script, state, and log changes; rerun `node scripts/validate-verification-orchestrator.js`.
- decision: promoted.
