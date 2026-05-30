# Issue 5 Plan: Self-Improving Verification Orchestrator

Created: 2026-05-30
Owner: Codex main agent
Status: plan-ready
Context pack: `docs/context/issue-5-self-improving-verification-agent-context-research-pack.md`

## Goal

Build a reusable verification orchestrator that can:

- classify many kinds of work,
- route to the right verifier profile or generate a task-specific review brief,
- retry verification with bounded self-improvement when verification cannot pass,
- accept a user-provided max self-improvement count, defaulting to 5,
- persist validated verifier capability improvements so the next run starts from the improved level,
- stay portable across projects and users by separating shared core from project adapters.

## Core Design

Do not create one giant verifier agent. Keep the issue #5 direction:

```text
verification-orchestrator Skill
  -> task classifier
  -> verifier registry
  -> review brief generator
  -> evidence collector
  -> verifier runner
  -> improvement proposer
  -> promotion gate
  -> capability state store
  -> final adjudicator
```

The verifier remains independent. It does not silently repair implementation work. Repairs happen through a separate worker/owner, and verifier self-improvement is limited to the verifier harness itself: matrices, templates, evidence requirements, validation scripts, and project adapter rules.

## Verification Level Model

Treat “level” as a capability contract, not as a vague confidence score.

```json
{
  "schemaVersion": 1,
  "currentLevel": 0,
  "defaultMaxAttempts": 5,
  "promotedChecks": [],
  "knownFailurePatterns": [],
  "verifierProfiles": {},
  "projectAdapters": {},
  "promotionHistory": []
}
```

Level promotion rule:

- Level 0: baseline routing and report format.
- Level 1: evidence collection is task-aware.
- Level 2: known failure patterns are checked before PASS.
- Level 3: verifier can propose bounded harness improvements.
- Level 4: verifier can validate its own proposed checks against sample tasks.
- Level 5+: project-specific maturity levels, only with explicit promotion evidence.

A level rises only when a new check or routing rule catches a real miss, passes meta-validation, and is recorded in promotion history.

## Self-Improvement Loop

Default loop count: 5 unless the user provides another max.

```text
1. Load capability state.
2. Classify task and choose verifier profiles.
3. Generate review brief.
4. Collect required evidence.
5. Run verifier.
6. If PASS, write verdict and stop.
7. If WARN/FAIL/missing evidence, create improvement proposal.
8. Apply only allowed harness improvements.
9. Validate improvement.
10. Promote level if validation passes.
11. Retry until PASS, max attempts, repeated identical failure, or no new evidence.
```

Stop as blocked when:

- the same failure repeats twice after an improvement,
- no new evidence can be collected,
- an improvement would require new tool/file permissions,
- the verifier tries to weaken a gate to pass,
- max attempts is reached.

## File Plan

First prototype should be project-local:

```text
.codex/skills/verification-orchestrator/SKILL.md
.codex/skills/verification-orchestrator/matrices/task-to-verifier.json
.codex/skills/verification-orchestrator/templates/review-brief.md
.codex/skills/verification-orchestrator/templates/verdict.md
.codex/skills/verification-orchestrator/templates/improvement-proposal.md
.codex/skills/verification-orchestrator/schema/capability-state.schema.json
.codex/verification/capability-state.json
.codex/verification/promotion-log.md
scripts/validate-verification-orchestrator.js
docs/context/issue-5-self-improving-verification-agent-context-research-pack.md
docs/context/issue-5-self-improving-verification-agent-plan.md
```

Optional later portable package:

```text
verification-orchestrator/
  core/
  templates/
  schemas/
  adapters/
  examples/
```

## Initial Task-To-Verifier Matrix

Seed the matrix with existing local patterns:

| task type | verifier profile | required evidence |
|---|---|---|
| `practice-ui` | `critical-practice-harness-verifier` | `npm run qa:practice`, desktop/mobile browser screenshots, practice JSON, React source and built bundle |
| `lecture-cuts` | `harness-verification-agent` | contract export, contract validation, audit scripts, speaker sync, handoff evidence |
| `deck-harness` | `verification-agent` plus visual verifier when needed | schema checks, source map, browser render, presenter review, glossary checks |
| `context-research` | `context-research-reviewer` | context pack validator, source ledger, claim support table |
| `security-sensitive` | `security-verifier` future profile | threat model, permission diff, dependency/tool use evidence |
| `generic-code-change` | generated review brief | tests, lint/typecheck, changed files, risk-specific checks |

## Improvement Proposal Contract

Every self-improvement must be written as:

```text
Failure observed:
Evidence:
Root verifier weakness:
Proposed harness change:
Allowed change type:
Expected stronger check:
Validation command:
Rollback path:
Promotion level change:
```

Allowed change types:

- add a missing evidence requirement,
- add a known failure pattern,
- add a task-to-verifier route,
- tighten a verdict template,
- add a deterministic validator check,
- add a project adapter command.

Forbidden change types:

- weaken PASS criteria,
- delete failing checks,
- edit global/user instructions,
- grant new tools or permissions,
- persist full private transcripts by default,
- modify visible deck/practice output as verifier self-improvement.

## Implementation Phases

1. Contract only:
   - Add Skill, templates, matrix, schema, initial state, promotion log.
   - Add validator script for required files, JSON validity, matrix shape, template placeholders, and state schema.

2. Local adapter:
   - Encode research_ai task types and commands.
   - Reference existing verifier agents instead of duplicating them.
   - Add two sample review briefs: `practice-ui` and `lecture-cuts`.

3. Self-improvement state:
   - Add attempt and promotion record format.
   - Add default max attempts = 5.
   - Add blocked conditions.

4. Meta-verification:
   - Validator rejects PASS criteria weakening.
   - Validator requires every promoted check to cite evidence and validation command.
   - Validator prevents global/user path writes.

5. Optional automation:
   - Add a CLI wrapper that generates a review brief from a task type.
   - Later connect to hooks only after manual runs prove stable.

## Acceptance Criteria

- Another agent can read only the orchestrator Skill and know how to select verifier profiles.
- The matrix covers at least `practice-ui` and `lecture-cuts` with real repo commands.
- Review brief and verdict templates are complete and reusable.
- Capability state starts at level 0 or the latest persisted level.
- Max attempts defaults to 5 and is user-overridable.
- Self-improvement cannot weaken gates or mutate global/user instructions.
- Promotion history records evidence, validation, and level changes.
- `node scripts/validate-verification-orchestrator.js` passes.
- The existing context research pack validator passes for the planning artifact.

## First Implementation Prompt

```text
Implement issue #5 phase 1 only.

Create the verification-orchestrator Skill, templates, matrix, state schema,
initial capability state, promotion log, and validator script exactly under
the project root. Do not edit visible lecture-cuts output or practice UI.
Reuse existing verifier agents by reference. Add sample briefs for practice-ui
and lecture-cuts. Run the validator and report changed files plus evidence.
```
