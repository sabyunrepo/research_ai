---
name: handoff-maintainer
description: Use when writing or reviewing lecture-cuts final handoff, risks, evidence, and next prompt.
---

# Lecture Cuts Handoff Maintainer

## When to Use

Use this skill at the end of any `lecture-cuts/` harness or deck task, after verification runs, or when preparing the next worker prompt from current state, changed files, command evidence, agent findings, and remaining risks.

## Inputs

- `lecture-cuts/HANDOFF.md`
- `docs/harness/lecture-cuts-agent-handoff.md`
- `docs/harness/lecture-cuts-source-map.json`
- `docs/harness/lecture-cuts-content-inventory.md`
- `docs/harness/lecture-cuts-reproduction-contract.md`
- `docs/harness/codex-session-decision-log.md`
- Latest `git status --short`
- Latest verification command output and exit status
- Changed `lecture-cuts/`, `docs/harness/`, `docs/audits/`, and `scripts/` files

## Outputs

- Updated `lecture-cuts/HANDOFF.md`
- Updated or referenced agent findings in `docs/harness/lecture-cuts-agent-handoff.md`
- Final report using 발견 / 수행 / 판단 / 미해결
- Copy-ready next prompt that preserves the current source/spec/verification state

## Procedure

1. Read the current handoff, agent handoff, source map, content inventory, reproduction contract, and Codex session decision log.
2. Collect changed files with `git status --short` without reverting unrelated worker changes.
3. Collect the latest verification command names, exit statuses, and summarized outputs.
4. Copy every relevant `WARN` or `FAIL` from `docs/harness/lecture-cuts-agent-handoff.md` into Agent Findings, Blocked Risks, or Non-Blocking Risks.
5. Write the final handoff using this shape:
   - Current State
   - Inputs
   - Evidence Map Status
   - Source Coverage
   - Decisions
   - Changed Files
   - Generated Artifacts
   - Quality Gate Artifacts
   - Verification
   - Agent Findings
   - Blocked Risks
   - Non-Blocking Risks
   - Next Prompt
6. Keep PASS claims tied to command output or artifact paths.
7. Keep Blocked Risks and Non-Blocking Risks explicit; write `None` only when verification evidence supports it.
8. End the user-facing final report with 발견 / 수행 / 판단 / 미해결.

## Quality Bar

- Handoff is a reproduction contract, not a loose status memo.
- Verification section names the latest command, exit status, and evidence path.
- Changed Files covers modified or generated files in `lecture-cuts`, `docs/harness`, `docs/audits`, and `scripts`.
- Source Coverage states whether slide-visible claims are mapped, deck-global only, weak, or unresolved.
- Agent Findings preserve all `WARN` and `FAIL` items with owners or required follow-up.
- Next Prompt is specific enough for a new worker to continue without rereading the entire conversation.

## Verification

Run:

```sh
rg -n "## Current State|## Inputs|## Evidence Map Status|## Source Coverage|## Decisions|## Changed Files|## Generated Artifacts|## Quality Gate Artifacts|## Verification|## Agent Findings|## Blocked Risks|## Non-Blocking Risks|## Next Prompt" lecture-cuts/HANDOFF.md
rg -n "Status: PASS|Status: WARN|Status: FAIL|Required follow-up|Evidence path" docs/harness/lecture-cuts-agent-handoff.md
node scripts/verify-lecture-cuts-harness.js --handoff-only
```

If `lecture-cuts/HANDOFF.md` or `docs/harness/lecture-cuts-agent-handoff.md` does not exist yet, write the missing file first and then rerun the checks.

## Stop Conditions

- Verification omits the latest command and exit status.
- Agent Findings omit any WARN/FAIL from `docs/harness/lecture-cuts-agent-handoff.md`.
- Blocked Risks and Non-Blocking Risks are both empty.
- Changed Files omits a modified `lecture-cuts`, `docs/harness`, `docs/audits`, or `scripts` file.
- Any generated artifact listed in the handoff does not exist.
- Any PASS claim lacks command output or artifact path.
