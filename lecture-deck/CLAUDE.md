# CLAUDE.md

## Mission

Build HTML/CSS lecture decks from source material through a repeatable harness:

```text
source brief -> slide spec -> HTML/CSS deck -> presenter review -> verification -> handoff
```

## Rules

- Read `source.md`, `slide-spec.json`, and `few-shots.md` before editing slides.
- Treat `slide-spec.json` as the contract. Every slide must define `title`, `message`, `visual`, `speakerNote`, and `evidence`.
- Use `slides/*.html` for individual slides and keep shared behavior in `assets/`.
- Keep `.note` content out of `deck.html`; it is only for presenter review and source slide editing.
- Show `speakerNote` and evidence in `presenter-review.html`.
- Prefer CSS visuals for repeated diagrams, rails, cards, and flow maps.
- Verify desktop and mobile overflow before handoff.
- Update `HANDOFF.md` with decisions, verification result, remaining risks, and the next prompt.

## Output Order

1. Update source brief if the input material changed.
2. Update slide spec before touching slide HTML.
3. Update few-shot examples when output shape needs to be fixed.
4. Build or edit slide HTML/CSS/JS.
5. Run `node scripts/verify-deck.js`.
6. Report using `evaluation-template.md`.
7. Update `HANDOFF.md`.
