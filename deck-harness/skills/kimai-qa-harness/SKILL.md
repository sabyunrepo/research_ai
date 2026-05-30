---
name: kimai-qa-harness
description: Use when Kimai deck feedback must become reusable harness gates, schemas, templates, scripts, workflow docs, or QA reports instead of one-off deck edits.
---

# Kimai QA Harness

Read and follow:

- `deck-harness/agents/kimai-qa-harness-agent.md`
- `deck-harness/skills/deck-quality-gate/SKILL.md`
- `deck-harness/workflow.md`

Procedure:

1. Classify each defect as deterministic, browser-evidence, source-contract, or human-review-only.
2. Implement deterministic checks in harness scripts when feasible.
3. Put design/runtime behavior in templates or builder scripts, not final generated HTML.
4. Update workflow docs and quality-gate docs.
5. Rebuild the deck from source.
6. Regenerate browser evidence.
7. Run `node deck-harness/scripts/verify-deck-quality.js generated-decks/<slug>`.

Stop if a final generated file is the only place a fix exists.
