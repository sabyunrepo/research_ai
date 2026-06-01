# Kimai Asset Generation Workflow

Generated: 2026-05-28
Updated: 2026-05-31
Scope: Kimai image generation, deterministic composition, and split workflow source contract

## Boundary

이 문서는 완성품 생성 절차가 아니라, 이후 하네스 엔지니어링 워크플로우에 주입할 소스 계약이다.

현재 콘텐츠 브랜치에서 하지 않는 일:

- 실제 이미지 생성
- 실제 crop 파일 생성
- 이미지 리뷰 PASS 판정
- 최종 deck HTML에 이미지 연결
- `deck-harness/scripts/build-asset-pack.js` 구현

현재 콘텐츠/하네스 계약에서 하는 일:

- 어떤 이미지를 개별 생성해야 하는지 정의한다.
- 어떤 기존 sprite sheet crop을 개별 이미지로 승격해야 하는지 정의한다.
- 각 이미지가 발표에서 어떤 설명 역할을 해야 하는지 정의한다.
- 하네스가 프레임, 여백, 기울기, object-fit, 최종 배치를 deterministic composition으로 처리해야 할 입력 계약을 남긴다.

## Decision

김아이 본편 설명 이미지는 `single-image-first`를 기본값으로 한다.

AI 이미지 생성기는 하나의 독립 그림만 만든다. 슬라이드 프레임, 카드 기울기, 그림자, object-fit, 배치는 하네스 CSS/빌드 단계가 결정한다. 여러 패널을 한 장의 sprite sheet로 생성하는 방식은 비용 절감용 실험 경로이며, projector-critical 자산의 기본 경로가 아니다.

기본 워크플로우는 다음 순서를 따른다.

```text
asset-pack.json
-> single-image prompt generation
-> generated standalone PNG files
-> deterministic harness composition in slide templates
-> slide-spec visualAssetId references standalone files
-> HTML uses generated files through visualAssetId slots
```

기존 sprite sheet 자산은 다음 조건에서만 유지한다.

```text
asset-pack.json
-> sprite sheet generation
-> crop-region split into real PNG files
-> verify-asset-crops PASS
-> asset-review.json PASS
-> slide-spec visualAssetId references split files
-> HTML uses split image files, not CSS crop views
```

`verify-asset-crops`가 WARN을 내는 crop-region은 해당 원본 sprite sheet를 다시 생성하기보다, 먼저 문제 crop을 `single-image` 계약으로 승격하고 생성 큐로 분해한다.

권장 자동화 순서:

```sh
node deck-harness/scripts/build-asset-pack.js <deck-dir>
node deck-harness/scripts/verify-asset-crops.js <deck-dir>
node deck-harness/scripts/explode-warning-crops-to-single-images.js <deck-dir>
node deck-harness/scripts/prepare-asset-generation-prompts.js <deck-dir> --only-single-image-first
node deck-harness/scripts/verify-single-image-contract.js <deck-dir>
```

이 명령은 사람이 검토할 `asset-generation-prompts.md`와 자동화가 읽을 `asset-generation-queue.json`을 함께 만든다. 이후 Visual Asset Agent가 큐에 잡힌 `<asset-id>-single.png` 파일을 생성하고, build/quality gate가 pending projector blocker 0을 확인해야 한다.

## Current Repository Check

현재 worktree에서 확인한 상태:

- `asset-pack.json`은 `single-image`, `sprite-sheet`, `crop-region`, `sourceAssetId`, `crop`, `sourcePath` 계약을 담을 수 있다.
- `generated-decks/kimai-act0-prototype/asset-pack.json`에는 이미 crop-region과 `status: cropped` 사례가 있다.
- `deck-harness/scripts/build-asset-pack.js`는 crop-region을 실제 파일로 분할한다.
- `deck-harness/scripts/verify-asset-crops.js`는 edge line, subject bounds, crop safety를 검증한다.
- `deck-harness/scripts/prepare-asset-generation-prompts.js --explode-warning-sheets --only-review-warnings`는 crop WARN 자산을 개별 이미지 생성 큐로 분해한다.
- `deck-harness/scripts/explode-warning-crops-to-single-images.js`는 crop WARN 자산의 `asset-pack.json` 계약을 `crop-region`에서 `single-image`로 전환하고, 기존 crop PNG를 재사용하지 않도록 `<asset-id>-single.png` target을 만든다.

따라서 앞으로는 sprite sheet 재시도보다 개별 이미지 생성과 deterministic composition을 우선한다.

## Required Agent Roles

### Visual Asset Agent

Input:

- `generated-decks/kimai-workshop-content/asset-pack.json`
- `docs/harness/kimai-content/act0-content-source.md`
- `디자인.md`

Responsibility:

- `kind: single-image` 또는 `single-image-from-warning` 자산의 `generationPrompt`와 `semanticRequirements`를 사용해 독립 이미지를 생성한다.
- Act 0의 hand-drawn minimal 스타일, 기본 흑백 + 포인트 1색, no gradient 규칙을 지킨다.
- 이미지가 발표자가 설명할 teaching artifact인지 확인한다.
- sprite sheet, crop mark, 패널 번호, slide frame, page chrome을 이미지 안에 넣지 않는다.

Output:

```text
generated-decks/kimai-workshop-content/assets/visuals/<asset-id>.png
```

### Deterministic Composition Agent

Input:

- `asset-pack.json`
- generated standalone image files
- `slide-spec.json`
- deck templates/style

Responsibility:

- 이미지는 `visualAssetId`로만 연결한다.
- 최종 프레임, 카드 기울기, shadow, object-fit, 여백, 크롭 없는 배치를 하네스 템플릿/CSS에서 처리한다.
- 중요한 텍스트는 가능하면 이미지 안이 아니라 slide template의 HTML 텍스트로 둔다.
- 이미지가 슬롯 안에서 잘리지 않는지 browser render로 확인한다.

Output:

```text
generated-decks/kimai-workshop-content/assets/slides.js
generated-decks/kimai-workshop-content/slides/*.html
```

### Asset Splitter

Input:

- `asset-pack.json`
- `assets/visuals/kimai-act0-visual-sheet.png`

Responsibility:

- sprite sheet가 허용된 경우에만 실행한다.
- `kind: crop-region` 자산을 찾는다.
- `sourceAssetId`가 가리키는 sheet에서 `crop` 좌표를 계산한다.
- 각 crop을 실제 PNG 파일로 저장한다.
- crop view를 HTML에서 직접 쓰지 않는다.
- `verify-asset-crops` WARN이 나면 해당 crop-region을 `single-image` 계약으로 승격한다.

Output:

```text
generated-decks/kimai-workshop-content/assets/visuals/kimai-new-employee.png
generated-decks/kimai-workshop-content/assets/visuals/kimai-company-context-blanks.png
generated-decks/kimai-workshop-content/assets/visuals/kimai-report-request-gap.png
generated-decks/kimai-workshop-content/assets/visuals/kimai-harness-desk-kit.png
generated-decks/kimai-workshop-content/assets/visuals/kimai-manual-checkpoint.png
generated-decks/kimai-workshop-content/assets/visuals/kimai-workflow-map.png
```

### Asset Review Agent

Input:

- split PNG files
- `asset-pack.json`
- rendered Act 0 deck or mockup screenshot

Responsibility:

- `semanticRequirements.mustShow` and `mustNotShow`를 기준으로 각 이미지가 설명 역할을 수행하는지 판정한다.
- 이미지가 슬라이드의 남은 공간에 들어가는지 확인한다.
- 작은 글씨, 복잡한 장식, 의미 불일치를 막는다.

Output:

```text
generated-decks/kimai-workshop-content/asset-review.json
```

## Single Image Contract

개별 이미지:

```text
kind: single-image
generationMode: single-image-first
target: assets/visuals/<asset-id>.png
style: white background, black hand-drawn linework, one #2563eb accent
forbidden: sprite sheet, multi-panel grid, crop marks, panel numbers, slide frame, page chrome, clipped character/text
composition owner: deck harness
```

이미지 생성 프롬프트는 다음 원칙을 따른다.

- 하나의 설명 포인트만 그린다.
- 김아이 캐릭터는 둥근 얼굴, 헤드셋/안테나, 파란 넥타이/명찰을 유지한다.
- 한국어 라벨은 1~3단어 수준으로 짧게 둔다.
- 긴 문장, 절차 번호, 검증 로그, UI 조작 안내는 HTML 템플릿 텍스트로 분리한다.
- 그림 가장자리에는 충분한 흰 여백을 남긴다.

## Sprite Sheet Crop Contract

Sprite sheet는 legacy/optimization 경로다. 사용하는 경우 다음 조건을 만족해야 한다.

```text
size: 2400x1600
grid: 3 columns x 2 rows
cell: 800x800
gate: verify-asset-crops PASS, asset-review PASS, browser render PASS
```

Crop regions:

| Asset ID | Source Cell | Percent Crop | Output |
|---|---:|---|---|
| kimai-new-employee | row 1 col 1 | x=0, y=0, w=33.333, h=50 | `assets/visuals/kimai-new-employee.png` |
| kimai-company-context-blanks | row 1 col 2 | x=33.333, y=0, w=33.333, h=50 | `assets/visuals/kimai-company-context-blanks.png` |
| kimai-report-request-gap | row 1 col 3 | x=66.666, y=0, w=33.333, h=50 | `assets/visuals/kimai-report-request-gap.png` |
| kimai-harness-desk-kit | row 2 col 1 | x=0, y=50, w=33.333, h=50 | `assets/visuals/kimai-harness-desk-kit.png` |
| kimai-manual-checkpoint | row 2 col 2 | x=33.333, y=50, w=33.333, h=50 | `assets/visuals/kimai-manual-checkpoint.png` |
| kimai-workflow-map | row 2 col 3 | x=66.666, y=50, w=33.333, h=50 | `assets/visuals/kimai-workflow-map.png` |

## Slot Contract

Final slide renderer should place split files into stable slots.

Base slide:

```text
slide: 1280x720
safe area: x=58, y=46, width=1164, height≈620
bottom bridge: y≈640, height≈54
```

Right-side illustration slot:

```text
x≈860
y≈170
width≈330
height≈210
object-fit: contain
```

Wide journey-map slot:

```text
x=58
y≈220
width≈1164
height≈180
object-fit: contain
```

The image generation agent does not need to know exact HTML coordinates, but each crop should be readable when displayed at these sizes.

## Harness Implementation Request

아래는 하네스 엔지니어링 브랜치의 구현 계약이다.

Implemented scripts:

```text
deck-harness/scripts/build-asset-pack.js <deck-dir>
deck-harness/scripts/verify-asset-crops.js <deck-dir>
deck-harness/scripts/explode-warning-crops-to-single-images.js <deck-dir>
deck-harness/scripts/prepare-asset-generation-prompts.js <deck-dir> --only-single-image-first
deck-harness/scripts/verify-single-image-contract.js <deck-dir>
```

Required behavior:

1. Read `<deck-dir>/asset-pack.json`.
2. For each `single-image` with `status: planned`, prepare one standalone image prompt and write `sourcePath` after generation.
3. For each `crop-region`, read `sourceAssetId`, calculate crop rectangle, and write the crop to `sourcePath` only when the source sheet passes crop QA.
4. Mark generated standalone images as `status: generated` and crop regions as `status: cropped`.
5. Fail if a projector-required asset has no real output file.
6. Fail if slide HTML references a sprite sheet directly instead of standalone or split files.
7. When `asset-crop-review.json` has WARN entries, `prepare-asset-generation-prompts --explode-warning-sheets --only-review-warnings` must produce single-image prompts for those crop assets.
8. Before final deck build, WARN crop-region assets must either be fixed to `verify-asset-crops PASS` or converted by `explode-warning-crops-to-single-images.js` into `generationMode: single-image-first` assets with `deterministicComposition.owner: deck-harness`.
9. The generation queue for converted WARN crops should use `prepare-asset-generation-prompts --only-single-image-first`, so unused planned assets do not enter the critical regeneration batch.
10. `prepare-asset-generation-prompts` must write both `asset-generation-prompts.md` for human review and `asset-generation-queue.json` for deterministic image-generation automation.
11. `verify-single-image-contract` must confirm converted assets use fresh `-single.png` targets, preserve `previousCropRegion`, declare deck-owned deterministic composition, and report generated vs pending required assets.

## Done Criteria

Kimai image pipeline is complete only when:

```text
1. Every projector-required visualAssetId resolves to a real standalone or split PNG.
2. Sprite sheet crop assets have verify-asset-crops PASS, or have been replaced by single-image assets.
3. asset-pack.json records generation mode and source path.
4. slide-spec uses visualAssetId, not raw paths.
5. rendered HTML references visual registry files, not source sheets directly.
6. asset-review.json passes semantic requirements and fresh sha256 checks.
7. browser render shows images inside their deterministic slots without overlap, clipping, or stale crop residue.
```
