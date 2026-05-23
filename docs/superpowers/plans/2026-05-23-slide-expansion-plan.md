# Slide Expansion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Expand the current 22-cut lecture deck into a presenter-friendly, highly visual multi-slide deck with no hard slide-count limit.

**Architecture:** Keep the current `lecture-cuts/*.html` deck system, but introduce full-slide expansions and a slide manifest so one topic can become multiple complete 16:9 slides. Each slide should carry one idea, one proof object, or one concrete file/schema/example. `deck.html` remains the actual presentation surface, and `presenter-review.html` remains the script review surface.

**Tech Stack:** Plain HTML, CSS, browser JavaScript, existing `lecture-cuts/assets/style.css`, `deck.js`, and `presenter-review.js`.

---

## Expansion Rule

Do not force one topic into one slide. A topic should split whenever it contains more than one of these:

- definition
- why it matters
- concrete file structure
- real config snippet
- decision rule
- failure example
- visual metaphor
- workflow diagram
- speaker-only nuance

Each expansion slide is a full slide, not a mini panel. It can appear for only 1-10 seconds during the talk, but it should still use the whole 16:9 canvas for one clear visual, example, file structure, code/config snippet, or before/after comparison.

For most major concepts, prefer this teaching rhythm:

1. Concept slide: what the concept means.
2. Failure or confusion slide: why learners or LLMs get this wrong.
3. Concrete example slide A: a real-looking prompt/file/config/request.
4. Concrete example slide B: a second contrasting example or failure mode.
5. Improvement slide: how the workflow, rule, hook, skill, or evaluation fixes it.

## Practice Placement Rule

Keep practice slides concentrated in the second half of the lecture. The early sections should stay explanation-first so learners can build a mental model before being asked to produce artifacts.

Remove the earlier proposed practice pauses:

- Practice 0: personal failure recall
- Practice 1: failure routing/classification
- Practice 2: bad request rewrite
- Practice 3: mini `CLAUDE.md`
- Practice 4: Skill draft

Keep only these full-slide practice checkpoints:

- Practice 5 after `18. MCP / Tool Layer`: design role and tool separation for one AI workflow.
- Practice 6 after `20. Loop / Schedule`: design a verification gate with command, trigger, pass/fail rule, and fallback.
- Practice 7 after `21. Final Workflow`: choose one `CLAUDE.md` rule, one Skill candidate, and one Hook/Evaluation candidate to take back to the learner's own project.

These remaining practices should be full slides, not mini callouts. Each should show a concrete worksheet, file skeleton, or decision matrix that the presenter can walk through.

## Naming Convention

Use decimal expansion slide IDs so the original order remains readable:

- `03-layer-map.html`
- `03-1-layer-prompt.html`
- `03-2-layer-context.html`
- `03-3-layer-skill.html`

Use this pattern for all expansions:

`NN-S-short-topic.html`

Where:

- `NN` is the parent slide number.
- `S` is the expansion slide number.
- `short-topic` is lowercase kebab-case.

## Manifest Requirement

Create `lecture-cuts/assets/slides.js` as the single source of slide order.

It should export or define one ordered array used by both `deck.js` and `presenter-review.js`. This avoids manually updating two loader files every time an expansion slide is added.

Required fields per slide:

- `file`: HTML file path under `lecture-cuts`
- `parent`: original parent number, such as `03`
- `kind`: `main`, `definition`, `artifact`, `example`, `workflow`, `checkpoint`, or `transition`
- `reviewTitle`: short title for presenter review
- `scriptSource`: optional source cut ID when an expansion slide reuses or derives from an existing script section

## Proposed Expansion Map

### 00. Title

Keep mostly as-is.

Add:

- `00-1-promise.html`: one-slide promise: "프롬프트 강의가 아니라 작업 시스템 설계"
- `00-2-outcome.html`: final learner outcome checklist

### 01. Why Harness

Current issue: one slide explains inconsistency, harness components, and escalation rule.

Add:

- `01-1-inconsistency.html`: visual before/after: same AI, different result by missing process
- `01-2-harness-parts.html`: Memory / Skill / Hook / Verify separated as four artifacts
- `01-3-escalation-rule.html`: "반복 지시 -> 기억, 반복 절차 -> Skill, 강제 검증 -> Hook"

### 02. Failure Patterns

Current issue: the current slide says "failure is a process problem", but it does not give enough time to show why LLMs fail, how those failures look in practice, and how the harness improves them.

Add:

- `02-1-why-llms-fail.html`: full-slide visual: LLM output depends on visible context, instruction priority, tool feedback, and verification pressure.
- `02-2-failure-example-read-before-edit.html`: full-slide example: the model edits a file before reading nearby code, causing style/API mismatch.
- `02-3-failure-example-skip-test.html`: full-slide example: the model sees a failing test and hides it with skip/mock instead of finding root cause.
- `02-4-failure-example-context-drift.html`: full-slide example: stale assumptions from an earlier turn contaminate later work.
- `02-5-improvement-process-guardrails.html`: full-slide improvement: Read -> Plan -> Edit -> Verify -> Report, with each step mapped to CLAUDE.md / Skill / Hook / Evaluation.
- `02-6-improvement-turn-failure-into-rule.html`: full-slide improvement: repeated failure becomes persistent rule, reusable skill, hook, or review checklist.

### 03. Layer Map

Current issue: eight layers appear together.

Add one full expansion slide per layer:

- `03-1-prompt-layer.html`
- `03-2-context-layer.html`
- `03-3-skill-layer.html`
- `03-4-agent-layer.html`
- `03-5-automation-layer.html`
- `03-6-tool-layer.html`
- `03-7-evaluation-layer.html`
- `03-8-loop-layer.html`

Each expansion slide should use the whole canvas to show where the layer sits, what input it consumes, what output it produces, and one concrete artifact if available.

### 04-07. Prompt Section

Current issue: Prompt, persona, few-shot, and reasoning are close enough that students may merge them mentally.

Add:

- `04-1-prompt-anatomy.html`: instruction / context / examples / input / output format
- `04-2-xml-boundaries.html`: visual XML block segmentation
- `05-1-persona-bad-good.html`: "senior developer" vs priority-based reviewer
- `05-2-review-rubric.html`: bug / regression / missing test / risky assumption
- `06-1-good-example-shape.html`: exact good review shape with file, impact, reason
- `06-2-bad-example-shape.html`: vague review example crossed out
- `06-3-few-shot-to-skill-reference.html`: when examples should move to Skill references
- `07-1-reasoning-old-vs-new.html`: "think step by step" vs goal/input/verification
- `07-2-output-over-thought.html`: require artifacts and verification, not hidden chain of thought

### 08-09. Context Section

Current issue: file locations, context cost, and selection policy are compressed.

Add:

- `08-1-memory-locations.html`: actual `CLAUDE.md` hierarchy: user / project / local
- `08-2-claude-md-minimal.html`: compact example of good `CLAUDE.md`
- `08-3-claude-md-too-large.html`: anti-pattern: long docs, stale rules, noisy instructions
- `09-1-context-budget.html`: context as limited workspace
- `09-2-always-vs-needed.html`: what belongs in always-loaded memory vs Skill references
- `09-3-tool-description-cost.html`: MCP/tool descriptions as context cost

### 10-12. Skills / Superpowers

Current issue: skill purpose, file shape, and Superpowers case study are mixed.

Add:

- `10-1-skill-trigger.html`: `description` as auto-call trigger
- `10-2-skill-body.html`: short procedural body example
- `10-3-skill-references.html`: long supporting files opened only when needed
- `11-1-skill-folder-real.html`: enlarged folder tree: `SKILL.md`, `references/`, `scripts/`, `assets/`
- `11-2-skill-frontmatter.html`: real frontmatter fields and what each does
- `11-3-skill-script-hand-off.html`: script reuse instead of pasting long code
- `12-1-superpowers-map.html`: brainstorming / TDD / debugging / review / verification
- `12-2-superpowers-as-harness.html`: why Superpowers is not just "a skill pack"

### 13. Spec-Driven

Current issue: spec / plan / review is introduced too quickly.

Add:

- `13-1-vibe-vs-spec.html`: contrast slide
- `13-2-spec-contract.html`: what a spec locks: goal, non-goals, constraints, acceptance criteria
- `13-3-plan-to-execution.html`: spec -> plan -> execution -> review

### 14-15. Agents

Current issue: subagent and team concepts need concrete boundaries.

Add:

- `14-1-subagent-context.html`: separate context bubble
- `14-2-reviewer-agent.html`: reviewer sees only diff and defect rubric
- `14-3-research-agent.html`: research agent collects facts, not implementation decisions
- `15-1-parallel-safe.html`: parallel only when work is independent
- `15-2-parallel-risk.html`: merge conflict / inconsistent assumptions / duplicated work
- `15-3-main-as-orchestrator.html`: main model integrates results and makes tradeoffs

### 16-17. Hooks

Current issue: hook JSON and hook levels need more visual staging.

Add:

- `16-1-hook-event.html`: event trigger: `Edit|Write`
- `16-2-hook-command.html`: command step: `pnpm test`
- `16-3-hook-result.html`: pass/fail returned to agent
- `16-4-hook-vs-skill.html`: Skill = instruction, Hook = execution
- `17-1-stop-hook.html`: prevents completion before verification
- `17-2-prompt-hook.html`: lightweight judgment prompt
- `17-3-agent-hook.html`: deeper codebase-reading verifier
- `17-4-hook-start-small.html`: echo -> lint -> test progression

### 18. MCP / Tool Layer

Current issue: MCP needs concrete examples.

Add:

- `18-1-mcp-bridge.html`: model -> MCP server -> external system
- `18-2-tool-permissions.html`: read-only vs write-capable tool
- `18-3-tool-bloat.html`: too many tools increase context and choice cost
- `18-4-examples.html`: GitHub / Browser / DB / Figma as separate tool cards

### 19. Evaluation

Current issue: test, judge, review, human verification appear on one slide.

Add:

- `19-1-machine-checks.html`: test / lint / typecheck
- `19-2-judge-checks.html`: rubric and LLM-as-judge
- `19-3-human-checks.html`: human requirement review
- `19-4-evidence-report.html`: final report format: changed files, commands, results, remaining risk

### 20. Loop / Schedule

Current issue: loop and schedule are introduced but not operationalized.

Add:

- `20-1-loop-until-pass.html`: repeat until quality gate passes
- `20-2-scheduled-agent.html`: daily/weekly monitor examples
- `20-3-pr-watch.html`: PR comment/CI monitor workflow
- `20-4-operational-risk.html`: runaway loop, stale context, noisy alerts

### 21. Final Workflow

Current issue: final workflow compresses the whole practical exercise.

Add:

- `21-1-final-artifacts.html`: deliverables: CLAUDE.md, Skill, Subagent, Hook, Evaluation rubric
- `21-2-bug-request-flow.html`: user request -> triage -> edit -> hook -> review -> report
- `21-3-team-retrospective.html`: "AI가 두 번 이상 틀린 규칙은 무엇인가?"
- `21-4-next-harness-candidate.html`: turn repeated failure into next rule/skill/hook

## Implementation Tasks

### Task 1: Create Slide Manifest

**Files:**
- Create: `lecture-cuts/assets/slides.js`
- Modify: `lecture-cuts/assets/deck.js`
- Modify: `lecture-cuts/assets/presenter-review.js`

- [ ] Define the ordered slide list in `slides.js`.
- [ ] Move the current hardcoded slide arrays from both JS files into the manifest.
- [ ] Confirm actual presentation and presenter review both render 22 existing slides before adding expansion slides.

### Task 2: Add Full-Slide Expansion Template

**Files:**
- Create: expansion slide files under `lecture-cuts/`
- Modify: `lecture-cuts/assets/style.css`

- [ ] Use the existing `.slide`, `.copy`, and `.slide-media` structure.
- [ ] Keep each expansion slide to one claim, but use the full 16:9 canvas.
- [ ] Use existing visual classes when possible.
- [ ] Add new CSS visual components only when the content needs a new shape.

### Task 3: Expand In Batches

Batch order:

1. Failure and layer map: `02`, `03`
2. Prompt and context: `04` to `09`
3. Skills and Superpowers: `10` to `12`
4. Spec and agents: `13` to `15`
5. Hooks and MCP: `16` to `18`
6. Evaluation, loop, final workflow: `19` to `21`

After each batch:

- [ ] Update `slides.js`.
- [ ] Open `deck.html`.
- [ ] Verify slide count.
- [ ] Verify no missing images.
- [ ] Verify CSS visual overflow is zero.
- [ ] Open `presenter-review.html`.
- [ ] Verify each expansion slide has a presenter script or script placeholder.

### Task 4: Presenter Script Strategy

**Files:**
- Modify: `lecture-cuts/presenter-preview.html` or replace with generated presenter script data
- Modify: `lecture-cuts/assets/presenter-review.js`

For every expansion slide:

- [ ] Write one short speaker purpose line.
- [ ] Write 1-3 paragraphs of presenter script.
- [ ] Add "show briefly" notes for slides intended to appear for only 1-5 seconds.
- [ ] Link the expansion slide to its parent topic.

### Task 5: Visual QA

**Files:**
- Read-only browser QA against `deck.html` and `presenter-review.html`

- [ ] Check desktop viewport.
- [ ] Check narrow viewport.
- [ ] Check print media for actual presentation deck.
- [ ] Check `prefers-reduced-motion` behavior.
- [ ] Confirm remaining raster images are intentional and non-duplicated.

## Definition Of Done

- The deck no longer compresses multi-part ideas into one slide.
- Every slide has one visual or one concrete artifact.
- No repeated image is used as a filler.
- Existing presenter review flow still works.
- Speaker scripts cover all expansion slides.
- Actual presentation deck hides notes and time labels.
- Presenter review deck shows time labels and scripts.
- There is no missing media, no console error, and no visual overflow in target desktop viewport.
