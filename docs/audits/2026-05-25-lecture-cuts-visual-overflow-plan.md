# lecture-cuts visual overflow QA plan

검토일: 2026-05-25

범위: `node scripts/audit-lecture-cuts.js`가 보고하는 projector, desktop, mobile overflow WARN. 이 문서는 원인 분류와 수정 우선순위만 기록하며, slide HTML/JS/CSS는 수정하지 않았다.

재현 기준:

- `lecture-cuts/AGENTS.md`
- `lecture-cuts/source.md`
- `lecture-cuts/slide-spec.json`
- `docs/harness/lecture-cuts-content-inventory.md`
- `node scripts/audit-lecture-cuts.js`

### 발견

- P3 `00-title` / `lecture-cuts/00-title.html` / selector `h1`
  - projector: `scrollHeight 243 > clientHeight 228`
  - desktop: `scrollHeight 243 > clientHeight 228`
  - mobile: `scrollHeight 92 > clientHeight 84`
  - 발표 품질 영향: 낮음. 실제 텍스트 박스가 `overflow: visible`인 상태에서 Korean/cursive heading font metric이 `clientHeight`보다 크게 잡히는 패턴이다. 전체 frame fit은 PASS이고, note/image/load도 PASS다.

- P3 공통 section-detail 제목 / selectors `.deck-frame.is-section-detail h1`, `.deck-frame.is-section-detail h2`
  - 대표 슬라이드: `01-why-harness`, `01-1-inconsistency-before-after`, `02-failure-patterns`, `02-1`, `02-2`, `02-3`, `02-4`, `02-5`, `02-6`, `02-7`, `00-1`, `03-layer-map`
  - projector/desktop/mobile에서 h2가 보통 `scrollHeight` 기준 4-15px 초과한다.
  - 발표 품질 영향: 낮음. `lecture-cuts/assets/style.css`의 heading line-height와 폰트 metric 때문에 반복되는 false-positive 성격이 강하다. 다만 2줄 이상 제목인 `02-failure-patterns`, `00-1-workbench-preview`는 여백이 더 빡빡하므로 P3로만 추적한다.

- P2 `02-2-failure-example-read-before-edit` / `lecture-cuts/02-2-failure-example-read-before-edit.html`
  - projector/desktop: selector `.css-visual.failure-code-visual.read-first`가 `scrollWidth 419 > clientWidth 390`
  - mobile: selector `pre` 2개가 각각 `scrollHeight 241/362 > clientHeight 206`
  - 발표 품질 영향: 중간. 데스크톱 경고는 카드 그림자/2-column gap이 visual container보다 넓게 잡힌 영향이 섞여 있어 즉시 blocking은 아니다. 모바일에서는 코드 pre 높이가 실제로 눌려 긴 코드가 잘릴 가능성이 있다.

- P1 `02-6-improvement-turn-failure-into-rule` / `lecture-cuts/02-6-improvement-turn-failure-into-rule.html`
  - projector/desktop: selector `.lift-column` 2개가 `scrollHeight 163 > clientHeight 121`, `.lift-targets`가 `scrollHeight 67 > clientHeight 54`
  - mobile: selector `.css-visual.rule-lift-visual`이 `scrollWidth 432 > clientWidth 300`, `.lift-column` 2개가 `scrollHeight 138 > clientHeight 96`, `.lift-targets`가 `scrollWidth 414 > clientWidth 264`
  - 발표 품질 영향: 높음. 이 슬라이드는 핵심 전환 슬라이드이고, 컬럼/타겟 행 모두 실제 내용 크기가 축소된 deck frame override보다 커진다. mobile은 폭도 같이 넘는다.

- P1 `00-1-workbench-preview` / `lecture-cuts/00-1-workbench-preview.html`
  - projector/desktop: selector `.workbench-card.memory`, `.workbench-card.agent`, `.workbench-card.hook`이 `scrollWidth 158 > clientWidth 102`
  - mobile: 감사 출력 상위 20개 안에서는 `.workbench-card.memory`까지 확인됨. 같은 카드 패턴상 agent/hook/eval/tool도 모바일에서 재현 가능성이 높다.
  - 발표 품질 영향: 높음. `CLAUDE.md`, `Subagent`, `실행 조건`처럼 의미 전달에 필요한 라벨이 좁은 카드 안에서 줄바꿈/돌출될 수 있다. 이 장은 전체 지도 역할이라 읽힘이 중요하다.

- P3 `03-layer-map` / `lecture-cuts/03-layer-map.html`
  - projector/desktop/mobile: selector `h2`만 overflow WARN에 등장한다.
  - 발표 품질 영향: 낮음. 감사 출력 기준으로 `.layer-map-visual`이나 `.layer-node` 자체 overflow는 보고되지 않았다. 우선순위는 heading metric false-positive로 본다.

- P3 `01-1-inconsistency-before-after` / `lecture-cuts/01-1-inconsistency-before-after.html`
  - mobile: selector `.compare-arrow`가 `scrollHeight 53 > clientHeight 36`
  - 발표 품질 영향: 낮음. 모바일 breakpoint에서 `.compare-arrow`를 90도 회전시키는 규칙 때문에 bounding/scroll metric이 커지는 것으로 보인다. 실제 프레임 밖으로 나가는 증거는 현재 감사에는 없다.

### 원인

- P3 heading WARN의 주 원인은 `lecture-cuts/assets/style.css`의 heading typography다.
  - 전역 `h1`, `h2`는 hand-drawn/cursive 계열 fallback과 `line-height: 1` 또는 `1.02`를 사용한다.
  - deck frame override는 `.deck-frame h1`, `.deck-frame h2`, `.deck-frame.is-section-detail h1`, `.deck-frame.is-section-detail h2`에서 font-size를 줄이지만 line-height가 여전히 빡빡하다.
  - 감사 스크립트는 `scrollHeight > clientHeight + 3`이면 WARN으로 잡으므로, 실제 clipping보다 폰트 metric 차이를 먼저 감지한다.

- P2 `02-2` visual WARN은 container 축소와 내부 2-column 코드 카드의 조합이다.
  - `lecture-cuts/assets/style.css`의 `.failure-code-visual`은 2열 grid, `gap: 20px`, `padding: 34px`를 가진다.
  - deck frame에서는 `.deck-frame .failure-code-visual { width: min(100%, 390px); }`로 줄어든다.
  - mobile에서는 `.deck-frame .css-visual` 계열에 `transform: scale(.60)`를 적용하지만 원래 layout box는 남아 있고, `pre`는 `max-height`와 `overflow` 판정에 걸린다.

- P1 `02-6` visual WARN은 fixed-position card layout이 deck/mobile 축소 규칙과 맞지 않는 문제다.
  - `.rule-lift-visual` 안의 `.lift-column`은 absolute 위치와 fixed width/min-height를 갖고, deck frame에서 width/min-height만 줄어든다.
  - `.lift-column strong`의 큰 clamp font와 `gap` 때문에 실제 content height가 축소된 카드 높이를 넘는다.
  - `.lift-targets`는 4-column grid를 유지하므로 mobile width 300px/scale 조합에서 폭 overflow가 커진다.

- P1 `00-1` workbench WARN은 긴 라벨을 가진 absolute card를 deck frame에서 너무 좁게 만든 결과다.
  - 기본 `.workbench-card`는 `min-width: 138px`인데 deck frame override는 `min-width: 108px`, `font-size: 14px`로 줄인다.
  - `CLAUDE.md`, `Subagent`, `실행 조건`은 카드 안에서 자연스럽게 줄일 수 없는 라벨이라 `scrollWidth 158 > clientWidth 102`로 잡힌다.

- 감사 스크립트 측 제약도 있다.
  - `scripts/audit-lecture-cuts.js`는 각 viewport overflow report를 `report.issues.slice(0, 20)`으로 출력한다. 따라서 현재 로그는 전체 overflow 목록이 아니라 각 viewport의 첫 20개 대표 사례다.

### 권장 수정

- P1 `02-6-improvement-turn-failure-into-rule`
  - `lecture-cuts/assets/style.css`에서 `.deck-frame .rule-lift-visual` 전용 compact layout을 만든다.
  - 권장 방향: desktop/projector에서는 `.lift-column` height를 content 기준으로 늘리거나 font/gap을 줄이고, mobile에서는 `.lift-targets`를 2x2 grid로 바꾼다.
  - slide HTML copy를 바꾸지 않는 CSS-only 수정이 우선이다. visible copy를 줄이면 `lecture-cuts/assets/slides.js` speaker/script sync와 `slide-spec.json` 재생성이 필요하다.

- P1 `00-1-workbench-preview`
  - `.deck-frame .workbench-card`에 `min-width`를 다시 늘리거나, 해당 visual만 `font-size`/padding/position을 조정한다.
  - `CLAUDE.md`는 의미상 줄이면 안 되는 공식 파일명이므로 copy 축약보다 card sizing을 먼저 수정한다.
  - mobile에서는 absolute orbit layout 대신 2-column 또는 stacked card layout로 바꾸는 편이 안정적이다.

- P2 `02-2-failure-example-read-before-edit`
  - `.deck-frame .failure-code-visual`의 width를 390px보다 조금 키우거나, `.code-card` padding/gap/shadow를 줄인다.
  - mobile에서는 `pre` 높이를 키우기보다 코드 카드를 세로 stack으로 바꾸거나 코드 font-size/line-height를 낮춘다.
  - 이 슬라이드는 코드 예제가 핵심이므로 `overflow: hidden`으로 경고를 숨기는 방식은 피한다.

- P3 heading WARN
  - 전체 heading false-positive를 줄이려면 `.deck-frame h1`, `.deck-frame h2`, `.deck-frame.is-section-detail h1`, `.deck-frame.is-section-detail h2`의 `line-height`를 소폭 늘리거나 `padding-bottom`을 추가한다.
  - 다만 이 변경은 83장 전체 vertical rhythm에 영향을 주므로 P1/P2 visual overflow 수정 뒤 별도 regression pass로 처리한다.

- P3 `01-1` mobile `.compare-arrow`
  - 실제 모바일 스크린샷에서 화살표가 카드와 겹치거나 잘릴 때만 수정한다.
  - 수정한다면 rotated arrow의 fixed square size를 키우는 CSS-only 조정으로 충분하다.

### 수정 우선순위

1. P1 `02-6-improvement-turn-failure-into-rule`: `.rule-lift-visual`, `.lift-column`, `.lift-targets`
   - 이유: projector/desktop/mobile 모두에서 visual 자체가 반복 WARN이고, 강의 흐름상 "실패를 규칙으로 승격"하는 핵심 메시지 슬라이드다.

2. P1 `00-1-workbench-preview`: `.workbench-card.memory`, `.workbench-card.agent`, `.workbench-card.hook`
   - 이유: 전체 작업장 구조를 처음 제시하는 지도 슬라이드라 라벨 가독성이 발표 품질에 직접 영향을 준다.

3. P2 `02-2-failure-example-read-before-edit`: `.failure-code-visual.read-first`, `.code-card pre`
   - 이유: desktop은 일부 false-positive 가능성이 있지만 mobile 코드 pre는 실제 내용 잘림 가능성이 있다.

4. P3 heading metric group: `00-title h1`, section-detail `h2`, `03-layer-map h2`
   - 이유: 현재 evidence는 frame fit PASS와 결합되어 있고, 폰트 metric 기반 false-positive 성격이 강하다.

5. P3 `01-1-inconsistency-before-after` mobile `.compare-arrow`
   - 이유: 회전 transform에 따른 detector artifact 가능성이 높고, 현재 로그에는 frame 밖 clipping 증거가 없다.

### 검증 명령

수정자가 실제 slide/CSS를 바꾼 뒤에는 `lecture-cuts/AGENTS.md`의 coupling 규칙에 따라 다음 순서로 확인한다.

```sh
node scripts/export-lecture-cuts-contract.js
node scripts/export-lecture-cuts-contract.js --check-confidence
node scripts/validate-lecture-cuts-contract.js
node scripts/audit-lecture-cuts.js
node scripts/audit-lecture-cuts-korean-copy.js
node scripts/audit-lecture-cuts-speaker-sync.js
node scripts/verify-lecture-cuts-harness.js
```

이번 QA에서 재현한 명령:

```sh
node scripts/audit-lecture-cuts.js
```

결과 요약:

- Exit Code: 0
- PASS: slide registry, registered slide files, slide markup, local references, inline speaker script, nav order, reproduction contract
- PASS: projector/desktop/mobile render load, note exposure 0, images loaded, projector viewport fit
- WARN: 10 slides rely on deck-global source appendix only
- WARN: projector/desktop/mobile overflow
- PASS: presenter scripts 83 resolved

### 미해결

- P2 현재 감사 출력은 viewport별 overflow를 최대 20개만 보여준다. P1/P2 수정 뒤에도 숨겨진 후속 overflow가 있을 수 있으므로, 필요하면 감사 스크립트의 reporting만 별도 임시 분기에서 full list로 확인해야 한다. 검사를 약화하거나 `slice(0, 20)`을 제거한 채로 main에 남기는 방식은 권장하지 않는다.

- P2 이 보고서는 DOM metric 기반으로 분류했다. 실제 발표 품질 최종 판단은 projector 1280x720 및 mobile 390x844 screenshot으로 affected slides를 눈으로 확인해야 한다.

- P3 source coverage WARN 10건은 overflow 범위 밖이다. 현재 overflow 수정 우선순위에는 넣지 않았다.

- P3 이 QA 서브에이전트의 write scope는 이 보고서 하나뿐이라 slide HTML/JS/CSS, `slide-spec.json`, handoff 문서는 수정하지 않았다.
