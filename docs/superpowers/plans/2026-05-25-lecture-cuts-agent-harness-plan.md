# Topic-To-Deck Agent Harness Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a reusable workflow that can take a new topic or raw material through research, source grounding, storyline design, slide generation, visual polish, verification, and handoff, producing a new lecture deck at the same quality bar as the current `lecture-cuts/` result.

**Architecture:** Treat `lecture-cuts/` as the golden reference deck, not merely the current deck to protect. First extract its structure, quality rules, source habits, visual patterns, and verification gates into reusable contracts. Then create a generic `deck-harness/` workflow that can generate a separate deck for any new topic while checking against the same quality bar. `lecture-deck/` remains the small sample harness; `lecture-cuts/` becomes the benchmark and regression fixture.

**Tech Stack:** Static HTML/CSS/JS, Node.js generation and validation scripts, headless Chrome audit, Markdown research dossiers, JSON slide contracts, local agent/skill instructions, evidence maps, handoff files.

---

## Current Evidence

- `lecture-cuts/assets/slides.js` is the canonical slide order and metadata registry.
- `lecture-cuts/` currently has 87 registered slides.
- `scripts/audit-lecture-cuts.js` is the current validation entrypoint.
- `lecture-deck/` already contains the reusable sample pattern: `source.md`, `slide-spec.json`, `few-shots.md`, `agents/*.md`, `skills/deck-builder/SKILL.md`, `hooks/verify-deck.json`, `scripts/run-hook.js`, `scripts/verify-deck.js`, `HANDOFF.md`.
- Latest project decision: `lecture-cuts/` is the canonical 4-hour workshop deck; `lecture-deck/` is the sample HTML/CSS automation harness.
- Current unresolved gaps: `lecture-cuts/` has no source/spec contract, speaker notes are split between `slides.js` and `presenter-preview.html`, glossary is duplicated in two JS files, source links are split between `sources.html` and per-slide metadata, and the audit does not check spec-to-output reproducibility.

## Corrected Target

The final workflow must support this end-to-end path for a different topic:

```text
01 Topic Intake
02 Research Dossier
03 Claim / Source Map
04 Audience + Workshop Goal
05 Storyline / Section Plan
06 Slide Spec
07 Speaker Script
08 Visual System + Asset Plan
09 HTML/CSS Deck Build
10 Presenter Review
11 Verification Gates
12 Handoff + Next Prompt
```

The current `lecture-cuts/` deck is used to define the quality bar:

```text
- Korean-first copy for general learners
- one clear message per slide
- speaker notes separated from projector deck
- glossary for difficult English or developer terms
- source links for factual or official-API claims
- browser-rendered HTML/CSS deck
- 1280x720 projector fit
- desktop/mobile audit
- presenter-review view
- final handoff with verification evidence and remaining risk
```

## Contract Hierarchy

The reusable workflow has one source-of-truth chain:

```text
topic-intake.md
  -> research-dossier.md
  -> claim-source-map.json
  -> section-plan.json
  -> slide-spec.json
  -> generated HTML/CSS/JS deck
  -> presenter-review.html
  -> HANDOFF.md
```

Rules:

```text
- claim-source-map.json is the only place for source URL, source type, checked date, use location, and confidence.
- slide-spec.json references evidence only through evidenceClaimIds.
- section-plan.json owns learning objectives and pacing.
- glossary.json owns term definitions and matching rules.
- job-manifest.json records stage owner, input hash, output hash, status, and evidence path.
- HANDOFF.md is a reproduction contract, not a loose status memo.
```

## Target File Structure

Create or update these files:

```text
deck-harness/
  README.md
  workflow.md
  quality-rubric.md
  topic-intake.template.md
  research-dossier.template.md
  claim-source-map.schema.json
  section-plan.schema.json
  slide-spec.schema.json
  glossary.schema.json
  job-manifest.schema.json
  visual-system.template.md
  handoff.template.md
  evaluation-template.md

  allowlists/
    overflow-allowlist.json

  agents/
    research-agent.md
    source-grounding-agent.md
    curriculum-architect-agent.md
    slide-spec-agent.md
    visual-design-agent.md
    deck-builder-agent.md
    verification-agent.md
    handoff-agent.md

  skills/
    topic-intake/SKILL.md
    research-dossier/SKILL.md
    slide-spec-builder/SKILL.md
    html-css-deck-builder/SKILL.md
    deck-quality-gate/SKILL.md
    handoff-maintainer/SKILL.md

  templates/
    deck.html
    presenter-review.html
    assets/style.css
    assets/deck.js
    assets/presenter-review.js

  scripts/
    scaffold-deck.js
    build-deck-from-spec.js
    validate-deck-contract.js
    verify-deck-quality.js

lecture-cuts/
  AGENTS.md
  HANDOFF.md
  source.md
  slide-spec.json
  few-shots.md

  agents/
    content-inventory-agent.md
    source-grounding-agent.md
    pedagogy-flow-agent.md
    visual-accessibility-agent.md
    harness-verification-agent.md
    harness-architect-agent.md

  skills/
    deck-builder/SKILL.md
    source-grounding/SKILL.md
    verification-gate/SKILL.md
    handoff-maintainer/SKILL.md

  hooks/
    lecture-cuts-contract.json
    lecture-cuts-audit.json
    lecture-cuts-handoff.json

docs/harness/
  codex-session-inventory.md
  codex-session-source-map.json
  codex-session-decision-log.md
  topic-to-deck-workflow.md
  deck-quality-rubric.md
  topic-to-deck-evaluation-template.md
  lecture-cuts-content-inventory.md
  lecture-cuts-source-map.json
  lecture-cuts-agent-handoff.md
  lecture-cuts-reproduction-contract.md

scripts/
  collect-codex-session-corpus.js
  export-lecture-cuts-contract.js
  validate-lecture-cuts-contract.js
  run-lecture-cuts-hook.js
  verify-lecture-cuts-harness.js

generated-decks/
  sample-topic-fixture/
  sample-topic-live-research/
```

Modify these existing files only when the relevant task reaches them:

```text
lecture-cuts/assets/deck.js
lecture-cuts/assets/presenter-review.js
lecture-cuts/assets/slides.js
lecture-cuts/assets/style.css
scripts/audit-lecture-cuts.js
```

## Agent Work Split

Use these as the subagent axes during execution. Each subagent writes findings into `docs/harness/lecture-cuts-agent-handoff.md` for golden-reference extraction, and later writes new-topic findings into the generated deck's own `HANDOFF.md`.

```text
research-agent
  Reads: user topic, provided files, official docs, current sources when needed, Codex session decision log when building this project's reusable harness
  Produces: research dossier, source list, date-sensitive claim list

source-grounding-agent
  Reads: research dossier, official docs, claim map, Codex session source map when conversation-derived decisions are used
  Produces: claim/source map, weak-source list, slide-visible vs speaker-note-only recommendation

curriculum-architect-agent
  Reads: topic intake, audience, workshop length, research dossier, Codex session decision log for workshop-quality requirements
  Produces: section plan, learning objectives, pacing map

slide-spec-agent
  Reads: section plan, claim/source map, quality rubric
  Produces: slide-spec.json with title, message, bullets, visual intent, speaker note, evidenceClaimIds

visual-design-agent
  Reads: slide-spec.json, visual-system.template.md, golden reference visuals
  Produces: visual plan, reusable CSS visual classes, asset needs

deck-builder-agent
  Reads: slide-spec.json, templates, visual plan
  Produces: HTML/CSS/JS deck files

verification-agent
  Reads: generated deck, source map, scripts
  Produces: syntax/render/source/presenter/handoff gate report

handoff-agent
  Reads: all outputs
  Produces: final HANDOFF.md, next prompt, remaining risk list

content-inventory-agent
  Reads: lecture-cuts/assets/slides.js, lecture-cuts/*.html, presenter-preview.html
  Produces: slide list, section map, speaker-note map, content hashes

source-grounding-agent
  Reads: lecture-cuts/sources.html, slide metadata sources, docs/audits/*
  Produces: claim/source map, weak-source list, date-sensitive source list

pedagogy-flow-agent
  Reads: lecture-cuts/assets/slides.js, docs/audits/*, lecture-plan.html
  Produces: order/duplication/workshop timing findings

visual-accessibility-agent
  Reads: lecture-cuts/*.html, lecture-cuts/assets/style.css, audit output
  Produces: overflow, readability, glossary, visual fatigue findings

harness-verification-agent
  Reads: scripts/audit-lecture-cuts.js, lecture-deck/scripts/*
  Produces: verification gate matrix and missing gates

harness-architect-agent
  Reads: all agent outputs, target file structure, Codex session inventory, and Codex session decision log
  Produces: final integration recommendations for skills, hooks, scripts
```

All agent reports must use this exact shape:

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

```text
PASS: the agent's owned contract is complete and verified.
WARN: the output is usable but contains non-blocking risk with an explicit owner.
FAIL: the output is incomplete, unverified, source-weak, or cannot be reproduced.

Any FAIL blocks handoff.
Any WARN without Required follow-up blocks handoff.
Any report without Evidence path blocks handoff.
```

## Task 0: Freeze Current Deck State

**Files:**
- Read: repository git status
- No source file edits in this task

- [ ] **Step 1: Confirm current uncommitted deck edits**

Run:

```sh
git status --short
```

Expected: current `lecture-cuts/` copy, glossary, and slide polish edits appear as modified files. Do not start harness implementation until the user decides whether to commit these edits.

- [ ] **Step 2: Commit current visible deck state before harness work**

After user approval, run:

```sh
git add lecture-cuts docs/audits scripts/audit-lecture-cuts.js lecture-plan.html
git commit -m "Improve lecture workshop deck review experience"
```

Expected: a clean baseline commit for the current visible deck before new harness files are added.

## Task 0A: Collect Codex Conversation Session Corpus

**Purpose:** Include the project's Codex conversation sessions as first-class source material, not just the current repo files. This prevents the harness from losing decisions, rejected options, quality failures, and user preferences that only exist in prior Codex conversations.

**Files:**
- Create: `scripts/collect-codex-session-corpus.js`
- Create: `docs/harness/codex-session-inventory.md`
- Create: `docs/harness/codex-session-source-map.json`
- Create: `docs/harness/codex-session-decision-log.md`
- Read: `/Users/sabyun/.codex/sessions/**/rollout-*.jsonl`
- Read: `session-notes/*.md`
- Read: `/Users/sabyun/.codex/memories/MEMORY.md`

- [ ] **Step 1: Discover candidate Codex sessions**

Create `scripts/collect-codex-session-corpus.js` that:

```text
1. Searches /Users/sabyun/.codex/sessions for jsonl files containing /Users/sabyun/goinfre/research_ai.
2. Excludes subagent-only sessions unless their parent session is this project and their output was used as evidence.
3. Groups files by top-level thread id when session metadata exposes it.
4. Writes candidate sessions to docs/harness/codex-session-inventory.md.
5. Marks each candidate as included, excluded-subagent, duplicate, or unavailable.
```

Run:

```sh
node scripts/collect-codex-session-corpus.js --discover
```

Expected:

```text
Wrote docs/harness/codex-session-inventory.md
Top-level sessions discovered: 4
Subagent sessions discovered: <count>
```

If the discovered top-level count is not 4, the inventory must list the mismatch and require manual selection before proceeding.

- [ ] **Step 2: Extract session-level handoff summaries**

For each included top-level Codex conversation session, write one section in `docs/harness/codex-session-inventory.md`:

```text
## Session <n>: <thread id or filename>

Status: included|excluded|needs-review
Date:
Raw transcript path:
Related commits:

### 발견
### 수행
### 판단
### 미해결
### 근거
```

Rules:

```text
- The current session is included as Session 4 or the latest session.
- Prior sessions are not trusted blindly; decisions must cite transcript path or repo artifact path.
- If a session only produced a repo artifact, cite the artifact and mark the raw transcript as supporting evidence.
- If a session is inaccessible, write unavailable with the missing path and impact.
```

- [ ] **Step 3: Create session source map**

Create `docs/harness/codex-session-source-map.json`:

```json
{
  "sessions": [
    {
      "id": "019e54d5-629f-7b80-89ac-a80c628987af",
      "status": "included",
      "rawPath": "/Users/sabyun/.codex/sessions/2026/05/23/rollout-...",
      "summaryPath": "docs/harness/codex-session-inventory.md#session-1",
      "repoArtifacts": [
        "lecture-deck/HANDOFF.md",
        "docs/harness/html-css-deck-automation-harness-v1.md"
      ],
      "decisionsExtracted": ["decision-001"],
      "risksExtracted": ["risk-001"]
    }
  ]
}
```

This file must be used by later source-grounding, skill, verification, and handoff agents as a source registry for conversation-derived decisions.

- [ ] **Step 4: Create decision log**

Create `docs/harness/codex-session-decision-log.md` with:

```text
# Codex Session Decision Log

## Stable Decisions
## Superseded Decisions
## Quality Failures Observed
## User Preferences
## Workflow Requirements
## Open Questions
```

Rules:

```text
- If two sessions conflict, the newer session wins only when it is explicitly about the same requirement.
- Superseded decisions stay in the log with the reason they were superseded.
- User preferences must distinguish "asked once for this deck" from "reusable workflow rule".
```

- [ ] **Step 5: Wire session corpus into later agents**

Update the later agent and skill tasks so they require these reads before generating the generic harness:

```text
docs/harness/codex-session-inventory.md
docs/harness/codex-session-source-map.json
docs/harness/codex-session-decision-log.md
session-notes/2026-05-23-ai-harness-automation-workflow.md
```

Expected rule:

```text
No generic deck-harness agent, skill, schema, or verification gate is complete until it has checked the Codex session decision log for applicable requirements.
```

## Task 1: Export The Golden Reference Deck Contract

**Purpose:** Capture the current `lecture-cuts/` output as the benchmark that future topic decks must match or intentionally diverge from. This task does not create a new deck yet.

**Files:**
- Create: `scripts/export-lecture-cuts-contract.js`
- Create: `lecture-cuts/slide-spec.json`
- Create: `docs/harness/lecture-cuts-content-inventory.md`
- Create: `docs/harness/lecture-cuts-source-map.json`

- [ ] **Step 1: Write the contract exporter**

Create `scripts/export-lecture-cuts-contract.js` that:

```text
1. Loads lecture-cuts/assets/slides.js in a vm context.
2. Reads each registered slide HTML file.
3. Extracts h2/title/subtitle/bullets/note presence.
4. Resolves section metadata from the registered slide object.
5. Resolves speaker source: inline speaker, fallback presenter-preview, or missing.
6. Computes sha256 for each slide HTML file.
7. Records extraction provenance for each field: html, slides-registry, presenter-preview, sources-page, or fallback.
8. Records extraction confidence for each field: high, medium, or low.
9. Writes lecture-cuts/slide-spec.json.
10. Writes docs/harness/lecture-cuts-content-inventory.md.
11. Writes docs/harness/lecture-cuts-source-map.json.
```

The generated `slide-spec.json` item shape must be:

```json
{
  "id": "07-1-reasoning-output-pattern",
  "file": "07-1-reasoning-output-pattern.html",
  "section": "02 Spec / Prompt",
  "title": "결과 기준을 선명하게 요구합니다",
  "subtitle": "무엇을 만들고, 무엇으로 확인하고, 어떻게 보고할지를 정해 줍니다.",
  "bullets": [
    "최종 결과물의 모양을 먼저 정합니다.",
    "중간 확인 지점과 통과 기준을 적습니다.",
    "마지막 보고에 증거와 남은 위험을 포함시킵니다."
  ],
  "speakerSource": "inline",
  "fieldSources": {
    "title": "html",
    "bullets": "html",
    "speakerNote": "slides-registry",
    "sources": "sources-page"
  },
  "fieldConfidence": {
    "title": "high",
    "bullets": "high",
    "speakerNote": "medium",
    "sources": "medium"
  },
  "sources": [],
  "contentHash": "sha256:<computed>",
  "sourceFile": "lecture-cuts/07-1-reasoning-output-pattern.html"
}
```

- [ ] **Step 2: Run exporter**

Run:

```sh
node scripts/export-lecture-cuts-contract.js
```

Expected:

```text
Wrote lecture-cuts/slide-spec.json
Wrote docs/harness/lecture-cuts-content-inventory.md
Wrote docs/harness/lecture-cuts-source-map.json
Slides exported: 87
```

- [ ] **Step 3: Review generated inventory**

Check:

```sh
rg -n "Slides exported|speakerSource|contentHash|missing" docs/harness/lecture-cuts-content-inventory.md lecture-cuts/slide-spec.json
```

Expected: 87 slides, every slide has a `contentHash`, and speaker gaps are explicitly marked instead of hidden.

- [ ] **Step 4: Fail low-confidence extraction without review note**

Run:

```sh
node scripts/export-lecture-cuts-contract.js --check-confidence
```

Expected:

```text
PASS extraction confidence
```

If any field is `low`, the exporter must write the exact slide id and field name to `docs/harness/lecture-cuts-content-inventory.md`, and the handoff must list whether the field was manually reviewed or remains a blocking risk.

## Task 1A: Create The Generic Topic-To-Deck Harness Skeleton

**Purpose:** Move from "current deck reproducibility" to "new topic generation workflow".

**Files:**
- Create: `deck-harness/README.md`
- Create: `deck-harness/workflow.md`
- Create: `deck-harness/quality-rubric.md`
- Create: `deck-harness/topic-intake.template.md`
- Create: `deck-harness/research-dossier.template.md`
- Create: `deck-harness/claim-source-map.schema.json`
- Create: `deck-harness/section-plan.schema.json`
- Create: `deck-harness/slide-spec.schema.json`
- Create: `deck-harness/glossary.schema.json`
- Create: `deck-harness/job-manifest.schema.json`
- Create: `deck-harness/visual-system.template.md`
- Create: `deck-harness/handoff.template.md`
- Create: `deck-harness/evaluation-template.md`
- Create: `deck-harness/allowlists/overflow-allowlist.json`
- Create: `docs/harness/topic-to-deck-workflow.md`
- Create: `docs/harness/deck-quality-rubric.md`
- Create: `docs/harness/topic-to-deck-evaluation-template.md`
- Read: `docs/harness/codex-session-inventory.md`
- Read: `docs/harness/codex-session-source-map.json`
- Read: `docs/harness/codex-session-decision-log.md`

- [ ] **Step 1: Define the workflow document**

Create `deck-harness/workflow.md` with this exact top-level flow:

```text
# Topic-To-Deck Workflow

01 Topic Intake
02 Research Dossier
03 Claim / Source Map
04 Audience + Workshop Goal
05 Storyline / Section Plan
06 Slide Spec
07 Speaker Script
08 Visual System + Asset Plan
09 HTML/CSS Deck Build
10 Presenter Review
11 Verification Gates
12 Handoff + Next Prompt
```

Add a rule:

```text
The workflow must not start slide HTML until research-dossier.md, claim-source-map.json, section-plan.json, glossary.json, job-manifest.json, and slide-spec.json exist.
```

- [ ] **Step 2: Define the quality rubric**

Create `deck-harness/quality-rubric.md` and mirror it to `docs/harness/deck-quality-rubric.md`.

It must include these quality gates:

```text
Content:
- One clear message per slide.
- Every factual or product/API claim has a source.
- Date-sensitive claims show the checked date.
- Korean-first copy unless the source phrase is important.
- Beginner-facing terminology is explained through glossary or speaker note.

Pedagogy:
- Sections have learning objectives.
- Each practice follows explanation.
- Duplicated explanation is merged or intentionally marked as reinforcement.
- The deck fits the declared timebox.

Visual:
- 1280x720 projector fit passes.
- No text overlap.
- Repeated abstract visuals are balanced with concrete artifacts.
- Presenter view separates screen text and speaker script.

Verification:
- source map validates.
- slide spec validates.
- slide spec references claim ids only; source URL, checked date, source type, confidence, and use location live only in claim-source-map.json.
- all evidenceClaimIds resolve to claim-source-map.json.
- all glossaryTerms resolve to glossary registry.
- rendered deck and presenter review match slide-spec.json text, speaker notes, and evidence ids.
- local links/assets validate.
- browser render validates.
- final handoff includes commands, evidence, and remaining risks.
```

- [ ] **Step 3: Create topic intake template**

Create `deck-harness/topic-intake.template.md`:

```text
# Topic Intake

## Topic
## Audience
## Timebox
## Desired Output
## Must Cover
## Must Avoid
## Prior Materials
## Source Preferences
## Visual Style Preference
## Success Criteria
```

- [ ] **Step 4: Create research dossier template**

Create `deck-harness/research-dossier.template.md`:

```text
# Research Dossier

## Executive Summary
## Core Concepts
## Official Sources
## Supporting Sources
## Claims To Use
## Claims To Avoid
## Date-Sensitive Notes
## Open Questions
## Suggested Examples
## Suggested Analogies
```

- [ ] **Step 5: Create claim-source map schema**

Create `deck-harness/claim-source-map.schema.json` requiring:

```json
{
  "topic": "string",
  "checkedDate": "YYYY-MM-DD",
  "claims": [
    {
      "id": "claim-001",
      "claim": "string",
      "sourceType": "official|supporting|local|inference",
      "source": "string",
      "checkedDate": "YYYY-MM-DD",
      "useLocation": "slide|speaker-note|appendix|avoid",
      "confidence": "high|medium|low",
      "notes": "string"
    }
  ],
  "claimsToAvoid": [
    {
      "id": "avoid-001",
      "claim": "string",
      "reason": "string",
      "source": "string"
    }
  ]
}
```

Rules:

```text
- claims[].id must be unique.
- claims[].checkedDate is required for official, supporting, and local claims.
- inference claims must include notes explaining the reasoning basis.
- useLocation=avoid claims cannot be referenced by slide-spec.json.
- claimsToAvoid must be non-empty, or the file must contain "claimsToAvoidReviewed": true.
```

- [ ] **Step 6: Create section plan schema**

Create `deck-harness/section-plan.schema.json` requiring:

```json
{
  "timeboxMinutes": 240,
  "sections": [
    {
      "id": "section-01",
      "title": "string",
      "learningObjective": "string",
      "estimatedMinutes": 30,
      "practice": "string",
      "slides": ["slide-001"]
    }
  ]
}
```

Rules:

```text
- sections[].learningObjective is required.
- sum(sections[].estimatedMinutes) must not exceed timeboxMinutes.
- every slide id in section-plan must exist in slide-spec.json after slide-spec generation.
```

- [ ] **Step 7: Create slide spec schema**

Create `deck-harness/slide-spec.schema.json` requiring:

```json
{
  "slides": [
    {
      "id": "string",
      "section": "string",
      "sectionObjective": "string",
      "estimatedMinutes": 3,
      "title": "string",
      "message": "string",
      "bullets": ["string"],
      "visualIntent": "string",
      "speakerNote": "string",
      "evidenceClaimIds": ["claim-001"],
      "glossaryTerms": ["string"],
      "qualityChecks": ["string"]
    }
  ]
}
```

Rules:

```text
- slide-spec.json must not contain source URLs, checkedDate, sourceType, confidence, or source summaries.
- evidenceClaimIds is the only bridge from slide-spec.json to claim-source-map.json.
- every slide must have title, message, visualIntent, speakerNote, sectionObjective, and estimatedMinutes.
- total slide estimatedMinutes must not exceed declared timebox.
```

- [ ] **Step 8: Create glossary schema**

Create `deck-harness/glossary.schema.json` requiring:

```json
{
  "terms": [
    {
      "term": "API",
      "aliases": ["Application Programming Interface"],
      "definition": "프로그램끼리 정해진 방식으로 기능이나 데이터를 주고받는 연결 규칙입니다.",
      "match": "whole-word|exact-phrase"
    }
  ]
}
```

Rules:

```text
- partial matching is forbidden; "PR" must not match "pressure".
- deck and presenter review must load the same glossary registry.
- any slide-spec glossaryTerms item missing from glossary.json is a FAIL.
```

- [ ] **Step 9: Create job manifest schema**

Create `deck-harness/job-manifest.schema.json` requiring:

```json
{
  "jobId": "string",
  "topicSlug": "string",
  "createdAt": "YYYY-MM-DDTHH:mm:ssZ",
  "stages": [
    {
      "name": "research-dossier",
      "owner": "research-agent",
      "inputs": ["topic-intake.md"],
      "outputs": ["research-dossier.md"],
      "inputHash": "sha256:<hash>",
      "outputHash": "sha256:<hash>",
      "status": "PASS|WARN|FAIL",
      "evidencePath": "HANDOFF.md#verification"
    }
  ]
}
```

Rules:

```text
- every workflow stage writes one manifest entry.
- status=FAIL blocks downstream generation.
- if an input changes, later stage outputHash values are stale until regenerated.
```

- [ ] **Step 10: Create handoff and evaluation templates**

Create `deck-harness/handoff.template.md` with:

```text
# Deck Handoff

## Current State
## Inputs
## Evidence Map Status
## Source Coverage
## Generated Artifacts
## Quality Gate Artifacts
## Verification
## Agent Findings
## Blocked Risks
## Non-Blocking Risks
## Next Prompt
```

Create `deck-harness/evaluation-template.md` and mirror it to `docs/harness/topic-to-deck-evaluation-template.md`:

```text
# Evaluation Log

## Command
## Exit Code
## Summarized Output
## Artifact Path
## Viewport
## Checked Date
## Unresolved Count
## PASS/WARN/FAIL
```

Create `deck-harness/allowlists/overflow-allowlist.json`:

```json
{
  "items": []
}
```

Overflow allowlist items must contain slide id, selector, reason, owner, and expiry date. Expired or selector-missing allowlist entries are FAIL.

## Task 1B: Add Generic Topic-To-Deck Agents

**Files:**
- Create: `deck-harness/agents/research-agent.md`
- Create: `deck-harness/agents/source-grounding-agent.md`
- Create: `deck-harness/agents/curriculum-architect-agent.md`
- Create: `deck-harness/agents/slide-spec-agent.md`
- Create: `deck-harness/agents/visual-design-agent.md`
- Create: `deck-harness/agents/deck-builder-agent.md`
- Create: `deck-harness/agents/verification-agent.md`
- Create: `deck-harness/agents/handoff-agent.md`
- Read: `docs/harness/codex-session-decision-log.md`

- [ ] **Step 1: Create shared agent contract**

Every `deck-harness/agents/*.md` file must include these headings:

```text
# <Agent Name>

## Role
## Reads Exactly
## Writes Exactly
## Must Pass If
## Must Fail If
## Evidence Rules
## Report Format
```

Every agent must write a report section with the status block defined in "Agent Work Split". The verification agent is a reviewer of other agents' outputs; it must not repair deck-builder output silently.

Each agent must include this rule:

```text
Before writing final output, check docs/harness/codex-session-decision-log.md for applicable stable decisions, superseded decisions, and quality failures. Cite any session-derived rule in Evidence Rules.
```

- [ ] **Step 2: Create research agent**

`research-agent.md` must own:

```text
- gathering official and supporting sources
- summarizing concepts in beginner-friendly Korean
- listing date-sensitive claims
- proposing examples and analogies
- writing research-dossier.md
```

It must fail if fewer than two official sources are available for a technical/product/API topic and no explicit "official source unavailable" note is written.

- [ ] **Step 3: Create source grounding agent**

`source-grounding-agent.md` must own:

```text
- converting research notes into claim-source-map.json
- marking official/supporting/local/inference source types
- deciding slide vs speaker-note vs appendix placement
- flagging weak claims before slide writing
```

It must fail if any slide-visible claim lacks `sourceType`, `source`, `checkedDate`, `useLocation`, and `confidence`.

- [ ] **Step 4: Create curriculum architect agent**

`curriculum-architect-agent.md` must own:

```text
- audience and timebox fit
- section learning objectives
- practice placement
- sequence and repetition control
- workshop pacing
```

It must fail if section objectives are missing or total estimated minutes exceed the declared workshop timebox.

- [ ] **Step 5: Create slide spec agent**

`slide-spec-agent.md` must own:

```text
- slide-spec.json
- one message per slide
- mapping each slide to claim ids
- glossary terms
- speaker note intent
```

It must fail if slide-spec.json duplicates source URLs or date fields instead of referencing `evidenceClaimIds`.

- [ ] **Step 6: Create visual design agent**

`visual-design-agent.md` must own:

```text
- visual system plan
- concrete artifact visuals
- image/diagram needs
- avoiding repeated abstract cards
- 1280x720 readability
```

- [ ] **Step 7: Create deck builder, verification, and handoff agents**

Create the remaining three agents with these ownership boundaries:

```text
deck-builder-agent:
  HTML/CSS/JS deck generation from slide-spec.json and templates
  Must fail if any visible slide text, speakerNote id, glossary term, or evidenceClaimId in slide-spec.json is not represented in the generated deck or presenter review.

verification-agent:
  syntax, source map, browser render, presenter review, glossary, handoff gates
  Must fail on schema errors, unresolved evidenceClaimIds, native browser tooltip leakage, partial glossary matching, text overflow outside an active allowlist, and handoff template gaps.

handoff-agent:
  final HANDOFF.md, next prompt, remaining risk, changed files, command evidence
  Must fail if the final handoff cannot reproduce the deck from inputs and commands.
```

## Task 1C: Add Generic Topic-To-Deck Skills

**Files:**
- Create: `deck-harness/skills/topic-intake/SKILL.md`
- Create: `deck-harness/skills/research-dossier/SKILL.md`
- Create: `deck-harness/skills/slide-spec-builder/SKILL.md`
- Create: `deck-harness/skills/html-css-deck-builder/SKILL.md`
- Create: `deck-harness/skills/deck-quality-gate/SKILL.md`
- Create: `deck-harness/skills/handoff-maintainer/SKILL.md`
- Read: `docs/harness/codex-session-decision-log.md`

- [ ] **Step 1: Create shared skill skeleton**

Every `deck-harness/skills/*/SKILL.md` must use this shape:

```text
---
name: <skill-name>
description: Use when <triggering condition only, no workflow summary>
---

# <Skill Name>

## When to Use
## Inputs
## Outputs
## Procedure
## Quality Bar
## Verification
## Stop Conditions
```

Rules:

```text
- frontmatter description starts with "Use when".
- description describes the trigger, not the procedure.
- Outputs names exact file paths.
- Verification contains commands or concrete checks, not references to another section only.
- Stop Conditions lists when the agent must stop and ask or mark FAIL.
- Procedure includes a check of docs/harness/codex-session-decision-log.md when the skill is used for this project harness.
```

- [ ] **Step 2: Create topic intake skill**

This skill must turn user input into `topic-intake.md` and ask for missing critical information only when it cannot be inferred safely.

It must require these minimum values:

```text
- Topic
- Audience
- Timebox
- Desired Output
- Must Cover
- Must Avoid, or explicit "not specified"
- Source Preferences, or explicit "official sources first"
- Success Criteria
```

Stop Conditions:

```text
- audience is unknown and cannot be inferred from the request.
- timebox is missing and the user asked for a timed workshop.
- success criteria are missing for a paid/client-facing deck.
```

- [ ] **Step 3: Create research dossier skill**

This skill must require:

```text
- official sources first
- checked dates for current/tool/API claims
- source summary in Korean
- claims-to-use and claims-to-avoid sections
```

It must output `research-dossier.md` and a raw source list. For technical/product/API topics, it must use at least two official sources unless the dossier explicitly records why official sources are unavailable. `Claims To Avoid` must be non-empty or contain `Reviewed: none found`.

- [ ] **Step 4: Create slide spec builder skill**

This skill must require:

```text
- research-dossier.md
- claim-source-map.json
- section-plan.json
- quality-rubric.md
```

before writing `slide-spec.json`.

It must run:

```sh
node deck-harness/scripts/validate-deck-contract.js <deck>
```

Expected before build: FAIL if slide-spec.json is not yet present; PASS after source map, section plan, glossary, and slide spec validate.

- [ ] **Step 5: Create HTML/CSS deck builder skill**

This skill must require:

```text
- no slide HTML before slide-spec.json exists
- preserve screen/speaker separation
- build presenter-review with evidence
- use glossary for difficult terms
- run quality gate before handoff
```

It must output exactly:

```text
generated-decks/<slug>/deck.html
generated-decks/<slug>/presenter-review.html
generated-decks/<slug>/assets/slides.js
generated-decks/<slug>/assets/style.css
generated-decks/<slug>/assets/deck.js
generated-decks/<slug>/assets/presenter-review.js
generated-decks/<slug>/slides/<slide-id>.html
```

- [ ] **Step 6: Create quality gate and handoff skills**

`deck-quality-gate` must define these mandatory commands and pass/fail interpretation:

```sh
node deck-harness/scripts/validate-deck-contract.js <deck>
node deck-harness/scripts/verify-deck-quality.js <deck>
```

PASS requires:

```text
- schemas validate.
- every evidenceClaimId resolves.
- every glossaryTerms item resolves.
- rendered screen text matches slide-spec.json.
- presenter review shows speakerNote and evidenceClaimIds.
- no native title tooltip appears for glossary terms.
- no partial glossary match appears.
- no desktop/mobile overflow exists unless active allowlist entry is valid.
- HANDOFF.md contains current command evidence and non-empty risk sections.
```

`handoff-maintainer` must define:

```text
Current State
Inputs
Evidence Map Status
Source Coverage
Generated Artifacts
Quality Gate Artifacts
Verification
Agent Findings
Blocked Risks
Non-Blocking Risks
Next Prompt
```

Stop Conditions:

```text
- HANDOFF.md Verification does not match the last executed verification commands.
- Remaining risk sections are empty.
- any generated artifact listed in the handoff does not exist.
- any PASS claim lacks command output or artifact path.
```

## Task 1D: Add Generic Deck Generation Scripts

**Files:**
- Create: `deck-harness/scripts/scaffold-deck.js`
- Create: `deck-harness/scripts/build-deck-from-spec.js`
- Create: `deck-harness/scripts/validate-deck-contract.js`
- Create: `deck-harness/scripts/verify-deck-quality.js`
- Create: `deck-harness/templates/deck.html`
- Create: `deck-harness/templates/presenter-review.html`
- Create: `deck-harness/templates/assets/style.css`
- Create: `deck-harness/templates/assets/deck.js`
- Create: `deck-harness/templates/assets/presenter-review.js`

- [ ] **Step 1: Scaffold a new deck workspace**

`scaffold-deck.js` must create:

```text
generated-decks/<slug>/
  job-manifest.json
  topic-intake.md
  research-dossier.md
  claim-source-map.json
  section-plan.json
  slide-spec.json
  glossary.json
  HANDOFF.md
  evaluation-log.md
  deck.html
  presenter-review.html
  assets/
  slides/
```

- [ ] **Step 2: Build deck files from slide spec**

`build-deck-from-spec.js` must:

```text
1. Read generated-decks/<slug>/slide-spec.json.
2. Create one HTML file per slide.
3. Create assets/slides.js.
4. Include speakerNote only in presenter review metadata or note blocks.
5. Preserve evidenceClaimIds for presenter review.
6. Copy glossary terms from glossary.json into one shared runtime registry.
7. Update job-manifest.json with inputHash, outputHash, stage owner, status, and evidence path.
```

- [ ] **Step 3: Validate generated deck contract**

`validate-deck-contract.js` must fail when:

```text
- claim-source-map.json, section-plan.json, slide-spec.json, glossary.json, or job-manifest.json fails JSON Schema validation.
- slide count differs from spec
- any slide lacks message
- any slide lacks speakerNote
- any evidenceClaimId is missing from claim-source-map.json
- any glossary term is undefined
- any slide duplicates source URL, checkedDate, sourceType, confidence, or source summary fields
- any section objective is missing
- total estimated minutes exceeds the timebox
- any manifest stage has stale hash after input changes
```

- [ ] **Step 4: Verify generated deck quality**

`verify-deck-quality.js` must run:

```text
- contract validation
- local link validation
- spec-to-render parity for title, message, bullets, screen text, speakerNote, and evidenceClaimIds
- presenter review script resolution
- presenter review source/evidence display check
- deck note exposure check
- image load check
- 1280x720 projector fit
- desktop overflow check
- mobile render check
- glossary registry check
- partial glossary matching check
- handoff parser check
```

It must fail on:

```text
- orphan claim: a claim referenced by slide-spec.json does not exist.
- unused required claim: source map marks useLocation=slide but no slide references it.
- checkedDate missing for official/supporting/local claims.
- slide-visible claim without source.
- speakerNote missing.
- glossary term undefined.
- section objective missing.
- timebox total exceeded.
- overflow WARN without a valid, unexpired allowlist item.
- presenter-review missing evidence/source surface for a referenced claim.
- HANDOFF.md missing required headings, command evidence, remaining risks, or next prompt.
```

Overflow rule:

```text
Overflow is FAIL by default. A WARN is allowed only when deck-harness/allowlists/overflow-allowlist.json has slide id, selector, reason, owner, and expiry date, and the entry is not expired.
```

## Task 1E: Prove The Workflow With Fixture And Source-Sensitive Sample Decks

**Files:**
- Create: `generated-decks/sample-topic-fixture/`
- Create: `generated-decks/sample-topic-live-research/`

- [ ] **Step 1: Scaffold local fixture sample**

Run:

```sh
node deck-harness/scripts/scaffold-deck.js sample-topic-fixture
```

Expected:

```text
Created generated-decks/sample-topic-fixture
```

- [ ] **Step 2: Fill local fixture research and spec**

Create a small 3-slide fixture under `generated-decks/sample-topic-fixture/`:

```text
00 title
01 concept explanation with source
02 practical checklist with verification
```

Use local fixture claims only; this smoke test proves workflow mechanics, not external research quality.

- [ ] **Step 3: Build and verify local fixture sample**

Run:

```sh
node deck-harness/scripts/build-deck-from-spec.js generated-decks/sample-topic-fixture
node deck-harness/scripts/verify-deck-quality.js generated-decks/sample-topic-fixture
```

Expected:

```text
PASS generated deck contract
PASS presenter review
PASS projector fit
PASS local references
```

- [ ] **Step 4: Scaffold live-research sample**

Run:

```sh
node deck-harness/scripts/scaffold-deck.js sample-topic-live-research
```

Expected:

```text
Created generated-decks/sample-topic-live-research
```

- [ ] **Step 5: Fill source-sensitive mini deck**

Create a 5-slide mini deck under `generated-decks/sample-topic-live-research/` using a current official-doc topic. It must include:

```text
- at least one official claim.
- at least one supporting claim.
- at least one inference claim with reasoning basis.
- at least one date-sensitive claim with checkedDate.
- at least one claim marked useLocation=speaker-note.
- at least one claimToAvoid or claimsToAvoidReviewed=true.
```

Use current official documentation for the official claim. Record the source URL and checked date in `claim-source-map.json`, not in `slide-spec.json`.

- [ ] **Step 6: Build and verify live-research sample**

Run:

```sh
node deck-harness/scripts/build-deck-from-spec.js generated-decks/sample-topic-live-research
node deck-harness/scripts/verify-deck-quality.js generated-decks/sample-topic-live-research
```

Expected:

```text
PASS source map schema
PASS slide spec schema
PASS evidence claim resolution
PASS presenter evidence surface
PASS glossary registry
PASS handoff parser
PASS browser render
```

## Task 2: Add Reproduction Contract Validation

**Files:**
- Create: `scripts/validate-lecture-cuts-contract.js`
- Modify: `scripts/audit-lecture-cuts.js`
- Create: `docs/harness/lecture-cuts-reproduction-contract.md`

- [ ] **Step 1: Write the contract validator**

Create `scripts/validate-lecture-cuts-contract.js` that fails when:

```text
1. slide-spec.json is missing.
2. slide-spec.json slide count differs from window.LECTURE_SLIDES.
3. slide order differs from window.LECTURE_SLIDES.
4. any registered slide file is missing.
5. any current slide HTML hash differs from slide-spec.json contentHash.
6. any slide has no title.
7. any slide has no speaker source.
8. per-slide sources are required but missing for source-sensitive slides.
```

`contentHash` drift is always a `FAIL`. Missing source coverage is a `FAIL` for source-sensitive slides and a `WARN` only for slides explicitly marked as local exercise, analogy, or transition slides.

- [ ] **Step 2: Run validator**

Run:

```sh
node scripts/validate-lecture-cuts-contract.js
```

Expected:

```text
PASS contract slide count - 87
PASS contract order
PASS contract hashes
PASS source-sensitive slide coverage
```

- [ ] **Step 3: Add contract validation to audit**

Update `scripts/audit-lecture-cuts.js` to run or mirror the contract checks. The audit should include:

```text
PASS reproduction contract
WARN source coverage
```

Expected command:

```sh
node scripts/audit-lecture-cuts.js
```

Expected: existing render checks still pass, plus contract status appears.

- [ ] **Step 4: Document the reproduction rule**

Create `docs/harness/lecture-cuts-reproduction-contract.md` with:

```text
# Lecture Cuts Reproduction Contract

Current source of truth:
- slide order: lecture-cuts/assets/slides.js
- slide content: lecture-cuts/*.html
- generated contract: lecture-cuts/slide-spec.json
- validation: scripts/validate-lecture-cuts-contract.js

Rule:
Any intentional slide content change must regenerate slide-spec.json.
Any unintentional drift must fail validation before handoff.
```

## Task 3: Add Lecture-Cuts Agent Files

**Files:**
- Create: `lecture-cuts/agents/content-inventory-agent.md`
- Create: `lecture-cuts/agents/source-grounding-agent.md`
- Create: `lecture-cuts/agents/pedagogy-flow-agent.md`
- Create: `lecture-cuts/agents/visual-accessibility-agent.md`
- Create: `lecture-cuts/agents/harness-verification-agent.md`
- Create: `lecture-cuts/agents/harness-architect-agent.md`
- Create: `docs/harness/lecture-cuts-agent-handoff.md`

- [ ] **Step 1: Create agent role files**

Each agent file must include:

```text
# <Agent Name>

## Role
## Inputs
## Output Format
## Required Checks
## Must Fail If
## Evidence Rules
## Writes To
```

All agents must write or append their structured result to:

```text
docs/harness/lecture-cuts-agent-handoff.md
```

The output format must include:

```text
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
```

- [ ] **Step 2: Define content inventory agent**

`content-inventory-agent.md` must require checks for:

```text
- slide order and section assignment
- speaker note location
- source metadata presence
- glossary term usage
- content hash drift
```

- [ ] **Step 3: Define source grounding agent**

`source-grounding-agent.md` must require checks for:

```text
- official docs for Claude Code hooks, subagents, skills, MCP
- date-sensitive claims
- slide-visible claim vs speaker-note-only claim
- weak or missing source evidence
```

- [ ] **Step 4: Define pedagogy flow agent**

`pedagogy-flow-agent.md` must require checks for:

```text
- one message per slide
- duplicated explanation across neighboring slides
- 4-hour workshop pacing
- beginner terminology burden
- analogy quality
```

- [ ] **Step 5: Define visual accessibility agent**

`visual-accessibility-agent.md` must require checks for:

```text
- 1280x720 projector fit
- desktop/mobile overflow
- visual repetition/fatigue
- tooltip/glossary behavior
- readable Korean-first copy
```

- [ ] **Step 6: Define harness verification and architect agents**

`harness-verification-agent.md` must own verification matrix and gate results.

`harness-architect-agent.md` must own integration recommendations for:

```text
- source/spec structure
- skill boundaries
- hook gates
- handoff requirements
- future generation workflow
```

## Task 4: Add Local Skills For The Lecture Deck Harness

**Files:**
- Create: `lecture-cuts/skills/deck-builder/SKILL.md`
- Create: `lecture-cuts/skills/source-grounding/SKILL.md`
- Create: `lecture-cuts/skills/verification-gate/SKILL.md`
- Create: `lecture-cuts/skills/handoff-maintainer/SKILL.md`
- Create: `lecture-cuts/few-shots.md`

- [ ] **Step 1: Create shared lecture-cuts skill skeleton**

Every `lecture-cuts/skills/*/SKILL.md` must include:

```text
---
name: <skill-name>
description: Use when <triggering condition only, no workflow summary>
---

# <Skill Name>

## When to Use
## Inputs
## Outputs
## Procedure
## Quality Bar
## Verification
## Stop Conditions
```

- [ ] **Step 2: Create deck-builder skill**

`lecture-cuts/skills/deck-builder/SKILL.md` must adapt the existing `lecture-deck/skills/deck-builder/SKILL.md` to the 87-slide deck and require:

```text
1. Read lecture-cuts/source.md.
2. Read lecture-cuts/slide-spec.json.
3. Read docs/harness/lecture-cuts-content-inventory.md.
4. Edit slide HTML only after contract context is loaded.
5. Update speaker notes and source metadata with the slide.
6. Regenerate slide-spec.json after intentional content changes.
7. Run node scripts/verify-lecture-cuts-harness.js before handoff.
```

- [ ] **Step 3: Create source-grounding skill**

This skill must instruct agents to:

```text
- prefer official docs for technical claims
- record exact source URL or local source file
- mark date-sensitive claims
- decide whether evidence belongs on slide, speaker note, or sources appendix
- write updates to docs/harness/lecture-cuts-source-map.json
- update lecture-cuts/slide-spec.json evidence metadata when slide-visible claims change
- rerun node scripts/validate-lecture-cuts-contract.js after source metadata changes
```

Stop Conditions:

```text
- a technical claim has no official or explicitly justified source.
- checked date is missing for current tool/API behavior.
- a slide-visible factual claim cannot be mapped to source evidence.
```

- [ ] **Step 4: Create verification-gate skill**

This skill must define the mandatory gate:

```sh
node --check lecture-cuts/assets/slides.js
node --check lecture-cuts/assets/deck.js
node --check lecture-cuts/assets/presenter-review.js
node scripts/validate-lecture-cuts-contract.js
node scripts/audit-lecture-cuts.js
```

- [ ] **Step 5: Create handoff-maintainer skill**

This skill must define the final handoff shape:

```text
Current State
Inputs
Evidence Map Status
Source Coverage
Decisions
Changed Files
Generated Artifacts
Quality Gate Artifacts
Verification
Agent Findings
Blocked Risks
Non-Blocking Risks
Next Prompt
```

It must fail if:

```text
- Verification omits the latest command and exit status.
- Agent Findings omit any WARN/FAIL from docs/harness/lecture-cuts-agent-handoff.md.
- Blocked Risks and Non-Blocking Risks are both empty.
- Changed Files omits a modified lecture-cuts, docs/harness, docs/audits, or scripts file.
```

- [ ] **Step 6: Create few-shots**

`lecture-cuts/few-shots.md` must include:

```text
- good slide-spec item
- bad slide-spec item
- good source map entry
- good agent handoff section
- good final report
```

## Task 5: Add Hook Runner And Unified Verification Gate

**Files:**
- Create: `scripts/run-lecture-cuts-hook.js`
- Create: `lecture-cuts/hooks/lecture-cuts-contract.json`
- Create: `lecture-cuts/hooks/lecture-cuts-audit.json`
- Create: `lecture-cuts/hooks/lecture-cuts-handoff.json`
- Create: `scripts/verify-lecture-cuts-harness.js`

- [ ] **Step 1: Add hook runner**

`scripts/run-lecture-cuts-hook.js` should mirror `lecture-deck/scripts/run-hook.js`, but use:

```text
deckRoot = lecture-cuts/
hookDir = lecture-cuts/hooks/
```

- [ ] **Step 2: Add contract hook**

Create `lecture-cuts/hooks/lecture-cuts-contract.json`:

```json
{
  "name": "lecture-cuts-contract",
  "description": "Validate slide-spec.json against the current lecture-cuts deck.",
  "events": ["manual", "pre-handoff"],
  "command": "node ../scripts/validate-lecture-cuts-contract.js",
  "passRule": "The command exits with code 0 and reports no slide order or content hash drift."
}
```

- [ ] **Step 3: Add audit hook**

Create `lecture-cuts/hooks/lecture-cuts-audit.json`:

```json
{
  "name": "lecture-cuts-audit",
  "description": "Run static and browser audit for the lecture-cuts workshop deck.",
  "events": ["manual", "pre-handoff"],
  "command": "node ../scripts/audit-lecture-cuts.js",
  "passRule": "The command exits with code 0 and reports no FAIL entries."
}
```

- [ ] **Step 4: Add handoff hook**

Create `lecture-cuts/hooks/lecture-cuts-handoff.json`:

```json
{
  "name": "lecture-cuts-handoff",
  "description": "Parse HANDOFF.md and agent evidence before completion.",
  "events": ["pre-handoff"],
  "command": "node ../scripts/verify-lecture-cuts-harness.js --handoff-only",
  "passRule": "HANDOFF.md and docs/harness/lecture-cuts-agent-handoff.md contain required headings, latest command evidence, PASS/WARN/FAIL statuses, blocked/non-blocking risks, and next prompt."
}
```

- [ ] **Step 5: Add unified verification script**

Create `scripts/verify-lecture-cuts-harness.js` that runs:

```sh
node --check lecture-cuts/assets/slides.js
node --check lecture-cuts/assets/deck.js
node --check lecture-cuts/assets/presenter-review.js
node scripts/validate-lecture-cuts-contract.js
node scripts/audit-lecture-cuts.js
node scripts/run-lecture-cuts-hook.js pre-handoff
```

Expected final output:

```text
PASS syntax checks
PASS reproduction contract
PASS lecture-cuts audit
PASS pre-handoff hooks
```

The script must also support:

```sh
node scripts/verify-lecture-cuts-harness.js --handoff-only
```

The handoff-only mode must parse required headings, command names, exit status, artifact paths, PASS/WARN/FAIL agent statuses, blocked risks, non-blocking risks, and next prompt. A handoff validator that only checks file existence and file size must be treated as incomplete.

## Task 6: Create Source Brief And Handoff Files

**Files:**
- Create: `lecture-cuts/source.md`
- Create: `lecture-cuts/HANDOFF.md`
- Create: `lecture-cuts/AGENTS.md`

- [ ] **Step 1: Create source brief**

`lecture-cuts/source.md` must state:

```text
- audience: general technical learners and working professionals new to AI agent harnesses
- format: 4-hour Korean workshop
- canonical output: lecture-cuts/deck.html
- review output: lecture-cuts/presenter-review.html
- source of truth today: lecture-cuts/assets/slides.js plus slide HTML files
- generated contract: lecture-cuts/slide-spec.json
- verification: scripts/verify-lecture-cuts-harness.js
```

- [ ] **Step 2: Create HANDOFF.md**

`lecture-cuts/HANDOFF.md` must use:

```text
# Lecture Cuts Handoff

## Current State
## Inputs
## Evidence Map Status
## Source Coverage
## Decisions
## Changed Files
## Generated Artifacts
## Quality Gate Artifacts
## Verification
## Agent Findings
## Blocked Risks
## Non-Blocking Risks
## Next Prompt
```

- [ ] **Step 3: Create AGENTS.md**

`lecture-cuts/AGENTS.md` must require:

```text
1. Read source.md, slide-spec.json, and docs/harness/lecture-cuts-content-inventory.md before editing slides.
2. Treat slide-spec.json as the current reproduction contract.
3. Keep visible deck output stable unless the task asks for copy or visual changes.
4. Update sources and speaker notes with any content claim change.
5. Regenerate slide-spec.json after intentional slide content changes.
6. Run node scripts/verify-lecture-cuts-harness.js before final completion.
7. Update HANDOFF.md and docs/harness/lecture-cuts-agent-handoff.md.
```

## Task 7: Remove Drift-Prone Duplication

**Files:**
- Create: `lecture-cuts/assets/glossary.js`
- Modify: `lecture-cuts/assets/deck.js`
- Modify: `lecture-cuts/assets/presenter-review.js`
- Optional create: `lecture-cuts/assets/source-registry.js`

- [ ] **Step 1: Centralize glossary**

Move the duplicated glossary arrays from `deck.js` and `presenter-review.js` into:

```js
window.LECTURE_GLOSSARY = [
  ["API", "프로그램끼리 정해진 방식으로 기능이나 데이터를 주고받는 연결 규칙입니다."],
  ["verification", "작업이 정말 끝났는지 증거로 확인하는 과정입니다."]
];
```

- [ ] **Step 2: Load glossary before deck/review scripts**

Update:

```text
lecture-cuts/deck.html
lecture-cuts/presenter-review.html
```

to load:

```html
<script defer src="assets/glossary.js"></script>
```

before the deck or presenter review script.

- [ ] **Step 3: Verify tooltip behavior**

Use the browser at:

```text
http://127.0.0.1:8766/deck.html?glossary=<next>#slide-30
http://127.0.0.1:8766/deck.html?glossary=<next>#slide-31
```

Expected:

```text
- custom tooltip only
- no native browser title tooltip
- no partial match such as PR inside pressure
```

## Task 8: Final Integration And Review

**Files:**
- Modify: `docs/audits/2026-05-25-lecture-materials-validation.md`
- Modify: `lecture-cuts/HANDOFF.md`
- Modify: `docs/harness/lecture-cuts-agent-handoff.md`

- [ ] **Step 1: Run unified verification**

Run:

```sh
node scripts/verify-lecture-cuts-harness.js
```

Expected:

```text
PASS syntax checks
PASS reproduction contract
PASS lecture-cuts audit
PASS pre-handoff hooks
```

- [ ] **Step 2: Browser spot check**

Open:

```text
http://127.0.0.1:8766/deck.html?glossary=<next>#slide-30
http://127.0.0.1:8766/deck.html?glossary=<next>#slide-31
http://127.0.0.1:8766/presenter-review.html
```

Expected:

```text
- slide 30 Korean-first reasoning copy visible
- slide 31 result-criteria prompt visible
- presenter review resolves scripts and sources
```

- [ ] **Step 3: Update audit and handoff**

Append final state to:

```text
docs/audits/2026-05-25-lecture-materials-validation.md
lecture-cuts/HANDOFF.md
docs/harness/lecture-cuts-agent-handoff.md
```

Include:

```text
Changed files
Verification commands
Verification results
Quality gate artifact paths
Evidence map status
Source coverage status
Agent PASS/WARN/FAIL statuses
Remaining risks
Next prompt
```

- [ ] **Step 4: Commit harness implementation**

Run:

```sh
git add lecture-cuts docs/harness docs/audits scripts
git commit -m "Add lecture cuts agent harness workflow"
```

Expected: one commit containing the reproducibility harness, agents, skills, hooks, and verification gate.

## Completion Gate

The work is complete only when both the golden-reference gate and the new-topic workflow smoke gate pass.

Golden reference gate:

```sh
node scripts/verify-lecture-cuts-harness.js
```

New topic workflow smoke gate:

```sh
node deck-harness/scripts/scaffold-deck.js sample-topic-fixture
node deck-harness/scripts/build-deck-from-spec.js generated-decks/sample-topic-fixture
node deck-harness/scripts/verify-deck-quality.js generated-decks/sample-topic-fixture
node deck-harness/scripts/scaffold-deck.js sample-topic-live-research
node deck-harness/scripts/build-deck-from-spec.js generated-decks/sample-topic-live-research
node deck-harness/scripts/verify-deck-quality.js generated-decks/sample-topic-live-research
```

Completion requires:

```text
- all four project-level Codex conversation sessions are included in docs/harness/codex-session-inventory.md, or any unavailable session is explicitly listed with impact.
- docs/harness/codex-session-decision-log.md has been checked by generic agent, skill, verification, and handoff tasks.
- claim-source-map coverage is 100% for slide-visible factual claims, or the claim is explicitly marked avoid/inference with a reason.
- every presenter-review evidenceClaimId resolves to claim-source-map.json.
- every workflow stage has a job-manifest.json entry with owner, input hash, output hash, status, and evidence path.
- every generated deck HANDOFF.md passes the parser and includes command evidence, artifact paths, blocked risks, non-blocking risks, and next prompt.
- overflow warnings are failures unless backed by a valid unexpired allowlist entry.
```

These reusable workflow files must exist with non-empty content:

```text
docs/harness/codex-session-inventory.md
docs/harness/codex-session-source-map.json
docs/harness/codex-session-decision-log.md
deck-harness/workflow.md
deck-harness/quality-rubric.md
deck-harness/topic-intake.template.md
deck-harness/research-dossier.template.md
deck-harness/claim-source-map.schema.json
deck-harness/section-plan.schema.json
deck-harness/slide-spec.schema.json
deck-harness/glossary.schema.json
deck-harness/job-manifest.schema.json
deck-harness/handoff.template.md
deck-harness/evaluation-template.md
deck-harness/allowlists/overflow-allowlist.json
deck-harness/agents/research-agent.md
deck-harness/agents/source-grounding-agent.md
deck-harness/agents/curriculum-architect-agent.md
deck-harness/agents/slide-spec-agent.md
deck-harness/agents/visual-design-agent.md
deck-harness/agents/deck-builder-agent.md
deck-harness/agents/verification-agent.md
deck-harness/agents/handoff-agent.md
deck-harness/skills/topic-intake/SKILL.md
deck-harness/skills/research-dossier/SKILL.md
deck-harness/skills/slide-spec-builder/SKILL.md
deck-harness/skills/html-css-deck-builder/SKILL.md
deck-harness/skills/deck-quality-gate/SKILL.md
deck-harness/skills/handoff-maintainer/SKILL.md
deck-harness/scripts/scaffold-deck.js
deck-harness/scripts/build-deck-from-spec.js
deck-harness/scripts/validate-deck-contract.js
deck-harness/scripts/verify-deck-quality.js
docs/harness/topic-to-deck-workflow.md
docs/harness/deck-quality-rubric.md
docs/harness/topic-to-deck-evaluation-template.md
```

These golden-reference files must also exist with non-empty content:

```text
lecture-cuts/source.md
lecture-cuts/slide-spec.json
lecture-cuts/HANDOFF.md
lecture-cuts/AGENTS.md
docs/harness/lecture-cuts-content-inventory.md
docs/harness/lecture-cuts-source-map.json
docs/harness/lecture-cuts-agent-handoff.md
docs/harness/lecture-cuts-reproduction-contract.md
```

## Execution Recommendation

Use subagent-driven execution:

```text
Round 1: freeze current deck state and commit the current visible deck baseline
Round 2: collect the four project-level Codex conversation sessions and extract decisions, quality failures, and open risks
Round 3: extract lecture-cuts golden-reference contract and quality rubric
Round 4: build generic topic-to-deck agents, skills, templates, and schemas
Round 5: build generic scaffold/build/validate/verify scripts
Round 6: add lecture-cuts-specific reproduction contract and hooks
Round 7: run sample-topic-fixture and sample-topic-live-research generation with browser quality gates
Round 8: update handoff files, audit docs, and commit
```
