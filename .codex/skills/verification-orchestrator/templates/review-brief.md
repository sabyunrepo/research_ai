# Verification Brief

Task type: `<task-type>`
Current verifier level: `<level>`
Max verifier-improvement attempts: `<max-attempts>`
Target files: `<paths>`
Verifier profiles: `<profile ids>`
Task-specific verification pack: `<pack path or fallback>`
Evidence required: `<commands, screenshots, reports, source paths>`
Blocks handoff when: `<blocking conditions>`

## Required Reads

- `<path or source>`

## Verification Axes

- Requirement fit:
- Regression risk:
- Evidence completeness:
- User or learner impact:
- Security or permission risk:
- Handoff readiness:
- Edge-case and bypass coverage:
- Decoupled and idempotent environment:
- Heuristic score calibration:
- Root-cause diagnosis readiness:
- Human approval gate:

## Commands To Run

```sh
<command>
```

Record command, exit status, and relevant output summary.

## Evidence To Inspect

- Source paths:
- Generated artifacts:
- Browser evidence:
- External standards or docs:
- Prior failure patterns:
- Resource constraint evidence:
- Async, concurrency, and idempotency evidence:
- Negative examples or adversarial cases:
- Regression suite evidence:
- Approval evidence for persistent verifier changes:

## Blind Spot Probe

- Command:
- Exit status:
- Task-specific blind spot patterns checked:
- Missed evidence path, if any:
- Verifier-harness improvement required:

## PASS Criteria

- Every blocking command exits 0.
- Every task-specific requirement has direct source, command, browser, or report evidence.
- No known failure pattern for this task type remains untested.
- The blind-spot probe exits 0 or a detected verifier miss has been improved and rechecked.
- Edge-case and bypass checks are either executed or explicitly marked infeasible with reason.
- Repeated runs are idempotent or isolated from contaminated prior state.
- Any WARN has owner, reason, and follow-up.

## WARN Criteria

- Non-blocking evidence is incomplete but the missing evidence has a named owner.
- A residual risk remains but does not invalidate the current task.
- Optional tool coverage was unavailable and a fallback was recorded.

## FAIL Criteria

- Required evidence is missing.
- A command or gate fails.
- The verifier relies on intent, memory, or claimed success instead of current evidence.
- A PASS criterion is weakened to make the run pass.
- A tool, permission, or global/user write expands without explicit approval.

## Report Format

Use `templates/verdict.md`.

## Self-Improvement Handling

If verification finds target defects, repair the target first and rerun the same verifier.

If the verifier finds nothing but evidence suggests a blind spot, improve verifier logic with `templates/improvement-proposal.md`. Only verifier-logic improvements consume the max-attempts budget.

Executable loop command shape:

```sh
node scripts/run-verification-orchestrator-loop.js \
  --max-attempts <n> \
  --verify-command "<target verification command>" \
  --target-repair-command "<target repair command>" \
  --blind-spot-command "<blind spot detector>" \
  --improve-verifier-command "<verifier improvement command>"
```

Do not modify implementation output while reviewing. Assign repairs to the owning worker or a separate explicit repair task.
