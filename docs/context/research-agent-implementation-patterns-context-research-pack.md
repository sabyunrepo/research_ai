# Context Research Pack

Status: PASS
Task: Research how other systems implement research agents and improve the local orchestrator
Artifact owner: context-research-orchestrator-agent
Created: 2026-05-30
Updated: 2026-05-30
Project root: /Users/sabyun/goinfre/research_ai
Brainstorming phase: both
Recommended next action: Keep Source Ledger and Claim Support Check as mandatory fields, then consider a future helper script that generates source ids and claim support rows from evidence.

## 1. Context Triage

### Task Classification

| field | value |
|---|---|
| 작업 유형 | research-agent implementation pattern research |
| 예상 산출물 | implementation-pattern context pack plus orchestrator improvements |
| 위험도 | medium |
| 최신성 필요 | yes |
| 로컬 조사 필요 | yes |
| 외부 검색 필요 | yes |
| 라이브러리/API 문서 필요 | yes |
| PPT/deck/report 자료 필요 | no |
| high-stakes domain | no |

### Tool Detection

| tool | available | used | fallback | note |
|---|---:|---:|---|---|
| local search | yes | yes | n/a | Existing skill, validator, template, and packs inspected |
| web search | yes | yes | official/primary/implementation docs | Ran three search batches after user noted shallow search behavior |
| Context7 | no | no | official docs and web search | Optional install recommendation only |
| docs/parser tool | no | no | web snippets and opened source pages | No binary parser needed |
| browser/screenshot | no | no | static review | No UI changed |

### Must-Read Context

| path/source | why it matters | status |
|---|---|---|
| `.codex/skills/context-research-orchestrator/SKILL.md` | Main skill contract to improve | read |
| `.codex/skills/context-research-orchestrator/templates/context-research-pack.md` | Output contract to improve | read |
| `.codex/skills/context-research-orchestrator/references/research-agent-design.md` | Design reference to improve | read |
| `scripts/validate-context-research-pack.js` | Validator contract to improve | read |
| LangChain deep research docs | Implementation pattern with todo planning, subagents, unique URL citations | read |
| LlamaIndex citation workflow docs | Source-labeled citation nodes before synthesis | read |
| OpenAI deep research API guide | Data-source/tool and metadata expectations | read |
| LlamaIndex research assistant docs | Tool composition for browser/search/extraction | read |
| Economic research agent paper | Explicit ResearchState fields | read |
| Citation-verification search results | Claim/source support verification patterns | read |

### Pre-Brainstorm Notes

- The prior implementation already added query families, sufficiency, source taxonomy, and validator enforcement.
- The user's observation was correct: one web search batch with several query strings is not the same as iterative research.
- Other implementations emphasize persistent state, source/citation ledgers, unique URL citation numbering, and claim-source support verification.

### Questions For Brainstorming

- Which implementation patterns are missing from the local orchestrator?
- Which patterns are worth adding now without overbuilding?
- What should be validator-enforced versus reviewer-enforced?

## 2. Brainstorming Summary

### Agreed Goal

Use external implementation patterns to improve the local research agent so it does not merely search a few terms and summarize.

### Chosen Direction

Add Source Ledger, Research State Snapshot, and Claim Support Check to the pack contract. These add traceability without requiring a full research-agent runtime or new dependency.

### Rejected Alternatives

| alternative | why rejected |
|---|---|
| Build a LangGraph/LangChain runtime now | Too large for issue 4 and introduces dependencies not needed for the repo-local contract |
| Hard-require citation verification APIs | Optional external services should not block this shared skill |
| Only add more prose to SKILL.md | The pack and validator need enforceable fields, not just guidance |

### Research Questions After Brainstorming

- How do real deep research implementations preserve research state?
- How do they manage citations and repeated URLs?
- How do they verify whether sources support claims?
- Which improvements can be encoded in the local pack/validator now?

## 3. Targeted Research

### Search Plan

| research question | query family | example queries | source target | status |
|---|---|---|---|---|
| How do implementation docs structure deep research agents? | framework implementation docs | `LangChain deep research agent implementation citations`, `LlamaIndex research assistant workflow tools` | official | searched |
| How do systems manage citation/source ledgers? | citation ledger and source nodes | `LlamaIndex inline citations source nodes`, `LangChain consolidate unique URL citations` | official | searched |
| How do implementations preserve research state? | state graph research agent | `LangGraph research state research_plan subtasks search_results final_report`, `economic research agent ResearchState LangGraph` | primary | searched |
| How do systems verify citations support claims? | claim citation verification | `citation verification deep research agents supported unsupported unknown`, `source attribution evaluation LLM deep research agents` | primary/secondary | searched |
| What local contract changes are feasible now? | local gap check | `context research pack source ledger claim support check validator` | local | searched |

### Search Iterations

| iteration | query families used | new evidence found | unresolved questions | next action |
|---|---|---|---|---|
| 1 | framework implementation docs, citation ledger, OpenAI deep research API, LlamaIndex research assistant | Found planning/subagent/synthesis pattern, source-labeled nodes, tool data-source expectations, and browser/search/extraction tool composition | Needed stronger evidence for state and citation support verification | search again |
| 2 | state graph research agent, open deep research implementations, economic research agent paper | Found explicit `ResearchState` fields and multi-stage synthesis/state flow | Needed citation-support evaluation pattern | search again |
| 3 | claim citation verification, support verdicts, source attribution evaluation | Found supported/unsupported/unknown verdict patterns and statement-URL pair evaluation | Exact automated verification implementation can remain future work | stop |

### Evidence Table

| claim id | claim | evidence | source id(s) | source type | checked date | confidence | relevance |
|---|---|---|---|---|---|---|---|
| C1 | Deep research implementations benefit from an explicit plan, delegated research, and synthesis stage. | LangChain's deep research guide instructs the agent to create a todo list, save the request, delegate research tasks to subagents, and synthesize findings while consolidating citations. | S1 | official | 2026-05-30 | high | Supports keeping plan/search/synthesis stages explicit |
| C2 | Source ledgers should assign one stable number/id per unique URL. | LangChain's guide says each unique URL gets one citation number across all subagent findings and the final report ends with a sources section. | S1 | official | 2026-05-30 | high | Supports mandatory Source Ledger |
| C3 | Citation workflows can label retrieved content chunks as sources before synthesis. | LlamaIndex citation workflow splits retrieved text into source-labeled nodes before synthesis. | S2 | official | 2026-05-30 | high | Supports source ids and evidence locators |
| C4 | Deep research systems should accept multiple data-source lanes. | OpenAI API guide says deep research must include at least one source such as web search, remote MCP, or file search, and can use code interpreter for analysis. | S3 | official | 2026-05-30 | high | Supports optional adapter lanes |
| C5 | Research assistants often combine search, browser interaction, and extraction tools. | LlamaIndex AgentWorkflow example combines DuckDuckGo search, Playwright browser tools, and AgentQL extraction for metadata. | S4 | official | 2026-05-30 | high | Supports tool routing and optional parser/browser lanes |
| C6 | Research state should be explicit and accumulated. | The economic research agent paper shows `ResearchState` fields including question, research_plan, subtasks, search_results, analysis_results, and final_report. | S5 | primary | 2026-05-30 | high | Supports Research State Snapshot |
| C7 | Citation presence is not enough; support must be checked. | Citation-verification literature evaluates whether cited content actually supports statements, with verdicts such as supported, unsupported, contradicted, or unknown. | S6, S7 | primary | 2026-05-30 | medium | Supports Claim Support Check |
| C8 | The local contract previously lacked source ids and claim-support verdicts. | Existing pack had Evidence Table and Raw Source List but no stable source id ledger or claim-source support table before this change. | S8 | local | 2026-05-30 | high | Justifies the implementation improvement |

### Sufficiency Check

| criterion | status | evidence / note |
|---|---|---|
| enough distinct query families used | pass | 5 query families, 3 search iterations |
| official/primary sources checked | pass | LangChain, LlamaIndex, OpenAI docs, AEA paper, arXiv citation-verification papers |
| local project context checked when relevant | pass | Skill, template, reference, validator, and previous packs inspected |
| implementation/example evidence checked when relevant | pass | Framework docs and paper implementation state were checked |
| risk/limitation/deprecation checked | pass | Citation laundering/support verification risk recorded |
| contradictions or uncertainty recorded | pass | Automated verification is left as future work; current contract records verdicts manually |
| stop condition is explicit | pass | Stopped after state, source-ledger, and claim-support patterns were covered |

### Stop Condition

- Stopped after three search iterations because implementation patterns converged on the same missing pieces: persistent research state, stable source ledger, and claim-source support verification. Full automated citation verification is a future implementation, not necessary for the current issue 4 contract.

### Limiting Constraint

| constraint type | evidence / note |
|---|---|
| none | Research met the minimum query-family and source-coverage bar. |

### Research State Snapshot

| state item | value |
|---|---|
| research questions tracked | 5 |
| searched query families | 5 |
| sources reviewed | 15+ |
| official/primary/local sources used | LangChain docs, LlamaIndex docs, OpenAI docs, AEA paper, arXiv papers, local files |
| unresolved questions | Whether to automate claim-support verification in a future helper script |
| synthesis status | complete |

### Source Ledger

| source id | title | url/path | source type | checked date | used by claims |
|---|---|---|---|---|---|
| S1 | LangChain deep research guide | https://docs.langchain.com/oss/python/deepagents/deep-research | official | 2026-05-30 | C1, C2 |
| S2 | LlamaIndex citation workflow | https://developers.llamaindex.ai/python/examples/workflow/citation_query_engine/ | official | 2026-05-30 | C3 |
| S3 | OpenAI deep research API guide | https://platform.openai.com/docs/guides/deep-research | official | 2026-05-30 | C4 |
| S4 | LlamaIndex research assistant workflow | https://developers.llamaindex.ai/python/examples/agent/agent_workflow_research_assistant/ | official | 2026-05-30 | C5 |
| S5 | AI Agents for Economic Research | https://www.aeaweb.org/content/file?id=23290 | primary | 2026-05-30 | C6 |
| S6 | Cited but Not Verified | https://arxiv.org/abs/2605.06635 | primary | 2026-05-30 | C7 |
| S7 | DeepSciVerify | https://arxiv.org/abs/2605.27710 | primary | 2026-05-30 | C7 |
| S8 | Local orchestrator files | `.codex/skills/context-research-orchestrator/*`, `scripts/validate-context-research-pack.js` | local | 2026-05-30 | C8 |

### Claim Support Check

| claim id | source id | support verdict | evidence locator / quote summary | reviewer note |
|---|---|---|---|---|
| C1 | S1 | supported | LangChain guide lists plan, save request, delegate research, synthesize, and citation numbering steps | Supports source ledger and staged flow |
| C2 | S1 | supported | LangChain guide describes assigning stable citation numbers to unique URLs | Supports Source Ledger |
| C3 | S2 | supported | LlamaIndex workflow creates source-labeled nodes before synthesis | Supports source ids and evidence locator |
| C4 | S3 | supported | OpenAI guide lists web search, remote MCP, file search, and code interpreter lanes | Supports optional tool adapter model |
| C5 | S4 | supported | LlamaIndex research assistant combines search, browser, and extraction tools | Supports tool routing |
| C6 | S5 | supported | Paper lists `ResearchState` fields for plan, subtasks, search results, analyses, and final report | Supports Research State Snapshot |
| C7 | S6 | supported | Paper describes evaluating cited content against source support | Supports Claim Support Check |
| C7 | S7 | supported | Paper describes citation verification verdicts around source support | Supports Claim Support Check |
| C8 | S8 | supported | Local pack contract previously lacked Source Ledger and Claim Support Check | Supports local improvement |

### Local Findings

| file | finding | relevance |
|---|---|---|
| `.codex/skills/context-research-orchestrator/templates/context-research-pack.md` | Added Research State Snapshot, Source Ledger, and Claim Support Check | Makes handoff more auditable |
| `.codex/skills/context-research-orchestrator/references/research-agent-design.md` | Added source ledger and claim support check to material list | Makes future reviewers faster |
| `scripts/validate-context-research-pack.js` | Added required headings and PASS constraints for source ledger/support verdicts | Makes weak packs fail earlier |

### External Findings

| source | source type | finding | checked date |
|---|---|---|---|
| https://docs.langchain.com/oss/python/deepagents/deep-research | official | Plan/delegate/synthesize flow and unique URL citation numbering | 2026-05-30 |
| https://developers.llamaindex.ai/python/examples/workflow/citation_query_engine/ | official | Source-labeled chunks before synthesis | 2026-05-30 |
| https://platform.openai.com/docs/guides/deep-research | official | Multiple data-source lanes including web search, file search, remote MCP | 2026-05-30 |
| https://developers.llamaindex.ai/python/examples/agent/agent_workflow_research_assistant/ | official | Search, browser, and extraction tool composition | 2026-05-30 |
| https://www.aeaweb.org/content/file?id=23290 | primary | ResearchState fields for graph-based research agent | 2026-05-30 |
| https://arxiv.org/abs/2605.06635 | primary | Citation support evaluation for deep research agents | 2026-05-30 |
| https://arxiv.org/abs/2605.27710 | primary | Evidence escalation for scientific claim-citation verification | 2026-05-30 |

### Implementation Feasibility

- 가능: Add source ledger, research state snapshot, and claim support check now.
- 조건부 가능: Automate claim-support verification later with a helper script or external verifier.
- 불가능/비추천: Add a full LangGraph/LangChain runtime as part of this repo-local contract task.
- 필요한 라이브러리/도구: None for the contract improvement.
- 대체안: Reviewer agent can fill support verdicts manually until automation exists.

### Risks / Unknowns

- Claim Support Check is currently a structured human/agent review field, not automated citation verification.
- More sources do not guarantee better citation accuracy; support verdicts matter more than raw source count.
- Exact evidence locator format may need tightening after repeated real-world use.

## 4. Context Pack For Next Agent

### Use This Context

- Treat Source Ledger as the canonical source id registry for each pack.
- Treat Claim Support Check as a required citation-quality surface for PASS packs.
- Keep Research State Snapshot small but explicit enough for another agent to assess coverage.
- Use external verifier tools only as optional adapters; do not require them for the shared skill.

### Do Not Assume

- Do not assume cited URLs support the claims just because they exist.
- Do not assume more search calls means better citation quality.
- Do not build a full runtime before the contract proves useful across tasks.

### Recommended Next Step

- Run validator on all packs after adding the new required sections.
- Consider a future script that checks every Evidence Table source against Source Ledger source ids.

### Install Recommendations

- Context7 remains recommended for future library/API-heavy research.
- A citation-verification tool can be considered later if the team starts producing public reports from these packs.

### Raw Source List

- https://docs.langchain.com/oss/python/deepagents/deep-research
- https://developers.llamaindex.ai/python/examples/workflow/citation_query_engine/
- https://platform.openai.com/docs/guides/deep-research
- https://developers.llamaindex.ai/python/examples/agent/agent_workflow_research_assistant/
- https://www.aeaweb.org/content/file?id=23290
- https://arxiv.org/abs/2605.06635
- https://arxiv.org/abs/2605.27710
- `.codex/skills/context-research-orchestrator/templates/context-research-pack.md`
- `.codex/skills/context-research-orchestrator/references/research-agent-design.md`
- `scripts/validate-context-research-pack.js`
