---
name: slide-script-composition-review
description: Use when reviewing whether lecture-cuts slide composition, visible copy, diagrams, and presenter scripts work together as a teachable presentation flow.
---

# Slide Script Composition Review

## When to Use

Use this skill when a task asks whether slides are easy to explain, whether presenter scripts match visible slide content, or whether the deck flow needs pedagogical review.

## Inputs

- `lecture-cuts/assets/slides.js`
- `lecture-cuts/*.html`
- `lecture-cuts/slide-spec.json`
- `docs/harness/lecture-cuts-content-inventory.md`
- `scripts/audit-lecture-cuts-slide-script-composition.js`
- Optional subagent findings at `docs/audits/YYYY-MM-DD-lecture-cuts-slide-script-composition-agent-findings.md`

## Review Axes

1. Slide job clarity: each slide should have one clear teaching job.
2. Script fit: the speaker script should explain the visible title, bullets, code, diagram, or checkpoint on the slide.
3. Explainability: the visible structure should be easy to talk through in sequence.
4. Flow bridge: the script should connect the previous slide, current point, and next slide.
5. Cognitive load: dense code/diagrams should not be paired with a long unrelated script, and thin slides should not carry too much explanation alone.

## Procedure

1. Read the target slide HTML and matching `speaker.html` entry in `lecture-cuts/assets/slides.js`.
2. Classify each finding as one of:
   - `screen`: visible title, subtitle, bullets, code, diagram, note, or layout.
   - `script`: presenter script, spoken sequence, examples, or transition wording.
   - `flow`: slide order, section transition, repeated concept, or missing bridge.
   - `load`: too much or too little visible support for the script.
3. Use P1 only when a slide is likely to confuse the presenter or audience in the current deck.
4. Use P2 for concrete improvements that would make the lecture easier to deliver.
5. Use P3 for polish or optional phrasing improvements.
6. Preserve official file names, commands, paths, and code identifiers exactly.
7. If you recommend a content change, state whether it should touch slide HTML, `div.note`, presenter script, source metadata, or generated contract.
8. If a subagent performed a read-only review, save its accepted findings as a dated agent findings markdown file under `docs/audits/` so the composition audit can include it in the generated report.

## Report Format

```text
## slide-script-composition-review-agent

Status: PASS|WARN|FAIL
Severity: P1|P2|P3
Blocks handoff: yes|no
Required follow-up: <specific action or "none">
Evidence path: <path>

### 발견
### 수행
### 판단
### 미해결
### 근거
```

## Verification

Run from repository root:

```sh
node scripts/audit-lecture-cuts-slide-script-composition.js
node scripts/audit-lecture-cuts-speaker-sync.js
node scripts/verify-lecture-cuts-harness.js
```

The composition audit is a report generator. It exits non-zero only for broken input, missing output, or `--fail-on-p1` findings.
