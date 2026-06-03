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

## NotebookLM Workflow

- NotebookLM 노트북 생성, 소스 주입, NotebookLM 질의/재작성, NotebookLM 산출물 다운로드 작업은 `.codex/skills/notebooklm-project/SKILL.md`를 우선 사용한다.
- 긴 실행 지침과 명령 예시는 AGENTS.md나 CLAUDE.md에 넣지 말고 `.codex/skills/notebooklm-project/references/` 아래 레퍼런스로 관리한다.
- NotebookLM에 넣을 deck/report 소스는 프로젝트 루트 하위에 먼저 생성한다. 기본 위치는 `docs/harness/notebooklm-sources/`이며, generated deck 전용 산출물은 필요할 때 해당 deck 디렉터리 아래에 둘 수 있다.
- NotebookLM 소스 주입용 문서는 목적을 명시한다. 예: 슬라이드 화면 문구만 주입할 때는 발표 스크립트, presenter cues, speaker notes, review metadata를 제외한다고 문서 첫머리에 적는다.
- `/Users/sabyun/goinfre/notebooklm-py`는 이 프로젝트의 NotebookLM CLI 실행 기준 프로젝트다. 인증 확인과 CLI 실행 방식은 NotebookLM 로컬 스킬의 레퍼런스를 따른다.

## Verification Orchestrator Workflow

- 코드, 슬라이드/deck/PPT, 일정/로드맵, 문서/보고서, 운영 체크리스트, 자료조사팩, 보안 민감 작업의 완료 여부를 판단해야 할 때는 `.codex/skills/verification-orchestrator/SKILL.md`를 우선 사용한다.
- 사용자가 "검증", "리뷰", "확인", "QA", "통과 여부", "blind spot", "자가개선", "몇 회 반복 검증"을 요청하면 검증 오케스트레이터를 사용한다.
- 작업 설명만 있고 검증 대상 유형이 명확하지 않으면 `node scripts/resolve-verification-task.js --task "<description>"`로 검증 라우트를 먼저 확인한다.
- 검증 루프는 타겟 결함 수정과 검증기 개선을 분리한다. 타겟 수정 반복은 verifier-improvement 예산을 쓰지 않고, blind spot 또는 probe-of-probe 실패로 검증기 로직을 바꿀 때만 예산을 쓴다.
- 검증 통과 후에도 기본 blind spot probe를 생략하지 않는다. 기본 검증기는 `node scripts/run-verification-orchestrator-loop.js`를 사용하고, 이 루프는 `node scripts/probe-verification-orchestrator-blind-spots.js`를 자동 실행한다.
- 검증기 자체를 개선하거나 승격했다고 보고하기 전에는 최소 `node scripts/test-verification-probe-of-probe.js`, `node scripts/test-verification-task-packs.js`, `node scripts/test-verification-orchestrator-loop.js`, `node scripts/validate-verification-orchestrator.js`를 실행한다.
- 사용자-facing 실습, lecture-cuts, generated deck, context pack처럼 프로젝트 전용 게이트가 있는 작업은 해당 게이트도 함께 실행한다. 예: `npm run qa:practice`, `node scripts/run-lecture-cuts-hook.js pre-handoff`, `node scripts/validate-context-research-pack.js <pack-path>`.
- 검증 산출물과 promotion 기록은 프로젝트 루트 하위 `.codex/verification/`과 `.codex/skills/verification-orchestrator/`에만 남긴다. 전역/사용자 레벨 skill, agent, memory, config 디렉터리는 수정하지 않는다.

## Unified Deck Practice Dashboard

- 통합 수업 런타임의 기준 엔트리는 `scripts/serve-lecture-cuts-review.js`다. 김아이 풀덱, generated deck, 청중 화면, 발표자 콘솔, React 실습, 실습 현황은 이 서버에서 함께 관리한다.
- 로컬 운영 콘솔은 `GET /`이다. 이 화면은 덱 선택, 현재 슬라이드 상태, 청중/발표자 링크, 실습 참여자/시도 요약을 보여주는 로컬 전용 대시보드다.
- 청중 공개 표면은 `/audience.html`, `/api/audience/*`, `/api/learner/*`, `/api/practices*`, `/practices/*`, `/act/*`, practice static asset만 허용한다. Cloudflare Tunnel 외부 주소는 이 청중/실습 표면만 노출해야 한다.
- 발표자/관리 표면인 `/`, `/speaker.html`, `/presenter-review.html`, `/deck.html`, `/api/presenter/*`, `/api/presentation/*`, `/api/decks*`는 로컬 전용으로 둔다. Cloudflare 헤더가 붙은 공개 요청에서 접근 가능하게 만들지 않는다.
- React 실습 UI의 learner-facing source는 `practice-harness/react-src/App.jsx`이고, 배포 번들은 `practice-harness/public/practice-app.js`다. 실습 UI 변경 뒤에는 `npm run build:practice-ui` 또는 `npm test`로 번들을 갱신한다.
- 실습 연결은 슬라이드 번호가 아니라 deck-local `practice-map.json`의 `afterSlideId -> practiceId` 계약으로 한다. 김아이 덱은 `generated-decks/kimai-workshop-content/practice-map.json`과 `scripts/validate-kimai-practice-map.js`가 기준이다.
- learner 식별은 nickname 표시명과 서버 발급 session cookie/token을 함께 사용한다. 같은 닉네임은 허용하지만 서로 다른 session으로 분리해야 하며, 같은 브라우저 재입장은 기존 session/progress를 복구해야 한다.
- 실습 진행/시도 로그는 프로젝트 로컬 `.codex/runtime/practice-dashboard/<deckId>.jsonl`에 기록한다. 라이브 수업 기능에서 in-memory-only 진행 상태를 최종 구현으로 두지 않는다.
- 앞으로 생성되는 deck-harness 덱의 청중/발표자 화면은 `deck-harness/templates/audience.html`, `deck-harness/templates/assets/audience.js`, `deck-harness/templates/speaker.html`, `deck-harness/templates/assets/speaker.js`에서 대시보드/실습 계약을 계승한다. generated output만 고쳐서 새 덱에 반영되지 않는 변경을 만들지 않는다.
- 통합 대시보드 관련 검증은 최소 `node --check scripts/serve-lecture-cuts-review.js`, `node scripts/validate-kimai-practice-map.js`(김아이 덱 작업 시), `npm run qa:practice`, Cloudflare 헤더를 붙인 public allowlist/blocklist smoke를 포함한다.

## Deprecated Runtime Defaults

- `scripts/serve-practice-harness.js`는 독립 실습 UI 테스트용이다. 실제 김아이 수업 운영의 메인 서버나 통합 콘솔로 취급하지 않는다.
- 덱마다 별도 static HTML 대시보드를 새로 만들지 않는다. 공통 운영 화면은 `scripts/serve-lecture-cuts-review.js`의 `/` 콘솔과 deck-harness templates를 통해 관리한다.
- 실습 handoff를 슬라이드 index나 현재 위치 계산에 직접 묶지 않는다. 순서가 바뀌어도 유지되는 `slide.id` 기반 mapping만 사용한다.
- 발표자 현황 API나 raw deck/script/admin API를 Cloudflare 공개 표면에 추가하지 않는다.

## Domain-Specific Instruction Files

- `lecture-cuts/` 작업은 `lecture-cuts/AGENTS.md`의 slide contract, presentation surface, verification 규칙을 따른다.
- `lecture-deck/` 작업은 `lecture-deck/AGENTS.md`의 HTML/CSS deck harness 규칙을 따른다.
- `deck-harness/` 작업은 `deck-harness/AGENTS.md`의 generated deck workflow, slide-spec, asset-pack, handoff 규칙을 따른다.
- 김아이 Act content source 작업은 `docs/harness/kimai-content/AGENTS.md`의 문서 역할, Act topic map, metaphor dictionary 규칙을 따른다.
- `practice-harness/` 작업은 `practice-harness/AGENTS.md`의 learner UI, scoring, modal, browser QA 규칙을 따른다.
