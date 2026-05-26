# Lecture Cuts Runtime / Export Harness QA

작성일: 2026-05-25
역할: runtime/export harness QA
범위: `file://` fallback, `slide-html.js` export, contract drift 방지 계획

### 발견

- `lecture-cuts/deck.html`은 `assets/slides.js` 다음, `assets/deck.js` 이전에 `assets/slide-html.js`를 로드한다. 실행 순서상 `deck.js`의 렌더 시작 전에 `window.LECTURE_SLIDE_HTML`이 준비된다.
- `lecture-cuts/assets/deck.js`는 `window.location.protocol === "file:"`이고 캐시가 있으면 fetch 없이 캐시 HTML을 바로 사용한다. HTTP 환경에서는 `fetch(file, { cache: "no-store" })`를 먼저 시도하고, 실패 시 캐시가 있으면 fallback으로 사용한다.
- `scripts/export-lecture-cuts-contract.js`는 `slide-spec.json`, source map, inventory와 함께 `lecture-cuts/assets/slide-html.js`를 생성한다. 캐시는 각 등록 슬라이드의 `main.slide`만 추출해 `window.LECTURE_SLIDE_HTML`로 고정한다.
- 읽기 전용 확인 결과, 현재 `assets/slides.js` 등록 83장과 `assets/slide-html.js` 캐시 83개 항목은 일치한다. 누락, extra entry, 원본 `main.slide` 대비 캐시 drift는 0개였다. 현재 캐시 파일 해시는 `sha256:38637fa5985c52014ea96fc748d02ab8d55c827fd56f1343bc2ea748ae5c0eba`다.
- `node scripts/export-lecture-cuts-contract.js --check-confidence`는 83장 confidence를 통과했고, `node scripts/validate-lecture-cuts-contract.js`는 slide count/order/file/content hash/title/speaker/source-sensitive coverage를 통과했다. 다만 source coverage WARN 10장은 runtime/export 범위 밖의 별도 QA 항목이다.
- `scripts/audit-lecture-cuts.js`의 브라우저 audit는 로컬 HTTP 서버로 `deck.html`을 열어 projector/desktop/mobile 렌더, note 노출, 이미지 로딩, overflow, presenter review를 확인한다. 현재 `file://` 경로를 직접 열지는 않는다.
- `scripts/verify-lecture-cuts-harness.js`는 `deck.js` 문법, contract validation, audit, speaker sync, Korean copy, redundancy, pre-handoff hook을 묶지만 `slide-html.js` 문법/캐시 일치/file URL smoke를 별도 gate로 호출하지 않는다.

### 리스크

- 가장 큰 운영 리스크는 slide HTML 변경 후 `scripts/export-lecture-cuts-contract.js`를 실행하지 않아 `slide-spec.json`은 최신이거나 검증돼도 `assets/slide-html.js`가 오래된 상태로 남는 경우다. HTTP 서버에서는 fetch가 원본 HTML을 읽어 정상으로 보이고, 발표자가 `file://`로 열 때만 오래된 슬라이드가 보일 수 있다.
- 현재 contract의 `contentHash`는 원본 slide HTML 전체를 잠그지만, `slide-html.js` 캐시의 항목 수, key order, 각 `main.slide` fragment hash, cache file hash를 직접 검증하지 않는다. 따라서 캐시 삭제, 누락, extra key, stale fragment는 `validate-lecture-cuts-contract.js`만으로는 잡히지 않는다.
- HTTP fallback이 fetch 실패 시 캐시로 조용히 넘어가기 때문에 개발 서버의 경로/권한/404 문제가 캐시에 가려질 수 있다. 발표 안정성에는 좋지만, 운영 진단에서는 “원본 fetch 정상”과 “캐시 fallback으로 겨우 렌더됨”을 구분해야 한다.
- `deck.js`의 `file://` 분기에서는 캐시가 없는 특정 slide만 fetch fallback으로 넘어간다. 브라우저가 local file fetch를 차단하면 해당 슬라이드에서 deck 전체 렌더가 실패할 수 있으므로, 캐시 coverage가 100%인지 강제해야 한다.
- `slide-html.js`는 생성 파일이지만 현재 verify syntax 대상에 없다. 파일이 충돌 병합 중 깨지거나 `window.LECTURE_SLIDE_HTML` 할당이 사라져도 static syntax/contract gate가 명확히 실패하지 않을 수 있다.

### 권장 하네스 개선

- P1: `validate-lecture-cuts-contract.js`에 `slideHtmlCache` 검증을 추가한다. `spec.outputFiles.slideHtmlCache`를 읽고 VM sandbox에서 `window.LECTURE_SLIDE_HTML`을 로드한 뒤 registry와 같은 key set/order인지, 각 값이 현재 slide file의 `main.slide` 추출값과 같은지, 누락/extra/stale cache가 없는지 FAIL로 처리한다.
- P1: `audit-lecture-cuts.js` 또는 `verify-lecture-cuts-harness.js`에 headless Chrome `file://.../lecture-cuts/deck.html` smoke를 넣는다. 최소 기준은 83 frame 로드, `.deck-error` 0, `#deck .note` 0, 첫 active frame `data-source="00-title.html"`, console error 0이다.
- P1: `verify-lecture-cuts-harness.js`의 syntax gate에 `lecture-cuts/assets/slide-html.js`를 추가한다. 생성 파일이더라도 발표 runtime의 필수 dependency이므로 parse 실패는 즉시 막아야 한다.
- P2: `slide-spec.json` 또는 `docs/harness/lecture-cuts-source-map.json`에 cache manifest를 추가한다. 예: `runtimeArtifacts.slideHtmlCache = { file, hash, entries: [{ file, fragmentHash }] }`. 이렇게 하면 contract가 “원본 HTML”뿐 아니라 “file URL 발표용 runtime artifact”까지 재현 기준으로 다룬다.
- P2: HTTP browser audit에서 fetch failure와 cache fallback 사용 횟수를 계측한다. `deck.js`가 `window.LECTURE_RUNTIME_DIAGNOSTICS = { fetchLoaded, cacheLoaded, fallbackLoaded, errors }` 같은 read-only diagnostics를 남기면 audit가 HTTP에서는 `fallbackLoaded === 0`, file URL에서는 `cacheLoaded === 83`을 확인할 수 있다.
- P3: `scripts/export-lecture-cuts-contract.js --check-confidence`의 이름과 역할을 분리한다. 현재는 confidence와 slide count만 확인하므로, future gate는 `--check-runtime-artifacts` 또는 별도 `scripts/check-lecture-cuts-runtime-artifacts.js`로 만드는 편이 의미가 분명하다.

### 구현 후보

1. `validate-lecture-cuts-contract.js`에 cache parser 추가
   - 입력: `spec.outputFiles.slideHtmlCache`, `assets/slides.js`, 각 slide HTML 파일
   - 검사: 캐시 파일 존재, JS 실행 후 `window.LECTURE_SLIDE_HTML` object 존재, registry 대비 missing/extra/order mismatch, `main.slide` fragment mismatch
   - 실패 메시지: `slide-html cache missing`, `slide-html cache extra`, `slide-html cache drift`

2. `audit-lecture-cuts.js`에 `runFileUrlSmoke(slides)` 추가
   - 기존 Chrome/CDP helper를 재사용한다.
   - HTTP 서버 없이 `file://${deckRoot}/deck.html`로 navigate한다.
   - 기준: frame count 83, deck error 0, browser console error 0, active slide source 확인, note exposure 0
   - HTTP audit와 분리된 PASS/FAIL 이름을 사용한다. 예: `PASS file URL deck load - 83 frames loaded from slide-html cache`

3. runtime diagnostics는 작게 추가
   - `loadSlide()`에서 fetch success/cache direct/cache fallback/error 카운트를 누적한다.
   - audit는 HTTP 렌더에서 fallback count가 0인지, file URL 렌더에서 cache direct count가 slide count와 같은지 확인한다.
   - 이 변경은 사용자 화면에는 보이지 않아야 한다.

4. exporter manifest 확장
   - export 시 cache fragment hash를 계산해 contract/source map에 저장한다.
   - validator는 원본 HTML hash와 cache fragment hash를 모두 확인한다.
   - inventory의 Slide Index에는 현재처럼 원본 `contentHash`만 두고, runtime artifact summary는 별도 섹션으로 둔다.

### 검증 명령

현재 읽기 전용으로 실행한 명령:

```sh
node scripts/export-lecture-cuts-contract.js --check-confidence
node scripts/validate-lecture-cuts-contract.js
```

권장 구현 후 통합 검증:

```sh
node scripts/export-lecture-cuts-contract.js --check-confidence
node scripts/validate-lecture-cuts-contract.js
node scripts/audit-lecture-cuts.js
node scripts/audit-lecture-cuts-korean-copy.js
node scripts/audit-lecture-cuts-speaker-sync.js
node scripts/verify-lecture-cuts-harness.js
```

권장 신규 smoke 기준:

```sh
node scripts/audit-lecture-cuts.js --file-url-smoke
```

또는 file URL smoke를 기본 audit에 포함한다면 별도 flag 없이 다음 명령 하나로 통과해야 한다.

```sh
node scripts/audit-lecture-cuts.js
```

### 미해결

- file URL smoke를 `audit-lecture-cuts.js` 기본 경로에 넣을지, `verify-lecture-cuts-harness.js`에서 별도 runtime artifact check로 부를지 결정이 필요하다. 권장은 audit 기본 경로다. 이유는 runtime 렌더 검증이 이미 audit의 책임이고, verify는 audit를 묶는 상위 gate로 유지하는 편이 단순하다.
- `slide-spec.json`에 cache manifest를 직접 넣을지, source map에만 넣을지 결정이 필요하다. 권장은 `slide-spec.json`에는 runtime artifact file/hash 요약, source map에는 slide별 fragment hash 상세를 두는 방식이다.
- HTTP fetch 실패 시 cache fallback을 계속 조용히 허용할지, audit 환경에서는 fallback 사용을 WARN/FAIL로 올릴지 정책이 필요하다. 권장은 HTTP audit에서는 fallback count를 FAIL로 처리하고, 실제 사용자 런타임에서는 fallback을 유지하는 방식이다.
- 현재 `slide-html.js`는 생성 파일이므로 merge conflict가 생기기 쉽다. 장기적으로는 committed artifact로 유지할지, release/export 단계에서만 생성할지 결정이 필요하다. `file://` 발표를 즉시 지원하려면 committed artifact 유지가 현실적이다.
