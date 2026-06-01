# Kimai Content 문서 관리 규칙

## 문서 역할

- `act0-content-source.md`와 `act1-content-source.md`부터 `act6-content-source.md`는 Act별 강의 내용의 정식 주입 소스다. 슬라이드 메시지, 발표 흐름, 용어 연결, 시각 자산 요구사항, 다음 실습 브릿지는 해당 Act의 content source에 기록한다.
- `act1-6-content-summary.md`는 Act 1~6을 빠르게 검토하기 위한 요약본이다. 새로운 정식 결정을 이 파일에만 남기지 않는다. 요약을 고칠 때는 대응하는 `act*-content-source.md`도 함께 확인하고 필요한 내용을 반영한다.
- `practice-plan.md`는 Act별 실습 흐름의 기준 문서다. 실습 목표, 수행 안내, 직접 조작, 피드백, 재시도, 다음 Act 연결, unlock artifact 기준은 이 문서와 `practice-harness/practices/*.json`이 서로 맞아야 한다.
- `content-redesign-working-plan.md`는 콘텐츠 재설계의 전략, 범위, 리스크, 작업 경계를 기록하는 문서다. 슬라이드 단위 문구나 Act별 세부 설명은 이 문서에 길게 넣지 말고 해당 Act content source로 옮긴다.
- `legacy-slide-to-act-map.md`는 기존 `lecture-cuts` 자료를 새 김아이 Act 구조로 연결하는 매핑 문서다. 원본 자료의 책임 Act가 바뀌면 이 파일을 먼저 갱신한다.
- `asset-generation-workflow.md`는 김아이 콘텐츠의 이미지 생성과 분할 workflow 계약 문서다. 이미지 파일만 바꾸지 말고 자산 요구사항, 생성 방식, 검토 기준을 함께 관리한다.

## 수정 우선순위

- Act별 강의 메시지를 바꿀 때는 먼저 해당 `act*-content-source.md`를 수정한다.
- 전체 흐름 요약이 필요하면 `act1-6-content-summary.md`를 갱신하되, 요약본이 원천 문서를 대신하지 않게 한다.
- 실습 화면이나 채점 흐름을 바꿀 때는 `practice-plan.md`와 `practice-harness/practices/*.json`의 계약을 함께 확인한다.
- 전략, 산출물 경계, 현재 리스크가 바뀔 때만 `content-redesign-working-plan.md`를 수정한다.
- 기존 덱 자료를 새 Act에 재배치할 때는 `legacy-slide-to-act-map.md`를 갱신한 뒤 Act content source에 반영한다.

## Kimai Lecture Source Scope

- 김아이 워크숍의 목표 산출물은 일반인 대상 4시간 워크숍의 강의 슬라이드 소스다. 4시간에는 설명 강의와 Act별 실습 시간이 모두 포함된다.
- 김아이 콘텐츠 재설계의 주 작업은 `act*-content-source.md`, `section-plan.json`, `slide-spec.json`, `asset-pack.json`, `glossary.json`, Act 매핑 문서 같은 주입 소스다.
- HTML은 최종 덱이 아니라 흐름, 화면 밀도, 이미지 위치, 발표 리듬을 사람이 검토하기 위한 목업이다.
- 추측으로 새 흐름을 만들지 말고, 이미 작성된 마스터 스펙, Act별 content source, practice plan, slide spec, asset pack을 먼저 확인한 뒤 이어서 작성한다.
- 설명 슬라이드는 Act별 개념, 김아이 서사, 회사 업무 비유, 다음 실습으로 넘어가는 브릿지만 다룬다.
- 실습은 설명 슬라이드가 끝난 뒤 별도의 실습 슬라이드 또는 실습 UI에서 진행한다.
- 설명 소스 안에 실습 UI, 점수판, 입력 폼, 검증 로그를 섞지 않는다. 그런 요소는 실습 소스에서 정의한다.

## Kimai Act Topic Map

- Act 0. 오늘의 약속: 김아이라는 AI 신입사원 서사와 하네스 엔지니어링 관점 소개
- Act 1. 정보 선별 `(Information Selection / Context Curation)`: 업무에 필요한 자료와 기준을 먼저 고르는 법
- Act 2. 좋은 업무 지시 `(Prompt Engineering / Task Specification)`: 무엇을 만들지, 어디에 쓸지, 어떤 형식으로 낼지, 언제 끝난 것으로 볼지를 지시로 쓰는 법
- Act 3. CLAUDE.md 회사 내규 `(CLAUDE.md / Persistent Instructions / Rule Overload)`: Prompt, Context, CLAUDE.md를 구분하고, CLAUDE.md 적용 범위/적용 강도/과한 내규 문제를 이해시키는 법
- Act 4. 반복 업무 매뉴얼 `(Skills / Reusable Procedures)`: 반복 가능한 절차를 매뉴얼로 고정하는 법
- Act 5. 역할 분리와 도구 권한 `(Agents / Subagents / Tool Permissions / MCP)`: 역할, 권한, 도구 사용 범위를 나누는 법
- Act 6. 검증과 하네스 구조 `(Hooks / Evaluation / LLM Judge / Quality Gate)`: 결과물을 검사하고 재시도하게 만드는 구조

## Kimai Metaphor Dictionary

- `김아이`는 AI 신입사원이고, `팀장`은 사용자를 뜻한다.
- `책상` 또는 `데스크`는 김아이가 지금 일을 하기 위해 올려 둔 작업 자료 공간이며, 실제 하네스 용어로는 `Context`다.
- `업무 지시`는 팀장이 지금 내린 요청이며, 실제 하네스 용어로는 `Prompt`다.
- `회사 내규`는 김아이가 매번 지켜야 하는 공통 기준이며, 실제 하네스 용어로는 `CLAUDE.md`다.
- `업무 매뉴얼`은 반복 업무를 처리하는 순서이며, 실제 하네스 용어로는 `Skill`이다.
- `역할 카드`는 김아이 팀 안에서 나눈 책임이며, 실제 하네스 용어로는 `Agent` 또는 `Subagent`다.
- `도구 열쇠`는 역할별로 허용된 도구 권한이며, 실제 하네스 용어로는 `Tool Permission` 또는 `MCP Tool`이다.
- `검문소`는 완료 전 증거를 확인하는 기준이며, 실제 하네스 용어로는 `Hook`, `Evaluation`, `Quality Gate`다.
- Act 2에서는 `누가 볼지`나 `대상`보다 `어디에 쓸지`, `무엇을 만들지`, `어떤 형식으로 낼지`, `언제 끝난 것으로 볼지`를 우선 표현한다.
- Act 3에서 Context는 Act 1의 데스크 비유를 회수하는 보조 개념이다. Act 3의 중심은 `CLAUDE.md 회사 내규` 설정이다.
- Act 3의 CLAUDE.md 범위 비유는 `global = 연방법`, `user = 주법`, `project = 회사 사규`, `subfolder = 부서 규칙`으로 통일한다.
- CLAUDE.md 로드 순서는 `global -> user -> project -> subfolder`이고, 적용 강도는 `subfolder -> project -> user -> global`이다. 현재 작업 위치에 가까운 규칙이 더 구체적이고 강하다.
- Act 3 실습은 자료/규칙 분류가 아니라 `CLAUDE.md 적용 범위 선택 -> 내규 초안 작성 -> 과한 내규 줄이기`로 연결한다.

## 중복 문서 금지

- `*-mockup.md`, `*-flow-summary.md`, `*-review-summary.md` 같은 임시 요약 파일을 새로 만들지 않는다.
- HTML 목업을 검토하다가 Markdown 요약이 필요하면 기존 요약 문서를 갱신하거나, 정식 역할과 수명 주기가 분명한 파일명으로 승격한다.
- 파일명과 실제 범위가 어긋나는 문서는 남기지 않는다. 예를 들어 Act 0~6 전체 내용을 담는 문서를 `act0-act1-*` 이름으로 저장하지 않는다.
- 생성 산출물이나 검토용 파생 문서를 정식 소스로 오해하지 않게, 새 문서가 필요하면 상단에 목적, 원천 문서, 수정 시점, 폐기 조건을 짧게 적는다.

## 권장 메타 블록

새 문서를 정식으로 추가해야 할 때는 문서 상단에 다음 항목을 한국어로 짧게 남긴다.

```md
목적:
원천 문서:
수정해야 할 때:
수정하면 안 되는 경우:
관련 산출물:
```

## 커밋 전 확인

- 새 요약 문서가 기존 `act*-content-source.md`, `act1-6-content-summary.md`, `practice-plan.md`와 중복되지 않는지 확인한다.
- 요약본에만 남은 새로운 결정이 없는지 확인한다.
- 실습 관련 변경은 `practice-plan.md`와 practice JSON이 서로 다른 말을 하지 않는지 확인한다.
- 이미지 관련 변경은 자산 요구사항과 검토 기준까지 함께 갱신됐는지 확인한다.
