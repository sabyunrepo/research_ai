# Codex instructions for `lecture-deck/`

This directory is an HTML/CSS Deck Automation Harness.

## Instruction Ownership

전역/사용자 레벨 AGENTS.md는 비워 두고, 이 프로젝트의 지침은 이 파일에서 관리한다.
Shared agent rules may be added here only after they are adapted to this deck harness's source/spec/handoff workflow.

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
