# Context Research Pack

Status: PASS
Task: Research agent material composition and design evidence refresh
Artifact owner: context-research-orchestrator-agent
Created: 2026-05-30
Updated: 2026-05-30
Project root: /Users/sabyun/goinfre/research_ai
Brainstorming phase: both
Recommended next action: Keep the orchestrator's two-pass workflow and use the new `references/research-agent-design.md` as the checklist for future research-agent improvements.

## 1. Context Triage

### Task Classification

| field | value |
|---|---|
| 작업 유형 | research-agent design research |
| 예상 산출물 | source-backed context pack and improved research-agent design reference |
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
| local search | yes | yes | n/a | Existing skill, validator, and prior context packs checked |
| web search | yes | yes | official/primary/secondary web sources | Used multiple query families |
| Context7 | no | no | official docs and web search | Recommend only for future library/API-heavy work |
| docs/parser tool | no | no | web snippets and opened pages | No binary document parsing required |
| browser/screenshot | no | no | static file review | No UI changed |

### Must-Read Context

| path/source | why it matters | status |
|---|---|---|
| `.codex/skills/context-research-orchestrator/SKILL.md` | Current research orchestrator contract | read |
| `.codex/skills/context-research-orchestrator/references/search-strategy.md` | Current query-family and sufficiency loop | read |
| `.codex/skills/context-research-orchestrator/references/source-taxonomy.md` | Current evidence classification | read |
| `docs/context/issue-4-context-research-pack.md` | Prior issue-specific research artifact | read |
| `docs/context/research-skills-config-test-context-research-pack.md` | Prior dogfood test artifact | read |
| OpenAI deep research docs | Current official pattern for multi-step research with citations | read |
| Agno research-agent docs | Research-agent production example with source credibility and depth modes | read |
| AI agent architecture survey pages | Primary/academic evidence for planning/tool/evaluation separation | read |

### Pre-Brainstorm Notes

- The current orchestrator already has search strategy, source taxonomy, template, validator, and reviewer roles.
- The missing piece is an explicit "research agent material composition" reference that future workers can read without reconstructing it from multiple context packs.
- Research should avoid vendor marketing as the only source; use official docs, product docs, and survey/paper evidence together.

### Questions For Brainstorming

- What should a research agent carry as stable reusable materials?
- Which external patterns should influence the local design?
- What should be added to the skill so the next worker does not repeat this research?

## 2. Brainstorming Summary

### Agreed Goal

Refresh the evidence for research-agent composition and improve the local orchestrator with a durable reference file.

### Chosen Direction

Use the existing orchestrator as the base and add a `research-agent-design.md` reference describing core loop, required materials, defaults, and anti-patterns.

### Rejected Alternatives

| alternative | why rejected |
|---|---|
| Replace the whole skill with a long monolithic SKILL.md | Would make every invocation load too much context |
| Depend on one vendor's deep research docs only | Too narrow and product-specific |
| Add more validator rules for source counts immediately | Source count thresholds depend on task class and should stay in search strategy for now |

### Research Questions After Brainstorming

- What architecture loop is common across deep research agents?
- What source/evidence controls are repeatedly recommended?
- What local materials should the research agent include?
- What should remain outside the research agent role?

## 3. Targeted Research

### Search Plan

| research question | query family | example queries | source target | status |
|---|---|---|---|---|
| What loop do deep research agents use? | deep research architecture loop | `AI research agent architecture query planning source verification evidence synthesis`, `agentic research workflow query generation iterative search sufficiency criteria` | primary/secondary | searched |
| What do official deep research tools emphasize? | official deep research docs | `OpenAI deep research system searches synthesizes sources citations official`, `OpenAI deep research safety evaluation source citations official documentation` | official | searched |
| What do production research-agent docs include? | research agent product docs | `Research Agent source credibility multi-source synthesis citation tracking docs`, `Agno research agent source credibility research depth` | official | searched |
| What do agent architecture surveys say about materials? | agent architecture surveys | `AI agent systems architectures planning tool use evaluation survey`, `AI agent harness context management tool systems orchestration survey` | primary | searched |
| What should local implementation add? | local orchestrator gap check | `context research orchestrator search strategy source taxonomy local validator`, `research-agent-design reference local skill` | local | searched |

### Search Iterations

| iteration | query families used | new evidence found | unresolved questions | next action |
|---|---|---|---|---|
| 1 | deep research architecture loop, production research-agent docs, agent surveys | Found recurring plan/search/read/reflect/iterate/synthesize pattern, credibility/citation tracking, and architecture concerns around planning/tool/evaluation | Needed stronger official source on citations and iterative search | search again |
| 2 | OpenAI official deep research docs, OpenAI API/help/academy pages, local gap check | Confirmed official descriptions of multi-step research, refined queries, citations/source links, and data-source requirements | Source count threshold varies by task and should not be hard-coded globally | stop |

### Evidence Table

| claim id | claim | evidence | source id(s) | source type | checked date | confidence | relevance |
|---|---|---|---|---|---|---|---|
| C1 | A useful research agent should run a multi-step loop rather than one or two searches. | OpenAI Academy describes deep research as agentic: it plans, performs multi-step research, searches, evaluates sources, refines queries, and synthesizes findings. | S1 | official | 2026-05-30 | high | Supports the skill's query-family and iteration loop |
| C2 | Deep research outputs should preserve citations/source links for verification. | OpenAI Help Center says Deep Research outputs include citations or source links so users can verify information. | S2 | official | 2026-05-30 | high | Supports evidence table and raw source list |
| C3 | Deep research API design requires at least one data source and supports controlling total tool calls. | OpenAI API deep research guide says requests must include at least one data source such as web search, remote MCP, or file search, and `max_tool_calls` controls tool-call budget. | S3 | official | 2026-05-30 | high | Supports optional adapter lanes and explicit stop/budget conditions |
| C4 | Production research-agent examples include source credibility, multi-source synthesis, citations, and research depth. | Agno docs describe a research workflow with web search, content extraction, source evaluation, multi-source synthesis, citation tracking, and quick/deep/comparative research modes. | S4 | official | 2026-05-30 | high | Supports source taxonomy, sufficiency, and depth modes |
| C5 | Agent architectures need planning, tool use, context/memory management, and evaluation as distinct concerns. | AI Agent Systems survey summary lists reasoning/decomposition/reflection, planning/control, tool calling, and evaluation challenges. | S5 | primary | 2026-05-30 | medium | Supports separating research agent, reviewer, and implementation roles |
| C6 | Agent harness research identifies context management, tool systems, safety mechanisms, and orchestration as recurring design dimensions. | Architectural Design Decisions in AI Agent Harnesses summary reports recurring dimensions: subagent architecture, context management, tool systems, safety mechanisms, and orchestration. | S6 | primary | 2026-05-30 | medium | Supports the material list in `research-agent-design.md` |
| C7 | The local orchestrator now has most required materials but needed a durable design reference. | Local files already include search strategy, source taxonomy, template, validator, and reviewer agents; no single file summarized research-agent materials. | S7 | local | 2026-05-30 | high | Justifies adding `references/research-agent-design.md` |

### Sufficiency Check

| criterion | status | evidence / note |
|---|---|---|
| enough distinct query families used | pass | 5 query families covered architecture loop, official deep research docs, production docs, surveys, and local gap check |
| official/primary sources checked | pass | OpenAI official docs, Agno official docs, Hugging Face/arXiv survey summaries |
| local project context checked when relevant | pass | Existing orchestrator skill, search strategy, source taxonomy, validator, and prior packs checked |
| implementation/example evidence checked when relevant | pass | Agno production research-agent docs and OpenAI API guide checked |
| risk/limitation/deprecation checked | pass | Tool-call budget, data-source requirement, and source verification needs recorded |
| contradictions or uncertainty recorded | pass | Source count should remain task-dependent, not a hard global validator rule |
| stop condition is explicit | pass | Stopped after official/primary/local evidence covered the design and remaining threshold choices were policy decisions |

### Stop Condition

- Stopped after two search iterations because the design question had official, primary, production-doc, and local evidence; the remaining question of exact source-count thresholds depends on task class and should remain configurable via search strategy.

### Limiting Constraint

| constraint type | evidence / note |
|---|---|
| none | Research met the minimum query-family and source-coverage bar. |

### Research State Snapshot

| state item | value |
|---|---|
| research questions tracked | 5 |
| searched query families | 5 |
| sources reviewed | 10+ |
| official/primary/local sources used | OpenAI docs/help/API, Agno docs, Hugging Face/arXiv survey summaries, local orchestrator files |
| unresolved questions | exact source-count thresholds remain task-class dependent |
| synthesis status | complete |

### Source Ledger

| source id | title | url/path | source type | checked date | used by claims |
|---|---|---|---|---|---|
| S1 | OpenAI Academy search and deep research | https://openai.com/academy/search-and-deep-research/ | official | 2026-05-30 | C1 |
| S2 | OpenAI Research FAQ | https://help.openai.com/en/articles/10500283-research-faq | official | 2026-05-30 | C2 |
| S3 | OpenAI deep research API guide | https://platform.openai.com/docs/guides/deep-research | official | 2026-05-30 | C3 |
| S4 | Agno research agent docs | https://docs.agno.com/production/applications/research-agent | official | 2026-05-30 | C4 |
| S5 | AI Agent Systems survey | https://huggingface.co/papers/2601.01743 | primary | 2026-05-30 | C5 |
| S6 | Agent harness architecture paper | https://arxiv.org/abs/2604.18071 | primary | 2026-05-30 | C6 |
| S7 | Local orchestrator files | `.codex/skills/context-research-orchestrator/SKILL.md`, references, validator | local | 2026-05-30 | C7 |

### Claim Support Check

| claim id | source id | support verdict | evidence locator / quote summary | reviewer note |
|---|---|---|---|---|
| C1 | S1 | supported | OpenAI Academy describes multi-step research, source evaluation, query refinement, and synthesis | Supports research loop |
| C2 | S2 | supported | FAQ describes citations/source links for verification | Supports source link requirement |
| C3 | S3 | supported | API guide requires data source and describes web/file/MCP/code tools | Supports tool adapter lanes |
| C4 | S4 | supported | Agno docs describe source credibility, synthesis, citation tracking, and depth modes | Supports source taxonomy/depth |
| C5 | S5 | supported | Survey summary lists planning, tool use, reflection, evaluation challenges | Supports separated roles |
| C6 | S6 | supported | Harness architecture summary lists context management, tool systems, safety, orchestration | Supports material checklist |
| C7 | S7 | supported | Local files had no single material checklist before this change | Supports adding research-agent-design reference |

### Local Findings

| file | finding | relevance |
|---|---|---|
| `.codex/skills/context-research-orchestrator/SKILL.md` | Owns routing, optional tool policy, two-pass research, and validation instructions | Main skill remains the entrypoint |
| `.codex/skills/context-research-orchestrator/references/search-strategy.md` | Defines query construction, minimum breadth, iteration, and stop conditions | Addresses previous shallow-search weakness |
| `.codex/skills/context-research-orchestrator/references/source-taxonomy.md` | Defines source type and confidence labels | Supports evidence table consistency |
| `.codex/agents/context-research-reviewer-agent.md` | Defines independent review for pack quality | Supports verification/evaluation separation |
| `.codex/skills/context-research-orchestrator/references/research-agent-design.md` | Added concise composition checklist for future agent improvements | New durable design material |

### External Findings

| source | source type | finding | checked date |
|---|---|---|---|
| https://openai.com/academy/search-and-deep-research/ | official | Deep research is multi-step, agentic, query-refining, source-evaluating synthesis | 2026-05-30 |
| https://help.openai.com/en/articles/10500283-research-faq | official | Deep Research includes citations/source links for verification | 2026-05-30 |
| https://platform.openai.com/docs/guides/deep-research | official | Deep research requires at least one data source and can bound tool calls | 2026-05-30 |
| https://docs.agno.com/production/applications/research-agent | official | Research-agent example includes source evaluation, multi-source synthesis, citation tracking, and depth modes | 2026-05-30 |
| https://huggingface.co/papers/2601.01743 | primary | Agent systems survey emphasizes planning, tool use, reflection/verification, and evaluation challenges | 2026-05-30 |
| https://arxiv.org/abs/2604.18071 | primary | Agent harness study identifies context management, tool systems, safety, and orchestration dimensions | 2026-05-30 |

### Implementation Feasibility

- 가능: Keep the current orchestrator structure and add a compact design reference.
- 조건부 가능: Add configurable thresholds by task class later if repeated use shows the validator should enforce more source-count rules.
- 불가능/비추천: Hard-code one universal source count for every research task.
- 필요한 라이브러리/도구: None for this improvement.
- 대체안: If future users want automatic query generation, add a deterministic helper script that expands research questions into query families.

### Risks / Unknowns

- Some sources are vendor documentation about their own products; the pack therefore also includes survey/paper evidence.
- Exact source-count targets vary by task class, depth, and budget. The current reference should guide, not overconstrain.
- Context7 remains unavailable locally, so library-doc behavior is based on official web docs rather than direct tool invocation.

## 4. Context Pack For Next Agent

### Use This Context

- For research-agent composition, read `.codex/skills/context-research-orchestrator/references/research-agent-design.md`.
- Keep the operational loop as `Plan -> Search -> Read -> Reflect -> Iterate -> Synthesize`, extended with project rules and handoff storage.
- Preserve role boundaries: research gathers evidence; reviewer checks sufficiency; implementation/deck agents act on the pack.
- Keep query family and sufficiency tracking mandatory for non-trivial research.

### Do Not Assume

- Do not assume two searches are enough.
- Do not use raw user wording as the only query set.
- Do not hard-code a universal source count threshold.
- Do not treat vendor deep-research docs as the only evidence.
- Do not write research artifacts outside the project root.

### Recommended Next Step

- Use the new design reference during the next review of issue 4.
- If future runs still produce weak search terms, add a helper script that expands research questions into query families and writes the `Search Plan` table.

### Install Recommendations

- Context7 remains recommended for future library/API-heavy research but is not required for general research-agent design work.
- No extra parser or browser tool is needed for this research-agent composition pass.

### Raw Source List

- https://openai.com/academy/search-and-deep-research/
- https://help.openai.com/en/articles/10500283-research-faq
- https://platform.openai.com/docs/guides/deep-research
- https://docs.agno.com/production/applications/research-agent
- https://huggingface.co/papers/2601.01743
- https://arxiv.org/abs/2604.18071
- `.codex/skills/context-research-orchestrator/SKILL.md`
- `.codex/skills/context-research-orchestrator/references/search-strategy.md`
- `.codex/skills/context-research-orchestrator/references/source-taxonomy.md`
- `.codex/agents/context-research-reviewer-agent.md`
- `.codex/skills/context-research-orchestrator/references/research-agent-design.md`
