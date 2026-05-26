# Slide 26-27 Redundancy Review

## slide-redundancy-review-agent

Status: PASS
Severity: P3
Blocks handoff: no
Required follow-up: none
Evidence path: `scripts/audit-lecture-cuts-slide-redundancy.js --slides 26,27`

### 발견

- Slide 26 `10-skills.html` now teaches the Skill promotion criteria: repetition, stable judgment criteria, failure cost, and attached examples/checklists/scripts.
- Slide 27 `10-1-skill-trigger-description.html` now teaches the Skill structure: `description`, body, `references/`, `scripts/`, and `assets/`.
- Visible copy overlap is low, and the teaching roles are now clearly separated.
- The previous perceived duplication was addressed by moving structure explanation out of Slide 26 and into Slide 27.

### 수행

- Checked `lecture-cuts/slide-spec.json` indexes 26 and 27.
- Checked source HTML files:
  - `lecture-cuts/10-skills.html`
  - `lecture-cuts/10-1-skill-trigger-description.html`
- Checked presenter scripts in `lecture-cuts/assets/slides.js`.
- Rewrote Slide 26 visible copy, `div.note`, presenter script, and cue metadata around Skill promotion criteria.
- Rewrote Slide 27 visible copy, `div.note`, presenter script, and cue metadata around separated folder responsibilities.
- Regenerated `lecture-cuts/slide-spec.json`.
- Ran `node scripts/audit-lecture-cuts-slide-redundancy.js --slides 26,27`.

### 판단

Keep the two slides separate. Slide 26 answers "which work should become a Skill?" while Slide 27 answers "how should that Skill be split across files and folders?"

Merging is no longer recommended for this pair unless the deck must be shortened aggressively.

### 미해결

- No unresolved issue for this pair.

### 근거

- Script output: `PASS slides 26-27`, left role `sequence/process`, right role `example`, visible overlap `0.034`, script overlap `0.097`.
- Slide 26 visible copy is now framed as four promotion questions.
- Slide 27 names each folder responsibility separately, including `references/`, `scripts/`, and `assets/`.
