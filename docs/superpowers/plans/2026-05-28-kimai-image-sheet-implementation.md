# Kimai Image Sheet Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Prepare the harness to replace the current generic workflow visual with a Kimai-centered image sheet and crop-based Act 0 visual, using the semantic asset review gate as the final arbiter.

**Architecture:** Use `docs/harness/kimai-visual-asset-sheet-spec.md` as the product spec. This plan completes Act 0 projector traceability only: it registers the source sheet contract, generates the source image, crops the `kimai-journey-map`, switches the Act 0 slide to that crop, and proves semantic review. Act 1-6 crop assets remain deferred; the source sheet must visually contain those regions, but separate crop registration/review for Act 1-6 is a later plan.

**Tech Stack:** Node.js deck-harness scripts, JSON `asset-pack`/`asset-review` contracts, generated HTML/CSS deck output, Playwright visual inspection after assets exist.

---

## Verification Persona

Every task must be reviewed by a verifier subagent with this concrete role, not merely a personality label.

```text
Role: Critical Visual Harness Verifier
Attitude: direct, skeptical, evidence-first
Required checks:
1. Does the task change the harness/input layer instead of hand-editing final slide HTML?
2. Does every projector visual asset have semanticRequirements?
3. Does asset-review.json honestly block PASS while an image is missing or semantically weak?
4. Are generated images, crop regions, and review status traceable through asset-pack -> build output -> presenter review?
5. Are there any vague placeholders, prototype notes, stale image paths, or semantic claims not backed by review evidence?
6. Does the verification command output prove the claimed state?
7. Do slide text and image work together, while the image-owned explanation segment remains explainable from image elements alone?
8. Does the plan avoid compressing unrelated slide concepts into one visual when a short separate slide would explain the idea better?
Failure policy:
- If any answer is unclear, request changes.
- Do not approve based on intent or visual taste; approve only from file contracts and command output.
```

The main agent orchestrates only: dispatch worker, dispatch verifier, run local verification, close used agents.

## File Structure

- Modify: `generated-decks/kimai-act0-prototype/asset-pack.json`
  - Add planned `kimai-work-environment-sheet`.
  - Add planned or blocked `kimai-journey-map` crop contract that will later replace `kimai-workflow-map`.
  - Keep current `kimai-workflow-map` as the failing baseline until the new image exists.
- Modify: `generated-decks/kimai-act0-prototype/slide-spec.json`
  - Keep `visualAssetId` on the current failing baseline in Task 1.
  - Switch to `kimai-journey-map` only after the source image file exists.
- Modify: `generated-decks/kimai-act0-prototype/asset-review.json`
  - Add review rows for current failing baseline.
  - Add an explicit blocked review row for `kimai-journey-map` while the image file is missing.
  - Do not mark planned or missing assets PASS.
- Modify: `generated-decks/kimai-act0-prototype/HANDOFF.md`
  - Record that visual semantic gate is intentionally blocked by missing/failed Kimai image.
- Create: `generated-decks/kimai-act0-prototype/prompts/kimai-work-environment-sheet.xml`
  - Store the exact image generation XML prompt from the spec, expanded with Act region requirements.
- Later generated file: `lecture-cuts/assets/generated/kimai-work-environment-sheet.png`
  - Created only during the image generation step, not during Task 1.

## Explicit Non-Scope

This plan does not complete Act 1-6 crop assets. It requires the generated source sheet to contain Act 1-6 regions for future reuse, but only `kimai-journey-map` becomes a projector-referenced crop in this implementation.

Act 1-6 crop registration will require a separate plan that adds these assets and reviews them one by one:

```text
kimai-bad-brief
kimai-good-brief
kimai-context-desk
kimai-rule-board
kimai-skill-manual
kimai-agent-team
kimai-tool-permission
kimai-stop-hook-gate
kimai-evaluation-harness
```

## Task 1: Register Kimai Image Sheet Contract

**Files:**
- Modify: `generated-decks/kimai-act0-prototype/asset-pack.json`
- Create: `generated-decks/kimai-act0-prototype/prompts/kimai-work-environment-sheet.xml`
- Modify: `generated-decks/kimai-act0-prototype/asset-review.json`
- Modify: `generated-decks/kimai-act0-prototype/HANDOFF.md`

- [x] **Step 1: Confirm current failure state**

Run:

```bash
node deck-harness/scripts/verify-deck-quality.js generated-decks/kimai-act0-prototype; code=$?; printf 'EXIT_CODE=%s\n' "$code"
```

Expected:

```text
FAIL act0-workflow-map visual semantic review failed for kimai-workflow-map: FAIL
EXIT_CODE=1
```

- [x] **Step 2: Add planned source sheet asset**

Add this asset to `generated-decks/kimai-act0-prototype/asset-pack.json`:

```json
{
  "id": "kimai-work-environment-sheet",
  "kind": "single-image",
  "status": "planned",
  "sourcePath": "lecture-cuts/assets/generated/kimai-work-environment-sheet.png",
  "teachingRole": "Act 0-6 김아이 업무 환경 이미지를 잘라 쓰기 위한 원본 이미지 시트",
  "generationPrompt": "Use generated-decks/kimai-act0-prototype/prompts/kimai-work-environment-sheet.xml",
  "styleConstraints": [
    "white background",
    "minimal black linework",
    "one blue accent",
    "hand-drawn lecture illustration",
    "no photorealism",
    "no gradient",
    "no glossy treatment",
    "no dark cinematic background"
  ],
  "explanationAnchors": [
    "김아이 중심",
    "업무 환경 구성",
    "Act별 crop region",
    "반복 가능한 이미지 자산 관리"
  ],
  "semanticRequirements": {
    "mustShow": [
      "김아이 또는 AI 신입사원이 중심에 있어야 한다",
      "Act 0-6의 주요 업무 환경 요소가 분리되어 보여야 한다",
      "각 crop region이 발표 중 설명 가능한 시각 요소를 가져야 한다"
    ],
    "mustNotShow": [
      "김아이 없이 일반 아이콘만 나열된 워크플로우",
      "강의 내용과 무관한 장식용 배경",
      "발표자가 설명할 수 없는 추상 도형"
    ],
    "teachingQuestions": [
      "이 시트에서 Act 0-6의 이미지 자산을 잘라 쓸 수 있는가?",
      "각 영역이 김아이 세계관을 유지하는가?"
    ],
    "minimumPassScore": 85
  },
  "alt": "김아이 업무 환경 이미지 시트",
  "notes": "Planned source sheet. Do not reference from slide-spec until the file exists and semantic review passes."
}
```

- [x] **Step 3: Add blocked crop asset contract**

Add this asset but keep it unreferenced until the source image exists:

```json
{
  "id": "kimai-journey-map",
  "kind": "crop-region",
  "status": "planned",
  "sourceAssetId": "kimai-work-environment-sheet",
  "crop": {
    "x": 0,
    "y": 0,
    "width": 100,
    "height": 34,
    "unit": "percent"
  },
  "teachingRole": "슬라이드의 글과 함께 Act 0 전체 여정을 설명하고, 그림이 담당하는 구간은 그림 안의 요소만 짚어도 설명할 수 있게 하는 김아이 중심 여정 지도",
  "generationPrompt": "Use the top-row journey-map region from generated-decks/kimai-act0-prototype/prompts/kimai-work-environment-sheet.xml",
  "styleConstraints": [
    "white background",
    "minimal black linework",
    "one blue accent",
    "hand-drawn lecture illustration",
    "no photorealism",
    "no gradient",
    "no glossy treatment"
  ],
  "explanationAnchors": [
    "김아이는 빠르지만 회사 맥락은 모른다",
    "지시, 자료, 규칙, 매뉴얼은 서로 다른 역할이다",
    "역할과 도구를 나누면 판단이 덜 섞인다",
    "완료는 말이 아니라 검증 게이트로 확인한다",
    "오늘 4시간 동안 이 환경을 하나씩 만든다"
  ],
  "semanticRequirements": {
    "mustShow": [
      "김아이 또는 AI 신입사원이 중앙에 있어야 한다",
      "상사 또는 업무 요청자가 왼쪽에서 업무를 주는 모습이 보여야 한다",
      "업무 지시서가 첫 단계로 보여야 한다",
      "자료 또는 맥락이 업무 지시와 별도 요소로 보여야 한다",
      "회사 규칙판 또는 반복 규칙이 별도 요소로 보여야 한다",
      "업무 매뉴얼 또는 Skill 책자가 보여야 한다",
      "역할 분리 또는 작은 팀이 보여야 한다",
      "도구 또는 권한 연결이 보여야 한다",
      "완료 전 검증 게이트와 체크 표시가 마지막에 보여야 한다"
    ],
    "mustNotShow": [
      "김아이 없이 일반 아이콘만 일렬로 나열된 워크플로우",
      "추상적 도형만 있는 프로세스 다이어그램",
      "어두운 미래형 관제실",
      "설명할 요소가 없는 장식 배경"
    ],
    "teachingQuestions": [
      "슬라이드의 글과 함께 볼 때 오늘 배울 전체 흐름을 30초 안에 설명할 수 있는가?",
      "그림이 맡은 설명 구간은 그림만 보고도 말할 수 있을 만큼 구체적인가?",
      "지시, 자료, 규칙, 매뉴얼, 검증이 서로 다른 요소로 보이는가?",
      "김아이가 중심에 있어 신입 AI 비유가 유지되는가?"
    ],
    "minimumPassScore": 85
  },
  "alt": "김아이를 중심으로 지시, 자료, 규칙, 매뉴얼, 역할, 도구, 검증 게이트가 연결된 손그림 여정 지도",
  "notes": "Blocked until kimai-work-environment-sheet.png exists. Do not mark PASS without asset-review evidence."
}
```

- [x] **Step 4: Create exact image prompt file**

Create `generated-decks/kimai-act0-prototype/prompts/kimai-work-environment-sheet.xml`:

```xml
<image_instruction>
Create a single 16:9 hand-drawn lecture illustration sheet for a Korean general-audience AI workshop about a new AI employee named Kimai.
</image_instruction>

<style_constraints>
white background; minimal black linework; one blue accent; hand-drawn lecture illustration; no photorealism; no gradients; no glossy treatment; no dark cinematic background; no decorative stock illustration
</style_constraints>

<main_character>
Kimai is a friendly AI new employee. Kimai should be visually recognizable across all regions as a small rounded robot or office new-hire character with a simple face and one blue accent.
</main_character>

<sheet_layout>
Top row: one wide full journey map centered on Kimai.
Middle row: four panels for bad brief, good brief, context desk, and rule board.
Bottom row: five panels for skill manual, agent team, tool permissions, stop hook gate, and evaluation harness.
</sheet_layout>

<top_row_journey_map>
Show Kimai in the center. On the left, a manager gives a work request. Around Kimai, separate visible stations show: work instruction, context/materials, company rule board, skill/manual, role-split team, tools/permissions, and final verification gate with a check mark. This is not a generic icon workflow; it is Kimai's work environment.
</top_row_journey_map>

<panel_requirements>
bad brief: vague speech bubble, confused Kimai, multiple guessed outcomes, empty completion criteria.
good brief: structured instruction with goal, audience, constraints, completion criteria, output format, and result preview.
context desk: desk with mixed useful, stale, conflicting, and unnecessary material cards.
rule board: company rule board with three repeated rules and Kimai referencing it.
skill manual: manual cards labeled trigger, procedure, example, verification.
agent team: implementer, reviewer, researcher, and security roles with distinct information/tools.
tool permissions: tool box, permission badges, allowed and blocked tools, lock symbol.
stop hook gate: processing/complete status, checklist, gate, return loop if incomplete.
evaluation harness: user input, rule rubric, LLM judge, preview, feedback report, verification log.
</panel_requirements>

<teaching_requirement>
Slides will use text and image together. The image does not need to explain the entire lecture alone, but every region used for visual explanation must be specific enough that a presenter can point at the image elements and explain that part without reading a script.
</teaching_requirement>

<forbidden>
Do not create generic icons without Kimai. Do not create abstract process diagrams. Do not use neon, glow, 3D, cinematic darkness, stock illustration style, or background decoration that does not teach the concept.
</forbidden>
```

- [x] **Step 5: Validate contract remains blocked correctly**

Add this blocked review entry to `generated-decks/kimai-act0-prototype/asset-review.json` without referencing it from `slide-spec.json` yet:

```json
{
  "assetId": "kimai-journey-map",
  "status": "FAIL",
  "score": 0,
  "summary": "김아이 전용 이미지 시트가 아직 생성되지 않아 Act 0 여정 지도 의미 검수를 통과할 수 없다.",
  "mustShowResults": [
    { "label": "김아이 또는 AI 신입사원이 중앙에 있어야 한다", "result": "FAIL", "evidence": "이미지 파일이 아직 없어 중앙 캐릭터를 확인할 수 없다." },
    { "label": "상사 또는 업무 요청자가 왼쪽에서 업무를 주는 모습이 보여야 한다", "result": "FAIL", "evidence": "이미지 파일이 아직 없어 왼쪽 업무 요청자를 확인할 수 없다." },
    { "label": "업무 지시서가 첫 단계로 보여야 한다", "result": "FAIL", "evidence": "이미지 파일이 아직 없어 업무 지시서를 확인할 수 없다." },
    { "label": "자료 또는 맥락이 업무 지시와 별도 요소로 보여야 한다", "result": "FAIL", "evidence": "이미지 파일이 아직 없어 자료/맥락 요소를 확인할 수 없다." },
    { "label": "회사 규칙판 또는 반복 규칙이 별도 요소로 보여야 한다", "result": "FAIL", "evidence": "이미지 파일이 아직 없어 회사 규칙판을 확인할 수 없다." },
    { "label": "업무 매뉴얼 또는 Skill 책자가 보여야 한다", "result": "FAIL", "evidence": "이미지 파일이 아직 없어 매뉴얼 요소를 확인할 수 없다." },
    { "label": "역할 분리 또는 작은 팀이 보여야 한다", "result": "FAIL", "evidence": "이미지 파일이 아직 없어 역할 분리 요소를 확인할 수 없다." },
    { "label": "도구 또는 권한 연결이 보여야 한다", "result": "FAIL", "evidence": "이미지 파일이 아직 없어 도구/권한 요소를 확인할 수 없다." },
    { "label": "완료 전 검증 게이트와 체크 표시가 마지막에 보여야 한다", "result": "FAIL", "evidence": "이미지 파일이 아직 없어 검증 게이트를 확인할 수 없다." }
  ],
  "forbiddenElementFindings": [
    { "label": "김아이 없이 일반 아이콘만 일렬로 나열된 워크플로우", "observed": false, "evidence": "이미지 파일이 아직 없어 관찰 대상이 없다." },
    { "label": "추상적 도형만 있는 프로세스 다이어그램", "observed": false, "evidence": "이미지 파일이 아직 없어 관찰 대상이 없다." },
    { "label": "어두운 미래형 관제실", "observed": false, "evidence": "이미지 파일이 아직 없어 관찰 대상이 없다." },
    { "label": "설명할 요소가 없는 장식 배경", "observed": false, "evidence": "이미지 파일이 아직 없어 관찰 대상이 없다." }
  ]
}
```

This row is required so missing-image state is explicit. It must remain `FAIL` until the actual generated image is reviewed.

Run:

```bash
node deck-harness/scripts/validate-deck-contract.js generated-decks/kimai-act0-prototype; code=$?; printf 'EXIT_CODE=%s\n' "$code"
```

Expected: PASS with `EXIT_CODE=0`, because planned assets are allowed when not referenced by `slide-spec`.

Run:

```bash
node deck-harness/scripts/verify-deck-quality.js generated-decks/kimai-act0-prototype; code=$?; printf 'EXIT_CODE=%s\n' "$code"
```

Expected: still FAIL on current `kimai-workflow-map`, not on planned assets, with `EXIT_CODE=1`.

- [x] **Step 6: Prove referenced projector assets have semantic requirements**

Run:

```bash
node - <<'NODE'
const fs = require("fs");
const spec = JSON.parse(fs.readFileSync("generated-decks/kimai-act0-prototype/slide-spec.json", "utf8"));
const pack = JSON.parse(fs.readFileSync("generated-decks/kimai-act0-prototype/asset-pack.json", "utf8"));
const assets = new Map(pack.assets.map((asset) => [asset.id, asset]));
let failed = false;
for (const slide of spec.slides) {
  if (!slide.visualAssetId) continue;
  const asset = assets.get(slide.visualAssetId);
  if (!asset || !asset.semanticRequirements) {
    console.error(`${slide.id} visualAssetId ${slide.visualAssetId} missing semanticRequirements`);
    failed = true;
  }
}
if (failed) process.exit(1);
console.log("PASS referenced visual assets have semanticRequirements");
NODE
code=$?; printf 'EXIT_CODE=%s\n' "$code"
```

Expected:

```text
PASS referenced visual assets have semanticRequirements
EXIT_CODE=0
```

- [x] **Step 7: Prove Act 0 semantic gate matches source spec**

Run:

```bash
node - <<'NODE'
const fs = require("fs");
const pack = JSON.parse(fs.readFileSync("generated-decks/kimai-act0-prototype/asset-pack.json", "utf8"));
const review = JSON.parse(fs.readFileSync("generated-decks/kimai-act0-prototype/asset-review.json", "utf8"));
const asset = pack.assets.find((item) => item.id === "kimai-journey-map");
const reviewItem = review.assets.find((item) => item.assetId === "kimai-journey-map");
const required = [
  "김아이 또는 AI 신입사원이 중앙에 있어야 한다",
  "상사 또는 업무 요청자가 왼쪽에서 업무를 주는 모습이 보여야 한다",
  "업무 지시서가 첫 단계로 보여야 한다",
  "자료 또는 맥락이 업무 지시와 별도 요소로 보여야 한다",
  "회사 규칙판 또는 반복 규칙이 별도 요소로 보여야 한다",
  "업무 매뉴얼 또는 Skill 책자가 보여야 한다",
  "역할 분리 또는 작은 팀이 보여야 한다",
  "도구 또는 권한 연결이 보여야 한다",
  "완료 전 검증 게이트와 체크 표시가 마지막에 보여야 한다"
];
const mustShow = new Set(asset?.semanticRequirements?.mustShow || []);
const reviewed = new Set((reviewItem?.mustShowResults || []).map((row) => row.label));
const failures = [];
for (const label of required) {
  if (!mustShow.has(label)) failures.push(`semanticRequirements missing: ${label}`);
  if (!reviewed.has(label)) failures.push(`asset-review missing: ${label}`);
}
if (failures.length) {
  console.error(failures.join("\\n"));
  process.exit(1);
}
console.log("PASS Act 0 semantic gate covers source-spec required items");
NODE
code=$?; printf 'EXIT_CODE=%s\n' "$code"
```

Expected:

```text
PASS Act 0 semantic gate covers source-spec required items
EXIT_CODE=0
```

## Task 2: Generate and Register Kimai Sheet

**Files:**
- Create: `lecture-cuts/assets/generated/kimai-work-environment-sheet.png`
- Modify: `generated-decks/kimai-act0-prototype/asset-pack.json`
- Modify: `generated-decks/kimai-act0-prototype/slide-spec.json`
- Modify: `generated-decks/kimai-act0-prototype/asset-review.json`

- [x] **Step 1: Generate image from prompt**

Use the image generation prompt file from Task 1.

Expected output path:

```text
lecture-cuts/assets/generated/kimai-work-environment-sheet.png
```

- [x] **Step 2: Mark source sheet generated**

Change `kimai-work-environment-sheet.status` from `planned` to `generated`.

- [x] **Step 3: Mark crop asset cropped**

Change `kimai-journey-map.status` from `planned` to `cropped`.

Keep the initial crop:

```json
{
  "x": 0,
  "y": 0,
  "width": 100,
  "height": 34,
  "unit": "percent"
}
```

Adjust only after visual inspection if the top row boundaries are wrong.

- [x] **Step 4: Switch slide to Kimai journey map**

Before switching the slide, replace the missing-image review summary for `kimai-journey-map` with an honest generated-but-unreviewed failure:

```json
{
  "assetId": "kimai-journey-map",
  "status": "FAIL",
  "score": 0,
  "summary": "김아이 전용 이미지 시트 파일은 생성됐지만, 아직 실제 crop을 보고 semantic review를 완료하지 않았다. PASS로 처리할 수 없다."
}
```

Keep the full `mustShowResults` and `forbiddenElementFindings` arrays required by `asset-review.schema.json`; update their evidence from “이미지 파일이 아직 없어” to “이미지는 생성됐지만 아직 검수하지 않아”.

In `generated-decks/kimai-act0-prototype/slide-spec.json`, change:

```json
"visualAssetId": "kimai-workflow-map"
```

to:

```json
"visualAssetId": "kimai-journey-map"
```

- [x] **Step 5: Build and inspect generated crop**

Run:

```bash
node deck-harness/scripts/build-deck-from-spec.js generated-decks/kimai-act0-prototype; code=$?; printf 'EXIT_CODE=%s\n' "$code"
```

Expected:

```text
Built 1 slides in generated-decks/kimai-act0-prototype
EXIT_CODE=0
```

Confirm the cropped file exists:

```bash
test -f generated-decks/kimai-act0-prototype/assets/visuals/act0-workflow-map-kimai-journey-map.png; code=$?; printf 'EXIT_CODE=%s\n' "$code"
```

Expected:

```text
EXIT_CODE=0
```

The `act0-workflow-map` prefix is the slide id, not the old asset id. The suffix `kimai-journey-map` proves the file came from the new visual asset.

- [x] **Step 6: Prove asset traceability after build**

Run:

```bash
node - <<'NODE'
const fs = require("fs");
const vm = require("vm");
const pack = JSON.parse(fs.readFileSync("generated-decks/kimai-act0-prototype/asset-pack.json", "utf8"));
const context = { window: {} };
vm.createContext(context);
vm.runInContext(fs.readFileSync("generated-decks/kimai-act0-prototype/assets/slides.js", "utf8"), context);
const slide = context.window.DECK_SLIDES.find((item) => item.id === "act0-workflow-map");
const asset = pack.assets.find((item) => item.id === "kimai-journey-map");
const failures = [];
if (!slide) failures.push("missing slide registry");
if (!asset) failures.push("missing kimai-journey-map asset");
if (slide && slide.visualAssetId !== "kimai-journey-map") failures.push(`visualAssetId is ${slide.visualAssetId}`);
if (slide && !String(slide.renderedVisualAsset || "").includes("kimai-journey-map")) failures.push(`renderedVisualAsset is ${slide.renderedVisualAsset}`);
if (!asset.sourceAssetId || asset.sourceAssetId !== "kimai-work-environment-sheet") failures.push("sourceAssetId mismatch");
if (!asset.crop || asset.crop.width !== 100 || asset.crop.height !== 34) failures.push("crop contract mismatch");
if (failures.length) {
  console.error(failures.join("\\n"));
  process.exit(1);
}
console.log("PASS asset traceability kimai-journey-map -> kimai-work-environment-sheet -> renderedVisualAsset");
NODE
code=$?; printf 'EXIT_CODE=%s\n' "$code"
```

Expected:

```text
PASS asset traceability kimai-journey-map -> kimai-work-environment-sheet -> renderedVisualAsset
EXIT_CODE=0
```

- [x] **Step 7: Prove presenter review data exposes traceability**

Run:

```bash
node - <<'NODE'
const fs = require("fs");
const vm = require("vm");
const context = { window: {} };
vm.createContext(context);
vm.runInContext(fs.readFileSync("generated-decks/kimai-act0-prototype/assets/slides.js", "utf8"), context);
const slide = context.window.DECK_SLIDES.find((item) => item.id === "act0-workflow-map");
const review = (context.window.DECK_ASSET_REVIEWS || []).find((item) => item.assetId === "kimai-journey-map");
const failures = [];
if (!slide) failures.push("missing slide registry");
if (!slide?.assetCrop || slide.assetCrop.width !== 100 || slide.assetCrop.height !== 34) failures.push("missing crop coordinates in slide registry");
if (!slide?.renderedVisualAsset?.includes("kimai-journey-map")) failures.push("missing renderedVisualAsset trace");
if (!slide?.assetSemanticRequirements?.mustShow?.length) failures.push("missing semantic requirements in slide registry");
if (!review) failures.push("missing asset review data");
if (review && (review.status === undefined || review.score === undefined || !review.summary)) failures.push("review status/score/summary missing");
if (review && !Array.isArray(review.mustShowResults)) failures.push("review mustShowResults missing");
if (review && !Array.isArray(review.forbiddenElementFindings)) failures.push("review forbiddenElementFindings missing");
if (failures.length) {
  console.error(failures.join("\\n"));
  process.exit(1);
}
console.log("PASS presenter review data traceability is available in slides.js");
NODE
code=$?; printf 'EXIT_CODE=%s\n' "$code"
```

Expected:

```text
PASS presenter review data traceability is available in slides.js
EXIT_CODE=0
```

At this point the review status may still be `FAIL`. That is correct before Task 3 because the generated crop has not been semantically reviewed yet. It must not say the image file is missing.

## Task 3: Semantic Review and Quality Gate

**Files:**
- Modify: `generated-decks/kimai-act0-prototype/asset-review.json`
- Generated: `generated-decks/kimai-act0-prototype/assets/slides.js`

- [x] **Step 1: Confirm review envelope**

Before editing review entries, ensure `asset-review.json` has:

```json
{
  "reviewedAt": "2026-05-28",
  "reviewMethod": "manual-visual-inspection",
  "assets": []
}
```

If the date is not `2026-05-28`, use the environment current date from the session.

- [x] **Step 2: Write honest review**

Add or replace the review entry for `kimai-journey-map`.

The evidence fields below are examples of the required specificity, not boilerplate. Replace every evidence sentence with concrete observed elements from the actual generated crop, such as positions, visible objects, labels, or relations. Do not write `별도 요소로 보인다` unless the evidence says what the element is and where it appears.

If the generated image is good, use this structure. Replace every `<observed ...>` value with concrete observations from the actual rendered crop. Do not leave angle-bracket placeholders in the final file.

```json
{
  "assetId": "kimai-journey-map",
  "status": "PASS",
  "score": 85,
  "summary": "<observed summary explaining why the slide text and image together can guide Act 0, and which image elements handle the image-owned explanation segment>",
  "mustShowResults": [
    { "label": "김아이 또는 AI 신입사원이 중앙에 있어야 한다", "result": "PASS", "evidence": "<observed location, appearance, and relation of Kimai to surrounding elements>" },
    { "label": "상사 또는 업무 요청자가 왼쪽에서 업무를 주는 모습이 보여야 한다", "result": "PASS", "evidence": "<observed location, appearance, and relation of the left-side requester/manager to Kimai and the first instruction>" },
    { "label": "업무 지시서가 첫 단계로 보여야 한다", "result": "PASS", "evidence": "<observed location and appearance of the work instruction element>" },
    { "label": "자료 또는 맥락이 업무 지시와 별도 요소로 보여야 한다", "result": "PASS", "evidence": "<observed location and appearance of the separate context/materials element>" },
    { "label": "회사 규칙판 또는 반복 규칙이 별도 요소로 보여야 한다", "result": "PASS", "evidence": "<observed location and appearance of the rule board or repeated-rule element>" },
    { "label": "업무 매뉴얼 또는 Skill 책자가 보여야 한다", "result": "PASS", "evidence": "<observed location and appearance of the manual/Skill element>" },
    { "label": "역할 분리 또는 작은 팀이 보여야 한다", "result": "PASS", "evidence": "<observed location and appearance of separated roles or team members>" },
    { "label": "도구 또는 권한 연결이 보여야 한다", "result": "PASS", "evidence": "<observed location and appearance of tools, permissions, badges, locks, or connections>" },
    { "label": "완료 전 검증 게이트와 체크 표시가 마지막에 보여야 한다", "result": "PASS", "evidence": "<observed location and appearance of final gate and check mark>" }
  ],
  "forbiddenElementFindings": [
    { "label": "김아이 없이 일반 아이콘만 일렬로 나열된 워크플로우", "observed": false, "evidence": "<observed reason this is not a generic icon-only workflow>" },
    { "label": "추상적 도형만 있는 프로세스 다이어그램", "observed": false, "evidence": "<observed concrete objects that replace abstract-only shapes>" },
    { "label": "어두운 미래형 관제실", "observed": false, "evidence": "<observed background/style evidence>" },
    { "label": "설명할 요소가 없는 장식 배경", "observed": false, "evidence": "<observed teaching elements that make the image explanatory>" }
  ]
}
```

If any must-show item is missing, mark `status: "FAIL"` and do not force PASS.

- [x] **Step 3: Prove review evidence is not boilerplate**

Run:

```bash
node - <<'NODE'
const fs = require("fs");
const review = JSON.parse(fs.readFileSync("generated-decks/kimai-act0-prototype/asset-review.json", "utf8"));
const item = review.assets.find((asset) => asset.assetId === "kimai-journey-map");
const failures = [];
if (!item) failures.push("missing kimai-journey-map review");
const texts = [
  item?.summary,
  ...(item?.mustShowResults || []).map((row) => row.evidence),
  ...(item?.forbiddenElementFindings || []).map((row) => row.evidence)
].filter(Boolean);
for (const text of texts) {
  if (text.includes("<observed")) failures.push(`placeholder evidence remains: ${text}`);
  if (/별도 요소로 보인다|보인다\\.?$/.test(text.trim())) failures.push(`boilerplate evidence too vague: ${text}`);
}
if (failures.length) {
  console.error(failures.join("\\n"));
  process.exit(1);
}
console.log("PASS kimai-journey-map review evidence is concrete enough for verifier review");
NODE
code=$?; printf 'EXIT_CODE=%s\n' "$code"
```

Expected:

```text
PASS kimai-journey-map review evidence is concrete enough for verifier review
EXIT_CODE=0
```

- [x] **Step 4: Prove old failing asset is no longer referenced**

Run:

```bash
node - <<'NODE'
const fs = require("fs");
const spec = JSON.parse(fs.readFileSync("generated-decks/kimai-act0-prototype/slide-spec.json", "utf8"));
const refs = spec.slides.map((slide) => `${slide.id}:${slide.visualAssetId || ""}`);
if (refs.some((entry) => entry.includes("kimai-workflow-map"))) {
  console.error(`old asset still referenced: ${refs.join(", ")}`);
  process.exit(1);
}
console.log(`PASS old kimai-workflow-map no longer referenced: ${refs.join(", ")}`);
NODE
code=$?; printf 'EXIT_CODE=%s\n' "$code"
```

Expected:

```text
PASS old kimai-workflow-map no longer referenced: act0-workflow-map:kimai-journey-map
EXIT_CODE=0
```

- [x] **Step 5: Rebuild after final review edit**

Because `build-deck-from-spec.js` embeds `asset-review.json` into `assets/slides.js`, run a fresh build after editing the final review:

```bash
node deck-harness/scripts/build-deck-from-spec.js generated-decks/kimai-act0-prototype; code=$?; printf 'EXIT_CODE=%s\n' "$code"
```

Expected:

```text
Built 1 slides in generated-decks/kimai-act0-prototype
EXIT_CODE=0
```

- [x] **Step 6: Prove final presenter review data is current**

Run:

```bash
node - <<'NODE'
const fs = require("fs");
const vm = require("vm");
const context = { window: {} };
vm.createContext(context);
vm.runInContext(fs.readFileSync("generated-decks/kimai-act0-prototype/assets/slides.js", "utf8"), context);
const slide = context.window.DECK_SLIDES.find((item) => item.id === "act0-workflow-map");
const review = (context.window.DECK_ASSET_REVIEWS || []).find((item) => item.assetId === "kimai-journey-map");
const failures = [];
const stalePatterns = [
  "아직 생성되지",
  "이미지 파일이 아직 없어",
  "아직 실제 crop을 보고",
  "아직 검수하지 않아",
  "<observed"
];
if (!slide) failures.push("missing slide registry");
if (slide?.visualAssetId !== "kimai-journey-map") failures.push(`visualAssetId is ${slide?.visualAssetId}`);
if (!slide?.assetCrop || slide.assetCrop.width !== 100 || slide.assetCrop.height !== 34) failures.push("crop coordinates missing");
if (!slide?.renderedVisualAsset?.includes("kimai-journey-map")) failures.push("rendered visual path missing kimai-journey-map");
if (!review) failures.push("missing kimai-journey-map review");
if (review?.status !== "PASS") failures.push(`review status is ${review?.status}`);
if (Number(review?.score) < 85) failures.push(`review score is ${review?.score}`);
const reviewTexts = [
  review?.summary,
  ...(review?.mustShowResults || []).map((row) => row.evidence),
  ...(review?.forbiddenElementFindings || []).map((row) => row.evidence)
].filter(Boolean);
for (const text of reviewTexts) {
  if (stalePatterns.some((pattern) => text.includes(pattern))) {
    failures.push(`stale review evidence: ${text}`);
  }
}
if (!Array.isArray(review?.mustShowResults) || !review.mustShowResults.every((row) => row.result === "PASS")) failures.push("not all mustShowResults PASS");
if (!Array.isArray(review?.forbiddenElementFindings) || review.forbiddenElementFindings.some((row) => row.observed)) failures.push("forbidden element observed");
if (failures.length) {
  console.error(failures.join("\\n"));
  process.exit(1);
}
console.log("PASS final presenter review data matches kimai-journey-map PASS review");
NODE
code=$?; printf 'EXIT_CODE=%s\n' "$code"
```

Expected if the final review is genuinely PASS:

```text
PASS final presenter review data matches kimai-journey-map PASS review
EXIT_CODE=0
```

If the generated image is not acceptable, this command should fail. Do not bypass it.

- [x] **Step 7: Run quality gate**

Run:

```bash
node deck-harness/scripts/verify-deck-quality.js generated-decks/kimai-act0-prototype; code=$?; printf 'EXIT_CODE=%s\n' "$code"
```

Expected if image is acceptable:

```text
PASS visual semantic reviews
PASS projector fit
PASS browser render
EXIT_CODE=0
```

Expected if image is not acceptable:

```text
FAIL act0-workflow-map visual semantic review failed for kimai-journey-map: FAIL
EXIT_CODE=1
```

Do not proceed to completion if the failure is legitimate.

## Task 4: Visual Inspection

**Files:**
- Generated screenshots under the Playwright output directory.

- [x] **Step 1: Start local server**

Run in a separate terminal/session:

```bash
python3 -m http.server 4178
```

- [x] **Step 2: Run automated Playwright visual verifier**

Use the available Playwright MCP tools or an equivalent local Playwright runner. The verifier must perform these actions:

```text
1. Open http://127.0.0.1:4178/generated-decks/kimai-act0-prototype/deck.html.
2. Resize to 1440x900 and capture a screenshot.
3. Resize to 1024x768 and capture a screenshot.
4. Check the accessibility snapshot or DOM text includes the Act 0 headline and uses image alt text for kimai-journey-map.
5. Open http://127.0.0.1:4178/generated-decks/kimai-act0-prototype/presenter-review.html.
6. Check the snapshot includes Visual Semantic Contract, Visual Review Status, PASS, score, source/crop/rendered asset trace fields when available, and forbiddenElementFindings.
7. Save screenshot artifact names in the final report.
```

If using MCP tools directly, the main agent must report each successful navigation/screenshot/snapshot and treat any missing item as failure.

If using a local script, it must end with:

```text
PASS playwright visual inspection
EXIT_CODE=0
```

- [x] **Step 3: Record human visual judgment**

After automated checks, inspect the screenshots and record a blunt judgment:

```text
1. 김아이가 중심에 보이는가?
2. 슬라이드 글과 그림이 함께 발표 흐름을 만든다.
3. 그림이 담당하는 설명 구간은 그림 안 요소를 짚어 설명 가능하다.
4. 1024px 화면에서 주요 요소가 잘리지 않는다.
5. generic workflow icon처럼 보이지 않는다.
6. presenter review에서 sourceAssetId, crop 좌표, renderedVisualAsset, score, evidence를 추적할 수 있다.
```

If any item is false, do not mark the task complete even if automated scripts pass.

- [x] **Step 4: Stop local server**

Stop the HTTP server before final report.

- [x] **Step 5: Report visual inspection evidence**

Final task report must include:

```text
1. Screenshot paths
2. Viewports checked
3. PASS/FAIL judgment for each human visual criterion
4. Any remaining visual risks
```

## Final Review Protocol

For each task:

1. Worker subagent implements the task.
2. Critical Visual Harness Verifier reviews with the checklist in this plan.
3. Main agent runs the relevant commands locally.
4. Main agent closes used agents.
5. If verifier requests changes, dispatch worker again before proceeding.

## Completion Criteria

This implementation is complete only when:

- `kimai-work-environment-sheet.png` exists.
- `kimai-journey-map` is generated as a real cropped file.
- `slide-spec.json` references `kimai-journey-map`.
- `asset-review.json` marks `kimai-journey-map` PASS with score >= 85.
- `verify-deck-quality` exits 0.
- Playwright visual inspection confirms the slide is Kimai-centered and not a generic workflow.
