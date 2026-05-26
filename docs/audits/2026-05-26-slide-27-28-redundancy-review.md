# Slide 27-28 Redundancy Review

## slide-redundancy-review-agent

Status: PASS
Severity: P3
Blocks handoff: no
Required follow-up: none
Evidence path: `scripts/audit-lecture-cuts-slide-redundancy.js --slides 27,28`

### 발견

- Slide 27 `10-1-skill-trigger-description.html` teaches the responsibility of each Skill component: `description`, body, `references/`, `scripts/`, and `assets/`.
- Slide 28 `11-1-real-skill-folder.html` now teaches how to read a real Skill folder from top to bottom as an execution sequence.
- The previous overlap came from Slide 28 repeating the same component definitions already covered by Slide 27.
- The rewritten Slide 28 uses `deck-builder/` as a concrete folder-reading example rather than another definition list.

### 수행

- Checked `lecture-cuts/slide-spec.json` indexes 27 and 28.
- Checked source HTML files:
  - `lecture-cuts/10-1-skill-trigger-description.html`
  - `lecture-cuts/11-1-real-skill-folder.html`
- Checked presenter scripts in `lecture-cuts/assets/slides.js`.
- Rewrote Slide 28 visible copy, `div.note`, presenter script, file-tree visual text, and cue metadata.
- Regenerated `lecture-cuts/slide-spec.json`.
- Ran `node scripts/audit-lecture-cuts-slide-redundancy.js --slides 27,28`.

### 판단

Keep both slides. Slide 27 answers "what responsibility does each Skill component have?" while Slide 28 answers "how does an agent read a concrete Skill folder during work?"

The pair now functions as concept-to-example rather than repeated definition.

### 미해결

- No unresolved issue for this pair.

### 근거

- Script output: `PASS slides 27-28`, visible overlap `0.103`, script overlap `0.208`.
- Slide 27 names component responsibilities.
- Slide 28 frames the same folder names as an execution sequence: open `SKILL.md`, consult `references/`, run `scripts/`, use `assets/`.
