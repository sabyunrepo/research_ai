# Deck Harness

`deck-harness/` is the reusable topic-to-deck contract for building a new HTML/CSS lecture deck from raw material while keeping the same quality bar as `lecture-cuts/`.

## Existing Deck Separation

`deck-harness/` must improve the workflow logic without silently changing an existing deck output. Treat `lecture-cuts/` as a golden reference unless the user explicitly asks to edit the visible deck.

- Do not change `lecture-cuts/deck.html`, `lecture-cuts/presenter-review.html`, or presentation runtime JS during workflow-only work.
- Keep harness metadata, agents, skills, schemas, source maps, and validation scripts separate from rendered deck output.
- Use `lecture-cuts/slide-spec.json` as a reproduction contract for the current result, not as permission to rewrite the result.
- Future deck improvements such as glossary behavior, source precision, and overflow policy should be enforced in `deck-harness/` first, then applied to an output deck only after an explicit output-change request.

## Workflow Order

1. Fill `topic-intake.md`.
2. Write `research-dossier.md`.
3. Create `claim-source-map.json`.
4. Create `section-plan.json`.
5. Create `glossary.json`.
6. Record stage status in `job-manifest.json`.
7. Create `slide-spec.json`.
8. Draft speaker script and visual system.
9. Build the HTML/CSS deck.
10. Review presenter view.
11. Run verification gates.
12. Finish `HANDOFF.md` with commands, evidence, risks, and next prompt.

Slide HTML must not start until `research-dossier.md`, `claim-source-map.json`, `section-plan.json`, `glossary.json`, `job-manifest.json`, and `slide-spec.json` exist.

## File Roles

- `workflow.md`: stage order, required inputs, and blocking rules.
- `quality-rubric.md`: pass/fail bar for content, pedagogy, visual quality, and verification.
- `*.template.md`: starter documents for intake, research, visual system, evaluation, and handoff.
- `*.schema.json`: JSON contracts for evidence, sections, slides, glossary, and job manifest.
- `allowlists/overflow-allowlist.json`: temporary overflow exceptions. Empty by default; each active item must include slide id, selector, reason, owner, and expiry date. Expired or selector-missing allowlist entries are FAIL.

## Completion Conditions

- Every schema JSON file parses as valid JSON.
- The source map validates and every `evidenceClaimIds` item resolves to `claim-source-map.json`.
- The slide spec contains no source URLs, checked dates, source types, confidence values, or source summaries.
- Every glossary term used by a slide resolves to the glossary registry.
- Rendered deck and presenter review match `slide-spec.json`.
- Desktop/mobile browser checks pass with no text overlap; overflow is blocked unless covered by a valid unexpired allowlist entry.
- Final handoff includes commands, evidence paths, and remaining risks.
