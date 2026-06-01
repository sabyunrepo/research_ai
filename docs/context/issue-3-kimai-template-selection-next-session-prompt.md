# 이슈 3 김아이 템플릿 작업 새 세션 프롬프트

아래 프롬프트를 `/Users/sabyun/goinfre/research_ai`에서 새 Codex 세션을 열 때 그대로 붙여 넣는다.

```text
작업 위치: /Users/sabyun/goinfre/research_ai

목표:
GitHub issue #3 `Kimai deck: content-aware slide template selection and enrichment pipeline` 작업을 이어서 진행해줘. 김아이 발표자료가 title/message/bullets/footer 구조로 일정하게 보이는 문제를 하네스 레이어에서 개선하는 것이 목표다.

먼저 읽을 것:
1. AGENTS.md
2. deck-harness/AGENTS.md
3. docs/harness/kimai-content/AGENTS.md
4. docs/context/issue-3-kimai-template-selection-context-research-pack.md
5. docs/context/issue-3-kimai-template-selection-raw-source-list.md
6. generated-decks/kimai-workshop-content/slide-spec.json
7. deck-harness/scripts/build-deck-from-spec.js
8. deck-harness/scripts/verify-slide-layout-variety.js
9. deck-harness/scripts/verify-deck-quality.js
10. deck-harness/slide-spec.schema.json

현재 조사 결론:
- 현재 김아이 덱은 기존 layout variety gate는 통과하지만, source contract에 의미 기반 템플릿 메타데이터가 없다.
- generated-decks/kimai-workshop-content/slide-spec.json 76장에는 layoutTemplate, teachingMove, audienceAction, visualMode가 없다.
- 현재 build-deck-from-spec.js는 act opening regex, bullet count, index % n 같은 휴리스틱으로 layoutVariant를 고른다.
- 사용자가 느낀 “일정함”은 단순 레이아웃 개수 부족이 아니라 의미 기반 템플릿 선택 계약 부재로 보는 것이 맞다.

작업 방향:
- 최종 HTML을 직접 손보지 말고 deck-harness/source contract/gate 레이어에서 고쳐라.
- layoutTemplate을 의미 기반 상위 계약으로 두고, 필요하면 layoutVariant는 렌더링 세부값으로 유지한다.
- teachingMove, audienceAction, visualMode 같은 메타데이터를 schema와 build 결과에 반영하는 방식을 검토하고 구현한다.
- template selector/enricher는 index % n 대신 slide의 section, title, message, bullets, visualIntent, glossaryTerms, practice handoff 여부를 사용해야 한다.
- presenter review 또는 assets/slides.js에서 왜 해당 템플릿이 선택됐는지 다음 작업자가 확인할 수 있어야 한다.

우선 구현 후보:
1. deck-harness/slide-spec.schema.json에 의미 메타데이터 필드 추가
2. deck-harness/scripts/build-deck-from-spec.js에서 layoutTemplate/teachingMove/audienceAction/visualMode를 resolve하는 함수 또는 별도 lib 추가
3. generated-decks/kimai-workshop-content/assets/slides.js registry에 의미 메타데이터가 남도록 build 갱신
4. verify-slide-layout-variety.js를 확장하거나 새 semantic verifier를 추가해 template distribution과 연속 반복을 확인
5. practice-handoff는 이미지 강제 금지, glossary 첫 등장은 비유+실제 용어 연결 여부를 확인
6. 필요하면 generated-decks/kimai-workshop-content를 rebuild하되, generated HTML을 직접 편집하지 말 것

주의:
- 사용자가 별도로 요청하지 않으면 lecture-cuts golden output은 건드리지 말 것.
- 실습 UI를 lecture deck 안에 섞지 말 것.
- 기존 AGENTS.md 변경분은 사용자가 만든 것일 수 있으니 되돌리지 말 것.
- 코드 변경과 조사 문서 변경을 섞을 때는 작업 범위를 명확히 보고할 것.

검증 후보:
node deck-harness/scripts/validate-deck-contract.js generated-decks/kimai-workshop-content
node deck-harness/scripts/build-deck-from-spec.js generated-decks/kimai-workshop-content
node deck-harness/scripts/verify-slide-layout-variety.js generated-decks/kimai-workshop-content
node deck-harness/scripts/verify-deck-quality.js generated-decks/kimai-workshop-content

완료 보고에는 다음을 포함:
- 변경한 파일
- layoutTemplate/teachingMove/audienceAction/visualMode가 어디에 남는지
- 기존 “layout variety PASS지만 의미적으로 일정함” 문제가 어떻게 완화됐는지
- 실행한 검증 명령과 결과
- 남은 리스크
```
