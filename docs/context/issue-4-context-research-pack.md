# Context Research Pack

Status: PASS
Task: GitHub issue 4 - reusable context research orchestrator for shared, general use
Artifact owner: context-research-orchestrator-agent
Created: 2026-05-30
Updated: 2026-05-30
Project root: /Users/sabyun/goinfre/research_ai
Brainstorming phase: both
Recommended next action: Use `.codex/skills/context-research-orchestrator/SKILL.md` for future research-before-plan work and keep all outputs under `docs/context/` or a project-local generated deck directory.

## 1. Context Triage

### Task Classification

| field | value |
|---|---|
| 작업 유형 | reusable agent/skill workflow implementation |
| 예상 산출물 | project-local skill, agents, template, references, validator, and issue context pack |
| 위험도 | medium |
| 최신성 필요 | yes |
| 로컬 조사 필요 | yes |
| 외부 검색 필요 | yes |
| 라이브러리/API 문서 필요 | yes |
| PPT/deck/report 자료 필요 | yes |
| high-stakes domain | no |

### Tool Detection

| tool | available | used | fallback | note |
|---|---:|---:|---|---|
| local search | yes | yes | n/a | `rg`, `sed`, `find`, and `gh issue view` used inside this repo |
| web search | yes | yes | official docs and source pages | Context7 and Superpowers behavior checked on 2026-05-30 |
| Context7 | no | no | official Context7 docs and CLI docs via web | Recommend installing only when future library/API research is frequent |
| docs/parser tool | no | no | local text files and repo contracts | No heavy PPT parsing needed for this issue |
| browser/screenshot | no | no | static file review | No UI surface changed |

### Must-Read Context

| path/source | why it matters | status |
|---|---|---|
| `AGENTS.md` | Project-root instruction ownership and deck/harness rules | read |
| `gh issue view 4` | Defines original issue goal and acceptance criteria | read |
| `deck-harness/agents/research-agent.md` | Existing repo-local research role boundary | read |
| `deck-harness/skills/research-dossier/SKILL.md` | Existing research dossier flow for generated decks | read |
| `deck-harness/README.md` | Reusable workflow and output-isolation contract | read |
| `deck-harness/workflow.md` | Existing source-of-truth chain and stage contracts | read |
| `lecture-cuts/HANDOFF.md` | Confirms visible deck output should stay stable for harness-only work | read |
| Context7 official docs | Confirms Context7's fit as optional library-doc adapter | read |
| Superpowers README / brainstorming docs | Confirms brainstorming order and non-implementation boundary | read |

### Pre-Brainstorm Notes

- The original issue proposed `lecture-cuts/agents/researcher-agent.md`, but the user's shared/general-use goal makes a project-local `.codex/skills/context-research-orchestrator/` package a better pilot.
- Deep research should not replace brainstorming. It should be split into light preflight before brainstorming and targeted research after a direction is agreed.
- All artifacts must stay under the project root. The default storage path should be `docs/context/`.
- Optional tools such as Context7 must be capability-detected and recorded as skipped when unavailable, not treated as blockers.

### Questions For Brainstorming

- Should this be implemented as a repo-local pilot first or a global plugin immediately?
- Should the research role be limited to deck research or cover all task types?
- Should Context7 absence block library research or only produce an install recommendation?

## 2. Brainstorming Summary

### Agreed Goal

Build a reusable context research orchestrator that works across projects and task types, while piloting it inside this repository for issue 4. It should route local search, web/current research, library/API docs, deck/PPT/report material gathering, and evidence packaging.

### Chosen Direction

Use a two-pass model:

1. `Context Triage` before brainstorming loads just enough project/tool context to ask better questions.
2. `Targeted Research` after brainstorming gathers deeper source-backed evidence for the chosen direction.

Store the resulting artifact under the project root, usually `docs/context/<task-slug>-context-research-pack.md`.

### Rejected Alternatives

| alternative | why rejected |
|---|---|
| Put the reusable workflow only under `lecture-cuts/` | Too narrow for the user's shared/general-use goal and risks tying a universal research skill to one deck output surface |
| Do all deep research before brainstorming | Causes over-collection before the goal and alternatives are narrowed |
| Block work when Context7 is missing | Not portable across users; optional tools should degrade gracefully |
| Store research outputs in global/user skill folders | Violates the user's project-root artifact requirement |

### Research Questions After Brainstorming

- What does Context7 officially provide, and where does it fit?
- How does Superpowers position brainstorming relative to coding/planning?
- What local repo structure best supports a project-local but shareable pilot?

## 3. Targeted Research

### Search Plan

| research question | query family | example queries | source target | status |
|---|---|---|---|---|
| Context7는 어떤 역할로 모델링해야 하는가? | official Context7 docs | `Context7 MCP official documentation library docs code examples`, `Context7 CLI docs MCP server CLI Skills` | official | searched |
| Superpowers brainstorming 앞뒤 순서는 어떻게 잡아야 하는가? | Superpowers workflow source | `Superpowers brainstorming writing-plans workflow`, `obra superpowers brainstorming skill GitHub` | primary/secondary | searched |
| repo-local pilot은 어디에 두는 게 맞는가? | local harness structure | `deck-harness research-agent`, `lecture-cuts HANDOFF output isolation`, `AGENTS context research workflow` | local | searched |
| 공유 가능한 skill 구조는 어떻게 잡아야 하는가? | skill structure and portability | `Agent Skills SKILL.md references scripts Codex Claude`, `Codex plugins skills process external tools` | official/primary | searched |
| optional tool 부재 시 정책은 어떻게 해야 하는가? | fallback and tool policy | `Context7 CLI Skills no MCP`, `Codex plugin skill external tools process` | official | searched |

### Search Iterations

| iteration | query families used | new evidence found | unresolved questions | next action |
|---|---|---|---|---|
| 1 | Context7 official docs, Superpowers workflow, local harness files | Confirmed Context7 as library-doc adapter, Superpowers brainstorming before planning, and local deck-harness boundary | Skill portability across runtimes still needed clearer support | search again |
| 2 | Agent skill structure, Codex plugin/skill distinction, SkillsBench structure evidence | Confirmed `SKILL.md` plus references/scripts and plugin-vs-skill separation | Runtime auto-discovery for `.codex/skills` remains environment-specific | stop |

### Evidence Table

| claim id | claim | evidence | source id(s) | source type | checked date | confidence | relevance |
|---|---|---|---|---|---|---|---|
| C1 | Context7 is best modeled as an optional library/API documentation adapter. | Context7 docs say it brings up-to-date, version-specific documentation and code examples into the AI coding assistant. | S1 | official | 2026-05-30 | high | Supports optional adapter design for library feasibility checks |
| C2 | Context7 CLI can be used without MCP and can resolve a library before fetching docs. | CLI docs describe `ctx7 library` followed by `ctx7 docs`, and also describe setup modes for MCP server or CLI + Skills. | S2 | official | 2026-05-30 | high | Supports fallback policy: use CLI/MCP when available, official docs otherwise |
| C3 | Superpowers brainstorming should run before coding and before writing implementation plans. | Superpowers README lists brainstorming as the first basic workflow step and writing-plans after approved design. | S3 | primary | 2026-05-30 | high | Supports placing Context Triage before brainstorming and Targeted Research after design direction |
| C4 | Brainstorming should inspect project context first but not invoke implementation skills directly. | Public brainstorming skill page shows "Explore project context" before questions and says the only skill after brainstorming is writing-plans. | S4 | secondary | 2026-05-30 | medium | Supports light preflight before brainstorming and no implementation from research role |
| C5 | This repository already treats `deck-harness/` as reusable workflow and `lecture-cuts/` as stable output. | `deck-harness/README.md` says it is the reusable topic-to-deck contract; `lecture-cuts/HANDOFF.md` says visible deck output stays stable during harness-only work. | S6 | local | 2026-05-30 | high | Supports project-local pilot outside visible deck output |
| C6 | Issue 4 requires reusable research role and sourcing skill with claim/evidence/source/date/confidence separation. | `gh issue view 4` body lists researcher-agent, research-sourcing skill, research brief, evidence table, and non-scope for slide output changes. | S5 | primary | 2026-05-30 | high | Defines minimum implementation contract |

### Sufficiency Check

| criterion | status | evidence / note |
|---|---|---|
| enough distinct query families used | pass | 5 query families covered Context7, Superpowers, local repo structure, skill portability, and fallback policy |
| official/primary sources checked | pass | Context7 official docs, Superpowers GitHub README, local issue/repo files |
| local project context checked when relevant | pass | AGENTS, deck-harness, lecture-cuts handoff, and existing research skill files checked |
| implementation/example evidence checked when relevant | pass | Existing repo skill structure and validator approach checked |
| risk/limitation/deprecation checked | pass | Missing Context7 and runtime-specific skill discovery risks recorded |
| contradictions or uncertainty recorded | pass | `.codex/skills` auto-discovery uncertainty recorded |
| stop condition is explicit | pass | Research stopped after duplicate direction and remaining issue became runtime packaging decision |

### Stop Condition

- Stopped after the second query batch because the key design questions had official/primary/local evidence, and the remaining uncertainty is packaging/runtime-specific rather than solvable by more searching inside this issue.

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
| official/primary/local sources used | Context7 docs, Superpowers GitHub, issue 4, AGENTS, deck-harness files |
| unresolved questions | runtime auto-discovery of `.codex/skills` outside this repo |
| synthesis status | complete |

### Source Ledger

| source id | title | url/path | source type | checked date | used by claims |
|---|---|---|---|---|---|
| S1 | Context7 overview | https://context7.com/docs/overview | official | 2026-05-30 | C1 |
| S2 | Context7 CLI docs | https://context7.com/docs/clients/cli | official | 2026-05-30 | C2 |
| S3 | Superpowers GitHub | https://github.com/obra/superpowers | primary | 2026-05-30 | C3 |
| S4 | Superpowers brainstorming page | https://claude-plugins.dev/skills/%40obra/superpowers/brainstorming | secondary | 2026-05-30 | C4 |
| S5 | GitHub issue 4 | local `gh issue view 4` output | primary | 2026-05-30 | C6 |
| S6 | Local harness docs | `deck-harness/README.md`, `deck-harness/workflow.md`, `lecture-cuts/HANDOFF.md` | local | 2026-05-30 | C5 |

### Claim Support Check

| claim id | source id | support verdict | evidence locator / quote summary | reviewer note |
|---|---|---|---|---|
| C1 | S1 | supported | Context7 overview describes up-to-date library docs/code examples | Supports optional library-doc adapter claim |
| C2 | S2 | supported | CLI docs describe library/docs flow and setup modes | Supports fallback/setup policy |
| C3 | S3 | supported | README workflow places brainstorming before planning/coding | Supports preflight then brainstorming order |
| C4 | S4 | supported | Brainstorming page describes project context exploration before questions | Supports preflight-before-brainstorming |
| C5 | S6 | supported | Local docs separate reusable deck harness from visible lecture output | Supports repo-local pilot placement |
| C6 | S5 | supported | Issue body requires reusable research agent and sourcing skill | Supports issue scope |

### Local Findings

| file | finding | relevance |
|---|---|---|
| `.codex/` | Project already has local Codex hook/config directory but no local skills/agents files before this change | Natural place for repo-local shared skill pilot without global writes |
| `deck-harness/agents/research-agent.md` | Existing role gathers facts and teaching material but does not own final slide order/design/build | Confirms research role boundary |
| `deck-harness/skills/research-dossier/SKILL.md` | Existing generated-deck research flow writes research dossier and source list after topic intake | The new orchestrator should sit earlier/wider than deck-only dossier |
| `deck-harness/README.md` | Deck harness workflow already separates reusable contracts from visible deck output | Universal workflow should not edit lecture output |
| `practice-harness/practices/act4-mini-brainstorming-skill.json` | Local learning material says brainstorming checks project context, asks one question at a time, compares approaches, and waits for approval | Supports preflight-before-brainstorming distinction |

### External Findings

| source | source type | finding | checked date |
|---|---|---|---|
| https://context7.com/docs/overview | official | Context7 supplies up-to-date, version-specific docs/code examples to coding assistants | 2026-05-30 |
| https://context7.com/docs/clients/cli | official | Context7 CLI can resolve libraries and fetch docs; setup can be MCP server or CLI + Skills | 2026-05-30 |
| https://github.com/obra/superpowers | primary | Superpowers workflow begins with brainstorming and then writing-plans after design approval | 2026-05-30 |
| https://claude-plugins.dev/skills/%40obra/superpowers/brainstorming | secondary | Brainstorming flow starts by exploring project context and then asks clarifying questions | 2026-05-30 |

### Implementation Feasibility

- 가능: Repo-local `.codex/skills/context-research-orchestrator/` skill, `.codex/agents/` role docs, `docs/context/` artifact location, and validator script are straightforward.
- 조건부 가능: Packaging as a global marketplace/plugin should be done later only if the user asks; this task requires all work to stay under the project root.
- 불가능/비추천: Writing outputs to global/user skill directories or requiring Context7 as a hard dependency.
- 필요한 라이브러리/도구: None for the pilot. Node.js is already used by this repo for validation scripts.
- 대체안: For projects without `.codex/`, copy the skill folder into a project-local docs/skills or tool-specific local skill directory.

### Risks / Unknowns

- The exact way another user's agent runtime discovers project-local `.codex/skills` can vary. The skill is still shareable as files even if a runtime requires manual import.
- Context7 was not available in this session as a callable MCP tool; the design uses official web docs and records Context7 as optional.
- The public Superpowers brainstorming page used as skill-flow evidence is a secondary mirror; the GitHub README is the stronger source for workflow order.

## 4. Context Pack For Next Agent

### Use This Context

- Use `.codex/skills/context-research-orchestrator/SKILL.md` as the canonical project-local skill.
- Use `.codex/agents/context-research-orchestrator-agent.md` for the role and `.codex/agents/context-research-reviewer-agent.md` for independent review.
- Store all future context research outputs under `docs/context/` unless a generated deck directory already exists and owns the artifact.
- Run `node scripts/validate-context-research-pack.js <pack>` before claiming the research artifact is ready.
- Treat Context7, browser, PPT parser, and similar tools as optional adapters. Missing tools go into Tool Detection and Install Recommendations.

### Do Not Assume

- Do not assume Context7 is installed for every user.
- Do not assume web access exists for every run.
- Do not store research packs in global/user agent directories.
- Do not let this research role write implementation code, slide HTML, or final deck output.
- Do not skip brainstorming; preflight research should make brainstorming better, not replace it.

### Recommended Next Step

- For this issue: review the added project-local skill/agents/template/validator and then update or close issue 4 with the artifact paths and validation command.
- For future work: run Context Triage before brainstorming, run Targeted Research after the chosen direction is known, then pass the pack to planning or implementation.

### Install Recommendations

- Context7 was not available as a callable tool in this session. For future library/API-heavy work, install or configure Context7 MCP/CLI so the orchestrator can use version-specific docs directly.
- A PPT parser is not required for this issue. For heavy `.pptx` work, use a project-local PPT/deck workflow or the existing environment's pptx skill, but keep extracted notes under the project root.

### Raw Source List

- https://context7.com/docs/overview
- https://context7.com/docs/clients/cli
- https://github.com/obra/superpowers
- https://claude-plugins.dev/skills/%40obra/superpowers/brainstorming
- `AGENTS.md`
- `deck-harness/README.md`
- `deck-harness/workflow.md`
- `deck-harness/agents/research-agent.md`
- `deck-harness/skills/research-dossier/SKILL.md`
- `lecture-cuts/HANDOFF.md`
- `practice-harness/practices/act4-mini-brainstorming-skill.json`
