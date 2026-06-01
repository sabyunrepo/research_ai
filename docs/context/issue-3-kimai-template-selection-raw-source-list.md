# 이슈 3 김아이 템플릿 선택 자료조사 원천 목록

확인일: 2026-05-30

## 로컬 출처

- GitHub issue #3: `Kimai deck: content-aware slide template selection and enrichment pipeline`
  - 확인 명령: `gh issue view 3 --comments --json number,title,state,body,comments,labels,url`
- `deck-harness/AGENTS.md`
  - 생성 덱은 최종 HTML을 직접 고치는 방식이 아니라 하네스 계약과 생성 파이프라인에서 고쳐야 한다는 규칙 확인.
- `docs/harness/kimai-content/AGENTS.md`
  - 김아이 Act 구조, 비유 사전, 정식 소스 문서 역할 확인.
- `generated-decks/kimai-workshop-content/slide-spec.json`
  - 현재 76장 slide spec의 입력 필드와 semantic metadata 부재 확인.
- `generated-decks/kimai-workshop-content/assets/slides.js`
  - 빌드된 registry의 `layoutVariant` 분포 확인.
- `generated-decks/kimai-workshop-content/HANDOFF.md`
  - 현재 덱의 검증/품질 게이트 통과 상태 확인.
- `generated-decks/kimai-workshop-content/quality-gate-report.md`
  - 현재 quality gate PASS 상태 확인.
- `deck-harness/scripts/build-deck-from-spec.js`
  - 현재 `layoutVariant` 선택이 regex, bullet count, `index % n`에 의존함을 확인.
- `deck-harness/scripts/verify-slide-layout-variety.js`
  - 현재 다양성 gate가 variant 분포와 연속 반복만 확인함을 확인.
- `deck-harness/scripts/verify-deck-quality.js`
  - 전체 품질 gate가 semantic template slot을 직접 보지 않음을 확인.
- `deck-harness/slide-spec.schema.json`
  - `layoutTemplate`, `teachingMove`, `audienceAction`, `visualMode` 계약 부재 확인.

## 외부 출처

- Penn State, The Assertion-Evidence Approach, Slide Research: https://www.writing.engr.psu.edu/research.html
  - topic/bullet 중심 슬라이드보다 sentence headline + visual evidence 구조가 학습에 유리하다는 근거.
- Harvard Catalyst, Assertion Evidence Slide Checklist: https://catalyst.harvard.edu/publications-documents/assertion-evidence-slide-checklist/
  - assertion-evidence 슬라이드를 점검하는 실무 checklist 근거.
- Cambridge Core, Mayer, "Principles for Reducing Extraneous Processing in Multimedia Learning": https://www.cambridge.org/core/books/abs/cambridge-handbook-of-multimedia-learning/principles-for-reducing-extraneous-processing-in-multimedia-learning-coherence-signaling-redundancy-spatial-contiguity-and-temporal-contiguity-principles/C98AB3A6CE760DD63C048936EA0B3B44
  - coherence, signaling, redundancy, contiguity 원칙을 QA gate로 옮길 수 있는 근거.
- University of Bath Learning and Teaching Hub, ABC Learning Design overview: https://teachinghub.bath.ac.uk/guide/abc-learning-design-overview/
  - acquisition, discussion, investigation, practice, collaboration, production 같은 학습 활동 분류 근거.
- CAST, Universal Design for Learning: https://www.cast.org/what-we-do/universal-design-for-learning/
  - Engagement, Representation, Action & Expression을 `audienceAction`/`visualMode` 설계 참고로 사용 가능.
- Merrill, First Principles of Instruction: https://www.unthsc.edu/center-for-innovative-learning/wp-content/uploads/sites/35/2017/08/firstprinciplesbymerrill.pdf
  - activation, demonstration, application, integration을 `teachingMove` 후보로 볼 수 있는 근거.
- arXiv, PresentBench: A Fine-Grained Rubric-Based Benchmark for Slide Generation: https://arxiv.org/abs/2603.07244
  - 자동 생성 슬라이드 평가에 세부 binary checklist가 유효하다는 근거.

## 제외하거나 낮은 우선순위로 둔 출처

- 일반적인 발표 디자인 블로그 글은 제외했다. 이슈 #3은 취향 수준의 디자인 조언보다 하네스 계약으로 옮길 수 있는 근거가 더 중요하다.
- Context7/library docs는 사용하지 않았다. 이번 작업은 외부 API 구현이 아니라 로컬 Node 하네스 조사다.
