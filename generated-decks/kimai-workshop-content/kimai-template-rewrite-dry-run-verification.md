목적:
김아이 템플릿 재작성 계획을 실제 원본 덱에 적용하기 전에, 자동화 워크플로우로 투영/빌드/검증 가능한지 확인한다.

원천 문서:
- `generated-decks/kimai-workshop-content/kimai-template-rewrite-plan.json`
- `generated-decks/kimai-workshop-content/slide-spec.json`
- `generated-decks/kimai-workshop-content/asset-pack.json`
- `디자인.md`

수정해야 할 때:
- 템플릿 계획 JSON이 바뀔 때
- `slide-spec` semantic metadata 계약이 바뀔 때
- 템플릿 빌더/검증 게이트가 바뀔 때

수정하면 안 되는 경우:
- 최종 HTML만 손본 변경을 정당화하기 위해 갱신하지 않는다.
- 원본 덱에 실제 반영하지 않은 내용을 적용 완료처럼 기록하지 않는다.

관련 산출물:
- `deck-harness/scripts/apply-template-rewrite-plan.js`
- `generated-decks/kimai-workshop-content/kimai-template-rewrite-dry-run-report.json`

## 판정

Status: PARTIAL PASS / IMAGE GATE FAIL

계획은 자동화 워크플로우에 적용 가능하다. 단, 정확한 템플릿 선택을 원천 계약으로 유지하려면 `slide-spec.json`이 `mainTemplate`을 명시할 수 있어야 하며, 계획 투영 후 `job-manifest.json`의 입력 해시를 갱신해야 한다. 이번 드라이런에서는 이 두 조건을 하네스 레이어에 추가한 뒤 임시 덱에서 검증했다.

이미지 생성/분할 단계는 본 적용 전 재작업이 필요하다. 기존 검증은 PASS였지만, crop edge line 검증을 강화하자 일부 sprite sheet가 패널 경계/인접 패널 선을 포함한 채 잘리는 문제가 드러났다.

## 드라이런 범위

- 원본 덱 경로: `generated-decks/kimai-workshop-content`
- 임시 덱 경로: `.codex/tmp/kimai-template-rewrite-CBdxRk/kimai-workshop-content`
- 원본 `slide-spec.json`: 직접 수정하지 않음
- 임시 `slide-spec.json`: 계획의 `title/message/bullets`, `layoutTemplate`, `teachingMove`, `audienceAction`, `visualMode`, `mainTemplate` 투영
- 이미지 파일: 원본 덱에는 새로 생성하지 않음. 파일럿 이미지는 `.codex/tmp/kimai-image-pilot/act1-visual-sheet-v2.png`에 별도 저장
- generated HTML: 임시 덱에서만 재생성

## 적용 결과

- 적용 슬라이드: 76/76
- 템플릿 변경 슬라이드: 20
- 계획과 빌드 registry의 `mainTemplate` 불일치: 0
- `practice-handoff` 이미지 정책: 6장 모두 `no-image`

템플릿 분포:

```json
{
  "opening-hero": 4,
  "kimai-structure": 13,
  "term-bridge": 21,
  "assertion-scene": 7,
  "workflow-strip": 11,
  "brief-window": 5,
  "decision-gate": 6,
  "practice-handoff": 6,
  "single-concept": 1,
  "recap-map": 2
}
```

## 발견 및 보정

1. 첫 드라이런에서 `job-manifest.json`의 `build-deck.inputHash`가 stale로 실패했다.
   - 원인: 계획 투영으로 임시 `slide-spec.json`이 바뀌었지만 manifest 입력 해시가 예전 값이었다.
   - 보정: `apply-template-rewrite-plan.js`가 `slide-spec.json`을 포함하는 manifest stage의 `inputHash`를 갱신하게 했다.

2. 첫 템플릿 검증에서 glossary 첫 등장 규칙 위반 3건이 잡혔다.
   - `act3-act1-context-recover`: `CLAUDE.md`
   - `act3-claude-md-fit`: `Stale Context`
   - `act3-context-vs-claude-md`: `Rule Overload`
   - 보정: 세 슬라이드를 `term-bridge`로 변경해 회사말 비유와 실제 용어 연결을 먼저 보여 주도록 계획을 수정했다.

3. 이미지 crop 검증 강화 후 기존 sprite sheet 분할 문제가 잡혔다.
   - 기존 `verify-asset-crops.js`는 긴 edge line을 asset별 `maxEdgeLineCoverage`가 있을 때만 검사해 인접 패널 선을 놓쳤다.
   - 보정: 기본 edge line coverage 검사를 추가하고, crop 산정 시 `asset.cropSafety.safeMarginPercent`, `sheetLayout.safeMarginPercent`, `sheetLayout.insetPercent` 중 가장 큰 값을 안전 여백으로 쓰게 했다.
   - 결과: 임시 덱의 crop review가 `68 crops, 24 WARN`으로 바뀌었다. 본 적용 전 해당 source sheet 재생성 또는 개별 asset 교체가 필요하다.

4. Act 1 sprite sheet 파일럿 재생성은 구조 개선 가능성을 확인했지만 그대로 통과하지는 못했다.
   - 생성 파일: `.codex/tmp/kimai-image-pilot/act1-visual-sheet-v2.png`
   - 1536x1024, 3x4 구조는 맞게 생성됐다.
   - `act1-info-baskets`, `act1-context-mapping` 같은 기존 문제 crop은 개선됐다.
   - 일부 crop은 그림 내부 요소가 안전 영역을 넘거나 머리/라벨이 edge에 붙어 `WARN`이 남았다. 따라서 sprite sheet 방식은 재생성 프롬프트와 crop safety를 더 엄격히 반복 검증해야 한다.

## 검증 명령

```sh
node deck-harness/scripts/apply-template-rewrite-plan.js generated-decks/kimai-workshop-content generated-decks/kimai-workshop-content/kimai-template-rewrite-plan.json --dry-run --report generated-decks/kimai-workshop-content/kimai-template-rewrite-dry-run-report.json
node deck-harness/scripts/validate-deck-contract.js --stage=structure .codex/tmp/kimai-template-rewrite-CBdxRk/kimai-workshop-content
node deck-harness/scripts/build-deck-from-spec.js .codex/tmp/kimai-template-rewrite-CBdxRk/kimai-workshop-content
node deck-harness/scripts/verify-slide-layout-variety.js .codex/tmp/kimai-template-rewrite-CBdxRk/kimai-workshop-content
node deck-harness/scripts/verify-template-gallery.js .codex/tmp/kimai-template-rewrite-CBdxRk/kimai-workshop-content
node deck-harness/scripts/run-browser-render-check.js .codex/tmp/kimai-template-rewrite-CBdxRk/kimai-workshop-content --all-slides
node deck-harness/scripts/verify-deck-quality.js .codex/tmp/kimai-template-rewrite-CBdxRk/kimai-workshop-content
node deck-harness/scripts/build-asset-pack.js .codex/tmp/kimai-template-rewrite-CBdxRk/kimai-workshop-content
node deck-harness/scripts/verify-asset-crops.js .codex/tmp/kimai-template-rewrite-CBdxRk/kimai-workshop-content
node deck-harness/scripts/prepare-asset-generation-prompts.js .codex/tmp/kimai-template-rewrite-CBdxRk/kimai-workshop-content --include-review-warnings --limit=40
node deck-harness/scripts/prepare-asset-generation-prompts.js .codex/tmp/kimai-template-rewrite-CBdxRk/kimai-workshop-content --explode-warning-sheets --only-review-warnings
node deck-harness/scripts/explode-warning-crops-to-single-images.js .codex/tmp/kimai-single-image-contract-8Voqy4/kimai-workshop-content
node deck-harness/scripts/prepare-asset-generation-prompts.js .codex/tmp/kimai-single-image-contract-8Voqy4/kimai-workshop-content --only-single-image-first
node deck-harness/scripts/verify-single-image-contract.js .codex/tmp/kimai-single-image-contract-8Voqy4/kimai-workshop-content
node deck-harness/scripts/build-asset-pack.js .codex/tmp/kimai-single-image-contract-8Voqy4/kimai-workshop-content
node deck-harness/scripts/verify-asset-crops.js .codex/tmp/kimai-single-image-contract-8Voqy4/kimai-workshop-content
node scripts/resolve-verification-task.js --task "Kimai template rewrite plan automation dry-run for generated deck"
node scripts/run-verification-orchestrator-loop.js --max-attempts 1 --verify-command "node deck-harness/scripts/validate-deck-contract.js .codex/tmp/kimai-template-rewrite-CBdxRk/kimai-workshop-content && node deck-harness/scripts/verify-slide-layout-variety.js .codex/tmp/kimai-template-rewrite-CBdxRk/kimai-workshop-content && node deck-harness/scripts/verify-template-gallery.js .codex/tmp/kimai-template-rewrite-CBdxRk/kimai-workshop-content && node deck-harness/scripts/verify-deck-quality.js .codex/tmp/kimai-template-rewrite-CBdxRk/kimai-workshop-content"
node scripts/resolve-verification-task.js --task "Kimai image generation and crop split workflow verification for template rewrite dry run"
node scripts/run-verification-orchestrator-loop.js --max-attempts 1 --verify-command "node deck-harness/scripts/build-asset-pack.js .codex/tmp/kimai-template-rewrite-CBdxRk/kimai-workshop-content && node deck-harness/scripts/verify-asset-crops.js .codex/tmp/kimai-template-rewrite-CBdxRk/kimai-workshop-content && node deck-harness/scripts/verify-deck-quality.js .codex/tmp/kimai-template-rewrite-CBdxRk/kimai-workshop-content"
```

## 검증 결과

- `validate-deck-contract --stage=structure`: PASS
- `build-deck-from-spec`: PASS, 76 slides built
- `verify-slide-layout-variety`: PASS
- `verify-template-gallery`: PASS
- plan vs built `assets/slides.js` template parity: PASS
- `run-browser-render-check --all-slides`: PASS, 78 captures
- 이전 기준 `verify-deck-quality`: PASS
- 강화 후 `build-asset-pack`: PASS, 68 crops rebuilt, 0 projector blockers
- 강화 후 `verify-asset-crops`: WARN, 68 crops 중 24개 reviewer attention
- `prepare-asset-generation-prompts --include-review-warnings`: PASS, promptable 25개, crop-review warning source sheet 5개 포함
- `prepare-asset-generation-prompts --explode-warning-sheets --only-review-warnings`: PASS, crop WARN 24개를 `single-image-from-warning` 생성 큐로 분해
- `explode-warning-crops-to-single-images`: PASS, crop WARN 24개를 `single-image` / `generationMode: single-image-first`로 전환하고 target을 `<asset-id>-single.png`로 변경
- single-image contract temp `prepare-asset-generation-prompts --only-single-image-first`: PASS, 변환된 critical regeneration 자산 24개만 큐에 포함, `asset-generation-prompts.md`와 `asset-generation-queue.json` 생성
- single-image contract temp `build-asset-pack`: EXPECTED FAIL, 44 crops rebuilt, 24 pending projector blockers. 이는 기존 crop PNG를 재사용하지 않고 새 개별 이미지 생성을 요구한다는 의미다.
- `act1-info-baskets` single-image pilot: PASS as pipeline proof. Generated `assets/visuals/act1-info-baskets-single.png` in temp deck, 1536x1024 PNG, and pending projector blockers decreased from 24 to 23. First attempt had title/speech-bubble text and was rejected; second prompt restricted text to the three basket labels.
- `verify-single-image-contract`: PASS, 24 single-image-first assets found, 1 generated, 23 pending required assets, no stale crop-region fields
- single-image contract temp `verify-asset-crops`: PASS, 남은 crop-region 44개 모두 PASS
- 강화 후 `verify-deck-quality`: FAIL, `asset-review.json` stale hash 및 crop WARN으로 본 적용 불가
- verification orchestrator task route: `slide-deck`
- template verification orchestrator loop: PASS
- image/crop verification orchestrator loop: FAIL, target defect detected
- blind spot probe: PASS

## 남은 리스크

- 새 이미지 생성은 Act 1 파일럿 1장만 검증했다. 전체 5개 warning source sheet(`act1`, `act2`, `act3`, `act5`, `act6`)는 재생성/리뷰가 남아 있다.
- sprite sheet 방식은 한 번에 여러 패널을 생성하므로 모델이 패널 경계, safe area, 텍스트 위치를 어기면 여러 슬라이드 crop이 동시에 깨진다. 개선 방향은 warning source sheet 재생성이 아니라 warning crop 24개를 개별 `single-image-first` 자산으로 생성하고, 하네스가 deterministic composition으로 배치하는 것이다.
- 계획의 문장 재작성은 자동 투영 가능한 수준으로만 검증했다. 실제 강의 품질 관점의 문장 다듬기는 Act content source 반영 단계에서 다시 리뷰해야 한다.
- 원본 `generated-decks/kimai-workshop-content/slide-spec.json`에는 아직 적용하지 않았다.

## 실제 적용 결과 - 2026-05-31

원본 `generated-decks/kimai-workshop-content`에 warning crop 24개를 `single-image-first` 자산으로 전환해 적용했다. 기존 crop PNG는 active source path에서 제거하고, 새 개별 이미지만 `asset-pack.json`의 `sourcePath`로 남겼다.

- 적용 자산 수: 24개
- 단일 이미지 원본 위치: `assets/visuals/<asset-id>-single.png`
- 하네스 렌더 복사본 위치: `assets/visuals/<slide-id>-<asset-id>-single.png`
- 리뷰 페이지: `single-image-generated-review.html`
- 리뷰 스크린샷: `review-screenshots/single-image-generated-review.png`
- 실제 덱 registry: `assets/slides.js`의 `renderedVisualAsset`, `layoutTemplate`, `mainTemplate`, `assetSemanticRequirements`

이번 적용은 최종 HTML을 직접 수정하지 않고 `asset-pack.json`, `asset-review.json`, 하네스 빌드 스크립트, 생성 산출물 재빌드로 진행했다. `asset-pack.json`에는 `generationMode: "single-image-first"`, `previousCropRegion`, `deterministicComposition`이 남아 후속 작업자가 왜 crop 방식이 폐기됐는지 확인할 수 있다.

### 실제 적용 검증

```sh
node deck-harness/scripts/validate-deck-contract.js generated-decks/kimai-workshop-content
node deck-harness/scripts/build-deck-from-spec.js generated-decks/kimai-workshop-content
node deck-harness/scripts/verify-single-image-contract.js generated-decks/kimai-workshop-content
node deck-harness/scripts/verify-asset-crops.js generated-decks/kimai-workshop-content
node deck-harness/scripts/verify-slide-layout-variety.js generated-decks/kimai-workshop-content
node deck-harness/scripts/run-browser-render-check.js generated-decks/kimai-workshop-content --all-slides
node deck-harness/scripts/verify-deck-quality.js generated-decks/kimai-workshop-content
```

- `validate-deck-contract`: PASS
- `build-deck-from-spec`: PASS, 76 slides built
- `verify-single-image-contract`: PASS, 24/24 generated, 0 pending
- `verify-asset-crops`: PASS, remaining crop-region 44개 PASS
- `verify-slide-layout-variety`: PASS, 7 layout variants, 8 semantic templates, 9 rendered templates
- `run-browser-render-check --all-slides`: PASS, 78 captures
- `verify-deck-quality`: PASS through browser render evidence
- Ouroboros QA: PASS 0.90, 단 generated Korean text polish와 human semantic visual signoff는 WARN-level 후속 리뷰로 남김

### 현재 남은 리스크

- 생성 이미지 안의 일부 한글 라벨은 사람이 한 번 더 읽어 보고 강의용 표기 품질을 확정해야 한다.
- `asset-review.json`은 현재 PNG hash와 semanticRequirements 기준으로 갱신됐지만, 최종 강의 확정 전에는 리뷰 페이지를 기준으로 사람이 semantic signoff를 한 번 더 남기는 편이 안전하다.

### 추가 시각 리뷰 - 2026-05-31

리뷰 페이지와 실제 덱 렌더 스크린샷을 다시 확인했다.

- 전체 24개 single-image-first 자산은 `single-image-generated-review.html`에서 한 화면 리뷰 가능하다.
- 대표 실제 렌더 확인:
  - slide 13 `act1-info-baskets`: 세 바구니와 `필수 정보`, `있으면 도움`, `방해 정보` 라벨이 보이며 crop 경계/패널 번호 오염 없음.
  - slide 26 `act2-prompt-term-mapping`: `업무 지시`, `인수인계서`, `Prompt`, `Task Specification` 연결이 보이며 이미지가 하네스 프레임 안에서 잘리지 않음.
  - slide 38 `act3-to-act4-manual`: `회사 내규`, `업무 매뉴얼`, `기준`, `순서` 대비가 보이며 Act 4 브릿지 의미가 읽힘.
  - slide 59 `act5-new-hire-skill-assignment`: 역할별 매뉴얼 3개와 `각 신입사원` 연결이 보이며 프레임 오염 없음.
- 차단 결함: 없음.
- 주의: 생성 이미지 내부의 작은 손글씨 라벨은 강의 핵심 카피가 아니라 시각 앵커로만 사용한다. 핵심 문장과 정확한 용어는 HTML 텍스트 레이어가 맡는다.
