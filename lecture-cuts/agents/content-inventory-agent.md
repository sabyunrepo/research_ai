# Content Inventory Agent

## Role

Extract the current `lecture-cuts/` deck as the golden-reference content inventory. This agent checks whether the exported contract still reflects the visible deck structure, speaker-note placement, source metadata, glossary usage, and slide content hashes before later agents use the deck as a benchmark.

## Inputs

- `lecture-cuts/assets/slides.js`
- `lecture-cuts/*.html`
- `lecture-cuts/presenter-preview.html`
- `lecture-cuts/slide-spec.json`
- `docs/harness/lecture-cuts-content-inventory.md`
- `docs/harness/lecture-cuts-source-map.json`
- `docs/harness/codex-session-decision-log.md`
- `docs/harness/lecture-cuts-reproduction-contract.md`
- `scripts/export-lecture-cuts-contract.js`
- `scripts/validate-lecture-cuts-contract.js`

## Output Format

Append one section to `docs/harness/lecture-cuts-agent-handoff.md` using this exact shape:

```text
## content-inventory-agent

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

- Confirm slide order and section assignment match `lecture-cuts/assets/slides.js`, `lecture-cuts/slide-spec.json`, and `docs/harness/lecture-cuts-content-inventory.md`.
- Confirm speaker note location is explicit for every slide: inline note block or `presenter-preview.html` fallback.
- Confirm source metadata presence is counted and classified, including deck-global versus slide-level evidence.
- Confirm glossary term usage is visible in deck and presenter-review surfaces when applicable.
- Confirm current slide HTML hashes match the exported `contentHash` values.
- Check `docs/harness/codex-session-decision-log.md` for stable deck-quality decisions before final judgment.

## Must Fail If

- Slide count, order, section assignment, or registered slide file presence differs from the exported contract.
- Any slide has no extracted title or no speaker note source.
- Any current slide HTML hash differs from `lecture-cuts/slide-spec.json` without a regenerated contract.
- Any source-sensitive slide loses slide-level evidence that was present in the source map.
- Glossary usage is split across incompatible registries without an explicit downstream owner.
- The report omits `Evidence path`, `Required follow-up`, or any of the required Korean sections.

## Evidence Rules

- Prefer command evidence from `node scripts/validate-lecture-cuts-contract.js` and artifact evidence from `docs/harness/lecture-cuts-content-inventory.md`.
- Cite exact artifact paths and section names; line numbers are preferred when available.
- Treat `docs/harness/codex-session-decision-log.md` as supporting evidence for Korean-first, reproducible, source-backed deck requirements.
- WARN is allowed only when the inventory is usable and the report names a concrete follow-up owner.

## Writes To

- `docs/harness/lecture-cuts-agent-handoff.md`
