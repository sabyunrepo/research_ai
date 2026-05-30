---
name: verification-orchestrator
description: Use when a task needs dynamic verifier selection, evidence-first PASS/WARN/FAIL review, bounded self-improvement retries, or persistent verifier capability promotion across runs.
---

# Verification Orchestrator

## Purpose

Use this skill to verify work without collapsing every review into one giant generic agent.

The orchestrator owns the workflow:

```text
task classifier
-> verifier registry
-> review brief generator
-> evidence collector
-> verifier runner
-> improvement proposer
-> promotion gate
-> capability state store
-> final adjudicator
```

Specialized verifier agents own judgment. The orchestrator chooses them, prepares the brief, collects evidence, interprets reports, and records safe verifier-harness improvements.

## Core Rule

The verifier is not the implementation worker.

- Do not silently repair implementation output during verification.
- Do not weaken PASS criteria to make a run pass.
- Do not edit global/user instructions or write outside the project root.
- Do not persist private transcripts as default memory.
- Do not create a permanent verifier agent for every task. Generate a task-specific review brief first.

Repairs must be assigned to the owning worker or done in a separate explicit repair task. Verifier self-improvement may change only verifier-harness artifacts such as matrices, templates, evidence requirements, validation scripts, and project adapters.

## Mature Verifier Capability Contract

A mature verifier does not only check the happy path. Every review brief must force these capabilities:

1. Context-based edge-case inference:
   - Identify resource constraints such as memory pressure, network latency, async timing, concurrency, file-system state, and provider fallback behavior.
   - Attempt bypass thinking for prompt injection, obfuscated input, malformed data, duplicate submissions, stale bundles, hidden mock paths, and policy filter evasion.
   - Record which edge cases were tested, which were infeasible, and why.
2. Multi-dimensional heuristic scoring:
   - Separate deterministic gates from heuristic judgment.
   - Score correctness, evidence quality, security risk, regression risk, portability, maintainability, and user/learner impact.
   - State false-positive and false-negative risk when a WARN or PASS depends on heuristics.
3. Decoupled and idempotent verification environment:
   - Keep verifier state separate from the target system state.
   - Prefer sandboxed or isolated execution for tests, parsers, and generated artifacts.
   - Ensure repeated verification runs do not depend on contaminated prior state.
4. Meta-cognitive failure diagnosis:
   - When verification fails or misses a defect, classify root cause as context gap, reasoning error, knowledge gap, tool failure, environment coupling, policy gap, or regression-suite gap.
   - Use diagnosis to decide whether to repair the target, add evidence collection, add a negative failure pattern, or improve verifier logic.
   - Do not promote an improvement without a regression check proving it did not weaken existing gates.

## Inputs

- User task and target files.
- Applicable project instructions such as `AGENTS.md`.
- `.codex/skills/verification-orchestrator/matrices/task-to-verifier.json`.
- `.codex/verification/capability-state.json`.
- Existing verifier agents referenced by the matrix.
- Available command output, browser screenshots, generated reports, source maps, and handoff files.

## Outputs

- A task-specific review brief using `templates/review-brief.md`.
- One or more verifier reports using `templates/verdict.md`.
- Optional improvement proposals using `templates/improvement-proposal.md`.
- Updated `.codex/verification/promotion-log.md` only after a validated promotion.
- Updated `.codex/verification/capability-state.json` only after a validated promotion.

## Procedure

1. Read project instructions and capability state.
2. Parse `maxAttempts` from the user request. If absent, use `defaultMaxAttempts` from capability state. The project default is 5.
3. Classify the task using the matrix:
   - `practice-ui`
   - `lecture-cuts`
   - `deck-harness`
   - `context-research`
   - `code-change`
   - `slide-deck`
   - `pptx-deck`
   - `schedule-plan`
   - `document-review`
   - `ops-checklist`
   - `security-sensitive`
   - `generic-code-change`
4. Resolve the task-specific verification pack with:
   - `node scripts/resolve-verification-task.js --task "<description>"`
   - or `node scripts/resolve-verification-task.js --task-type <task-type>`
5. Select verifier profiles from the matrix. If no exact route exists, use `generic-code-change` and generate a narrow task-specific brief.
6. Generate a review brief with:
   - target files,
   - verifier profiles,
   - mandatory reads,
   - evidence commands,
   - task-specific verification axes,
   - task-specific blind spot patterns,
   - browser or screenshot requirements,
   - PASS/WARN/FAIL rules,
   - blocked conditions,
   - final report format.
7. Collect evidence before asking for PASS:
   - command output and exit status,
   - source paths and line references,
   - browser screenshots or DOM evidence when relevant,
   - generated reports and handoff artifacts,
   - external source checks when the task depends on current standards.
8. Run edge-case and bypass checks appropriate to the task type.
9. Score the result across deterministic and heuristic axes.
10. Run verifier profiles as independent reviewers.
11. Adjudicate reports:
   - PASS only when all blocking checks pass with evidence.
   - WARN only when risk is named, non-blocking, and has an owner.
   - FAIL when evidence is missing, gates fail, or the learner/user-facing contract is broken.
12. If verification does not pass, run the self-improvement loop.

## Task-Specific Verification Packs

Level 4 requires a reusable pack for each broad task family. A pack lives under `.codex/skills/verification-orchestrator/packs/` and defines:

- verification axes,
- task-specific blind spot patterns,
- sample tasks,
- repair strategy,
- verifier-improvement strategy.

Current Level 4 packs:

- `code-change`: executable regression, syntax/type/lint, runtime edge cases, contract drift.
- `slide-deck`: source/spec drift, desktop/projector/mobile render, asset meaning, presenter separation, teaching flow.
- `pptx-deck`: .pptx parse/open/export evidence, slide order, media inventory, notes, visual fit.
- `schedule-plan`: owners, dates, dependencies, buffers, critical path, timezone assumptions, handoff risk.
- `document-review`: claim-source support, contradictions, currentness, audience fit, decisions, actionability.
- `ops-checklist`: preconditions, postconditions, owner, rollback, escalation, idempotency, execution evidence.

Validate packs and routing with:

```sh
node scripts/test-verification-task-packs.js
```

## Probe-of-Probe Negative Fixtures

Level 5 treats the blind spot probe itself as a verification target. The verifier must prove that deliberately broken verifier packs fail.

Negative fixtures live at:

```text
.codex/skills/verification-orchestrator/negative-fixtures/probe-of-probe.json
```

Validate probe-of-probe and mutation coverage with:

```sh
node scripts/test-verification-probe-of-probe.js
```

The negative fixture suite mutates task packs in memory and expects detection for:

- missing blind spot patterns,
- missing sample tasks,
- sample tasks that do not exercise any detector,
- missing task-specific verification axes,
- missing verifier improvement strategy,
- missing target repair strategy.

If these negative fixtures do not fail as expected, the blind spot probe is too weak and the verifier must not promote the run.

## Target-Fix / Verifier-Improve Loop

Default maximum verifier-improvement attempts: 5.

`maxAttempts` limits verifier-logic improvement attempts, not ordinary target repair passes.

Use this loop:

```text
1. Verify the target.
2. If the verifier detects target defects, repair the target in the owning layer.
3. Re-run the same verifier against the repaired target.
4. Repeat target repair until the verifier no longer detects target defects.
5. If verification passes, always run blind-spot detection.
6. If the blind-spot detector finds no verifier miss, stop with PASS or no-finding verdict.
7. If the blind-spot detector finds evidence that the verifier missed something, improve verifier logic.
8. Re-run verification with the improved verifier.
9. If the improved verifier detects target defects, repair the target and return to step 1.
10. If the improved verifier still detects nothing, stop with no-finding verdict.
11. If verifier-logic improvements reach maxAttempts, stop as blocked.
```

Each verifier-logic improvement consumes one attempt from `maxAttempts`. Target repairs do not consume the verifier-improvement budget unless they require changing verifier rules, templates, matrices, state, or validator scripts.

Each verifier-logic improvement must produce one improvement proposal. The proposal must identify a weakness in the verifier harness, not just a defect in the implementation.

The executable runner supports the same separation:

```sh
node scripts/run-verification-orchestrator-loop.js \
  --max-attempts 10 \
  --verify-command "<target verification command>" \
  --target-repair-command "<command that repairs detected target defects>" \
  --blind-spot-command "<command that fails when verifier logic missed something>" \
  --improve-verifier-command "<command that improves verifier logic>"
```

If `--verify-command` fails, the runner calls `--target-repair-command` and verifies again. If verification passes, always run blind-spot detection. When `--blind-spot-command` is not provided, the runner uses the default blind spot probe:

```sh
node scripts/probe-verification-orchestrator-blind-spots.js
```

If the blind-spot command fails, the runner calls `--improve-verifier-command`; that is the only path that consumes the max-attempts budget.

## Blind Spot Detection

Blind spot detection is a second verifier-harness check, not a target test. It asks whether the current verifier would likely miss defects because its evidence model is too narrow.

The built-in default blind spot probe checks that the verifier harness contains:

- known failure patterns for happy-path-only verification, heuristic PASS/WARN/FAIL without risk cost, contaminated verification state, and self-improvement without regression gates,
- templates that require edge-case and bypass evidence, false-positive risk, false-negative risk, idempotency, negative examples, regression evidence, root-cause diagnosis, and human approval gates,
- executable loop fixtures for target repair, blind-spot improvement, improvement failure, and improvement budget exhaustion,
- validator coverage proving the probe itself remains part of the project adapter.

The probe exits 0 only when those harness-level blind-spot detectors are present. It exits non-zero when the verifier harness is missing a detector, even if the target verification command passed.

## Verification Conditions

Target verification condition:

- `--verify-command` exit 0 means the configured target checks found no current defect.
- non-zero means target defect, missing evidence, or invalid contract; repair target first.

Verifier blind-spot condition:

- `--blind-spot-command` exit 0 means no verifier blind spot was detected by the configured probe.
- non-zero means the verifier missed or could miss a required evidence path; improve verifier logic before trusting PASS.

Target repair condition:

- `--target-repair-command` exit 0 means a repair was attempted and the target must be verified again.
- non-zero blocks immediately.
- target repair loops do not consume verifier-improvement attempts.

Verifier improvement condition:

- `--improve-verifier-command` exit 0 means the harness was improved and must run verification again from the top.
- non-zero blocks immediately.
- each verifier-logic improvement consumes one `maxAttempts` budget unit.

Promotion condition:

- a successful improvement does not automatically raise verifier level.
- level promotion requires root-cause diagnosis, changed verifier-harness artifact, validation command, regression or negative example evidence, and human approval when the change affects shared policy or acceptance thresholds.

Allowed improvement types:

- add a missing evidence requirement,
- add a known failure pattern,
- add a task-to-verifier route,
- tighten a verdict template,
- add a deterministic validator check,
- add a project adapter command.

Forbidden improvement types:

- weaken PASS criteria,
- delete failing checks,
- edit global/user instructions,
- grant new tools or permissions,
- persist full private transcripts by default,
- modify visible deck or practice output as verifier self-improvement.

## Promotion Gate

Raise `currentLevel` only when all conditions hold:

- The improvement catches a real miss or missing evidence path.
- The improvement is represented in a structured artifact.
- The improvement has a validation command.
- The validation command passes.
- A regression suite or representative negative examples pass after the improvement.
- The diagnosis names root cause and why target repair alone was insufficient.
- The promotion is recorded in `promotion-log.md`.
- The state update does not grant new permissions or weaken checks.

## Human Approval Gate

Require explicit human approval before promoting any verifier improvement that:

- changes system-level instructions, policy interpretation, security severity, or business acceptance thresholds,
- adds or removes tool permissions,
- changes persistent memory, prompt templates, or project adapters used across runs,
- has high false-positive or false-negative risk,
- lacks a representative negative regression fixture.

Without approval, record the improvement as `proposed` or `blocked`; do not raise `currentLevel`.

Level meanings:

- Level 0: baseline routing and report format.
- Level 1: task-aware evidence collection.
- Level 2: known failure patterns checked before PASS.
- Level 3: bounded harness improvement proposals.
- Level 4: task-specific verifier packs and proposed checks validated against sample tasks.
- Level 5: probe-of-probe, negative fixtures, and mutation-tested blind spot packs.
- Level 6+: project-specific maturity levels requiring explicit promotion evidence.

## Stop Conditions

Stop and report blocked when:

- max verifier-improvement attempts is reached,
- the same failure repeats twice after an improvement,
- no new evidence can be collected,
- a required tool or permission is unavailable,
- an improvement would weaken a gate,
- an improvement requires global/user writes,
- a verifier tries to pass without required evidence.

## Project Adapter: research_ai

For this project, seed routes are:

- `practice-ui`: use `practice-harness/agents/critical-practice-harness-verifier-agent.md`; evidence includes `npm run qa:practice` and Act 1-6 desktop/mobile browser screenshots.
- `lecture-cuts`: use `lecture-cuts/agents/harness-verification-agent.md` and `lecture-cuts/skills/verification-gate/SKILL.md`; evidence includes `node scripts/run-lecture-cuts-hook.js pre-handoff`.
- `deck-harness`: use `deck-harness/agents/verification-agent.md`; add visual verifier when generated deck visuals changed.
- `context-research`: use the context research pack validator and claim-support tables.

Do not edit visible `lecture-cuts` output or `practice-harness` learner UI when the task is only verifier-harness work.

## Verification

After editing this orchestrator package, run:

```sh
node scripts/validate-verification-orchestrator.js
node scripts/run-verification-orchestrator-loop.js --max-attempts 10
node scripts/test-verification-orchestrator-loop.js
```

For this repository's pre-handoff gate, also run:

```sh
npm test
npm run qa:practice
node scripts/run-lecture-cuts-hook.js pre-handoff
```
