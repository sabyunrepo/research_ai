# Context Research Pack

Status: PASS
Task: Issue 5 self-improving verification orchestrator and dynamic verifier agent plan
Artifact owner: Codex main agent
Created: 2026-05-30
Updated: 2026-05-30
Project root: /Users/sabyun/goinfre/research_ai
Brainstorming phase: both
Recommended next action: writing-plans

## 1. Context Triage

### Task Classification

| field | value |
|---|---|
| 작업 유형 | architecture/design shared workflow |
| 예상 산출물 | implementation plan for reusable verification orchestrator, self-improvement loop, persistent verifier level state, and harness upgrade path |
| 위험도 | high |
| 최신성 필요 | yes |
| 로컬 조사 필요 | yes |
| 외부 검색 필요 | yes |
| 라이브러리/API 문서 필요 | yes |
| PPT/deck/report 자료 필요 | no |
| high-stakes domain | no |

### Tool Detection

| tool | available | used | fallback | note |
|---|---:|---:|---|---|
| local search | yes | yes | n/a | Used `rg`, `sed`, and `gh issue view 5` for repo context. |
| web search | yes | yes | n/a | Used web search and a delegated search agent for current agent/eval/memory patterns. |
| Context7 | no | no | official docs / package docs | Not available in this session; official docs and primary papers were used instead. |
| docs/parser tool | yes | yes | local text extraction | Local markdown and script files were read directly. |
| browser/screenshot | yes | no | static file review | Not needed for planning-only workflow design. |

### Must-Read Context

| path/source | why it matters | status |
|---|---|---|
| GitHub issue #5 | Defines the requested baseline: verification-orchestrator Skill, verifier matrix, review brief, verdict format, and non-scope boundaries. | read |
| `AGENTS.md` | Project-level rules require project-local artifacts, context pack validation, and strict verifier independence. | read |
| `.codex/skills/context-research-orchestrator/SKILL.md` | Governs this research workflow and required context pack structure. | read |
| `.codex/skills/context-research-orchestrator/references/research-agent-design.md` | Provides local reusable research-agent loop and evidence schema pattern. | read |
| `practice-harness/agents/critical-practice-harness-verifier-agent.md` | Strongest local verifier pattern, including five-pass loop and evidence-hostile review stance. | read |
| `deck-harness/agents/verification-agent.md` | Existing deck-harness reviewer role and report contract. | read |
| `lecture-cuts/agents/harness-verification-agent.md` | Existing lecture-cuts verification matrix and handoff gate model. | read |
| `lecture-cuts/skills/verification-gate/SKILL.md` | Existing gate procedure and stop conditions for lecture-cuts work. | read |
| Memory registry entries for research_ai hooks and deck boundaries | Prior project memory confirms project-local hook flow and golden deck boundary conventions. | read |

### Pre-Brainstorm Notes

- Issue #5 already rejects a single giant verifier agent and instead proposes a `verification-orchestrator` Skill that routes work to specialized verifier agents.
- The user's new requirement adds self-improvement behavior: when verification cannot pass, the system should improve itself, retry verification, and persist the improved verification level for future runs.
- The safe interpretation is not autonomous prompt mutation. It is evidence-backed verifier capability promotion through versioned rules, test cases, and state artifacts.
- Since the goal is shareable across projects and users, project-specific rules must be injected as adapters, not baked into the core verifier prompt.

### Questions For Brainstorming

- What should be persisted: verifier level, learned failure patterns, promoted checks, or full agent prompts?
- Who is allowed to approve a verifier level promotion?
- Which artifacts are portable core versus project-local adapter?
- What counts as a self-improvement success: better evidence collection, better routing, stronger rubric, new deterministic check, or passing the task itself?

## 2. Brainstorming Summary

### Agreed Goal

Design a reusable verification agent system based on issue #5 that can dynamically choose or generate verifier briefs for different tasks, retry with self-improvement when verification cannot pass, accept a user-provided maximum retry count with default 5, and persist approved verification capability improvements so future runs start at the improved level.

### Chosen Direction

Build a shared `verification-orchestrator` as a Skill/workflow core, not as one all-purpose agent. Add a persistent `verification-capability-state` artifact and a governed `self-improvement loop`:

1. Classify task and target artifacts.
2. Route to verifier profiles from a registry and generate a task-specific review brief.
3. Run evidence collection and verifier passes.
4. If verification fails or lacks evidence, create an improvement proposal.
5. Apply only bounded, evidence-backed improvements to verifier rules, routing matrix, scripts, templates, or project adapters.
6. Retry until PASS, blocked condition, or max attempts.
7. Promote verified improvements into persistent state so the next run starts from the latest approved level.

### Rejected Alternatives

| alternative | why rejected |
|---|---|
| One giant universal verifier prompt | Issue #5 warns it blurs task-specific criteria; external patterns also favor routing and evaluator-optimizer separation. |
| Let the verifier silently edit its own prompt every failure | Creates reward hacking and prompt drift risk; improvements must be structured, reviewable, and evidence-backed. |
| Persist all conversation history as memory | Too noisy, privacy-sensitive, and hard to reuse; persist only distilled failure patterns, promoted checks, and level state. |
| Treat LLM judge PASS as sufficient | Agent eval sources and local harness rules require command/browser/source evidence, not final-text judgment alone. |

### Research Questions After Brainstorming

- Which agent workflow patterns support evaluator-optimizer loops with bounded retries?
- How should self-reflection and self-correction be represented without unsafe self-modifying behavior?
- How should cross-run memory be split between current run state and long-term capability state?
- How can dynamic verifier routing be made portable across projects?
- Which guardrails are required to prevent reward hacking, excessive agency, and unsafe tool use?

## 3. Targeted Research

### Search Plan

| research question | query family | example queries | source target | status |
|---|---|---|---|---|
| What is the baseline local architecture for issue #5? | local issue and verifier inventory | `gh issue view 5`, `rg verifier`, `rg verification-orchestrator` | local | searched |
| What reusable loop should guide self-improvement? | self-reflection papers | `Self-Refine iterative refinement`, `Reflexion verbal reinforcement learning` | primary | searched |
| What production workflow pattern matches generator/verifier retries? | evaluator optimizer official docs | `Anthropic evaluator optimizer workflow`, `LangGraph evaluator optimizer workflow` | official | searched |
| How should persistent learning be modeled? | agent memory docs | `LangGraph memory overview`, `Deep Agents long-term memory` | official | searched |
| How can verifier selection be dynamic? | routing and handoff docs | `Anthropic routing workflow`, `OpenAI Agents handoffs`, `AutoGen SelectorGroupChat` | official | searched |
| How should evaluation evidence be structured? | agent eval docs | `LangChain AgentEvals trajectory`, `OpenAI graders`, `Anthropic agent evals` | official | searched |
| What risks constrain self-improving verifier systems? | guardrails and security docs | `OpenAI Agents guardrails`, `OWASP LLM Top 10`, `MCP security best practices`, `reward hacking iterative self refinement` | official|primary | searched |

### Search Iterations

| iteration | query families used | new evidence found | unresolved questions | next action |
|---|---|---|---|---|
| 1 | local issue and verifier inventory; local memory registry | Issue #5 requires orchestrator Skill plus verifier matrix; current repo already has verifier agents with evidence-first PASS/WARN/FAIL contracts. | Need external patterns for safe self-improvement and persistence. | search again |
| 2 | self-reflection papers; evaluator optimizer official docs; agent memory docs | Self-Refine and Reflexion support iterative feedback/refinement; Anthropic and LangGraph describe evaluator-optimizer workflows; LangGraph separates short-term and long-term memory. | Need dynamic verifier routing and guardrail sources. | search again |
| 3 | routing and handoff docs; agent eval docs; guardrails and security docs | Routing/handoff patterns support specialist verifier selection; agent evals support trajectory/rubric evidence; guardrail/security docs justify tripwires and scoped tool permissions. | No blocking unresolved question for planning. | stop |

### Evidence Table

| claim id | claim | evidence | source id(s) | source type | checked date | confidence | relevance |
|---|---|---|---|---|---|---|---|
| C1 | The local implementation should extend issue #5's orchestrator-plus-matrix design, not replace it with one universal verifier. | Issue #5 explicitly proposes `verification-orchestrator` plus task-to-verifier matrix and warns against one giant generic agent. | S1 | local | 2026-05-30 | high | Directly defines task baseline. |
| C2 | Existing local verifier patterns require independent review, evidence paths, PASS/WARN/FAIL, and no silent repair. | Practice, deck, and lecture-cuts verifier agents all separate reviewer responsibility from implementation and require evidence. | S2,S3,S4 | local | 2026-05-30 | high | Provides local compatibility constraints. |
| C3 | Bounded iterative feedback/refinement is a valid agent pattern, but must use explicit stop conditions. | Self-Refine and Reflexion describe iterative feedback/reflection; AutoGen reflection docs describe continuing until max iterations or approval. | S5,S6,S10 | primary|official | 2026-05-30 | high | Supports default 5 retry loop with stops. |
| C4 | The generator/repair worker and evaluator/verifier should be separated. | Anthropic and LangGraph describe evaluator-optimizer workflows where generation and evaluation are distinct stages; local verifier agents also forbid silent repair. | S7,S8,S2,S3 | official|local | 2026-05-30 | high | Core architecture rule. |
| C5 | Persistent improvement should use structured memory/state rather than automatic prompt mutation. | LangGraph separates short-term thread state from long-term memory; Deep Agents memory guidance emphasizes scoped memory and write policy. | S9,S11 | official | 2026-05-30 | high | Supports `verification-capability-state` design. |
| C6 | Dynamic verifier generation should be routing to registered profiles plus generated review briefs, with permanent agents promoted only after repetition. | Anthropic routing, OpenAI handoffs, and AutoGen selector group docs support classifying work and delegating to specialists. | S12,S13,S14 | official | 2026-05-30 | high | Supports task classifier and verifier registry. |
| C7 | Agent verification must evaluate trajectories, tools, state mutations, and evidence, not only final text. | LangChain AgentEvals discusses trajectory evaluation; Anthropic agent evals highlight multi-turn tool use, state mutation, and environment changes; OpenAI graders support rubric/score graders but still require human audit for reliability. | S15,S16,S17 | official | 2026-05-30 | high | Defines evidence collector and final adjudicator scope. |
| C8 | Self-improving verifier systems need guardrails against reward hacking, excessive agency, unsafe tools, and prompt injection. | Reward hacking research warns iterative self-refinement can optimize evaluator scores while human quality declines; OpenAI guardrails, OWASP LLM Top 10, and MCP security best practices define tripwires and tool/security risks. | S18,S19,S20,S21 | primary|official | 2026-05-30 | high | Defines risk controls and approval gates. |
| C9 | Project-local hook and deck boundary rules matter for implementation scope in this repo. | Memory registry records project-local Stop hook flow and workflow-only versus visible lecture-cuts output boundary. | S22 | local | 2026-05-30 | high | Prevents plan from editing visible deck or global files. |

### Sufficiency Check

| criterion | status | evidence / note |
|---|---|---|
| enough distinct query families used | pass | Seven searched query families cover local, papers, workflow docs, memory docs, routing docs, eval docs, and risk docs. |
| official/primary sources checked | pass | Primary papers and official Anthropic, LangGraph/LangChain, OpenAI, AutoGen, OWASP, MCP docs were checked. |
| local project context checked when relevant | pass | Issue #5, AGENTS, local verifier agents, verification Skill, and memory registry were checked. |
| implementation/example evidence checked when relevant | pass | Local verifier files and context-research validator establish concrete artifact/report contracts. |
| risk/limitation/deprecation checked | pass | Reward hacking, guardrails, OWASP LLM risks, and MCP security were checked. |
| contradictions or uncertainty recorded | pass | Iterative self-improvement is useful, but reward hacking risk constrains automatic prompt mutation. |
| stop condition is explicit | pass | Research stopped after local baseline, external loop/memory/routing/eval/risk questions all had supporting sources. |

### Stop Condition

- Research stopped because issue #5 baseline, local verifier contracts, evaluator-optimizer loop evidence, persistent memory design, dynamic routing evidence, agent eval requirements, and major guardrail risks all had direct support from local or official/primary sources. No implementation-blocking unknown remained for writing the plan.

### Limiting Constraint

| constraint type | evidence / note |
|---|---|
| none | Web, local search, GitHub issue lookup, and subagent research were available; Context7 was unavailable but official docs and primary sources covered the needed claims. |

### Research State Snapshot

| state item | value |
|---|---|
| research questions tracked | 5 |
| searched query families | local issue and verifier inventory; self-reflection papers; evaluator optimizer official docs; agent memory docs; routing and handoff docs; agent eval docs; guardrails and security docs |
| sources reviewed | 22 |
| official/primary/local sources used | local issue and files; arXiv papers; Anthropic docs; LangGraph/LangChain docs; OpenAI docs; AutoGen docs; OWASP; MCP |
| unresolved questions | Exact file paths for final implementation package should be decided during implementation, but architecture is sufficient. |
| synthesis status | complete |

### Source Ledger

| source id | title | url/path | source type | checked date | used by claims |
|---|---|---|---|---|---|
| S1 | GitHub issue #5 Agent workflow | https://github.com/sabyunrepo/research_ai/issues/5 | local | 2026-05-30 | C1 |
| S2 | critical-practice-harness-verifier-agent | `practice-harness/agents/critical-practice-harness-verifier-agent.md` | local | 2026-05-30 | C2,C4 |
| S3 | deck-harness verification-agent | `deck-harness/agents/verification-agent.md` | local | 2026-05-30 | C2,C4 |
| S4 | lecture-cuts harness-verification-agent | `lecture-cuts/agents/harness-verification-agent.md` | local | 2026-05-30 | C2 |
| S5 | Self-Refine: Iterative Refinement with Self-Feedback | https://arxiv.org/abs/2303.17651 | primary | 2026-05-30 | C3 |
| S6 | Reflexion: Language Agents with Verbal Reinforcement Learning | https://arxiv.org/abs/2303.11366 | primary | 2026-05-30 | C3 |
| S7 | Anthropic Building Effective Agents | https://www.anthropic.com/research/building-effective-agents | official | 2026-05-30 | C4 |
| S8 | LangGraph workflows and agents | https://docs.langchain.com/oss/python/langgraph/workflows-agents | official | 2026-05-30 | C4 |
| S9 | LangGraph Memory Overview | https://docs.langchain.com/oss/python/langgraph/memory | official | 2026-05-30 | C5 |
| S10 | AutoGen Reflection pattern | https://microsoft.github.io/autogen/dev/user-guide/core-user-guide/design-patterns/reflection.html | official | 2026-05-30 | C3 |
| S11 | LangChain Deep Agents long-term memory | https://docs.langchain.com/oss/python/deepagents/long-term-memory | official | 2026-05-30 | C5 |
| S12 | Anthropic routing workflow | https://www.anthropic.com/research/building-effective-agents | official | 2026-05-30 | C6 |
| S13 | OpenAI Agents SDK multi-agent orchestration | https://openai.github.io/openai-agents-python/multi_agent/ | official | 2026-05-30 | C6 |
| S14 | AutoGen SelectorGroupChat | https://microsoft.github.io/autogen/0.4.4/user-guide/agentchat-user-guide/selector-group-chat.html | official | 2026-05-30 | C6 |
| S15 | LangChain Agent Evals | https://docs.langchain.com/oss/python/langchain/evals | official | 2026-05-30 | C7 |
| S16 | Anthropic Demystifying evals for AI agents | https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents | official | 2026-05-30 | C7 |
| S17 | OpenAI graders | https://platform.openai.com/docs/guides/graders/ | official | 2026-05-30 | C7 |
| S18 | Spontaneous Reward Hacking in Iterative Self-Refinement | https://arxiv.org/abs/2407.04549 | primary | 2026-05-30 | C8 |
| S19 | OpenAI Agents SDK guardrails | https://openai.github.io/openai-agents-python/guardrails/ | official | 2026-05-30 | C8 |
| S20 | OWASP Top 10 for LLM Applications | https://owasp.org/www-project-top-10-for-large-language-model-applications/ | official | 2026-05-30 | C8 |
| S21 | MCP Security Best Practices | https://modelcontextprotocol.io/specification/2025-06-18/basic/security_best_practices | official | 2026-05-30 | C8 |
| S22 | Local memory registry for research_ai hooks and deck boundaries | `/Users/sabyun/.codex/memories/MEMORY.md` | local | 2026-05-30 | C9 |

### Claim Support Check

| claim id | source id | support verdict | evidence locator / quote summary | reviewer note |
|---|---|---|---|---|
| C1 | S1 | supported | Issue body proposal structure and non-scope list. | Direct project issue. |
| C2 | S2 | supported | Role, Five-Pass Verification Loop, Must Fail, Required Report Format. | Strong local verifier precedent. |
| C2 | S3 | supported | Role, Must Pass/Fail, Evidence Rules, Report Format. | Confirms deck-harness reviewer boundary. |
| C2 | S4 | supported | Required Checks, Must Fail If, Evidence Rules. | Confirms lecture-cuts gate precedent. |
| C3 | S5 | supported | Iterative feedback and refinement pattern. | Primary paper. |
| C3 | S6 | supported | Verbal reflection and episodic memory for next attempts. | Primary paper. |
| C3 | S10 | supported | Reflection as generation plus critique until max iterations or approval. | Official framework docs. |
| C4 | S7 | supported | Evaluator-optimizer workflow pattern. | Official design guidance. |
| C4 | S8 | supported | LangGraph evaluator-optimizer workflow. | Official framework docs. |
| C4 | S2 | supported | Independent reviewer, not repair worker. | Local compatibility. |
| C4 | S3 | supported | Reviewer must not silently repair. | Local compatibility. |
| C5 | S9 | supported | Short-term memory as state and long-term memory across sessions. | Official docs. |
| C5 | S11 | supported | Memory scope, persistence, and policy guidance. | Official docs. |
| C6 | S12 | supported | Routing workflow selects specialized downstream path. | Official design guidance. |
| C6 | S13 | supported | Agent handoffs to specialist agents. | Official docs. |
| C6 | S14 | supported | Selector group chooses next agent dynamically from descriptions/context. | Official docs. |
| C7 | S15 | supported | Trajectory and LLM-as-judge agent evals. | Official docs. |
| C7 | S16 | supported | Agent evals include tool use/state/environment concerns. | Official guidance. |
| C7 | S17 | supported | Graders support structured scoring, with reliability caveats. | Official docs. |
| C8 | S18 | supported | Iterative self-refinement can reward-hack evaluator scores. | Primary risk source. |
| C8 | S19 | supported | Input/output/tool guardrails and tripwire pattern. | Official docs. |
| C8 | S20 | supported | LLM app risks include prompt injection and excessive agency. | Official security taxonomy. |
| C8 | S21 | supported | Tool and MCP security boundary guidance. | Official protocol guidance. |
| C9 | S22 | supported | Memory registry lines record project-local Stop hook and workflow-only deck boundary. | Local prior-run evidence. |

### Local Findings

| file | finding | relevance |
|---|---|---|
| GitHub issue #5 | Baseline design is `verification-orchestrator` Skill, templates, matrix, and specialized verifier agents. | Use as implementation spine. |
| `practice-harness/agents/critical-practice-harness-verifier-agent.md` | Already defines five strict verification passes and forbids repair during review. | Reuse as exemplar for strict verifier profiles. |
| `deck-harness/agents/verification-agent.md` | Enforces syntax/source/render/presenter/glossary/handoff review and no silent repairs. | Reuse output contract. |
| `lecture-cuts/agents/harness-verification-agent.md` | Owns verification matrix and handoff sections. | Reuse matrix language. |
| `lecture-cuts/skills/verification-gate/SKILL.md` | Defines command gates, PASS/WARN/FAIL interpretation, and stop conditions. | Reuse for machine gate design. |
| `.codex/skills/context-research-orchestrator/references/research-agent-design.md` | Defines project rules, query plan, local/external search, evidence map, sufficiency check, and handoff pack. | Model for dynamic research/verifier orchestration. |
| `AGENTS.md` | Requires project-local research artifacts and validation; practice verifier must be independent. | Prevent global/user writes and role mixing. |
| Memory registry | Confirms project-local hooks and visible deck output boundary should be respected. | Keeps this plan scoped to harness engineering. |

### External Findings

| source | source type | finding | checked date |
|---|---|---|---|
| Self-Refine | primary | Iterative self-feedback/refinement can improve outputs without training. | 2026-05-30 |
| Reflexion | primary | Natural-language reflection can be stored and reused in later attempts. | 2026-05-30 |
| Anthropic Building Effective Agents | official | Evaluator-optimizer and routing workflows are appropriate for tasks with clear criteria and specialization. | 2026-05-30 |
| LangGraph workflows | official | Evaluator-optimizer can be modeled as generation, evaluation, feedback, and retry. | 2026-05-30 |
| LangGraph memory | official | Short-term run state and long-term cross-session memory should be distinct. | 2026-05-30 |
| AutoGen Reflection and SelectorGroupChat | official | Reflection loops and dynamic agent selection are known multi-agent patterns. | 2026-05-30 |
| OpenAI Agents guardrails | official | Guardrails and tripwires should be explicit, not mixed with ordinary feedback. | 2026-05-30 |
| OWASP LLM Top 10 and MCP security | official | Prompt injection, excessive agency, and tool boundary risks must constrain shared agent systems. | 2026-05-30 |
| Reward hacking paper | primary | Iterative self-refinement can improve evaluator scores while degrading human-preferred quality. | 2026-05-30 |

### Implementation Feasibility

- 가능:
  - Build a project-local prototype under `.codex/skills/verification-orchestrator/`, `.codex/agents/`, and `docs/context/`.
  - Add a portable package layout later for sharing to other projects/users.
  - Store capability level and promoted rules in structured JSON/markdown artifacts under the project root.
  - Generate task-specific review briefs without permanently creating new agent files for every task.
- 조건부 가능:
  - Automatic self-improvement may edit verifier matrix/templates/scripts only when the improvement is evidence-backed and passes meta-validation.
  - Cross-project sharing needs clear separation between core rules and project adapters.
  - Dynamic verifier creation should be temporary brief generation first; permanent verifier agents should be promoted only after repeated evidence.
- 불가능/비추천:
  - Do not let the verifier silently mutate its own system prompt.
  - Do not persist private conversation transcripts as default memory.
  - Do not treat LLM judge score alone as a verification PASS.
  - Do not edit visible `lecture-cuts` output for this issue unless explicitly requested.
- 필요한 라이브러리/도구:
  - None required for the first markdown/script prototype beyond Node scripts already used in this repo.
  - Optional future integrations: LangGraph-style state store, OpenAI/LangChain eval runners, browser automation.
- 대체안:
  - Start with markdown Skill plus JSON registry/state files; add executable CLI after the contract stabilizes.

### Risks / Unknowns

- Reward hacking: the verifier may learn to satisfy its own rubric rather than the user's quality expectation.
- Prompt drift: automatic prompt edits can degrade portability and create hidden behavior.
- Excessive agency: self-improvement must not grant new file/tool permissions without approval.
- Memory contamination: stale or project-specific lessons may be misapplied to other projects.
- False PASS: final-text judge output can miss command failures, browser regressions, and state mutation issues.
- Cross-project portability: repo-specific paths and commands must live in adapters, not the core package.

## 4. Context Pack For Next Agent

### Use This Context

- Implement issue #5 as a `verification-orchestrator` Skill with a verifier registry, task-to-verifier matrix, review-brief template, verdict template, and self-improvement loop contract.
- Treat the user's “verification level” as a versioned capability state:
  - `level`: integer starting at 0 unless prior state exists.
  - `promotedChecks`: reusable checks proven by evidence.
  - `knownFailurePatterns`: distilled lessons from failed verification attempts.
  - `projectAdapters`: repo-specific commands, AGENTS rules, and evidence expectations.
  - `promotionHistory`: attempt id, failure, improvement, validation evidence, and approval status.
- Default self-improvement loop:
  - `maxAttempts`: user-provided value or 5.
  - attempt 1 starts at current persisted level.
  - each failed/WARN attempt creates a bounded improvement proposal.
  - only validated improvements can raise level.
  - repeated identical failure or no new evidence stops as blocked.
- Recommended core architecture:
  - `task-classifier`
  - `verifier-registry`
  - `review-brief-generator`
  - `evidence-collector`
  - `verifier-runner`
  - `improvement-proposer`
  - `promotion-gate`
  - `capability-state-store`
  - `final-adjudicator`
- Keep project-specific commands and rules in adapters. For this repo, the initial adapter should know about practice-harness QA, lecture-cuts gates, deck-harness verification, context pack validation, and project-local hook constraints.

### Do Not Assume

- Do not assume self-improvement means modifying model weights or global/user instructions.
- Do not assume a PASS is valid without command/source/browser evidence appropriate to the task.
- Do not assume every task needs a permanent new verifier agent file.
- Do not assume project-specific Kimai/lecture-cuts rules belong in the shared core.
- Do not assume missing evidence can be upgraded to PASS by retrying with a stronger prompt.

### Recommended Next Step

- Write a concrete implementation plan for a first prototype with this file structure:
  - `.codex/skills/verification-orchestrator/SKILL.md`
  - `.codex/skills/verification-orchestrator/matrices/task-to-verifier.json`
  - `.codex/skills/verification-orchestrator/templates/review-brief.md`
  - `.codex/skills/verification-orchestrator/templates/verdict.md`
  - `.codex/skills/verification-orchestrator/templates/improvement-proposal.md`
  - `.codex/skills/verification-orchestrator/schema/capability-state.schema.json`
  - `.codex/verification/capability-state.json`
  - `.codex/verification/promotion-log.md`
  - `docs/context/issue-5-self-improving-verification-agent-plan.md`
- Then implement in small phases: contract docs, state schema, sample briefs, validation script, and only then optional hook integration.

### Install Recommendations

- None required for the first repo-local prototype.
- Optional later: add a LangGraph-style state backend only if the markdown/JSON state store becomes insufficient.
- Optional later: add hosted eval or AgentEvals integration only after local deterministic gates and report schemas are stable.

### Raw Source List

- GitHub issue #5: https://github.com/sabyunrepo/research_ai/issues/5
- `AGENTS.md`
- `.codex/skills/context-research-orchestrator/SKILL.md`
- `.codex/skills/context-research-orchestrator/references/research-agent-design.md`
- `practice-harness/agents/critical-practice-harness-verifier-agent.md`
- `deck-harness/agents/verification-agent.md`
- `lecture-cuts/agents/harness-verification-agent.md`
- `lecture-cuts/skills/verification-gate/SKILL.md`
- Self-Refine: https://arxiv.org/abs/2303.17651
- Reflexion: https://arxiv.org/abs/2303.11366
- Anthropic Building Effective Agents: https://www.anthropic.com/research/building-effective-agents
- LangGraph workflows and agents: https://docs.langchain.com/oss/python/langgraph/workflows-agents
- LangGraph memory: https://docs.langchain.com/oss/python/langgraph/memory
- AutoGen Reflection: https://microsoft.github.io/autogen/dev/user-guide/core-user-guide/design-patterns/reflection.html
- LangChain Deep Agents memory: https://docs.langchain.com/oss/python/deepagents/long-term-memory
- OpenAI Agents multi-agent orchestration: https://openai.github.io/openai-agents-python/multi_agent/
- AutoGen SelectorGroupChat: https://microsoft.github.io/autogen/0.4.4/user-guide/agentchat-user-guide/selector-group-chat.html
- LangChain Agent Evals: https://docs.langchain.com/oss/python/langchain/evals
- Anthropic agent evals: https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents
- OpenAI graders: https://platform.openai.com/docs/guides/graders/
- Reward hacking in iterative self-refinement: https://arxiv.org/abs/2407.04549
- OpenAI Agents guardrails: https://openai.github.io/openai-agents-python/guardrails/
- OWASP LLM Top 10: https://owasp.org/www-project-top-10-for-large-language-model-applications/
- MCP security best practices: https://modelcontextprotocol.io/specification/2025-06-18/basic/security_best_practices
