# Act 0 Content Source: 오늘의 약속

Generated: 2026-05-28
Workspace: `/Users/byeonsanghun/goinfre/research_ai-kimai-content`
Purpose: 하네스 엔지니어링 워크플로우가 나중에 `section-plan.json`, `slide-spec.json`, `asset-pack.json`, `glossary.json`으로 변환할 Act 0 원본 발표 구성 문서. 이 문서는 완성품이 아니라 주입 소스다.

## 1. Act 0 결정

Act 0에는 본격 실습이 없다.

Act 0의 역할은 수강생이 오늘 강의의 세계관과 약속을 이해하게 만드는 것이다. 수강생이 직접 입력, 선택, 채점, 재시도하는 활동은 Act 1부터 시작한다.

Act 0에서 허용되는 상호작용은 다음 한 가지뿐이다.

- 용어 보조 라벨에 마우스를 올렸을 때 열리는 짧은 tooltip

Act 0에서 금지하는 것:

- 점수화되는 실습
- 제출 버튼이 있는 활동
- 프롬프트 작성
- 컨텍스트 선택
- Skill 작성
- Hook 체크리스트 선택
- 실습 결과 저장

## 2. Act 0 핵심 메시지

```text
오늘은 프롬프트 문장을 외우는 시간이 아니라,
AI 신입사원 김아이가 흔들려도 다시 올바른 일로 돌아오게 만드는 업무 환경을 배우는 시간입니다.
```

Act 0이 끝나면 수강생은 다음 세 가지를 이해해야 한다.

1. 김아이는 뛰어난 신입사원이지만 회사 상황과 완료 기준은 저절로 모른다.
2. 오늘 만들 것은 한 문장 프롬프트가 아니라 명확한 지시, 책상 정리, 매뉴얼, 역할, 도구, 체크리스트가 연결된 업무 환경이다.
3. 실제 조작형 실습은 Act 1의 책상 정리부터 시작하며, Act 0에는 질문형 실습을 넣지 않는다.

## 3. 구성 원칙

Act 0은 `one idea per slide`를 강하게 적용한다.

- 한 슬라이드에는 하나의 핵심 문장만 둔다.
- 10초짜리 전환 슬라이드도 별도 슬라이드로 둔다.
- Takahashi method처럼 큰 글자, 짧은 문구, 단일 메시지 슬라이드를 허용한다.
- 슬라이드 수 증가는 품질 저하가 아니다. 발표 템포와 이해도를 위해 필요한 분할이다.
- 화면 글자는 청중용 메시지다. 발표자용 긴 설명은 이 문서와 speaker note에만 둔다.

근거 메모:

- One idea per slide: CMU 발표 가이드의 "Use only one idea per slide" 원칙을 따른다.
- Takahashi method: 큰 글자와 짧은 단어/문구로 빠르게 넘기는 전환 슬라이드를 허용한다.

## 4. 시간과 리듬

권장 시간: 10-12분

권장 슬라이드 수: 7장

리듬:

```text
김아이 첫 출근 -> 우수한 신입 인정 -> 모르는 회사 맥락 -> 팀장님의 첫 업무 지시 -> 하네스 엔지니어링 개념 -> 초안의 한계 -> 체크리스트와 피드백 -> 우수사원 프로젝트 지도
```

## 5. Slide List

### 0-1. 신입사원 김아이의 첫 출근날입니다

Type: Takahashi transition
Estimated time: 10초
Function: 세계관 진입

Screen headline:

```text
신입사원 김아이의 첫 출근날입니다.
```

Screen subline:

```text
안녕하세요, 팀장님!
```

Presenter flow:

```text
오늘 강의의 주인공은 김아이라고 소개한다.
수강생은 김아이를 이끄는 팀장 역할이라고 초대한다.
김아이는 사람 이름처럼 부르지만, 실제로는 우리가 업무에 쓰는 AI를 뜻한다고 말한다.
```

Visual:

```text
흰 배경, 손그림 김아이 캐릭터, 작은 신입사원 명찰.
```

Bridge:

```text
먼저 김아이가 어떤 신입사원인지 보겠습니다.
```

Harness note:

```text
slideType = "story-transition"
visualAssetId = "kimai-new-employee"
practiceId = null
```

### 0-2. 김아이는 뛰어난 신입사원입니다

Type: Takahashi transition
Estimated time: 20초
Function: AI 능력 인정

Screen headline:

```text
김아이는 뛰어난 신입사원입니다.
```

Screen anchors:

```text
아는 것이 많고
일 처리가 빠르고
말도 잘합니다
```

Presenter flow:

```text
김아이는 많은 지식을 갖고 있고, 업무 처리 속도가 빠르고, 설명도 그럴듯하게 잘한다고 말한다.
수강생이 이미 느끼는 AI의 장점을 뛰어난 신입사원 비유로 먼저 인정한다.
말을 잘하기 때문에 더 믿기 쉽다는 점을 다음 한계 슬라이드로 연결한다.
```

Visual:

```text
김아이가 첫 출근 자리에서 많은 자료를 빠르게 처리하고 자신 있게 말하는 손그림.
```

Bridge:

```text
하지만 뛰어나다고 모든 걸 아는 것은 아닙니다.
```

Harness note:

```text
practiceId = null
```

### 0-3. 똑똑하다고 모든 걸 아는 것은 아닙니다

Type: core message
Estimated time: 40초
Function: AI 한계 제시

Screen headline:

```text
똑똑하다고 모든 걸 아는 것은 아닙니다.
```

Screen anchors:

```text
뭐 하는 회사인지?
뭐 하는 부서인지?
주력 상품이 뭔지?
내가 해야 할 일은 뭔지?
```

Presenter flow:

```text
김아이는 뛰어난 신입사원이지만 우리 회사가 무엇을 하는 회사인지, 어떤 부서인지, 주력 상품이 무엇인지, 이번에 자기가 해야 할 일이 무엇인지는 자동으로 알지 못한다고 말한다.
AI가 틀렸다는 말보다, 신입사원에게 회사 맥락이 비어 있다는 방향으로 설명한다.
```

Visual:

```text
김아이 앞에 회사, 부서, 주력 상품, 할 일이라고 적힌 빈칸들이 놓여 있다.
```

Bridge:

```text
모르는 부분을 말해 주지 않으면 김아이는 빈칸을 추측합니다.
```

Harness note:

```text
visualAssetId = "kimai-company-context-blanks"
practiceId = null
```

### 0-4. 팀장님의 첫 업무 지시가 도착했습니다

Type: story slide
Estimated time: 60초
Function: 실패 원인 제시

Screen headline:

```text
팀장님의 첫 업무 지시가 도착했습니다.
```

Screen example:

```text
"제품 리뷰자료 보고서 제출하게 만들어와."
```

Screen anchors:

```text
어떤 제품인지?
어디에 쓸지?
보고서 형식은?
```

Presenter flow:

```text
팀장님의 첫 업무 지시가 도착했다고 보여 준다.
사람 신입사원이라면 어떤 제품인지, 어디에 쓸 보고서인지, 어떤 보고서 형식인지 먼저 물어봐야 한다고 설명한다.
김아이도 이 정보가 없으면 그럴듯한 보고서처럼 보이는 것을 만들 수는 있지만, 실제 제출 가능한 보고서인지는 보장할 수 없다고 말한다.
```

Visual:

```text
팀장 말풍선과 김아이 머리 위의 제품, 사용 상황, 보고서 형식 빈칸.
```

Bridge:

```text
팀장님의 역할은 이 빈칸을 김아이가 추측하지 않게 만드는 것입니다.
```

Harness note:

```text
practiceId = null
```

### 0-5. 하네스 엔지니어링은 김아이의 업무 능력을 끌어내는 일입니다

Type: concept slide
Estimated time: 60초
Function: 하네스 엔지니어링 개념 도입

Screen headline:

```text
하네스 엔지니어링은 김아이의 업무 능력을 끌어내는 일입니다.
```

Screen anchors:

```text
잘 정돈된 책상
명확한 지시
최신 업무자료
보고서 샘플
```

Presenter flow:

```text
하네스 엔지니어링을 어려운 기술 용어로 정의하지 않는다.
좋은 신입의 능력을 끌어내려면 잘 정돈된 책상, 명확한 지시, 최신 업무자료, 보고서 샘플이 필요하다고 설명한다.
AI에게도 같은 원리가 적용된다고 연결한다.
```

Visual:

```text
김아이 데스크 위에 정돈된 책상, 명확한 지시, 최신 업무자료, 보고서 샘플이 놓인 손그림.
```

Bridge:

```text
좋은 신입에게도 일할 수 있는 환경이 필요합니다.
```

Harness note:

```text
glossaryTerms = ["Harness Engineering"]
practiceId = null
```

### 0-6. 신입은 한 번에 완벽하게 일을 끝내지 못합니다

Type: problem slide
Estimated time: 45초
Function: 초안의 한계 제시

Screen headline:

```text
신입은 한 번에 완벽하게 일을 끝내지 못합니다.
```

Screen anchors:

```text
빠진 내용
잘못 이해한 기준
어색한 결과
```

Presenter flow:

```text
좋은 신입도 첫 초안에서 빠진 내용이 있고, 기준을 잘못 이해하고, 제출하기 어색한 결과를 만들 수 있다고 말한다.
이것은 실패가 아니라 일을 배워 가는 과정이라고 설명한다.
```

Visual:

```text
김아이가 첫 보고서 초안을 들고 있고, 빠진 내용, 잘못 이해한 기준, 어색한 결과 표시가 붙은 손그림.
```

Bridge:

```text
그래서 체크리스트와 선임의 피드백이 필요합니다.
```

Harness note:

```text
practiceId = null
```

### 0-7. 체크리스트와 피드백이 보고서의 퀄리티를 높입니다

Type: loop slide
Estimated time: 55초
Function: 반복 개선 구조 소개

Screen headline:

```text
체크리스트와 피드백이 보고서의 퀄리티를 높입니다.
```

Screen anchors:

```text
무엇이 잘못됐는지
무엇을 고칠지
다시 제출하기
```

Presenter flow:

```text
체크리스트로 어떤 것이 잘못되었는지 찾고, 선임에게 무엇이 문제인지 피드백을 받으며, 다시 제출하면서 보고서의 퀄리티가 올라간다고 설명한다.
이 구조가 Act 1부터 반복되는 실습 루프의 원형이라고 연결한다.
```

Visual:

```text
보고서 초안이 체크리스트, 선임 피드백, 재제출을 거쳐 더 나은 보고서가 되는 손그림.
```

Bridge:

```text
오늘의 4시간은 이 반복을 도와주는 장치들을 갖춰 주는 시간입니다.
```

Harness note:

```text
practiceId = null
```

### 0-8. 오늘은 김아이가 우수사원이 되도록 팀장님이 이끌어 주는 시간입니다

Type: map slide
Estimated time: 90초
Function: 전체 여정 제시

Screen headline:

```text
오늘은 김아이가 우수사원이 되도록 팀장님이 이끌어 주는 시간입니다.
```

Screen map:

```text
1. 책상 정리
2. 업무 지시
3. 데스크 자료
4. 반복 매뉴얼
5. 역할과 도구
6. 체크리스트
```

Presenter flow:

```text
여섯 단계를 모두 깊게 설명하지 않는다.
우수사원 프로젝트의 단계로 소개한다. 먼저 책상을 정리하고, 그다음 업무 지시를 하고, 데스크 자료를 고르고, 반복 절차를 매뉴얼로 남기고, 역할과 도구를 나누고, 마지막에 체크리스트로 확인한다고 말한다.
전문 용어는 지금 화면에 노출하지 않고, 발표자 노트와 glossary tooltip 계약에만 남긴다.
```

Visual:

```text
가로 여정 지도 또는 김아이 사무실 지도.
각 단계는 큰 한글 업무 비유만 보인다.
```

Bridge:

```text
우수사원 프로젝트의 첫 단계는 책상 정리입니다.
```

Harness note:

```text
practiceId = null
```
## 6. Act 0 Interaction Boundary

Act 0의 interaction은 학습 활동이 아니라 발표 보조 장치다.

| Interaction | Allowed | Practice? | Purpose |
|---|---:|---:|---|
| glossary tooltip | yes | no | 어려운 용어를 보조 설명한다. |
| first-question click reveal | no | no | Act 0에서는 제거한다. |
| scored quiz | no | yes | Act 1로 이동한다. |
| 지시문 input | no | yes | Act 2로 이동한다. |
| 컨텍스트 selection | no | yes | Act 3으로 이동한다. |

## 7. Asset Requirements

Act 0 이미지는 개별 생성하지 않는다. 먼저 하나의 이미지 시트를 만들고, 하네스 빌드 단계에서 실제 PNG 파일로 분할한다.

```text
원본 시트:
assets/visuals/kimai-act0-visual-sheet.png

분할 산출물:
assets/visuals/kimai-new-employee.png
assets/visuals/kimai-company-컨텍스트-blanks.png
assets/visuals/kimai-report-request-gap.png
assets/visuals/kimai-harness-desk-kit.png
assets/visuals/kimai-manual-checkpoint.png
assets/visuals/kimai-workflow-map.png
```

슬라이드는 원본 시트를 직접 참조하지 않는다. 최종 HTML은 반드시 분할된 실제 파일을 `visualAssetId`로 참조한다. crop region은 하네스가 원본 시트에서 파일을 잘라내기 위한 계약으로만 사용한다.

권장 이미지 시트:

```text
size: 2400x1600
grid: 3 columns x 2 rows
cell: 800x800
style: hand-drawn minimal, black linework, one blue accent, white background
```

목업 기준 표시 슬롯:

```text
slide: 1280x720
safe area: x=58, y=46, width=1164, height≈620
right illustration slot: x≈860, y≈170, width≈330, height≈210
wide map slot: x=58, y≈220, width≈1164, height≈180
```

분할 후 이미지는 목업 슬롯에 맞게 `object-fit: contain`으로 배치한다. 이미지를 HTML/CSS crop-view로 보여 주지 않는다.

### kimai-new-employee

Teaching role:

```text
김아이 세계관을 첫 화면에서 즉시 이해시킨다.
```

Must show:

```text
김아이
신입사원 명찰 또는 첫 출근 느낌
책상 또는 노트북
```

Must not show:

```text
과장된 로봇
미래 도시 배경
복잡한 코드 화면
```

### kimai-company-컨텍스트-blanks

Teaching role:

```text
김아이가 회사, 부서, 제품, 업무 방식을 모르면 실제 회사 업무를 바로 수행할 수 없다는 점을 보여 준다.
```

Must show:

```text
김아이
회사/부서/제품/업무 방식 빈칸
비어 있는 회사 데스크 또는 안내판
```

Must not show:

```text
특정 실존 회사 로고
복잡한 조직도
읽기 어려운 작은 글씨
```

### kimai-report-request-gap

Teaching role:

```text
"제품 리뷰자료 보고서 제출하게 만들어와" 같은 실제 회사식 지시가 왜 부족한지 설명한다.
```

Must show:

```text
팀장 말풍선
김아이
제품/사용 상황/보고서 형식 빈칸
보고서 종이 초안
```

Must not show:

```text
완성된 보고서처럼 보이는 화면
복잡한 차트
비난하거나 혼내는 분위기
```

### kimai-harness-desk-kit

Teaching role:

```text
하네스 엔지니어링을 김아이의 데스크 위에 잘 정돈된 책상, 명확한 지시, 최신 업무자료, 보고서 샘플을 갖춰 주는 일로 설명한다.
```

Must show:

```text
김아이 데스크
잘 정돈된 책상
명확한 지시
최신 업무자료
보고서 샘플
```

Must not show:

```text
기계 장치나 안전벨트 중심의 물리적 하네스
복잡한 공장 배경
추상 아이콘만 나열한 그림
```

### kimai-manual-checkpoint

Teaching role:

```text
체크리스트와 선임 피드백으로 보고서 품질이 올라가는 반복 개선 구조를 설명한다.
```

Must show:

```text
체크리스트
선임 피드백
다시 제출
개선된 보고서
```

### kimai-workflow-map

Teaching role:

```text
김아이가 우수사원이 되도록 팀장님이 이끌어 주는 전체 지도를 설명한다.
```

Must show:

```text
책상 정리
업무 지시
데스크 자료
반복 매뉴얼
역할과 도구
체크리스트
```

## 8. Glossary Seeds

Act 0에서는 용어를 깊게 가르치지 않는다. 툴팁과 보조 라벨의 씨앗만 둔다.

| Term | 쉬운 이름 | Act 0 설명 |
|---|---|---|
| Prompt | 이번 업무 지시 | 김아이에게 이번 한 번의 일을 맡기는 문장 |
| Context | 데스크 자료 | 김아이가 이번 일을 볼 때 참고하는 자료 |
| Skill | 반복 매뉴얼 | 매번 다시 말하지 않을 업무 절차 |
| Agent | 역할이 나뉜 김아이 팀 | 조사, 구현, 리뷰처럼 일을 나눈 구조 |
| Tool | 업무 도구 | 필요한 역할에게만 열어 주는 외부 기능 |
| Hook | 완료 검문소 | 완료 직전에 자동으로 확인하는 장치 |
| Evaluation | 채점표 | 잘했는지 말이 아니라 기준으로 확인하는 방법 |

## 9. Handoff To Harness

이 문서는 바로 최종 HTML로 변환하지 않는다. 다음 단계에서 하네스 입력 파일로 낮춘다. 현재 목업 HTML은 위치와 흐름 확인용 참고물이며, 최종 산출물이 아니다.

Suggested transformation:

```text
act0-content-source.md
-> section-plan.json: Act 0 시간, slide ids, no-practice boundary
-> slide-spec.json: screen headline, message, anchors, bridge, presenter cues
-> asset-pack.json: kimai-act0-visual-sheet plus split assets kimai-new-employee, kimai-company-컨텍스트-blanks, kimai-report-request-gap, kimai-harness-desk-kit, kimai-manual-checkpoint, kimai-workflow-map
-> asset-generation-workflow.md: image sheet generation, real crop file split, review contract
-> glossary.json: Act 0 tooltip seed
-> practice-spec.json: Act 0 has no practice; nextPracticeId = act1-info-selection
```

Required checks before deck build:

```text
1. 각 슬라이드가 하나의 메시지만 갖는가?
2. 화면 문구가 3초 안에 읽히는가?
3. Act 0에 점수화되는 실습이 들어가지 않았는가?
4. interaction이 glossary tooltip을 넘지 않는가?
5. 전문 용어가 본문보다 크게 보이지 않는가?
6. 발표자가 슬라이드만 보고 다음 말과 다음 장을 알 수 있는가?
7. Act 1 정보 선별 실습으로 자연스럽게 넘어가는가?
```
