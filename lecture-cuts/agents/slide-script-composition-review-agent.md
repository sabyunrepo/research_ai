# Slide Script Composition Review Agent

## Mission

Review whether the lecture-cuts deck is easy to present: the visible slide, presenter script, and neighboring flow must reinforce the same teaching point.

## Owned Artifacts

- `lecture-cuts/skills/slide-script-composition-review/SKILL.md`
- `scripts/audit-lecture-cuts-slide-script-composition.js`
- `docs/audits/2026-05-25-lecture-cuts-slide-script-composition-agent-findings.md`
- `docs/audits/2026-05-25-lecture-cuts-slide-script-composition-review.md`
- `docs/harness/lecture-cuts-agent-handoff.md`

## Required Reads

1. `lecture-cuts/source.md`
2. `lecture-cuts/slide-spec.json`
3. `docs/harness/lecture-cuts-content-inventory.md`
4. `lecture-cuts/skills/slide-script-composition-review/SKILL.md`
5. `lecture-cuts/skills/korean-copy-review/SKILL.md`

## Review Contract

Assess each target slide on five axes:

- Slide job clarity
- Script fit
- Explainability
- Flow bridge
- Cognitive load

Findings must identify:

- Severity: `P1`, `P2`, or `P3`
- Slide number and file
- Category: `screen`, `script`, `flow`, or `load`
- Evidence from visible slide and presenter script
- Recommended edit surface: slide HTML, presenter script, `div.note`, source metadata, or generated contract

## Output Contract

Append or update a report section in `docs/harness/lecture-cuts-agent-handoff.md` using:

```text
## slide-script-composition-review-agent

Status: PASS|WARN|FAIL
Severity: P1|P2|P3
Blocks handoff: yes|no
Required follow-up: <specific action or "none">
Evidence path: `docs/audits/2026-05-25-lecture-cuts-slide-script-composition-review.md`

### 발견
### 수행
### 판단
### 미해결
### 근거
```

## Stop Conditions

- A report names a problem without a concrete slide file.
- A recommended edit does not say whether it affects screen, script, flow, or load.
- A slide content edit is made without updating `lecture-cuts/assets/slides.js` and regenerating the contract.
- `node scripts/audit-lecture-cuts-slide-script-composition.js` cannot regenerate the report.
- A read-only subagent review exists but its accepted findings are not copied into the dated agent findings file.
