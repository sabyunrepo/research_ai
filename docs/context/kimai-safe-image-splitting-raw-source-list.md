목적:
김아이 덱 이미지 생성/분할 리스크 해결 방법 조사를 위한 원천 목록이다.

원천 문서:
- `docs/context/kimai-safe-image-splitting-context-research-pack.md`

수정해야 할 때:
- 이미지 생성 API, crop 라이브러리, 하네스 asset contract 조사 범위가 바뀔 때

수정하면 안 되는 경우:
- 실제 구현 상태를 증명하는 검증 로그 대신 사용하지 않는다.

관련 산출물:
- `deck-harness/scripts/build-asset-pack.js`
- `deck-harness/scripts/verify-asset-crops.js`
- `deck-harness/scripts/prepare-asset-generation-prompts.js`

# Raw Source List

Checked date: 2026-05-31

## Local Sources

- `deck-harness/AGENTS.md`
  - 왜 봤나: generated deck 이미지 자산 계약, asset-pack, asset-review, visualAssetId 원칙 확인.
- `docs/harness/kimai-content/asset-generation-workflow.md`
  - 왜 봤나: 기존 sprite sheet -> crop-region -> split PNG 워크플로우 원안 확인.
- `deck-harness/scripts/build-asset-pack.js`
  - 왜 봤나: 현재 crop 계산, sheetLayout 기반 분할, output 파일 생성 방식 확인.
- `deck-harness/scripts/verify-asset-crops.js`
  - 왜 봤나: edge line coverage, expectedSubjectBounds, reviewer warning 검증 방식 확인.
- `generated-decks/kimai-workshop-content/kimai-template-rewrite-dry-run-verification.md`
  - 왜 봤나: 강화 후 crop WARN, 파일럿 이미지 결과, 본 적용 차단 사유 확인.
- `package.json`
  - 왜 봤나: 현재 `sharp` 같은 이미지 처리 라이브러리 의존성 존재 여부 확인.

## External Sources

- Sharp official docs, Resizing images: https://sharp.pixelplumbing.com/api-resize/
  - 왜 봤나: `extract`, `extend`, `trim` 기능과 안전한 픽셀 단위 crop/padding 가능성 확인.
- Sharp official docs, Output options: https://sharp.pixelplumbing.com/api-output/
  - 왜 봤나: `toFile`, PNG output, metadata handling 확인.
- OpenAI API official docs, Image generation: https://developers.openai.com/api/docs/guides/image-generation
  - 왜 봤나: image output size/quality/background, reference/edit fidelity 제약 확인.
- OpenAI Academy, Creating images with ChatGPT: https://openai.com/academy/image-generation/
  - 왜 봤나: 이미지 프롬프트 안정화, 작은 반복 수정, 고정해야 할 요소 명시, 텍스트/레이아웃 지침 확인.
- ImageMagick official command-line options: https://imagemagick.org/command-line-options/
  - 왜 봤나: CLI 기반 대체 crop 가능성 확인. 현재 로컬에는 `magick`이 없어 직접 채택 후보에서는 낮게 평가.
