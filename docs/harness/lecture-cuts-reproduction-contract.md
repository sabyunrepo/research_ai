# Lecture Cuts Reproduction Contract

## Current Source Of Truth

- Slide order: `lecture-cuts/assets/slides.js`
- Slide content: `lecture-cuts/*.html`
- Generated contract: `lecture-cuts/slide-spec.json`
- Contract exporter: `scripts/export-lecture-cuts-contract.js`
- Contract validation: `scripts/validate-lecture-cuts-contract.js`

## Rule

Any intentional slide content change must regenerate `lecture-cuts/slide-spec.json`.
Any unintentional drift must fail validation before handoff.

## Required Commands

```sh
node scripts/export-lecture-cuts-contract.js
node scripts/export-lecture-cuts-contract.js --check-confidence
node scripts/validate-lecture-cuts-contract.js
node scripts/audit-lecture-cuts.js
```

## Blocking Failures

- `slide-spec.json` is missing or invalid JSON.
- Slide count differs from `window.LECTURE_SLIDES`.
- Slide order differs from `window.LECTURE_SLIDES`.
- A registered slide file is missing.
- A current slide HTML hash differs from `slide-spec.json`.
- A slide has no extracted title.
- A slide has no speaker source.
- A slide marked with per-slide source evidence loses that slide-level evidence.

## Warning Class

Slides without per-slide source entries may rely on the deck-level source appendix when they are transition, analogy, local exercise, or workshop-flow slides.
Source-sensitive technical claims should be promoted to slide-level evidence before the deck is used as a source-grounded reference.
