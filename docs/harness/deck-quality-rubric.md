# Deck Quality Rubric

This mirror captures the core `deck-harness/quality-rubric.md` quality bar for docs and reviewer use. `lecture-cuts/` is the golden reference for structure, evidence habits, presenter separation, glossary behavior, browser fit, and handoff completeness.

## Content

- One clear message per slide.
- Every factual or product/API claim has a source.
- Date-sensitive claims show the checked date.
- Korean-first copy unless the source phrase is important.
- Beginner-facing terminology is explained through glossary or speaker note.

## Pedagogy

- Sections have learning objectives.
- Each practice follows explanation.
- Duplicated explanation is merged or intentionally marked as reinforcement.
- The deck fits the declared timebox.

## Visual

- 1280x720 projector fit passes.
- No text overlap.
- Repeated abstract visuals are balanced with concrete artifacts.
- Presenter view separates screen text and speaker script.

## Verification

- source map validates.
- slide spec validates.
- slide spec references claim ids only; source URL, checked date, source type, confidence, and use location live only in claim-source-map.json.
- all evidenceClaimIds resolve to claim-source-map.json.
- all glossaryTerms resolve to glossary registry.
- rendered deck and presenter review match slide-spec.json text, speaker notes, and evidence ids.
- local links/assets validate.
- browser render validates.
- final handoff includes commands, evidence, and remaining risks.

## Failure Policy

- Missing source coverage for a factual or product/API claim is FAIL.
- Missing checked date on date-sensitive claims is FAIL.
- Missing glossary coverage for beginner-facing English or developer terms is FAIL.
- Native browser tooltip leakage or partial glossary matching is FAIL.
- Text overflow is FAIL unless a valid unexpired allowlist entry covers the exact slide id and selector.
- Overflow allowlist items must contain slide id, selector, reason, owner, and expiry date. Expired or selector-missing allowlist entries are FAIL.
- Placeholder, mock, or incomplete handoff content is FAIL.
