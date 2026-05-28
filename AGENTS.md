# Project Instructions

## Instruction Ownership

- 전역/사용자 레벨 AGENTS.md는 비워 두고, 이 프로젝트의 지침은 이 파일에서 관리한다.
- 연구 자료, 강의 덱, lecture-cuts 규칙은 전역 파일이 아니라 이 파일 또는 하위 AGENTS.md에 추가한다.

## Lecture Cuts Presentation Rules

- lecture-cuts 슬라이드는 일반인 대상 4시간 강의를 위한 발표 자료다. 개발자나 AI 에이전트 경험자를 전제로 만들지 않는다.
- lecture-cuts 개선은 새 HTML을 즉흥으로 손작성하는 방식이 아니라, 기존 `디자인.md`, `lecture-cuts/skills/*`, `deck-harness/skills/*`, 하네스 검증 스크립트를 개조하고 재사용하는 방식으로 진행한다.
- 생성 결과에서 발견한 시각/내용 문제는 최종 HTML이나 생성된 deck 파일만 직접 손보는 방식으로 처리하지 않는다. 같은 문제가 다시 나오지 않도록 `slide-spec`, `asset-pack`, 템플릿, 검증 스크립트, 스킬 문서 중 원인 레이어를 고쳐 하네스 엔지니어링으로 재생성한다.
- 예제 deck의 생성 산출물 수정이 필요한 경우에도 먼저 하네스 규칙 또는 입력 계약을 보강하고, `build-deck-from-spec`와 `verify-deck-quality`를 다시 실행해 산출물이 규칙을 통과하게 한다.
- 사용자가 서브에이전트 위임을 명시하면 메인 에이전트는 계획, 위임, 리뷰, 검증 오케스트레이션을 맡고 실제 구현 단위는 worker/reviewer subagent에 맡긴다. 단, 최종 통합 검증과 사용자 보고는 메인 에이전트가 책임진다.
- 이미지 자산 품질은 `asset-pack.semanticRequirements`와 `asset-review.json`으로 관리한다. 시각 의미가 맞지 않는 문제는 이미지 파일만 교체하지 말고 자산 계약, 리뷰 결과, 검증 게이트를 함께 갱신한다.
- `디자인.md`의 hand-drawn minimal 방향을 기본 시각 시스템으로 유지한다. 제목은 손글씨 느낌, 본문은 읽기 쉬운 sans-serif, 기본 흑백 + 포인트 1색, 최대 2색을 우선한다.
- `디자인.md`가 금지한 그라데이션, 광택, 과한 그림자, glass/blur/glow, 복잡한 도형 장식은 사용하지 않는다.
- `디자인.md`의 적용 규칙에 따라, 본편 컷은 생성 이미지 기반 손그림 일러스트를 우선 사용한다. HTML/CSS 도형, 그래프, SVG 다이어그램은 실습 UI나 검증 로그처럼 실제 상호작용을 설명해야 할 때만 제한적으로 사용한다.
- 슬라이드 제작은 먼저 `slide-spec` 수준에서 메시지, 시각 의도, speaker note, glossary, evidence를 정의한 뒤 HTML/CSS로 내려간다. 연구 노트나 대화 아이디어에서 바로 slide HTML을 만들지 않는다.
- 이미지 자산은 먼저 `asset-pack.json`에 정의한다. 각 자산은 `id`, 설명 가능한 teaching role, 생성 프롬프트, 스타일 제약, 설명 앵커, source path 또는 crop metadata를 가져야 한다. 슬라이드는 이미지 파일 경로를 직접 반복하지 않고 `visualAssetId`로 참조한다.
- 섹션 단위로 여러 이미지를 한 번에 생성하거나 하나의 이미지 시트에서 잘라 쓸 경우, 원본 시트와 crop region 정보를 `asset-pack.json`에 남긴다. 하네스 빌드 단계에서는 crop view가 아니라 실제 분할 이미지 파일을 `assets/visuals/` 아래에 생성해 슬라이드가 최종 파일을 참조하게 한다.
- 지시문, 슬라이드에 보여줄 문구, 발표자 내비게이션, 이미지 생성 요구사항은 XML 스타일 블록으로 분리한다. `xmlPrompt.instruction`, `xmlPrompt.screenContent`, `xmlPrompt.speakerNavigation`, `xmlPrompt.assetRequirement`를 섞지 않는다.
- projector slide에는 `screenContent`에 해당하는 내용만 보이게 하고, instruction/source/raw prompt는 presenter review 또는 spec에만 남긴다.
- `lecture-cuts/` 본편을 수정할 때는 `lecture-cuts/skills/deck-builder/SKILL.md` 절차와 `lecture-cuts/AGENTS.md` 검증 규칙을 따른다.
- 새 generated deck 또는 실습용 deck을 만들 때는 `deck-harness/skills/slide-spec-builder`, `html-css-deck-builder`, `deck-quality-gate`, `handoff-maintainer` 흐름을 따른다.
- 슬라이드는 발표 스크립트의 보조물이 아니라 발표 진행의 1차 기준이다. 발표자가 별도 스크립트를 보지 않아도 슬라이드의 내용, CSS 구성, 시각 자료만 보고 다음에 무슨 말을 해야 하는지 알 수 있어야 한다.
- 각 슬라이드는 `헤드라인 메시지 -> 시각적 앵커 -> 예시/자료 -> 다음 장 브릿지` 구조를 우선한다. 앵커 3개는 기본값이며, 필요한 설명이 빠질 때는 앵커를 추가하고 가독성이 떨어질 때는 슬라이드를 나눈다.
- 한 슬라이드에는 하나의 핵심 설명만 담는다. 여러 개념을 한 장에 압축하지 말고, 10초 또는 30초만 사용하는 짧은 전환 슬라이드라도 별도 슬라이드로 분리해 발표자가 설명하기 쉬운 흐름을 만든다.
- 슬라이드 수가 늘어나는 것을 품질 저하로 보지 않는다. 발표 템포와 이해도를 위해 `one idea per slide`와 Takahashi method식 `큰 글자/짧은 문구/단일 메시지` 슬라이드를 허용한다.
- 헤드라인은 `개요`, `배경`, `실습` 같은 단어 제목이 아니라, 그 장에서 말해야 하는 핵심 결론을 완결된 문장으로 쓴다.
- 슬라이드 안에는 긴 대본을 넣지 않는다. 대신 말할 순서, 강조 문장, 예시, 전환 질문이 화면 구조에 드러나야 한다.
- 청중에게 보이는 글자는 멀리서도 읽을 수 있어야 한다. 강의장 기준 가독성을 우선하고, 작은 주석이나 빽빽한 문단으로 발표자 힌트를 숨기지 않는다.
- 어려운 용어와 전문 용어는 처음 등장할 때 회사 업무 비유로 먼저 설명하고, 실제 용어는 보조 라벨로 연결한다.
- 웹 기반 슬라이드나 실습 화면에서는 일반인이 알기 어려운 용어에 툴팁을 제공한다. 툴팁은 용어 정의, 쉬운 비유, 현재 실습에서의 의미를 짧게 보여 준다.
- 청강자가 직접 마우스와 키보드로 상호작용할 수 있는 실습을 우선한다. 실습은 보기만 하는 데모가 아니라 입력, 선택, 실행, 재시도, 결과 확인이 가능해야 한다.
- 실습 화면은 점수, 빠진 항목, 개선 예시, 결과 미리보기, 검증 로그를 가능한 한 눈으로 확인할 수 있게 구성한다.
- CSS와 시각 자료는 학습 흐름을 돕는 용도로 사용한다. 애니메이션은 시선을 끌고 상태 변화를 이해시키는 데 쓰되, 내용 이해를 방해할 정도로 과하게 쓰지 않는다.
- 슬라이드와 실습 자료는 `일반인도 따라갈 수 있는 쉬운 비유`, `멀리서도 읽히는 큰 글자`, `직접 조작 가능한 상호작용`, `발표자가 길을 잃지 않는 내비게이션`을 동시에 만족해야 한다.

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

## Practice Harness Verification Rules

- `practice-harness/` 실습 페이지는 채점 가능한 백엔드만으로 완료로 보지 않는다. 각 Act는 원래 강의 실습계획의 `목표 -> 수행 안내 -> 직접 조작 -> 피드백 -> 재시도/다음 Act 연결` 흐름을 화면에서 확인할 수 있어야 한다.
- 실습 보강 작업마다 `practice-harness/agents/critical-practice-harness-verifier-agent.md`를 독립 reviewer로 사용한다. 이 reviewer는 구현자가 아니며, 현재 디스크, 테스트 출력, 브라우저 증거, 강의 실습계획만 근거로 PASS/WARN/FAIL을 낸다.
- 검증관은 냉정하고 비판적으로 판단하되 말투가 목적이 아니다. 다음을 못 보면 FAIL 또는 WARN이다: 학습 목표, 일반인용 힌트, 입력 예시 또는 템플릿, 빠진 항목 설명, 재시도 루프, unlock artifact, Act 간 연결 문장, 모바일/데스크톱 브라우저 증거.
- Act 2는 제품 리뷰자료 보고서 요청을 김아이에게 제대로 업무 지시하는 실습이어야 한다. 화면에는 무엇을 만들지, 어디에 쓸지, 어떤 자료를 참고할지, 어떤 형식으로 낼지, 언제 끝난 것으로 볼지, Before 예시, 재시도/점수 변화 안내가 보여야 한다.
- Act 3는 `CLAUDE.md`를 김아이의 회사 내규로 설명하고, 적용 범위 선택, 내규 초안 작성, 과한 내규와 충돌 내규 제거가 화면에서 확인되어야 한다. Context/데스크 설명은 Act 1의 중심 개념이며, Act 3에서는 Prompt, Context, CLAUDE.md를 구분하는 보조 설명으로만 사용한다.
- Act 5는 웹 채점형 실습이 아니라 로컬 실행형 실습이다. 역할별 프롬프트 템플릿, Skill 배정, Tool 권한 안내, 실행 기록 템플릿이 수강생 화면에 보여야 한다.
- Act 6은 단순 점수 화면으로 끝나면 안 된다. 100점 달성 후 Stop hook 생성 프롬프트와 예제 구조가 명확히 unlock artifact로 드러나야 한다.
