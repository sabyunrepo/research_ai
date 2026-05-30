# Context Research Pack

Status: PASS
Task: Dogfood test - research-related skills and configuration methods
Artifact owner: context-research-orchestrator-agent
Created: 2026-05-30
Updated: 2026-05-30
Project root: /Users/sabyun/goinfre/research_ai
Brainstorming phase: both
Recommended next action: Keep the project-local orchestrator structure, strengthen validator behavior for completed artifacts, and use package/plugin distribution only after this repo-local pilot is accepted.

## 1. Context Triage

### Task Classification

| field | value |
|---|---|
| 작업 유형 | research skill configuration dogfood test |
| 예상 산출물 | evidence-backed context pack plus skill/validator improvements |
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
| local search | yes | yes | n/a | Used existing repo files and validator |
| web search | yes | yes | official docs and primary papers | Used for current skill configuration evidence |
| Context7 | no | no | official Context7 CLI docs via web | Install recommended only for future library/API-heavy research |
| docs/parser tool | no | no | web text/PDF extraction from browser search | PDF source was readable through search/open |
| browser/screenshot | no | no | static file review | No UI change |

### Must-Read Context

| path/source | why it matters | status |
|---|---|---|
| `.codex/skills/context-research-orchestrator/SKILL.md` | The skill under test | read |
| `.codex/agents/context-research-orchestrator-agent.md` | Role contract under test | read |
| `scripts/validate-context-research-pack.js` | Contract validator under test | read |
| `docs/context/issue-4-context-research-pack.md` | First real artifact produced by the skill | read |
| Claude Code skills docs | Current external configuration evidence | read |
| Claude custom skills help | Current external best-practice evidence | read |
| Context7 CLI docs | Optional adapter evidence | read |
| OpenAI Codex plugins/skills academy page | Codex distinction between plugins and skills | read |
| SkillsBench paper | Cross-agent skill structure evidence | read |

### Pre-Brainstorm Notes

- The orchestrator should remain a project-local skill for this task because the user explicitly required all artifacts to stay under the project root.
- External docs support the existing design: skills carry process, plugins connect external tools, and optional supporting files/scripts are normal.
- A likely weakness is validator strictness: completed packs should fail if they still contain template placeholders.

### Questions For Brainstorming

- Should this test prove only that the new pack validates, or also that the skill contract improves from the test?
- Should the project-local `.codex/skills` structure stay as the pilot even though some ecosystems use `.claude/skills` or global directories?

## 2. Brainstorming Summary

### Agreed Goal

Use the new skill to research research-related skill design and configuration methods, then improve the implementation if dogfooding reveals weak spots.

### Chosen Direction

Keep the repo-local orchestrator and improve validation for real artifacts. Do not move outputs to global skill paths or install any optional tools during the test.

### Rejected Alternatives

| alternative | why rejected |
|---|---|
| Install Context7 during this test | User said missing optional tools should be recommended in final reports, not block or force install |
| Convert the pilot into a global plugin now | User required all work records under the project root |
| Leave validator permissive | It allowed a template-like pack to pass as if it were complete |

### Research Questions After Brainstorming

- What do current skill docs recommend for structure, supporting files, testing, and sharing?
- How should Codex distinguish plugins from skills in this orchestrator?
- Does cross-agent research support `SKILL.md` plus optional references/scripts as a portable structure?
- What implementation improvement should be made from this test?

## 3. Targeted Research

### Search Plan

| research question | query family | example queries | source target | status |
|---|---|---|---|---|
| 현재 skill 구조 권장 방식은 무엇인가? | official skill docs | `Claude Code skills SKILL.md supporting files references scripts`, `custom skills best practices clear description testing` | official | searched |
| Codex에서 skill과 plugin은 어떻게 구분되는가? | Codex plugin skill distinction | `OpenAI Codex plugins skills process external tools`, `Codex skills plugin Academy` | official | searched |
| Context7는 skill 구성/문서 조사에 어떤 식으로 붙는가? | Context7 CLI and skills | `Context7 CLI skills MCP setup docs`, `Context7 CLI docs library skills` | official | searched |
| 여러 agent harness에서 skill 구조는 어느 정도 공통인가? | benchmark/portable structure | `agent skills benchmark SKILL.md frontmatter references scripts Codex Claude`, `SkillsBench Codex Claude skills frontmatter` | primary | searched |
| 이 repo의 구현은 실제 pack 검증에 충분한가? | local validator dogfood | `context-research-pack template validator placeholder`, `validate-context-research-pack local script` | local | searched |

### Search Iterations

| iteration | query families used | new evidence found | unresolved questions | next action |
|---|---|---|---|---|
| 1 | official skill docs, Codex plugin/skill distinction, Context7 CLI | Confirmed process-vs-tool split, supporting files/scripts, and Context7 optional CLI/MCP modes | Validator quality still needed local dogfood | search again |
| 2 | SkillsBench portable structure, local validator/template inspection | Confirmed `SKILL.md` plus optional references/scripts is portable enough; found validator allowed blank template | Runtime-specific `.codex/skills` discovery is still environment-specific | stop |

### Evidence Table

| claim id | claim | evidence | source id(s) | source type | checked date | confidence | relevance |
|---|---|---|---|---|---|---|---|
| C1 | A skill should have a clear description because agents use it to decide when to load the skill. | Claude Code skills docs say `SKILL.md` frontmatter and description help decide automatic loading; SkillsBench also reports Claude Code and Codex read `SKILL.md` frontmatter name/description for relevance. | S1, S5 | official/primary | 2026-05-30 | high | Supports a long, explicit description for the orchestrator skill |
| C2 | Supporting files such as references, templates, and scripts are a normal skill structure. | Claude Code skills docs list `SKILL.md`, template/example files, scripts, and reference docs; SkillsBench describes required `SKILL.md` plus optional scripts/references. | S1, S5 | official/primary | 2026-05-30 | high | Supports the current folder structure |
| C3 | Skills should be tested with prompts that should trigger them, and descriptions should be iterated if trigger behavior is poor. | Claude Help Center recommends trying several prompts and iterating the description if Claude is not using it when expected. | S2 | official | 2026-05-30 | high | Supports this dogfood test |
| C4 | Codex should use plugins for connected external tools and skills for process. | OpenAI Academy says use a plugin when Codex needs information from another tool and a skill when Codex needs to follow a process. | S3 | official | 2026-05-30 | high | Supports modeling Context7/web as optional adapters, not the skill itself |
| C5 | Context7 can manage AI coding skills and configure MCP, but it is also usable as CLI + Skills without MCP. | Context7 CLI docs list fetching docs, managing skills, configuring MCP, and setup modes for MCP server or CLI + Skills. | S4 | official | 2026-05-30 | high | Supports graceful fallback and install recommendation |
| C6 | The first implementation's validator was too permissive for completed packs. | Local test showed the blank template could pass the same validator command as a completed artifact. | S6 | local | 2026-05-30 | high | Justifies adding `--allow-template` and placeholder checks |

### Sufficiency Check

| criterion | status | evidence / note |
|---|---|---|
| enough distinct query families used | pass | 5 query families covered official docs, Codex distinction, Context7, cross-agent structure, and local validator dogfood |
| official/primary sources checked | pass | Claude docs/help, OpenAI Academy, Context7 docs, SkillsBench |
| local project context checked when relevant | pass | New skill, template, validator, and issue pack checked |
| implementation/example evidence checked when relevant | pass | Local validator failure mode found and fixed |
| risk/limitation/deprecation checked | pass | Runtime discovery and Context7 absence risks recorded |
| contradictions or uncertainty recorded | pass | `.codex/skills` portability uncertainty recorded |
| stop condition is explicit | pass | Research stopped after validator improvement and after remaining uncertainty became distribution/runtime-specific |

### Stop Condition

- Stopped after two search iterations because the main implementation question had official, primary, and local evidence, and the only remaining uncertainty concerns future distribution packaging across runtimes.

### Limiting Constraint

| constraint type | evidence / note |
|---|---|
| none | Research met the minimum query-family and source-coverage bar. |

### Research State Snapshot

| state item | value |
|---|---|
| research questions tracked | 5 |
| searched query families | 5 |
| sources reviewed | 8+ |
| official/primary/local sources used | Claude skills docs, OpenAI Academy, Context7 CLI, SkillsBench, local validator/template |
| unresolved questions | runtime-specific discovery behavior for `.codex/skills` |
| synthesis status | complete |

### Source Ledger

| source id | title | url/path | source type | checked date | used by claims |
|---|---|---|---|---|---|
| S1 | Claude Code skills docs | https://code.claude.com/docs/en/skills | official | 2026-05-30 | C1, C2 |
| S2 | Claude custom skills help | https://support.claude.com/en/articles/12512198-how-to-create-custom-skills | official | 2026-05-30 | C3 |
| S3 | OpenAI Codex plugins and skills | https://openai.com/academy/codex-plugins-and-skills/ | official | 2026-05-30 | C4 |
| S4 | Context7 CLI docs | https://context7.com/docs/clients/cli | official | 2026-05-30 | C5 |
| S5 | SkillsBench paper | https://www.skillsbench.ai/skillsbench.pdf | primary | 2026-05-30 | C1, C2 |
| S6 | Local validator and template | `scripts/validate-context-research-pack.js`, `.codex/skills/context-research-orchestrator/templates/context-research-pack.md` | local | 2026-05-30 | C6 |

### Claim Support Check

| claim id | source id | support verdict | evidence locator / quote summary | reviewer note |
|---|---|---|---|---|
| C1 | S1 | supported | Skills docs describe frontmatter and descriptions for loading decisions | Supports trigger description claim |
| C1 | S5 | supported | SkillsBench describes Claude Code and Codex using `SKILL.md` name/description for relevance | Supports cross-agent description claim |
| C2 | S1 | supported | Skills docs describe supporting files such as scripts, references, examples, and templates | Supports skill folder structure claim |
| C2 | S5 | supported | SkillsBench describes required `SKILL.md` plus optional scripts/references | Supports portable structure claim |
| C3 | S2 | supported | Help article recommends testing skills with prompts and iterating descriptions | Supports dogfood process |
| C4 | S3 | supported | OpenAI Academy distinguishes plugin/tool connection from process-oriented skills | Supports plugin vs skill distinction |
| C5 | S4 | supported | Context7 CLI docs describe MCP and CLI + Skills modes | Supports optional Context7 policy |
| C6 | S6 | supported | Local template passed before hardening and then failed after stricter checks | Supports validator improvement |

### Local Findings

| file | finding | relevance |
|---|---|---|
| `.codex/skills/context-research-orchestrator/SKILL.md` | Skill already separates Context Triage, brainstorming, and Targeted Research | Core workflow is correct |
| `.codex/skills/context-research-orchestrator/templates/context-research-pack.md` | Template intentionally contains blank placeholder rows | Validator must distinguish templates from completed packs |
| `scripts/validate-context-research-pack.js` | Initial validator checked headings but not template placeholders | Needed hardening from dogfood |
| `docs/context/issue-4-context-research-pack.md` | Real artifact validates and contains actual evidence rows | Baseline pack remains useful |
| `package.json` | `validate:context` script allows reuse of validator | Good project-root verification surface |

### External Findings

| source | source type | finding | checked date |
|---|---|---|---|
| https://code.claude.com/docs/en/skills | official | Skills use `SKILL.md` frontmatter, supporting files, scripts, references, and can be project-level in Claude's ecosystem | 2026-05-30 |
| https://support.claude.com/en/articles/12512198-how-to-create-custom-skills | official | Skills should be focused, clearly described, incrementally tested, and can include scripts | 2026-05-30 |
| https://openai.com/academy/codex-plugins-and-skills/ | official | Codex plugins connect tools/information; skills encode repeatable process | 2026-05-30 |
| https://context7.com/docs/clients/cli | official | Context7 can fetch docs, manage skills, and configure MCP; CLI + Skills is a setup option | 2026-05-30 |
| https://www.skillsbench.ai/skillsbench.pdf | primary | Cross-agent benchmark describes `SKILL.md` with frontmatter plus optional scripts/references and Codex/Claude use frontmatter relevance | 2026-05-30 |

### Implementation Feasibility

- 가능: Keep the current project-local skill/agent/reference/template structure and improve validation strictness.
- 조건부 가능: Add `.claude/skills` compatibility later if the team wants Claude Code native project discovery; for this Codex repo, `.codex/skills` is the current local pilot.
- 불가능/비추천: Treating Context7 as a required dependency or writing shared config globally from this repo.
- 필요한 라이브러리/도구: None. Node.js validator is enough.
- 대체안: If a runtime cannot auto-discover `.codex/skills`, workers can still read the skill path explicitly from AGENTS.md.

### Risks / Unknowns

- OpenAI's public Academy page explains usage and conceptual distinction but not a full local filesystem specification for Codex skills.
- Claude's project-level skill discovery paths differ from this repo-local `.codex/skills` path; that is acceptable for this project pilot but should be documented if packaging for other runtimes.
- Context7 was not directly available as a local CLI/MCP in this test, so the test records official-doc evidence and an install recommendation.

## 4. Context Pack For Next Agent

### Use This Context

- Keep the orchestrator skill focused on context routing and evidence packaging.
- Keep external tool integrations optional: Context7/web/parser/browser are adapters, not preconditions.
- Use `scripts/validate-context-research-pack.js` for completed artifact checks.
- Use `--allow-template` only when validating the reusable blank template.
- Treat plugin packaging as a later distribution task, not part of this project-root-only implementation.

### Do Not Assume

- Do not assume `.codex/skills` auto-discovery works in every runtime.
- Do not assume Context7 is installed.
- Do not use a blank template as a completed research artifact.
- Do not blur Codex plugin responsibilities with skill responsibilities.

### Recommended Next Step

- Run validator on this dogfood pack and on the issue 4 pack.
- Run template validation with `--allow-template`.
- Update final report with the validator hardening and source-backed findings.

### Install Recommendations

- Context7 is recommended for future library/API-heavy research because it can fetch current library docs and configure MCP or CLI + Skills, but it is not required for this workflow.
- No PPT/deck parser install is recommended for this test because no binary deck was inspected.

### Raw Source List

- https://code.claude.com/docs/en/skills
- https://support.claude.com/en/articles/12512198-how-to-create-custom-skills
- https://openai.com/academy/codex-plugins-and-skills/
- https://context7.com/docs/clients/cli
- https://www.skillsbench.ai/skillsbench.pdf
- `.codex/skills/context-research-orchestrator/SKILL.md`
- `.codex/skills/context-research-orchestrator/templates/context-research-pack.md`
- `scripts/validate-context-research-pack.js`
- `docs/context/issue-4-context-research-pack.md`
