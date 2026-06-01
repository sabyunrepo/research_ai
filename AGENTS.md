# Project Instructions

## Instruction Ownership

- 전역/사용자 레벨 AGENTS.md는 비워 두고, 이 프로젝트의 지침은 이 파일에서 관리한다.
- 연구 자료, 강의 덱, lecture-cuts 규칙은 전역 파일이 아니라 이 파일 또는 하위 AGENTS.md에 추가한다.

## Context Research Workflow

- 범용 자료조사, 로컬 컨텍스트 조사, 라이브러리/API 구현 가능성 확인, PPT/deck/report 근거 수집은 `.codex/skills/context-research-orchestrator/SKILL.md`를 우선 사용한다.
- 모든 조사 산출물, raw source list, skipped-tool note, 설치 추천은 프로젝트 루트 하위에 남긴다. 기본 위치는 `docs/context/`이며, generated deck이 이미 있는 경우에만 해당 deck 디렉터리 아래에 남길 수 있다.
- 전역/사용자 레벨 skill, agent, memory, config 디렉터리에 이 프로젝트의 작업 기록이나 조사 산출물을 쓰지 않는다.
- Context7, browser, PPT parser, 별도 MCP 같은 도구가 없으면 작업을 중단하지 않는다. 가능한 대체 경로로 진행하고, 최종 context pack의 `Tool Detection`과 `Install Recommendations`에만 기록한다.
- 자료조사는 두 단계로 나눈다. 브레인스토밍 전에는 `Context Triage`로 필요한 로컬/도구/최신성 제약만 확인하고, 브레인스토밍 후에는 합의된 방향에 맞춰 `Targeted Research`를 수행한다.
- context research pack을 완료했다고 보고하기 전에는 `node scripts/validate-context-research-pack.js <pack-path>`로 구조를 검증한다.

## Verification Orchestrator Workflow

- 코드, 슬라이드/deck/PPT, 일정/로드맵, 문서/보고서, 운영 체크리스트, 자료조사팩, 보안 민감 작업의 완료 여부를 판단해야 할 때는 `.codex/skills/verification-orchestrator/SKILL.md`를 우선 사용한다.
- 사용자가 "검증", "리뷰", "확인", "QA", "통과 여부", "blind spot", "자가개선", "몇 회 반복 검증"을 요청하면 검증 오케스트레이터를 사용한다.
- 작업 설명만 있고 검증 대상 유형이 명확하지 않으면 `node scripts/resolve-verification-task.js --task "<description>"`로 검증 라우트를 먼저 확인한다.
- 검증 루프는 타겟 결함 수정과 검증기 개선을 분리한다. 타겟 수정 반복은 verifier-improvement 예산을 쓰지 않고, blind spot 또는 probe-of-probe 실패로 검증기 로직을 바꿀 때만 예산을 쓴다.
- 검증 통과 후에도 기본 blind spot probe를 생략하지 않는다. 기본 검증기는 `node scripts/run-verification-orchestrator-loop.js`를 사용하고, 이 루프는 `node scripts/probe-verification-orchestrator-blind-spots.js`를 자동 실행한다.
- 검증기 자체를 개선하거나 승격했다고 보고하기 전에는 최소 `node scripts/test-verification-probe-of-probe.js`, `node scripts/test-verification-task-packs.js`, `node scripts/test-verification-orchestrator-loop.js`, `node scripts/validate-verification-orchestrator.js`를 실행한다.
- 사용자-facing 실습, lecture-cuts, generated deck, context pack처럼 프로젝트 전용 게이트가 있는 작업은 해당 게이트도 함께 실행한다. 예: `npm run qa:practice`, `node scripts/run-lecture-cuts-hook.js pre-handoff`, `node scripts/validate-context-research-pack.js <pack-path>`.
- 검증 산출물과 promotion 기록은 프로젝트 루트 하위 `.codex/verification/`과 `.codex/skills/verification-orchestrator/`에만 남긴다. 전역/사용자 레벨 skill, agent, memory, config 디렉터리는 수정하지 않는다.

## Domain-Specific Instruction Files

- `lecture-cuts/` 작업은 `lecture-cuts/AGENTS.md`의 slide contract, presentation surface, verification 규칙을 따른다.
- `lecture-deck/` 작업은 `lecture-deck/AGENTS.md`의 HTML/CSS deck harness 규칙을 따른다.
- `deck-harness/` 작업은 `deck-harness/AGENTS.md`의 generated deck workflow, slide-spec, asset-pack, handoff 규칙을 따른다.
- 김아이 Act content source 작업은 `docs/harness/kimai-content/AGENTS.md`의 문서 역할, Act topic map, metaphor dictionary 규칙을 따른다.
- `practice-harness/` 작업은 `practice-harness/AGENTS.md`의 learner UI, scoring, modal, browser QA 규칙을 따른다.
