# Kimai Content Redesign Working Plan

Generated: 2026-05-28

## Decision

`lecture-cuts` 기존 덱은 최종 4시간 강의 덱이 아니라 원자료 창고로 사용한다. 새 강의는 `AI 신입사원 김아이` 서사와 반복 실습 루프로 다시 설계한다.

핵심 산출물은 HTML이 아니라 다음 spec 묶음이다.

- `generated-decks/kimai-workshop-content/section-plan.json`
- `generated-decks/kimai-workshop-content/slide-spec.json`
- `generated-decks/kimai-workshop-content/asset-pack.json`
- `generated-decks/kimai-workshop-content/glossary.json`
- `docs/harness/kimai-content/legacy-slide-to-act-map.md`

## Operating Boundary

하네스 엔지니어링 개선과 콘텐츠 재설계는 분리한다.

- 하네스 브랜치: schema, builder, validator, visual asset review, deck generation rules
- 콘텐츠 브랜치: Act 구조, 메시지, 실습 루프, 슬라이드 spec, 용어집, 자산 요구사항

콘텐츠 브랜치는 하네스 내부 구현을 고치지 않는다. schema가 막히면 우선 콘텐츠 계약 문서에 필요 필드를 적고, 하네스 브랜치에 반영할 변경 요청으로 남긴다.

## Lecture Shape

전체 강의는 4시간 기준으로 잡되, 최종 장수에는 사전 상한을 두지 않는다. 설명 장표보다 실습 화면을 중심에 두고, 이해를 돕는 짧은 전환 슬라이드는 필요한 만큼 사용한다.

| Block | Minutes | Slide Target | Main Output |
|---|---:|---:|---|
| Act 0. 오늘의 약속 | 12 | 7 | 강의 기대값, 김아이 세계관, Act 1 전환 |
| Act 1. 정보 선별 | 28 | 9 | 제품 리뷰자료 보고서 중심의 필수/불필요 정보 선택 기록 |
| Act 2. 좋은 업무 지시 | 42 | 9 | 3회 시도한 prompt와 best version |
| Act 3. CLAUDE.md 회사 내규 | 38 | 10 | 작업 자료/CLAUDE.md 내규 분리, 내규 과다 제거, CLAUDE.md 내규 초안 |
| Break | 10 | 0 | 휴식 |
| Act 4. 반복 업무 매뉴얼 | 35 | 8 | mini-brainstorming Skill 초안과 점수 |
| Act 5. 역할 분리와 도구 권한 | 35 | 8 | local team role/tool assignment log |
| Act 6. 검증과 하네스 구조 | 32 | 8 | Stop hook 검문소 설계, unlock prompt |
| Wrap-up | 8 | 2 | 개인 하네스 3개 선택, 다음 행동 |

## Repeated Practice Loop

각 Act는 같은 루프로 닫는다.

```text
입력 -> 산출물 생성 -> 검증 -> 피드백 -> 재시도 -> 비교 -> 베스트 저장
```

Act별 반복 대상은 다르게 둔다.

| Act | Learner Edits | Generated Output | Verification Focus |
|---|---|---|---|
| 1 | 정보 선택 | 김아이 추측 빈칸 리포트 | 빠진 필수 정보, 과한 정보 |
| 2 | 지시문 | 보고서 초안 미리보기 | 목표, 제약, 완료 기준, 자료 |
| 3 | CLAUDE.md 설정 | CLAUDE.md 적용 범위와 내규 초안 | 적용 범위 선택, 반복 내규 유지, 과한 내규 제거, 충돌 회피 |
| 4 | Skill 문서 | Skill review report | 호출 조건, 질문 절차, 승인 게이트 |
| 5 | role/tool 배정 | local execution log | 역할 분리, 권한 최소화 |
| 6 | 검문소 체크리스트 | hook prompt/example | 통과 조건, 증거, 무한 반복 방지 |

## Slide Design Contract

모든 슬라이드는 `lecture-cuts-slide-structure-v2.md`를 따른다.

- 헤드라인은 한 문장 결론이다.
- 본문 앵커 3개는 기본값이다. 필요한 설명이 빠질 때는 앵커를 추가하고, 가독성이 떨어질 때는 슬라이드를 나눈다.
- 전문 용어는 회사 업무 비유를 먼저 보여 준 뒤 보조 라벨로 연결한다.
- 브릿지는 문제에서 해결책, 개념에서 실습, Act 전환에만 둔다.
- 발표자 내비게이션은 화면 구조에 들어가야 하며, 긴 대본은 `speakerNote`로만 둔다.

## Content Pass Order

1. Act별 section plan 확정: 시간, 목표, 실습 output, bridge
2. 기존 slide inventory를 Act별 source bucket으로 매핑
3. glossary 확정: 회사 업무 비유, 실제 용어, 실습 화면 의미
4. asset-pack 확정: 김아이 teaching artifact와 semantic requirements
5. slide-spec 1차 작성: 각 Act opener, concept, practice, result, bridge
6. 하네스 branch와 schema gap 비교
7. build/quality gate 실행은 하네스 변경이 안정된 뒤 진행

## Current Risks

- 기존 자료 수가 문서마다 다르게 보인다. 현재 `lecture-cuts-content-inventory.md`는 58장을 보고하고, NotebookLM rewrite 파일은 87장까지 있다. 콘텐츠 매핑 문서에서는 `lecture-cuts/slide-spec.json`의 58장을 기준 source inventory로 삼고, 87개 rewrite는 보조 copy/source 자료로만 본다.
- Act 5는 유일한 로컬 실행형 실습이다. 일반인 대상 강의에서 설치/환경 이슈가 길어질 수 있으므로, 실패 시 사용할 관찰 모드 로그 예제를 같이 준비한다.
- Act 6는 hook 구현 세부가 과해질 수 있다. 화면에서는 체크리스트와 검문소 설계가 주인공이고, JSON/script는 unlock 예제로만 둔다.
