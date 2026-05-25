# lecture-cuts content inventory

이 파일은 `scripts/export-lecture-cuts-contract.js`가 현재 `lecture-cuts/` 덱에서 추출한 재현 기준입니다.
다른 주제로 발표자료를 만들 때 이 덱의 구조, 필드 출처, 검증 기준을 golden reference로 사용합니다.

## Summary

- Slide count: 87
- Registry: lecture-cuts/assets/slides.js
- Source contract: lecture-cuts/slide-spec.json
- Source map: docs/harness/lecture-cuts-source-map.json
- Slide-specific source annotations: 7
- Deck-global source references: 5

## Section Counts

- 오프닝 / 전체 지도: 7
- 실패 패턴: 8
- Spec / Prompt: 17
- Context / Memory: 8
- Skills / Superpowers: 10
- Agents / Tools: 12
- Hooks / Verification: 14
- Final Workflow: 11

## Speaker Source Counts

- presenter-preview: 13
- inline: 74

## Optional Field Coverage

- Slides without bullet list: 12
- Slides without inline note block: 0

## Extraction Confidence

No low-confidence fields. `node scripts/export-lecture-cuts-contract.js --check-confidence` should pass.

## Slide Index

| # | id | title | section | speaker | sources | hash |
|---:|---|---|---|---|---:|---|
| 1 | `00-title` | AI 에이전트 하네스 엔지니어링 | 오프닝 / 전체 지도 | presenter-preview | 5 | `sha256:21170f005c10...` |
| 2 | `00-1-workbench-preview` | 우리가 만들 것은 프롬프트가 아니라 작업장입니다 | 오프닝 / 전체 지도 | inline | 5 | `sha256:59eecf6a072f...` |
| 3 | `01-why-harness` | AI는 똑똑하지만 일관되지는 않습니다 | 오프닝 / 전체 지도 | presenter-preview | 5 | `sha256:48e718df715b...` |
| 4 | `01-1-inconsistency-before-after` | 같은 요청도 환경이 다르면 결과가 달라집니다 | 오프닝 / 전체 지도 | inline | 5 | `sha256:888ece6a9d39...` |
| 5 | `03-layer-map` | 요즘 워크플로우는 레이어로 봅니다 | 오프닝 / 전체 지도 | presenter-preview | 5 | `sha256:57ec95a6996f...` |
| 6 | `03-1-layer-responsibility` | 각 레이어는 맡는 책임이 다릅니다 | 오프닝 / 전체 지도 | inline | 5 | `sha256:cb19dee9db6f...` |
| 7 | `03-2-harness-flow` | 지시는 점점 더 단단한 구조로 승격됩니다 | 오프닝 / 전체 지도 | inline | 5 | `sha256:e29b1c0a62e2...` |
| 8 | `02-failure-patterns` | 실패는 보통 지능보다 절차 문제입니다 | 실패 패턴 | inline | 5 | `sha256:6b46fe62a317...` |
| 9 | `02-1-why-llms-fail` | LLM은 빈칸을 추론으로 채웁니다 | 실패 패턴 | inline | 5 | `sha256:aeadf66668cf...` |
| 10 | `02-2-failure-example-read-before-edit` | 읽지 않고 고치면 API를 상상합니다 | 실패 패턴 | inline | 5 | `sha256:3693e6694b20...` |
| 11 | `02-3-failure-example-skip-test` | 테스트를 약화하면 성공처럼 보입니다 | 실패 패턴 | inline | 5 | `sha256:ecb87786c98e...` |
| 12 | `02-4-failure-example-context-drift` | 오래된 가정은 현재 작업을 오염시킵니다 | 실패 패턴 | inline | 5 | `sha256:cad67810f2c3...` |
| 13 | `02-5-improvement-process-guardrails` | 더 똑똑하라고 하지 말고 절차를 만듭니다 | 실패 패턴 | inline | 5 | `sha256:cd9ba67d02ec...` |
| 14 | `02-6-improvement-turn-failure-into-rule` | 반복 실패는 다음 하네스 후보입니다 | 실패 패턴 | inline | 5 | `sha256:2c4f68c04955...` |
| 15 | `02-7-failure-to-harness-decision` | 반복 실패는 어느 하네스로 올릴지 결정합니다 | 실패 패턴 | inline | 5 | `sha256:ab19e8aa9442...` |
| 16 | `13-spec-driven` | 명세 기반 작업은 즉흥 구현의 반대편입니다 | Spec / Prompt | inline | 5 | `sha256:5713fd0526dc...` |
| 17 | `13-1-vibe-vs-spec` | 명세 기반 작업은 즉흥 구현을 줄입니다 | Spec / Prompt | inline | 5 | `sha256:8974bd9fd9b3...` |
| 18 | `13-2-spec-contract` | 좋은 명세는 네 가지를 고정합니다 | Spec / Prompt | inline | 5 | `sha256:dc0d6f96594b...` |
| 19 | `13-3-spec-bad-good` | 나쁜 spec은 해석을 남기고, 좋은 spec은 확인을 남깁니다 | Spec / Prompt | inline | 5 | `sha256:a1367db82469...` |
| 20 | `13-4-spec-plan-review-flow` | Spec은 plan과 review로 이어져야 합니다 | Spec / Prompt | inline | 5 | `sha256:4bed9bef89c9...` |
| 21 | `04-prompt-layer` | 프롬프트도 하네스입니다 | Spec / Prompt | presenter-preview | 5 | `sha256:3d60792550ca...` |
| 22 | `04-1-prompt-anatomy` | 좋은 요청은 여섯 칸으로 나눌 수 있습니다 | Spec / Prompt | inline | 5 | `sha256:cfdee082c791...` |
| 23 | `04-2-xml-boundaries` | 입력 경계가 선명하면 모델의 오독이 줄어듭니다 | Spec / Prompt | inline | 5 | `sha256:c6aaa9a588fd...` |
| 24 | `05-persona` | 페르소나는 역할보다 판단 기준이 중요합니다 | Spec / Prompt | presenter-preview | 5 | `sha256:ef2463b30499...` |
| 25 | `05-1-persona-weak` | “시니어처럼”은 너무 넓은 지시입니다 | Spec / Prompt | inline | 5 | `sha256:00e83f20443f...` |
| 26 | `05-2-persona-rubric` | Persona는 역할보다 판단 기준으로 씁니다 | Spec / Prompt | inline | 5 | `sha256:3cf6738b154f...` |
| 27 | `06-few-shot` | Few-shot은 답변 모양을 고정합니다 | Spec / Prompt | presenter-preview | 5 | `sha256:ccddba930820...` |
| 28 | `06-1-good-few-shot` | 좋은 few-shot은 deck slide spec의 완성도를 보여 줍니다 | Spec / Prompt | inline | 5 | `sha256:6f980540d2a0...` |
| 29 | `06-2-bad-few-shot` | 나쁜 few-shot은 나쁜 slide spec까지 복제합니다 | Spec / Prompt | inline | 5 | `sha256:4925f4aa8b50...` |
| 30 | `07-reasoning-prompts` | “단계별로 생각해”를 남발하지 않습니다 | Spec / Prompt | inline | 5 | `sha256:00f158e6c27e...` |
| 31 | `07-1-reasoning-output-pattern` | 결과 기준을 선명하게 요구합니다 | Spec / Prompt | inline | 5 | `sha256:1b8490ed3bf4...` |
| 32 | `07-2-reasoning-avoid-overask` | 작업 성격에 따라 요청 강도를 조절합니다 | Spec / Prompt | inline | 5 | `sha256:7e53018ae1a9...` |
| 33 | `08-claude-md` | CLAUDE.md는 항상 켜진 기억입니다 | Context / Memory | presenter-preview | 5 | `sha256:bf534c89a722...` |
| 34 | `08-1-claude-md-hierarchy` | 프로젝트 기억은 계층으로 로드됩니다 | Context / Memory | inline | 5 | `sha256:2e35a9931f4e...` |
| 35 | `08-2-good-claude-md` | Deck automation용 CLAUDE.md는 작업 순서를 고정합니다 | Context / Memory | inline | 5 | `sha256:b7751080964e...` |
| 36 | `08-3-bad-claude-md` | 나쁜 CLAUDE.md는 오래된 규칙을 계속 주입합니다 | Context / Memory | inline | 5 | `sha256:a9baa7860ed1...` |
| 37 | `09-context-engineering` | 이제는 컨텍스트 엔지니어링입니다 | Context / Memory | presenter-preview | 5 | `sha256:fc0ec06508b3...` |
| 38 | `09-1-context-budget` | Context는 무한한 창고가 아니라 작업대입니다 | Context / Memory | inline | 5 | `sha256:6ded540f2d98...` |
| 39 | `09-2-always-vs-needed` | 항상 로드할 것과 필요할 때 열 것을 나눕니다 | Context / Memory | inline | 5 | `sha256:de7a65078ea1...` |
| 40 | `09-3-context-drift-check` | 완료 전 현재 목표와 컨텍스트를 다시 맞춥니다 | Context / Memory | inline | 5 | `sha256:68cab29a768d...` |
| 41 | `10-skills` | Skill은 반복 절차의 매뉴얼입니다 | Skills / Superpowers | inline | 5 | `sha256:5f2f3d7828f8...` |
| 42 | `10-1-skill-trigger-description` | Skill의 description은 자동 호출 트리거입니다 | Skills / Superpowers | inline | 5 | `sha256:27cd89ff5d81...` |
| 43 | `10-2-skill-body-procedure` | Skill 본문은 짧은 절차여야 합니다 | Skills / Superpowers | inline | 5 | `sha256:e141e9b42ed9...` |
| 44 | `10-3-skill-references-scripts-assets` | 긴 자료와 실행 코드는 Skill 밖으로 분리합니다 | Skills / Superpowers | inline | 5 | `sha256:6ff823418851...` |
| 45 | `11-skill-structure` | 좋은 Skill은 작고 선명합니다 | Skills / Superpowers | presenter-preview | 5 | `sha256:3fb459c1ac65...` |
| 46 | `11-1-real-skill-folder` | deck-builder Skill은 폴더가 곧 작업 순서입니다 | Skills / Superpowers | inline | 1 | `sha256:defefbe305d1...` |
| 47 | `11-2-skill-frontmatter-fields` | frontmatter는 deck-builder Skill의 호출 조건을 고정합니다 | Skills / Superpowers | inline | 5 | `sha256:a265b61b5f75...` |
| 48 | `12-superpowers` | Superpowers는 스킬 기반 하네스 패키지입니다 | Skills / Superpowers | presenter-preview | 5 | `sha256:09bf6d5e1598...` |
| 49 | `12-1-superpowers-as-harness` | Superpowers는 스킬 묶음이 아니라 작업 규율입니다 | Skills / Superpowers | inline | 5 | `sha256:ede15cf03db1...` |
| 50 | `12-2-superpowers-workflow-map` | 각 Superpower는 개발 루프의 다른 지점을 맡습니다 | Skills / Superpowers | inline | 5 | `sha256:2150eb332fb9...` |
| 51 | `14-subagents` | Subagent는 역할과 컨텍스트를 분리합니다 | Agents / Tools | presenter-preview | 1 | `sha256:db0a5f5eb825...` |
| 52 | `14-1-subagent-context-isolation` | Subagent는 작은 AI가 아니라 분리된 context입니다 | Agents / Tools | inline | 5 | `sha256:4a88f9fc33a2...` |
| 53 | `14-2-reviewer-subagent-example` | Reviewer agent는 diff와 결함 기준만 봅니다 | Agents / Tools | inline | 5 | `sha256:bfd2c8732782...` |
| 54 | `14-3-research-subagent-example` | Research agent는 사실을 수집하고 결정하지 않습니다 | Agents / Tools | inline | 5 | `sha256:a0f8ae7b8bd9...` |
| 55 | `15-agent-teams` | 요즘은 병렬 에이전트로 확장합니다 | Agents / Tools | presenter-preview | 5 | `sha256:f19686f8f321...` |
| 56 | `15-1-parallel-safe` | 병렬화는 독립된 작업일 때만 안전합니다 | Agents / Tools | inline | 5 | `sha256:8e9982debd90...` |
| 57 | `15-2-parallel-risk` | 같은 결정을 여러 agent에게 맡기면 충돌합니다 | Agents / Tools | inline | 5 | `sha256:4ab80911bc1c...` |
| 58 | `18-mcp` | MCP는 실제 세계와 연결하는 도구 레이어입니다 | Agents / Tools | inline | 5 | `sha256:d55c5d6cba52...` |
| 59 | `18-1-mcp-bridge` | MCP는 모델과 외부 시스템 사이의 다리입니다 | Agents / Tools | inline | 3 | `sha256:4aa816f506f1...` |
| 60 | `18-2-tool-permissions` | 도구는 읽기 권한과 쓰기 권한을 분리합니다 | Agents / Tools | inline | 5 | `sha256:74b82a413693...` |
| 61 | `18-3-tool-bloat` | 도구가 많을수록 항상 좋은 것은 아닙니다 | Agents / Tools | inline | 5 | `sha256:188aa2055624...` |
| 62 | `18-4-practice-agent-tool-split` | 역할과 도구를 한 장으로 분리합니다 | Agents / Tools | inline | 5 | `sha256:581e0913aa00...` |
| 63 | `16-hooks` | Hook은 지시가 아니라 실행입니다 | Hooks / Verification | inline | 5 | `sha256:5f5e3018bd30...` |
| 64 | `16-1-hook-event` | Hook은 이벤트가 발생할 때 시작됩니다 | Hooks / Verification | inline | 5 | `sha256:3f6afdfa8549...` |
| 65 | `16-2-hook-command` | Hook의 command는 실제 실행되는 검문소입니다 | Hooks / Verification | inline | 1 | `sha256:918cbe148faf...` |
| 66 | `16-3-hook-result` | Hook 결과는 agent에게 다시 돌아갑니다 | Hooks / Verification | inline | 5 | `sha256:de7a1a558dc3...` |
| 67 | `16-4-skill-vs-hook` | Skill은 지침이고 Hook은 실행입니다 | Hooks / Verification | inline | 5 | `sha256:fca117f25985...` |
| 68 | `17-hook-advanced` | Hook도 단계가 있습니다 | Hooks / Verification | inline | 1 | `sha256:1d74a6e2a476...` |
| 69 | `17-1-hook-start-small` | Hook은 echo에서 시작해 test로 올립니다 | Hooks / Verification | inline | 5 | `sha256:c5fb3778e714...` |
| 70 | `19-evaluation` | 완료의 기준은 검증입니다 | Hooks / Verification | inline | 5 | `sha256:59f1cf0a0f0c...` |
| 71 | `19-1-machine-checks` | 기계가 확인할 수 있는 것은 기계에게 맡깁니다 | Hooks / Verification | inline | 5 | `sha256:cd0b1824d1a1...` |
| 72 | `19-2-judge-checks` | 판단이 필요한 품질은 rubric으로 봅니다 | Hooks / Verification | inline | 1 | `sha256:7cd66d4fe258...` |
| 73 | `19-3-human-checks` | 사람 검토는 최종 의사결정 지점입니다 | Hooks / Verification | inline | 5 | `sha256:06c397231194...` |
| 74 | `20-loop-schedule` | 실전 자동화는 한 번 실행에서 끝나지 않습니다 | Hooks / Verification | presenter-preview | 5 | `sha256:255d1eb7d183...` |
| 75 | `20-1-loop-until-pass` | Loop는 통과할 때까지 반복하는 운영 구조입니다 | Hooks / Verification | inline | 5 | `sha256:a217906f2d80...` |
| 76 | `20-2-practice-verification-gate` | 완료 조건을 검증 게이트로 바꿉니다 | Hooks / Verification | inline | 5 | `sha256:b97582d6bf85...` |
| 77 | `21-final-workflow` | HTML/CSS Deck Automation Harness v1 | Final Workflow | inline | 5 | `sha256:7d71fc64da02...` |
| 78 | `21-1-final-artifact-structure` | 최종 산출물은 lecture-deck/입니다 | Final Workflow | inline | 1 | `sha256:d3270e6139f8...` |
| 79 | `21-10-practice-few-shot-placement` | Few-shot은 slide spec 바로 다음에 둡니다 | Final Workflow | inline | 5 | `sha256:317adc6c6b1f...` |
| 80 | `21-2-bug-request-flow` | 자료는 하네스를 통과하며 발표자료가 됩니다 | Final Workflow | inline | 5 | `sha256:0b42c2a2f9ba...` |
| 81 | `21-3-final-report-template` | 최종 보고는 덱 품질의 증거입니다 | Final Workflow | inline | 5 | `sha256:cd9b08628711...` |
| 82 | `21-5-handoff-why` | Handoff는 다음 세션을 위한 기억 장치입니다 | Final Workflow | inline | 5 | `sha256:38700a2fed26...` |
| 83 | `21-6-handoff-template` | HANDOFF.md는 상태와 결정을 같이 남깁니다 | Final Workflow | inline | 5 | `sha256:bca3566d2580...` |
| 84 | `21-7-handoff-next-prompt` | 다음 프롬프트까지 남겨야 handoff가 완성됩니다 | Final Workflow | inline | 5 | `sha256:42a0c6213a8d...` |
| 85 | `21-8-practice-handoff` | 발표자료 handoff를 작성합니다 | Final Workflow | inline | 5 | `sha256:928c8406c843...` |
| 86 | `21-4-team-retrospective` | 팀 회고 질문은 하나면 충분합니다 | Final Workflow | inline | 5 | `sha256:e873565e5ac6...` |
| 87 | `21-9-practice-personal-harness` | 내 프로젝트에 가져갈 하네스 3개를 고릅니다 | Final Workflow | inline | 5 | `sha256:ae966e139057...` |

