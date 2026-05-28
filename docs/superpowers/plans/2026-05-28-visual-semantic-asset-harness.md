# Visual Semantic Asset Harness Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the deck harness reject image assets whose visible meaning does not satisfy the slide's teaching role, so weak "generic workflow icon" assets cannot pass as "Kimai-centered journey map" assets.

**Architecture:** Add an explicit visual semantic contract to `asset-pack.json`, validate that contract in `validate-deck-contract.js`, surface it in generated slide registry and presenter review, and require a review artifact before projector quality passes. The first implementation uses deterministic contract checks plus a manual/LLM-ready `asset-review.json` file; later image vision can populate the same review format without changing slide specs.

**Tech Stack:** Node.js CommonJS scripts, JSON contract files, existing deck-harness build/verify scripts, generated HTML/CSS deck assets.

---

## File Structure

- Modify: `AGENTS.md`
  - Add rule: main agent orchestrates, implementation and review work should be delegated to subagents when explicitly requested.
  - Add rule: visual asset quality problems must be fixed through asset contract/review workflow, not by replacing rendered HTML.
- Modify: `deck-harness/asset-pack.schema.json`
  - Add `semanticRequirements` object for each explainable visual asset.
  - Fields: `mustShow`, `mustNotShow`, `teachingQuestions`, `minimumPassScore`.
- Modify: `deck-harness/scripts/validate-deck-contract.js`
  - Validate `semanticRequirements` shape and thresholds.
  - Require referenced projector visual assets to have semantic requirements.
- Modify: `deck-harness/scripts/build-deck-from-spec.js`
  - Preserve semantic requirements in `assets/slides.js` registry.
- Modify: `deck-harness/scripts/verify-deck-quality.js`
  - Read optional `asset-review.json`.
  - Require a PASS review for every `visualAssetId` used by projector slides.
  - Fail if review misses any `mustShow`, includes any `mustNotShow`, or score is lower than `minimumPassScore`.
- Modify: `deck-harness/templates/assets/presenter-review.js`
  - Display semantic requirements and visual review status in presenter review.
- Modify: `deck-harness/README.md`
  - Document visual semantic asset workflow.
- Modify: `deck-harness/skills/slide-spec-builder/SKILL.md`
  - Require semantic requirements when defining visual assets.
- Modify: `deck-harness/skills/html-css-deck-builder/SKILL.md`
  - Require asset review before final quality gate.
- Modify: `generated-decks/kimai-act0-prototype/asset-pack.json`
  - Add Kimai-centered semantic requirements for `kimai-workflow-map`.
- Create: `generated-decks/kimai-act0-prototype/asset-review.json`
  - Review the current asset honestly. If it is still generic, mark status `FAIL`; after using a Kimai-specific acceptable asset, mark `PASS`.

## Task 1: Visual Asset Contract

**Files:**
- Modify: `deck-harness/asset-pack.schema.json`
- Modify: `deck-harness/scripts/validate-deck-contract.js`
- Modify: `generated-decks/kimai-act0-prototype/asset-pack.json`

- [ ] **Step 1: Write the failing contract case**

Run:

```bash
node deck-harness/scripts/validate-deck-contract.js generated-decks/kimai-act0-prototype
```

Expected before implementation: PASS, which is wrong because `kimai-workflow-map` has no semantic requirements.

- [ ] **Step 2: Add semantic requirements to schema**

Add this property to asset items in `deck-harness/asset-pack.schema.json`:

```json
"semanticRequirements": {
  "type": "object",
  "additionalProperties": false,
  "required": ["mustShow", "mustNotShow", "teachingQuestions", "minimumPassScore"],
  "properties": {
    "mustShow": {
      "type": "array",
      "minItems": 3,
      "items": { "type": "string", "minLength": 1 }
    },
    "mustNotShow": {
      "type": "array",
      "items": { "type": "string", "minLength": 1 }
    },
    "teachingQuestions": {
      "type": "array",
      "minItems": 2,
      "items": { "type": "string", "minLength": 1 }
    },
    "minimumPassScore": {
      "type": "number",
      "minimum": 0,
      "maximum": 100
    }
  }
}
```

- [ ] **Step 3: Validate semantic requirements in contract script**

In `readAssetPack`, add checks:

```js
function validateSemanticRequirements(asset) {
  assert(asset.semanticRequirements && typeof asset.semanticRequirements === "object", `${asset.id}.semanticRequirements is required`);
  const requirements = asset.semanticRequirements;
  assert(Array.isArray(requirements.mustShow) && requirements.mustShow.length >= 3, `${asset.id}.semanticRequirements.mustShow requires at least 3 items`);
  assert(Array.isArray(requirements.mustNotShow), `${asset.id}.semanticRequirements.mustNotShow must be an array`);
  assert(Array.isArray(requirements.teachingQuestions) && requirements.teachingQuestions.length >= 2, `${asset.id}.semanticRequirements.teachingQuestions requires at least 2 items`);
  assert(Number.isFinite(requirements.minimumPassScore), `${asset.id}.semanticRequirements.minimumPassScore is required`);
  assert(requirements.minimumPassScore >= 0 && requirements.minimumPassScore <= 100, `${asset.id}.semanticRequirements.minimumPassScore must be 0-100`);
}
```

Call it for assets with `status !== "planned"` and for any asset referenced by `visualAssetId`.

- [ ] **Step 4: Add Kimai semantic requirements to prototype asset**

For `kimai-workflow-map`, add:

```json
"semanticRequirements": {
  "mustShow": [
    "김아이 또는 AI 신입사원이 중심에 있어야 한다",
    "업무 지시가 시작점으로 보여야 한다",
    "자료 또는 맥락이 별도 요소로 보여야 한다",
    "매뉴얼 또는 반복 규칙이 별도 요소로 보여야 한다",
    "완료 전 검증 게이트가 보여야 한다"
  ],
  "mustNotShow": [
    "김아이 없이 일반 아이콘만 나열된 워크플로우",
    "강의 내용과 무관한 장식용 배경",
    "발표자가 설명할 수 없는 추상 도형"
  ],
  "teachingQuestions": [
    "이 이미지만 보고 김아이가 왜 회사 맥락을 모르는지 설명할 수 있는가?",
    "이 이미지만 보고 지시, 자료, 매뉴얼, 검증의 차이를 짚을 수 있는가?"
  ],
  "minimumPassScore": 80
}
```

- [ ] **Step 5: Run contract validation**

Run:

```bash
node deck-harness/scripts/validate-deck-contract.js generated-decks/kimai-act0-prototype
```

Expected after implementation: PASS asset pack.

## Task 2: Asset Review Quality Gate

**Files:**
- Modify: `deck-harness/scripts/verify-deck-quality.js`
- Create: `generated-decks/kimai-act0-prototype/asset-review.json`

- [ ] **Step 1: Write failing review gate**

Run:

```bash
node deck-harness/scripts/verify-deck-quality.js generated-decks/kimai-act0-prototype
```

Expected before implementation: PASS, which is wrong because no visual semantic review exists.

- [ ] **Step 2: Add review reader**

Add:

```js
function readOptionalJson(deckDir, file) {
  const filePath = path.join(deckDir, file);
  if (!fs.existsSync(filePath)) {
    return null;
  }
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}
```

- [ ] **Step 3: Add visual semantic review check**

Add:

```js
function checkVisualSemanticReviews(deckDir, spec, assetPack) {
  const review = readOptionalJson(deckDir, "asset-review.json");
  if (!review || !Array.isArray(review.assets)) {
    throw new Error("asset-review.json missing; visual semantic review is required before projector quality PASS");
  }
  const reviews = new Map(review.assets.map((item) => [item.assetId, item]));
  spec.slides.forEach((slide) => {
    if (!slide.visualAssetId) return;
    const asset = (assetPack.assets || []).find((item) => item.id === slide.visualAssetId);
    const item = reviews.get(slide.visualAssetId);
    if (!item) {
      throw new Error(`${slide.id} missing visual semantic review for ${slide.visualAssetId}`);
    }
    if (item.status !== "PASS") {
      throw new Error(`${slide.id} visual semantic review failed for ${slide.visualAssetId}: ${item.status}`);
    }
    const requirements = asset.semanticRequirements;
    if (Number(item.score) < requirements.minimumPassScore) {
      throw new Error(`${slide.id} visual semantic score ${item.score} below ${requirements.minimumPassScore}`);
    }
    const missing = requirements.mustShow.filter((label) => !(item.mustShowResults || []).some((result) => result.label === label && result.result === "PASS"));
    if (missing.length) {
      throw new Error(`${slide.id} visual semantic review missing mustShow: ${missing.join("; ")}`);
    }
    const forbidden = item.forbiddenElementFindings.filter((finding) => finding.observed).map((finding) => finding.label);
    if (forbidden.length) {
      throw new Error(`${slide.id} visual semantic review includes forbidden elements: ${forbidden.join("; ")}`);
    }
  });
  console.log("PASS visual semantic reviews");
}
```

- [ ] **Step 4: Create honest review artifact**

For the current generic workflow asset, create `generated-decks/kimai-act0-prototype/asset-review.json` with:

```json
{
  "reviewedAt": "2026-05-28",
  "reviewMethod": "manual-visual-inspection",
  "assets": [
    {
      "assetId": "kimai-workflow-map",
      "status": "FAIL",
      "score": 55,
      "summary": "이미지는 지시서, 매뉴얼, 검증 흐름은 보이지만 김아이 또는 AI 신입사원이 중심에 없어 김아이 중심 여정 지도 요구를 만족하지 못한다.",
      "mustShowResults": [
        { "label": "김아이 또는 AI 신입사원이 중심에 있어야 한다", "result": "FAIL", "evidence": "중심 캐릭터가 없다." },
        { "label": "업무 지시가 시작점으로 보여야 한다", "result": "PASS", "evidence": "말풍선이 시작점으로 보인다." },
        { "label": "자료 또는 맥락이 별도 요소로 보여야 한다", "result": "FAIL", "evidence": "자료와 지시서의 구분이 불명확하다." },
        { "label": "매뉴얼 또는 반복 규칙이 별도 요소로 보여야 한다", "result": "PASS", "evidence": "체크리스트가 있는 책이 보인다." },
        { "label": "완료 전 검증 게이트가 보여야 한다", "result": "PASS", "evidence": "게이트와 완료 체크가 보인다." }
      ],
      "forbiddenElementFindings": [
        { "label": "김아이 없이 일반 아이콘만 나열된 워크플로우", "observed": true, "evidence": "현재 이미지가 이 상태다." },
        { "label": "강의 내용과 무관한 장식용 배경", "observed": false, "evidence": "장식 배경은 없다." },
        { "label": "발표자가 설명할 수 없는 추상 도형", "observed": false, "evidence": "각 아이콘은 설명 가능하다." }
      ]
    }
  ]
}
```

For `forbiddenElementFindings`, `observed: true` means the forbidden element is present and must fail projector quality. `observed: false` means that forbidden element was not seen.

- [ ] **Step 5: Verify failure is meaningful**

Run:

```bash
node deck-harness/scripts/verify-deck-quality.js generated-decks/kimai-act0-prototype
```

Expected: FAIL with visual semantic review failed. This is correct until a Kimai-specific asset is registered.

## Task 3: Review Surface and Workflow Documentation

**Files:**
- Modify: `deck-harness/scripts/build-deck-from-spec.js`
- Modify: `deck-harness/templates/assets/presenter-review.js`
- Modify: `deck-harness/README.md`
- Modify: `deck-harness/skills/slide-spec-builder/SKILL.md`
- Modify: `deck-harness/skills/html-css-deck-builder/SKILL.md`
- Modify: `AGENTS.md`

- [ ] **Step 1: Preserve semantic requirements in registry**

In the registry object inside `build-deck-from-spec.js`, add:

```js
assetSemanticRequirements: builtSlide.assetRecord?.semanticRequirements || null,
```

- [ ] **Step 2: Show semantic requirements in presenter review**

In `presenter-review.js`, render a section named `Visual Semantic Contract` with `mustShow`, `mustNotShow`, `teachingQuestions`, and `minimumPassScore`.

- [ ] **Step 3: Document the workflow**

Add this rule to `AGENTS.md`:

```markdown
- 사용자가 서브에이전트 위임을 명시하면 메인 에이전트는 계획, 위임, 리뷰, 검증 오케스트레이션을 맡고 실제 구현 단위는 worker/reviewer subagent에 맡긴다. 단, 최종 통합 검증과 사용자 보고는 메인 에이전트가 책임진다.
- 이미지 자산 품질은 `asset-pack.semanticRequirements`와 `asset-review.json`으로 관리한다. 시각 의미가 맞지 않는 문제는 이미지 파일만 교체하지 말고 자산 계약, 리뷰 결과, 검증 게이트를 함께 갱신한다.
```

- [ ] **Step 4: Update deck-harness docs and skills**

Document that final projector PASS requires:

```text
asset-pack.json semanticRequirements
asset-review.json PASS
build-deck-from-spec
verify-deck-quality
visual inspection screenshots
```

- [ ] **Step 5: Run final verification**

Run:

```bash
node deck-harness/scripts/validate-deck-contract.js generated-decks/kimai-act0-prototype
node deck-harness/scripts/verify-deck-quality.js generated-decks/kimai-act0-prototype
```

Expected:
- Contract validation PASS.
- Quality verification FAIL while current generic asset is used, with a clear visual semantic error.

## Review and Test Protocol

After each task:

1. Spec reviewer subagent checks only whether the task matches this plan.
2. Code quality reviewer subagent checks maintainability, accidental scope expansion, and brittle validation.
3. Main orchestrator runs the relevant command locally.
4. Main orchestrator does not mark the task complete until reviewer issues are resolved.

Final expected state:

- Harness can now fail honestly when the image is not Kimai-centered.
- The current prototype may intentionally fail `verify-deck-quality` until a Kimai-specific image asset is generated and reviewed as PASS.
- This is acceptable because the harness is now catching the real quality issue instead of pretending the deck is complete.
