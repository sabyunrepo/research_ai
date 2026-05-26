# Lecture Cuts Presenter Cue Report

Generated: 2026-05-26

## Scope

- Added presenter cues for all 83 registered slides.
- Added a presenter-review UI surface that shows `발표 큐` above the detailed script.
- Kept actual audience deck output separate: `lecture-cuts/deck.html` does not render these cues.

## Cue Format

Each cue uses five fixed fields:

- 목적
- 키워드
- 말할 순서
- 예시/비유
- 다음 연결

## Initial Sample Selection

- Slide 1: opening definition and framing.
- Slide 14: layer-responsibility map, previously flagged for script/screen alignment.
- Slide 26: persona/rubric example, previously flagged for code-example alignment.
- Slide 31: prompt-layer closing and transition risk.
- Slide 32: memory-layer opening and `CLAUDE.md` load risk.

## NotebookLM Request

- Request prompt: `docs/audits/2026-05-26-lecture-cuts-cue-notebooklm-request.md`
- Result: NotebookLM CLI request attempted but failed before producing a usable answer.
- Error: `No parseable chunks in streaming chat response (6 lines scanned). The response was empty or the API wire format may have changed.`

## Current Judgment

- Use the current Codex-generated cues as the first local standard.
- Keep the NotebookLM request prompt as the comparison input for a later retry.
- All 83 slides now have cue content. Future work should be a review/refinement pass, not a coverage pass.

## Next Expansion Rule

When refining cues:

1. Keep each field short enough to read at a glance.
2. Prefer slide-visible keywords over new wording.
3. Put transition phrases in `다음 연결`, not inside every long paragraph.
4. Preserve the full detailed script below the cues as preparation material.
