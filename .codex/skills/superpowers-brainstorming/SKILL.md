---
name: superpowers-brainstorming
description: Use before creative or ambiguous project work in this repository, especially when the user has an idea, feature request, deck/workshop redesign, workflow change, or behavior change that needs scope clarification before planning or implementation. This is a project-local adapter of Superpowers brainstorming.
---

# Superpowers Brainstorming

This project-local skill adapts the Superpowers `brainstorming` workflow for `research_ai`.

Use it before planning or implementation when the request is open-ended, creative, ambiguous, or likely to affect deck/workshop flow, harness behavior, generated outputs, learner-facing UI, or reusable workflow contracts.

Do not use it for narrow factual questions, simple command output, pure status checks, or requests where the user explicitly asked for research-only work.

## Hard Gate

Do not write code, edit deck output, scaffold files, or create an implementation plan until the brainstorming result has been presented and the user has approved the direction.

## Procedure

1. Explore local project context first.
   - Read applicable `AGENTS.md`.
   - Check the relevant source surface before asking broad design questions.
   - For deck/harness work, identify whether the task belongs to `lecture-cuts/`, `deck-harness/`, `generated-decks/`, `practice-harness/`, or `docs/harness/kimai-content/`.

2. Clarify one question at a time.
   - Ask only the highest-leverage question.
   - Wait for the user's answer before asking the next question.
   - Do not bundle a long questionnaire.

3. Separate constraints.
   - Goal: what outcome the user wants.
   - Audience: who will read, watch, or use it.
   - Source of truth: which files or docs own the content.
   - Boundaries: what should not be changed.
   - Verification: what evidence will show the result is acceptable.

4. Compare 2-3 approaches when there is a real tradeoff.
   - State the practical cost and risk of each.
   - Recommend one approach.
   - Explain why it fits the project rules and current context.

5. Present a concise design/spec.
   - Goal
   - Scope
   - Chosen approach
   - Rejected alternatives
   - Files/surfaces likely involved
   - Verification evidence
   - Open questions, if any

6. Ask for approval before moving to planning or implementation.
   - If approved, proceed to the appropriate project workflow.
   - If not approved, revise the design or continue questioning.

## Project-Specific Notes

- For research tasks, use `.codex/skills/context-research-orchestrator/SKILL.md` for context triage and targeted research. Superpowers brainstorming should clarify direction; it should not replace evidence collection.
- For verification or QA requests, use `.codex/skills/verification-orchestrator/SKILL.md`.
- For `lecture-cuts/` work, respect the stable visible output boundary unless the user explicitly asks to change slides.
- For Kimai content work, check `docs/harness/kimai-content/AGENTS.md` before proposing changes.
- For generated deck work, fix the source contract, templates, asset packs, or harness layer rather than hand-editing generated HTML.

## Source

Adapted from the cached Superpowers plugin skill:

`/Users/sabyun/.codex/plugins/cache/openai-curated/superpowers/6188456f/skills/brainstorming/SKILL.md`
