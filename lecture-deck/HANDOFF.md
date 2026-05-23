# HANDOFF

## Goal

HTML/CSS Deck Automation Harness v1을 데모 가능한 상태로 유지한다.

## Current State

- `source.md`에 강의 목적과 제약을 정리했다.
- `slide-spec.json`에 2장짜리 샘플 덱 계약을 정의했다.
- `deck.html`은 좌우 버튼, 키보드 화살표, hash 기반 이동을 지원한다.
- `presenter-review.html`은 발표자 스크립트와 evidence를 표시한다.
- `scripts/verify-deck.js`는 정적 파일 검사와 Chrome 기반 렌더링 검사를 수행한다.
- `scripts/run-hook.js`는 `hooks/*.json`을 읽어 `manual` 또는 `pre-handoff` 이벤트에 맞는 검증을 실행한다.
- Claude Code 로컬 훅은 `.claude/settings.local.json`, Codex 프로젝트 훅은 `.codex/hooks.json`에서 같은 `pre-handoff` runner를 호출한다.

## Decisions

- 최종 산출물은 PPTX가 아니라 HTML/CSS deck이다.
- Few-shot은 실습 3으로 두고 `slide-spec.json` 바로 다음에 배치한다.
- 발표용 화면에서는 `.note`를 제거하고, 발표자 검토 화면에서만 script를 보여준다.
- 반복 시각 요소는 CSS visual을 우선한다.

## Verification

Run:

```sh
node scripts/run-hook.js pre-handoff
```

Expected:

```text
PASS slide count
PASS missing files
PASS broken links
PASS deck note exposure
PASS presenter script
PASS desktop overflow
PASS mobile overflow
```

## Remaining Risks

- Chrome이 없는 환경에서는 렌더링 검사를 실행할 수 없다.
- 실제 강의 자료로 확장할 때는 `slide-spec.json`과 `assets/slides.js`의 순서를 함께 갱신해야 한다.
- Claude Code의 `.claude/settings.local.json`은 로컬 파일이라 git에 커밋하지 않는다. 공유용 예시는 `.claude/settings.local.example.json`에 둔다.

## Next Prompt

```text
HANDOFF.md부터 읽고 현재 deck 상태를 확인해줘. source.md와 slide-spec.json을 기준으로 슬라이드를 확장하고, 완료 전에 node scripts/run-hook.js pre-handoff를 실행한 뒤 evaluation-template.md 형식으로 보고해줘.
```
