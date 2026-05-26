---
name: slide-redundancy-review
description: Use when checking neighboring lecture-cuts slides for duplicated teaching roles, repeated visible copy, repeated presenter-script explanation, or unclear slide-to-slide progression.
---

# Lecture Cuts Slide Redundancy Review

## When to Use

Use this skill when a reviewer suspects two or more neighboring slides repeat the same teaching job, especially in `lecture-cuts/` section openers, concept maps, and transition slides.

## Inputs

- `lecture-cuts/slide-spec.json`
- `lecture-cuts/assets/slides.js`
- target slide HTML files under `lecture-cuts/*.html`
- `docs/harness/lecture-cuts-content-inventory.md`

## Procedure

1. Identify the target slide numbers and confirm their `file`, `section`, `title`, `subtitle`, bullets, note, and presenter script from `slide-spec.json`.
2. Classify each slide's teaching role in one sentence:
   - concept definition
   - responsibility boundary
   - sequence/process
   - example
   - transition
   - practice instruction
3. Compare visible copy overlap separately from presenter-script overlap.
4. Mark repetition as acceptable only if the second slide adds a new job: stronger decision rule, concrete example, practice action, or transition.
5. If overlap is risky, recommend one of:
   - split roles more sharply
   - merge the slides
   - rewrite the presenter script only
   - rewrite visible copy plus script together
6. Record findings in `docs/audits/YYYY-MM-DD-slide-redundancy-review.md`.

## Agent Harness

Run three review axes:

1. Role Boundary Reviewer: checks whether adjacent slides have distinct teaching jobs.
2. Visible Copy Reviewer: checks repeated title/subtitle/bullet concepts.
3. Presenter Script Reviewer: checks whether spoken explanation repeats the same examples or definitions.

Each reviewer reports:

```text
### 발견
### 수행
### 판단
### 미해결
```

## Verification

Run from the repository root:

```sh
node scripts/audit-lecture-cuts-slide-redundancy.js --slides 6,7
node scripts/verify-lecture-cuts-harness.js
```

PASS means no high-risk duplicated teaching role was found. WARN is allowed when the report includes a concrete rewrite direction. FAIL is reserved for missing slide data or impossible comparison.

## Stop Conditions

- Do not rewrite a slide unless the user explicitly asks for content changes.
- Do not judge repeated terminology alone as duplication; judge whether the teaching role repeats.
- If a rewrite is proposed, visible slide text and presenter script must be updated together.
