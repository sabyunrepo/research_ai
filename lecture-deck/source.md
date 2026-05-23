# Source Brief

## Topic

HTML/CSS Deck Automation Harness v1

## Audience

- Claude, Codex, MCP, subagent를 업무에 쓰기 시작한 실무자
- 발표자료를 한 번 만들고 끝내는 대신, 다음 발표자료도 같은 품질로 반복 생성하고 싶은 팀

## Timebox

- 20 minute live demo
- 10 minute exercise

## Goal

Claude에게 자료를 주면 `source brief -> slide spec -> HTML/CSS deck -> presenter review -> verification -> handoff`까지 반복 가능한 워크플로우로 만든다.

## Required Output

- `deck.html`: 발표용 HTML/CSS 덱
- `presenter-review.html`: 발표자 검토용 화면
- `slide-spec.json`: 슬라이드별 의도와 근거
- `HANDOFF.md`: 다음 세션이 이어받을 상태 파일
- `scripts/verify-deck.js`: 파일 누락, 링크, note 노출, 발표자 스크립트, desktop/mobile overflow 검증

## Constraints

- PPTX로 내보내지 않는다. CSS, 좌우 이동, 브라우저 검증을 유지하기 위해 HTML을 최종 산출물로 둔다.
- 발표용 덱에서는 `.note`를 보이지 않게 한다.
- 발표자 검토용에서는 `speakerNote`와 evidence를 반드시 표시한다.
- 반복 이미지는 이미지 파일보다 CSS visual을 우선한다.
- 최종 보고에는 실행 명령, 결과, 남은 위험, 확인 URL을 남긴다.

## References

- `few-shots.md`: 좋은 출력과 나쁜 출력의 기준
- `CLAUDE.md`: 프로젝트 규칙
- `skills/deck-builder/SKILL.md`: 자동화 절차
- `agents/*.md`: 역할별 검토 기준
