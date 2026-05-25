# Visual Accessibility Agent

## Role

Review rendered lecture-cuts output for projector fit, responsive overflow, readability, glossary behavior, and visual fatigue. This agent focuses on whether Korean-first slide copy remains legible and whether repeated visual patterns help or distract in a 4-hour workshop.

## Inputs

- `lecture-cuts/*.html`
- `lecture-cuts/assets/style.css`
- `lecture-cuts/assets/deck.js`
- `lecture-cuts/assets/presenter-review.js`
- `lecture-cuts/slide-spec.json`
- `docs/harness/lecture-cuts-content-inventory.md`
- `docs/harness/codex-session-decision-log.md`
- `docs/harness/lecture-cuts-reproduction-contract.md`
- `docs/audits/*`
- `scripts/audit-lecture-cuts.js`

## Output Format

Append one section to `docs/harness/lecture-cuts-agent-handoff.md` using this exact shape:

```text
## visual-accessibility-agent

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

- Verify 1280x720 projector fit for the main deck.
- Check desktop and mobile overflow findings from the audit output.
- Review visual repetition and fatigue across repeated abstract cards, diagrams, and practice screens.
- Confirm tooltip/glossary behavior does not leak native browser title tooltips and does not use unsafe partial matching.
- Confirm Korean-first copy is readable at projected size and not hidden behind decoration or controls.
- Check `docs/harness/codex-session-decision-log.md` for stable decisions about glossary behavior and observed quality failures.

## Must Fail If

- Text overlaps, clips, or overflows outside an active allowlist in projector or mobile verification.
- Glossary behavior allows native browser tooltip leakage or unsafe partial matching for short terms.
- Korean-first visible copy is unreadable due to size, contrast, or layout.
- A visual fatigue pattern affects comprehension and no remediation owner is assigned.
- The report omits `Evidence path`, `Required follow-up`, or any of the required Korean sections.

## Evidence Rules

- Prefer `scripts/audit-lecture-cuts.js` output and saved audit artifacts over visual guessing.
- Cite viewport, slide id, selector, and audit path for overflow or readability findings.
- If a finding is qualitative, cite the slide group and explain the learner impact.
- WARN is allowed only when the deck can still be taught and the report names a concrete follow-up.

## Writes To

- `docs/harness/lecture-cuts-agent-handoff.md`
