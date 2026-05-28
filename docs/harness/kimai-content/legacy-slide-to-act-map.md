# Legacy Slide To Kimai Act Map

Generated: 2026-05-28

## Mapping Rule

기존 `lecture-cuts` 슬라이드는 새 덱에 그대로 보존하지 않는다. 각 슬라이드는 다음 중 하나로 분류한다.

- `primary`: 해당 Act의 핵심 메시지나 실습 기준으로 재사용한다.
- `support`: presenter note, glossary, evidence, 예시 문장으로 압축한다.
- `appendix`: 본편에서는 빼고 후속 자료 또는 강사 참고로 둔다.
- `drop`: 김아이 4시간 워크숍 흐름에는 넣지 않는다.

## Act 0. 오늘의 약속

| Source Slides | Use | Reason |
|---|---|---|
| 00-title, 01-why-harness, 01-1-inconsistency-before-after | primary | "프롬프트가 아니라 업무 시스템" 기대값을 김아이 서사로 바꾼다. |
| 00-1-workbench-preview | primary | 업무 환경 지도 이미지와 Act 0 map slide의 원형으로 쓴다. |
| 03-1-layer-responsibility, 03-2-harness-flow | support | Act 0에서는 전체 구조를 암시만 하고 상세 레이어 설명은 뒤로 보낸다. |

## Act 1. 정보 선별

| Source Slides | Use | Reason |
|---|---|---|
| 02-failure-patterns, 02-1-why-llms-fail | primary | "AI가 이상하다"가 아니라 "빈칸을 추측했다"는 진단으로 재구성한다. |
| 02-2-failure-example-read-before-edit | support | 정보 없이 고치면 API를 상상한다는 사례를 일반 업무 예시로 낮춘다. |
| 02-3-failure-example-skip-test | support | Act 6 검증으로 보내고, Act 1에서는 "완료 기준 부재" 예시로만 쓴다. |
| 02-4-failure-example-context-drift | support | Act 3의 context 오염 사례로 이동한다. |
| 02-5-improvement-process-guardrails | support | Act 1 bridge에서 "절차가 필요하다"로 압축한다. |

## Act 2. 좋은 업무 지시

| Source Slides | Use | Reason |
|---|---|---|
| 13-spec-driven, 13-2-spec-contract | primary | "좋은 업무 지시는 목표, 조건, 기준을 고정한다"로 재작성한다. |
| 04-prompt-layer, 04-1-prompt-anatomy | primary | prompt 6칸 실습의 scoring rubric으로 쓴다. |
| 04-2-xml-boundaries | support | XML 경계는 화면 용어가 아니라 입력 칸 분리 원칙으로 낮춘다. |
| 13-4-spec-plan-review-flow | support | prompt 이후 plan/review 흐름은 Act 5/6로 분산한다. |
| 07-reasoning-prompts, 07-2-reasoning-avoid-overask | appendix | 일반인 본편에서는 prompt 강도 조절의 보조 팁으로만 둔다. |

## Act 3. 데스크와 회사 규칙판

| Source Slides | Use | Reason |
|---|---|---|
| 09-context-engineering | primary | context를 "김아이 데스크 위 참고 자료"로 유지한다. |
| 09-3-context-drift-check | primary | 오래된 자료가 결과를 오염시키는 검증 항목으로 쓴다. |
| 08-claude-md, 08-2-good-claude-md | primary | CLAUDE.md는 "항상 적용되는 회사 규칙판"으로 소개한다. |
| 02-4-failure-example-context-drift | primary | Act 3 실습의 before failure로 재배치한다. |

## Act 4. 반복 업무 매뉴얼

| Source Slides | Use | Reason |
|---|---|---|
| 10-skills, 10-1-skill-trigger-description | primary | Skill을 "반복 업무 매뉴얼"로 설명하고 직접 작성하게 한다. |
| 11-1-real-skill-folder | support | 파일 구조는 최소 예시로만 둔다. |
| 12-superpowers, 12-1-superpowers-as-harness | support | Superpowers는 "작업 규율 패키지"로 짧게 연결한다. |
| 12-2-superpowers-workflow-map | appendix | 본편에서는 전체 지도에 넣지 않고 강사 참고로 둔다. |

## Act 5. 역할 분리와 도구 권한

| Source Slides | Use | Reason |
|---|---|---|
| 14-subagents, 14-1-subagent-context-isolation | primary | Subagent를 작은 AI가 아니라 분리된 작업 자리로 설명한다. |
| 14-2-reviewer-subagent-example | primary | Reviewer/Researcher 판단 축 차이를 실습 역할 카드로 바꾼다. |
| 18-2-tool-permissions, 18-4-practice-agent-tool-split | primary | 도구와 권한을 역할별로 좁히는 실습 기준으로 쓴다. |
| 18-mcp, 18-1-mcp-structure, 18-3-mcp-server-features | support | MCP는 "외부 도구 연결 통로"로만 소개한다. |
| 15-agent-teams, 15-1-parallel-safe | support | 병렬성은 optional advanced note로 낮춘다. |

## Act 6. 검증과 하네스 구조

| Source Slides | Use | Reason |
|---|---|---|
| 16-hooks, 16-4-skill-vs-hook, 17-hook-advanced | primary | Hook을 "자동 검문소"로 바꿔 Stop hook 설계 실습에 쓴다. |
| 19-evaluation, 19-2-judge-checks | primary | 완료를 점수표와 판정관으로 확인하는 기준을 제공한다. |
| 20-loop-schedule, 20-1-loop-until-pass, 20-2-practice-verification-gate | primary | 반복 루프와 통과 기준을 Act 6의 최종 구조로 압축한다. |
| 07-1-reasoning-output-pattern | support | 완료 선언 대신 증거를 요구하는 bridge로 쓴다. |

## Wrap-up

| Source Slides | Use | Reason |
|---|---|---|
| 21-final-workflow, 21-2-bug-request-flow | support | 최종 하네스 연결 그림으로 압축한다. |
| 21-3-final-report-template, 21-5-handoff-why, 21-8-practice-handoff | support | "베스트 저장"과 handoff 개념을 마지막 행동으로 연결한다. |
| 21-9-practice-personal-harness | primary | 개인 업무에 가져갈 하네스 3개 선택 활동으로 유지한다. |
| 21-1-final-artifact-structure, 21-10-practice-few-shot-placement, 21-4-team-retrospective | appendix | deck harness 내부 구현 또는 팀 운영 후속 자료로 둔다. |
