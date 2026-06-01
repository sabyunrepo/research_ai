# lecture-cuts content inventory

이 파일은 `scripts/export-lecture-cuts-contract.js`가 현재 `lecture-cuts/` 덱에서 추출한 재현 기준입니다.
다른 주제로 발표자료를 만들 때 이 덱의 구조, 필드 출처, 검증 기준을 golden reference로 사용합니다.

## Summary

- Slide count: 58
- Registry: lecture-cuts/assets/slides.js
- Source contract: lecture-cuts/slide-spec.json
- Source map: docs/harness/lecture-cuts-source-map.json
- Slide-specific source annotations: 57
- Deck-global source references: 10

## Section Counts

- 오프닝 / 문제 제기: 3
- 실패 패턴: 6
- 전체 지도: 3
- Spec / Prompt: 9
- Context / Memory: 4
- Skills / Superpowers: 6
- Agents / Tools: 10
- Hooks / Verification: 8
- Final Workflow: 9

## Speaker Source Counts

- inline: 58

## Optional Field Coverage

- Slides without bullet list: 7
- Slides without inline note block: 0

## Extraction Confidence

No low-confidence fields. `node scripts/export-lecture-cuts-contract.js --check-confidence` should pass.

## Slide Index

| # | id | title | section | speaker | sources | hash |
|---:|---|---|---|---|---:|---|
| 1 | `00-title` | AI 에이전트 하네스 엔지니어링 | 오프닝 / 문제 제기 | inline | 4 | `sha256:ffdac802b29d...` |
| 2 | `01-why-harness` | AI는 똑똑하지만 일관되지는 않습니다 | 오프닝 / 문제 제기 | inline | 5 | `sha256:eb0ed22da7f1...` |
| 3 | `01-1-inconsistency-before-after` | 같은 요청도 환경이 다르면 결과가 달라집니다 | 오프닝 / 문제 제기 | inline | 1 | `sha256:686a9c84b82a...` |
| 4 | `02-failure-patterns` | 실패는 보통 성능보다 절차 문제입니다 | 실패 패턴 | inline | 5 | `sha256:92e06245bbca...` |
| 5 | `02-1-why-llms-fail` | LLM은 빈칸을 추론으로 채웁니다 | 실패 패턴 | inline | 1 | `sha256:f3c5767f03a1...` |
| 6 | `02-2-failure-example-read-before-edit` | 읽지 않고 고치면 API를 상상합니다 | 실패 패턴 | inline | 10 | `sha256:6be9d420fb2f...` |
| 7 | `02-3-failure-example-skip-test` | 테스트를 느슨하게 하면 성공처럼 보입니다 | 실패 패턴 | inline | 1 | `sha256:ac5b99c08ad4...` |
| 8 | `02-4-failure-example-context-drift` | 오래된 가정은 현재 작업을 오염시킵니다 | 실패 패턴 | inline | 1 | `sha256:1aed51d1065e...` |
| 9 | `02-5-improvement-process-guardrails` | 과도한 프롬프트를 쓰지 말고 절차를 만듭니다 | 실패 패턴 | inline | 4 | `sha256:f7a4c50fce17...` |
| 10 | `00-1-workbench-preview` | 우리가 만들 것은 프롬프트가 아니라 작업장입니다 | 전체 지도 | inline | 6 | `sha256:03da691371a6...` |
| 11 | `03-1-layer-responsibility` | 반복 실패는 맞는 레이어로 올립니다 | 전체 지도 | inline | 2 | `sha256:b1cfac52378a...` |
| 12 | `03-2-harness-flow` | 승격 기준은 빈도와 위험도입니다 | 전체 지도 | inline | 6 | `sha256:ba02df955270...` |
| 13 | `13-spec-driven` | 바이브 구현에서 spec(명세)기반으로 | Spec / Prompt | inline | 2 | `sha256:a47c506b4725...` |
| 14 | `13-2-spec-contract` | 좋은 명세는 네 가지를 고정합니다 | Spec / Prompt | inline | 1 | `sha256:feaf70b43639...` |
| 15 | `13-4-spec-plan-review-flow` | Spec은 plan과 review로 이어져야 합니다 | Spec / Prompt | inline | 1 | `sha256:054206ae969c...` |
| 16 | `04-prompt-layer` | 프롬프트는 이번 요청의 작업 지시입니다 | Spec / Prompt | inline | 5 | `sha256:de40e9a79563...` |
| 17 | `07-reasoning-prompts` | “단계별로 생각해”를 남발하지 않습니다 | Spec / Prompt | inline | 1 | `sha256:ec72f5e1527c...` |
| 18 | `04-2-xml-boundaries` | 입력 경계가 선명하면 모델의 오독이 줄어듭니다 | Spec / Prompt | inline | 1 | `sha256:c1ef33b8d8a8...` |
| 19 | `04-1-prompt-anatomy` | 좋은요청은 여섯개의 섹션으로 나뉩니다 | Spec / Prompt | inline | 1 | `sha256:4e500b866c2c...` |
| 20 | `07-1-reasoning-output-pattern` | 완료는 선언이 아니라 증거로 판단합니다 | Spec / Prompt | inline | 1 | `sha256:f9a76dc8321a...` |
| 21 | `07-2-reasoning-avoid-overask` | 작업 성격에 따라 요청 강도를 조절합니다 | Spec / Prompt | inline | 1 | `sha256:ba3606fb9cb4...` |
| 22 | `08-claude-md` | CLAUDE.md는 항상 적용되는 프로젝트 지침입니다 | Context / Memory | inline | 3 | `sha256:cdd586f911d9...` |
| 23 | `08-2-good-claude-md` | 좋은 CLAUDE.md는 짧고 갱신 되어야합니다 | Context / Memory | inline | 2 | `sha256:bd8e9daa34b3...` |
| 24 | `09-context-engineering` | 컨텍스트는 작업대 위 참고 자료입니다 | Context / Memory | inline | 3 | `sha256:0afdddb92418...` |
| 25 | `09-3-context-drift-check` | 완료 전 현재 목표와 컨텍스트를 다시 맞춥니다 | Context / Memory | inline | 2 | `sha256:aca061643b6f...` |
| 26 | `10-skills` | 스킬로 만들 일은 반복성과 기준이 있습니다 | Skills / Superpowers | inline | 1 | `sha256:be06d5267b76...` |
| 27 | `10-1-skill-trigger-description` | 스킬은 호출 조건, 절차, 자료를 분리합니다 | Skills / Superpowers | inline | 1 | `sha256:77a443e3e75d...` |
| 28 | `11-1-real-skill-folder` | 스킬 폴더는 위에서 아래로 읽습니다 | Skills / Superpowers | inline | 2 | `sha256:f1dc50aa16e5...` |
| 29 | `12-superpowers` | Superpowers는 스킬 기반 하네스 패키지입니다 | Skills / Superpowers | inline | 1 | `sha256:df9868af75d8...` |
| 30 | `12-1-superpowers-as-harness` | Superpowers는 스킬 묶음이 아니라 작업 규율입니다 | Skills / Superpowers | inline | 2 | `sha256:3dc5ca6f6692...` |
| 31 | `12-2-superpowers-workflow-map` | 각 Superpower는 개발 루프의 다른 지점을 맡습니다 | Skills / Superpowers | inline | 2 | `sha256:840b1eeab895...` |
| 32 | `14-subagents` | 서브에이전트는 역할과 컨텍스트를 분리합니다 | Agents / Tools | inline | 2 | `sha256:ed4df555c62a...` |
| 33 | `14-1-subagent-context-isolation` | Subagent는 작은 AI가 아니라 분리된 컨텍스트입니다 | Agents / Tools | inline | 1 | `sha256:d3db8045b78e...` |
| 34 | `14-2-reviewer-subagent-example` | Reviewer와 Researcher는 판단 축이 다릅니다 | Agents / Tools | inline | 2 | `sha256:8f889064c48f...` |
| 35 | `15-agent-teams` | 요즘은 병렬 에이전트로 확장합니다 | Agents / Tools | inline | 2 | `sha256:7f5a03d8a38c...` |
| 36 | `15-1-parallel-safe` | 병렬화는 안전한 경우와 위험한 경우를 나눕니다 | Agents / Tools | inline | 1 | `sha256:c85146af79eb...` |
| 37 | `18-2-tool-permissions` | 에이전트 도구는 권한과 개수를 좁혀야 합니다 | Agents / Tools | inline | 2 | `sha256:23fe8ce7d075...` |
| 38 | `18-mcp` | MCP는 도구 연결을 표준화합니다 | Agents / Tools | inline | 3 | `sha256:36ac2a4ae755...` |
| 39 | `18-1-mcp-structure` | MCP는 AI 앱과 도구 서버를 연결합니다 | Agents / Tools | inline | 3 | `sha256:2fc2f0cebe06...` |
| 40 | `18-3-mcp-server-features` | MCP 서버는 세 가지를 제공합니다 | Agents / Tools | inline | 1 | `sha256:82fd0003100f...` |
| 41 | `18-4-practice-agent-tool-split` | 역할과 도구를 한 장으로 분리합니다 | Agents / Tools | inline | 2 | `sha256:ef8c35b1c73d...` |
| 42 | `16-hooks` | 훅은 지시가 아니라 실행 파이프라인입니다 | Hooks / Verification | inline | 3 | `sha256:8f1718d1e9f5...` |
| 43 | `16-4-skill-vs-hook` | 스킬은 지침이고 Hook은 실행입니다 | Hooks / Verification | inline | 3 | `sha256:4248c9ddb1cb...` |
| 44 | `17-hook-advanced` | 훅은 echo에서 test까지 단계적으로 키웁니다 | Hooks / Verification | inline | 3 | `sha256:944912654af7...` |
| 45 | `19-evaluation` | 완료의 기준은 검증 증거입니다 | Hooks / Verification | inline | 1 | `sha256:3ff6290112c1...` |
| 46 | `19-2-judge-checks` | Judge는 감상이 아니라 기준표로 판단합니다 | Hooks / Verification | inline | 1 | `sha256:01706cfd6f52...` |
| 47 | `20-loop-schedule` | 실전 자동화는 한 번 실행에서 끝나지 않습니다 | Hooks / Verification | inline | 3 | `sha256:0a42fb1d8fe4...` |
| 48 | `20-1-loop-until-pass` | Loop는 통과할 때까지 반복하는 운영 구조입니다 | Hooks / Verification | inline | 1 | `sha256:c2acd84765f5...` |
| 49 | `20-2-practice-verification-gate` | 완료 조건을 검증 게이트로 바꿉니다 | Hooks / Verification | inline | 1 | `sha256:f99c88ee3a4c...` |
| 50 | `21-final-workflow` | Deck Harness v1 | Final Workflow | inline | 4 | `sha256:bde3d61dc315...` |
| 51 | `21-1-final-artifact-structure` | 최종 산출물은 lecture-deck/입니다 | Final Workflow | inline | 4 | `sha256:e664bc144bb6...` |
| 52 | `21-10-practice-few-shot-placement` | Few-shot은 명세 바로 뒤에 둡니다 | Final Workflow | inline | 1 | `sha256:3d4d3c68abce...` |
| 53 | `21-2-bug-request-flow` | 자료는 하네스를 통과하며 발표자료가 됩니다 | Final Workflow | inline | 2 | `sha256:0b47e3dc2aaa...` |
| 54 | `21-3-final-report-template` | 최종 보고는 덱 품질의 증거입니다 | Final Workflow | inline | 1 | `sha256:80a9cfecd23f...` |
| 55 | `21-5-handoff-why` | Handoff는 상태와 다음 프롬프트를 남깁니다 | Final Workflow | inline | 1 | `sha256:ed76cc76063f...` |
| 56 | `21-8-practice-handoff` | 발표자료 handoff를 작성합니다 | Final Workflow | inline | 1 | `sha256:d096d08e64ba...` |
| 57 | `21-4-team-retrospective` | 팀 회고 질문은 하나면 충분합니다 | Final Workflow | inline | 5 | `sha256:eface9899fc0...` |
| 58 | `21-9-practice-personal-harness` | 내 프로젝트에 가져갈 하네스 3개를 고릅니다 | Final Workflow | inline | 4 | `sha256:de7fec13237b...` |

