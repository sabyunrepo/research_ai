# Lecture Cuts Speaker Sync Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the 87-slide `lecture-cuts/` workshop deck and presenter scripts match as one teachable artifact.

**Architecture:** Keep `lecture-cuts/*.html` as the visible slide surface, `lecture-cuts/assets/slides.js` and `lecture-cuts/presenter-preview.html` as presenter script surfaces, and `lecture-cuts/slide-spec.json` as the generated reproduction contract. Do not hand-edit `slide-spec.json`; regenerate it after intentional slide or script changes.

**Tech Stack:** HTML/CSS slide files, Node.js validation scripts, generated JSON contract, Markdown handoff/planning docs.

---

## Current Review Evidence

- `lecture-cuts/` has 87 registered slides.
- `node scripts/export-lecture-cuts-contract.js --check-confidence` passes with 0 low-confidence extraction fields.
- `node scripts/validate-lecture-cuts-contract.js` passes, with `WARN source coverage - 80 slides rely on deck-global source appendix only`.
- `node scripts/audit-lecture-cuts.js` passes structural and render-load checks, but warns that 13 slides use presenter-preview fallback and render overflow warnings remain.
- A read-only speaker-depth scan found 43 inline scripts using generic template phrasing and 13 slides without inline speaker text. That means 56 of 87 slides need presenter-script review before real delivery.

## File Responsibilities

- Modify: `lecture-cuts/*.html` for visible title, subtitle, bullets, visual evidence, and `div.note`.
- Modify: `lecture-cuts/assets/slides.js` for inline presenter scripts and registry order.
- Modify: `lecture-cuts/presenter-preview.html` for section opener fallback scripts.
- Modify: `lecture-cuts/sources.html` and `docs/harness/lecture-cuts-source-map.json` when a factual claim or official-source reference changes.
- Generate: `lecture-cuts/slide-spec.json` and `docs/harness/lecture-cuts-content-inventory.md` using `node scripts/export-lecture-cuts-contract.js`.
- Modify: `lecture-cuts/HANDOFF.md` and `docs/harness/lecture-cuts-agent-handoff.md` with command evidence after each completed pass.

## Task 1: Add a Speaker Sync Audit

**Files:**
- Create: `scripts/audit-lecture-cuts-speaker-sync.js`
- Modify: `scripts/verify-lecture-cuts-harness.js`
- Modify: `lecture-cuts/HANDOFF.md`

- [ ] **Step 1: Create a focused audit script**

Create `scripts/audit-lecture-cuts-speaker-sync.js` that loads `lecture-cuts/assets/slides.js`, reads each registered HTML slide, and reports:

```text
FAIL when a registered slide has no resolved presenter script.
WARN when presenter text contains the generic phrase "이 슬라이드는 한 번에 설명하려던 내용을 짧은 증거 화면으로 나눈 것입니다".
WARN when a slide has source-sensitive terms such as Hook, MCP, Skill, Subagent, Evaluation, or CLAUDE.md but the presenter script does not mention the same teaching object.
PASS when all slides have specific presenter scripts and no generic script remains.
```

- [ ] **Step 2: Run the audit before wiring it into the gate**

Run:

```sh
node scripts/audit-lecture-cuts-speaker-sync.js
```

Expected current result:

```text
WARN generic presenter scripts remain
WARN presenter-preview fallback scripts remain
```

- [ ] **Step 3: Wire the audit into the unified gate as warning-only first**

Modify `scripts/verify-lecture-cuts-harness.js` so it runs:

```sh
node scripts/audit-lecture-cuts-speaker-sync.js
```

The first version should not block handoff for existing generic scripts. It should become blocking only after Tasks 2-5 remove the known generic presenter text.

- [ ] **Step 4: Record the new gate behavior**

Update `lecture-cuts/HANDOFF.md` with the command, exit code, and warning count.

## Task 2: Rewrite Section Opener Scripts

**Files:**
- Modify: `lecture-cuts/presenter-preview.html`
- Modify: `lecture-cuts/assets/slides.js` only if an opener is promoted from fallback to inline speaker
- Generate: `lecture-cuts/slide-spec.json`
- Generate: `docs/harness/lecture-cuts-content-inventory.md`

- [ ] **Step 1: Rewrite all 13 presenter-preview fallback scripts**

Cover these files:

```text
00-title.html
01-why-harness.html
03-layer-map.html
04-prompt-layer.html
05-persona.html
06-few-shot.html
08-claude-md.html
09-context-engineering.html
11-skill-structure.html
12-superpowers.html
14-subagents.html
15-agent-teams.html
20-loop-schedule.html
```

Each rewritten script must include:

```text
1. One sentence for why this section exists.
2. One sentence connecting it to the previous section.
3. One sentence previewing the next section or exercise.
4. No generic "이 슬라이드는..." template text.
```

- [ ] **Step 2: Check opener script resolution**

Run:

```sh
node scripts/audit-lecture-cuts.js
```

Expected:

```text
PASS presenter scripts - 87 review scripts resolved
```

- [ ] **Step 3: Regenerate the contract**

Run:

```sh
node scripts/export-lecture-cuts-contract.js
node scripts/validate-lecture-cuts-contract.js
```

Expected:

```text
PASS contract hashes
PASS contract speaker sources
```

## Task 3: Replace Generic Inline Presenter Scripts

**Files:**
- Modify: `lecture-cuts/assets/slides.js`
- Modify: targeted `lecture-cuts/*.html` files when the script exposes a mismatch with visible slide copy
- Generate: `lecture-cuts/slide-spec.json`
- Generate: `docs/harness/lecture-cuts-content-inventory.md`

- [ ] **Step 1: Process the generic scripts section-by-section**

Use this order to keep review small:

```text
오프닝 / 전체 지도
실패 패턴
Spec / Prompt
Context / Memory
Skills / Superpowers
Agents / Tools
Hooks / Verification
Final Workflow
```

For each slide, replace generic text with:

```text
1. What the audience should understand.
2. What exact visual, code sample, file tree, or bullet on the slide proves it.
3. What transition sentence moves to the next slide.
```

- [ ] **Step 2: Update slide HTML when the stronger script reveals a visual mismatch**

If the new presenter script teaches a claim not visible on the slide, update the matching `lecture-cuts/<slide>.html` title, subtitle, bullet, visual evidence, or `div.note` in the same change.

- [ ] **Step 3: Run the focused speaker scan after each section**

Run:

```sh
node scripts/audit-lecture-cuts-speaker-sync.js
```

Expected after each section:

```text
WARN count decreases for generic presenter scripts
No new FAIL entries
```

## Task 4: Strengthen Source Coupling for Technical Claims

**Files:**
- Modify: `lecture-cuts/sources.html`
- Modify: `docs/harness/lecture-cuts-source-map.json`
- Modify: targeted `lecture-cuts/*.html`
- Modify: `lecture-cuts/assets/slides.js`
- Generate: `lecture-cuts/slide-spec.json`

- [ ] **Step 1: Classify source-sensitive slides**

Prioritize slides that mention:

```text
Claude Code hooks
Claude Code skills
subagents
MCP tools/resources/prompts
evaluation gates
permission boundaries
```

- [ ] **Step 2: Promote source-sensitive claims to slide-level evidence**

For each changed claim, add slide-level source metadata instead of relying only on the deck-global appendix.

- [ ] **Step 3: Keep script and source wording aligned**

If the slide says "MCP is a tool layer" but the script explains Host / MCP Client / MCP Server / tools / resources / prompts, revise the slide so the simplification does not conflict with the script.

- [ ] **Step 4: Validate source coverage**

Run:

```sh
node scripts/validate-lecture-cuts-contract.js
```

Expected improvement:

```text
WARN source coverage count is lower than 80
```

## Task 5: Final Regeneration and Delivery QA

**Files:**
- Generate: `lecture-cuts/slide-spec.json`
- Generate: `docs/harness/lecture-cuts-content-inventory.md`
- Modify: `lecture-cuts/HANDOFF.md`
- Modify: `docs/harness/lecture-cuts-agent-handoff.md`

- [ ] **Step 1: Regenerate the reproduction contract**

Run:

```sh
node scripts/export-lecture-cuts-contract.js
```

Expected:

```text
Updated lecture-cuts/slide-spec.json
Updated docs/harness/lecture-cuts-content-inventory.md
```

- [ ] **Step 2: Run the full validation chain**

Run:

```sh
node scripts/export-lecture-cuts-contract.js --check-confidence
node scripts/validate-lecture-cuts-contract.js
node scripts/audit-lecture-cuts-speaker-sync.js
node scripts/audit-lecture-cuts.js
node scripts/verify-lecture-cuts-harness.js
```

Expected:

```text
PASS extraction confidence
PASS reproduction contract
PASS presenter scripts
PASS unified harness gate
No generic presenter script warnings
```

- [ ] **Step 3: Update handoff evidence**

Update `lecture-cuts/HANDOFF.md` and `docs/harness/lecture-cuts-agent-handoff.md` with:

```text
changed slide sections
speaker sync audit result
source coverage warning count
render overflow warning count
commands run with exit codes
remaining real-projector risks
next prompt
```

## Self-Review

- Spec coverage: The plan covers script/deck mismatch detection, script rewrite, slide/script co-editing, source metadata, contract regeneration, and final verification.
- Placeholder scan: No placeholder work remains; every task names concrete files, commands, and expected outcomes.
- Boundary check: The plan does not ask workers to hand-edit generated `slide-spec.json`; it preserves the existing exporter/validator flow.
