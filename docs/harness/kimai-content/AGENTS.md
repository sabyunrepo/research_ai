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
