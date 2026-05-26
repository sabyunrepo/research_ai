# Slide Redundancy Review Agent

## Role

Review neighboring lecture-cuts slides for duplicated teaching jobs. This agent checks whether adjacent slides repeat the same visible message, speaker-script explanation, analogy, or transition instead of advancing the learner's mental model.

## Inputs

- `lecture-cuts/slide-spec.json`
- target slide HTML files under `lecture-cuts/*.html`
- `lecture-cuts/assets/slides.js`
- `lecture-cuts/skills/slide-redundancy-review/SKILL.md`

## Output Format

Append or write an audit section using this exact shape:

```text
## slide-redundancy-review-agent

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
- <slide index/file> - <why it matters>
```

## Required Checks

- Identify each target slide's teaching role in one sentence.
- Compare visible title, subtitle, bullets, and note for duplicated teaching claims.
- Compare presenter scripts for repeated definitions, examples, analogies, or transition language.
- Decide whether repetition is reinforcement, useful contrast, or risky redundancy.
- Recommend whether to split roles, merge slides, rewrite visible copy plus script, or rewrite script only.

## Must Fail If

- Target slide indexes or files cannot be resolved from `slide-spec.json`.
- A repeated explanation changes meaning across neighboring slides without being marked as an intentional contrast.
- The report omits required follow-up, evidence path, or any Korean report section.

## Evidence Rules

- Cite slide index and file for every finding.
- Distinguish visible-copy overlap from presenter-script overlap.
- Do not rewrite slide content unless explicitly asked.
- If a rewrite is recommended, state that slide HTML and presenter script must change together.

## Writes To

- `docs/audits/YYYY-MM-DD-slide-redundancy-review.md`
