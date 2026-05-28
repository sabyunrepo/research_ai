# Kimai Asset Generation Workflow

Generated: 2026-05-28
Scope: Act 0 image generation and split workflow source contract

## Boundary

이 문서는 완성품 생성 절차가 아니라, 이후 하네스 엔지니어링 워크플로우에 주입할 소스 계약이다.

현재 콘텐츠 브랜치에서 하지 않는 일:

- 실제 이미지 생성
- 실제 crop 파일 생성
- 이미지 리뷰 PASS 판정
- 최종 deck HTML에 이미지 연결
- `deck-harness/scripts/build-asset-pack.js` 구현

현재 콘텐츠 브랜치에서 하는 일:

- 어떤 이미지를 한 장의 시트로 만들지 정의한다.
- 어떤 crop이 어떤 실제 파일로 분할되어야 하는지 정의한다.
- 각 이미지가 발표에서 어떤 설명 역할을 해야 하는지 정의한다.
- 하네스 엔지니어링 브랜치가 구현해야 할 입력 계약을 남긴다.

## Decision

Act 0 이미지는 개별 이미지로 하나씩 생성하지 않는다.

워크플로우는 다음 순서를 따른다.

```text
asset-pack.json
-> one sprite sheet generation
-> crop-region split into real PNG files
-> slide-spec visualAssetId references split files
-> HTML uses split image files, not CSS crop views
```

## Current Repository Check

현재 worktree에서 확인한 상태:

- `asset-pack.json`은 `sprite-sheet`, `crop-region`, `sourceAssetId`, `crop`, `sourcePath` 계약을 담을 수 있다.
- `generated-decks/kimai-act0-prototype/asset-pack.json`에는 이미 crop-region과 `status: cropped` 사례가 있다.
- 그러나 `deck-harness/scripts/`와 `deck-harness/skills/`에는 `asset-pack.json`을 읽어 이미지 시트를 생성하고 실제 파일로 crop 분할하는 재사용 스크립트가 아직 보이지 않는다.

따라서 Act 0 콘텐츠 브랜치에서는 계약만 확정하고, 하네스 엔지니어링 브랜치에서는 이 계약을 읽어 실제 실행기를 구현해야 한다.

## Required Agent Roles

### Visual Asset Agent

Input:

- `generated-decks/kimai-workshop-content/asset-pack.json`
- `docs/harness/kimai-content/act0-content-source.md`
- `디자인.md`

Responsibility:

- `kind: sprite-sheet` 자산의 `generationPrompt`와 `semanticRequirements`를 사용해 원본 이미지 시트를 생성한다.
- Act 0의 hand-drawn minimal 스타일, 기본 흑백 + 포인트 1색, no gradient 규칙을 지킨다.
- 이미지가 발표자가 설명할 teaching artifact인지 확인한다.

Output:

```text
generated-decks/kimai-workshop-content/assets/visuals/kimai-act0-visual-sheet.png
```

### Asset Splitter

Input:

- `asset-pack.json`
- `assets/visuals/kimai-act0-visual-sheet.png`

Responsibility:

- `kind: crop-region` 자산을 찾는다.
- `sourceAssetId`가 가리키는 sheet에서 `crop` 좌표를 계산한다.
- 각 crop을 실제 PNG 파일로 저장한다.
- crop view를 HTML에서 직접 쓰지 않는다.

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

## Crop Contract

Act 0 sheet:

```text
size: 2400x1600
grid: 3 columns x 2 rows
cell: 800x800
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

아래는 지금 구현할 내용이 아니라, 하네스 엔지니어링 브랜치에 넘길 구현 요청이다.

Suggested future script:

```text
deck-harness/scripts/build-asset-pack.js <deck-dir>
```

Required behavior:

1. Read `<deck-dir>/asset-pack.json`.
2. For each `sprite-sheet` with `status: planned`, call the configured image generation path and write `sourcePath`.
3. For each `crop-region`, read `sourceAssetId`, calculate crop rectangle, and write the crop to `sourcePath`.
4. Mark generated sheet as `status: generated` and crop regions as `status: cropped`.
5. Fail if a crop asset has no real output file.
6. Fail if slide HTML references the sheet directly instead of split files.

This script is not present yet in the current worktree and should be handled by the harness engineering branch. Do not treat its absence as a content-branch failure.

## Done Criteria

Act 0 image pipeline is complete only when:

```text
1. kimai-act0-visual-sheet.png exists.
2. Six split PNG files exist.
3. asset-pack.json records sheet and crop metadata.
4. slide-spec uses visualAssetId for split assets.
5. rendered HTML references split PNG files.
6. asset-review.json passes semantic requirements.
7. quality gate screenshot shows images inside their slots without overlap.
```
