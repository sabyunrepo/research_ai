# Search Strategy

Do not search with the user's raw wording only. Turn the task into a query plan first.

## Query Construction

For each research question, generate query variants across these dimensions:

1. User language: Korean wording from the request.
2. Domain English: likely official/technical terms.
3. Artifact terms: docs, guide, reference, spec, API, example, case study, benchmark, template.
4. Source intent: official, GitHub, RFC, standard, paper, release notes, changelog, pricing, policy.
5. Implementation intent: how to, example, integration, migration, limitations, alternatives.
6. Failure/risk intent: known issues, limitations, security, deprecation, breaking changes.

Example:

```text
User asks: "리서치 스킬 구성 방법"

Query variants:
- agent skills SKILL.md structure official documentation
- Codex skills plugin process external tools official
- Claude Code skills supporting files scripts references
- Context7 CLI skills MCP docs setup
- agent skills benchmark SKILL.md frontmatter references scripts
- skill authoring best practices testing description trigger
```

## Minimum Search Breadth

For targeted research with web access, do not stop after one or two searches. Use enough distinct query families to cover the task.

Default minimums:

- 3 query families for ordinary current/tool research.
- 5 query families for library/API feasibility, shared workflow design, deck/report evidence, or public-facing claims.
- 7 query families for high-stakes, standards, security, legal, financial, medical, or conflicting-source topics.

A query family is not just a minor rewording. It must target a different source type, concept, implementation angle, or risk angle.

## Source Mix Targets

Targeted research should normally collect:

- At least 2 official or primary sources for technical/library/API claims.
- At least 1 local source when the task concerns a repository.
- At least 1 risk/limitation/deprecation source or an explicit `Reviewed: none found`.
- At least 1 implementation/example source when the output affects how work will be done.
- For deck/report material, enough sources to separate screen claims, speaker-note claims, and background reading.

## Iteration Loop

After each batch of searches:

1. Map results to the research questions.
2. Mark each question as answered, partially answered, contradicted, or unanswered.
3. Identify vocabulary that good sources use and refine the next query batch.
4. Search again if any important question is partial, contradicted, or source quality is weak.
5. Stop only when sufficiency criteria are met or a hard constraint prevents progress.

## Stop Conditions

Stop targeted research when one is true:

- Sufficiency criteria are met.
- Additional searches return duplicate evidence and no new source types.
- A required tool or access is unavailable and all reasonable fallbacks were attempted.
- The remaining unknowns require user/product decision rather than more research.
- The task budget or user instruction explicitly limits research.

When stopping before full sufficiency, set `Status: WARN` and record what remains unknown.
