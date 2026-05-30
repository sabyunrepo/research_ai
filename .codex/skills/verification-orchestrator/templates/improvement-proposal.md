# Verification Harness Improvement Proposal

Verifier improvement attempt: `<n>/<max-attempts>`
Task type: `<task-type>`
Current verifier level: `<level>`
Proposed next level: `<level or unchanged>`
Status: `proposed|validated|rejected|blocked`

## Loop Position

- Verification target defect detected: `yes|no`
- Target repair attempted before verifier improvement: `yes|no|not-applicable`
- Reason verifier logic must improve:
- Verifier improvement budget used after this proposal: `<n>/<max-attempts>`

## Failure Observed

- 

## Evidence

- Command:
- Exit status:
- Source path:
- Browser or report path:
- Missing evidence:

## Root Verifier Weakness

- 

## Root Cause Category

Choose one:

- context_gap
- reasoning_error
- knowledge_gap
- tool_failure
- environment_coupling
- policy_gap
- regression_suite_gap

## Target Repair Guidance

- Owning layer:
- Required target change:
- Re-run command after target repair:

## Proposed Harness Change

- 

## Allowed Change Type

Choose one:

- missing evidence requirement
- known failure pattern
- task-to-verifier route
- verdict template tightening
- deterministic validator check
- project adapter command

## Validation Command

```sh
node scripts/validate-verification-orchestrator.js
```

## Expected Stronger Check

- 

## Regression Gate

- Existing checks that must still pass:
- Negative failure example added:
- False-positive risk:
- False-negative risk:
- Human approval required: `yes|no`
- Human approval evidence:
- Deployment decision: `promote|propose-only|block`

## Rollback Path

- 

## Promotion Decision

- Raise level: `yes|no`
- Promotion evidence:
- Promotion log entry:

## Forbidden Checks

Reject this proposal if it:

- weaken PASS criteria,
- delete failing checks,
- edit global/user instructions,
- grant new tools or permissions,
- persist full private transcripts by default,
- modifies visible deck or practice output as verifier self-improvement.
