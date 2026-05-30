---
name: context-research-orchestrator
description: Use before or around brainstorming, planning, implementation, deck/PPT writing, library selection, or any task that may need local project context, current web research, official documentation, Context7-style library docs, source evidence, or a handoff-ready context pack. The skill routes research dynamically, degrades gracefully when optional tools are unavailable, and records all artifacts inside the current project root.
---

# Context Research Orchestrator

## Purpose

Use this skill to decide what context a task needs, load only the useful context, and leave a reusable research artifact for the next agent or worker.

This skill does not replace brainstorming. It wraps brainstorming with two research passes:

```text
0. Context Triage: light preflight before brainstorming
1. Brainstorming: clarify goal, scope, tradeoffs, approval
2. Targeted Research: deeper sourcing after the direction is known
3. Plan / implementation / deck work
```

## Project-Root Artifact Rule

All artifacts must be written under the current project root. Do not write working notes, research packs, source lists, or installation notes to global/user directories.

Default artifact paths:

```text
docs/context/<task-slug>-context-research-pack.md
docs/context/<task-slug>-raw-source-list.md
```

For generated decks, use the deck directory only when it already exists:

```text
generated-decks/<slug>/context-research-pack.md
generated-decks/<slug>/raw-source-list.md
```

If the project has a stronger local convention, use it only if it is still under the project root.

## When To Run

Run a light Context Triage before brainstorming when any of these are true:

- The request may depend on local repo rules, AGENTS.md, package choices, existing architecture, or generated artifacts.
- The user asks for research, current information, service examples, PPT/deck material, library feasibility, or implementation options.
- The task mentions optional research tools such as Context7, MCP, browser, docs, package APIs, or official references.
- You cannot safely ask design questions without first checking project constraints.

Run Targeted Research after brainstorming when any of these are true:

- Brainstorming chose an approach that depends on a library/API/service behavior.
- The plan needs real-world examples, official docs, policy/pricing/version/date-sensitive information, images, papers, or standards.
- The output will make claims in a deck, report, PRD, public document, or handoff.
- A worker needs an evidence-backed context pack before implementation.

Do not perform deep research before brainstorming unless the user explicitly asks for research first or the missing facts would make brainstorming misleading.

## Optional Tool Policy

Detect capabilities, then continue with the best available path. Missing optional tools are never a reason to stop unless the user explicitly requires that tool.

```text
Context7 available:
  Use it for library/API documentation and version-specific examples.

Context7 unavailable:
  Use official documentation, package docs, local lockfiles, or web search if available.
  Record "Context7 install recommended" in Install Recommendations.
  Continue.

Web unavailable:
  Use local files and user-provided sources.
  Mark current/date-sensitive claims as "추가 확인 필요".
  Continue.

Local repo unavailable:
  Use provided files and external sources.
  Mark local architecture findings as skipped.
  Continue.

PPT/deck parser unavailable:
  Use available file metadata, screenshots, extracted text, or repo deck contracts.
  Record tool recommendation only if it would materially improve future work.
```

## Routing Procedure

1. Identify the project root. Prefer the git root; otherwise use the current working directory.
2. Read applicable AGENTS.md files under the project root before reading or writing project files.
3. Create or update the context research pack under the project root.
4. Classify the task:
   - code implementation
   - bug/debugging
   - architecture/design
   - library/API feasibility
   - service/product research
   - deck/PPT/report material
   - legal/medical/financial/high-stakes
   - local repo archaeology
5. Decide which context lanes are needed:
   - local project search
   - web/current research
   - official docs or primary sources
   - Context7/library docs
   - paper/standard/dataset search
   - media/visual/source asset search
   - reviewer-only evidence check
6. For pre-brainstorm triage, stop after enough context to ask better questions or present 2-3 approaches.
7. After brainstorming, run targeted research against the chosen direction and unresolved research questions.
8. Build a search plan before using web, Context7, paper search, or local search:
   - Translate raw user wording into domain terms, official terms, implementation terms, and risk terms.
   - Use multiple query families, not minor rewordings of the same search.
   - Record the query families in the context research pack.
9. Iterate research until sufficiency criteria are met:
   - Map every result batch to the research questions.
   - Mark questions as answered, partially answered, contradicted, or unanswered.
   - Refine vocabulary from good sources and run another batch when important questions remain weak.
   - Stop only on the stop conditions in `references/search-strategy.md`.
10. Record skipped tools, fallbacks, and install recommendations.
11. End with "Context Pack For Next Agent" so another agent can proceed without hidden chat context.

## Quality Bar

- Every factual claim used for decisions has an evidence row or is explicitly marked as an assumption.
- Official/primary sources are separated from secondary commentary.
- Date-sensitive claims include the checked date.
- Local findings include file paths and why they matter.
- The artifact states which tools were unavailable and what fallback was used.
- The pack lists search query families, not just final sources.
- The pack states sufficiency criteria and whether each criterion passed.
- The pack explains why research stopped and records any limiting constraint in the structured `Limiting Constraint` table. If research stopped early, status must be `WARN` or `FAIL`.
- The pack includes a Research State Snapshot so another agent can see coverage without rereading the whole artifact.
- The pack includes a Source Ledger with stable source ids for every important URL/path used in evidence.
- The pack includes a Claim Support Check so citations are judged by whether they support the claim, not just by URL presence.
- Evidence rows use stable `C<number>` claim ids and source ids from Source Ledger, not raw URLs or loose prose references.
- The next step is specific: brainstorming, writing-plans, worker implementation, deck source mapping, reviewer, or user decision.

## Output

Use `templates/context-research-pack.md` for the main artifact.

Use `references/tool-routing.md` when tool choice is unclear.

Use `references/source-taxonomy.md` when ranking evidence quality.

Use `references/search-strategy.md` before any non-trivial local, web, library/API, paper, or deck/report research.

Use `references/research-agent-design.md` when designing, reviewing, or improving the research agent itself.

## Verification

After writing a context research pack, run:

```sh
node scripts/validate-context-research-pack.js docs/context/<task-slug>-context-research-pack.md
```

For generated decks:

```sh
node scripts/validate-context-research-pack.js generated-decks/<slug>/context-research-pack.md
```

If the validator is not available in the project, manually check that the pack has:

- `## 1. Context Triage`
- `## 2. Brainstorming Summary`
- `## 3. Targeted Research`
- `### Search Plan`
- `### Sufficiency Check`
- `### Limiting Constraint`
- `### Research State Snapshot`
- `### Source Ledger`
- `### Claim Support Check`
- `## 4. Context Pack For Next Agent`
- an Evidence Table with `claim id | claim | evidence | source id(s) | source type | checked date | confidence | relevance`
- an Install Recommendations section

Template validation is separate from completed artifact validation:

```sh
node scripts/validate-context-research-pack.js --allow-template .codex/skills/context-research-orchestrator/templates/context-research-pack.md
```
