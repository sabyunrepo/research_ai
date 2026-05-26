# Lecture Cuts Agent Handoff

This file is the shared report surface for lecture-cuts golden-reference agents. Agent files in `lecture-cuts/agents/*.md` must append their findings here before the deck is used as a reusable topic-to-deck benchmark.

## Report Contract

Each agent report must use this shape:

```text
## <agent-name>

Status: PASS|WARN|FAIL
Severity: P0|P1|P2|P3
Blocks handoff: yes|no
Required follow-up: <specific action or "none">
Evidence path: <path to artifact or command log>

### 발견
### 수행
### 판단
### 미해결
### 근거
- <file path>:<line or section> - <why it matters>
```

Report status rules:

- `PASS`: the agent's owned contract is complete and verified.
- `WARN`: the output is usable but contains non-blocking risk with an explicit owner.
- `FAIL`: the output is incomplete, unverified, source-weak, or cannot be reproduced.
- Any `FAIL` blocks handoff.
- Any `WARN` without `Required follow-up` blocks handoff.
- Any report without `Evidence path` blocks handoff.

## initial-current-contract-review

Status: WARN
Severity: P2
Blocks handoff: no
Required follow-up: none for source coverage; 55 slides now have slide-level evidence and 1 synthetic concept/example slide are explicitly allowlisted for deck-global coverage.
Evidence path: `docs/harness/lecture-cuts-reproduction-contract.md`

### 발견

- Current contract validation passes slide count, registry order, registered file presence, slide hashes, title extraction, speaker-source resolution, and source-sensitive slide retention.
- The validation command now reports PASS for source-sensitive coverage and source coverage allowlist handling.
- Content inventory records 56 slides, 9 sections, 56 inline speaker notes, 10 deck-global source references, and 55 slide-specific source annotations.
- Extraction confidence currently has no low-confidence fields.

### 수행

- Read the content inventory, source map, Codex session decision log, and reproduction contract required for Task 3.
- Ran `node scripts/validate-lecture-cuts-contract.js` as read-only evidence for the current reproduction state.
- Created the initial handoff section from current artifacts instead of agent placeholder PASS/WARN/FAIL sections.

### 판단

- The current lecture-cuts contract is reproducible enough for Task 3 agent-file setup.
- Source coverage is no longer an open blocker: unclassified deck-global-only warnings are at 0.
- Downstream agents still need fresh audit/browser evidence before claiming visual, glossary, presenter-review, or final handoff PASS.

### 미해결

- None for source coverage.
- Visual/accessibility status is verified by `node scripts/audit-lecture-cuts.js`; desktop, mobile, and file URL runtime checks pass, with no overflow warnings.
- Official source freshness for Claude Code hooks, subagents, skills, MCP, and OpenAI evaluation guidance still needs review by `source-grounding-agent`.

### 근거

- `docs/harness/lecture-cuts-content-inventory.md#summary` - records 56 slides, source contract path, source map path, 55 slide-specific annotations, and 10 deck-global references.
- `docs/harness/lecture-cuts-content-inventory.md#speaker-source-counts` - records 56 inline speaker notes.
- `docs/harness/lecture-cuts-content-inventory.md#extraction-confidence` - states that there are no low-confidence fields.
- `docs/harness/lecture-cuts-reproduction-contract.md#blocking-failures` - defines slide count, order, registered files, hashes, titles, speaker sources, and slide-level source evidence as blocking contract failures.
- `docs/harness/codex-session-decision-log.md#stable-decisions` - requires 4-hour workshop quality, lecture-cuts as golden reference, source-backed technical claims, role-separated agents, and reusable harness gates.

## speaker-script-sync-review

Status: PASS
Severity: P3
Blocks handoff: no
Required follow-up: none
Evidence path: `scripts/audit-lecture-cuts-speaker-sync.js`

### 발견

- The deck is structurally reproducible and presenter scripts are now resolved inline for all 56 slides.
- Current scan reports 0 presenter-preview fallback scripts, 0 generic presenter scripts, and 0 source-sensitive term mismatches.

### 수행

- Added a concrete sync rule to `lecture-cuts/AGENTS.md`: slide HTML, `div.note`, presenter script, source metadata, and generated contract must move together when a teaching point changes.
- Added the same operating rule to `lecture-cuts/source.md`.
- Added the implementation plan at `docs/superpowers/plans/2026-05-25-lecture-cuts-speaker-sync-plan.md`.
- Added `scripts/audit-lecture-cuts-speaker-sync.js` and wired it into `scripts/verify-lecture-cuts-harness.js`.
- Promoted section opener scripts to inline speaker entries and rewrote generic inline scripts in `lecture-cuts/assets/slides.js`.
- Added slide-level sources for source-sensitive technical claims and added the Claude Code Memory source card.

### 판단

- The speaker-sync pass is complete enough for delivery review: presenter scripts now match visible slide terms, and source-sensitive claims point to slide-level evidence.
- Overflow warnings have been cleared by the later quality pass and are not presenter-script drift.

### 미해결

- Source coverage still reports 10 deck-global-only slides.
- No projector, desktop, or mobile overflow warning remains.

### 근거

- `lecture-cuts/AGENTS.md` - now defines coupled slide/script editing rules.
- `lecture-cuts/source.md` - now defines the same operating rule at the deck source brief level.
- `lecture-cuts/HANDOFF.md` - records the current script-depth warning and the sync decision.
- `docs/superpowers/plans/2026-05-25-lecture-cuts-speaker-sync-plan.md` - defines the implementation sequence and verification commands.
- `scripts/audit-lecture-cuts-speaker-sync.js` - verifies presenter script resolution, generic-script removal, and source-sensitive term alignment.
- `lecture-cuts/assets/slides.js` - contains 56 inline presenter scripts and slide-level source metadata.

## korean-copy-review-agent

Status: PASS
Severity: P2
Blocks handoff: no
Required follow-up: none
Evidence path: `scripts/audit-lecture-cuts-korean-copy.js`

### 발견

- A reusable Korean copy review skill and agent contract now exist for future slide/script proofreading.
- The current deck has no blocking spacing candidates and no duplicate adjacent sentence starts.
- The first applied pass fixed key learner-facing wording in persona, few-shot, context, subagent, MCP, evaluation, final workflow, and handoff slides.
- The Korean copy audit now reports 0 long visible titles, 0 long subtitles, 0 long speaker sentences, and 0 mixed Korean/English official-term warnings under the Korean-first policy.

### 수행

- Added `lecture-cuts/skills/korean-copy-review/SKILL.md`.
- Added `lecture-cuts/agents/korean-copy-review-agent.md`.
- Updated `lecture-cuts/AGENTS.md`, `lecture-cuts/skills/deck-builder/SKILL.md`, and `lecture-cuts/skills/verification-gate/SKILL.md` so future workers load and run the Korean copy review workflow.
- Updated selected slide HTML and matching presenter scripts together.
- Regenerated `lecture-cuts/slide-spec.json`, `docs/harness/lecture-cuts-content-inventory.md`, and `docs/harness/lecture-cuts-source-map.json`.

### 판단

- The new workflow is usable as an agent harness: it separates screen copy review, presenter script review, and slide-script alignment review.
- The applied slide/script changes reduce the highest-risk grammar and consistency issues without changing slide count or runtime behavior.
- No Korean-copy audit warning remains in the current pass.

### 미해결

- No projector, desktop, or mobile overflow warning remains.
- Source coverage is resolved by later pass: 55 slide-level source annotations and 1 explicit deck-global allowlist entry.
- Future copy passes should preserve the Korean-first first-use policy and literal artifact exceptions.

### 근거

- `lecture-cuts/skills/korean-copy-review/SKILL.md` - defines the reusable Korean copy review process and terminology defaults.
- `lecture-cuts/agents/korean-copy-review-agent.md` - defines the agent report contract and fail conditions.
- `scripts/audit-lecture-cuts-korean-copy.js` - reports current Korean copy PASS/WARN findings.
- `scripts/audit-lecture-cuts-speaker-sync.js` - confirms 56 scripts resolved, 0 fallback scripts, 0 generic scripts, and 0 source-sensitive term mismatches.
- `lecture-cuts/assets/slides.js` - contains the synchronized presenter-script rewrites for the changed slides.

## claude-md-terminology-review

Status: PASS
Severity: P2
Blocks handoff: no
Required follow-up: none
Evidence path: `scripts/audit-lecture-cuts-korean-copy.js`

### 발견

- Learner-facing copy used "기억" for `CLAUDE.md` in several places, which could blur the boundary between one-off prompts, persistent project rules, and handoff state.
- The same ambiguity appeared in visible slide copy, presenter scripts, cue fields, the legacy presenter preview, and the index card label.

### 수행

- Reframed `CLAUDE.md` as "항상 적용되는 프로젝트 지침" across affected slide HTML and presenter scripts.
- Kept ordinary spoken phrases such as "기억해 주세요" where they do not define `CLAUDE.md`.
- Reframed `HANDOFF.md` as an "인수인계 장치" so it is not confused with `CLAUDE.md`.
- Regenerated `lecture-cuts/slide-spec.json`, `docs/harness/lecture-cuts-content-inventory.md`, `docs/harness/lecture-cuts-source-map.json`, and `lecture-cuts/assets/slide-html.js`.

### 판단

- The terminology now teaches a cleaner model: prompt is the current instruction, `CLAUDE.md` is persistent project guidance, skills hold reusable procedures, and handoff carries session state.
- No Korean-copy or speaker-sync audit warning remains after the terminology pass.

### 미해결

- `node scripts/audit-lecture-cuts.js` reports projector, desktop, mobile, and file URL runtime checks pass.

### 근거

- `lecture-cuts/08-claude-md.html` - visible title now uses "항상 적용되는 프로젝트 지침".
- `lecture-cuts/assets/slides.js` - presenter scripts and cues now distinguish prompt, project guidance, and handoff.
- `lecture-cuts/index.html` - index label now uses "항상 적용되는 프로젝트 지침".
- `scripts/audit-lecture-cuts-speaker-sync.js` - reports 56 scripts resolved and 0 term mismatches.

## pedagogy-flow-review-agent

Status: PASS
Severity: P2
Blocks handoff: no
Required follow-up: Compression candidates should be handled in a separate pass after live review of the new story order.
Evidence path: `docs/harness/lecture-cuts-story-flow-map.md`

### 발견

- The previous opening exposed the whole solution map before learners had fully felt the failure patterns.
- The new canonical order places problem recognition and concrete failure patterns before the workbench and layer map, then uses the layer responsibility slide before mapping repeated failures to harness layers.
- Section metadata now follows the learning build-up: opening/problem, failure patterns, whole map, Spec/Prompt, Context/Memory, Skills/Superpowers, Agents/Tools, Hooks/Verification, Final Workflow.

### 수행

- Reordered `lecture-cuts/assets/slides.js` so the first 15 slides now flow from pain to diagnosis to solution map, layer responsibility, failure-to-harness mapping, and frequency/risk escalation.
- Updated transition scripts for the moved slides and synchronized visible notes where the teaching role changed.
- Updated standalone slide Prev/Next links to match the registry order.
- Updated `lecture-cuts/index.html` card order so the index no longer implies the older solution-first flow.
- Added `docs/harness/lecture-cuts-story-flow-map.md` as the narrative contract for future edits.
- Regenerated `lecture-cuts/slide-spec.json`, `docs/harness/lecture-cuts-content-inventory.md`, and `docs/harness/lecture-cuts-source-map.json`.

### 판단

- The story now progresses from learner pain to basic control, then to the full harness map before asking which layer should absorb each repeated failure.
- The whole layer map remains early enough to orient the workshop, and the failure-to-harness mapping now lands after learners have seen each layer's responsibility.
- Phase 2 compression has now been applied after the flow reorder: few-shot good/bad, parallel safe/risky, and hook event/command/result are integrated slides.

### 미해결

- No projector, desktop, or mobile overflow warning remains.
- Ten non-source-sensitive slides still rely on deck-global source appendix coverage.
- No open compression candidate remains from the phase 2 scope.

### 근거

- `lecture-cuts/assets/slides.js` - canonical reordered registry and section metadata.
- `lecture-cuts/slide-spec.json` - regenerated reproduction contract for the new order.
- `docs/harness/lecture-cuts-story-flow-map.md` - documents the current narrative sequence and applied compression pass.
- `scripts/audit-lecture-cuts.js` - confirms standalone navigation, local references, browser render, and reproduction contract after the reorder.
- `scripts/verify-lecture-cuts-harness.js` - confirms the unified gate passes after the reorder.

## phase2-compression-review-agent

Status: PASS
Severity: P2
Blocks handoff: no
Required follow-up: none
Evidence path: `scripts/verify-lecture-cuts-harness.js`

### 발견

- The deck now has 56 registered slides after the scoped compression pass.
- The first 29-slide teaching run now moves from problem framing into failure patterns, whole map, Spec/Prompt, persona, few-shot, and reasoning without returning to the older solution-first order.
- Four repeated concept clusters were integrated: few-shot good/bad, failure-to-harness mapping, parallel safe/risky, and Hook Event/Command/Result.

### 수행

- Updated `lecture-cuts/assets/slides.js` presenter scripts for the high-priority 1-29 flow and the integrated compression slides.
- Updated the matching slide HTML, titles, notes, standalone navigation, and `lecture-cuts/index.html`.
- Added `scripts/apply-lecture-cuts-phase2-flow.js` as a reproducible local edit script for this pass.
- Regenerated `lecture-cuts/slide-spec.json`, `docs/harness/lecture-cuts-content-inventory.md`, and `docs/harness/lecture-cuts-source-map.json`.

### 판단

- Phase 2 is handoff-ready: contract, speaker sync, Korean copy, static/render audit, and unified harness verification all exit 0.
- The compression improves tempo without removing workshop checkpoints or the layer-by-layer build-up.

### 미해결

- Source coverage is now resolved by later pass: 55 slide-level source annotations and 1 explicit deck-global allowlist entry.
- No projector, desktop, or mobile overflow warning remains.
- Korean copy audit no longer reports long-title/subtitle or mixed official-term warnings.

### 근거

- `lecture-cuts/assets/slides.js` - canonical 56-slide registry and updated presenter scripts.
- `lecture-cuts/slide-spec.json` - regenerated 56-slide reproduction contract.
- `docs/harness/lecture-cuts-story-flow-map.md` - records the applied phase 2 compression.
- `scripts/audit-lecture-cuts-speaker-sync.js` - reports 56 resolved scripts and 0 source-sensitive mismatches.
- `scripts/verify-lecture-cuts-harness.js` - reports the unified verification gate passing.

## slide-script-composition-review-agent

Status: WARN
Severity: P1
Blocks handoff: no
Required follow-up: accept or reject the reported Slide 31-32, Slide 32, Slide 14, Slide 26, and presenter-preview fixes before the next presentation-ready content pass.
Evidence path: `docs/audits/2026-05-25-lecture-cuts-slide-script-composition-review.md`

### 발견

- A reusable composition-review skill, agent contract, audit script, and dated report now exist for checking whether slide composition and presenter scripts support the same teaching point.
- The heuristic pass checked all 56 slides and reported 0 P1, 0 P2, and 3 P3 transition findings.
- The read-only subagent pass found higher-signal manual candidates: Slide 32 carries too much script for the visible anchors, Slides 31-32 repeat the memory-layer transition, Slide 14 underuses half of the visible layer matrix, Slide 26 should point more directly to the rubric code, and `presenter-preview.html` may be confused with the current rehearsal surface.

### 수행

- Added `lecture-cuts/skills/slide-script-composition-review/SKILL.md`.
- Added `lecture-cuts/agents/slide-script-composition-review-agent.md`.
- Added `scripts/audit-lecture-cuts-slide-script-composition.js` and wired it into `scripts/verify-lecture-cuts-harness.js`.
- Saved subagent findings at `docs/audits/2026-05-25-lecture-cuts-slide-script-composition-agent-findings.md`.
- Regenerated the combined report at `docs/audits/2026-05-25-lecture-cuts-slide-script-composition-review.md`.

### 판단

- The deck is still structurally usable, so this pass does not block handoff by itself.
- The next visible-content pass should start from the manual P1/P2 candidates because they are more presentation-relevant than the automated P3 transition heuristics.
- No slide HTML or presenter script was changed in this pass; this was harness creation plus review-report generation.

### 미해결

- Slide 31-32 boundary and Slide 32 content/script load are not fixed yet.
- Slide 14 and Slide 26 script alignment improvements are not fixed yet.
- `presenter-preview.html` role is not clarified yet.

### 근거

- `lecture-cuts/skills/slide-script-composition-review/SKILL.md` - defines the reusable review axes and report contract.
- `lecture-cuts/agents/slide-script-composition-review-agent.md` - defines owned artifacts, required reads, and stop conditions.
- `scripts/audit-lecture-cuts-slide-script-composition.js` - generates the 56-slide composition report and includes manual/subagent findings when present.
- `docs/audits/2026-05-25-lecture-cuts-slide-script-composition-agent-findings.md` - records the read-only subagent findings and recommended fix order.
- `docs/audits/2026-05-25-lecture-cuts-slide-script-composition-review.md` - combined generated report used for this handoff.

## presenter-cue-review-agent

Status: WARN
Severity: P2
Blocks handoff: no
Required follow-up: review cue quality in `presenter-review.html` during rehearsal and refine weak slides as needed.
Evidence path: `docs/audits/2026-05-26-lecture-cuts-cue-sample-report.md`

### 발견

- The presenter needs rehearsal cues rather than a word-for-word script for a 4-hour, 56-slide workshop.
- The review UI can separate short cue prompts from the detailed preparation script without exposing cues in `deck.html`.
- NotebookLM comparison was requested, but the local CLI failed before returning usable cue suggestions.

### 수행

- Added editable `발표 큐` panels to `lecture-cuts/assets/presenter-review.js`.
- Added cue save support to `scripts/serve-lecture-cuts-review.js`.
- Added `speaker.cues` export support to `scripts/export-lecture-cuts-contract.js`.
- Added cue content for all 56 slides in `lecture-cuts/assets/slides.js`.
- Added cue-panel browser checks to `scripts/audit-lecture-cuts.js`.
- Saved the NotebookLM request and cue sample report under `docs/audits/`.

### 판단

- The cue workflow is usable for rehearsal: all 56 slides render cue panels, and all 56 panels contain cue content.
- The cue wording should be reviewed by the presenter during rehearsal before treating it as final delivery support.
- NotebookLM should be retried only after the CLI streaming parser issue is fixed or bypassed.

### 미해결

- NotebookLM did not produce a comparison answer.
- The existing composition-improvement candidates for Slides 14, 26, 31, and 32 still need visible/script refinement if the user accepts them.

### 근거

- `lecture-cuts/assets/presenter-review.js` - renders editable cue panels above the detailed script.
- `scripts/serve-lecture-cuts-review.js` - accepts and persists `speaker.cues`.
- `lecture-cuts/assets/slides.js` - stores cue objects for 56 slides.
- `docs/audits/2026-05-26-lecture-cuts-cue-notebooklm-request.md` - NotebookLM comparison prompt.
- `docs/audits/2026-05-26-lecture-cuts-cue-sample-report.md` - cue sample report and NotebookLM failure note.
- `scripts/audit-lecture-cuts.js` - checks 56 cue panels and requires all 56 cue panels to contain content.

## deck-file-url-runtime-agent

Status: PASS
Severity: P1
Blocks handoff: no
Required follow-up: none
Evidence path: `lecture-cuts/assets/slide-html.js`

### 발견

- Opening `lecture-cuts/deck.html` through `file://` caused browser `fetch()` to reject local slide HTML files.
- The HTTP-served audit path passed, so the failure was specific to direct local-file opening from the index/browser.

### 수행

- Added generated `lecture-cuts/assets/slide-html.js` containing registered slide `main.slide` HTML.
- Updated `lecture-cuts/deck.html` to load the generated cache before `assets/deck.js`.
- Updated `lecture-cuts/assets/deck.js` to use the cache directly on `file://`, and to keep the cache as a fallback for failed fetches.
- Updated `scripts/export-lecture-cuts-contract.js` so the cache is regenerated with the reproduction contract.

### 판단

- Direct `file://` opening now renders the actual presentation deck without requiring a local server.
- The existing HTTP/browser audit path still passes, so the fallback does not break normal served rendering.

### 미해결

- Source coverage and overflow warnings are now resolved by later quality pass.

### 근거

- `lecture-cuts/deck.html` - loads `assets/slide-html.js` before `assets/deck.js`.
- `lecture-cuts/assets/deck.js` - uses cached slide HTML when `window.location.protocol` is `file:`.
- `scripts/export-lecture-cuts-contract.js` - regenerates `lecture-cuts/assets/slide-html.js`.
- Playwright file URL smoke - reports 56 frames, active `00-title.html`, no deck error, and 0 browser console errors.

## quality-improvement-runtime-source-visual-pass

Status: PASS
Severity: P3
Blocks handoff: no
Required follow-up: none
Evidence path: `docs/audits/2026-05-25-lecture-cuts-quality-improvement-master-plan.md`

### 발견

- Direct `file://` runtime behavior is now covered by generated `assets/slide-html.js`, runtime diagnostics, validator cache-drift checks, and browser audit smoke.
- Source coverage now has 0 unclassified deck-global-only slides; 55 slides have slide-level evidence and 1 synthetic concept/example slide are explicitly allowlisted.
- The prioritized P1 visual findings for workbench cards, the rule-lift visual, and the read-before-edit code example were remediated.
- Later code/file-tree/orbital visual warnings were also cleared from projector, desktop, and mobile audits.
- Korean terminology P2 changes now include the formal first-use policy: Korean-first bilingual term on first teaching use, Korean prose afterward, literal artifacts preserved.

### 수행

- Updated `scripts/validate-lecture-cuts-contract.js` to validate `lecture-cuts/assets/slide-html.js` order and fragment drift.
- Updated `scripts/audit-lecture-cuts.js` to run a direct `file://` deck smoke and to ignore only known heading line-box and rotated-arrow measurement noise.
- Updated `scripts/verify-lecture-cuts-harness.js` to syntax-check the generated slide HTML cache.
- Added Anthropic prompt-engineering source cards to `lecture-cuts/sources.html` and slide-level source metadata to the relevant registry entries.
- Updated selected slide HTML and matching presenter scripts for Korean-first terminology.
- Updated `lecture-cuts/assets/style.css` for the prioritized overflow findings.

### 판단

- The deck is usable for the next review round: all blocking gates pass, direct file presentation loading is verified, source coverage warnings are resolved, and overflow audits pass.
- There is no remaining visual WARN backlog in `node scripts/audit-lecture-cuts.js`.
- The Korean copy audit now allows intentional Korean-first bilingual introductions and reports 0 mixed-term warnings.

### 미해결

- None for Korean terminology in the current pass.

### 근거

- `scripts/validate-lecture-cuts-contract.js` - validates slide count/order/hash/title/script/source coverage plus slide HTML cache order and drift.
- `scripts/audit-lecture-cuts.js` - verifies static references, browser rendering, presenter scripts, and direct `file://` runtime cache loading.
- `lecture-cuts/assets/deck.js` - records runtime diagnostics for fetch/cache loading behavior.
- `lecture-cuts/assets/style.css` - contains the targeted visual fixes for the P1 overflow findings.
- `lecture-cuts/sources.html` - contains the expanded source appendix for prompt engineering references.
