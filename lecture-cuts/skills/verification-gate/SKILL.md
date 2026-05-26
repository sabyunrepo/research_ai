---
name: verification-gate
description: Use when running or interpreting lecture-cuts syntax, contract, audit, and handoff gates.
---

# Lecture Cuts Verification Gate

## When to Use

Use this skill before handoff, after changes to `lecture-cuts/`, after source/spec metadata changes, after presenter-review changes, or when a worker needs to decide whether the lecture-cuts deck is safe to pass forward.

## Inputs

- `lecture-cuts/assets/slides.js`
- `lecture-cuts/assets/deck.js`
- `lecture-cuts/assets/presenter-review.js`
- `lecture-cuts/slide-spec.json`
- `docs/harness/lecture-cuts-source-map.json`
- `docs/harness/lecture-cuts-reproduction-contract.md`
- `scripts/validate-lecture-cuts-contract.js`
- `scripts/audit-lecture-cuts.js`
- `scripts/audit-lecture-cuts-korean-copy.js`
- `scripts/audit-lecture-cuts-speaker-sync.js`
- `scripts/verify-lecture-cuts-harness.js`
- `lecture-cuts/HANDOFF.md`, when handoff exists
- `docs/harness/lecture-cuts-agent-handoff.md`, when agent reports exist

## Outputs

- Command output and exit status for every mandatory gate.
- PASS/WARN/FAIL interpretation for syntax, reproduction contract, audit, and handoff readiness.
- Blocking failure list for handoff.
- Non-blocking risk list with owner and follow-up.

## Procedure

1. Read `docs/harness/lecture-cuts-reproduction-contract.md` to confirm the current source-of-truth chain.
2. Read `docs/harness/codex-session-decision-log.md` for stable verification requirements and observed quality failures.
3. Run the mandatory gate commands exactly from the repository root.
4. Treat any non-zero exit as FAIL.
5. Treat any output-level `FAIL` as blocking even when the command exits 0.
6. Treat `WARN` as non-blocking only when the warning has an explicit owner, reason, and follow-up path.
7. Record command, exit status, summarized output, and artifact path for handoff.
8. Do not repair deck-builder output silently from this skill; report the failing gate and owner.

## Quality Bar

- Syntax checks pass for shared runtime files.
- Reproduction contract confirms 87 registered slides, stable slide order, present files, speaker source coverage, and intentional content hashes.
- Audit confirms browser-rendered deck quality, source coverage status, presenter-review behavior, glossary behavior, and overflow status.
- Korean copy audit confirms no blocking grammar, spacing, or slide-script synchronization issue remains.
- Handoff evidence names the latest commands and the actual exit status.
- A handoff with only file-existence checks is incomplete.

## Verification

Mandatory gate:

```sh
node --check lecture-cuts/assets/slides.js
node --check lecture-cuts/assets/deck.js
node --check lecture-cuts/assets/presenter-review.js
node scripts/validate-lecture-cuts-contract.js
node scripts/audit-lecture-cuts.js
node scripts/audit-lecture-cuts-korean-copy.js
node scripts/audit-lecture-cuts-speaker-sync.js
```

Unified gate, when available:

```sh
node scripts/verify-lecture-cuts-harness.js
```

Handoff-only gate, when final handoff is being reviewed:

```sh
node scripts/verify-lecture-cuts-harness.js --handoff-only
```

PASS requires all mandatory commands to exit 0, no blocking `FAIL` entries, no unexplained `WARN`, and current command evidence in handoff.

## Stop Conditions

- Any mandatory command exits non-zero.
- `validate-lecture-cuts-contract.js` reports slide count drift, order drift, missing file, content hash drift, missing title, missing speaker source, or missing source-sensitive coverage.
- `audit-lecture-cuts.js` reports a blocking render, overflow, glossary, presenter-review, or source coverage failure.
- Handoff verification omits the latest command and exit status.
- A worker attempts to bypass a failed gate by weakening tests, deleting checks, or marking an unresolved failure as PASS.
