# 실습 하네스 백엔드 구현 계획

> **agentic worker 필수 지침:** 이 계획을 실행할 때는 `superpowers:subagent-driven-development` 또는 `superpowers:executing-plans`를 사용한다. 각 단계는 체크박스(`- [x]`) 단위로 추적한다.

**목표:** Act 1과 Act 6 실습 페이지를 위한 공통 백엔드 인프라를 만든다. 여러 수강생이 동시에 접속해 제출해도 각자의 시도와 점수가 분리되고, deterministic 채점과 피드백을 받은 뒤, 나중에 LLM API 또는 `codex exec` 기반 보조 피드백을 provider 교체만으로 붙일 수 있어야 한다.

**아키텍처:** `lecture-cuts` 발표 서버와 분리된 `practice-harness/` 모듈을 먼저 만든다. 공통 엔진은 실습 정의, 시도 저장, deterministic 채점, 피드백 렌더링, unlock 판정, provider fallback, HTTP 라우팅을 책임진다. LLM API와 `codex exec`는 adapter 구현일 뿐이며 점수, unlock, learner 상태를 직접 결정하지 않는다.

**기술 스택:** Node.js CommonJS 모듈, Node `http`, Node test runner, JSON 실습 정의, MVP용 in-memory attempt store, 이후 선택 가능한 file/SQLite store, standalone 검증 후 기존 `lecture-cuts` 서버 통합.

---

## 운영 원칙

이 백엔드는 수강생에게 가르칠 강의 내용이 아니라 강의 운영 인프라다. 수강생 화면에는 실습 과제, 선택/입력값, 점수, 빠진 항목, 피드백, 검증 로그, 재시도 상태, unlock 결과만 보여 준다. provider 선택, raw LLM prompt, `codex exec` 명령, 프로세스 출력, 큐 내부 상태, API key, 서버 stack trace는 노출하지 않는다.

다수 수강생 동시 제출을 기본 전제로 한다. 모든 요청은 `learnerSessionId`, `practiceId`, `attemptId`로 스코프를 나눈다. 전역 current user, 단일 공유 attempt, 요청 순서 의존, 전체 서버를 막는 긴 provider 호출은 금지한다.

점수와 unlock은 재현 가능해야 한다. deterministic scorer가 점수, pass/fail check, unlock, 안전/위험 선택지를 결정한다. LLM API 또는 `codex exec`는 설명 품질, 개선 예시, 강사용 artifact 생성만 보조한다. provider가 실패해도 deterministic 피드백은 반환되어야 한다.

## Provider 정책

첫 구현부터 다음 경계를 둔다.

```js
async function evaluateWithJudgeProvider({
  provider,
  practice,
  attempt,
  deterministicResult,
  timeoutMs
}) {
  return {
    status: "skipped",
    provider: "none",
    feedback: [],
    warnings: []
  };
}
```

Provider 역할:

```text
none
- 기본 provider.
- 네트워크를 사용하지 않는다.
- 테스트, 리허설, 긴급 오프라인 수업 모드에 사용한다.

openai
- 추후 LLM API adapter.
- structured supplemental feedback만 생성한다.
- env var 또는 rate limit으로 비활성화될 수 있다.
- deterministic score와 unlock을 바꾸지 않는다.

codexExec
- 추후 통제된 로컬 adapter.
- 강사용 artifact 생성 또는 오프라인 리뷰에 사용한다.
- 수강생 제출 경로의 기본 provider로 쓰지 않는다.
- 수강생 입력을 shell command에 직접 전달하지 않는다.
```

## 파일 구조

생성할 파일:

```text
practice-harness/
  README.md
  practices/
    act1-info-selection.json
    act6-stop-hook-gate.json
  src/
    create-practice-app.js
    errors.js
    feedback-renderer.js
    judge-provider.js
    json-http.js
    practice-definition-store.js
    scoring-engine.js
    stores/
      memory-attempt-store.js
    unlock-policy.js
  test/
    act1-scoring.test.js
    act6-scoring.test.js
    attempt-store.test.js
    definition-store.test.js
    http-app.test.js
    provider-fallback.test.js
scripts/
  serve-practice-harness.js
  verify-practice-harness.js
```

standalone 백엔드 검증이 끝난 뒤에만 수정할 파일:

```text
scripts/serve-lecture-cuts-review.js
Dockerfile
docker-compose.yml
```

## API 계약

라우트:

```text
GET  /api/practices
GET  /api/practices/:practiceId
POST /api/practices/:practiceId/attempts
GET  /api/practices/:practiceId/attempts/:attemptId
```

Attempt 요청:

```json
{
  "learnerSessionId": "learner-local-001",
  "input": {
    "answers": {
      "q1": ["q1-purpose", "q1-responsive"],
      "q2": ["q2-browser"],
      "q3": ["q3-audience"]
    }
  },
  "judge": {
    "enabled": false,
    "provider": "none"
  }
}
```

Attempt 응답:

```json
{
  "ok": true,
  "attempt": {
    "attemptId": "attempt_000001",
    "practiceId": "act1-info-selection",
    "learnerSessionId": "learner-local-001",
    "attemptNumber": 1,
    "score": 72,
    "maxScore": 100,
    "unlocked": false,
    "checks": [
      {
        "id": "required-info-check",
        "label": "필수 정보",
        "status": "partial",
        "points": 42,
        "maxPoints": 60,
        "explanation": "필수 정보 일부가 빠졌습니다."
      }
    ],
    "feedback": [
      {
        "severity": "hint",
        "message": "다음 시도에서는 화면 기준과 완료 기준을 함께 넣어보세요."
      }
    ],
    "verificationLog": [
      {
        "checkId": "scope-noise-check",
        "status": "pass",
        "message": "범위 밖 정보가 과하게 포함되지 않았습니다."
      }
    ],
    "judgeResult": null,
    "providerWarnings": [],
    "createdAt": "2026-05-28T00:00:00.000Z"
  }
}
```

에러 응답:

```json
{
  "ok": false,
  "error": {
    "code": "invalid_input",
    "message": "answers 객체가 필요합니다."
  }
}
```

## Task 1: 실습 정의 저장소

**파일:**
- 생성: `practice-harness/practices/act1-info-selection.json`
- 생성: `practice-harness/practices/act6-stop-hook-gate.json`
- 생성: `practice-harness/src/errors.js`
- 생성: `practice-harness/src/practice-definition-store.js`
- 생성: `practice-harness/test/definition-store.test.js`

- [x] **Step 1: 실패하는 테스트 작성**

`practice-harness/test/definition-store.test.js`를 만든다.

테스트 내용:

```text
Act 1과 Act 6 정의를 목록으로 읽을 수 있다.
각 id로 전체 definition을 읽을 수 있다.
없는 id를 요청하면 code가 practice_not_found인 typed error를 던진다.
```

실행:

```bash
node --test practice-harness/test/definition-store.test.js
```

예상: `practice-definition-store` 모듈이 없어 FAIL.

- [x] **Step 2: 최소 실습 정의 작성**

Act 1 JSON의 최상위 필드:

```json
{
  "id": "act1-info-selection",
  "title": "실습 1: 김아이에게 무엇을 알려줘야 할까요?",
  "type": "multi-question-choice",
  "maxScore": 100,
  "unlockThreshold": 90,
  "questions": []
}
```

Act 6 JSON의 최상위 필드:

```json
{
  "id": "act6-stop-hook-gate",
  "title": "실습 6: 완료 전 Stop hook 검문소를 설계합니다",
  "type": "checklist-unlock",
  "maxScore": 100,
  "unlockThreshold": 100,
  "groups": []
}
```

- [x] **Step 3: 저장소와 typed error 구현**

`createPracticeDefinitionStore({ practicesDir } = {})`는 다음을 제공한다.

```text
*.json 실습 정의 읽기
id/title/type/maxScore/unlockThreshold 필수 필드 검증
listPractices()로 요약 목록 반환
getPractice(id)로 전체 definition 반환
없는 id는 code: "practice_not_found" 에러
```

- [x] **Step 4: 검증**

실행:

```bash
node --test practice-harness/test/definition-store.test.js
```

예상: PASS.

## Task 2: Act 1 deterministic 채점

**파일:**
- 수정: `practice-harness/practices/act1-info-selection.json`
- 생성: `practice-harness/src/scoring-engine.js`
- 생성: `practice-harness/src/feedback-renderer.js`
- 생성: `practice-harness/test/act1-scoring.test.js`

- [x] **Step 1: 실패하는 채점 테스트 작성**

세 입력을 테스트한다.

```text
best input: 필수 선택지를 고르고 오염 선택지가 없으면 score >= 90
mixed input: 필수 항목을 놓치고 noise를 고르면 score가 50~89 사이
invalid input: 없는 choice id를 보내면 invalid_input 에러
```

실행:

```bash
node --test practice-harness/test/act1-scoring.test.js
```

예상: `scorePracticeAttempt`가 없어 FAIL.

- [x] **Step 2: Act 1 정의 채우기**

`docs/harness/lecture-cuts-redesign-master-spec.md`의 3문항을 JSON으로 옮긴다.

```text
q1 반응형 카드 컴포넌트
q2 결제 버튼 오류 수정
q3 발표자료 슬라이드 다듬기
```

각 선택지는 다음 형태를 가진다.

```json
{
  "id": "q1-purpose-action",
  "label": "카드가 들어갈 페이지의 목적과 사용자가 눌러야 할 행동",
  "kind": "required",
  "points": 10,
  "missingFeedback": "페이지 목적과 행동이 없으면 김아이가 카드의 우선순위를 추측합니다."
}
```

허용되는 `kind`:

```text
required
helpful
conditional
noise
pollution
```

- [x] **Step 3: Act 1 scorer 구현**

`scorePracticeAttempt({ practice, input })` 동작:

```text
input.answers가 object인지 검증
선택된 choice id가 해당 question에 존재하는지 검증
선택된 choice points 합산
빠진 required choice penalty 반영
score를 0..maxScore로 clamp
required-info-check, scope-noise-check, ambiguity-check, actionability-check 생성
빠진 required와 선택된 noise/pollution에 대한 feedback 생성
checks와 연결되는 verificationLog 생성
```

- [x] **Step 4: 검증**

실행:

```bash
node --test practice-harness/test/act1-scoring.test.js
```

예상: PASS.

## Task 3: Act 6 deterministic 채점과 unlock

**파일:**
- 수정: `practice-harness/practices/act6-stop-hook-gate.json`
- 수정: `practice-harness/src/scoring-engine.js`
- 생성: `practice-harness/src/unlock-policy.js`
- 생성: `practice-harness/test/act6-scoring.test.js`

- [x] **Step 1: 실패하는 unlock 테스트 작성**

다음 케이스를 테스트한다.

```text
안전한 전체 체크리스트: score 100, unlocked true
always-block 선택: 일부 정답이 있어도 unlocked false
loop guard 누락: score 100 미만, unlocked false
```

실행:

```bash
node --test practice-harness/test/act6-scoring.test.js
```

예상: Act 6 채점이 없어 FAIL.

- [x] **Step 2: Act 6 정의 채우기**

체크리스트 그룹:

```text
trigger
state
stopCondition
evidence
```

정상 항목 예:

```json
{
  "id": "trigger-user-prompt-processing",
  "label": "새 요청이 들어오면 processing으로 바꾼다",
  "points": 20,
  "requiredForUnlock": true
}
```

위험 항목 예:

```json
{
  "id": "stop-always-block",
  "label": "항상 block",
  "points": -30,
  "blocksUnlock": true,
  "feedback": "항상 block하면 Stop hook이 멈출 수 없어 반복 위험이 생깁니다."
}
```

- [x] **Step 3: Act 6 scorer 구현**

`checklist-unlock` 실습 동작:

```text
input.selectedIds가 array인지 검증
선택 항목 points 합산
requiredForUnlock 항목이 모두 있는지 확인
blocksUnlock 항목이 있으면 unlock 차단
loop-safety-check, completion-evidence-check, state-machine-check 생성
unlock 상태면 unlockArtifact 포함
```

Unlock artifact:

```json
{
  "kind": "prompt",
  "title": "Claude Code용 범용 완료 전 Stop hook 생성 프롬프트",
  "body": "Claude Code용 범용 완료 전 Stop hook 설정과 예제 스크립트를 만들어줘..."
}
```

- [x] **Step 4: 검증**

실행:

```bash
node --test practice-harness/test/act6-scoring.test.js
```

예상: PASS.

## Task 4: 다수 수강생 attempt store

**파일:**
- 생성: `practice-harness/src/stores/memory-attempt-store.js`
- 생성: `practice-harness/test/attempt-store.test.js`

- [x] **Step 1: 실패하는 동시성 테스트 작성**

테스트 내용:

```text
learner-a와 learner-b가 같은 act1에 제출해도 서로 덮어쓰지 않는다.
각 learner의 첫 attemptNumber는 1이다.
learner-a가 두 번째 제출하면 attemptNumber가 2가 된다.
attempt id는 서로 다르다.
저장된 attempt는 immutable snapshot이다.
```

실행:

```bash
node --test practice-harness/test/attempt-store.test.js
```

예상: store가 없어 FAIL.

- [x] **Step 2: memory store 구현**

API:

```js
function createMemoryAttemptStore() {
  return {
    createAttempt(attempt),
    getAttempt({ practiceId, attemptId }),
    listAttempts({ practiceId, learnerSessionId })
  };
}
```

구현 규칙:

```text
practiceId와 learnerSessionId 기준으로 상태 분리
attempt_000001 형식의 opaque id 생성
write/read 모두 deep clone
내부 mutable object 노출 금지
```

- [x] **Step 3: 검증**

실행:

```bash
node --test practice-harness/test/attempt-store.test.js
```

예상: PASS.

## Task 5: Judge provider fallback

**파일:**
- 생성: `practice-harness/src/judge-provider.js`
- 생성: `practice-harness/test/provider-fallback.test.js`

- [x] **Step 1: 실패하는 provider 테스트 작성**

테스트 내용:

```text
none provider는 judgeResult null, warnings 없음
throwing provider는 providerWarnings를 만들고 deterministic score는 유지
slow provider는 timeout 후 deterministic score 유지
```

실행:

```bash
node --test practice-harness/test/provider-fallback.test.js
```

예상: provider boundary가 없어 FAIL.

- [x] **Step 2: provider runner 구현**

`evaluateWithJudgeProvider` 동작:

```text
provider 이름 "none" 지원
테스트용 injected provider object 지원
timeoutMs를 Promise.race로 적용
{ judgeResult, providerWarnings } 반환
deterministicResult를 mutate하지 않음
provider 실패를 learner request path로 throw하지 않음
```

- [x] **Step 3: 검증**

실행:

```bash
node --test practice-harness/test/provider-fallback.test.js
```

예상: PASS.

## Task 6: HTTP 앱

**파일:**
- 생성: `practice-harness/src/json-http.js`
- 생성: `practice-harness/src/create-practice-app.js`
- 생성: `practice-harness/test/http-app.test.js`
- 생성: `scripts/serve-practice-harness.js`

- [x] **Step 1: 실패하는 HTTP 테스트 작성**

테스트 내용:

```text
GET /api/practices는 act1과 act6 요약을 반환한다.
POST /api/practices/act1-info-selection/attempts는 attempt JSON을 반환한다.
잘못된 body는 ok false와 invalid_input을 반환한다.
없는 attempt 조회는 attempt_not_found를 반환한다.
```

실행:

```bash
node --test practice-harness/test/http-app.test.js
```

예상: HTTP app이 없어 FAIL.

- [x] **Step 2: JSON helper 구현**

`json-http.js` 제공 기능:

```text
sendJson(response, statusCode, payload)
readJsonBody(request, { maxBytes })
sendError(response, statusCode, code, message)
```

실습 제출 body 기본 제한은 64KB로 둔다.

- [x] **Step 3: 앱 구현**

`createPracticeApp({ definitionStore, attemptStore, judgeProvider })`는 Node `http.createServer`에 넣을 request handler를 반환한다.

POST attempt route 동작:

```text
practice 로드
deterministic scoring 실행
optional provider 평가
attempt snapshot 저장
attempt response 반환
```

- [x] **Step 4: serve script 구현**

`scripts/serve-practice-harness.js`:

```text
--port 지원
HOST 또는 127.0.0.1 사용
http://host:port/api/practices 출력
```

- [x] **Step 5: 검증**

실행:

```bash
node --test practice-harness/test/http-app.test.js
```

예상: PASS.

## Task 7: 검증 스크립트

**파일:**
- 생성: `scripts/verify-practice-harness.js`

- [x] **Step 1: 검증 스크립트 구현**

스크립트 동작:

```text
node --test practice-harness/test/*.test.js 실행
practice app을 임시 포트로 시작
Act 1 smoke attempt POST
Act 6 unlock smoke attempt POST
PASS 라인 출력
실패 시 non-zero exit
```

- [x] **Step 2: 검증**

실행:

```bash
node scripts/verify-practice-harness.js
```

예상:

```text
PASS practice harness tests
PASS act1 smoke attempt
PASS act6 smoke attempt
```

## Task 8: Standalone PASS 후 통합 결정

**파일:**
- 수정: `scripts/serve-lecture-cuts-review.js`
- 이번 범위에서 수정하지 않음: `Dockerfile`
- 이번 범위에서 수정하지 않음: `docker-compose.yml`

- [x] **Step 1: 통합 방식 비교**

Mode A, same-process mount:

```text
lecture server가 createPracticeApp을 import
/api/practices/*를 practice handler로 위임
로컬 수업 배포가 단순함
같은 프로세스 장애 위험 있음
```

Mode B, sidecar service:

```text
docker-compose가 practice server를 별도 service로 실행
lecture page가 PRACTICE_API_ORIGIN으로 호출
격리가 좋음
배포 요소가 늘어남
```

MVP 결정: standalone 검증 후 Mode A를 적용했다. 단, 모든 실습 로직은 계속 `practice-harness/` 아래에 유지하고 lecture server에는 route delegation만 둔다.

- [x] **Step 2: 통합 전 smoke 추가**

다음을 증명하는 smoke script를 만들거나 확장한다.

```text
GET /api/presentation/state 동작 유지
GET /api/practices 동작
POST /api/practices/act1-info-selection/attempts 동작
public audience mode가 의도하지 않은 instructor-only route를 노출하지 않음
```

- [x] **Step 3: 통합**

`serve-lecture-cuts-review.js`에는 route delegation만 둔다. scoring, provider, attempt-store 코드를 이 파일로 옮기지 않는다.

## 완료 기준

```text
node --test practice-harness/test/*.test.js 통과
node scripts/verify-practice-harness.js 통과
Act 1과 Act 6이 같은 attempt lifecycle 사용
여러 learner session 제출이 서로 덮어쓰지 않음
score와 unlock이 deterministic
provider 실패가 deterministic feedback을 막지 않음
learner response에 raw provider prompt, shell command, API key, server trace가 없음
AGENTS.md 인프라 규칙 충족
```
