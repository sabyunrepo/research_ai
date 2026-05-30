# Verification Brief

Task type: `lecture-cuts`
Current verifier level: `0`
Max verifier-improvement attempts: `5`
Target files: `lecture-cuts/`, `docs/harness/`, `deck-harness/`, `scripts/`
Verifier profiles: `harness-verification-agent`
Evidence required: `node scripts/run-lecture-cuts-hook.js pre-handoff`
Blocks handoff when: any hook fails, reproduction contract drifts, source-sensitive coverage is missing, or handoff lacks command and exit-status evidence.

## Required Reads

- `AGENTS.md`
- `lecture-cuts/AGENTS.md`
- `lecture-cuts/agents/harness-verification-agent.md`
- `lecture-cuts/skills/verification-gate/SKILL.md`
- `docs/harness/lecture-cuts-reproduction-contract.md`
- `lecture-cuts/HANDOFF.md`

## Verification Axes

- Slide registry, files, and cached HTML match.
- Contract validates slide count, order, hashes, titles, speaker sources, and source coverage.
- Browser render, presenter review, glossary, and overflow checks are represented.
- Handoff carries latest command evidence and unresolved risk.

## Commands To Run

```sh
node scripts/run-lecture-cuts-hook.js pre-handoff
```

## PASS Criteria

- Pre-handoff hook exits 0.
- No output-level FAIL remains.
- WARN entries, if any, are non-blocking and have owners.
