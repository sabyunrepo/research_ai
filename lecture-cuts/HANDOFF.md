# Lecture Cuts Handoff

## Current State

- `lecture-cuts/` is the current 56-slide golden reference deck for the 4-hour Korean workshop.
- `lecture-cuts/slide-spec.json` captures slide order, text, speaker source, source references, and content hashes.
- Slide copy and presenter scripts are now treated as one coupled teaching surface: slide HTML changes must update presenter script, and script changes that alter claims/examples/flow must update slide HTML and `div.note`.
- All 56 registered slides now have inline presenter scripts; no presenter-preview fallback or generic template presenter script remains.
- `scripts/validate-lecture-cuts-contract.js` now fails if current HTML drifts from `slide-spec.json`.
- `scripts/audit-lecture-cuts.js` now includes reproduction contract validation, and `scripts/audit-lecture-cuts-speaker-sync.js` checks presenter-script specificity.
- `scripts/audit-lecture-cuts-korean-copy.js` now checks Korean copy length, spacing candidates, repeated sentence starts, and Korean-first official terminology policy.
- `lecture-cuts/skills/korean-copy-review/SKILL.md` and `lecture-cuts/agents/korean-copy-review-agent.md` define the reusable Korean copy review workflow.
- `lecture-cuts/skills/slide-redundancy-review/SKILL.md`, `lecture-cuts/agents/slide-redundancy-review-agent.md`, and `scripts/audit-lecture-cuts-slide-redundancy.js` define the neighboring-slide duplication review workflow.
- `lecture-cuts/skills/slide-script-composition-review/SKILL.md`, `lecture-cuts/agents/slide-script-composition-review-agent.md`, and `scripts/audit-lecture-cuts-slide-script-composition.js` define the slide composition and presenter-script fit review workflow.
- `scripts/serve-lecture-cuts-review.js` serves `presenter-review.html` with a local save API so presenter script edits can update `assets/slides.js`, slide copy edits can update each slide HTML file, and the reproduction contract is regenerated.
- `presenter-review.html` now shows editable `발표 큐` fields above the detailed script. All 56 registered slides have cue content; actual audience deck output does not render cues.
- CLAUDE.md-related wording now consistently distinguishes `프롬프트=이번 요청`, `CLAUDE.md=항상 적용되는 프로젝트 지침`, and `HANDOFF.md=다음 세션 인수인계 상태 파일`.
- `scripts/run-lecture-cuts-hook.js` and `scripts/verify-lecture-cuts-harness.js` define the pre-handoff gate.
- `lecture-cuts/deck.html` now supports direct `file://` opening by loading generated `lecture-cuts/assets/slide-html.js` when browser `fetch()` cannot read local slide files.
- `lecture-cuts/presenter-review.html` now also supports direct `file://` opening by loading the same generated slide HTML cache; `assets/presenter-review.js` skips the legacy preview fetch when all slides have inline scripts.
- `file://` presenter review is intentionally read-only. Real save writes require the local server URL `http://127.0.0.1:8766/presenter-review.html`, backed by `scripts/serve-lecture-cuts-review.js`.
- `scripts/validate-lecture-cuts-contract.js` now checks `lecture-cuts/assets/slide-html.js` order and fragment drift, and `scripts/audit-lecture-cuts.js` now includes a direct `file://` runtime smoke.
- Visible deck output files are treated as generated/current-result artifacts and must remain stable unless the task explicitly asks for output changes.
- Story flow is now ordered as: opening/problem → failure patterns → whole workbench map → Spec/Prompt → Context/Memory → Skills/Superpowers → Agents/Tools → Hooks/Verification → Final Workflow. The failure-pattern section is compressed to 6 slides; the failure-to-harness mapping slide now appears inside the whole-map section after the layer responsibility slide and before the frequency/risk escalation slide.
- `docs/harness/lecture-cuts-story-flow-map.md` records the current narrative contract and the applied compression pass.

## Output Isolation

- The current visible deck is not mixed with workflow-only improvements.
- The following output/runtime files must stay stable during harness-only work:
  - `lecture-cuts/deck.html`
  - `lecture-cuts/presenter-review.html`
  - `lecture-cuts/assets/deck.js`
  - `lecture-cuts/assets/presenter-review.js`
- Harness-only changes may add or update metadata and validation files such as `lecture-cuts/slide-spec.json`, `lecture-cuts/HANDOFF.md`, `lecture-cuts/agents/`, `lecture-cuts/skills/`, `lecture-cuts/hooks/`, `docs/harness/`, and `deck-harness/`.
- If a future task intentionally changes visible output, regenerate `lecture-cuts/slide-spec.json` and record the reason, command evidence, and changed output files in this handoff.

## Inputs

- `lecture-cuts/source.md`
- `lecture-cuts/assets/slides.js`
- `lecture-cuts/*.html`
- `lecture-cuts/presenter-preview.html`
- `lecture-cuts/sources.html`
- `lecture-cuts/slide-spec.json`
- `docs/harness/lecture-cuts-content-inventory.md`
- `docs/harness/lecture-cuts-source-map.json`
- `docs/harness/codex-session-decision-log.md`

## Evidence Map Status

- PASS: 56 registered slides exported to `lecture-cuts/slide-spec.json`.
- PASS: 56 current slide hashes match the exported reproduction contract.
- PASS: 56 slides have inline presenter scripts.
- PASS: 0 generic presenter scripts remain.
- PASS: `lecture-cuts/assets/slide-html.js` matches the slide registry order and current slide HTML fragments.
- PASS: direct `file://` presentation runtime loads 56 cached slide fragments.
- PASS: direct `file://` presenter review runtime loads 56 review rows through the slide HTML cache.
- PASS: presenter review renders 56 cue panels and all 56 cue panels have content.
- PASS: direct `file://` presenter review disables save with a read-only status instead of throwing a failed fetch/save error.
- PASS: 55 slides carry slide-level source annotations; 1 synthetic concept/example slide explicitly allow deck-global coverage.

## Source Coverage

- PASS: Slides already marked with per-slide source evidence retain slide-level evidence.
- PASS: 55 slides now carry slide-level source annotations.
- PASS: 1 synthetic concept/example slide explicitly allow deck-global appendix coverage.
- PASS: 0 unclassified deck-global-only slides remain.
- Artifact Path: `docs/harness/lecture-cuts-source-map.json`

## Decisions

- `lecture-cuts/` remains the golden reference for current output quality.
- `deck-harness/` is the reusable workflow for future topics.
- `slide-spec.json` is a generated reproduction contract, not a hand-edited planning document.
- Intentional slide content or presenter script edits must regenerate `slide-spec.json`.
- Slide HTML, `div.note`, presenter script, source metadata, and `slide-spec.json` must be updated together when a teaching claim, example, flow, or timing changes.
- Korean copy, presenter script, terminology, and slide-script alignment changes must use `lecture-cuts/skills/korean-copy-review/SKILL.md`.
- Neighboring-slide duplication concerns must use `lecture-cuts/skills/slide-redundancy-review/SKILL.md`; if a rewrite is made, slide HTML, `div.note`, presenter script, and generated contracts must change together.
- Slide composition, presenter-script fit, explainability, and flow-bridge concerns must use `lecture-cuts/skills/slide-script-composition-review/SKILL.md`; report accepted findings before editing visible deck content.
- Presenter review editing should be served with `node scripts/serve-lecture-cuts-review.js --port 8766`; the top-nav save button writes changed presenter scripts to `lecture-cuts/assets/slides.js`, changed slide copy to the matching `lecture-cuts/*.html`, preserves hidden `div.note`, and runs `scripts/export-lecture-cuts-contract.js`.
- Presenter cues are stored under `speaker.cues` in `lecture-cuts/assets/slides.js`; they are rehearsal aids for `presenter-review.html`, not audience-facing slide content.
- Avoid describing `CLAUDE.md` as a generic "memory" in learner-facing copy. Use "프로젝트 지침" or "프로젝트 규칙" so learners do not confuse it with one-off prompts or handoff state.
- Workflow-only improvements must not change `lecture-cuts/deck.html`, `lecture-cuts/presenter-review.html`, or presentation runtime JS unless the user explicitly requests output changes.
- Handoff must include command evidence, artifact paths, agent findings, blocked risks, non-blocking risks, and a next prompt.
- The canonical presentation order must keep learner pain before the full solution map: title, why harness, before/after, failure patterns, workbench preview, layer map, then layer-by-layer expansion.
- Compression pass 2 has been applied: few-shot good/bad, failure-to-harness mapping, parallel safe/risky, and Hook Event/Command/Result are now integrated comparison or pipeline slides.
- Official terms now follow the learner-facing rule: first teaching use may use Korean-first bilingual form such as `스킬(Skill)`, then nearby prose uses Korean while literal paths, commands, and code identifiers stay unchanged.

## Changed Files

- `scripts/collect-codex-session-corpus.js`
- `scripts/export-lecture-cuts-contract.js`
- `scripts/validate-lecture-cuts-contract.js`
- `scripts/audit-lecture-cuts.js`
- `scripts/audit-lecture-cuts-speaker-sync.js`
- `scripts/audit-lecture-cuts-korean-copy.js`
- `scripts/audit-lecture-cuts-slide-redundancy.js`
- `scripts/audit-lecture-cuts-slide-script-composition.js`
- `scripts/serve-lecture-cuts-review.js`
- `scripts/run-lecture-cuts-hook.js`
- `scripts/verify-lecture-cuts-harness.js`
- `scripts/apply-lecture-cuts-phase2-flow.js`
- `lecture-cuts/agents/korean-copy-review-agent.md`
- `lecture-cuts/agents/slide-redundancy-review-agent.md`
- `lecture-cuts/agents/slide-script-composition-review-agent.md`
- `lecture-cuts/skills/korean-copy-review/SKILL.md`
- `lecture-cuts/skills/slide-redundancy-review/SKILL.md`
- `lecture-cuts/skills/slide-script-composition-review/SKILL.md`
- `lecture-cuts/skills/deck-builder/SKILL.md`
- `lecture-cuts/skills/verification-gate/SKILL.md`
- `lecture-cuts/slide-spec.json`
- `lecture-cuts/source.md`
- `lecture-cuts/HANDOFF.md`
- `lecture-cuts/deck.html`
- `lecture-cuts/assets/deck.js`
- `lecture-cuts/assets/slide-html.js`
- `lecture-cuts/assets/presenter-review.js`
- `lecture-cuts/assets/style.css`
- `lecture-cuts/assets/slides.js`
- `lecture-cuts/*.html` selected Korean copy and compression updates
- `lecture-cuts/index.html` story-card order updates
- `lecture-cuts/sources.html`
- `lecture-cuts/hooks/*.json`
- `docs/harness/codex-session-*.md`
- `docs/harness/codex-session-source-map.json`
- `docs/harness/lecture-cuts-content-inventory.md`
- `docs/harness/lecture-cuts-source-map.json`
- `docs/harness/lecture-cuts-story-flow-map.md`
- `docs/harness/lecture-cuts-reproduction-contract.md`
- `docs/audits/2026-05-25-lecture-cuts-quality-improvement-master-plan.md`
- `docs/audits/2026-05-25-lecture-cuts-runtime-export-plan.md`
- `docs/audits/2026-05-25-lecture-cuts-visual-overflow-plan.md`
- `docs/audits/2026-05-25-lecture-cuts-source-coverage-plan.md`
- `docs/audits/2026-05-25-lecture-cuts-korean-terminology-plan.md`
- `docs/audits/2026-05-25-lecture-cuts-slide-script-composition-agent-findings.md`
- `docs/audits/2026-05-25-lecture-cuts-slide-script-composition-review.md`
- `docs/audits/2026-05-26-lecture-cuts-cue-notebooklm-request.md`
- `docs/audits/2026-05-26-lecture-cuts-cue-sample-report.md`

## Generated Artifacts

- `docs/harness/codex-session-inventory.md`
- `docs/harness/codex-session-source-map.json`
- `docs/harness/codex-session-decision-log.md`
- `lecture-cuts/slide-spec.json`
- `lecture-cuts/assets/slide-html.js`
- `docs/harness/lecture-cuts-content-inventory.md`
- `docs/harness/lecture-cuts-source-map.json`
- `docs/audits/2026-05-25-lecture-cuts-slide-script-composition-agent-findings.md`
- `docs/audits/2026-05-25-lecture-cuts-slide-script-composition-review.md`

## Quality Gate Artifacts

- `docs/harness/lecture-cuts-reproduction-contract.md`
- `lecture-cuts/hooks/lecture-cuts-contract.json`
- `lecture-cuts/hooks/lecture-cuts-audit.json`
- `lecture-cuts/hooks/lecture-cuts-handoff.json`

## Verification

### Command: node scripts/collect-codex-session-corpus.js --check

- Exit Code: 0
- PASS: 4 top-level Codex sessions discovered.
- PASS: 19 subagent sessions recorded separately.
- Artifact Path: `docs/harness/codex-session-inventory.md`

### Command: node scripts/export-lecture-cuts-contract.js --check-confidence

- Exit Code: 0
- PASS: 56 slides checked.
- PASS: 0 low-confidence extraction fields.
- Artifact Path: `lecture-cuts/slide-spec.json`

### Command: node scripts/validate-lecture-cuts-contract.js

- Exit Code: 0
- PASS: contract slide count, order, hashes, titles, speaker sources, and source-sensitive slide coverage.
- PASS: source coverage allowlist covers 1 synthetic concept/example slide.
- PASS: slide HTML cache order and drift checks passed for 56 cached fragments.
- Artifact Path: `docs/harness/lecture-cuts-reproduction-contract.md`

### Command: node scripts/audit-lecture-cuts-speaker-sync.js

- Exit Code: 0
- PASS: 56 presenter scripts resolved.
- PASS: 0 presenter-preview fallback scripts.
- PASS: 0 generic presenter scripts.
- PASS: 0 source-sensitive term mismatches.
- Artifact Path: `scripts/audit-lecture-cuts-speaker-sync.js`

### Command: node scripts/audit-lecture-cuts-korean-copy.js

- Exit Code: 0
- PASS: 0 spacing candidates.
- PASS: 0 duplicate adjacent sentence starts.
- PASS: 0 long bullet lines after the applied pass.
- PASS: Korean copy audit reports 0 long titles, 0 long subtitles, 0 long bullet lines, 0 long speaker sentences, 0 spacing candidates, and 0 duplicate adjacent sentence starts.
- PASS: mixed Korean/English term audit reports 0 warnings after the Korean-first official terminology pass.
- Artifact Path: `scripts/audit-lecture-cuts-korean-copy.js`

### Command: node scripts/audit-lecture-cuts-slide-redundancy.js --slides 6,7

- Exit Code: 0
- PASS: Slide 06 and Slide 07 resolve to distinct roles: responsibility boundary vs sequence/process.
- WARN: Manual review still classifies the visible copy as potentially repetitive because both slides reuse the same layer terms.
- Artifact Path: `docs/audits/2026-05-25-slide-06-07-redundancy-review.md`

### Command: node scripts/audit-lecture-cuts-slide-script-composition.js

- Exit Code: 0
- PASS: 56 slides checked by the composition report generator.
- PASS: heuristic pass reports 0 P1 and 0 P2 findings.
- WARN: manual/subagent findings identify Slide 31-32, Slide 32, Slide 14, Slide 26, and `presenter-preview.html` as next content-improvement candidates.
- Artifact Path: `docs/audits/2026-05-25-lecture-cuts-slide-script-composition-review.md`

### Command: node scripts/audit-lecture-cuts.js

- Exit Code: 0
- PASS: static files, local references, reproduction contract, browser render, presenter scripts.
- PASS: 0 slides without inline speaker script.
- PASS: source coverage allowlist covers 1 synthetic concept/example slide.
- PASS: slide HTML cache order and drift checks passed for 56 cached fragments.
- PASS: projector/desktop/mobile overflow checks pass for 56 slides.
- Artifact Path: `scripts/audit-lecture-cuts.js`

### Command: node scripts/verify-lecture-cuts-harness.js

- Exit Code: 0
- PASS: syntax checks including presenter-review save server, reproduction contract, lecture-cuts audit, speaker-sync audit, pre-handoff hooks.
- PASS: Korean copy audit is part of the unified gate.
- PASS: Slide redundancy audit is part of the unified gate for the reviewed 6-7 pair.
- Artifact Path: `scripts/verify-lecture-cuts-harness.js`

### Command: node scripts/export-lecture-cuts-contract.js --check-confidence

- Exit Code: 0
- PASS: extraction confidence.
- PASS: 56 slides checked.
- Artifact Path: `lecture-cuts/slide-spec.json`

### Command: node scripts/validate-lecture-cuts-contract.js

- Exit Code: 0
- PASS: contract slide count, order, registered files, hashes, titles, speaker sources, and source-sensitive slide coverage.
- PASS: source coverage allowlist covers 1 synthetic concept/example slide.
- PASS: slide HTML cache order and drift checks passed for 56 cached fragments.
- Artifact Path: `docs/harness/lecture-cuts-reproduction-contract.md`

### Command: node scripts/audit-lecture-cuts-speaker-sync.js

- Exit Code: 0
- PASS: 56 presenter scripts resolved.
- PASS: 0 presenter-preview fallback scripts.
- PASS: 0 generic presenter scripts.
- PASS: 0 source-sensitive term mismatches.
- Artifact Path: `scripts/audit-lecture-cuts-speaker-sync.js`

### Command: node scripts/audit-lecture-cuts-korean-copy.js

- Exit Code: 0
- PASS: 0 long bullet lines, 0 spacing candidates, 0 duplicate adjacent sentence starts.
- PASS: long title/subtitle/sentence warnings are now 0.
- PASS: mixed Korean/English official-term warnings are now 0 under the Korean-first first-use policy.
- Artifact Path: `scripts/audit-lecture-cuts-korean-copy.js`

### Command: node scripts/audit-lecture-cuts.js

- Exit Code: 0
- PASS: slide registry, registered files, slide markup, local references, inline scripts, standalone nav order, reproduction contract, projector/desktop/mobile render load, note exposure, images, viewport fit, and presenter scripts.
- PASS: file URL runtime smoke loaded 56 frames through `window.LECTURE_SLIDE_HTML`.
- PASS: file URL presenter-review smoke loaded 56 review rows through `window.LECTURE_SLIDE_HTML`.
- PASS: file URL presenter-review save mode is read-only; HTTP presenter-review save API responds successfully through the local server.
- PASS: presenter review renders 56 cue panels; all 56 cue panels contain rehearsal cues.
- PASS: projector/desktop/mobile overflow warnings are now 0 after code/file-tree/orbital visual and compact mobile fixes.
- Artifact Path: `scripts/audit-lecture-cuts.js`

### Command: node scripts/verify-lecture-cuts-harness.js

- Exit Code: 0
- PASS: syntax checks, reproduction contract, lecture-cuts audit, speaker sync audit, Korean copy audit, slide redundancy audit, slide-script composition audit, and pre-handoff hooks.
- Artifact Path: `scripts/verify-lecture-cuts-harness.js`

### Command: Playwright file URL smoke

- Exit Code: 0
- PASS: `file:///Users/sabyun/goinfre/research_ai/lecture-cuts/deck.html` renders 56 `.deck-frame` slides.
- PASS: direct file runtime uses 56 cached fragments with `fetchLoaded=0` and `cacheFallbackLoaded=0`.
- PASS: active slide is `00-title.html`.
- PASS: no `.deck-error` text.
- PASS: browser console errors 0 after direct `file://` cache loading.
- Artifact Path: `lecture-cuts/assets/slide-html.js`

### Command: Playwright file URL presenter-review smoke

- Exit Code: 0
- PASS: `file:///Users/sabyun/goinfre/research_ai/lecture-cuts/presenter-review.html` renders 56 `.review-cut` rows.
- PASS: 56 `.review-cues` panels render; all 56 panels contain cue text.
- PASS: `window.LECTURE_SLIDE_HTML` is loaded.
- PASS: save button is disabled with `읽기 전용: 저장은 로컬 서버에서 가능`.
- PASS: no `.deck-error` text and browser console errors 0.
- Artifact Path: `lecture-cuts/presenter-review.html`

### Command: Playwright HTTP presenter-review save smoke

- Exit Code: 0
- PASS: `http://127.0.0.1:8766/presenter-review.html` renders 56 `.review-cut` rows.
- PASS: `POST /api/presenter-review/save` returns 200 and accepts `speaker.cues` updates.
- Artifact Path: `scripts/serve-lecture-cuts-review.js`

### Command: node scripts/serve-lecture-cuts-review.js --port 8766

- Exit Code: running local server
- PASS: `http://127.0.0.1:8766/presenter-review.html` serves the editable presenter review UI.
- PASS: `POST /api/presenter-review/save` accepts changed slide scripts and slide HTML, updates `lecture-cuts/assets/slides.js` plus matching slide files, preserves slide notes, and regenerates `lecture-cuts/slide-spec.json`.
- Artifact Path: `scripts/serve-lecture-cuts-review.js`

## Agent Findings

- PASS: Generic and lecture-cuts agent/skill files were generated by bounded worker tasks.
- PASS: Full pre-handoff hook passed after `docs/harness/lecture-cuts-agent-handoff.md` was generated.
- PASS: Speaker-sync rewrite completed for all registered slides.
- PASS: Source-sensitive technical terms now match presenter scripts.
- PASS: Slide 07 was rewritten around frequency/risk escalation criteria, reducing duplication with Slide 06 while preserving distinct teaching jobs.
- PASS: Story flow was reordered so learner pain and concrete failure patterns precede the whole workbench/layer map.
- PASS: Phase 2 compression merged few-shot good/bad, failure-to-harness mapping, parallel safe/risky, and Hook Event/Command/Result explanations into integrated slides.
- PASS: Direct file opening for `lecture-cuts/deck.html` is fixed with a generated slide HTML cache fallback.
- PASS: Standalone Prev/Next navigation now matches `lecture-cuts/assets/slides.js`.
- PASS: Korean-first official terminology policy is installed and the mixed-term audit now reports 0 warnings.
- PASS: Presenter cue workflow is installed in `presenter-review.html`; all 56 slides have cue content.
- WARN: Slide-script composition review is now installed; manual findings point to Slide 31-32, Slide 32, Slide 14, Slide 26, and `presenter-preview.html` as the next presentation-quality pass.

## Blocked Risks

- None for the completed contract/export tasks.

## Non-Blocking Risks

- No blocking visual overflow risk is known; browser audit currently reports projector, desktop, and mobile overflow PASS.
- Current source map has 55 slide-level source annotations and 1 explicit deck-global allowlist entry; no unclassified deck-global-only slide remains.
- Korean copy audit now treats first teaching use as Korean-first bilingual form, then requires Korean prose unless the token is a literal artifact/path/code identifier.
- Slide 06/07 redundancy has been addressed; continue using the slide-redundancy review skill for future neighboring-slide concerns.
- Glossary centralization and partial-term matching fixes are workflow requirements for future decks, but the visible lecture-cuts runtime was not changed in this workflow-only pass.
- Composition review report is generated, but its manual P1/P2 candidates have not been applied to visible slides or presenter scripts yet.
- NotebookLM cue comparison request is prepared, but the local NotebookLM CLI returned a streaming parse error before producing an answer. Artifact: `docs/audits/2026-05-26-lecture-cuts-cue-sample-report.md`.

## Next Prompt

```text
lecture-cuts/HANDOFF.md부터 읽고, docs/harness/codex-session-decision-log.md, lecture-cuts/slide-spec.json, docs/audits/2026-05-25-lecture-cuts-slide-script-composition-review.md, docs/audits/2026-05-26-lecture-cuts-cue-sample-report.md를 확인해줘. 발표 큐는 56장 전체에 들어갔으니 다음 pass는 큐 품질을 리허설 관점에서 다듬거나, Slide 31-32 경계, Slide 32 CLAUDE.md 설명 부하, Slide 14 matrix 대본, Slide 26 rubric code 대본을 함께 개선해줘. 변경 후에는 node scripts/export-lecture-cuts-contract.js, node scripts/validate-lecture-cuts-contract.js, node scripts/audit-lecture-cuts.js, node scripts/audit-lecture-cuts-korean-copy.js, node scripts/audit-lecture-cuts-speaker-sync.js, node scripts/audit-lecture-cuts-slide-script-composition.js, node scripts/verify-lecture-cuts-harness.js를 실행한 뒤 Verification과 Agent Findings를 최신 결과로 갱신해줘.
```
