# Context Research Pack

Status: PASS
Task: 김아이 덱 이미지 생성/분할 리스크 해결 방법과 확정적으로 안전한 이미지 분리 방법 조사
Artifact owner: Codex
Created: 2026-05-31
Updated: 2026-05-31
Project root: /Users/sabyun/goinfre/research_ai
Brainstorming phase: post-brainstorm
Recommended next action: implement deterministic single-image-first asset pipeline, keeping sprite sheets only behind a strict gate

## 1. Context Triage

### Task Classification

| field | value |
|---|---|
| 작업 유형 | architecture/design, bug/debugging, deck/PPT/report material |
| 예상 산출물 | 리스크 해결 방향, 안전한 이미지 분리 workflow, 다음 구현 지침 |
| 위험도 | high |
| 최신성 필요 | yes |
| 로컬 조사 필요 | yes |
| 외부 검색 필요 | yes |
| 라이브러리/API 문서 필요 | yes |
| PPT/deck/report 자료 필요 | yes |
| high-stakes domain | no |

### Tool Detection

| tool | available | used | fallback | note |
|---|---:|---:|---|---|
| local search | yes | yes | n/a | `rg`, `nl`, local file reads |
| web search | yes | yes | n/a | official docs 중심 |
| Context7 | no | no | official docs / package docs | 별도 Context7 MCP는 사용하지 않음 |
| docs/parser tool | yes | yes | local text extraction | Markdown/JS/JSON 직접 확인 |
| browser/screenshot | yes | no | static file review | 이번 조사는 workflow 중심, 앞선 턴에서 visual inspection 수행 |

### Must-Read Context

| path/source | why it matters | status |
|---|---|---|
| `deck-harness/AGENTS.md` | 이미지 자산은 `asset-pack`, `asset-review`, `visualAssetId` 계약으로 관리해야 함 | read |
| `docs/harness/kimai-content/asset-generation-workflow.md` | 기존 sprite sheet -> crop-region -> split PNG 원안 | read |
| `deck-harness/scripts/build-asset-pack.js` | 현재 분할 실행기와 crop 계산 방식 | read |
| `deck-harness/scripts/verify-asset-crops.js` | 현재 crop QA와 강화된 edge/subject 검증 | read |
| `generated-decks/kimai-workshop-content/kimai-template-rewrite-dry-run-verification.md` | 현재 리스크와 실패 증거 | read |
| `package.json` | 이미지 처리 라이브러리 의존성 확인 | read |

### Pre-Brainstorm Notes

- 현 리스크는 “AI 이미지가 생성되는가”가 아니라 “생성된 시트가 계약대로 분할 가능한가”다.
- 기존 3x4 sprite sheet 계약은 모델이 3x3처럼 구성하거나 패널 경계를 침범하면 여러 슬라이드를 동시에 깨뜨린다.
- 하네스 원칙상 최종 HTML만 손보면 안 되고, `asset-pack`, 생성 프롬프트, split script, verifier, `asset-review.json` 계약을 함께 갱신해야 한다.

### Questions For Brainstorming

- batch sprite sheet를 유지할지, 단일 이미지 생성으로 전환할지?
- sprite sheet를 유지한다면 어떤 gate가 있어야 본 적용 가능하다고 볼 수 있는지?
- 확정적 분할을 코드로 보장하려면 생성 이미지와 합성 캔버스 중 어디까지 모델에 맡겨야 하는지?

## 2. Brainstorming Summary

### Agreed Goal

김아이 덱의 이미지 자산을 템플릿 구조에 맞게 안전하게 생성하고, 잘린 이미지가 인접 패널/경계/잘린 캐릭터 없이 슬라이드에 들어가도록 하네스 계약을 확정한다.

### Chosen Direction

1. **권장 기본값: 개별 `single-image` 생성 후 하네스가 고정 캔버스/프레임에 배치한다.**
2. 반복 비용을 줄이고 싶을 때만 sprite sheet를 쓰되, sprite sheet는 `experimentalBatch`로 취급하고 강화된 crop gate를 통과한 경우에만 projector 자산으로 승격한다.
3. “확정적으로 안전한 분리”가 필요한 슬라이드는 crop-region을 쓰지 않고 `single-image`나 `composed-panel`로 전환한다.

### Rejected Alternatives

| alternative | why rejected |
|---|---|
| AI에게 12패널 sprite sheet를 계속 더 정확히 그리라고만 요청 | 파일럿에서 3x4는 맞았지만 일부 패널이 safe area를 침범했다. 프롬프트만으로 확정성 보장 불가 |
| 최종 HTML/CSS에서 crop view로 보정 | deck-harness 지침상 split PNG를 최종 참조해야 하며, HTML만 고치는 방식은 원인 레이어 보정이 아님 |
| ImageMagick CLI 의존 | 공식적으로 crop은 가능하지만 현재 로컬에 `magick`이 없고, Node 하네스에 새 시스템 의존성을 강제할 이유가 약함 |
| 모든 이미지를 SVG/CSS 다이어그램으로 대체 | `디자인.md`와 deck-harness 지침은 본편 컷에 생성 이미지 기반 손그림을 우선하도록 한다 |

### Research Questions After Brainstorming

- RQ1. 안전한 이미지 분리의 실패 원인은 무엇인가?
- RQ2. 확정성을 높이는 생성 전략은 무엇인가?
- RQ3. Node 하네스에서 분할/패딩/검증을 안정화할 수 있는 구현 방법은 무엇인가?
- RQ4. 본 적용 전 gate는 무엇이어야 하는가?

## 3. Targeted Research

### Search Plan

| research question | query family | example queries | source target | status |
|---|---|---|---|---|
| RQ1 | local defect evidence | `sprite-sheet`, `sheetLayout`, `asset-crop`, `edge line` | local | searched |
| RQ2 | image generation prompt reliability | OpenAI image generation docs, image prompt best practices | official | searched |
| RQ2 | image text and layout constraints | OpenAI Academy text in images, constraints, targeted revisions | official | searched |
| RQ3 | deterministic crop/padding in Node | Sharp `extract`, `extend`, `toFile`; ImageMagick crop | official | searched |
| RQ4 | harness gate design | local verifier and quality gate scripts | local | searched |

### Search Iterations

| iteration | query families used | new evidence found | unresolved questions | next action |
|---|---|---|---|---|
| 1 | local defect evidence | 현재 강화 후 24 crop WARN, 5 source sheets 재생성 필요 | 없음 | external docs 확인 |
| 2 | OpenAI image generation docs; image text and layout constraints | size/quality/output constraints, prompting best practice, small targeted revisions 확인 | 모델이 패널 안전영역을 100% 지킨다는 보장은 없음 | deterministic split design |
| 3 | Sharp/ImageMagick docs | 픽셀 단위 extract, extend, output 가능 확인 | `sharp`는 현재 dependency 아님 | 하네스 구현 방향 결정 |

### Evidence Table

| claim id | claim | evidence | source id(s) | source type | checked date | confidence | relevance |
|---|---|---|---|---|---|---|---|
| C1 | 현재 김아이 하네스는 이미지 파일만 바꾸지 말고 asset contract, review, gate까지 함께 관리해야 한다. | `deck-harness/AGENTS.md`가 `asset-pack.semanticRequirements`, `asset-review.json`, `visualAssetId`, split PNG 원칙을 명시한다. | S1 | local | 2026-05-31 | high | high |
| C2 | 기존 asset workflow 원안은 sprite sheet 생성 후 crop-region을 실제 PNG로 분할하는 구조다. | `asset-generation-workflow.md`가 `asset-pack.json -> one sprite sheet generation -> crop-region split -> slide-spec visualAssetId` 순서를 정의한다. | S2 | local | 2026-05-31 | high | high |
| C3 | 현재 강화된 dry run에서는 이미지/crop 단계가 본 적용 불가 상태다. | dry-run verification이 `IMAGE GATE FAIL`, `68 crops 중 24 WARN`, warning source sheet 5개를 기록한다. | S5 | local | 2026-05-31 | high | high |
| C4 | safe margin은 asset-level 값만 우선하면 안 되고 sheet inset/layout safe margin과 함께 최댓값을 써야 한다. | `build-asset-pack.js`와 `verify-asset-crops.js`가 `Math.max(inset, layout safe, asset safe)`로 맞춰졌다. | S3, S4 | local | 2026-05-31 | high | high |
| C5 | Sharp는 픽셀 단위 `extract`와 padding `extend`, output write를 제공하므로 deterministic crop/pad 구현에 적합하다. | Sharp docs는 `extract`가 left/top/width/height integral pixel region을 crop하고, `extend`가 edge padding을 추가하며, `toFile`이 output 파일을 쓴다고 설명한다. | S6, S7 | official | 2026-05-31 | high | high |
| C6 | OpenAI image generation은 원하는 size/quality/output format을 설정할 수 있지만, 복잡한 sheet layout 준수 자체를 확정 보장하지는 않는다. | OpenAI API docs는 size/quality/output options를 제공한다. Academy docs는 고정해야 할 요소와 제약을 명시하고 작은 반복 수정으로 개선하라고 권장한다. | S8, S9 | official | 2026-05-31 | medium | high |
| C7 | 따라서 “확정적으로 안전한 이미지 분리”는 모델이 큰 sheet를 정확히 배치하게 하는 방식보다, 모델은 개별 visual만 만들고 하네스가 캔버스/프레임/배치를 결정하는 방식이 더 안전하다. | C3의 실패와 C5의 deterministic crop/pad 가능성, C6의 prompt 반복 필요성을 종합한 추론. | S3, S4, S5, S6, S9 | inference | 2026-05-31 | high | high |

### Sufficiency Check

| criterion | status | evidence / note |
|---|---|---|
| enough distinct query families used | pass | local defect, image generation docs, image text/layout constraints, image processing docs, harness gate design |
| official/primary sources checked | pass | OpenAI official docs, OpenAI Academy, Sharp official docs, ImageMagick official docs |
| local project context checked when relevant | pass | AGENTS, workflow docs, build/verify scripts, dry-run verification |
| implementation/example evidence checked when relevant | pass | existing Node scripts and current failure outputs reviewed |
| risk/limitation/deprecation checked | pass | current `package.json` lacks `sharp`; `magick` unavailable locally; sprite sheet prompt not deterministic |
| contradictions or uncertainty recorded | pass | sprite sheet can work in pilot but not guaranteed; single-image safer but more generation calls |
| stop condition is explicit | pass | enough evidence to choose workflow and next implementation steps |

### Stop Condition

- Stop after finding a workflow that satisfies all constraints: source contract first, generated HTML untouched, deterministic split outputs, automated crop gate, and clear fallback when sprite sheet fails.

### Limiting Constraint

| constraint type | evidence / note |
|---|---|
| none | Web/local research completed. Context7 unavailable but official docs were enough. |

### Research State Snapshot

| state item | value |
|---|---|
| research questions tracked | 4 |
| searched query families | local defect evidence; OpenAI image generation; image text/layout constraints; Node image processing; ImageMagick fallback |
| sources reviewed | 10 |
| official/primary/local sources used | 9 |
| unresolved questions | exact final asset count after template plan application |
| synthesis status | complete |

### Source Ledger

| source id | title | url/path | source type | checked date | used by claims |
|---|---|---|---|---|---|
| S1 | Deck Harness Instructions | `deck-harness/AGENTS.md` | local | 2026-05-31 | C1 |
| S2 | Kimai Asset Generation Workflow | `docs/harness/kimai-content/asset-generation-workflow.md` | local | 2026-05-31 | C2 |
| S3 | Asset builder | `deck-harness/scripts/build-asset-pack.js` | local | 2026-05-31 | C4, C7 |
| S4 | Asset crop verifier | `deck-harness/scripts/verify-asset-crops.js` | local | 2026-05-31 | C4, C7 |
| S5 | Kimai template rewrite dry-run verification | `generated-decks/kimai-workshop-content/kimai-template-rewrite-dry-run-verification.md` | local | 2026-05-31 | C3, C7 |
| S6 | Sharp resizing images API | https://sharp.pixelplumbing.com/api-resize/ | official | 2026-05-31 | C5, C7 |
| S7 | Sharp output options API | https://sharp.pixelplumbing.com/api-output/ | official | 2026-05-31 | C5 |
| S8 | OpenAI image generation guide | https://developers.openai.com/api/docs/guides/image-generation | official | 2026-05-31 | C6 |
| S9 | OpenAI Academy image prompting guide | https://openai.com/academy/image-generation/ | official | 2026-05-31 | C6, C7 |
| S10 | ImageMagick command-line options | https://imagemagick.org/command-line-options/ | official | 2026-05-31 | C5 |

### Claim Support Check

| claim id | source id | support verdict | evidence locator / quote summary | reviewer note |
|---|---|---|---|---|
| C1 | S1 | supported | lines 18-24: design rules, asset-pack/review, visualAssetId, split PNG | direct |
| C2 | S2 | supported | lines 27-37 and 71-83: sprite sheet and crop-region workflow | direct |
| C3 | S5 | supported | lines 25-29, 76-85, 115-121, 126-127 | direct |
| C4 | S3 | supported | builder lines 73-77: max safe inset calculation | direct |
| C4 | S4 | supported | verifier lines 148-153: expected crop uses max safe inset | direct |
| C5 | S6 | supported | Sharp docs: `extract` and `extend` capabilities | direct |
| C5 | S7 | supported | Sharp docs: `toFile` writes image output | direct |
| C6 | S8 | supported | OpenAI docs: size/quality/output options | direct |
| C6 | S9 | supported | Academy: constraints and iterative refinement | partial: docs do not explicitly discuss sprite sheet reliability |
| C7 | S3 | supported | builder shows deterministic crop once source obeys contract | inference |
| C7 | S4 | supported | verifier catches edge/subject risks | inference |
| C7 | S5 | supported | dry-run verification records image gate fail | direct |
| C7 | S6 | supported | Sharp provides deterministic extract/extend primitives | inference |
| C7 | S9 | supported | prompt constraints and revisions improve but do not make deterministic layout guarantees | inference |

### Local Findings

| file | finding | relevance |
|---|---|---|
| `deck-harness/AGENTS.md` | image quality must be handled through asset contract/review/gates | prevents HTML-only fix |
| `docs/harness/kimai-content/asset-generation-workflow.md` | original workflow assumed one sheet can be reliably split | explains why current issue appeared |
| `build-asset-pack.js` | crop is deterministic once source image obeys contract | source image contract is the weak link |
| `verify-asset-crops.js` | edge line coverage and expected subject bounds can catch many crop defects | gate can block bad images |
| `kimai-template-rewrite-dry-run-verification.md` | 24 crop WARN remain after stronger verifier | image stage must be fixed before apply |
| `package.json` | no `sharp` dependency currently | adding `sharp` is an implementation decision |

### External Findings

| source | source type | finding | checked date |
|---|---|---|---|
| Sharp resize docs | official | `extract` crops integral pixel regions; `extend` pads edges | 2026-05-31 |
| Sharp output docs | official | `toFile` writes image outputs and supports PNG | 2026-05-31 |
| OpenAI image generation guide | official | output size/quality/format can be specified; gpt-image-2 supports common landscape sizes including 1536x1024 | 2026-05-31 |
| OpenAI Academy image prompting | official | constraints, fixed elements, small targeted revisions improve results; text should be short and specific | 2026-05-31 |
| ImageMagick docs | official | CLI image operations are available in principle, but local `magick` is unavailable | 2026-05-31 |

### Implementation Feasibility

- 가능:
  - `single-image` per slide/asset generation.
  - `composed-panel` contract: individual generated PNGs are placed into deterministic white hand-drawn frames by Node/CSS, not by the image model.
  - `sharp`-based crop/pad/resize if dependency is accepted.
  - Existing custom PNG parser can remain for now, but `sharp` lowers maintenance risk.
- 조건부 가능:
  - sprite sheet generation for low-risk batches only, with strict `verify-asset-crops`, visual inspection, and `asset-review.json` refresh.
  - `crop-region` for generated sheets only when all cells pass edge and subject-bound checks.
- 불가능/비추천:
  - 12-panel generated sheet as default for projector-critical assets.
  - relying on prompt text alone to guarantee row/column count and safe margins.
  - updating `asset-review.json` hash without human/visual re-review.
- 필요한 라이브러리/도구:
  - Optional: `sharp` for reliable image extract/extend/resize/toFile.
  - Existing: current PNG parser can perform deterministic crop, but it lacks ergonomic resize/pad/composite APIs.
- 대체안:
  - If not adding `sharp`, keep current PNG parser and implement `pad-crop-output` plus stricter metadata checks.

### Risks / Unknowns

- 개별 이미지 생성은 generation call 수가 늘어난다.
- 캐릭터 일관성은 reference image workflow 또는 fixed character sheet prompt가 필요하다.
- 이미지 안의 한국어 텍스트는 짧게 유지하고, 중요한 텍스트는 가능하면 HTML/CSS 텍스트로 올리는 편이 안전하다.
- `asset-review.json`은 이미지 해시 변경 때마다 stale이 되므로, hash refresh와 semantic review를 분리해야 한다.

## 4. Context Pack For Next Agent

### Use This Context

- 확정적으로 안전한 방식은 `single-image`/`composed-panel`을 기본값으로 두는 것이다.
- sprite sheet는 비용 절감용 최적화로 낮추고, 실패 시 자동으로 source sheet를 `single-image` tasks로 explode해야 한다.
- 구현 후보:
  1. `asset-pack.json`에 `kind: "composed-panel"` 또는 `generationMode: "single-image-first"` 추가.
  2. `prepare-asset-generation-prompts.js`가 warning source sheet를 개별 panel prompt로 explode하는 옵션 추가.
  3. `build-asset-pack.js`가 `single-image`를 deterministic frame/canvas slot에 맞게 pad/resize한다.
  4. `verify-asset-crops.js`에 `spriteSheetAllowedForProjector: false` 또는 `batchRisk: high`일 때 fail 조건 추가.
  5. `asset-review.json`은 `assetSha256`, semantic checklist, visual crop checklist를 새 이미지 기준으로 다시 생성/검토한다.

### Do Not Assume

- 3x4 sprite sheet를 한 번 잘 생성했다고 전체 Act에 안전하게 적용 가능하다고 보지 말 것.
- `verify-deck-quality` PASS가 이미지 의미/분할 안전성을 완전히 보장한다고 보지 말 것. crop edge, subject bounds, browser render, semantic review가 모두 필요하다.
- `asset-review.json` hash를 자동 갱신했다고 semantic review까지 끝난 것으로 보지 말 것.

### Recommended Next Step

1. 하네스에 `single-image-first` 안전 모드 추가.
2. 현재 warning source sheet 5개를 개별 panel task로 explode하는 dry run 작성.
3. Act 1의 2-3개 문제 자산을 개별 이미지로 생성해 파일럿 검증.
4. 통과하면 5개 warning source sheet 전체를 개별 이미지로 전환.
5. `build-asset-pack`, `verify-asset-crops`, `verify-deck-quality`, browser render, verification orchestrator를 다시 실행.

### Install Recommendations

- 권장: `sharp`를 dev/runtime dependency로 추가 검토. 이유는 pixel crop, padding, output, resize/composite를 공식 API로 안정화할 수 있기 때문이다.
- 보류 가능: ImageMagick. 현재 로컬에 `magick`이 없고, Node-only 하네스에 시스템 의존성을 추가하는 비용이 크다.

### Raw Source List

- `docs/context/kimai-safe-image-splitting-raw-source-list.md`
