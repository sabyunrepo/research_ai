# 4-Hour Lecture Workshop Improvement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Improve the 4-hour AI agent harness engineering workshop deck so the material is factually accurate, pedagogically coherent, visually stable, and directly usable in a live workshop.

**Architecture:** Keep `lecture-cuts/` as the canonical 4-hour workshop deck and `lecture-deck/` as the sample HTML/CSS deck automation harness. Improve correctness first, then workshop flow, then visual evidence, then machine verification. Do not create a separate condensed deck in this pass.

**Tech Stack:** Static HTML/CSS/JS deck, Node.js audit scripts, in-browser rendering, official Claude Code/MCP/OpenAI documentation as source references.

---

## File Structure

- Modify: `lecture-cuts/16-2-hook-command.html`  
  Fix Claude Code Hook JSON schema shown to students.
- Modify: `lecture-cuts/17-hook-advanced.html`  
  Reword "Prompt Hook / Agent Hook" so they are not mistaken for official event names.
- Modify: `lecture-cuts/18-1-mcp-bridge.html`  
  Add Host / MCP Client / MCP Server / tools / resources / prompts distinction.
- Modify: `lecture-cuts/10-skills.html`, `lecture-cuts/11-1-real-skill-folder.html`, `lecture-cuts/11-2-skill-frontmatter-fields.html`, `lecture-cuts/21-1-final-artifact-structure.html`  
  Separate "Claude Code official skill path" from "workshop sample harness path".
- Modify: `lecture-cuts/assets/style.css`  
  Fix 1280x720 deck viewport fit and targeted overflow issues.
- Modify: `lecture-cuts/assets/deck.js` or standalone slide HTML files  
  Decide whether standalone Prev/Next links should follow `assets/slides.js` or be de-emphasized.
- Modify: selected visual proof slides: `06-1-good-few-shot.html`, `08-2-good-claude-md.html`, `11-1-real-skill-folder.html`, `21-1-final-artifact-structure.html`, `21-6-handoff-template.html`  
  Replace repetitive abstract CSS cards with actual file tree, schema, audit output, or before/after artifact visuals.
- Modify: `lecture-cuts/assets/slides.js`  
  Add or refine speaker notes where the slide needs a source warning, bridge, or live-demo cue.
- Modify: `docs/audits/2026-05-25-lecture-materials-validation.md`  
  Update after fixes with resolved/unresolved status.
- Modify: `scripts/audit-lecture-cuts.js`  
  Promote important current warnings into explicit checks where appropriate.

## Task 1: Fix Official Correctness Issues

**Files:**
- Modify: `lecture-cuts/16-2-hook-command.html`
- Modify: `lecture-cuts/17-hook-advanced.html`
- Modify: `lecture-cuts/18-1-mcp-bridge.html`
- Modify: `lecture-cuts/assets/slides.js`

- [ ] **Step 1: Fix Hook schema example**

Replace the code example in `lecture-cuts/16-2-hook-command.html` with the official nested hook shape:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "pnpm test"
          }
        ]
      }
    ]
  }
}
```

Update the subtitle or bullet copy to say: "Hook은 이벤트에 matcher를 붙이고, 그 안에서 command를 실행합니다."

- [ ] **Step 2: Reword advanced Hook slide**

In `lecture-cuts/17-hook-advanced.html`, replace:

```text
단순 command hook에서 prompt hook, agent hook, stop hook으로 확장할 수 있습니다.
```

with:

```text
공식 이벤트는 유지하되, 실행 방식과 검사 깊이를 단계적으로 올립니다.
```

Replace bullets with:

```text
Stop event: 종료 전 검증을 붙입니다.
Command handler: 빠른 lint/test를 실행합니다.
Subagent review: 복잡한 검토는 별도 context로 분리합니다.
```

- [ ] **Step 3: Reword MCP bridge slide**

In `lecture-cuts/18-1-mcp-bridge.html`, change the model from "Model -> MCP Server -> Tool Call" to:

```text
Host app -> MCP Client -> MCP Server -> External System
```

Add bullets:

```text
Host: Claude/Codex 같은 실행 환경
Client: server와 통신하는 연결 단위
Server: tools, resources, prompts를 노출
Tool: 실제 작업을 수행하는 호출
```

- [ ] **Step 4: Add speaker notes for official-source caution**

In `lecture-cuts/assets/slides.js`, update speaker notes for `16-2-hook-command.html`, `17-hook-advanced.html`, and `18-1-mcp-bridge.html` to include one sentence:

```text
이 슬라이드는 입문용 단순화입니다. 실제 설정은 공식 문서의 schema를 기준으로 확인해야 합니다.
```

- [ ] **Step 5: Verify official correctness edits**

Run:

```sh
node scripts/audit-lecture-cuts.js
```

Expected:

```text
PASS slide registry
PASS registered slide files
PASS local references
PASS desktop render load
PASS presenter scripts
```

Keep existing overflow warnings for later tasks.

## Task 2: Clarify Workshop Scope and Learning Path

**Files:**
- Modify: `lecture-cuts/index.html`
- Modify: `lecture-cuts/assets/slides.js`
- Modify: `lecture-plan.html`

- [ ] **Step 1: Lock the 4-hour workshop framing**

In `lecture-cuts/index.html`, keep "4시간 강의 deck" and add a short line near the lead:

```text
이 자료는 20분 발표용 요약본이 아니라, 개념 설명과 실습을 함께 진행하는 4시간 워크숍 자료입니다.
```

- [ ] **Step 2: Add section intent to `slides.js` for presenter review**

For section start slides in `lecture-cuts/assets/slides.js`, add or update `speaker.html` to explain what the section is for. Use this pattern:

```html
<strong>섹션 목표</strong>
<p>이 구간은 수강생이 [개념]을 [실무 행동]으로 연결하게 만드는 구간입니다.</p>
<p>핵심 질문은 “[질문]”입니다.</p>
```

Prioritize these section starts first:

```text
02-failure-patterns.html
13-spec-driven.html
10-skills.html
18-mcp.html
16-hooks.html
19-evaluation.html
21-final-workflow.html
```

- [ ] **Step 3: Add bridge notes where the flow jumps**

In `lecture-cuts/assets/slides.js`, add bridge language to the speaker notes for:

```text
02-7-failure-to-harness-decision.html
09-3-context-drift-check.html
18-4-practice-agent-tool-split.html
```

Use these exact bridge messages:

```text
실패를 막으려면 먼저 완료 기준을 파일로 고정합니다.
기억에 둘 것과 절차로 뺄 것을 나누는 순간 Skill이 필요해집니다.
도구는 할 수 있게 만들고, Hook은 하게 만듭니다.
```

- [ ] **Step 4: Align `lecture-plan.html` with actual deck order**

Update `lecture-plan.html` so it no longer implies a different workshop sequence from `lecture-cuts/assets/slides.js`. Keep the 4-hour structure, but mention that the executable deck order is the source of truth:

```text
실제 발표 순서는 lecture-cuts/assets/slides.js를 기준으로 한다.
```

- [ ] **Step 5: Verify presenter review still resolves all scripts**

Run:

```sh
node scripts/audit-lecture-cuts.js
```

Expected:

```text
PASS presenter scripts - 87 review scripts resolved
```

## Task 3: Fix 1280x720 Presentation Fit

**Files:**
- Modify: `lecture-cuts/assets/style.css`
- Modify: `scripts/audit-lecture-cuts.js`

- [ ] **Step 1: Add a stricter viewport audit for 1280x720**

In `scripts/audit-lecture-cuts.js`, add a browser viewport entry:

```js
{ name: "projector render", width: 1280, height: 720, mobile: false }
```

Add a check that `.deck-frame.is-active` bottom is not below `window.innerHeight + 2`. Report this as `FAIL projector viewport fit` instead of a warning.

- [ ] **Step 2: Fix `.deck-stage` height calculation**

In `lecture-cuts/assets/style.css`, replace fixed toolbar-height assumptions with grid layout that lets the stage consume remaining viewport height:

```css
.deck-page {
  min-height: 100vh;
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
}

.deck-stage {
  min-height: 0;
  height: auto;
}
```

Keep the existing deck visual system unless this conflicts with current selectors.

- [ ] **Step 3: Reduce frame height only if grid fix is insufficient**

If `projector viewport fit` still fails, reduce vertical padding on `.deck-stage` and toolbar:

```css
.deck-toolbar {
  padding-block: 12px;
}

.deck-stage {
  padding-block: 12px;
}
```

- [ ] **Step 4: Verify 1280x720 no longer clips**

Run:

```sh
node scripts/audit-lecture-cuts.js
```

Expected:

```text
PASS projector render load - 87 frames loaded
PASS projector viewport fit - 87 slides checked
```

## Task 4: Replace Repetitive Abstract Visuals with Evidence Visuals

**Files:**
- Modify: `lecture-cuts/06-1-good-few-shot.html`
- Modify: `lecture-cuts/08-2-good-claude-md.html`
- Modify: `lecture-cuts/11-1-real-skill-folder.html`
- Modify: `lecture-cuts/21-1-final-artifact-structure.html`
- Modify: `lecture-cuts/21-6-handoff-template.html`
- Modify: `lecture-cuts/assets/style.css`

- [ ] **Step 1: Add shared evidence visual CSS**

Add reusable styles to `lecture-cuts/assets/style.css`:

```css
.evidence-window {
  width: min(100%, 620px);
  border: 2px solid var(--ink);
  border-radius: 8px;
  background: #fff;
  box-shadow: 8px 8px 0 rgba(17, 17, 17, 0.1);
  overflow: hidden;
}

.evidence-window header {
  display: flex;
  gap: 8px;
  align-items: center;
  padding: 10px 14px;
  border-bottom: 2px solid var(--ink);
  font-weight: 800;
}

.evidence-window pre {
  margin: 0;
  padding: 18px;
  max-height: 420px;
  overflow: auto;
  font-size: clamp(12px, 1.15vw, 16px);
  line-height: 1.45;
}

.evidence-dot {
  width: 10px;
  height: 10px;
  border: 2px solid var(--ink);
  border-radius: 50%;
  background: var(--accent);
}
```

- [ ] **Step 2: Convert `06-1-good-few-shot.html` to evidence window**

Replace the right-side visual with an `evidence-window` showing a compact good slide spec:

```html
<div class="evidence-window" aria-label="좋은 slide spec 예시">
  <header><span class="evidence-dot"></span>slide-spec.json</header>
  <pre><code>{
  "title": "검증은 통과문입니다",
  "message": "handoff 전 자동 검증을 통과합니다.",
  "visual": "pass/fail gate",
  "speakerNote": "검증은 장식이 아니라 기준입니다.",
  "evidence": ["scripts/verify-deck.js"]
}</code></pre>
</div>
```

- [ ] **Step 3: Convert `08-2-good-claude-md.html` to real rule excerpt**

Use `evidence-window` with:

```text
CLAUDE.md
1. Read source.md and slide-spec.json first.
2. Keep .note out of deck.html.
3. Show speakerNote in presenter-review.html.
4. Run node scripts/verify-deck.js before handoff.
```

- [ ] **Step 4: Convert `11-1-real-skill-folder.html` to file tree visual**

Use `evidence-window` with:

```text
skills/deck-builder/
  SKILL.md
  references/
  scripts/
  assets/
```

Add one visible caption:

```text
강의용 harness path입니다. Claude Code 공식 project skill은 .claude/skills/<name>/SKILL.md에 둡니다.
```

- [ ] **Step 5: Convert `21-1-final-artifact-structure.html` to distinguish paths**

Show two columns or two code blocks:

```text
Workshop artifact:
lecture-deck/skills/deck-builder/SKILL.md

Claude Code project skill:
.claude/skills/deck-builder/SKILL.md
```

- [ ] **Step 6: Convert `21-6-handoff-template.html` to concrete handoff output**

Use `evidence-window` with:

```text
## Current State
- deck renders 87 slides

## Verification
- node scripts/audit-lecture-cuts.js
- PASS desktop render load

## Remaining Risks
- 1280x720 projector fit

## Next Prompt
- Continue from this handoff and fix projector fit.
```

- [ ] **Step 7: Verify visual assets still load**

Run:

```sh
node scripts/audit-lecture-cuts.js
```

Expected:

```text
PASS desktop render images
PASS mobile render images
PASS local references
```

## Task 5: Resolve Standalone Navigation Drift

**Files:**
- Modify: `lecture-cuts/*.html` standalone nav blocks, or modify `scripts/audit-lecture-cuts.js` if standalone nav is intentionally non-canonical.

- [ ] **Step 1: Decide canonical behavior**

Use this decision:

```text
Canonical presentation order is lecture-cuts/assets/slides.js.
Standalone pages are secondary inspection pages.
```

- [ ] **Step 2: Replace misleading standalone Prev/Next links**

For standalone slide pages whose `Prev/Next` does not match `assets/slides.js`, replace the nav with:

```html
<nav class="nav"><a href="index.html">Index</a><a href="deck.html">Deck</a><a href="presenter-review.html">Review</a></nav>
```

This avoids promising a standalone order that differs from the real deck.

- [ ] **Step 3: Update audit expectation**

In `scripts/audit-lecture-cuts.js`, change `standalone nav order` from warning to a check that either:

```text
Prev/Next matches registry
```

or:

```text
nav only links to Index/Deck/Review
```

- [ ] **Step 4: Verify nav warnings are gone**

Run:

```sh
node scripts/audit-lecture-cuts.js
```

Expected:

```text
PASS standalone nav order
```

## Task 6: Add Source and Citation Layer Without Cluttering Slides

**Files:**
- Create: `lecture-cuts/sources.html`
- Modify: `lecture-cuts/index.html`
- Modify: `lecture-cuts/presenter-review.html`
- Modify: `lecture-cuts/assets/presenter-review.js`

- [ ] **Step 1: Create source appendix page**

Create `lecture-cuts/sources.html` with sections:

```html
<h1>Sources</h1>
<h2>HTML/CSS deck ecosystem</h2>
<ul>
  <li><a href="https://revealjs.com/">reveal.js</a></li>
  <li><a href="https://sli.dev/">Slidev</a></li>
  <li><a href="https://marp.app/">Marp</a></li>
</ul>
<h2>Claude Code</h2>
<ul>
  <li><a href="https://docs.anthropic.com/en/docs/claude-code/hooks">Hooks</a></li>
  <li><a href="https://docs.anthropic.com/en/docs/claude-code/sub-agents">Subagents</a></li>
</ul>
<h2>MCP</h2>
<ul>
  <li><a href="https://modelcontextprotocol.io/specification/draft/server/tools">MCP tools spec</a></li>
</ul>
```

- [ ] **Step 2: Link sources from index and presenter review**

Add `Sources` link to `lecture-cuts/index.html` and `lecture-cuts/presenter-review.html`.

- [ ] **Step 3: Add presenter-only source notes**

In `lecture-cuts/assets/presenter-review.js`, support an optional `sources` array on slide metadata and render it below the script body as link chips.

Use this format:

```js
sources: [
  { label: "Claude Code Hooks", url: "https://docs.anthropic.com/en/docs/claude-code/hooks" }
]
```

- [ ] **Step 4: Add source metadata for high-risk slides**

In `lecture-cuts/assets/slides.js`, add `sources` to:

```text
16-2-hook-command.html
17-hook-advanced.html
18-1-mcp-bridge.html
14-subagents.html
19-2-judge-checks.html
```

- [ ] **Step 5: Verify links**

Run:

```sh
node scripts/audit-lecture-cuts.js
```

Expected:

```text
PASS local references
```

External URL reachability is not required in the local audit.

## Task 7: Update Validation Report and Handoff

**Files:**
- Modify: `docs/audits/2026-05-25-lecture-materials-validation.md`
- Create or Modify: `HANDOFF.md` if a repo-level handoff exists, otherwise update `session-notes/2026-05-23-ai-harness-automation-workflow.md` with a short dated addendum.

- [ ] **Step 1: Mark resolved items**

In `docs/audits/2026-05-25-lecture-materials-validation.md`, add a top section:

```markdown
## Resolution Status

- Resolved: Hook schema example
- Resolved: MCP host/client/server distinction
- Resolved: 1280x720 projector fit
- Resolved: standalone navigation drift
- Improved: evidence visuals for key file/spec slides
- Remaining: final in-room projector smoke test
```

- [ ] **Step 2: Add final commands**

Include final command output summary:

```text
node scripts/audit-lecture-cuts.js
node lecture-deck/scripts/run-hook.js pre-handoff
```

- [ ] **Step 3: Add next-session prompt**

Add this prompt:

```text
Continue from docs/audits/2026-05-25-lecture-materials-validation.md and verify the 4-hour workshop deck on the actual projector resolution. Do not create a condensed deck unless explicitly requested.
```

- [ ] **Step 4: Final verification**

Run:

```sh
node scripts/audit-lecture-cuts.js
cd lecture-deck && node scripts/run-hook.js pre-handoff
```

Expected:

```text
No FAIL lines.
Known WARN lines must be documented in the audit report.
```

## Execution Order

1. Task 1: official correctness
2. Task 3: 1280x720 fit
3. Task 4: evidence visuals
4. Task 2: workshop flow notes
5. Task 5: navigation drift
6. Task 6: source appendix
7. Task 7: validation report and handoff

## Acceptance Criteria

- `lecture-cuts/16-2-hook-command.html` uses valid Claude Code hook schema.
- `lecture-cuts/17-hook-advanced.html` does not present "Prompt Hook" or "Agent Hook" as official event names.
- `lecture-cuts/18-1-mcp-bridge.html` distinguishes Host, MCP Client, MCP Server, tools, resources, and prompts.
- `lecture-cuts/21-1-final-artifact-structure.html` distinguishes workshop harness path from Claude Code official skill path.
- `node scripts/audit-lecture-cuts.js` has no FAIL lines.
- 1280x720 viewport fit is checked by the audit script.
- Presenter review resolves all 87 scripts.
- `lecture-deck/scripts/run-hook.js pre-handoff` still passes.
- The validation report records what was fixed and what still requires real-room verification.
