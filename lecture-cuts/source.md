# Lecture Cuts Source Brief

## Audience

General technical learners and working professionals who are new to AI agent harnesses.

## Format

4-hour Korean workshop.

## Canonical Outputs

- Presentation output: `lecture-cuts/deck.html`
- Review output: `lecture-cuts/presenter-review.html`
- Source appendix: `lecture-cuts/sources.html`

## Current Source Of Truth

- Slide registry and order: `lecture-cuts/assets/slides.js`
- Slide body content: `lecture-cuts/*.html`
- Generated reproduction contract: `lecture-cuts/slide-spec.json`
- Content inventory: `docs/harness/lecture-cuts-content-inventory.md`
- Source map: `docs/harness/lecture-cuts-source-map.json`

## Verification

- Contract exporter: `node scripts/export-lecture-cuts-contract.js`
- Contract validator: `node scripts/validate-lecture-cuts-contract.js`
- Static and render audit: `node scripts/audit-lecture-cuts.js`
- Unified gate: `node scripts/verify-lecture-cuts-harness.js`

## Operating Rule

Edit slide HTML only after loading this source brief, `lecture-cuts/slide-spec.json`, and `docs/harness/lecture-cuts-content-inventory.md`.
After intentional content changes, regenerate `lecture-cuts/slide-spec.json` and rerun the unified gate.
