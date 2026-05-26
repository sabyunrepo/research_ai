# Code as Agent Harness 논문 대조 브리핑

대상 논문: Xuying Ning et al., "Code as Agent Harness", arXiv:2605.18747v1, submitted 2026-05-18.

원문:
- Abstract/metadata: https://arxiv.org/abs/2605.18747
- PDF: https://arxiv.org/pdf/2605.18747

## 한 줄 판단

현재 `lecture-cuts` 발표자료는 논문의 핵심 주장과 방향이 잘 맞는다. 특히 "프롬프트 팁"이 아니라 `AGENTS/CLAUDE.md`, context, skill, subagent, MCP/tool, hook, evaluation, handoff로 작업장을 만든다는 흐름은 논문이 말하는 code-as-harness 관점과 거의 같은 실무 번역이다.

다만 논문은 하네스를 더 넓게 "실행 가능하고, 검증 가능하고, 상태를 가진 agent runtime"으로 정의한다. 우리 덱은 실무 도입에는 강하지만, 연구적 분류 체계와 운영 위험을 설명하는 장치가 일부 빠져 있다.

## 논문 핵심 정리

논문의 중심 주장은 code가 더 이상 LLM이 만들어내는 최종 산출물만이 아니라, agent가 추론하고 행동하고 환경을 모델링하고 검증하는 실행 기반 인프라라는 것이다.

논문은 code-as-agent-harness를 세 레이어로 정리한다.

1. Harness Interface
   - code for reasoning: 중간 추론을 실행 가능한 프로그램으로 외부화한다.
   - code for acting: 도구 호출, GUI/OS 명령, 로봇/시뮬레이터 정책을 code로 실행한다.
   - code for environment modeling: repo, trace, test, simulator, DOM, state를 agent가 읽고 갱신하는 세계 모델로 쓴다.

2. Harness Mechanisms
   - planning, memory/context, tool use, control loop, optimization이 긴 작업을 유지한다.
   - 핵심은 plan -> execute -> verify loop이며, 검증은 테스트/정적분석/런타임 오류/사람 피드백까지 포함한다.

3. Scaling the Harness
   - multi-agent 환경에서는 code, repo, test, trace, workflow가 공유 작업장이 된다.
   - manager, planner, coder, reviewer, tester 같은 역할 분화와 shared state synchronization이 중요해진다.

논문의 open problems는 다음이 중요하다.

- final success만 보는 평가는 부족하다. tool call 수, token, retry, wall-clock, recovery, state consistency, replayability 같은 harness-level metric이 필요하다.
- executable feedback도 oracle이 약하면 위험하다. green test가 전체 명세를 보장하지 않는다.
- self-evolving harness는 개선 계약, regression suite, rollback semantics가 필요하다.
- multi-agent는 파일 충돌뿐 아니라 가정, 계획, 권한, 메모리, 사용자 목표 충돌도 다뤄야 한다.
- human-in-the-loop은 중간 팝업이 아니라 승인/거절/예외/책임 경계가 남는 durable harness state가 되어야 한다.

## 현재 발표자료와 잘 맞는 부분

현재 덱은 56장이고 섹션은 다음처럼 구성되어 있다: 오프닝/문제 제기, 실패 패턴, 전체 지도, Spec/Prompt, Context/Memory, Skills/Superpowers, Agents/Tools, Hooks/Verification, Final Workflow.

논문과 강하게 맞는 부분:

- "AI가 똑똑하지만 일관되지 않다"는 문제 제기: 논문의 모델 단독 성능보다 주변 harness reliability가 병목이라는 주장과 맞는다.
- "프롬프트가 아니라 작업장"이라는 지도: 논문의 system-provided harness infrastructure 관점과 맞는다.
- spec -> plan -> review -> evidence: 논문의 planning as contract formation과 맞다.
- context/memory, skill, subagent, MCP/tool, hook/evaluation: 논문 3장의 mechanism 항목과 거의 대응된다.
- reviewer/researcher/subagent 분리와 병렬 에이전트: 논문 4장의 role specialization, multi-agent orchestration과 맞는다.
- hook/evaluation/loop: 논문의 execution feedback, test-gated convergence, plan-execute-verify loop와 맞는다.
- HANDOFF: 논문의 state offloading, replayability, shared interaction history와 맞는다.

## 빠져 있거나 약한 부분

1. "Code for environment modeling"이 명시적으로 약하다.
   - 현재 덱은 파일/컨텍스트/검증을 다루지만, repo state, DOM state, execution trace, test result, simulator를 agent가 보는 "세계 모델"로 묶어 설명하지 않는다.
   - 추가하면 좋은 메시지: "AI가 보는 세상은 대화창이 아니라 code로 기록된 상태다."

2. "평가의 대상은 모델이 아니라 하네스 전체"라는 관점이 약하다.
   - 현재는 검증 증거와 hook 중심으로 잘 설명하지만, harness-level metric 자체는 약하다.
   - 추가하면 좋은 항목: tool call 수, 수정 횟수, 재시도 횟수, 실패 복구율, 검증 강도, replay 가능성.

3. "검증 oracle의 한계"가 더 강하게 들어가면 좋다.
   - 현재 "느슨한 테스트는 성공처럼 보인다"는 장이 이미 있다.
   - 여기에 논문식 표현을 붙이면 더 선명하다: "초록색 테스트는 명세 전체가 아니라 특정 oracle이 통과했다는 뜻이다."

4. "하네스 변경 자체의 회귀 위험"이 약하다.
   - 현재는 workflow/hook/skill을 만들자는 메시지가 강하다.
   - 추가하면 좋은 메시지: "하네스도 코드라서, 하네스 변경에는 변경 계약, 회귀 테스트, rollback이 필요하다."

5. multi-agent shared state conflict가 아직 실무 예시 중심이다.
   - 현재는 subagent 역할 분리와 병렬 안전/위험이 있다.
   - 논문은 더 나아가 read set, write set, assumptions, version dependency, verifier obligation을 요구한다.
   - 추가하면 좋은 실습: "병렬 에이전트 작업 전에 공유 상태 계약을 작성한다."

6. human-in-the-loop safety가 권한 제한 수준에 머문다.
   - 현재는 MCP/tool 권한을 좁혀야 한다는 장이 있다.
   - 논문 관점으로는 승인/거절/예외를 durable state로 남기는 것이 핵심이다.
   - 추가하면 좋은 메시지: "승인은 대화 이벤트가 아니라 감사 가능한 상태 전이다."

7. GUI/OS agent와 multimodal environment 사례가 부족하다.
   - 현재 덱은 코딩/덱 제작/workflow 중심이다.
   - 논문은 GUI/OS 자동화, embodied agent, scientific discovery, personalization까지 확장한다.
   - 4시간 워크숍이면 전부 넣기보다 "하네스가 코드 저장소 밖에서도 똑같이 작동한다"는 짧은 확장 슬라이드가 적합하다.

## 추가 추천 슬라이드 후보

우선순위 1: 논문 프레임 지도 1장
- 위치: `00-1-workbench-preview` 뒤 또는 `03-1-layer-responsibility` 앞
- 제목 후보: "논문은 하네스를 세 레이어로 나눕니다"
- 핵심 문장: "Interface는 AI가 세상을 만지는 면, Mechanism은 오래 일하게 하는 장치, Scaling은 여러 agent가 같은 작업장을 쓰는 구조입니다."
- 효과: 우리 강의가 개인 팁이 아니라 최신 연구 프레임과 연결된다는 신뢰를 준다.

우선순위 2: 세계 모델 슬라이드 1장
- 위치: Context / Memory 섹션 앞
- 제목 후보: "AI가 보는 세상은 실행 가능한 상태입니다"
- 내용: repo files, tests, logs, DOM, traces, browser state, HANDOFF를 하나의 environment model로 묶는다.
- 효과: context를 단순 참고자료가 아니라 agent의 state model로 이해하게 만든다.

우선순위 3: Oracle 한계 슬라이드 보강
- 위치: `02-3-failure-example-skip-test` 또는 `19-evaluation` 주변
- 제목 후보: "초록색 테스트는 전체 정답이 아닙니다"
- 내용: unit test, lint, browser smoke, source coverage, human review가 각각 무엇을 검증하고 무엇을 못 보는지 표기.
- 효과: hook을 무조건 믿는 실수를 줄인다.

우선순위 4: 하네스 변경 계약 1장
- 위치: Hooks / Verification 뒤 또는 Final Workflow 앞
- 제목 후보: "하네스도 바꿀 때는 계약이 필요합니다"
- 내용: 변경 대상, 목표 실패 모드, 보존할 불변식, falsify할 검증, rollback 방법.
- 효과: skill/hook을 계속 추가하다가 workflow가 망가지는 문제를 예방한다.

우선순위 5: 병렬 에이전트 공유 상태 계약 1장
- 위치: `15-1-parallel-safe` 뒤
- 제목 후보: "병렬화 전에는 공유 상태를 잠급니다"
- 내용: read set, write set, assumptions, version, verifier obligations, conflict policy.
- 효과: 병렬 agent 설명이 "좋다/위험하다"에서 "어떻게 안전하게 굴리나"로 올라간다.

우선순위 6: 사람 승인도 상태다 1장
- 위치: `18-2-tool-permissions` 뒤
- 제목 후보: "승인은 대화가 아니라 기록입니다"
- 내용: proposed action, shown evidence, surfaced risks, approver, decision, changed boundary.
- 효과: 권한/안전 주제가 실무 governance로 연결된다.

## 넣지 않아도 되는 내용

- 논문의 모든 survey reference 나열은 발표 흐름을 무겁게 만든다.
- embodied agents, scientific discovery, personalization은 4시간 실무 워크숍의 핵심이 아니므로 부록 또는 1장 확장 사례로 충분하다.
- tool-use taxonomy 전체는 MCP/tool 섹션에 이미 실무적으로 녹아 있으므로 표 전체를 옮길 필요는 없다.

## 권장 반영 방식

현재 발표자료를 크게 갈아엎기보다 4-6장의 보강 슬라이드를 넣는 방식이 좋다.

권장 순서:

1. 전체 지도 초반에 논문 3-layer 프레임 1장 추가
2. Context / Memory 앞에 environment model 1장 추가
3. Verification 주변에 oracle adequacy 보강 1장 추가
4. Multi-agent 주변에 shared-state contract 1장 추가
5. Tool permissions 주변에 human approval as state 1장 추가
6. Final Workflow 앞에 harness mutation contract 1장 추가

이렇게 넣으면 발표자료는 "실무 도구 사용법"에서 "최신 연구 프레임으로 설명되는 agent harness engineering 워크숍"으로 격상된다.

