# Context Research Pack

Status: PASS
Task: 통합 덱/발표 스크립트/실습 대시보드와 Cloudflare audience runtime 계획 수립
Artifact owner: Codex
Created: 2026-06-03
Updated: 2026-06-03
Project root: /Users/sabyun/goinfre/research_ai
Brainstorming phase: preflight
Recommended next action: Ouroboros interview로 제품/운영 결정을 확정한 뒤 Seed 생성 전 closure gate를 돈다.

## 1. Context Triage

### Task Classification

| field | value |
|---|---|
| 작업 유형 | architecture/design, code implementation planning, local repo archaeology |
| 예상 산출물 | 통합 React runtime/dashboard 계획, deck/practice registry 계약, audience runtime 계약, implementation Seed |
| 위험도 | high |
| 최신성 필요 | yes |
| 로컬 조사 필요 | yes |
| 외부 검색 필요 | yes |
| 라이브러리/API 문서 필요 | yes |
| PPT/deck/report 자료 필요 | yes |
| high-stakes domain | no |

### Tool Detection

| tool | available | used | fallback | note |
|---|---:|---:|---|---|
| local search | yes | yes | n/a | `rg`, `sed`, `node`로 로컬 계약 확인 |
| web search | yes | yes | official docs | Cloudflare, MDN, React 공식 문서 확인 |
| Context7 | no | no | official docs / package docs | 현재 세션에 Context7 도구 없음 |
| docs/parser tool | yes | yes | local text extraction | JSON/HTML/JS 직접 읽기 |
| browser/screenshot | yes | no | static file review | 아직 구현 전 preflight라 미사용 |

### Must-Read Context

| path/source | why it matters | status |
|---|---|---|
| `AGENTS.md` | context research, NotebookLM, verification project-local 규칙 | read |
| `lecture-cuts/AGENTS.md` | slide/script를 한 단위로 관리하고 audience route 보안 계약 유지 | read |
| `deck-harness/AGENTS.md` | generated deck은 slide-spec -> build -> quality gate 흐름 유지 | read |
| `practice-harness/AGENTS.md` | learner UI, score modal, browser QA, Act 5/6 특수 계약 | read |
| `scripts/serve-lecture-cuts-review.js` | 현재 deck selector, presentation state, SSE, audience public gate, practice API 통합 지점 | read |
| `generated-decks/kimai-workshop-content/slide-spec.json` | 김아이 풀덱 73장과 practice handoff 위치의 source contract | read |
| `generated-decks/kimai-workshop-content/presentation-script.json` | 발표 스크립트와 keywordFlow의 generated deck source | read |
| `practice-harness/react-src/App.jsx` | 현재 React learner UI source | read |
| `practice-harness/src/create-practice-app.js` | 실습 API와 attempt 생성/채점 경계 | read |
| Cloudflare Tunnel docs | public hostname -> local service tunnel feasibility | read |
| MDN SSE docs | existing EventSource/SSE realtime model validation | read |
| React createRoot docs | current React shell pattern validation | read |

### Pre-Brainstorm Notes

- 현재 repo는 이미 `presentation-decks.json` 기반 deck selector와 `--deck`, `--deck-root` 선택 경로를 가지고 있다.
- `scripts/serve-lecture-cuts-review.js`는 `createPracticeApp`을 같은 서버에 붙였지만, public audience gate보다 먼저 `/api/practices`를 허용한다. 실습을 public audience에서 열려면 적절하지만, raw practice API 노출 정책은 인터뷰에서 확정해야 한다.
- 김아이 풀덱에는 6개 practice handoff 슬라이드가 있다. Act 2/3는 `practiceId: null`, 나머지도 명시 매핑이 부족하다.
- 실시간 presentation state는 SSE로 구현되어 있다. 학습자별 진도/점수는 같은 패턴의 SSE channel을 확장하면 된다.
- 현재 attempt store는 in-memory다. 여러 명 동시 수업 중 식별과 로그는 가능하지만, 서버 재시작/장시간 운영/사후 리포트까지 원하면 file 또는 SQLite store가 필요하다.

### Questions For Brainstorming

- 통합 대시보드는 기존 `serve-lecture-cuts-review.js`를 확장할지, 새 `presentation-runtime/` React 앱으로 분리할지?
- public audience에서 실습 API를 공개할 때 이름/닉네임만 받을지, session token/cookie까지 발급할지?
- 실습 현황은 수업 중 live modal만 필요한지, 수업 후 CSV/JSON export도 필요한지?
- 모든 덱의 source of truth는 `slide-spec.json + presentation-script.json + practice-map.json`으로 통일할지?
- Cloudflare public route에서 presenter/admin route는 계속 404로 막을지, Access 인증을 붙여 원격 presenter도 허용할지?

## 2. Brainstorming Summary

### Agreed Goal

사용자 요청 기준의 초기 목표: 현재 흩어진 HTML slide/presentation script와 React practice UI를 한 런타임에서 통합 관리하고, 김아이 풀덱의 각 실습 슬라이드 뒤에 해당 React 실습을 이어 붙인다. audience 화면은 Cloudflare Tunnel로 외부 공개 가능해야 하며, 수강생은 입장 시 이름/닉네임으로 구분되고, presenter console은 실시간 실습 현황 모달에서 진도, 점수, 시도 로그를 확인한다.

### Chosen Direction

아직 확정 전이다. preflight 근거상 추천 방향은 `unified presentation runtime`을 새 contract layer로 만들고, 기존 deck-harness/lecture-cuts/practice-harness를 재사용하는 방식이다.

### Rejected Alternatives

| alternative | why rejected |
|---|---|
| 각 deck HTML에 practice iframe을 개별 삽입 | 모든 덱 공통 재사용, dashboard 통합, 실시간 상태 추적이 깨진다. |
| practice-harness만 standalone 공개 | slide progression과 presenter console의 실습 현황 연결이 안 된다. |
| WebSocket 선도입 | 현재 코드가 SSE로 이미 presentation/audience state를 처리하므로 MVP는 SSE가 작고 검증 가능하다. |

### Research Questions After Brainstorming

- RQ1: 현재 repo에서 통합 덱 runtime의 재사용 지점은 어디인가?
- RQ2: 김아이 풀덱에는 실습 삽입 anchor가 충분한가?
- RQ3: Cloudflare Tunnel로 audience+practice public route를 열 수 있는가?
- RQ4: 실시간 dashboard는 SSE로 충분한가, WebSocket이 필요한가?
- RQ5: learner identity와 attempt isolation은 현재 계약으로 충분한가?

## 3. Targeted Research

### Search Plan

| research question | query family | example queries | source target | status |
|---|---|---|---|---|
| RQ1 | local deck runtime | `presentationState`, `presentation-decks.json`, `api/audience`, `speaker.js` | local | searched |
| RQ2 | local Kimai practice anchors | `practice-handoff`, `practiceId`, `transfer-to-practice` | local | searched |
| RQ3 | Cloudflare Tunnel public hostname | `Cloudflare Tunnel local service public hostname official docs` | official | searched |
| RQ4 | realtime browser updates | `MDN Server-sent events EventSource`, `Cloudflare WebSockets official docs` | official | searched |
| RQ5 | React runtime feasibility | `React createRoot official documentation` | official | searched |
| RQ5 | local learner isolation | `learnerSessionId`, `attemptStore`, `practiceId`, `attemptId` | local | searched |

### Search Iterations

| iteration | query families used | new evidence found | unresolved questions | next action |
|---|---|---|---|---|
| 1 | local deck runtime, Kimai anchors, learner isolation | Existing server already combines deck selector, presentation state SSE, audience gate, and practice API. Kimai has 6 handoff slides. | exact product boundary and persistence level | web search |
| 2 | Cloudflare Tunnel, SSE, WebSocket, React official docs | Cloudflare supports local HTTP service routing; SSE fits one-way presenter/dashboard updates; WebSocket possible if bidirectional realtime grows. | whether remote admin uses Access; DB choice | stop and interview |

### Evidence Table

| claim id | claim | evidence | source id(s) | source type | checked date | confidence | relevance |
|---|---|---|---|---|---|---|---|
| C1 | 현재 서버는 여러 덱을 선택할 수 있는 통합 runtime의 초안을 이미 갖고 있다. | `serve-lecture-cuts-review.js` reads `presentation-decks.json`, supports `--deck`, `--deck-root`, validates deck runtime files, and exposes `/api/decks`. | S1 | local | 2026-06-03 | high | high |
| C2 | 현재 서버는 presentation/audience 실시간 동기화를 SSE로 처리한다. | `presentationClients`, `audienceClients`, `sendPresentationEvent`, `/api/audience/events`, and `EventSource` clients exist. | S1, S6 | local | 2026-06-03 | high | high |
| C3 | 현재 서버는 practice API를 이미 같은 runtime에 연결한다. | `createPracticeApp` is instantiated with `createPracticeDefinitionStore` and `createMemoryAttemptStore`, and `/api/practices` is routed to it. | S1, S2 | local | 2026-06-03 | high | high |
| C4 | 김아이 풀덱에는 Act 1-6 practice handoff anchors가 있다. | `slide-spec.json` has 73 slides and handoff slides at 17, 28, 35, 47, 59, 70 with `audienceAction: transfer-to-practice`; `presentation-script.json` has matching script entries. | S3, S4 | local | 2026-06-03 | high | high |
| C5 | 김아이 handoff anchors are not fully wired to practice definitions yet. | Local parse found Act 2/3 `practiceId: null`; handoff slides need explicit mapping to `practice-harness/practices/*.json`. | S3, S4 | local | 2026-06-03 | high | high |
| C6 | learner attempt isolation is already a core practice-harness contract. | Prior plan and implementation scope requests by `learnerSessionId`, `practiceId`, and `attemptId`; API validates `learnerSessionId` and stores attempts scoped by learner. | S2, S5 | local | 2026-06-03 | high | high |
| C7 | Cloudflare Tunnel can expose local HTTP services through public hostnames without opening inbound ports. | Cloudflare docs describe mapping a public hostname to a local service such as `http://localhost:8080`, with `cloudflared` using outbound connections. | S8, S9 | official | 2026-06-03 | high | high |
| C8 | SSE/EventSource is suitable for one-way live updates from server to browser. | MDN describes server-sent events as server-pushed webpage updates and `EventSource` as the client API. | S10, S11 | official | 2026-06-03 | high | high |
| C9 | WebSocket is a viable fallback/upgrade for bidirectional realtime through Cloudflare. | Cloudflare docs say proxied WebSocket connections are supported and count as a long-lived HTTP request after initial upgrade. | S12 | official | 2026-06-03 | high | medium |
| C10 | React can own the unified dashboard shell. | React docs describe `createRoot` taking over a DOM node and rendering a root component; current practice UI already follows this pattern. | S13, S14 | official/local | 2026-06-03 | high | medium |

### Sufficiency Check

| criterion | status | evidence / note |
|---|---|---|
| enough distinct query families used | pass | 6 query families across local runtime, deck anchors, Cloudflare, SSE, WebSocket, React |
| official/primary sources checked | pass | Cloudflare, MDN, React official docs |
| local project context checked when relevant | pass | AGENTS, server, deck, practice source, prior plans |
| implementation/example evidence checked when relevant | pass | existing server/API/client code inspected |
| risk/limitation/deprecation checked | pass | WebSocket restart/keepalive note and in-memory store limitation recorded |
| contradictions or uncertainty recorded | pass | persistence/admin access/product boundary remain interview decisions |
| stop condition is explicit | pass | stop because remaining unknowns require user/product decision |

### Stop Condition

- 충분한 로컬/공식 근거를 확보했고, 남은 항목은 product/operation 결정이므로 Ouroboros interview로 넘긴다.

### Limiting Constraint

| constraint type | evidence / note |
|---|---|
| none | 구현 전 preflight이므로 browser QA와 code edits는 아직 수행하지 않았다. |

### Research State Snapshot

| state item | value |
|---|---|
| research questions tracked | RQ1-RQ5 |
| searched query families | local deck runtime, Kimai anchors, Cloudflare Tunnel, SSE/EventSource, WebSocket, React, learner isolation |
| sources reviewed | 14 |
| official/primary/local sources used | Cloudflare docs, MDN docs, React docs, repo files |
| unresolved questions | persistence, admin access model, single vs separate React app, post-class export, exact URL/route model |
| synthesis status | complete |

### Source Ledger

| source id | title | url/path | source type | checked date | used by claims |
|---|---|---|---|---|---|
| S1 | lecture-cuts review server | `scripts/serve-lecture-cuts-review.js` | local | 2026-06-03 | C1,C2,C3 |
| S2 | practice API app | `practice-harness/src/create-practice-app.js` | local | 2026-06-03 | C3,C6 |
| S3 | Kimai workshop slide spec | `generated-decks/kimai-workshop-content/slide-spec.json` | local | 2026-06-03 | C4,C5 |
| S4 | Kimai presentation script | `generated-decks/kimai-workshop-content/presentation-script.json` | local | 2026-06-03 | C4 |
| S5 | practice backend plan | `docs/superpowers/plans/2026-05-28-practice-harness-backend.md` | local | 2026-06-03 | C6 |
| S6 | generated deck audience runtime | `deck-harness/templates/assets/audience.js` | local | 2026-06-03 | C2 |
| S7 | generated deck speaker runtime | `deck-harness/templates/assets/speaker.js` | local | 2026-06-03 | C2 |
| S8 | Cloudflare Tunnel overview | https://developers.cloudflare.com/tunnel/ | official | 2026-06-03 | C7 |
| S9 | Cloudflare Tunnel routing | https://developers.cloudflare.com/tunnel/routing/ | official | 2026-06-03 | C7 |
| S10 | MDN Server-sent events | https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events | official | 2026-06-03 | C8 |
| S11 | MDN Using server-sent events | https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events | official | 2026-06-03 | C8 |
| S12 | Cloudflare WebSockets | https://developers.cloudflare.com/network/websockets/ | official | 2026-06-03 | C9 |
| S13 | React createRoot | https://react.dev/reference/react-dom/client/createRoot | official | 2026-06-03 | C10 |
| S14 | practice React app | `practice-harness/react-src/App.jsx` | local | 2026-06-03 | C10 |

### Claim Support Check

| claim id | source id | support verdict | evidence locator / quote summary | reviewer note |
|---|---|---|---|---|
| C1 | S1 | supported | lines 16-114, 144-175, 1431-1452 show registry, selection, deck validation, deck API | Direct local support |
| C2 | S1 | supported | lines 24-31, 184-195, 934-953, 1298-1305, 1363-1370 show SSE state clients | Direct local support |
| C2 | S6 | supported | `audience.js` creates `EventSource("/api/audience/events")` and refreshes slide state | Direct local support |
| C3 | S1 | supported | lines 8-38 and 1438-1440 show practice app wiring | Direct local support |
| C3 | S2 | supported | `createPracticeApp` exposes practice list, practice detail, attempt POST, and attempt GET routes | Direct local support |
| C4 | S3 | supported | node parse found handoff slides 17,28,35,47,59,70 | Direct local support |
| C4 | S4 | supported | presentation script has matching entries for all six practice handoff slide ids | Direct local support |
| C5 | S3 | supported | node parse found `practiceId: null` on Act 2/3 handoff entries and missing explicit mapping on others | Direct local support |
| C5 | S4 | supported | script entries describe handoff behavior but do not define executable practice ids | Direct local support |
| C6 | S2 | supported | lines 101-129 validate `learnerSessionId`; lines 131-149 response includes attempt fields | Direct local support |
| C6 | S5 | supported | backend plan states concurrent learners must be scoped by `learnerSessionId`, `practiceId`, and `attemptId` | Direct local support |
| C7 | S8 | supported | Cloudflare Tunnel overview describes outbound `cloudflared` and public hostname to local service mapping | Official support |
| C7 | S9 | supported | Routing docs describe published application hostname-to-service mapping and HTTP local service examples | Official support |
| C8 | S10 | supported | MDN describes server-pushed webpage updates and EventSource | Official support |
| C8 | S11 | supported | MDN says SSE is one-way and uses EventSource | Official support |
| C9 | S12 | supported | Cloudflare WebSockets docs describe proxied WebSocket support and long-lived connection considerations | Official support |
| C10 | S13 | supported | React docs describe createRoot and render into a DOM node | Official support |
| C10 | S14 | supported | current practice app calls `createRoot(document.getElementById("practice-root")).render(<App />)` | Direct local support |

### Local Findings

| file | finding | relevance |
|---|---|---|
| `scripts/serve-lecture-cuts-review.js` | Deck registry, deck selector, presentation state, audience SSE, public audience gate, practice API are already in one Node server. | Strong base for unified runtime |
| `presentation-decks.json` | Current server expects deck registry. | Future decks should register here or successor registry |
| `generated-decks/kimai-workshop-content/slide-spec.json` | 73-slide Kimai deck with 6 practice handoff anchors. | Insert practice UI after these anchors |
| `generated-decks/kimai-workshop-content/presentation-script.json` | Script entries align with all handoff slides and have interactionPrompt/transition. | Script/dashboard consolidation input |
| `deck-harness/templates/speaker.html` | Speaker console already has toolbar and keyword outline panel. | Add practice status button/modal here or successor React shell |
| `deck-harness/templates/assets/speaker.js` | Speaker posts `/api/presentation/state` and listens to `/api/presentation/events`. | Reuse state sync pattern |
| `deck-harness/templates/audience.html` | Audience iframe currently displays unlocked slides. | Needs identity gate and practice route/surface |
| `practice-harness/react-src/App.jsx` | Existing React learner UI handles all Act types. | Extract/embed into unified React runtime |
| `practice-harness/src/stores/memory-attempt-store.js` | In-memory attempt tracking by learner is present. | MVP ok; persistent dashboard needs stronger store |
| `docs/harness/lecture-cuts-cloudflare-audience.md` | Current public contract intentionally exposes audience only and blocks speaker/deck raw routes. | Must preserve or intentionally revise |

### External Findings

| source | source type | finding | checked date |
|---|---|---|---|
| Cloudflare Tunnel overview | official | Tunnel can map public hostnames to local services through outbound `cloudflared`. | 2026-06-03 |
| Cloudflare Tunnel routing | official | A published application maps a hostname to a local service such as `http://localhost:8080`. | 2026-06-03 |
| MDN SSE docs | official | SSE/EventSource supports server-pushed browser updates over HTTP. | 2026-06-03 |
| Cloudflare WebSockets docs | official | WebSockets are supported behind Cloudflare and need keepalive/timeout attention. | 2026-06-03 |
| React createRoot docs | official | React root can own a DOM node for an app shell. | 2026-06-03 |

### Implementation Feasibility

- 가능: 현재 `serve-lecture-cuts-review.js`를 `presentation-runtime`으로 일반화하고 React dashboard shell을 붙인다.
- 가능: 김아이 handoff slides 뒤에 `practiceId` 기반 practice route를 삽입하거나 audience flow에서 handoff slide 다음을 `/practice/:practiceId`로 연결한다.
- 가능: `learnerSessionId`를 nickname + generated session token으로 바꾸고, attempts/progress/events를 presenter status modal에 stream한다.
- 조건부 가능: Cloudflare public audience route에서 실습 API를 열되, admin/speaker routes는 계속 막거나 Cloudflare Access로 별도 보호한다.
- 조건부 가능: in-memory store로 MVP 수업 리허설은 가능하지만, 운영/사후 로그/재시작 복구는 SQLite/file store가 필요하다.
- 불가능/비추천: 개별 generated deck HTML마다 practice UI를 직접 복사 삽입하는 방식.
- 필요한 라이브러리/도구: 현재 React/esbuild/Node http로 MVP 가능. Persistence를 확정하면 SQLite dependency 또는 append-only JSONL store 검토.
- 대체안: SSE로 시작하고, 실시간 양방향 채팅/강제 제어/대량 connection 문제가 생기면 WebSocket으로 승격.

### Risks / Unknowns

- Public audience에서 nickname만으로 충분한지, 중복 닉네임/악의적 제출/사칭 방어가 필요한지 미정.
- Cloudflare Tunnel public route가 `/api/practices`까지 열리면 admin 정보와 raw logs 노출 경계를 새로 정의해야 한다.
- 모든 future deck의 script source를 `presentation-script.json`으로 강제할지, `assets/slides.js`의 `speakerNote` fallback을 유지할지 미정.
- 김아이 풀덱 slide-spec의 `practiceId` mapping을 어떤 schema로 둘지 미정.
- Presenter modal이 live-only인지, export/report까지 포함하는지 미정.

## 4. Context Pack For Next Agent

### Use This Context

- Start interview from the open decisions above, not from blank architecture.
- Treat existing modules as reusable assets:
  - deck runtime: `scripts/serve-lecture-cuts-review.js`
  - generated deck templates: `deck-harness/templates/*`
  - Kimai full deck: `generated-decks/kimai-workshop-content/*`
  - practice UI/API: `practice-harness/*`
- Preserve public/private route separation unless the user explicitly approves a change.
- Keep deck content source-of-truth separate from runtime state.

### Do Not Assume

- Do not assume nickname-only identity is sufficient for public classes.
- Do not assume in-memory attempt store is acceptable for the final target.
- Do not expose speaker/admin routes through Cloudflare without an explicit access model.
- Do not edit generated deck HTML directly as the durable fix; update contract/template/build layers.

### Recommended Next Step

- Run Ouroboros interview with this pack as context.
- First interview focus: target runtime boundary, learner identity policy, persistence/export needs, public/admin route policy, and MVP acceptance criteria.
- After interview, generate a Seed only after restating the goal and getting explicit approval.

### Install Recommendations

- Context7 optional for future library docs lookup.
- If persistence is selected: choose and install a project-local SQLite package only after user approval.

### Raw Source List

- `AGENTS.md`
- `lecture-cuts/AGENTS.md`
- `deck-harness/AGENTS.md`
- `practice-harness/AGENTS.md`
- `scripts/serve-lecture-cuts-review.js`
- `docs/harness/lecture-cuts-cloudflare-audience.md`
- `docs/superpowers/plans/2026-05-28-practice-harness-backend.md`
- `generated-decks/kimai-workshop-content/slide-spec.json`
- `generated-decks/kimai-workshop-content/presentation-script.json`
- `deck-harness/templates/speaker.html`
- `deck-harness/templates/assets/speaker.js`
- `deck-harness/templates/audience.html`
- `deck-harness/templates/assets/audience.js`
- `practice-harness/react-src/App.jsx`
- `practice-harness/src/create-practice-app.js`
- `practice-harness/src/stores/memory-attempt-store.js`
- https://developers.cloudflare.com/tunnel/
- https://developers.cloudflare.com/tunnel/routing/
- https://developers.cloudflare.com/network/websockets/
- https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events
- https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events
- https://react.dev/reference/react-dom/client/createRoot
