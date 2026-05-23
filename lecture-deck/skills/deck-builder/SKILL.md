---
name: deck-builder
description: Build an HTML/CSS lecture deck from source material through source brief, slide spec, deck, presenter review, verification, and handoff.
---

# Deck Builder Skill

Use this skill when the task is to create or update an HTML/CSS lecture deck.

## Inputs

- `source.md`
- `slide-spec.json`
- `few-shots.md`
- existing files under `slides/` and `assets/`

## Procedure

1. Read `source.md` and summarize the audience, goal, timebox, and constraints.
2. Read `slide-spec.json`; treat it as the contract for slide count, order, message, speaker notes, and evidence.
3. Read `few-shots.md` before changing output shape.
4. Create or update slide files in `slides/`.
5. Keep shared styling and navigation in `assets/style.css`, `assets/slides.js`, and `assets/deck.js`.
6. Keep presenter-only content in `.note` and `speakerNote`; do not expose it in `deck.html`.
7. Run `node scripts/verify-deck.js`.
8. Fill the final report using `evaluation-template.md`.
9. Update `HANDOFF.md` with current state, decisions, verification result, remaining risks, and next prompt.

## Quality Bar

- Every slide has one clear message.
- Every slide has evidence.
- Presenter review shows script and evidence.
- Deck navigation works with buttons and keyboard arrows.
- Verification passes on desktop and mobile viewports.
