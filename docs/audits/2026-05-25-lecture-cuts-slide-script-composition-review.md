# Lecture Cuts Slide-Script Composition Review

Generated: 2026-06-01T10:28:17.643Z

## Summary

- Slides checked: 58
- P1 findings: 0
- P2 findings: 0
- P3 findings: 4
- Focus range checked: Slides 24-34, including current browser vicinity around Slide 29
- Audit role: report generator for slide job clarity, script fit, explainability, flow bridge, and cognitive load

## Verdict

PASS: no blocking composition issue detected by heuristics.

## Top Findings

- **P3 / screen / Slide 11 / `03-1-layer-responsibility.html`**
  - 제목: 반복 실패는 맞는 레이어로 올립니다
  - 발견: 불릿이 5개 이상이라 한 장의 교육 역할이 넓어질 수 있습니다.
  - 근거: 5 bullets
  - 제안: 핵심 불릿 3-4개만 남기거나 보조 항목은 대본으로 이동합니다.
  - 수정면: slide HTML + presenter script

- **P3 / flow / Slide 26 / `10-skills.html`**
  - 제목: 스킬로 만들 일은 반복성과 기준이 있습니다
  - 발견: 섹션 시작 슬라이드의 첫 문단에 전환 신호가 약합니다.
  - 근거: previous 09-3-context-drift-check.html -> current 10-skills.html
  - 제안: 첫 문단에 이전 섹션의 결론과 이번 섹션의 질문을 한 문장으로 연결합니다.
  - 수정면: presenter script

- **P3 / screen / Slide 27 / `10-1-skill-trigger-description.html`**
  - 제목: 스킬은 호출 조건, 절차, 자료를 분리합니다
  - 발견: 불릿이 5개 이상이라 한 장의 교육 역할이 넓어질 수 있습니다.
  - 근거: 5 bullets
  - 제안: 핵심 불릿 3-4개만 남기거나 보조 항목은 대본으로 이동합니다.
  - 수정면: slide HTML + presenter script

- **P3 / flow / Slide 32 / `14-subagents.html`**
  - 제목: 서브에이전트는 역할과 컨텍스트를 분리합니다
  - 발견: 섹션 시작 슬라이드의 첫 문단에 전환 신호가 약합니다.
  - 근거: previous 12-2-superpowers-workflow-map.html -> current 14-subagents.html
  - 제안: 첫 문단에 이전 섹션의 결론과 이번 섹션의 질문을 한 문장으로 연결합니다.
  - 수정면: presenter script

## Slide 24-34 Focus Findings

- **P3 / flow / Slide 26 / `10-skills.html`**
  - 제목: 스킬로 만들 일은 반복성과 기준이 있습니다
  - 발견: 섹션 시작 슬라이드의 첫 문단에 전환 신호가 약합니다.
  - 근거: previous 09-3-context-drift-check.html -> current 10-skills.html
  - 제안: 첫 문단에 이전 섹션의 결론과 이번 섹션의 질문을 한 문장으로 연결합니다.
  - 수정면: presenter script

- **P3 / screen / Slide 27 / `10-1-skill-trigger-description.html`**
  - 제목: 스킬은 호출 조건, 절차, 자료를 분리합니다
  - 발견: 불릿이 5개 이상이라 한 장의 교육 역할이 넓어질 수 있습니다.
  - 근거: 5 bullets
  - 제안: 핵심 불릿 3-4개만 남기거나 보조 항목은 대본으로 이동합니다.
  - 수정면: slide HTML + presenter script

- **P3 / flow / Slide 32 / `14-subagents.html`**
  - 제목: 서브에이전트는 역할과 컨텍스트를 분리합니다
  - 발견: 섹션 시작 슬라이드의 첫 문단에 전환 신호가 약합니다.
  - 근거: previous 12-2-superpowers-workflow-map.html -> current 14-subagents.html
  - 제안: 첫 문단에 이전 섹션의 결론과 이번 섹션의 질문을 한 문장으로 연결합니다.
  - 수정면: presenter script

## Manual/Subagent Findings

Source: `docs/audits/2026-05-25-lecture-cuts-slide-script-composition-agent-findings.md`

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

## Good Patterns To Preserve

- Slides with visible comparison structures work well when the script speaks through the left/right or before/after order.
- Checkpoint slides are useful because they turn concept explanation into participant output.
- File/path/code slides are strongest when literal artifacts remain visible and the script explains why each artifact exists.
- The current first-use terminology policy helps learners map Korean explanations back to official English documentation.

## Recommended Next Work

1. Review P2 load/script findings first; these are the places most likely to feel hard to present live.
2. For any accepted finding, update slide HTML, hidden note, and `lecture-cuts/assets/slides.js` together.
3. Regenerate the contract with `node scripts/export-lecture-cuts-contract.js`.
4. Re-run `node scripts/verify-lecture-cuts-harness.js`.
5. Append accepted fixes and deferred items to `lecture-cuts/HANDOFF.md`.
