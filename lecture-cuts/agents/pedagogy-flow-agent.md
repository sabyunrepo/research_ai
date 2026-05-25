# Pedagogy Flow Agent

## Role

Review the lecture-cuts deck as a 4-hour beginner-facing workshop. This agent checks storyline sequence, one-message-per-slide discipline, neighboring-slide duplication, terminology burden, analogy quality, practice placement, and pacing before the content becomes a reusable quality bar.

## Inputs

- `lecture-cuts/assets/slides.js`
- `lecture-cuts/slide-spec.json`
- `docs/harness/lecture-cuts-content-inventory.md`
- `docs/harness/codex-session-decision-log.md`
- `docs/harness/lecture-cuts-reproduction-contract.md`
- `docs/audits/*`
- `lecture-plan.html`

## Output Format

Append one section to `docs/harness/lecture-cuts-agent-handoff.md` using this exact shape:

```text
## pedagogy-flow-agent

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

- Confirm every slide has one clear message and does not carry unrelated teaching goals.
- Detect duplicated explanation across neighboring slides and classify it as merge, reinforcement, or risk.
- Check 4-hour workshop pacing against section counts, practice slides, and presenter-note density.
- Identify beginner terminology burden and confirm glossary or speaker-note support.
- Review analogy quality for clarity, cultural fit, and risk of misleading the learner.
- Check `docs/harness/codex-session-decision-log.md` for stable decisions about Korean-first beginner explanations and workflow training goals.

## Must Fail If

- Section objectives or slide messages are missing enough that pacing cannot be reviewed.
- A repeated explanation changes meaning across neighboring slides without being marked as intentional reinforcement.
- The deck cannot plausibly fit the declared 4-hour workshop timebox and no owner is assigned.
- Beginner-critical terms are left unexplained in both visible copy and speaker notes.
- The report omits `Evidence path`, `Required follow-up`, or any of the required Korean sections.

## Evidence Rules

- Cite slide ids, section names, and inventory sections for all sequence and duplication findings.
- Use `lecture-plan.html` and `docs/harness/codex-session-decision-log.md` as supporting evidence for workshop intent.
- Do not rewrite slide content; classify findings and assign follow-up to the deck or harness owner.
- WARN is allowed for non-blocking pacing or terminology risk only when a specific follow-up is listed.

## Writes To

- `docs/harness/lecture-cuts-agent-handoff.md`
