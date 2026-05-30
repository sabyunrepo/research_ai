# Verification Verdict

Verifier: `<verifier-profile>`
Task type: `<task-type>`
Attempt: `<n>/<max-attempts>`
Verifier level: `<level>`
Status: `PASS|WARN|FAIL`
Severity: `P0|P1|P2|P3`
Blocks handoff: `yes|no`
Required follow-up: `<specific action or none>`
Evidence path: `<paths, command output, screenshots, reports, or missing>`

## 판정

- `<one concrete sentence>`

## 발견

- `[P#] <finding>`
  Evidence: `<file:line, command, screenshot, report path, or missing evidence>`
  Why it matters: `<user, learner, security, regression, or handoff impact>`
  Required fix: `<owner and source/test/harness layer>`

## 수행한 검증

- Local files checked:
- Commands checked:
- Browser evidence checked:
- External standards checked:
- Prior failure patterns checked:
- Capability state checked:

## 엣지 케이스 및 우회 검증

- Resource constraints checked:
- Async/concurrency/idempotency checked:
- Malformed or adversarial inputs checked:
- Prompt-injection or policy-bypass checks:
- Decoupled environment evidence:

## 다차원 점수

| axis | score 0-5 | evidence | false-positive risk | false-negative risk |
|---|---:|---|---|---|
| deterministic gates |  |  |  |  |
| evidence quality |  |  |  |  |
| security / bypass risk |  |  |  |  |
| regression risk |  |  |  |  |
| portability |  |  |  |  |
| user or learner impact |  |  |  |  |

## 자체 개선 판단

- Improvement needed: `yes|no`
- Root verifier weakness:
- Root cause category: `context_gap|reasoning_error|knowledge_gap|tool_failure|environment_coupling|policy_gap|regression_suite_gap|none`
- Allowed improvement type:
- Promotion candidate: `yes|no`
- Regression suite required before promotion:

## 미해결 위험

- `<remaining risk or none>`

## 근거

- `<path or source>` - `<why it supports the verdict>`
