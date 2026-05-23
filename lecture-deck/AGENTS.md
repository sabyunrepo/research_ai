# Codex instructions for `lecture-deck/`

This directory is an HTML/CSS Deck Automation Harness.

## Required workflow

When creating or updating this deck, follow this order:

1. Read `source.md`, `slide-spec.json`, and `few-shots.md`.
2. Treat `slide-spec.json` as the contract for slide order, title, message, visual, speaker note, and evidence.
3. Keep presenter-only content in `.note` and `speakerNote`.
4. Do not expose `.note` in `deck.html`.
5. Keep shared behavior in `assets/` and slide content in `slides/`.
6. Before handoff or final completion, run:

```sh
node scripts/run-hook.js pre-handoff
```

## Reporting

Use `evaluation-template.md` for final reports. Include changed files, command output summary, remaining risks, and the local URL if a server was used.
