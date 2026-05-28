# Topic Intake

## Topic

김아이 Act 0 도입부 프로토타입

## Audience

AI 도구를 업무에 쓰고 싶지만 개발 배경이나 에이전트 시스템 지식이 없는 일반인 수강생.

## Timebox

전체 강의는 실습 포함 4시간. 이 프로토타입 슬라이드는 Act 0의 전체 지도 파트 3분 분량.

## Desired Output

기존 deck-harness로 생성되는 HTML/CSS 예제 덱. 발표자는 슬라이드만 보고 진행 흐름을 알 수 있어야 한다.

## Must Cover

- 김아이 신입 AI 비유.
- 4시간 동안 만들 업무 환경의 여섯 단계.
- 설명만 듣는 강의가 아니라 직접 해보고 점수와 결과를 확인하는 강의라는 기대값.
- 어려운 용어는 glossary tooltip으로 설명.

## Must Avoid

- 즉흥 HTML 손작성.
- 그라데이션, glass, glow, 복잡한 카드 그리드.
- 개발자만 이해할 수 있는 도구명 나열.
- 발표 스크립트를 슬라이드에 길게 노출.

## Prior Materials

- `디자인.md`
- `docs/harness/lecture-cuts-redesign-master-spec.md`
- `docs/harness/lecture-cuts-slide-structure-v2.md`
- `lecture-cuts/assets/handdrawn/12-workflow.png`

## Source Preferences

Official sources first.

## Visual Style Preference

`디자인.md`의 hand-drawn minimal 시스템을 사용한다. 개념 슬라이드는 생성 이미지 또는 기존 손그림 자산을 우선한다.

## Success Criteria

- Generated deck passes `node deck-harness/scripts/verify-deck-quality.js generated-decks/kimai-act0-prototype`.
- Slide fits 1280x720 projector frame.
- Presenter cues and bridge are visible without exposing full speakerNote.
- Glossary terms resolve through custom tooltip behavior.
