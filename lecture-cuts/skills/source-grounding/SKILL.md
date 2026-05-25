---
name: source-grounding
description: Use when mapping lecture-cuts slide claims to official, local, or justified source evidence.
---

# Lecture Cuts Source Grounding

## When to Use

Use this skill when a task adds, changes, verifies, or reviews factual claims, official tool/API behavior, source links, checked dates, slide-visible evidence, speaker-note-only evidence, or source appendix coverage for `lecture-cuts/`.

## Inputs

- `lecture-cuts/slide-spec.json`
- `docs/harness/lecture-cuts-source-map.json`
- `docs/harness/lecture-cuts-content-inventory.md`
- `docs/harness/codex-session-decision-log.md`
- `docs/harness/lecture-cuts-reproduction-contract.md`
- `lecture-cuts/sources.html`
- Changed slide HTML under `lecture-cuts/*.html`
- Official docs or local source files used as evidence

## Outputs

- Updated `docs/harness/lecture-cuts-source-map.json`
- Updated evidence metadata in `lecture-cuts/slide-spec.json` when slide-visible claims change
- Updated source appendix references in `lecture-cuts/sources.html`, when needed
- A weak-source or unresolved-source note for handoff if any source remains below the quality bar
- Verification evidence from `node scripts/validate-lecture-cuts-contract.js`

## Procedure

1. Read the changed slide item in `lecture-cuts/slide-spec.json` and its entry in `docs/harness/lecture-cuts-source-map.json`.
2. Check `docs/harness/codex-session-decision-log.md` for reusable workflow rules, superseded source decisions, and quality failures.
3. Prefer official docs for technical claims.
4. Record exact source URL or local source file.
5. Mark date-sensitive claims.
6. Decide whether evidence belongs on slide, speaker note, or sources appendix.
7. Write updates to `docs/harness/lecture-cuts-source-map.json`.
8. Update `lecture-cuts/slide-spec.json` evidence metadata when slide-visible claims change.
9. Keep source URL, checked date, source type, confidence, and use location in the source map rather than scattering them across slide HTML.
10. Rerun `node scripts/validate-lecture-cuts-contract.js` after source metadata changes.

## Quality Bar

- Official docs are preferred for Claude Code hooks, subagents, skills, MCP, OpenAI API/evaluation, or other technical/product/API claims.
- Local-source claims cite the exact repository file path or generated contract file.
- Inference claims explicitly explain the reasoning basis and do not appear as unsupported facts.
- Slide-visible factual claims have evidence that can be found by slide id.
- Speaker-note-only evidence is marked as such and does not inflate projector-visible copy.
- Date-sensitive current tool/API behavior has a checked date.
- Weak or missing sources are marked before slide writing or handoff.

## Verification

Run:

```sh
node scripts/validate-lecture-cuts-contract.js
rg -n "\"sourceScope\"|\"checkedDate\"|\"confidence\"|\"sourceFile\"|\"url\"" docs/harness/lecture-cuts-source-map.json lecture-cuts/slide-spec.json
```

For technical claims, inspect that official sources are present or explicitly justified:

```sh
rg -n "Claude Code|MCP|OpenAI|official|inference|checkedDate" docs/harness/lecture-cuts-source-map.json lecture-cuts/sources.html
```

PASS means the contract validator exits with status 0, every changed slide-visible factual claim resolves to source evidence, and no current tool/API claim is missing a checked date.

## Stop Conditions

- A technical claim has no official or explicitly justified source.
- Checked date is missing for current tool/API behavior.
- A slide-visible factual claim cannot be mapped to source evidence.
- The claim belongs in speaker notes or appendix but the requested slide copy would present it as an unsupported visible fact.
- `node scripts/validate-lecture-cuts-contract.js` fails after source metadata changes.
