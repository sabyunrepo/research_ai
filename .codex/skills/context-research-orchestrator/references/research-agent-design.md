# Research Agent Design

Use this reference when designing or reviewing a research/context-loading agent.

## Core Loop

Mature research agents should use a loop, not a single search pass:

```text
Plan -> Search -> Read -> Reflect -> Iterate -> Synthesize
```

For project work, extend it with local context:

```text
Project rules -> Query plan -> Local search -> External search -> Evidence map -> Sufficiency check -> Handoff pack
```

## Required Materials

A reusable research agent should carry these materials:

1. Task classifier
   - code, architecture, bug, library/API, deck/report, product/service, high-stakes, local archaeology.
2. Search strategy
   - query families, source targets, retry/refinement loop, stop conditions.
3. Source taxonomy
   - official, primary, local, secondary, community, inference, assumption.
4. Evidence schema
   - claim, evidence, source, source type, checked date, confidence, relevance.
5. Local context protocol
   - AGENTS.md, package files, tests, schemas, docs, generated artifacts, handoff files.
6. Optional tool adapters
   - web, Context7/library docs, file search, remote MCP, browser, PPT/deck parser, paper search.
7. Sufficiency criteria
   - enough query families, source mix, risk/limitation pass, contradiction handling, explicit stop condition.
8. Handoff format
   - context pack for the next worker with assumptions, do-not-assume list, next step, and install recommendations.
9. Reviewer role
   - independent check for source quality, missing evidence, skipped tools, and handoff usability.
10. Research state snapshot
   - research questions, query families, source count, unresolved questions, and synthesis status.
11. Source ledger
   - stable source ids, titles, URLs/paths, source type, checked date, and which claims use each source.
12. Claim support check
   - claim id, source id, support verdict, evidence locator or quote summary, and reviewer note.

## Good Defaults

- Prefer official/primary/local evidence before secondary commentary.
- Use multiple query families before declaring research sufficient.
- Record skipped optional tools instead of blocking.
- Preserve uncertainty; do not flatten contradictions into a confident summary.
- Keep implementation and final decision authority outside the research role.
- Store research artifacts under the project root, not in global/user directories.
- Assign stable source ids so repeated citations to the same URL/path do not drift.
- Track the research state separately from the final summary so another agent can see what was searched and what remains open.
- Verify whether cited sources actually support the claim, not merely whether a source URL exists.

## Anti-Patterns

- Searching only the user's raw wording.
- Stopping after one or two searches because some plausible sources appeared.
- Mixing claims, evidence, and recommendations in prose without a table.
- Treating missing Context7/web/browser/parser tools as task failure.
- Letting the research agent edit implementation or deck output while gathering context.
- Reporting sources without checked dates for current or version-sensitive claims.
- Repeating the same URL under multiple names without a source ledger.
- Providing a final synthesis without the intermediate research state needed to review coverage.
- Treating a citation as valid because the URL exists while the cited passage does not support the claim.

## Evidence-Informed Notes

- Deep research systems are usually described as multi-step agents that plan, search/evaluate sources, refine queries, and synthesize with citations.
- OpenAI's deep research docs emphasize multi-step research, source links/citations, and refining searches rather than returning a simple link list.
- Research-agent product docs commonly highlight source credibility, multi-source synthesis, citation tracking, and different depth modes.
- Agent architecture surveys emphasize planning, tool use, memory/context management, and verification/evaluation as separate concerns.
- LangChain's deep research agent pattern plans subtasks, delegates research, then consolidates unique URLs into one citation numbering system.
- LlamaIndex citation workflows split retrieved content into source-labeled nodes before synthesis, which supports claim-level traceability.
- LangGraph-style research implementations often make the accumulated plan, subtasks, search results, analyses, and final report explicit state.
- Citation-verification work evaluates statement/source pairs with verdicts such as supported, unsupported, contradicted, unverifiable, or unknown.
