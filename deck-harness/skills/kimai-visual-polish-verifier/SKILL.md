---
name: kimai-visual-polish-verifier
description: Use when a Kimai generated lecture deck needs strict visual polish review for title font, footer weight, image clipping, sprite numbering, character consistency, layout variety, motion, anchors, or glossary coverage.
---

# Kimai Visual Polish Verifier

Read and follow:

- `deck-harness/agents/kimai-visual-polish-verifier-agent.md`
- `deck-harness/agents/critical-visual-harness-verifier-agent.md`

Use this skill after generating or rebuilding a Kimai lecture deck, before claiming visual quality PASS.

Mandatory evidence:

- `browser-render-report.json`
- `asset-crop-review.json`
- representative screenshots under `review-screenshots/`
- `slide-spec.json`
- `asset-pack.json`
- `asset-review.json`
- generated `slides/*.html`
- `assets/style.css`

Do not repair files during verifier work. Return only the report unless explicitly asked to implement fixes.

Before visual PASS, run:

```sh
node deck-harness/scripts/verify-asset-crops.js <deck-dir>
```

Treat missing or stale crop review evidence as FAIL, even if the slide screenshots look acceptable at a glance.
