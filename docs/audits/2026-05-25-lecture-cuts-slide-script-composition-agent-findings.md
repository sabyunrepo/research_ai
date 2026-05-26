# Lecture Cuts Slide-Script Composition Agent Findings

Generated: 2026-05-25
Reviewer: Meitner read-only subagent
Scope: 83-slide `lecture-cuts` deck, with focus around Slides 24-34 and the current browser vicinity around Slide 29.

## Status

- Status: WARN
- Highest severity: P1 candidate
- Blocks handoff: no, because this report is a planning artifact and visible deck content was not edited in this pass
- Required follow-up: fix accepted P1/P2 candidates before the next presentation-ready handoff
- Evidence path: `lecture-cuts/*.html`, `lecture-cuts/assets/slides.js`, `presenter-review.html`, `presenter-preview.html`

## Findings

### P1 Candidate / load + script / Slide 32 / `08-claude-md.html`

- Evidence: `lecture-cuts/08-claude-md.html`, `lecture-cuts/assets/slides.js` around the matching speaker entry.
- Finding: the screen shows a `CLAUDE.md`-style artifact, but the script also explains always-on memory, the cost of long files, the 20-task rule, and the Skill/Hook separation. The idea is correct, but the slide does not expose enough anchors for all those claims.
- Improvement: either add visible anchors for "always loaded", "20 tasks", "Skill", and "Hook", or cut the spoken explanation so the slide only teaches always-on project memory.

### P1 Candidate / flow / Slides 31-32 / `07-2-reasoning-avoid-overask.html` -> `08-claude-md.html`

- Evidence: `lecture-cuts/07-2-reasoning-avoid-overask.html`, `lecture-cuts/08-claude-md.html`, `lecture-cuts/assets/slides.js`.
- Finding: Slide 31 is still closing the prompt/reasoning layer, but the script already starts transitioning into memory. Slide 32 then introduces memory again. Around Slide 29, this is the main rhythm risk because the audience may feel the layer boundary twice.
- Improvement: let Slide 31 end as a prompt-layer conclusion. Move the memory-layer opening only to Slide 32.

### P2 / script + screen / Slide 14 / `03-1-layer-responsibility.html`

- Evidence: `lecture-cuts/03-1-layer-responsibility.html`, `lecture-cuts/assets/slides.js`.
- Finding: the screen presents an 8-layer responsibility matrix, but the script mostly speaks through the car-factory metaphor and only highlights Prompt, Context, Skill, and Hook. Agent, Tool, Evaluation, and Loop are visible but underused.
- Improvement: rewrite the script to walk the matrix in visible order, one short sentence per layer.

### P2 / script / Slide 26 / `05-2-persona-rubric.html`

- Evidence: `lecture-cuts/05-2-persona-rubric.html`, `lecture-cuts/assets/slides.js`.
- Finding: the code example is useful, but the script spends too much time on the weak-persona/ER-doctor metaphor and not enough time pointing to the visible rubric instruction.
- Improvement: keep the metaphor short, then explicitly point to the `Prioritize` line and explain why it turns a persona into a scoring rule.

### P2 / workflow / `presenter-preview.html`

- Evidence: `presenter-review.html`, `presenter-preview.html`, `lecture-cuts/assets/slides.js`.
- Finding: `presenter-review.html` appears to be the current `slides.js`-based rehearsal surface. `presenter-preview.html` still looks like older cut-planning/script material and can confuse someone looking for the actual presenter script.
- Improvement: label `presenter-preview.html` as legacy or cut-planning, or add a clear handoff note that official rehearsal uses `presenter-review.html`.

### P3 / flow / Slides 75-76 / `21-10-practice-few-shot-placement.html` -> `21-2-bug-request-flow.html`

- Evidence: both slides use a `source.md -> slide-spec.json -> few-shots.md -> deck`-style flow.
- Finding: the intent differs, but the consecutive visual pattern may feel repetitive.
- Improvement: keep both if the workshop needs the repetition, or vary one slide into a decision checklist so the second one does not feel like the same explanation again.

## Good Patterns To Preserve

- The major story arc, failure patterns -> harness map -> layer-by-layer workflow, is coherent.
- Slides 29-30 work well as a prompt-layer bridge because the visible examples and script discuss the same decision.
- Example-driven slides such as `02-2`, `02-3`, `07-1`, and `08-2` are easier to explain than abstract definition slides.
- Every slide has a speaker entry, so script alignment can be improved locally without rebuilding the whole deck.

## Recommended Fix Order

1. Fix the Slide 31-32 boundary so the prompt layer closes once and the memory layer opens once.
2. Rework Slide 32 so the screen exposes the anchors the script needs, or shorten the script.
3. Rewrite Slide 14 script to walk the 8-layer matrix in screen order.
4. Rewrite Slide 26 script to point to the visible rubric code.
5. Clarify the role of `presenter-preview.html` versus `presenter-review.html`.
