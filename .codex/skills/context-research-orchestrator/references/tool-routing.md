# Tool Routing

Use the smallest tool set that can answer the task with traceable evidence.

## Local Project Lane

Use when the answer depends on repository state, ownership rules, generated artifacts, tests, package choices, or existing implementation.

Preferred actions:

- Read applicable `AGENTS.md`.
- Use `git rev-parse --show-toplevel` to confirm project root when needed.
- Use `rg --files` and `rg` for file discovery.
- Read source files, package manifests, tests, schemas, docs, and handoff files.
- Record file paths and why each path matters.

## Context7 / Library Docs Lane

Use when implementation feasibility depends on a package, framework, API version, or code examples.

Preferred actions when available:

- Resolve the library id first.
- Fetch targeted docs using the actual implementation question.
- Prefer version-specific docs when package versions are known.

Fallback when unavailable:

- Use official documentation, package docs, lockfiles, or source repository docs.
- Record `Context7 install recommended` only in the final Install Recommendations.
- Continue without blocking.

## Web / Current Research Lane

Use when claims may have changed recently: product features, APIs, pricing, laws, schedules, model availability, service behavior, security advisories, or public examples.

Preferred sources:

1. Official documentation, release notes, specs, standards, product docs.
2. Primary sources: papers, legal text, source repositories, vendor docs.
3. Reputable secondary explanation.
4. Community reports only as supporting evidence or risk signals.

Record checked date for every current claim.

## Deck / PPT / Report Lane

Use when the output is a slide deck, workshop material, report, or document.

Collect:

- Claims that may be shown to readers.
- Source URLs and checked dates.
- Visual asset requirements and usage rights risk.
- Beginner-friendly explanation hooks.
- Terms that need a glossary.
- Evidence that belongs in speaker notes rather than screen copy.

## High-Stakes Lane

Use for medical, legal, financial, security, privacy, compliance, or safety-sensitive work.

Rules:

- Prefer official/primary sources.
- Mark uncertainty clearly.
- Avoid final professional advice.
- Escalate for user confirmation when missing facts materially change the outcome.

## Brainstorming Order

Run before brainstorming only to gather enough context to avoid bad questions.

Run after brainstorming for targeted research against the chosen goal, constraints, and alternatives.

If new evidence invalidates the brainstormed direction, return to brainstorming before writing a plan.
