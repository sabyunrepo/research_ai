# Lecture Cuts Quality Improvement Master Plan

## 목적

현재 덱은 83장 기준으로 발표 흐름, 1-29번 대본, 압축 후보 통합, `file://` 발표용 로딩 문제까지 처리됐다. 남은 작업은 기능 복구가 아니라 품질 개선이다. 따라서 바로 수정하지 않고, 네 개의 독립 QA 축으로 진단 보고서를 먼저 만든 뒤 수정 범위를 확정한다.

## 병렬 서브에이전트

| Agent | 담당 축 | 보고서 | 산출물 |
|---|---|---|---|
| visual-overflow QA | 렌더 overflow WARN 실효성 분류 | `docs/audits/2026-05-25-lecture-cuts-visual-overflow-plan.md` | P1/P2/P3 selector별 수정 계획 |
| Korean terminology QA | 긴 제목, 긴 subtitle, 용어 혼용 | `docs/audits/2026-05-25-lecture-cuts-korean-terminology-plan.md` | 수정 문구와 용어 정책 |
| source coverage QA | deck-global-only 10장 source 보강 | `docs/audits/2026-05-25-lecture-cuts-source-coverage-plan.md` | slide-level source 보강/allowlist 판단 |
| runtime/export QA | `file://` fallback과 export drift 방지 | `docs/audits/2026-05-25-lecture-cuts-runtime-export-plan.md` | 하네스 개선 후보 |

## 수정 원칙

1. P1만 같은 라운드에서 바로 수정한다.
2. P2는 서로 충돌하지 않는 경우에만 묶어서 수정한다.
3. P3는 보고서에 남기되 발표 안정성을 해치지 않으면 다음 polish pass로 미룬다.
4. slide HTML, presenter script, `div.note`, source metadata, `slide-spec.json`, `slide-html.js`는 함께 움직인다.
5. 시각 overflow는 실제 화면 영향이 확인된 항목만 수정한다. 단순 scrollHeight/clientHeight 계측 오차는 allowlist 후보로 분리한다.

## 예상 작업 순서

1. 보고서 수집
2. P1 항목만 병합 계획으로 재정렬
3. 수정 전 `node scripts/export-lecture-cuts-contract.js --check-confidence`
4. 실제 수정
5. `node scripts/export-lecture-cuts-contract.js`
6. 검증:
   - `node scripts/validate-lecture-cuts-contract.js`
   - `node scripts/audit-lecture-cuts-speaker-sync.js`
   - `node scripts/audit-lecture-cuts-korean-copy.js`
   - `node scripts/audit-lecture-cuts.js`
   - `node scripts/verify-lecture-cuts-harness.js`
7. `file://` Playwright smoke 재확인
8. `lecture-cuts/HANDOFF.md`와 `docs/harness/lecture-cuts-agent-handoff.md` 갱신

## 결정 대기 항목

- overflow WARN을 실제 수정할지, audit allowlist/threshold 개선으로 처리할지
- mixed Korean/English term을 섹션별로 통일할지, 공식 용어 예외로 둘지
- deck-global-only 10장을 모두 slide-level source로 보강할지, 비기술 요약 슬라이드는 정책상 허용할지
- `file://` smoke를 `audit-lecture-cuts.js` 또는 `verify-lecture-cuts-harness.js`에 정식 편입할지

## 서브에이전트 결과 요약

### 1. Visual Overflow

보고서: `docs/audits/2026-05-25-lecture-cuts-visual-overflow-plan.md`

- P1: `02-6-improvement-turn-failure-into-rule.html`
  - `.rule-lift-visual`, `.lift-column`, `.lift-targets`
  - 실제 가독성 영향이 큰 핵심 전환 슬라이드.
- P1: `00-1-workbench-preview.html`
  - `.workbench-card.*`
  - 전체 지도 슬라이드라 카드 라벨 가독성이 중요함.
- P2: `02-2-failure-example-read-before-edit.html`
  - `.failure-code-visual.read-first`, `pre`
  - 모바일 코드 pre 잘림 가능성.
- P3: 제목 `h1/h2` overflow 대부분은 font metric 기반 false-positive 후보.

판단: P1 두 건은 실제 CSS 수정 대상으로 본다. P2는 P1 수정 후 남은 경고를 보고 처리한다.

### 2. Korean Terminology

보고서: `docs/audits/2026-05-25-lecture-cuts-korean-terminology-plan.md`

- P1: 없음.
- P2: 길이와 용어 혼용이 함께 걸린 슬라이드 우선.
  - `11-2-skill-frontmatter-fields.html`
  - `11-1-real-skill-folder.html`
  - `10-skills.html`
  - `14-subagents.html`
  - 그다음 `03-layer-map.html`, `19-evaluation.html`, `21-4-team-retrospective.html`
- P3: 공식 파일명, 제품명, 역할 라벨은 허용 WARN으로 둘 수 있음.

판단: 이번 즉시 수정 라운드에서는 P1이 아니므로 보류한다. 다만 다음 language polish pass의 첫 범위로 둔다.

### 3. Source Coverage

보고서: `docs/audits/2026-05-25-lecture-cuts-source-coverage-plan.md`

- 보강 권장:
  - slide 8 `02-4-failure-example-context-drift.html`
  - slide 25 `05-1-persona-weak.html`
  - slide 26 `05-2-persona-rubric.html`
  - slide 37 `09-1-context-budget.html`
  - slide 73 `21-final-workflow.html`
  - slide 75 `21-10-practice-few-shot-placement.html`
- 선택 보강:
  - slide 20 `13-4-spec-plan-review-flow.html`
  - slide 55 `15-1-parallel-safe.html`
- Allowlist 후보:
  - slide 6 `02-2-failure-example-read-before-edit.html`
  - slide 17 `13-1-vibe-vs-spec.html`

판단: 새 외부 source card가 필요한 항목은 URL 최신성 확인이 필요하므로 별도 source-grounding pass로 분리한다. 기존 source card만 붙일 수 있는 slide 20, 55, 73은 낮은 리스크지만, source policy 없이 무리하게 경고 0을 만드는 것은 피한다.

### 4. Runtime / Export Harness

보고서: `docs/audits/2026-05-25-lecture-cuts-runtime-export-plan.md`

- P1: `slide-html.js` cache drift 검증을 contract gate에 추가.
- P1: `audit-lecture-cuts.js`에 `file://` deck smoke 추가.
- P1: `verify-lecture-cuts-harness.js` syntax gate에 `lecture-cuts/assets/slide-html.js` 추가.
- P2: runtime diagnostics와 cache manifest를 contract/source map에 추가.

판단: P1 세 건은 바로 구현할 가치가 있다. `file://` 장애가 실제로 발생했기 때문에 회귀 검증에 편입해야 한다.

## 권장 실행안

### 이번 라운드에서 바로 수정

1. Runtime/export P1
   - `validate-lecture-cuts-contract.js`에 `slide-html.js` cache 일치 검증 추가.
   - `audit-lecture-cuts.js`에 `file://` smoke 추가.
   - `verify-lecture-cuts-harness.js` syntax 대상에 `slide-html.js` 추가.

2. Visual P1
   - `02-6` rule lift visual CSS compact layout.
   - `00-1` workbench card CSS 가독성 조정.

3. 변경 후 export/verify
   - `node scripts/export-lecture-cuts-contract.js`
   - `node scripts/validate-lecture-cuts-contract.js`
   - `node scripts/audit-lecture-cuts.js`
   - `node scripts/verify-lecture-cuts-harness.js`

### 다음 라운드로 분리

1. Korean terminology P2
   - 화면 문구와 발표 스크립트 동시 수정이 필요하므로 language polish pass로 처리.

2. Source coverage
   - 새 공식 source URL 확인이 필요하므로 source-grounding pass로 처리.
   - allowlist 정책을 먼저 정한 뒤 validator WARN 정책을 바꾸는 편이 낫다.

3. Visual P2/P3
   - `02-2` 모바일 코드 pre는 P1 수정 후 full overflow list와 screenshot으로 재판정.
   - heading metric false-positive는 audit threshold/allowlist 후보로 분리.
