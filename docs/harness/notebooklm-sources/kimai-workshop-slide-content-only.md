# 김아이 워크숍 전체덱 - 슬라이드 내용만

생성 시각: 2026-06-02T08:34:57.454Z

이 문서는 NotebookLM 주입용 소스입니다. `generated-decks/kimai-workshop-content/slide-spec.json`에서 청중이 보는 화면 문구만 추출했습니다. 발표 스크립트, speaker notes, presenter cues, transition/bridge, 리뷰 콘솔 메타데이터는 제외했습니다.

## 덱 메타데이터

- deck: 김아이 워크숍 전체덱
- source: `generated-decks/kimai-workshop-content/slide-spec.json`
- slide count: 74
- included: title, message, bullets, rewrittenScreen의 화면 슬롯, 시각자료 의미 요약
- excluded: 발표 스크립트, speaker notes, presenter cues, transition/bridge, review/debug metadata

## 섹션 목록

- Act 0 · 오늘의 약속: 수강생이 자신을 김아이를 이끄는 팀장으로 이해하고, 하네스 엔지니어링을 우수한 신입의 업무 능력을 끌어내는 환경과 피드백 루프로 받아들인다.
- Act 1 · 책상 정리: 수강생이 정보 선별을 김아이 책상에 올릴 자료와 치울 자료를 정하는 Context Curation으로 이해한다.
- Act 2 · 좋은 업무 지시: 프롬프트를 김아이가 혼자 일할 수 있게 만드는 업무 지시와 인수인계서로 이해시키고, 별도 Act 2 실습으로 넘긴다.
- Act 3 · CLAUDE.md 회사 내규: 업무 지시(Prompt), 작업 자료(Context), 회사 내규(CLAUDE.md)를 구분하고 CLAUDE.md의 적용 범위와 과다 내규 위험을 이해시킨다.
- Act 4 · 반복 업무 매뉴얼: 반복되는 작업을 매번 다시 지시하지 않도록 작업별 업무 매뉴얼을 만들고, 이것이 Skill 구조로 이어짐을 이해한다.
- Act 5 · 역할 분리와 도구 권한: 김아이, 최아이, 박아이 같은 역할 신입사원 비유로 Agent/Subagent, Skill 배정, Tool Permission, MCP를 이해한다.
- Act 6 · 검증과 하네스 구조: 팀장에게 제출하기 전 필수검증을 품질검문소로 이해하고, Stop Hook, Evaluation, State, Loop가 그 검문소를 자동화하는 방식을 이해한다.
- Wrap-up · 내 업무에 가져가기: 수강생이 자신의 업무에 적용할 하네스 장치 3개를 고른다.

---

## Slide 01 - 신입사원 김아이의 첫 출근날입니다.
- id: act0-kimai-intro
- file: act0-kimai-intro.html
- section: Act 0 · 오늘의 약속
### 기본 화면 문구
- title: 신입사원 김아이의 첫 출근날입니다.
- message: 청중을 팀장님으로 초대하고, 김아이를 새로 입사한 AI 신입사원으로 소개합니다.
bullets:
- 안녕하세요, 팀장님!
### 템플릿 화면 슬롯
- headline: 신입사원 김아이의 첫 출근날입니다.
- message: 청중을 팀장님으로 초대하고, 김아이를 새로 입사한 AI 신입사원으로 소개합니다.
- heroLine: 신입사원 김아이의 첫 출근날입니다.
- promiseBullets:
  - 안녕하세요, 팀장님!
### 시각자료 의미
- visual intent: 상사의 애매한 지시 앞에서 김아이가 빈칸을 바라보는 손그림 장면
- asset teaching role: 김아이 세계관을 첫 화면에서 즉시 이해시킨다.
- asset explanation anchors: 김아이, AI 신입사원, 첫 출근

---

## Slide 02 - 김아이는 뛰어난 신입사원입니다.
- id: act0-kimai-capable
- file: act0-kimai-capable.html
- section: Act 0 · 오늘의 약속
### 기본 화면 문구
- title: 김아이는 뛰어난 신입사원입니다.
- message: 김아이는 아는 것이 많고, 일 처리가 빠르고, 말도 잘하는 뛰어난 신입사원입니다.
bullets:
- 아는 것이 많고
- 일 처리가 빠르고
- 말도 잘합니다
### 템플릿 화면 슬롯
- headline: 김아이는 뛰어난 신입사원입니다.
- message: 김아이는 아는 것이 많고, 일 처리가 빠르고, 말도 잘하는 뛰어난 신입사원입니다.
- imageAnchors:
  - 아는 것이 많고
  - 일 처리가 빠르고
  - 말도 잘합니다
- callout: 아는 것이 많고
### 시각자료 의미
- visual intent: 상사의 애매한 지시 앞에서 김아이가 빈칸을 바라보는 손그림 장면
- asset teaching role: 김아이 세계관을 첫 화면에서 즉시 이해시킨다.
- asset explanation anchors: 김아이, AI 신입사원, 첫 출근

---

## Slide 03 - 똑똑하다고 모든 걸 아는 것은 아닙니다.
- id: act0-company-context
- file: act0-company-context.html
- section: Act 0 · 오늘의 약속
### 기본 화면 문구
- title: 똑똑하다고 모든 걸 아는 것은 아닙니다.
- message: 김아이는 회사, 부서, 상품, 이번 요청을 먼저 알려 줘야 정확히 일합니다.
bullets:
- 뭐 하는 회사?
- 뭐 하는 부서?
- 주력 상품은?
### 템플릿 화면 슬롯
- headline: 똑똑하다고 모든 걸 아는 것은 아닙니다.
- message: 김아이는 회사, 부서, 상품, 이번 요청을 먼저 알려 줘야 정확히 일합니다.
- imageAnchors:
  - 뭐 하는 회사?
  - 뭐 하는 부서?
  - 주력 상품은?
- callout: 뭐 하는 회사?
### 시각자료 의미
- visual intent: 상사의 애매한 지시 앞에서 김아이가 빈칸을 바라보는 손그림 장면
- asset teaching role: 김아이가 회사, 부서, 제품, 업무 방식을 모르면 실제 회사 업무를 바로 수행할 수 없다는 점을 설명한다.
- asset explanation anchors: 무슨 회사인지 모른다, 어떤 부서가 있는지 모른다, 어떤 제품을 만드는지 모른다, 일이 어떤 순서로 진행되는지 모른다

---

## Slide 04 - 팀장님의 첫 업무 지시가 도착했습니다.
- id: act0-real-work-analogy
- file: act0-real-work-analogy.html
- section: Act 0 · 오늘의 약속
### 기본 화면 문구
- title: 팀장님의 첫 업무 지시가 도착했습니다.
- message: 제품, 사용 상황, 보고서 형식이 비면 김아이는 빈칸을 추측으로 채웁니다.
bullets:
- 어떤 제품인지?
- 어디에 쓸지?
- 보고서 형식은?
### 템플릿 화면 슬롯
- headline: 팀장님의 첫 업무 지시가 도착했습니다.
- message: 제품, 사용 상황, 보고서 형식이 비면 김아이는 빈칸을 추측으로 채웁니다.
- imageAnchors:
  - 어떤 제품인지?
  - 어디에 쓸지?
  - 보고서 형식은?
- callout: 어떤 제품인지?
### 시각자료 의미
- visual intent: 상사의 애매한 지시 앞에서 김아이가 빈칸을 바라보는 손그림 장면
- asset teaching role: 보고서 제출 지시가 제품, 사용처, 제출 형식을 빠뜨리면 김아이가 추측한다는 점을 설명한다.
- asset explanation anchors: 어떤 제품인지 모른다, 어디에 쓸 보고서인지 모른다, 어떤 형식으로 제출할지 모른다

---

## Slide 05 - 하네스 엔지니어링은 김아이의 업무 능력을 끌어내는 일입니다.
- id: act0-harness-concept
- file: act0-harness-concept.html
- section: Act 0 · 오늘의 약속
### 기본 화면 문구
- title: 하네스 엔지니어링은 김아이의 업무 능력을 끌어내는 일입니다.
- message: 좋은 신입의 능력을 끌어내려면 잘 정돈된 책상, 명확한 지시, 최신 업무자료, 보고서 샘플이 필요합니다.
bullets:
- 김아이의 업무 환경 설계
- Harness Engineering
- 김아이의 업무 환경 설계와 실제 용어 Harness Engineering를 함께 보여 줍니다.
### 템플릿 화면 슬롯
- headline: 하네스 엔지니어링은 김아이의 업무 능력을 끌어내는 일입니다.
- message: 좋은 신입의 능력을 끌어내려면 잘 정돈된 책상, 명확한 지시, 최신 업무자료, 보고서 샘플이 필요합니다.
- metaphorTerm: 김아이의 업무 환경 설계
- realTerm: Harness Engineering
- termLine: 김아이의 업무 환경 설계와 실제 용어 Harness Engineering를 함께 보여 줍니다.
- supportingLine: 좋은 신입의 능력을 끌어내려면 잘 정돈된 책상, 명확한 지시, 최신 업무자료, 보고서 샘플이 필요합니다.
### 시각자료 의미
- visual intent: 상사의 애매한 지시 앞에서 김아이가 빈칸을 바라보는 손그림 장면
- asset teaching role: 하네스 엔지니어링을 김아이 데스크에 지시서, 자료 묶음, 체크리스트를 갖춰 주는 일로 설명한다.
- asset explanation anchors: 명확한 지시, 필요한 자료, 확인 기준

---

## Slide 06 - 신입은 한 번에 완벽하게 일을 끝내지 못합니다.
- id: act0-first-draft-limits
- file: act0-first-draft-limits.html
- section: Act 0 · 오늘의 약속
### 기본 화면 문구
- title: 신입은 한 번에 완벽하게 일을 끝내지 못합니다.
- message: 좋은 신입도 첫 초안에서는 빠진 내용, 잘못 이해한 기준, 어색한 결과를 만들 수 있습니다.
bullets:
- 빠진 내용
- 잘못 이해한 기준
- 어색한 결과
### 템플릿 화면 슬롯
- headline: 신입은 한 번에 완벽하게 일을 끝내지 못합니다.
- message: 좋은 신입도 첫 초안에서는 빠진 내용, 잘못 이해한 기준, 어색한 결과를 만들 수 있습니다.
- claim: 신입은 한 번에 완벽하게 일을 끝내지 못합니다.
- evidenceAnchors:
  - 빠진 내용
  - 잘못 이해한 기준
  - 어색한 결과
- contrastLabel: 추측 대신 증거
### 시각자료 의미
- visual intent: 상사의 애매한 지시 앞에서 김아이가 빈칸을 바라보는 손그림 장면
- asset teaching role: 신입 김아이가 첫 초안에서 빠진 내용, 잘못 이해한 기준, 어색한 결과를 만들 수 있다는 점을 설명한다.
- asset explanation anchors: 첫 보고서 초안, 빠진 내용, 잘못 이해한 기준, 어색한 결과

---

## Slide 07 - 체크리스트와 피드백이 보고서의 퀄리티를 높입니다.
- id: act0-feedback-loop
- file: act0-feedback-loop.html
- section: Act 0 · 오늘의 약속
### 기본 화면 문구
- title: 체크리스트와 피드백이 보고서의 퀄리티를 높입니다.
- message: 체크리스트로 문제를 찾고, 피드백으로 고친 뒤, 다시 제출하면서 품질을 높입니다.
bullets:
- 문제 찾기
- 수정 정하기
- 다시 제출
### 템플릿 화면 슬롯
- headline: 체크리스트와 피드백이 보고서의 퀄리티를 높입니다.
- message: 체크리스트로 문제를 찾고, 피드백으로 고친 뒤, 다시 제출하면서 품질을 높입니다.
- steps:
  - [object Object]
### 시각자료 의미
- visual intent: 상사의 애매한 지시 앞에서 김아이가 빈칸을 바라보는 손그림 장면
- asset teaching role: 체크리스트와 선임 피드백, 재제출을 통해 보고서 품질이 올라가는 반복 구조를 설명한다.
- asset explanation anchors: 보고서 초안, 체크리스트, 선임 피드백, 다시 제출, 개선된 보고서

---

## Slide 08 - 오늘은 김아이가 우수사원이 되도록 팀장님이 이끌어 주는 시간입니다.
- id: act0-journey-map
- file: act0-journey-map.html
- section: Act 0 · 오늘의 약속
### 기본 화면 문구
- title: 오늘은 김아이가 우수사원이 되도록 팀장님이 이끌어 주는 시간입니다.
- message: 오늘은 여섯 장치를 차례로 붙여 김아이가 흔들리지 않고 일하게 만듭니다.
bullets:
- 자료
- 지시
- 내규
- 매뉴얼
- 역할
- 검증
### 템플릿 화면 슬롯
- headline: 오늘은 김아이가 우수사원이 되도록 팀장님이 이끌어 주는 시간입니다.
- message: 오늘은 여섯 장치를 차례로 붙여 김아이가 흔들리지 않고 일하게 만듭니다.
- steps:
  - [object Object]
### 시각자료 의미
- visual intent: 상사의 애매한 지시 앞에서 김아이가 빈칸을 바라보는 손그림 장면
- asset teaching role: 김아이에게 일을 안정적으로 맡기기 위해 지시, 자료, 매뉴얼, 역할, 도구, 검문소가 순서대로 필요하다는 전체 지도를 설명한다.
- asset explanation anchors: 자료, 지시, 내규, 매뉴얼, 역할, 검증

---

## Slide 09 - 우수사원 프로젝트의 첫 단계는 김아이 책상 정리입니다.
- id: act1-desk-cleanup-open
- file: act1-desk-cleanup-open.html
- section: Act 1 · 책상 정리
### 기본 화면 문구
- title: 우수사원 프로젝트의 첫 단계는 김아이 책상 정리입니다.
- message: 프롬프트를 쓰기 전에 김아이가 무엇을 보고 일할지 정합니다.
bullets:
- 책상 정리
- 보고서 자료
- 추측 줄이기
### 템플릿 화면 슬롯
- headline: 우수사원 프로젝트의 첫 단계는 김아이 책상 정리입니다.
- message: 프롬프트를 쓰기 전에 김아이가 무엇을 보고 일할지 정합니다.
- heroLine: 우수사원 프로젝트의 첫 단계는 김아이 책상 정리입니다.
- promiseBullets:
  - 책상 정리
  - 보고서 자료
  - 추측 줄이기
### 시각자료 의미
- visual intent: Act 0의 보고서 빈칸 장면을 작게 회수하는 손그림
- asset teaching role: Act 0의 우수사원 프로젝트를 회수하고 첫 단계가 김아이 책상 정리라는 점을 설명한다.
- asset explanation anchors: 우수사원 프로젝트, 책상 정리, 김아이

---

## Slide 10 - 김아이는 책상 위에 올라온 자료를 보고 일합니다.
- id: act1-desk-principle
- file: act1-desk-principle.html
- section: Act 1 · 책상 정리
### 기본 화면 문구
- title: 김아이는 책상 위에 올라온 자료를 보고 일합니다.
- message: 김아이가 보는 자료와 기준은 결과에 반영되고, 없는 정보는 김아이가 직접 상상합니다.
bullets:
- 보고 있는 자료
- 같이 놓인 기준
- 없는 정보
### 템플릿 화면 슬롯
- headline: 김아이는 책상 위에 올라온 자료를 보고 일합니다.
- message: 김아이가 보는 자료와 기준은 결과에 반영되고, 없는 정보는 김아이가 직접 상상합니다.
- imageAnchors:
  - 보고 있는 자료
  - 같이 놓인 기준
  - 없는 정보
- callout: 보고 있는 자료
### 시각자료 의미
- visual intent: Act 0의 보고서 빈칸 장면을 작게 회수하는 손그림
- asset teaching role: 김아이가 책상 위 자료와 기준을 보고 일하며 없는 정보는 상상한다는 원리를 설명한다.
- asset explanation anchors: 보고 있는 자료, 같이 놓인 기준, 없는 정보

---

## Slide 11 - 책상에 필요한 자료가 없으면 김아이는 상상하기 시작합니다.
- id: act1-missing-materials
- file: act1-missing-materials.html
- section: Act 1 · 책상 정리
### 기본 화면 문구
- title: 책상에 필요한 자료가 없으면 김아이는 상상하기 시작합니다.
- message: 제품 리뷰자료 보고서에서 필요한 제품, 사용 상황, 비교 기준이 없으면 김아이가 그 빈칸을 상상으로 채웁니다.
bullets:
- 어떤 제품?
- 어디에 쓸지?
- 무엇과 비교?
### 템플릿 화면 슬롯
- headline: 책상에 필요한 자료가 없으면 김아이는 상상하기 시작합니다.
- message: 제품 리뷰자료 보고서에서 필요한 제품, 사용 상황, 비교 기준이 없으면 김아이가 그 빈칸을 상상으로 채웁니다.
- claim: 책상에 필요한 자료가 없으면 김아이는 상상하기 시작합니다.
- evidenceAnchors:
  - 어떤 제품?
  - 어디에 쓸지?
  - 무엇과 비교?
- contrastLabel: 추측 대신 증거
### 시각자료 의미
- visual intent: Act 0의 보고서 빈칸 장면을 작게 회수하는 손그림
- asset teaching role: 책상에 필요한 자료가 없으면 김아이가 상상으로 빈칸을 채우기 시작한다는 점을 설명한다.
- asset explanation anchors: 필요한 자료 없음, 어떤 제품, 어디에 쓸지, 무엇과 비교, 상상 시작

---

## Slide 12 - 책상이 어지러워도 김아이의 판단은 흔들립니다.
- id: act1-messy-desk
- file: act1-messy-desk.html
- section: Act 1 · 책상 정리
### 기본 화면 문구
- title: 책상이 어지러워도 김아이의 판단은 흔들립니다.
- message: 자료가 너무 많거나, 관련 없거나, 오래되면 김아이의 판단 기준이 흐려집니다.
bullets:
- 너무 많은 자료
- 관련 없는 자료
- 오래된 자료
### 템플릿 화면 슬롯
- headline: 책상이 어지러워도 김아이의 판단은 흔들립니다.
- message: 자료가 너무 많거나, 관련 없거나, 오래되면 김아이의 판단 기준이 흐려집니다.
- claim: 책상이 어지러워도 김아이의 판단은 흔들립니다.
- evidenceAnchors:
  - 너무 많은 자료
  - 관련 없는 자료
  - 오래된 자료
- contrastLabel: 추측 대신 증거
### 시각자료 의미
- visual intent: Act 0의 보고서 빈칸 장면을 작게 회수하는 손그림
- asset teaching role: 자료가 너무 많거나 관련 없거나 오래되면 김아이 판단이 흔들린다는 점을 설명한다.
- asset explanation anchors: 너무 많은 자료, 관련 없는 자료, 오래된 자료

---

## Slide 13 - 책상 위 자료는 세 바구니로 나눕니다.
- id: act1-info-baskets
- file: act1-info-baskets.html
- section: Act 1 · 책상 정리
### 기본 화면 문구
- title: 책상 위 자료는 세 바구니로 나눕니다.
- message: 꼭 필요한 자료, 있으면 도움이 되는 자료, 지금은 치워야 할 자료로 나누어 판단을 단순하게 만듭니다.
bullets:
- 꼭 필요
- 있으면 도움
- 지금은 치움
### 템플릿 화면 슬롯
- headline: 책상 위 자료는 세 바구니로 나눕니다.
- message: 꼭 필요한 자료, 있으면 도움이 되는 자료, 지금은 치워야 할 자료로 나누어 판단을 단순하게 만듭니다.
- steps:
  - [object Object]
### 시각자료 의미
- visual intent: Act 0의 보고서 빈칸 장면을 작게 회수하는 손그림
- asset teaching role: 정보 선별은 모든 자료를 넣는 일이 아니라 필수 정보, 있으면 도움, 방해 정보를 구분하는 일임을 설명한다.
- asset explanation anchors: 필수 정보, 있으면 도움, 방해 정보, 많이 주기가 아니라 고르기

---

## Slide 14 - 오늘 보고서에 필요한 자료만 책상 위에 올립니다.
- id: act1-report-desk-materials
- file: act1-report-desk-materials.html
- section: Act 1 · 책상 정리
### 기본 화면 문구
- title: 오늘 보고서에 필요한 자료만 책상 위에 올립니다.
- message: 목표, 자료, 지시, 출력 네 가지를 구분해 제품 비교 분석에 필요한 것만 김아이 책상 위에 올립니다.
bullets:
- 목표: 제품 비교 분석
- 자료: 제품 상세 자료
- 지시: 사용 상황 및 비교 기준 반영
- 출력: 보고서 형식
### 템플릿 화면 슬롯
- headline: 오늘 보고서에 필요한 자료만 책상 위에 올립니다.
- message: 목표, 자료, 지시, 출력 네 가지를 구분해 제품 비교 분석에 필요한 것만 김아이 책상 위에 올립니다.
- rows:
  - [object Object]
### 시각자료 의미
- visual intent: Act 0의 보고서 빈칸 장면을 작게 회수하는 손그림
- asset teaching role: 오늘 보고서에 필요한 제품 자료, 사용 상황, 비교 기준, 보고서 형식만 책상에 올린다는 점을 설명한다.
- asset explanation anchors: 제품 자료, 사용 상황, 비교 기준, 보고서 형식

---

## Slide 15 - 김아이의 책상이 바로 컨텍스트입니다.
- id: act1-context-mapping
- file: act1-context-mapping.html
- section: Act 1 · 책상 정리
### 기본 화면 문구
- title: 김아이의 책상이 바로 컨텍스트입니다.
- message: AI가 이번 작업에서 참고하는 대화와 자료 공간을 Context라고 부릅니다.
bullets:
- 책상 위 자료
- Context
- 책상 위 자료와 실제 용어 Context를 함께 보여 줍니다.
### 템플릿 화면 슬롯
- headline: 김아이의 책상이 바로 컨텍스트입니다.
- message: AI가 이번 작업에서 참고하는 대화와 자료 공간을 Context라고 부릅니다.
- metaphorTerm: 책상 위 자료
- realTerm: Context
- termLine: 책상 위 자료와 실제 용어 Context를 함께 보여 줍니다.
- supportingLine: AI가 이번 작업에서 참고하는 대화와 자료 공간을 Context라고 부릅니다.
### 시각자료 의미
- visual intent: Act 0의 보고서 빈칸 장면을 작게 회수하는 손그림
- asset teaching role: 현실의 데스크가 AI 대화/세션에 쌓이는 Context와 대응되고, Context Curation은 그 공간에 올릴 자료를 고르는 일임을 설명한다.
- asset explanation anchors: 데스크, Context, 대화/세션, Context Curation

---

## Slide 16 - 새 작업은 새 책상에서 시작합니다.
- id: act1-context-curation-close
- file: act1-context-curation-close.html
- section: Act 1 · 책상 정리
### 기본 화면 문구
- title: 새 작업은 새 책상에서 시작합니다.
- message: 이전 대화가 남아 있으면 김아이가 새 업무를 예전 맥락으로 해석할 수 있습니다.
bullets:
- /clear 또는 새 대화
- 필요 자료 읽기
- 웹 검색으로 보충
- 새 기준으로 시작
### 템플릿 화면 슬롯
- headline: 새 작업은 새 책상에서 시작합니다.
- message: 이전 대화가 남아 있으면 김아이가 새 업무를 예전 맥락으로 해석할 수 있습니다.
- steps:
  - [object Object]
### 시각자료 의미
- visual intent: 이전 자료를 치우고 새 작업 자료를 올리는 책상 정리 절차를 보여 주는 손그림
- asset teaching role: 컨텍스트 정리는 책상에 올릴 자료, 옆에 둘 자료, 치울 자료를 정하는 일임을 설명한다.
- asset explanation anchors: 올릴 자료, 옆에 둘 자료, 치울 자료

---

## Slide 17 - 첫 실습은 김아이 책상을 직접 정리하는 일입니다.
- id: act1-practice-handoff
- file: act1-practice-handoff.html
- section: Act 1 · 책상 정리
### 기본 화면 문구
- title: 첫 실습은 김아이 책상을 직접 정리하는 일입니다.
- message: 수강생은 보고서 목표를 읽고, 자료를 세 바구니로 나누고, 김아이가 무엇을 추측할지 확인합니다.
bullets:
- 보고서 목표 읽기
- 자료 바구니 나누기
- 빈칸 리포트 보기
### 템플릿 화면 슬롯
- headline: 첫 실습은 김아이 책상을 직접 정리하는 일입니다.
- message: 수강생은 보고서 목표를 읽고, 자료를 세 바구니로 나누고, 김아이가 무엇을 추측할지 확인합니다.
- actionList:
  - 보고서 목표 읽기
  - 자료 바구니 나누기
  - 빈칸 리포트 보기
- imagePolicy: deterministic-kimai-reference-composite-no-generated-character
### 시각자료 의미
- visual intent: Act 1 설명을 닫고 책상 정리 실습으로 넘어가는 전환 장면
- asset teaching role: Act 1 설명을 닫고 책상 정리 실습으로 넘어가는 전환 장면
- asset explanation anchors: 보고서 목표 읽기, 자료 바구니 나누기, 빈칸 리포트 보기

---

## Slide 18 - 책상을 정리했으면 이제 일을 맡길 차례입니다.
- id: act2-work-handoff
- file: act2-work-handoff.html
- section: Act 2 · 좋은 업무 지시
### 기본 화면 문구
- title: 책상을 정리했으면 이제 일을 맡길 차례입니다.
- message: 일할 준비가 되었으면 김아이에게 일을 시켜야 합니다.
bullets:
- 업무 지시
- Prompt
- 업무 지시와 실제 용어 Prompt를 함께 보여 줍니다.
### 템플릿 화면 슬롯
- headline: 책상을 정리했으면 이제 일을 맡길 차례입니다.
- message: 일할 준비가 되었으면 김아이에게 일을 시켜야 합니다.
- metaphorTerm: 업무 지시
- realTerm: Prompt
- termLine: 업무 지시와 실제 용어 Prompt를 함께 보여 줍니다.
- supportingLine: 일할 준비가 되었으면 김아이에게 일을 시켜야 합니다.
### 시각자료 의미
- visual intent: 정리된 책상 앞에서 팀장이 김아이에게 다음 일을 맡기려는 손그림
- asset teaching role: 정리된 책상 다음에 김아이에게 일을 시켜야 한다는 Act 2 전환을 보여 준다.
- asset explanation anchors: 정리된 책상, 김아이, 업무 시작

---

## Slide 19 - 모호한 지시는 김아이가 어떤 결과를 낼지 모르게 만듭니다.
- id: act2-vague-outcome-risk
- file: act2-vague-outcome-risk.html
- section: Act 2 · 좋은 업무 지시
### 기본 화면 문구
- title: 모호한 지시는 김아이가 어떤 결과를 낼지 모르게 만듭니다.
- message: 대충 던진 지시는 보고서 방향을 김아이의 추측에 맡기게 됩니다.
bullets:
- 보고서?
- 요약표?
- 리뷰 모음?
### 템플릿 화면 슬롯
- headline: 모호한 지시는 김아이가 어떤 결과를 낼지 모르게 만듭니다.
- message: 대충 던진 지시는 보고서 방향을 김아이의 추측에 맡기게 됩니다.
- claim: 모호한 지시는 김아이가 어떤 결과를 낼지 모르게 만듭니다.
- evidenceAnchors:
  - 보고서?
  - 요약표?
  - 리뷰 모음?
- contrastLabel: 추측 대신 증거
### 시각자료 의미
- visual intent: 짧은 지시 하나에서 서로 다른 세 가지 결과물이 갈라지는 손그림
- asset teaching role: 모호한 지시가 서로 다른 결과로 갈라질 수 있다는 위험을 보여 준다.
- asset explanation anchors: 보고서?, 요약표?, 리뷰 모음?

---

## Slide 20 - 말하지 않은 부분은 김아이 혼자 상상합니다.
- id: act2-unspoken-imagination
- file: act2-unspoken-imagination.html
- section: Act 2 · 좋은 업무 지시
### 기본 화면 문구
- title: 말하지 않은 부분은 김아이 혼자 상상합니다.
- message: 목적, 자료, 완료 기준이 빠지면 김아이는 자기 방식으로 빈칸을 채웁니다.
bullets:
- 목적 추측
- 자료 추측
- 완료 추측
### 템플릿 화면 슬롯
- headline: 말하지 않은 부분은 김아이 혼자 상상합니다.
- message: 목적, 자료, 완료 기준이 빠지면 김아이는 자기 방식으로 빈칸을 채웁니다.
- imageAnchors:
  - 목적 추측
  - 자료 추측
  - 완료 추측
- callout: 목적 추측
### 시각자료 의미
- visual intent: 빈칸이 있는 업무 지시 옆에서 김아이가 자기 생각으로 칸을 채우는 손그림
- asset teaching role: 말하지 않은 목적, 자료, 완료 기준을 김아이가 혼자 상상하는 문제를 보여 준다.
- asset explanation anchors: 목적 추측, 자료 추측, 완료 추측

---

## Slide 21 - 좋은 지시는 김아이와 질문하며 구체화합니다.
- id: act2-input-output-principle
- file: act2-input-output-principle.html
- section: Act 2 · 좋은 업무 지시
### 기본 화면 문구
- title: 좋은 지시는 김아이와 질문하며 구체화합니다.
- message: 한 번에 완벽한 지시를 만들기보다, 필요한 자료와 빠진 조건을 김아이와 함께 좁혀 갑니다.
bullets:
- 필요 자료 파악
- 빠진 조건 질문
- 팀장 답변 반영
- 작업 플랜 정리
### 템플릿 화면 슬롯
- headline: 좋은 지시는 김아이와 질문하며 구체화합니다.
- message: 한 번에 완벽한 지시를 만들기보다, 필요한 자료와 빠진 조건을 김아이와 함께 좁혀 갑니다.
- steps:
  - [object Object]
### 시각자료 의미
- visual intent: 김아이가 팀장에게 필요한 자료와 조건을 질문하고 답변을 작업 플랜으로 정리하는 손그림
- asset teaching role: 김아이가 팀장에게 필요한 자료와 조건을 질문하고 답변을 작업 플랜으로 정리하는 협업 절차를 설명한다.
- asset explanation anchors: 필요 자료, 빠진 조건, 팀장 답변, 작업 플랜

---

## Slide 22 - 작업지시서는 김아이가 혼자 일할 수 있게 만드는 spec입니다.
- id: act2-handoff-document
- file: act2-handoff-document.html
- section: Act 2 · 좋은 업무 지시
### 기본 화면 문구
- title: 작업지시서는 김아이가 혼자 일할 수 있게 만드는 spec입니다.
- message: spec에는 목표, 자료, 조건, 출력, 완료 기준이 들어갑니다.
bullets:
- 작업지시서
- Spec
- Task Specification은 이번 작업의 목표와 조건을 정리한 명세입니다.
### 템플릿 화면 슬롯
- headline: 작업지시서는 김아이가 혼자 일할 수 있게 만드는 spec입니다.
- message: spec에는 목표, 자료, 조건, 출력, 완료 기준이 들어갑니다.
- metaphorTerm: 작업지시서
- realTerm: Spec
- termLine: Task Specification은 이번 작업의 목표와 조건을 정리한 명세입니다.
- supportingLine: 작업지시서는 목표, 자료, 조건, 출력, 완료 기준을 묶어 김아이가 혼자 일할 수 있게 만드는 명세입니다.
### 시각자료 의미
- visual intent: 팀장이 김아이에게 목표와 조건이 정리된 작업지시서 spec 한 장을 건네는 손그림
- asset teaching role: 인수인계서가 김아이가 혼자 일할 수 있게 목표, 자료, 조건, 완료 기준을 묶어 준다는 점을 설명한다.
- asset explanation anchors: 목표, 자료, 조건, 완료 기준

---

## Slide 23 - spec에는 참고 자료와 지켜야 할 조건을 따로 적습니다.
- id: act2-materials-conditions
- file: act2-materials-conditions.html
- section: Act 2 · 좋은 업무 지시
### 기본 화면 문구
- title: spec에는 참고 자료와 지켜야 할 조건을 따로 적습니다.
- message: 참고 자료와 지켜야 할 조건을 따로 말해야 판단 기준이 흐려지지 않습니다.
bullets:
- 참고 자료
- 비교 기준
- 제외 조건
### 템플릿 화면 슬롯
- headline: spec에는 참고 자료와 지켜야 할 조건을 따로 적습니다.
- message: 참고 자료와 지켜야 할 조건을 따로 말해야 판단 기준이 흐려지지 않습니다.
- steps:
  - [object Object]
### 시각자료 의미
- visual intent: 인수인계서 가운데에 참고 자료 묶음과 작업 조건 묶음이 분리되어 있는 손그림
- asset teaching role: 좋은 지시서가 자료와 조건을 따로 지정한다는 점을 설명한다.
- asset explanation anchors: 제품 자료, 비교 기준, 분량·톤·제외 조건

---

## Slide 24 - spec에는 출력 형식과 완료 기준도 들어갑니다.
- id: act2-output-done-criteria
- file: act2-output-done-criteria.html
- section: Act 2 · 좋은 업무 지시
### 기본 화면 문구
- title: spec에는 출력 형식과 완료 기준도 들어갑니다.
- message: 형식, 마감, 확인 기준이 있어야 김아이가 끝을 혼자 정하지 않습니다.
bullets:
- 판정 기준
- Evaluation
- 판정 기준와 실제 용어 Evaluation를 함께 보여 줍니다.
### 템플릿 화면 슬롯
- headline: spec에는 출력 형식과 완료 기준도 들어갑니다.
- message: 형식, 마감, 확인 기준이 있어야 김아이가 끝을 혼자 정하지 않습니다.
- metaphorTerm: 판정 기준
- realTerm: Evaluation
- termLine: 판정 기준와 실제 용어 Evaluation를 함께 보여 줍니다.
- supportingLine: 보고서 형식, 마감, 확인 기준이 있어야 김아이가 언제 끝났는지 혼자 정하지 않는다.
### 시각자료 의미
- visual intent: 인수인계서 마지막 부분에 형식, 마감, 확인 기준 체크가 있는 손그림
- asset teaching role: 좋은 지시서가 출력 형식과 완료 기준을 정한다는 점을 설명한다.
- asset explanation anchors: 보고서 형식, 마감, 확인 기준

---

## Slide 25 - 여러분이 만든 작업지시서가 프롬프트가 됩니다.
- id: act2-prompt-term-mapping
- file: act2-prompt-term-mapping.html
- section: Act 2 · 좋은 업무 지시
### 기본 화면 문구
- title: 여러분이 만든 작업지시서가 프롬프트가 됩니다.
- message: 프롬프트는 멋진 문장이 아니라, 김아이가 바로 일할 수 있게 정리된 작업지시입니다.
bullets:
- 작업지시서
- 전달
- Prompt
- 작업지시서가 Prompt로 전달되는 흐름을 보여 줍니다.
### 템플릿 화면 슬롯
- headline: 여러분이 만든 작업지시서가 프롬프트가 됩니다.
- message: 프롬프트는 멋진 문장이 아니라, 김아이가 바로 일할 수 있게 정리된 작업지시입니다.
- metaphorTerm: 작업지시서
- realTerm: Prompt
- termLine: 작업지시서가 Prompt로 전달되는 흐름을 보여 줍니다.
- supportingLine: 프롬프트는 김아이가 바로 일할 수 있게 정리된 작업지시입니다.
### 시각자료 의미
- visual intent: 목표, 자료, 조건, 출력, 완료 기준이 적힌 작업지시서가 김아이에게 전달되며 Prompt가 되는 손그림
- asset teaching role: 목표, 자료, 조건, 출력, 완료 기준이 적힌 작업지시서가 김아이에게 전달되며 Prompt가 된다는 점을 설명한다.
- asset explanation anchors: 작업지시서, 목표, 자료, 조건, 출력, 완료 기준, 전달, Prompt, 김아이

---

## Slide 26 - 낡은 프롬프트 꿀팁은 역할 흉내에 가깝습니다.
- id: act2-prompt-reframing
- file: act2-prompt-reframing.html
- section: Act 2 · 좋은 업무 지시
### 기본 화면 문구
- title: 낡은 프롬프트 꿀팁은 역할 흉내에 가깝습니다.
- message: “50년 경력처럼 해줘”보다 무엇을 검토할지 정확히 말해야 합니다.
bullets:
- 겉멋 역할
- 모호한 수식어
- 명확한 지시
### 템플릿 화면 슬롯
- headline: 낡은 프롬프트 꿀팁은 역할 흉내에 가깝습니다.
- message: “50년 경력처럼 해줘”보다 무엇을 검토할지 정확히 말해야 합니다.
- keySentence: 낡은 프롬프트 꿀팁은 역할 흉내에 가깝습니다.
- imageAnchors:
  - 겉멋 역할
  - 모호한 수식어
  - 명확한 지시
### 시각자료 의미
- visual intent: 50년 경력처럼, 전문가 빙의 같은 낡은 역할 흉내 카드와 명확한 지시 체크리스트를 대비하는 손그림
- asset teaching role: 낡은 역할 흉내 프롬프트보다 명확한 작업지시가 효과적이라는 점을 대비시킨다.
- asset explanation anchors: 50년 경력처럼, 전문가 빙의, 명확한 지시, 로직 검증, 예외 처리, 완료 기준, 김아이

---

## Slide 27 - 페르소나는 말투가 아니라 우선순위 필터입니다.
- id: act2-persona-priority-filter
- file: act2-persona-priority-filter.html
- section: Act 2 · 좋은 업무 지시
### 기본 화면 문구
- title: 페르소나는 말투가 아니라 우선순위 필터입니다.
- message: 좋은 페르소나는 빙의가 아니라, 어떤 기준을 먼저 볼지 정하는 장치입니다.
bullets:
- 보안 우선
- 속도 우선
- 확장성 우선
### 템플릿 화면 슬롯
- headline: 페르소나는 말투가 아니라 우선순위 필터입니다.
- message: 좋은 페르소나는 빙의가 아니라, 어떤 기준을 먼저 볼지 정하는 장치입니다.
- keySentence: 페르소나는 말투가 아니라 우선순위 필터입니다.
- imageAnchors:
  - 보안 우선
  - 속도 우선
  - 확장성 우선
### 시각자료 의미
- visual intent: 보안, 속도, 확장성 카드가 우선순위 필터를 지나 김아이의 작업 기준으로 정리되는 손그림
- asset teaching role: 현대의 페르소나는 빙의가 아니라 보안, 속도, 확장성 같은 우선순위 필터라는 점을 설명한다.
- asset explanation anchors: 우선순위 필터, 보안 우선, 속도 우선, 확장성 우선, 작업 기준, 빙의 X, 김아이

---

## Slide 28 - 첫 실습은 김아이에게 업무 지시를 다시 해 보는 일입니다.
- id: act2-practice-handoff
- file: act2-practice-handoff.html
- section: Act 2 · 좋은 업무 지시
### 기본 화면 문구
- title: 첫 실습은 김아이에게 업무 지시를 다시 해 보는 일입니다.
- message: 실습 화면에서 제품 리뷰자료 보고서 지시를 고치고 피드백을 확인합니다.
bullets:
- 대충 지시 보기
- 업무 지시 고치기
- 피드백 보고 다시 쓰기
### 템플릿 화면 슬롯
- headline: 첫 실습은 김아이에게 업무 지시를 다시 해 보는 일입니다.
- message: 실습 화면에서 제품 리뷰자료 보고서 지시를 고치고 피드백을 확인합니다.
- actionList:
  - 대충 지시 보기
  - 업무 지시 고치기
  - 피드백 보고 다시 쓰기
- imagePolicy: deterministic-kimai-reference-composite-no-generated-character
### 시각자료 의미
- visual intent: Act 2 설명을 닫고 업무 지시 재작성 실습으로 넘어가는 전환 장면
- asset teaching role: Act 2 설명을 닫고 업무 지시 재작성 실습으로 넘어가는 전환 장면
- asset explanation anchors: 대충 지시 보기, 업무 지시 고치기, 피드백 보고 다시 쓰기

---

## Slide 29 - Prompt, Context, CLAUDE.md는 서로 다른 자리입니다.
- id: act3-act1-context-recover
- file: act3-act1-context-recover.html
- section: Act 3 · CLAUDE.md 회사 내규
### 기본 화면 문구
- title: Prompt, Context, CLAUDE.md는 서로 다른 자리입니다.
- message: Prompt는 지금 지시, Context는 지금 자료, CLAUDE.md는 매번 지킬 내규입니다.
bullets:
- 회사 내규
- CLAUDE.md
- 회사 내규와 실제 용어 CLAUDE.md를 함께 보여 줍니다.
### 템플릿 화면 슬롯
- headline: Prompt, Context, CLAUDE.md는 서로 다른 자리입니다.
- message: Prompt는 지금 지시, Context는 지금 자료, CLAUDE.md는 매번 지킬 내규입니다.
- metaphorTerm: 회사 내규
- realTerm: CLAUDE.md
- termLine: 회사 내규와 실제 용어 CLAUDE.md를 함께 보여 줍니다.
- supportingLine: Act 3의 첫 기준은 Prompt, Context, CLAUDE.md의 자리를 나누는 것이다. Prompt는.
### 시각자료 의미
- visual intent: 김아이 앞에 업무 지시, 책상 위 작업 자료, 공용공간 회사 내규가 세 영역으로 분리된 손그림
- asset teaching role: 김아이 앞에 업무 지시, 책상 위 작업 자료, 공용공간 회사 내규가 세 영역으로 분리된 손그림
- asset explanation anchors: 이번 자료, 책상 정리, 항상 규칙

---

## Slide 30 - 회사 내규는 김아이가 매번 지켜야 할 공통 기준입니다.
- id: act3-rules-are-different
- file: act3-rules-are-different.html
- section: Act 3 · CLAUDE.md 회사 내규
### 기본 화면 문구
- title: 회사 내규는 김아이가 매번 지켜야 할 공통 기준입니다.
- message: 회사 내규는 특정 보고서 한 건이 아니라, 어떤 일을 하든 기본으로 지켜야 하는 기준입니다.
bullets:
- 회사 내규
- CLAUDE.md
- 회사 내규와 실제 용어 CLAUDE.md를 함께 보여 줍니다.
### 템플릿 화면 슬롯
- headline: 회사 내규는 김아이가 매번 지켜야 할 공통 기준입니다.
- message: 회사 내규는 특정 보고서 한 건이 아니라, 어떤 일을 하든 기본으로 지켜야 하는 기준입니다.
- metaphorTerm: 회사 내규
- realTerm: CLAUDE.md
- termLine: 회사 내규와 실제 용어 CLAUDE.md를 함께 보여 줍니다.
- supportingLine: 회사 내규는 특정 보고서 한 건이 아니라, 어떤 일을 하든 기본으로 지켜야 하는 기준이다.
### 시각자료 의미
- visual intent: 공용공간 게시판에 출퇴근 시간, 업무 보고 체계, 징계 기준이 붙어 있고 김아이가 확인하는 손그림
- asset teaching role: 공용공간 게시판에 출퇴근 시간, 업무 보고 체계, 징계 기준이 붙어 있고 김아이가 확인하는 손그림
- asset explanation anchors: 이번 자료, 항상 규칙, 섞이면 혼란

---

## Slide 31 - 반복해서 확인된 협업 기준은 내규로 올릴 수 있습니다.
- id: act3-too-many-rules
- file: act3-too-many-rules.html
- section: Act 3 · CLAUDE.md 회사 내규
### 기본 화면 문구
- title: 반복해서 확인된 협업 기준은 내규로 올릴 수 있습니다.
- message: 타부서 협업에서 반복해서 확인된 요청 양식, 보고 라인, 책임 소재는 다음에도 지킬 내규로 올릴 수 있다.
bullets:
- 회사 내규
- CLAUDE.md
- 회사 내규와 실제 용어 CLAUDE.md를 함께 보여 줍니다.
### 템플릿 화면 슬롯
- headline: 반복해서 확인된 협업 기준은 내규로 올릴 수 있습니다.
- message: 타부서 협업에서 반복해서 확인된 요청 양식, 보고 라인, 책임 소재는 다음에도 지킬 내규로 올릴 수 있다.
- metaphorTerm: 회사 내규
- realTerm: CLAUDE.md
- termLine: 회사 내규와 실제 용어 CLAUDE.md를 함께 보여 줍니다.
- supportingLine: 타부서 협업에서 반복해서 확인된 요청 양식, 보고 라인, 책임 소재는 다음에도 지킬 내규로 올릴 수 있다.
### 시각자료 의미
- visual intent: 타부서 협업 과정에서 요청 양식, 보고 라인, 책임 소재가 정리되어 회사 내규로 올라가는 손그림
- asset teaching role: 타부서 협업 과정에서 요청 양식, 보고 라인, 책임 소재가 정리되어 회사 내규로 올라가는 손그림
- asset explanation anchors: 읽을 것 과다, 판단 지연, 충돌 위험

---

## Slide 32 - CLAUDE.md는 적용 범위가 다른 지침입니다.
- id: act3-temporary-info-danger
- file: act3-temporary-info-danger.html
- section: Act 3 · CLAUDE.md 회사 내규
### 기본 화면 문구
- title: CLAUDE.md는 적용 범위가 다른 지침입니다.
- message: 회장님 지침, 본사 공통 지침, 부서 사규, 팀장님 현장 지침처럼 적용 범위가 다릅니다.
bullets:
- 회장님 지침
- 본사 공통 지침
- 부서 사규
- 팀장님 현장 지침
### 템플릿 화면 슬롯
- headline: CLAUDE.md는 적용 범위가 다른 지침입니다.
- message: 회장님 지침, 본사 공통 지침, 부서 사규, 팀장님 현장 지침처럼 적용 범위가 다릅니다.
- imageAnchors:
  - 회장님 지침
  - 본사 공통 지침
  - 부서 사규
  - 팀장님 현장 지침
### 시각자료 의미
- visual intent: 회장님 지침, 본사 공통 지침, 부서 사규, 팀장님 현장 지침이 계층으로 내려오고 김아이가 현장 지침 가까이에 서 있는 손그림
- asset teaching role: CLAUDE.md의 적용 범위를 회장님 지침, 본사 공통 지침, 부서 사규, 팀장님 현장 지침으로 설명한다.
- asset explanation anchors: 회장님 지침, 본사 공통 지침, 부서 사규, 팀장님 현장 지침, 가까울수록 구체적, 김아이

---

## Slide 33 - 가장 가까운 팀장님 지침이 더 강하게 적용됩니다.
- id: act3-good-rule-board-shape
- file: act3-good-rule-board-shape.html
- section: Act 3 · CLAUDE.md 회사 내규
### 기본 화면 문구
- title: 가장 가까운 팀장님 지침이 더 강하게 적용됩니다.
- message: 넓은 지침이 먼저 깔리고, 지금 작업 위치에 가까운 지침이 더 구체적으로 덧씌워집니다.
bullets:
- 가까운 지침 우선
- 구체적인 지시
- 덮어쓰기
### 템플릿 화면 슬롯
- headline: 가장 가까운 팀장님 지침이 더 강하게 적용됩니다.
- message: 넓은 지침이 먼저 깔리고, 지금 작업 위치에 가까운 지침이 더 구체적으로 덧씌워집니다.
- imageAnchors:
  - 가까운 지침 우선
  - 구체적인 지시
  - 덮어쓰기
### 시각자료 의미
- visual intent: 멀리 있는 회장님 지침보다 김아이 눈앞의 팀장님 현장 지침이 크게 강조되어 가까운 지침 우선을 보여 주는 손그림
- asset teaching role: 가까운 팀장님 현장 지침이 멀리 있는 회장님 지침보다 지금 작업에 더 직접적으로 적용됨을 설명한다.
- asset explanation anchors: 회장님 지침, 팀장님 현장 지침, 가까운 지침 우선, 현장 기준, 김아이

---

## Slide 34 - 내규가 너무 많으면 김아이는 일을 시작하기 어려워집니다.
- id: act3-context-vs-claude-md
- file: act3-context-vs-claude-md.html
- section: Act 3 · CLAUDE.md 회사 내규
### 기본 화면 문구
- title: 내규가 너무 많으면 김아이는 일을 시작하기 어려워집니다.
- message: 내규가 너무 많으면 읽어야 할 것이 늘고, 이전 설정과 현재 설정이 충돌하며, 제약 때문에 실행이 느려진다.
bullets:
- 너무 많은 내규
- Rule Overload
- 너무 많은 내규와 실제 용어 Rule Overload를 함께 보여 줍니다.
### 템플릿 화면 슬롯
- headline: 내규가 너무 많으면 김아이는 일을 시작하기 어려워집니다.
- message: 내규가 너무 많으면 읽어야 할 것이 늘고, 이전 설정과 현재 설정이 충돌하며, 제약 때문에 실행이 느려진다.
- metaphorTerm: 너무 많은 내규
- realTerm: Rule Overload
- termLine: 너무 많은 내규와 실제 용어 Rule Overload를 함께 보여 줍니다.
- supportingLine: 내규가 너무 많으면 읽어야 할 것이 늘고, 이전 설정과 현재 설정이 충돌하며, 제약 때문에 실행이 느려진다.
### 시각자료 의미
- visual intent: 너무 많은 회사 내규 앞에서 김아이가 읽지 못하고, 설정 충돌과 실행 지연을 겪는 손그림
- asset teaching role: 너무 많은 회사 내규 앞에서 김아이가 읽지 못하고, 설정 충돌과 실행 지연을 겪는 손그림
- asset explanation anchors: 이번 자료 = Context, 항상 규칙 = CLAUDE.md, 임시 정보는 제외

---

## Slide 35 - 이제 실습에서는 김아이의 CLAUDE.md를 직접 설정합니다.
- id: act3-practice-handoff
- file: act3-practice-handoff.html
- section: Act 3 · CLAUDE.md 회사 내규
### 기본 화면 문구
- title: 이제 실습에서는 김아이의 CLAUDE.md를 직접 설정합니다.
- message: 실습 화면에서 적용 범위를 고르고, CLAUDE.md 초안을 쓴 뒤 과한 내규를 줄입니다.
bullets:
- 적용 범위 선택
- 내규 초안 작성
- 과한 내규 줄이기
### 템플릿 화면 슬롯
- headline: 이제 실습에서는 김아이의 CLAUDE.md를 직접 설정합니다.
- message: 실습 화면에서 적용 범위를 고르고, CLAUDE.md 초안을 쓴 뒤 과한 내규를 줄입니다.
- actionList:
  - 적용 범위 선택
  - 내규 초안 작성
  - 과한 내규 줄이기
- imagePolicy: deterministic-kimai-reference-composite-no-generated-character
### 시각자료 의미
- visual intent: Act 3 설명을 닫고 CLAUDE.md 설정 실습으로 넘어가는 전환 장면
- asset teaching role: Act 3 설명을 닫고 CLAUDE.md 설정 실습으로 넘어가는 전환 장면
- asset explanation anchors: 이번 자료 고르기, 항상 규칙 고르기, 과한 규칙 치우기

---

## Slide 36 - 내규가 선이라면, 매뉴얼은 길입니다.
- id: act3-to-act4-manual
- file: act3-to-act4-manual.html
- section: Act 3 · CLAUDE.md 회사 내규
### 기본 화면 문구
- title: 내규가 선이라면, 매뉴얼은 길입니다.
- message: CLAUDE.md는 넘지 말아야 할 기준이고, 매뉴얼은 김아이가 따라가야 할 작업 순서입니다.
bullets:
- 지켜야 할 기준
- 따라 할 순서
- 단계별 실행
### 템플릿 화면 슬롯
- headline: 내규가 선이라면, 매뉴얼은 길입니다.
- message: CLAUDE.md는 넘지 말아야 할 기준이고, 매뉴얼은 김아이가 따라가야 할 작업 순서입니다.
- imageAnchors:
  - 지켜야 할 기준
  - 따라 할 순서
  - 단계별 실행
### 시각자료 의미
- visual intent: 내규는 넘지 말아야 할 선이고 매뉴얼은 시장 조사, 장단점 분석, 보고서 작성으로 이어지는 길임을 보여 주는 김아이 손그림
- asset teaching role: 내규는 넘지 말아야 할 선이고 매뉴얼은 따라가야 할 작업 순서라는 Act 3 to Act 4 전환을 설명한다.
- asset explanation anchors: 내규 = 선, 매뉴얼 = 길, 금지 조건, 제외 기준, 시장 조사, 장단점 분석, 보고서 작성, 순서대로 실행, 김아이

---

## Slide 37 - 반복되는 작업에는 반복되는 지시가 따라옵니다.
- id: act4-repeated-work-instructions
- file: act4-repeated-work-instructions.html
- section: Act 4 · 반복 업무 매뉴얼
### 기본 화면 문구
- title: 반복되는 작업에는 반복되는 지시가 따라옵니다.
- message: 매주 쓰는 회의 요약, 매번 하는 자료 정리, 자주 반복되는 리뷰 요청처럼 반복 작업에는 반복 지시가 따라옵니다.
bullets:
- 매주 쓰는 회의 요약
- 매번 하는 자료 정리
- 자주 반복되는 리뷰 요청
### 템플릿 화면 슬롯
- headline: 반복되는 작업에는 반복되는 지시가 따라옵니다.
- message: 매주 쓰는 회의 요약, 매번 하는 자료 정리, 자주 반복되는 리뷰 요청처럼 반복 작업에는 반복 지시가 따라옵니다.
- heroLine: 반복되는 작업에는 반복되는 지시가 따라옵니다.
- promiseBullets:
  - 매주 쓰는 회의 요약
  - 매번 하는 자료 정리
  - 자주 반복되는 리뷰 요청
### 시각자료 의미
- visual intent: 반복되는 작업에는 반복되는 지시가 따라옵니다. 장면을 설명하는 hand-drawn minimal teaching asset
- asset teaching role: 반복 작업에는 반복 지시가 따라온다는 현실 비유를 설명한다.
- asset explanation anchors: 회의 요약, 자료 정리, 리뷰 요청, 반복 지시

---

## Slide 38 - 반복 지시를 매번 다시 말하면 일이 사람에게 묶입니다.
- id: act4-human-bound-instructions
- file: act4-human-bound-instructions.html
- section: Act 4 · 반복 업무 매뉴얼
### 기본 화면 문구
- title: 반복 지시를 매번 다시 말하면 일이 사람에게 묶입니다.
- message: 반복 지시가 사람의 기억에 묶이면 매번 설명이 달라지고 같은 순서를 재사용하기 어렵습니다.
bullets:
- 매번 설명
- 표현 흔들림
- 순서 유실
### 템플릿 화면 슬롯
- headline: 반복 지시를 매번 다시 말하면 일이 사람에게 묶입니다.
- message: 반복 지시가 사람의 기억에 묶이면 매번 설명이 달라지고 같은 순서를 재사용하기 어렵습니다.
- steps:
  - [object Object]
### 시각자료 의미
- visual intent: 반복 지시를 매번 다시 말하면 일이 사람에게 묶입니다. 장면을 설명하는 hand-drawn minimal teaching asset
- asset teaching role: 반복 지시를 매번 다시 말하면 일이 사람에게 묶이는 문제를 설명한다.
- asset explanation anchors: 팀장이 매번 설명, 다른 표현, 이전 순서 재사용 어려움

---

## Slide 39 - 매번 다른 지시는 김아이의 시작점을 흔듭니다.
- id: act4-different-instruction-starts
- file: act4-different-instruction-starts.html
- section: Act 4 · 반복 업무 매뉴얼
### 기본 화면 문구
- title: 매번 다른 지시는 김아이의 시작점을 흔듭니다.
- message: 같은 반복 업무라도 지시가 매번 다르면 김아이는 매번 다른 출발선에서 시작합니다.
bullets:
- 먼저 질문
- 바로 작성
- 확인 없이 종료
### 템플릿 화면 슬롯
- headline: 매번 다른 지시는 김아이의 시작점을 흔듭니다.
- message: 같은 반복 업무라도 지시가 매번 다르면 김아이는 매번 다른 출발선에서 시작합니다.
- imageAnchors:
  - 먼저 질문
  - 바로 작성
  - 확인 없이 종료
- callout: 어떤 날은 먼저 질문
### 시각자료 의미
- visual intent: 매번 다른 지시는 김아이의 시작점을 흔듭니다. 장면을 설명하는 hand-drawn minimal teaching asset
- asset teaching role: 매번 다른 지시가 김아이의 시작점을 흔드는 문제를 설명한다.
- asset explanation anchors: 먼저 질문, 바로 작성, 확인 없이 종료, 흔들리는 시작점

---

## Slide 40 - 작업별 업무 매뉴얼을 만들어 사용해 봅시다.
- id: act4-task-manual-outside
- file: act4-task-manual-outside.html
- section: Act 4 · 반복 업무 매뉴얼
### 기본 화면 문구
- title: 작업별 업무 매뉴얼을 만들어 사용해 봅시다.
- message: 업무 매뉴얼은 반복 순서를 머릿속이 아니라 문서에 고정하는 장치입니다.
bullets:
- 즉흥 판단 금지
- 기억 의존 금지
- 문서로 고정
### 템플릿 화면 슬롯
- headline: 작업별 업무 매뉴얼을 만들어 사용해 봅시다.
- message: 업무 매뉴얼은 반복 순서를 머릿속이 아니라 문서에 고정하는 장치입니다.
- steps:
  - [object Object]
### 시각자료 의미
- visual intent: 작업별 업무 매뉴얼을 만들어 사용해 봅시다. 장면을 설명하는 hand-drawn minimal teaching asset
- asset teaching role: 작업별 업무 매뉴얼을 문서로 만들어 순서를 유지하는 개념을 설명한다.
- asset explanation anchors: 작업별 업무 매뉴얼, 김아이 머릿속에 맡기지 않음, 팀장 기억에 맡기지 않음, 문서로 같은 순서 유지

---

## Slide 41 - 먼저 이 일을 매뉴얼로 만들 가치가 있는지 따집니다.
- id: act4-manual-candidate-check
- file: act4-manual-candidate-check.html
- section: Act 4 · 반복 업무 매뉴얼
### 기본 화면 문구
- title: 먼저 이 일을 매뉴얼로 만들 가치가 있는지 따집니다.
- message: 자주 반복되고, 같은 기준이 필요하고, 실수 비용이 큰 일만 매뉴얼 후보입니다.
bullets:
- 자주 반복되는 일
- 같은 기준이 필요한 일
- 실수 비용이 큰 일
### 템플릿 화면 슬롯
- headline: 먼저 이 일을 매뉴얼로 만들 가치가 있는지 따집니다.
- message: 자주 반복되고, 같은 기준이 필요하고, 실수 비용이 큰 일만 매뉴얼 후보입니다.
- criteria:
  - [object Object]
- passLabel: PASS
- holdLabel: HOLD
### 시각자료 의미
- visual intent: 먼저 이 일을 매뉴얼로 만들 가치가 있는지 따집니다. 장면을 설명하는 hand-drawn minimal teaching asset
- asset teaching role: 어떤 반복 업무를 매뉴얼로 만들지 판단하는 기준을 설명한다.
- asset explanation anchors: 자주 반복, 같은 기준, 실수 비용, 매뉴얼 후보

---

## Slide 42 - 매뉴얼 후보가 아니면 지금 업무 지시로 충분합니다.
- id: act4-not-everything-manual
- file: act4-not-everything-manual.html
- section: Act 4 · 반복 업무 매뉴얼
### 기본 화면 문구
- title: 매뉴얼 후보가 아니면 지금 업무 지시로 충분합니다.
- message: 한 번만 할 일이나 기준이 흔들리는 일은 매뉴얼보다 지금 업무 지시로 처리합니다.
bullets:
- 한 번만 할 일
- 기준이 아직 흔들리는 일
- 상황이 매번 다른 일
### 템플릿 화면 슬롯
- headline: 매뉴얼 후보가 아니면 지금 업무 지시로 충분합니다.
- message: 한 번만 할 일이나 기준이 흔들리는 일은 매뉴얼보다 지금 업무 지시로 처리합니다.
- claim: 매뉴얼 후보가 아니면 지금 업무 지시로 충분합니다.
- evidenceAnchors:
  - 한 번만 할 일
  - 기준이 아직 흔들리는 일
  - 상황이 매번 다른 일
- contrastLabel: 추측 대신 증거
### 시각자료 의미
- visual intent: 매뉴얼 후보가 아니면 지금 업무 지시로 충분합니다. 장면을 설명하는 hand-drawn minimal teaching asset
- asset teaching role: 매뉴얼 후보가 아닌 일은 지금 업무 지시로 충분하다는 경계를 설명한다.
- asset explanation anchors: 한 번만 할 일, 기준이 흔들리는 일, 상황이 매번 다른 일, 업무 지시로 충분

---

## Slide 43 - 매뉴얼은 어떤 요청에서 켜고 멈출지 먼저 정합니다.
- id: act4-manual-start-conditions
- file: act4-manual-start-conditions.html
- section: Act 4 · 반복 업무 매뉴얼
### 기본 화면 문구
- title: 매뉴얼은 어떤 요청에서 켜고 멈출지 먼저 정합니다.
- message: 매뉴얼은 언제 켜고, 무엇을 확인하고, 언제 멈출지부터 정해야 합니다.
bullets:
- 켜는 요청
- 필수 재료
- 멈출 조건
### 템플릿 화면 슬롯
- headline: 매뉴얼은 어떤 요청에서 켜고 멈출지 먼저 정합니다.
- message: 매뉴얼은 언제 켜고, 무엇을 확인하고, 언제 멈출지부터 정해야 합니다.
- steps:
  - [object Object]
### 시각자료 의미
- visual intent: 매뉴얼은 어떤 요청에서 켜고 멈출지 먼저 정합니다. 장면을 설명하는 hand-drawn minimal teaching asset
- asset teaching role: Skill 매뉴얼은 어떤 요청에서 켤지, 시작 전 어떤 재료를 확인할지, 무엇이 부족하면 멈출지를 먼저 정해야 함을 설명한다.
- asset explanation anchors: 어떤 요청에서 켤지, 시작 전에 확인할 재료, 무엇이 부족하면 멈출지

---

## Slide 44 - 매뉴얼 본문에는 실행 순서와 결과물 형식을 짧게 씁니다.
- id: act4-short-procedure
- file: act4-short-procedure.html
- section: Act 4 · 반복 업무 매뉴얼
### 기본 화면 문구
- title: 매뉴얼 본문에는 실행 순서와 결과물 형식을 짧게 씁니다.
- message: 본문은 실행 조건, 작업 단계, 점검 기준, 결과물 형식, 기록만 짧게 둡니다.
bullets:
- 확인 조건
- 작업 단계
- 점검 기준
- 결과 형식
- 남길 기록
### 템플릿 화면 슬롯
- headline: 매뉴얼 본문에는 실행 순서와 결과물 형식을 짧게 씁니다.
- message: 본문은 실행 조건, 작업 단계, 점검 기준, 결과물 형식, 기록만 짧게 둡니다.
- steps:
  - [object Object]
### 시각자료 의미
- visual intent: 매뉴얼 본문에는 실행 순서와 결과물 형식을 짧게 씁니다. 장면을 설명하는 hand-drawn minimal teaching asset
- asset teaching role: 매뉴얼 본문에는 실행 순서와 결과물 형식과 남길 기록을 짧게 써야 함을 설명한다.
- asset explanation anchors: 실행 전 확인 조건, 차례대로 할 작업 단계, 중간 점검 기준, 결과물 형식, 남길 기록

---

## Slide 45 - 긴 예시와 판단 기준은 매뉴얼 본문 밖에 둡니다.
- id: act4-manual-supporting-materials
- file: act4-manual-supporting-materials.html
- section: Act 4 · 반복 업무 매뉴얼
### 기본 화면 문구
- title: 긴 예시와 판단 기준은 매뉴얼 본문 밖에 둡니다.
- message: 예시, 체크리스트, 판단 기준표, 실행 재료는 본문 밖에 두고 필요할 때 꺼냅니다.
bullets:
- 예시: 따라 볼 샘플
- 점검: 확인할 목록
- 판단: 기준표
- 재료: 실행 자료
### 템플릿 화면 슬롯
- headline: 긴 예시와 판단 기준은 매뉴얼 본문 밖에 둡니다.
- message: 예시, 체크리스트, 판단 기준표, 실행 재료는 본문 밖에 두고 필요할 때 꺼냅니다.
- rows:
  - [object Object]
### 시각자료 의미
- visual intent: 긴 예시와 판단 기준은 매뉴얼 본문 밖에 둡니다. 장면을 설명하는 hand-drawn minimal teaching asset
- asset teaching role: 긴 예시와 판단 기준을 매뉴얼 본문 밖에 두는 구조를 설명한다.
- asset explanation anchors: 짧은 본문, 예시 자료, 체크리스트, 판단 기준표, 실행 재료

---

## Slide 46 - AI가 읽는 반복 업무 매뉴얼이 Skill입니다.
- id: act4-skill-term-mapping
- file: act4-skill-term-mapping.html
- section: Act 4 · 반복 업무 매뉴얼
### 기본 화면 문구
- title: AI가 읽는 반복 업무 매뉴얼이 Skill입니다.
- message: Skill은 답변 템플릿이 아니라 호출 조건, 짧은 절차, 참고자료, 출력 형식이 있는 재사용 절차입니다.
bullets:
- 업무 매뉴얼
- Skill
- 업무 매뉴얼와 실제 용어 Skill를 함께 보여 줍니다.
### 템플릿 화면 슬롯
- headline: AI가 읽는 반복 업무 매뉴얼이 Skill입니다.
- message: Skill은 답변 템플릿이 아니라 호출 조건, 짧은 절차, 참고자료, 출력 형식이 있는 재사용 절차입니다.
- metaphorTerm: 업무 매뉴얼
- realTerm: Skill
- termLine: 업무 매뉴얼와 실제 용어 Skill를 함께 보여 줍니다.
- supportingLine: Skill은 답변 템플릿이 아니라 호출 조건, 짧은 절차, 참고자료, 출력 형식이 있는 재사용 절차입니다.
### 시각자료 의미
- visual intent: AI가 읽는 반복 업무 매뉴얼이 Skill입니다. 장면을 설명하는 hand-drawn minimal teaching asset
- asset teaching role: 작업별 업무 매뉴얼 비유를 Skill 용어로 연결한다.
- asset explanation anchors: 호출 조건, 짧은 절차, 참고자료, 출력 형식, Skill

---

## Slide 47 - 실습에서는 미니 브레인스토밍 Skill로 구조를 연습합니다.
- id: act4-practice-handoff
- file: act4-practice-handoff.html
- section: Act 4 · 반복 업무 매뉴얼
### 기본 화면 문구
- title: 실습에서는 미니 브레인스토밍 Skill로 구조를 연습합니다.
- message: 실습 화면에서 시작 조건, 절차, 참고 예시, 남길 결과를 가진 Skill을 만듭니다.
bullets:
- Skill이 켜지는 조건
- 실행 전 확인할 질문
- 접근안 비교 순서
- 마지막 결정 기록
### 템플릿 화면 슬롯
- headline: 실습에서는 미니 브레인스토밍 Skill로 구조를 연습합니다.
- message: 실습 화면에서 시작 조건, 절차, 참고 예시, 남길 결과를 가진 Skill을 만듭니다.
- actionList:
  - Skill이 켜지는 조건
  - 실행 전 확인할 질문
  - 접근안 비교 순서
  - 마지막 결정 기록
- imagePolicy: deterministic-kimai-reference-composite-no-generated-character
### 시각자료 의미
- visual intent: Act 4 설명을 닫고 미니 브레인스토밍 Skill 작성 실습으로 넘어가는 전환 장면
- asset teaching role: Act 4 설명을 닫고 미니 브레인스토밍 Skill 작성 실습으로 넘어가는 전환 장면
- asset explanation anchors: 시작 조건, 절차 쓰기, 결과물 정하기

---

## Slide 48 - 매뉴얼이 있어도 역할 판단은 분리해야 합니다.
- id: act4-to-act5-roles
- file: act4-to-act5-roles.html
- section: Act 4 · 반복 업무 매뉴얼
### 기본 화면 문구
- title: 매뉴얼이 있어도 역할 판단은 분리해야 합니다.
- message: Skill이 절차를 안정시켜도 조사, 작성, 검토 판단은 역할별로 나누어야 합니다.
bullets:
- 업무 매뉴얼
- Skill
- 업무 매뉴얼와 실제 용어 Skill를 함께 보여 줍니다.
### 템플릿 화면 슬롯
- headline: 매뉴얼이 있어도 역할 판단은 분리해야 합니다.
- message: Skill이 절차를 안정시켜도 조사, 작성, 검토 판단은 역할별로 나누어야 합니다.
- metaphorTerm: 업무 매뉴얼
- realTerm: Skill
- termLine: 업무 매뉴얼와 실제 용어 Skill를 함께 보여 줍니다.
- supportingLine: Skill은 반복 절차를 안정시키지만, 조사 판단과 구현 판단과 검토 판단을 한 역할이 모두 맡으면 여전히 섞일 수.
### 시각자료 의미
- visual intent: 매뉴얼이 있어도 역할 판단은 분리해야 합니다. 장면을 설명하는 hand-drawn minimal teaching asset
- asset teaching role: 매뉴얼 이후에도 역할 판단 분리가 필요함을 설명한다.
- asset explanation anchors: 조사 판단, 구현 판단, 검토 판단, 역할 분리

---

## Slide 49 - 김아이에게 매뉴얼을 줘도 모든 일을 혼자 맡기면 헷갈립니다.
- id: act5-kimai-does-everything
- file: act5-kimai-does-everything.html
- section: Act 5 · 역할 분리와 도구 권한
### 기본 화면 문구
- title: 김아이에게 매뉴얼을 줘도 모든 일을 혼자 맡기면 헷갈립니다.
- message: 매뉴얼이 있어도 김아이 한 명에게 자료 찾기, 결과물 만들기, 제출 전 확인을 모두 맡기면 판단이 섞입니다.
bullets:
- 자료 찾기
- 결과물 만들기
- 제출 전 확인
### 템플릿 화면 슬롯
- headline: 김아이에게 매뉴얼을 줘도 모든 일을 혼자 맡기면 헷갈립니다.
- message: 매뉴얼이 있어도 김아이 한 명에게 자료 찾기, 결과물 만들기, 제출 전 확인을 모두 맡기면 판단이 섞입니다.
- heroLine: 김아이에게 매뉴얼을 줘도 모든 일을 혼자 맡기면 헷갈립니다.
- promiseBullets:
  - 자료 찾기
  - 결과물 만들기
  - 제출 전 확인
### 시각자료 의미
- visual intent: 김아이에게 매뉴얼을 줘도 모든 일을 혼자 맡기면 헷갈립니다. 장면을 설명하는 hand-drawn minimal teaching asset
- asset teaching role: 김아이 혼자 자료 찾기, 결과물 만들기, 제출 전 확인을 맡으면 헷갈리는 문제를 설명한다.
- asset explanation anchors: 김아이, 자료 찾기, 결과물 만들기, 제출 전 확인, 헷갈림

---

## Slide 50 - 회사에서는 한 사람이 모든 결재를 혼자 하지 않습니다.
- id: act5-company-approval-roles
- file: act5-company-approval-roles.html
- section: Act 5 · 역할 분리와 도구 권한
### 기본 화면 문구
- title: 회사에서는 한 사람이 모든 결재를 혼자 하지 않습니다.
- message: 회사에서는 일을 맡은 담당자, 검토자, 승인자가 나뉘고 AI 업무도 같은 방식으로 책임을 나눌 수 있습니다.
bullets:
- 담당자
- 검토자
- 승인자
### 템플릿 화면 슬롯
- headline: 회사에서는 한 사람이 모든 결재를 혼자 하지 않습니다.
- message: 회사에서는 일을 맡은 담당자, 검토자, 승인자가 나뉘고 AI 업무도 같은 방식으로 책임을 나눌 수 있습니다.
- imageAnchors:
  - 담당자
  - 검토자
  - 승인자
- callout: 담당자
### 시각자료 의미
- visual intent: 회사에서는 한 사람이 모든 결재를 혼자 하지 않습니다. 장면을 설명하는 hand-drawn minimal teaching asset
- asset teaching role: 회사에서는 담당자, 검토자, 승인자가 나뉜다는 비유를 설명한다.
- asset explanation anchors: 담당자, 검토자, 승인자, 회사 결재 흐름

---

## Slide 51 - 해야 할 일이 많아지면 다른 신입사원을 데려옵니다.
- id: act5-new-hires-team
- file: act5-new-hires-team.html
- section: Act 5 · 역할 분리와 도구 권한
### 기본 화면 문구
- title: 해야 할 일이 많아지면 다른 신입사원을 데려옵니다.
- message: 핵심은 사람 수가 아니라 조사, 작성, 검토의 책임 자리를 나누는 것입니다.
bullets:
- 김아이
- 최아이
- 박아이
### 템플릿 화면 슬롯
- headline: 해야 할 일이 많아지면 다른 신입사원을 데려옵니다.
- message: 핵심은 사람 수가 아니라 조사, 작성, 검토의 책임 자리를 나누는 것입니다.
- imageAnchors:
  - 김아이
  - 최아이
  - 박아이
- callout: 김아이
### 시각자료 의미
- visual intent: 해야 할 일이 많아지면 다른 신입사원을 데려옵니다. 장면을 설명하는 hand-drawn minimal teaching asset
- asset teaching role: 일이 많아지면 김아이, 최아이, 박아이로 책임 자리를 나누는 장면을 설명한다.
- asset explanation anchors: 김아이, 최아이, 박아이, 역할 자리표

---

## Slide 52 - 김아이는 근거를 찾고 모르는 것을 표시합니다.
- id: act5-kimai-research-role
- file: act5-kimai-research-role.html
- section: Act 5 · 역할 분리와 도구 권한
### 기본 화면 문구
- title: 김아이는 근거를 찾고 모르는 것을 표시합니다.
- message: 김아이는 조사 역할을 맡아 자료를 찾고, 출처를 남기고, 모르는 것은 모른다고 표시합니다.
bullets:
- 자료 찾기
- 출처 남기기
- 모르는 것 표시
### 템플릿 화면 슬롯
- headline: 김아이는 근거를 찾고 모르는 것을 표시합니다.
- message: 김아이는 조사 역할을 맡아 자료를 찾고, 출처를 남기고, 모르는 것은 모른다고 표시합니다.
- imageAnchors:
  - 자료 찾기
  - 출처 남기기
  - 모르는 것 표시
- callout: 자료 찾기
### 시각자료 의미
- visual intent: 김아이는 근거를 찾고 모르는 것을 표시합니다. 장면을 설명하는 hand-drawn minimal teaching asset
- asset teaching role: 김아이가 조사 역할로 근거를 찾고 모르는 것을 표시함을 설명한다.
- asset explanation anchors: 김아이, 자료 찾기, 출처 남기기, 모르는 것 표시

---

## Slide 53 - 최아이는 정해진 지시와 자료로 결과물을 만듭니다.
- id: act5-choi-writing-role
- file: act5-choi-writing-role.html
- section: Act 5 · 역할 분리와 도구 권한
### 기본 화면 문구
- title: 최아이는 정해진 지시와 자료로 결과물을 만듭니다.
- message: 최아이는 작성 역할을 맡아 정해진 지시와 자료 안에서 보고서 초안을 만듭니다.
bullets:
- 지시서 보기
- 정해진 자료 사용
- 보고서 초안 작성
### 템플릿 화면 슬롯
- headline: 최아이는 정해진 지시와 자료로 결과물을 만듭니다.
- message: 최아이는 작성 역할을 맡아 정해진 지시와 자료 안에서 보고서 초안을 만듭니다.
- imageAnchors:
  - 지시서 보기
  - 정해진 자료 사용
  - 보고서 초안 작성
- callout: 지시서 보기
### 시각자료 의미
- visual intent: 최아이는 정해진 지시와 자료로 결과물을 만듭니다. 장면을 설명하는 hand-drawn minimal teaching asset
- asset teaching role: 최아이가 작성 역할로 정해진 지시와 자료 안에서 결과물을 만듦을 설명한다.
- asset explanation anchors: 최아이, 지시서, 정해진 자료, 보고서 초안

---

## Slide 54 - 박아이는 제출 기준에 맞는지 확인합니다.
- id: act5-park-review-role
- file: act5-park-review-role.html
- section: Act 5 · 역할 분리와 도구 권한
### 기본 화면 문구
- title: 박아이는 제출 기준에 맞는지 확인합니다.
- message: 박아이는 검토 역할을 맡아 결과물이 제출 기준표에 맞는지 확인하고 보류 또는 통과를 표시합니다.
bullets:
- 기준표 대조
- 빠진 항목 찾기
- 보류 또는 통과 표시
### 템플릿 화면 슬롯
- headline: 박아이는 제출 기준에 맞는지 확인합니다.
- message: 박아이는 검토 역할을 맡아 결과물이 제출 기준표에 맞는지 확인하고 보류 또는 통과를 표시합니다.
- criteria:
  - [object Object]
- passLabel: PASS
- holdLabel: HOLD
### 시각자료 의미
- visual intent: 박아이는 제출 기준에 맞는지 확인합니다. 장면을 설명하는 hand-drawn minimal teaching asset
- asset teaching role: 박아이가 검토 역할로 제출 기준에 맞는지 확인함을 설명한다.
- asset explanation anchors: 박아이, 기준표 대조, 빠진 항목, 보류 또는 통과

---

## Slide 55 - 이런 역할 김아이를 Agent 또는 Subagent라고 부릅니다.
- id: act5-agent-term-mapping
- file: act5-agent-term-mapping.html
- section: Act 5 · 역할 분리와 도구 권한
### 기본 화면 문구
- title: 이런 역할 김아이를 Agent 또는 Subagent라고 부릅니다.
- message: 역할을 나눠 맡은 작업 단위를 Agent 또는 Subagent라고 부릅니다.
bullets:
- 역할 카드
- Agent / Subagent
- 역할 카드와 실제 용어 Agent / Subagent를 함께 보여 줍니다.
### 템플릿 화면 슬롯
- headline: 이런 역할 김아이를 Agent 또는 Subagent라고 부릅니다.
- message: 역할을 나눠 맡은 작업 단위를 Agent 또는 Subagent라고 부릅니다.
- metaphorTerm: 역할 카드
- realTerm: Agent / Subagent
- termLine: 역할 카드와 실제 용어 Agent / Subagent를 함께 보여 줍니다.
- supportingLine: 역할을 나눠 맡은 김아이, 최아이, 박아이 같은 작업 단위를 Agent 또는 Subagent라고 부릅니다.
### 시각자료 의미
- visual intent: 이런 역할 김아이를 Agent 또는 Subagent라고 부릅니다. 장면을 설명하는 hand-drawn minimal teaching asset
- asset teaching role: 역할 신입사원 비유를 Agent/Subagent 용어로 연결한다.
- asset explanation anchors: 역할 김아이, Agent, Subagent, 역할 지시문, 따로 보는 자료

---

## Slide 56 - 각 신입사원은 자기 자리의 매뉴얼(Skill)만 봅니다.
- id: act5-new-hire-skill-assignment
- file: act5-new-hire-skill-assignment.html
- section: Act 5 · 역할 분리와 도구 권한
### 기본 화면 문구
- title: 각 신입사원은 자기 자리의 매뉴얼(Skill)만 봅니다.
- message: 모든 신입사원이 같은 매뉴얼을 보는 것이 아니라, 맡은 자리마다 필요한 매뉴얼(Skill)이 다릅니다.
bullets:
- 조사 매뉴얼(Skill)
- 작성 매뉴얼(Skill)
- 검토 매뉴얼(Skill)
### 템플릿 화면 슬롯
- headline: 각 신입사원은 자기 자리의 매뉴얼(Skill)만 봅니다.
- message: 모든 신입사원이 같은 매뉴얼을 보는 것이 아니라, 맡은 자리마다 필요한 매뉴얼(Skill)이 다릅니다.
- imageAnchors:
  - 조사 매뉴얼(Skill)
  - 작성 매뉴얼(Skill)
  - 검토 매뉴얼(Skill)
- callout: 조사 매뉴얼(Skill)
### 시각자료 의미
- visual intent: 각 신입사원은 자기 자리의 매뉴얼(Skill)만 봅니다. 장면을 설명하는 hand-drawn minimal teaching asset
- asset teaching role: 각 신입사원이 자기 자리의 매뉴얼(Skill)만 보는 구조를 설명한다.
- asset explanation anchors: 조사 매뉴얼(Skill), 작성 매뉴얼(Skill), 검토 매뉴얼(Skill), 각 신입사원

---

## Slide 57 - 보안 권한과 접근 구역도 맡은 일에 맞게 줍니다.
- id: act5-security-permissions
- file: act5-security-permissions.html
- section: Act 5 · 역할 분리와 도구 권한
### 기본 화면 문구
- title: 보안 권한과 접근 구역도 맡은 일에 맞게 줍니다.
- message: 모든 열쇠를 주지 않고 맡은 일에 필요한 권한과 접근 구역만 줍니다.
bullets:
- 도구 열쇠
- MCP
- 도구 열쇠와 실제 용어 MCP를 함께 보여 줍니다.
### 템플릿 화면 슬롯
- headline: 보안 권한과 접근 구역도 맡은 일에 맞게 줍니다.
- message: 모든 열쇠를 주지 않고 맡은 일에 필요한 권한과 접근 구역만 줍니다.
- metaphorTerm: 도구 열쇠
- realTerm: MCP
- termLine: 도구 열쇠와 실제 용어 MCP를 함께 보여 줍니다.
- supportingLine: 모든 신입사원에게 모든 열쇠를 주지 않고, 맡은 일에 맞는 권한과 접근 구역만 줍니다.
### 시각자료 의미
- visual intent: 보안 권한과 접근 구역도 맡은 일에 맞게 줍니다. 장면을 설명하는 hand-drawn minimal teaching asset
- asset teaching role: 보안 권한과 접근 구역을 맡은 일에 맞게 주는 Tool Permission 개념을 설명한다.
- asset explanation anchors: 자료 열람 권한, 문서 작성 권한, 실행/검증 권한, 접근 가능한 구역

---

## Slide 58 - MCP는 협력사에 요청을 보내는 공식 창구입니다.
- id: act5-mcp-partner-window
- file: act5-mcp-partner-window.html
- section: Act 5 · 역할 분리와 도구 권한
### 기본 화면 문구
- title: MCP는 협력사에 요청을 보내는 공식 창구입니다.
- message: 외부 자료나 외부 도구가 필요할 때 허가된 공식 창구를 통해 요청하고 기록을 남기는 통로가 MCP입니다.
bullets:
- 외부 자료 요청
- 외부 도구 요청
- 허가된 통로
### 템플릿 화면 슬롯
- headline: MCP는 협력사에 요청을 보내는 공식 창구입니다.
- message: 외부 자료나 외부 도구가 필요할 때 허가된 공식 창구를 통해 요청하고 기록을 남기는 통로가 MCP입니다.
- imageAnchors:
  - 외부 자료 요청
  - 외부 도구 요청
  - 허가된 통로
- callout: 외부 자료 요청
### 시각자료 의미
- visual intent: MCP는 협력사에 요청을 보내는 공식 창구입니다. 장면을 설명하는 hand-drawn minimal teaching asset
- asset teaching role: MCP를 협력사에 요청을 보내는 공식 창구로 설명한다.
- asset explanation anchors: 협력사 공식 창구, 외부 자료 요청, 외부 도구 요청, 허가된 통로, 요청 기록

---

## Slide 59 - 실습에서는 에이전트 팀을 구현해 봅니다.
- id: act5-practice-handoff
- file: act5-practice-handoff.html
- section: Act 5 · 역할 분리와 도구 권한
### 기본 화면 문구
- title: 실습에서는 에이전트 팀을 구현해 봅니다.
- message: 로컬 실행형 실습에서 역할 지시문, 매뉴얼(Skill), 권한, 실행 기록을 연결해 에이전트 팀을 구현해 봅니다.
bullets:
- 김아이 역할
- 최아이 역할
- 박아이 역할
- 실행 기록
### 템플릿 화면 슬롯
- headline: 실습에서는 에이전트 팀을 구현해 봅니다.
- message: 로컬 실행형 실습에서 역할 지시문, 매뉴얼(Skill), 권한, 실행 기록을 연결해 에이전트 팀을 구현해 봅니다.
- actionList:
  - 김아이 역할
  - 최아이 역할
  - 박아이 역할
  - 실행 기록
- imagePolicy: deterministic-kimai-reference-composite-no-generated-character
### 시각자료 의미
- visual intent: Act 5 설명을 닫고 에이전트 팀 구성 실습으로 넘어가는 전환 장면
- asset teaching role: Act 5 설명을 닫고 에이전트 팀 구성 실습으로 넘어가는 전환 장면
- asset explanation anchors: 조사, 작성, 검토

---

## Slide 60 - 팀이 작업을 끝냈어도 제출 전 확인은 필요합니다.
- id: act5-team-to-act6-checkpoint
- file: act5-team-to-act6-checkpoint.html
- section: Act 5 · 역할 분리와 도구 권한
### 기본 화면 문구
- title: 팀이 작업을 끝냈어도 제출 전 확인은 필요합니다.
- message: 역할과 권한 분리는 판단 섞임을 줄이지만, 팀이 끝냈다고 말해도 제출 전 확인은 별도로 필요합니다.
bullets:
- 검문소 스위치
- Hook
- 검문소 스위치와 실제 용어 Hook를 함께 보여 줍니다.
### 템플릿 화면 슬롯
- headline: 팀이 작업을 끝냈어도 제출 전 확인은 필요합니다.
- message: 역할과 권한 분리는 판단 섞임을 줄이지만, 팀이 끝냈다고 말해도 제출 전 확인은 별도로 필요합니다.
- metaphorTerm: 검문소 스위치
- realTerm: Hook
- termLine: 검문소 스위치와 실제 용어 Hook를 함께 보여 줍니다.
- supportingLine: 역할과 권한 분리는 판단 섞임을 줄이지만, 팀이 끝냈다고 말해도 제출 전 확인은 별도로 필요합니다.
### 시각자료 의미
- visual intent: 팀이 작업을 끝냈어도 제출 전 확인은 필요합니다. 장면을 설명하는 hand-drawn minimal teaching asset
- asset teaching role: 에이전트 팀 완료 후에도 제출 전 확인이 필요하다는 Act 6 브릿지를 설명한다.
- asset explanation anchors: 역할별 결과, 완료 보고, 제출 전 증거, 검문소

---

## Slide 61 - 팀장에게 결과물을 제출하기 전에는 필수검증을 거칩니다.
- id: act6-required-pre-submit-check
- file: act6-required-pre-submit-check.html
- section: Act 6 · 검증과 하네스 구조
### 기본 화면 문구
- title: 팀장에게 결과물을 제출하기 전에는 필수검증을 거칩니다.
- message: 결과물을 제출하기 전에는 빠진 항목과 기준 충족 여부를 먼저 확인합니다.
bullets:
- 품질검문소
- Quality Gate
- 품질검문소와 실제 용어 Quality Gate를 함께 보여 줍니다.
### 템플릿 화면 슬롯
- headline: 팀장에게 결과물을 제출하기 전에는 필수검증을 거칩니다.
- message: 결과물을 제출하기 전에는 빠진 항목과 기준 충족 여부를 먼저 확인합니다.
- metaphorTerm: 품질검문소
- realTerm: Quality Gate
- termLine: 품질검문소와 실제 용어 Quality Gate를 함께 보여 줍니다.
- supportingLine: 김아이 팀이 결과물을 만들었어도 팀장에게 바로 제출하지 않고, 빠진 항목과 기준 충족 여부를 확인하는 필수검증.
### 시각자료 의미
- visual intent: 팀장에게 결과물을 제출하기 전에는 필수검증을 거칩니다. 장면을 설명하는 hand-drawn minimal teaching asset
- asset teaching role: 팀장에게 결과물을 제출하기 전 필수검증을 거치는 장면을 설명한다.
- asset explanation anchors: 제출 전 확인, 빠진 항목 확인, 통과 또는 보류, 팀장 제출 전

---

## Slide 62 - 검증이 없으면 “끝냈습니다”라는 말만 남습니다.
- id: act6-completion-claim-no-evidence
- file: act6-completion-claim-no-evidence.html
- section: Act 6 · 검증과 하네스 구조
### 기본 화면 문구
- title: 검증이 없으면 “끝냈습니다”라는 말만 남습니다.
- message: 완료 보고는 품질 증거가 아니며, 검증 과정이 없으면 실제로 무엇을 했는지 확인할 방법이 없습니다.
bullets:
- 완료 보고
- 확인 없음
- 빈 증거
### 템플릿 화면 슬롯
- headline: 검증이 없으면 “끝냈습니다”라는 말만 남습니다.
- message: 완료 보고는 품질 증거가 아니며, 검증 과정이 없으면 실제로 무엇을 했는지 확인할 방법이 없습니다.
- claim: 검증이 없으면 “끝냈습니다”라는 말만 남습니다.
- evidenceAnchors:
  - 완료 보고
  - 확인 없음
  - 빈 증거
- contrastLabel: 추측 대신 증거
### 시각자료 의미
- visual intent: 검증이 없으면 “끝냈습니다”라는 말만 남습니다. 장면을 설명하는 hand-drawn minimal teaching asset
- asset teaching role: 검증이 없으면 끝냈다는 완료 보고만 남는 문제를 설명한다.
- asset explanation anchors: 완료 보고, 확인 없음, 빈 증거, 김아이

---

## Slide 63 - 품질검문소는 완료 보고 대신 증거를 봅니다.
- id: act6-quality-gate-evidence-over-claim
- file: act6-quality-gate-evidence-over-claim.html
- section: Act 6 · 검증과 하네스 구조
### 기본 화면 문구
- title: 품질검문소는 완료 보고 대신 증거를 봅니다.
- message: 품질검문소는 완료 보고가 아니라 작업 기록, 기준 대조, 남은 위험이라는 세 가지 증거를 봅니다.
bullets:
- 작업 기록
- 기준 대조
- 남은 위험
### 템플릿 화면 슬롯
- headline: 품질검문소는 완료 보고 대신 증거를 봅니다.
- message: 품질검문소는 완료 보고가 아니라 작업 기록, 기준 대조, 남은 위험이라는 세 가지 증거를 봅니다.
- criteria:
  - [object Object]
- passLabel: PASS
- holdLabel: HOLD
### 시각자료 의미
- visual intent: 품질검문소는 완료 보고 대신 증거를 봅니다. 장면을 설명하는 hand-drawn minimal teaching asset
- asset teaching role: 품질검문소가 완료 보고 대신 작업 기록, 기준 대조, 남은 위험을 본다는 점을 설명한다.
- asset explanation anchors: 품질검문소, 작업 기록, 기준 대조, 남은 위험

---

## Slide 64 - 검증하려면 김아이가 작업 기록을 남겨야 합니다.
- id: act6-work-log-evidence
- file: act6-work-log-evidence.html
- section: Act 6 · 검증과 하네스 구조
### 기본 화면 문구
- title: 검증하려면 김아이가 작업 기록을 남겨야 합니다.
- message: 작업 기록이 있어야 검문소가 실제 작업 여부를 확인할 수 있고, 김아이도 체크리스트처럼 더 명확하게 일합니다.
bullets:
- 작업: 무엇을 했는지
- 순서: 어떤 과정인지
- 증거: 무엇이 남았는지
- 결과: 어디서 볼지
### 템플릿 화면 슬롯
- headline: 검증하려면 김아이가 작업 기록을 남겨야 합니다.
- message: 작업 기록이 있어야 검문소가 실제 작업 여부를 확인할 수 있고, 김아이도 체크리스트처럼 더 명확하게 일합니다.
- rows:
  - [object Object]
### 시각자료 의미
- visual intent: 검증하려면 김아이가 작업 기록을 남겨야 합니다. 장면을 설명하는 hand-drawn minimal teaching asset
- asset teaching role: 검증을 위해 김아이가 작업 기록을 남겨야 함을 설명한다.
- asset explanation anchors: 무엇을 했는지, 어떤 순서로 했는지, 어떤 증거가 남았는지

---

## Slide 65 - 검증은 처음 목표와 제출 기준에 맞는지 대조합니다.
- id: act6-goal-rubric-check
- file: act6-goal-rubric-check.html
- section: Act 6 · 검증과 하네스 구조
### 기본 화면 문구
- title: 검증은 처음 목표와 제출 기준에 맞는지 대조합니다.
- message: 만들었다는 사실과 목표에 맞는다는 사실은 다르므로 처음 목표와 제출 기준에 맞는지 다시 대조합니다.
bullets:
- 목표: 처음 요청
- 기준: 제출 조건
- 누락: 빠진 항목
- 판정: 통과/보류
### 템플릿 화면 슬롯
- headline: 검증은 처음 목표와 제출 기준에 맞는지 대조합니다.
- message: 만들었다는 사실과 목표에 맞는다는 사실은 다르므로 처음 목표와 제출 기준에 맞는지 다시 대조합니다.
- rows:
  - [object Object]
### 시각자료 의미
- visual intent: 검증은 처음 목표와 제출 기준에 맞는지 대조합니다. 장면을 설명하는 hand-drawn minimal teaching asset
- asset teaching role: 처음 목표와 제출 기준에 맞는지 대조하는 Evaluation Criteria를 설명한다.
- asset explanation anchors: 처음 목표, 제출 기준, 빠진 항목, 기준표

---

## Slide 66 - 남은 위험을 숨기지 않아야 다음 조치를 정할 수 있습니다.
- id: act6-risk-handoff-note
- file: act6-risk-handoff-note.html
- section: Act 6 · 검증과 하네스 구조
### 기본 화면 문구
- title: 남은 위험을 숨기지 않아야 다음 조치를 정할 수 있습니다.
- message: 통과가 아니면 못 한 확인, 남은 위험, 다음 조치를 남겨야 다음 사람이 이어받을 수 있습니다.
bullets:
- 못 한 확인
- 남은 위험
- 다음 조치
### 템플릿 화면 슬롯
- headline: 남은 위험을 숨기지 않아야 다음 조치를 정할 수 있습니다.
- message: 통과가 아니면 못 한 확인, 남은 위험, 다음 조치를 남겨야 다음 사람이 이어받을 수 있습니다.
- claim: 남은 위험을 숨기지 않아야 다음 조치를 정할 수 있습니다.
- evidenceAnchors:
  - 못 한 확인
  - 남은 위험
  - 다음 조치
- contrastLabel: 추측 대신 증거
### 시각자료 의미
- visual intent: 남은 위험을 숨기지 않아야 다음 조치를 정할 수 있습니다. 장면을 설명하는 hand-drawn minimal teaching asset
- asset teaching role: 남은 위험과 다음 조치를 인수인계 기록으로 남겨야 함을 설명한다.
- asset explanation anchors: 못 한 확인, 남은 위험, 다음 조치, 인수인계 기록

---

## Slide 67 - 완료 직전에 품질검문소를 켜는 장치가 Stop Hook입니다.
- id: act6-stop-hook-quality-gate
- file: act6-stop-hook-quality-gate.html
- section: Act 6 · 검증과 하네스 구조
### 기본 화면 문구
- title: 완료 직전에 품질검문소를 켜는 장치가 Stop Hook입니다.
- message: Stop Hook은 김아이가 멈추거나 완료하려는 순간 품질검문소를 자동으로 켜는 장치입니다.
bullets:
- 완료 직전
- 자동 실행
- Stop Hook
### 템플릿 화면 슬롯
- headline: 완료 직전에 품질검문소를 켜는 장치가 Stop Hook입니다.
- message: Stop Hook은 김아이가 멈추거나 완료하려는 순간 품질검문소를 자동으로 켜는 장치입니다.
- imageAnchors:
  - 완료 직전
  - 자동 실행
  - Stop Hook
- callout: 완료 직전
### 시각자료 의미
- visual intent: 완료 직전에 품질검문소를 켜는 장치가 Stop Hook입니다. 장면을 설명하는 hand-drawn minimal teaching asset
- asset teaching role: 완료 직전에 품질검문소를 켜는 Stop Hook을 설명한다.
- asset explanation anchors: 완료 직전, 자동 실행, Stop Hook, 품질검문소

---

## Slide 68 - 통과와 보류를 가르는 기준이 Evaluation입니다.
- id: act6-evaluation-pass-hold
- file: act6-evaluation-pass-hold.html
- section: Act 6 · 검증과 하네스 구조
### 기본 화면 문구
- title: 통과와 보류를 가르는 기준이 Evaluation입니다.
- message: Evaluation은 단순 점수표가 아니라 무엇을 통과로 볼지 정하는 기준과 판정 과정입니다.
bullets:
- 판정 기준
- Evaluation
- 판정 기준와 실제 용어 Evaluation를 함께 보여 줍니다.
### 템플릿 화면 슬롯
- headline: 통과와 보류를 가르는 기준이 Evaluation입니다.
- message: Evaluation은 단순 점수표가 아니라 무엇을 통과로 볼지 정하는 기준과 판정 과정입니다.
- metaphorTerm: 판정 기준
- realTerm: Evaluation
- termLine: 판정 기준와 실제 용어 Evaluation를 함께 보여 줍니다.
- supportingLine: Evaluation은 단순 점수표가 아니라 무엇을 통과로 볼지 정하는 기준과 판정 과정입니다.
### 시각자료 의미
- visual intent: 통과와 보류를 가르는 기준이 Evaluation입니다. 장면을 설명하는 hand-drawn minimal teaching asset
- asset teaching role: Evaluation이 통과와 보류를 가르는 기준임을 설명한다.
- asset explanation anchors: 기준표, AI 판정관, 통과 기준, 통과 또는 보류

---

## Slide 69 - 검문소에는 지금 상태를 적는 상태표가 필요합니다.
- id: act6-state-status-file
- file: act6-state-status-file.html
- section: Act 6 · 검증과 하네스 구조
### 기본 화면 문구
- title: 검문소에는 지금 상태를 적는 상태표가 필요합니다.
- message: 상태표가 있어야 처리 중, 완료, 실패, 재시도 횟수를 구분할 수 있습니다.
bullets:
- 상태표
- State
- 상태표와 실제 용어 State를 함께 보여 줍니다.
### 템플릿 화면 슬롯
- headline: 검문소에는 지금 상태를 적는 상태표가 필요합니다.
- message: 상태표가 있어야 처리 중, 완료, 실패, 재시도 횟수를 구분할 수 있습니다.
- metaphorTerm: 상태표
- realTerm: State
- termLine: 상태표와 실제 용어 State를 함께 보여 줍니다.
- supportingLine: 상태표가 있어야 처리 중인지, 완료됐는지, 몇 번 시도했는지 알고 실패와 완료를 구분할 수 있습니다.
### 시각자료 의미
- visual intent: 검문소에는 지금 상태를 적는 상태표가 필요합니다. 장면을 설명하는 hand-drawn minimal teaching asset
- asset teaching role: 검문소에 처리 상태를 적는 상태표가 필요함을 설명한다.
- asset explanation anchors: 처리 중, 완료, 시도 횟수, 상태표

---

## Slide 70 - 재검토 규칙이 없으면 일이 끝없이 되돌아갑니다.
- id: act6-loop-control-recheck
- file: act6-loop-control-recheck.html
- section: Act 6 · 검증과 하네스 구조
### 기본 화면 문구
- title: 재검토 규칙이 없으면 일이 끝없이 되돌아갑니다.
- message: 재검토에는 다시 볼 조건, 최대 시도, 멈출 조건이 함께 있어야 무한 반복을 막을 수 있습니다.
bullets:
- 다시 볼 조건
- 최대 시도
- 멈출 조건
### 템플릿 화면 슬롯
- headline: 재검토 규칙이 없으면 일이 끝없이 되돌아갑니다.
- message: 재검토에는 다시 볼 조건, 최대 시도, 멈출 조건이 함께 있어야 무한 반복을 막을 수 있습니다.
- criteria:
  - [object Object]
- passLabel: PASS
- holdLabel: HOLD
### 시각자료 의미
- visual intent: 재검토 규칙이 없으면 일이 끝없이 되돌아갑니다. 장면을 설명하는 hand-drawn minimal teaching asset
- asset teaching role: 재검토 규칙과 재시도 제한으로 무한 반복을 막는 구조를 설명한다.
- asset explanation anchors: 다시 볼 조건, 최대 시도, 멈출 조건, 재검토 규칙

---

## Slide 71 - 실습에서는 제출 전 Stop Hook 검문소를 설계합니다.
- id: act6-practice-handoff
- file: act6-practice-handoff.html
- section: Act 6 · 검증과 하네스 구조
### 기본 화면 문구
- title: 실습에서는 제출 전 Stop Hook 검문소를 설계합니다.
- message: 실습은 점수판을 보는 것이 아니라 완료 직전 검문소가 언제 켜지고, 무엇을 보고, 언제 멈출지 설계하는 일입니다.
bullets:
- 언제 켤지
- 어떤 증거를 볼지
- 언제 멈출지
### 템플릿 화면 슬롯
- headline: 실습에서는 제출 전 Stop Hook 검문소를 설계합니다.
- message: 실습은 점수판을 보는 것이 아니라 완료 직전 검문소가 언제 켜지고, 무엇을 보고, 언제 멈출지 설계하는 일입니다.
- actionList:
  - 언제 켤지
  - 어떤 증거를 볼지
  - 언제 멈출지
- imagePolicy: deterministic-kimai-reference-composite-no-generated-character
### 시각자료 의미
- visual intent: Act 6 설명을 닫고 제출 전 Stop Hook 검문소 실습으로 넘어가는 전환 장면
- asset teaching role: Act 6 설명을 닫고 제출 전 Stop Hook 검문소 실습으로 넘어가는 전환 장면
- asset explanation anchors: 목표 확인, 증거 남기기, 보류 기준

---

## Slide 72 - 검문소 설계가 통과되면 생성 프롬프트와 예제 구조가 열립니다.
- id: act6-unlock-structure
- file: act6-unlock-structure.html
- section: Act 6 · 검증과 하네스 구조
### 기본 화면 문구
- title: 검문소 설계가 통과되면 생성 프롬프트와 예제 구조가 열립니다.
- message: Act 6은 실제 Stop Hook을 만들 프롬프트와 예제 구조를 여는 단계입니다.
bullets:
- 프롬프트
- 설정 예제
- 상태 파일
- 검문소 코드
### 템플릿 화면 슬롯
- headline: 검문소 설계가 통과되면 생성 프롬프트와 예제 구조가 열립니다.
- message: Act 6은 실제 Stop Hook을 만들 프롬프트와 예제 구조를 여는 단계입니다.
- steps:
  - [object Object]
### 시각자료 의미
- visual intent: 검문소 설계가 통과되면 생성 프롬프트와 예제 구조가 열립니다. 장면을 설명하는 hand-drawn minimal teaching asset
- asset teaching role: 검문소 설계 통과 후 Stop Hook 생성 프롬프트와 예제 구조가 열림을 설명한다.
- asset explanation anchors: Stop Hook 생성 프롬프트, settings 예제, status file 예제, stop check 예제, 잠금 해제

---

## Slide 73 - 하네스는 김아이 팀이 흔들려도 돌아오게 만드는 업무 환경입니다.
- id: act6-final-harness-map
- file: act6-final-harness-map.html
- section: Act 6 · 검증과 하네스 구조
### 기본 화면 문구
- title: 하네스는 김아이 팀이 흔들려도 돌아오게 만드는 업무 환경입니다.
- message: 하네스는 좋은 프롬프트 하나가 아니라 김아이 팀이 흔들려도 다시 기준으로 돌아오게 만드는 전체 업무 환경입니다.
bullets:
- 정보 선별
- 업무 지시
- 회사 내규
- 업무 매뉴얼
- 역할과 권한
- 완료 검문소
### 템플릿 화면 슬롯
- headline: 하네스는 김아이 팀이 흔들려도 돌아오게 만드는 업무 환경입니다.
- message: 하네스는 좋은 프롬프트 하나가 아니라 김아이 팀이 흔들려도 다시 기준으로 돌아오게 만드는 전체 업무 환경입니다.
- mapNodes:
  - 정보 선별
  - 업무 지시
  - 회사 내규
  - 업무 매뉴얼
  - 역할과 권한
  - 완료 검문소
### 시각자료 의미
- visual intent: 하네스는 김아이 팀이 흔들려도 돌아오게 만드는 업무 환경입니다. 장면을 설명하는 hand-drawn minimal teaching asset
- asset teaching role: Act 1~6 장치가 김아이 팀 업무 환경으로 연결됨을 정리한다.
- asset explanation anchors: 정보 선별, 업무 지시, 회사 내규, 업무 매뉴얼, 역할과 권한, 완료 검문소

---

## Slide 74 - 내 업무에는 모든 장치가 아니라 가장 자주 흔들리는 세 곳부터 붙입니다.
- id: wrap-personal-harness
- file: wrap-personal-harness.html
- section: Wrap-up · 내 업무에 가져가기
### 기본 화면 문구
- title: 내 업무에는 모든 장치가 아니라 가장 자주 흔들리는 세 곳부터 붙입니다.
- message: 처음부터 6개를 다 하려고 하면 지칩니다. 반복, 위험, 검증 기준으로 내일 바로 적용할 3가지만 고르세요.
bullets:
- 자주 반복되는가
- 실패하면 위험한가
- 검증할 증거가 있는가
### 템플릿 화면 슬롯
- headline: 내 업무에는 모든 장치가 아니라 가장 자주 흔들리는 세 곳부터 붙입니다.
- message: 처음부터 6개를 다 하려고 하면 지칩니다. 반복, 위험, 검증 기준으로 내일 바로 적용할 3가지만 고르세요.
- imageAnchors:
  - 자주 반복되는가
  - 실패하면 위험한가
  - 검증할 증거가 있는가
- callout: 완벽함보다 3개의 안전장치가 먼저입니다.
- evidenceAnchors:
  - 자주 반복되는가
  - 실패하면 위험한가
  - 검증할 증거가 있는가
### 시각자료 의미
- visual intent: Act 1~6의 6가지 하네스 장치가 반복, 위험, 검증 세 필터를 지나 내 업무의 핵심 안전장치 3가지로 좁혀지는 김아이 깔때기 손그림
- asset teaching role: 6가지 하네스 장치 중 내 업무에 먼저 붙일 3가지를 고르는 최종 필터를 설명한다.
- asset explanation anchors: 자주 반복, 실패 위험, 검증 증거, 3개부터

