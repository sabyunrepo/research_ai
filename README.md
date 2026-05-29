# Research AI Lecture Deck

이 프로젝트는 `lecture-cuts/` HTML/CSS 강의 덱을 로컬 발표용, 발표자 콘솔, 청강자용 Cloudflare 공개 화면으로 나누어 운영한다.

## 화면 구성

- `deck.html`: 발표장 스크린에 띄우는 실제 슬라이드.
- `speaker.html`: 발표자 컴퓨터에서 보는 콘솔. 현재 슬라이드, 다음 슬라이드, 발표 프롬프트, 타이머, 이전/다음 버튼을 제공한다.
- `audience.html`: 청강자용 화면. 발표자가 도달한 슬라이드까지만 청강자가 직접 이전/다음으로 복습할 수 있다.

`deck.html`과 `speaker.html`은 같은 서버 상태를 공유하므로 어느 쪽에서 넘겨도 같이 이동한다. `audience.html`은 기본적으로 live를 따라가지만, 청강자가 이전 슬라이드를 봐도 발표 상태를 제어하지 않는다.

## 로컬 실행

Node로 직접 실행:

```sh
node scripts/serve-lecture-cuts-review.js --port 8777
```

등록된 발표자료를 확인:

```sh
node scripts/serve-lecture-cuts-review.js --list-decks
```

특정 발표자료를 골라 실행:

```sh
node scripts/serve-lecture-cuts-review.js --deck lecture-cuts --port 8777
```

등록 파일은 `presentation-decks.json`이다. 새 발표자료도 기존 발표 인프라를 그대로 쓰려면 해당 디렉터리에 `deck.html`, `speaker.html`, `audience.html`, `presenter-review.html`, `assets/slides.js`, `assets/style.css`, `assets/deck.js`, `assets/speaker.js`, `assets/audience.js`를 갖춘 뒤 registry에 추가한다.

Docker로 실행:

```sh
docker compose up --build lecture-cuts
```

접속 주소:

- 발표장: `http://127.0.0.1:8777/deck.html`
- 발표자 콘솔: `http://127.0.0.1:8777/speaker.html`
- 청강자 화면: `http://127.0.0.1:8777/audience.html`

## Cloudflare Tunnel

Cloudflare에는 청강자 화면만 공개한다. Docker compose는 앱 포트를 로컬 루프백에만 노출한다.

```text
127.0.0.1:8777 -> lecture-cuts:8777
```

Cloudflare Dashboard에서 Tunnel public hostname을 만들고 service를 다음처럼 설정한다.

```text
http://lecture-cuts:8777
```

그 다음 tunnel token으로 실행한다.

```sh
cp .env.example .env
# .env의 CLOUDFLARE_TUNNEL_TOKEN 값을 Cloudflare tunnel token으로 교체
docker compose --profile tunnel up --build
```

공개 요청은 서버에서 Cloudflare 헤더를 기준으로 제한된다.

- 공개 허용: `audience.html`, `/api/audience/*`, `assets/style.css`, `assets/audience.js`, 슬라이드 이미지.
- 공개 차단: `deck.html`, `speaker.html`, `presenter-review.html`, 원본 슬라이드 HTML, `assets/slides.js`, 발표 스크립트와 큐.

청강자용 슬라이드는 원본 슬라이드 HTML과 `assets/slides.js` registry를 서버가 읽은 뒤 `.note`, script/style, event handler, presenter metadata를 제거해서 내려준다.

## 검증

기본 계약 검증:

```sh
node scripts/validate-lecture-cuts-contract.js
```

브라우저/슬라이드 감사:

```sh
node scripts/audit-lecture-cuts.js
```

전체 handoff 전 검증:

```sh
node scripts/verify-lecture-cuts-harness.js
```

Cloudflare 공개 범위 smoke:

```sh
curl -I -H 'cf-ray: smoke' http://127.0.0.1:8777/audience.html
curl -I -H 'cf-ray: smoke' http://127.0.0.1:8777/deck.html
curl -I -H 'cf-ray: smoke' http://127.0.0.1:8777/speaker.html
curl -I -H 'cf-ray: smoke' http://127.0.0.1:8777/assets/slides.js
```

기대 결과는 `audience.html`만 `200`, 나머지는 `404`다.

## 참고 문서

- Cloudflare/Docker 운영 메모: `docs/harness/lecture-cuts-cloudflare-audience.md`
- 재사용 가능한 덱 생성 하네스: `deck-harness/README.md`
