# Practice Harness Instructions

## Scope

- 이 지침은 `practice-harness/`와 그 하위 파일에 적용한다.
- 루트 `AGENTS.md`의 공통 context research와 verification orchestrator 규칙을 함께 따른다.

## Learner UI Verification Rules

- `practice-harness/` 실습 페이지는 채점 가능한 백엔드만으로 완료로 보지 않는다. 각 Act는 원래 강의 실습계획의 `목표 -> 수행 안내 -> 직접 조작 -> 피드백 -> 재시도/다음 Act 연결` 흐름을 화면에서 확인할 수 있어야 한다.
- 실습 보강 작업마다 `practice-harness/agents/critical-practice-harness-verifier-agent.md`를 독립 reviewer로 사용한다. 이 reviewer는 구현자가 아니며, 현재 디스크, 테스트 출력, 브라우저 증거, 강의 실습계획만 근거로 PASS/WARN/FAIL을 낸다.
- 검증관은 냉정하고 비판적으로 판단하되 말투가 목적이 아니다. 다음을 못 보면 FAIL 또는 WARN이다: 학습 목표, 일반인용 힌트, 입력 예시 또는 템플릿, 빠진 항목 설명, 재시도 루프, unlock artifact, Act 간 연결 문장, 모바일/데스크톱 브라우저 증거.
- 실습 UI의 점수 표기는 항상 수강생 기준 100점 체계로 보인다. 내부 문항 배점이 36점, 85점처럼 다르더라도 화면에는 `N점`과 통과 기준 `N점`으로 정규화해 보여 준다.
- 제출 결과는 인라인 영역이나 우측 고정 패널이 아니라 팝업 모달 `role="dialog"`로 보여 준다. 제출 중에도 같은 위치의 로딩 모달을 보여 수강생이 진행 상태를 알 수 있어야 한다.
- 결과 모달은 점수, 다음 행동, 빠진 항목, 좋았던 점, 재시도 안내, 검증 로그, 필요한 경우 AI 보조 검토와 unlock artifact를 포함해야 한다.
- 실습들은 강의 뒤에 개별로 나가는 화면이므로 결과 모달에서 다음 Act/다음 실습으로 넘기는 CTA를 제공하지 않는다. Act 1처럼 한 실습 안에 여러 문제가 있을 때만 결과 모달에서 다음 문제로 넘어갈 수 있다.
- Act 1처럼 문항 내부 피드백이 있는 실습도 실패 후 서버 제출 결과 모달을 열 수 있어야 한다. 문항을 모두 맞혀야만 최종 결과를 볼 수 있게 만들지 않는다.
- 실습 화면은 상단 안내나 목록이 문제 풀이 공간을 계속 차지하지 않게 설계한다. `오늘 할 일`은 시작 전에만 보이고, 문제 시작 후에는 실제 입력/선택/제출 영역이 화면의 주 공간을 사용해야 한다.
- 데스크톱 화면에서는 실습 목록을 좌측 레일 또는 동등하게 압축된 내비게이션으로 배치해 빈 공간을 줄이고, 모바일에서는 가로 스크롤 목록으로 접어 실제 문제 영역을 우선한다.
- 일반인 학습자가 모를 수 있는 실습 용어, 영문 약어, 개발/AI 도구 용어는 메인 lecture-cuts와 같은 custom glossary tooltip 방식으로 보조 설명을 제공한다. native browser `title` 속성을 쓰지 않고 `data-glossary`, `.glossary-term`, `.glossary-popover`, `role="tooltip"` 계약을 유지한다.
- React 실습 UI 변경 후에는 stale bundle을 피하기 위해 `npm run build:practice-ui` 또는 `npm test`의 pretest 빌드를 거친 뒤 브라우저 기반 QA를 확인한다.
- 실습 UI 회귀 검증은 최소 `npm run qa:practice`로 확인한다. 이 검증에는 단위 테스트, 입력 매트릭스, UI flow, 데스크톱/모바일 브라우저 스크린샷 검증이 포함되어야 한다.
- Act 2는 제품 리뷰자료 보고서 요청을 김아이에게 제대로 업무 지시하는 실습이어야 한다. 화면에는 무엇을 만들지, 어디에 쓸지, 어떤 자료를 참고할지, 어떤 형식으로 낼지, 언제 끝난 것으로 볼지, Before 예시, 재시도/점수 변화 안내가 보여야 한다.
- Act 3는 `CLAUDE.md`를 김아이의 회사 내규로 설명하고, 적용 범위 선택, 내규 초안 작성, 과한 내규와 충돌 내규 제거가 화면에서 확인되어야 한다. Context/데스크 설명은 Act 1의 중심 개념이며, Act 3에서는 Prompt, Context, CLAUDE.md를 구분하는 보조 설명으로만 사용한다.
- Act 5는 learner UI에서 웹 채점형 실습이 아니라 로컬 실행형 presentation-only 실습이다. 수강생 화면에는 하나의 복사 가능한 에이전트팀 실행 프롬프트와 로컬 테스트 순서가 보여야 하며, 점수 기준, 제출 버튼, 실행 기록 textarea, 역할별 카드 분산, 별도 Tool 권한 블록을 다시 노출하지 않는다.
- Act 6은 단순 점수 화면으로 끝나면 안 된다. 100점 달성 후 Stop hook 생성 프롬프트와 예제 구조가 명확히 unlock artifact로 드러나야 한다.
