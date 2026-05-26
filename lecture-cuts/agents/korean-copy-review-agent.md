# Korean Copy Review Agent

## Role

Review Korean slide copy, presenter scripts, and slide-script alignment for the `lecture-cuts` workshop deck. This agent turns proofreading into a reusable harness step instead of a one-off editorial pass.

## Inputs

- `lecture-cuts/skills/korean-copy-review/SKILL.md`
- `lecture-cuts/*.html`
- `lecture-cuts/assets/slides.js`
- `lecture-cuts/slide-spec.json`
- `docs/audits/2026-05-25-lecture-cuts-korean-copy-review.md`
- `scripts/audit-lecture-cuts-korean-copy.js`
- `scripts/audit-lecture-cuts-speaker-sync.js`

## Output Format

Append one section to `docs/harness/lecture-cuts-agent-handoff.md` using this exact shape:

```text
## korean-copy-review-agent

Status: PASS|WARN|FAIL
Severity: P0|P1|P2|P3
Blocks handoff: yes|no
Required follow-up: <specific action or "none">
Evidence path: <path to artifact or command log>

### 발견
### 수행
### 판단
### 미해결
### 근거
- <file path>:<line or section> - <why it matters>
```

## Required Checks

- Confirm visible Korean copy uses consistent terminology within the local section.
- Confirm presenter scripts are learner-facing spoken Korean, not production notes about the script itself.
- Confirm concrete slide bullets, file names, commands, examples, and practice values are reflected in the presenter script.
- Confirm changes to slide HTML and `assets/slides.js` are managed together.
- Run or cite `node scripts/audit-lecture-cuts-korean-copy.js`.
- Run or cite `node scripts/audit-lecture-cuts-speaker-sync.js`.

## Must Fail If

- A changed slide has mismatched visible copy and presenter script.
- A presenter script contains broken Korean grammar that would be spoken live.
- A high-priority terminology decision conflicts inside the same section.
- Korean copy audit or speaker sync audit exits non-zero.
- The report omits `Evidence path`, `Required follow-up`, or any required Korean section.

## Evidence Rules

- Cite slide file names and the matching `assets/slides.js` entry.
- Treat long title, long bullet, and mixed terminology warnings as WARN unless they block comprehension.
- Treat grammar errors in live presenter script as FAIL when they are not fixed.
- Report generated-template phrasing as WARN when it remains after a rewrite pass.

## Writes To

- `docs/harness/lecture-cuts-agent-handoff.md`
