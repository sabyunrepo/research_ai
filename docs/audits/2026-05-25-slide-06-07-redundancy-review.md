# Slide 06-07 Redundancy Review

## slide-redundancy-review-agent

Status: PASS
Severity: P3
Blocks handoff: no
Required follow-up: none
Evidence path: `scripts/audit-lecture-cuts-slide-redundancy.js --slides 6,7`

### 발견

- Slide 06 `03-1-layer-responsibility.html` teaches the responsibility boundary: prompt = instruction, context = memory, skill = procedure, Hook/Evaluation = enforcement/evidence.
- Slide 07 `03-2-harness-flow.html` now teaches the promotion decision criteria: frequency and failure risk.
- The intended teaching roles are different, and the visible copy now uses a 2x2 decision matrix rather than repeating the layer list.
- Presenter scripts are differentiated: Slide 06 explains role separation, while Slide 07 explains escalation by repetition and risk.

### 수행

- Checked `lecture-cuts/slide-spec.json` indexes 6 and 7.
- Checked source HTML files:
  - `lecture-cuts/03-1-layer-responsibility.html`
  - `lecture-cuts/03-2-harness-flow.html`
- Rewrote Slide 07 visible copy, visual matrix, `div.note`, and presenter script together.
- Regenerated `lecture-cuts/slide-spec.json`.
- Ran `node scripts/audit-lecture-cuts-slide-redundancy.js --slides 6,7`.
- Collected an independent subagent review for the exact same indexes.

### 판단

The pair should remain two slides, not be merged. Slide 06 answers "what responsibility does each layer own?" while Slide 07 now answers "which structure should this instruction be promoted to based on frequency and risk?"

The previous visible-copy overlap is resolved enough for the current deck. The redundancy audit reports distinct roles and lower overlap after the rewrite.

### 미해결

- No unresolved issue for this pair.
- Existing deck-wide source coverage and overflow warnings remain tracked by the unified harness.

### 근거

- Slide 06 `03-1-layer-responsibility.html` - title says each layer has a different responsibility, and bullets focus on responsibility mixing and execution-point verification.
- Slide 07 `03-2-harness-flow.html` - title says promotion criteria are frequency and risk, and bullets focus on prompt vs file/Skill vs Hook/Evaluation placement.
- Subagent corrected review - visible copy is the main source of perceived duplication; presenter script is more differentiated.
- Script output - role classifier reads Slide 06 as `responsibility boundary` and Slide 07 as `sequence/process`, with visible overlap at 0.097 after rewrite.
