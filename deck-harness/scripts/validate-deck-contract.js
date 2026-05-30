#!/usr/bin/env node
const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = path.resolve(__dirname, "..", "..");
const requiredFiles = ["claim-source-map.json", "section-plan.json", "slide-spec.json", "glossary.json", "job-manifest.json"];
const forbiddenSlideKeys = new Set(["source", "url", "checkedDate", "sourceType", "confidence", "sourceSummary", "sourceUrl", "sources"]);
const allowedVisualTypes = new Set(["generated-image", "existing-image", "practice-ui", "artifact", "minimal-diagram"]);
const allowedInteractionTypes = new Set(["none", "tooltip", "click-reveal", "input-form", "checklist", "preview"]);
const allowedAssetKeys = new Set([
  "id",
  "kind",
  "status",
  "sourcePath",
  "sourceAssetId",
  "sheetLayout",
  "sheetCellIndex",
  "crop",
  "cropPolicy",
  "expectedSubjectBounds",
  "cropSafety",
  "cropMasks",
  "teachingRole",
  "generationPrompt",
  "xmlPrompt",
  "styleConstraints",
  "characterRefs",
  "explanationAnchors",
  "semanticRequirements",
  "alt",
  "notes",
]);
const assetIdPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const allowedCropKeys = new Set(["x", "y", "width", "height", "unit"]);
const allowedCropSafetyKeys = new Set([
  "safeMarginPercent",
  "edgeBandPercent",
  "maxEdgeInkRatio",
  "maxEdgeLineCoverage",
  "maxAdjacentPanelInkRatio",
  "reviewerRequired",
  "forbiddenEdgeArtifacts",
]);
const allowedCropMaskKeys = new Set(["kind", "x", "y", "width", "height", "unit"]);
const allowedSheetLayoutKeys = new Set([
  "columns",
  "rows",
  "insetPercent",
  "gutterPercent",
  "safeMarginPercent",
  "panelCount",
  "cellOrder",
  "sourceWidthPx",
  "sourceHeightPx",
  "cellWidthPx",
  "cellHeightPx",
  "panelAspectRatio",
]);
const allowedSemanticRequirementKeys = new Set(["mustShow", "mustNotShow", "teachingQuestions", "minimumPassScore"]);
const allowedAssetXmlPromptKeys = new Set(["instruction", "assetRequirement", "negativePrompt", "reviewChecklist"]);

function usage() {
  console.error("Usage: node deck-harness/scripts/validate-deck-contract.js [--stage=structure|projector] <deck-dir>");
  process.exit(1);
}

function parseArgs(argv) {
  const options = { stage: "projector", deckDirInput: null };
  argv.forEach((arg) => {
    if (arg.startsWith("--stage=")) {
      options.stage = arg.slice("--stage=".length);
      return;
    }
    if (arg === "--structure-only") {
      options.stage = "structure";
      return;
    }
    if (arg === "--projector") {
      options.stage = "projector";
      return;
    }
    if (!options.deckDirInput) {
      options.deckDirInput = arg;
      return;
    }
    usage();
  });
  if (!["structure", "projector"].includes(options.stage)) {
    usage();
  }
  return options;
}

function resolveDeckDir(input) {
  if (!input) {
    usage();
  }
  return path.isAbsolute(input) ? input : path.join(root, input);
}

function readJson(deckDir, file) {
  return JSON.parse(fs.readFileSync(path.join(deckDir, file), "utf8"));
}

function resolveAssetPath(deckDir, sourcePath) {
  if (!sourcePath) return "";
  if (path.isAbsolute(sourcePath)) return sourcePath;
  const deckRelative = path.join(deckDir, sourcePath);
  if (sourcePath.startsWith("assets/") || fs.existsSync(deckRelative)) return deckRelative;
  return path.join(root, sourcePath);
}

function readAssetPack(deckDir) {
  const assetPackPath = path.join(deckDir, "asset-pack.json");
  if (!fs.existsSync(assetPackPath)) {
    return { assets: [] };
  }
  const assetPack = JSON.parse(fs.readFileSync(assetPackPath, "utf8"));
  assert(assetPack && typeof assetPack === "object" && !Array.isArray(assetPack), "asset-pack must be an object");
  Object.keys(assetPack).forEach((key) => assert(key === "assets", `asset-pack unknown top-level key: ${key}`));
  assert(Array.isArray(assetPack.assets), "asset-pack.assets must be an array");
  const ids = new Set();
  assetPack.assets.forEach((asset) => {
    assert(asset && typeof asset === "object" && !Array.isArray(asset), "asset-pack assets must be objects");
    Object.keys(asset).forEach((key) => assert(allowedAssetKeys.has(key), `${asset.id || "asset"} unknown key: ${key}`));
    assert(typeof asset.id === "string" && asset.id.trim(), "asset id must be a non-empty string");
    assert(assetIdPattern.test(asset.id), `${asset.id}.id must match ${assetIdPattern}`);
    assert(!ids.has(asset.id), `asset id must be unique: ${asset.id}`);
    ids.add(asset.id);
    assert(["single-image", "sprite-sheet", "crop-region", "existing-image"].includes(asset.kind), `${asset.id}.kind is invalid`);
    assert(["planned", "existing", "generated", "cropped"].includes(asset.status), `${asset.id}.status is invalid`);
    assertNonEmptyString(asset.teachingRole, `${asset.id}.teachingRole`);
    assertNonEmptyString(asset.generationPrompt, `${asset.id}.generationPrompt`);
    if (asset.xmlPrompt !== undefined) {
      validateAssetXmlPrompt(asset);
    }
    assertStringArray(asset.explanationAnchors, `${asset.id}.explanationAnchors`, 1);
    if (asset.styleConstraints !== undefined) {
      assertStringArray(asset.styleConstraints, `${asset.id}.styleConstraints`, 0);
    }
    if (asset.characterRefs !== undefined) {
      assertStringArray(asset.characterRefs, `${asset.id}.characterRefs`, 1);
      asset.characterRefs.forEach((ref) => {
        assert(["kimai", "choi-ai", "park-ai", "manager"].includes(ref), `${asset.id}.characterRefs contains unknown character: ${ref}`);
      });
    }
    if (asset.alt !== undefined) {
      assertNonEmptyString(asset.alt, `${asset.id}.alt`);
    }
    if (asset.sourcePath !== undefined) {
      assertNonEmptyString(asset.sourcePath, `${asset.id}.sourcePath`);
      if (asset.status !== "planned") {
        assert(fs.existsSync(resolveAssetPath(deckDir, asset.sourcePath)), `${asset.id}.sourcePath does not exist: ${asset.sourcePath}`);
      }
    }
    if (asset.sheetLayout !== undefined) {
      validateSheetLayout(asset);
      if (asset.kind === "sprite-sheet") {
        assert(asset.xmlPrompt?.assetRequirement, `${asset.id}.xmlPrompt.assetRequirement is required for sheet coordinate contract`);
      }
      if (asset.status !== "planned" && asset.sourcePath) {
        validateSheetDimensions(deckDir, asset);
      }
    }
    if (asset.sheetCellIndex !== undefined) {
      assert(Number.isInteger(asset.sheetCellIndex) && asset.sheetCellIndex >= 1, `${asset.id}.sheetCellIndex must be a positive integer`);
    }
    if (asset.notes !== undefined) {
      assert(typeof asset.notes === "string", `${asset.id}.notes must be a string`);
    }
    if (asset.cropPolicy !== undefined) {
      assert(asset.cropPolicy === "content-safe", `${asset.id}.cropPolicy is invalid`);
    }
    if (asset.cropMasks !== undefined) {
      validateCropMasks(asset);
    }
    if (asset.expectedSubjectBounds !== undefined) {
      validateExpectedSubjectBounds(asset);
    }
    if (asset.cropSafety !== undefined) {
      validateCropSafety(asset);
    }
    if (asset.kind !== "crop-region" && asset.status !== "planned") {
      assert(asset.sourcePath, `${asset.id} requires sourcePath unless it is planned or crop-region`);
    }
    if (asset.kind === "crop-region") {
      assert(asset.sourceAssetId && asset.crop, `${asset.id} crop-region requires sourceAssetId and crop`);
      assert(assetIdPattern.test(asset.sourceAssetId), `${asset.id}.sourceAssetId must match ${assetIdPattern}`);
      const sourceAsset = assetPack.assets.find((item) => item.id === asset.sourceAssetId);
      assert(sourceAsset, `${asset.id} references missing sourceAssetId ${asset.sourceAssetId}`);
      assert(sourceAsset.sourcePath, `${asset.id} source asset ${asset.sourceAssetId} requires sourcePath`);
      validateCrop(asset);
      if (sourceAsset.sheetLayout) {
        assert(asset.sheetCellIndex !== undefined || panelNumberFromPrompt(sourceAsset, asset.id) !== null, `${asset.id} crop-region requires sheetCellIndex when source sheet uses sheetLayout`);
      }
      if (asset.crop.unit === "percent") {
        const coversWholeSource =
          asset.crop.x === 0 &&
          asset.crop.y === 0 &&
          asset.crop.width >= 95 &&
          asset.crop.height >= 95;
        assert(!coversWholeSource, `${asset.id} crop-region must be a real split asset, not a near-full source crop`);
      }
      assert(asset.cropPolicy === "content-safe" || asset.expectedSubjectBounds, `${asset.id} crop-region requires expectedSubjectBounds unless marked content-safe`);
      assert(asset.cropSafety, `${asset.id} crop-region requires cropSafety for edge/cutoff QA`);
    }
    if (asset.semanticRequirements !== undefined) {
      validateSemanticRequirements(asset);
    }
    validateCharacterContract(asset);
  });
  return assetPack;
}

function assertNonEmptyString(value, label) {
  assert(typeof value === "string" && value.trim(), `${label} must be a non-empty string`);
}

function assertStringArray(value, label, minItems = 0) {
  assert(Array.isArray(value), `${label} must be an array`);
  assert(value.length >= minItems, `${label} requires at least ${minItems} items`);
  const seen = new Set();
  value.forEach((item, index) => {
    assertNonEmptyString(item, `${label}[${index}]`);
    assert(!seen.has(item), `${label} contains duplicate item: ${item}`);
    seen.add(item);
  });
}

function panelNumberFromPrompt(sourceAsset, assetId) {
  const pattern = new RegExp(`Panel\\s+(\\d+)\\s*:\\s*${assetId.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i");
  const match = String(sourceAsset.generationPrompt || "").match(pattern);
  return match ? Number(match[1]) : null;
}

function validateSheetLayout(asset) {
  assert(asset.sheetLayout && typeof asset.sheetLayout === "object" && !Array.isArray(asset.sheetLayout), `${asset.id}.sheetLayout must be an object`);
  Object.keys(asset.sheetLayout).forEach((key) => assert(allowedSheetLayoutKeys.has(key), `${asset.id}.sheetLayout unknown key: ${key}`));
  assert(Number.isInteger(asset.sheetLayout.columns) && asset.sheetLayout.columns >= 1, `${asset.id}.sheetLayout.columns must be a positive integer`);
  assert(Number.isInteger(asset.sheetLayout.rows) && asset.sheetLayout.rows >= 1, `${asset.id}.sheetLayout.rows must be a positive integer`);
  if (asset.sheetLayout.insetPercent !== undefined) {
    assert(Number.isFinite(asset.sheetLayout.insetPercent) && asset.sheetLayout.insetPercent >= 0, `${asset.id}.sheetLayout.insetPercent must be a non-negative number`);
  }
  if (asset.sheetLayout.gutterPercent !== undefined) {
    assert(Number.isFinite(asset.sheetLayout.gutterPercent) && asset.sheetLayout.gutterPercent >= 0, `${asset.id}.sheetLayout.gutterPercent must be a non-negative number`);
  }
  if (asset.sheetLayout.safeMarginPercent !== undefined) {
    assert(Number.isFinite(asset.sheetLayout.safeMarginPercent) && asset.sheetLayout.safeMarginPercent >= 0, `${asset.id}.sheetLayout.safeMarginPercent must be a non-negative number`);
  }
  if (asset.sheetLayout.panelAspectRatio !== undefined) {
    assert(/^[0-9]+:[0-9]+$/.test(asset.sheetLayout.panelAspectRatio), `${asset.id}.sheetLayout.panelAspectRatio must look like 4:3`);
  }
  if (asset.sheetLayout.panelCount !== undefined) {
    assert(Number.isInteger(asset.sheetLayout.panelCount) && asset.sheetLayout.panelCount === asset.sheetLayout.columns * asset.sheetLayout.rows, `${asset.id}.sheetLayout.panelCount must equal columns * rows`);
  }
  if (asset.sheetLayout.cellOrder !== undefined) {
    assert(asset.sheetLayout.cellOrder === "row-major-left-to-right", `${asset.id}.sheetLayout.cellOrder is invalid`);
  }
  ["sourceWidthPx", "sourceHeightPx"].forEach((key) => {
    if (asset.sheetLayout[key] !== undefined) {
      assert(Number.isInteger(asset.sheetLayout[key]) && asset.sheetLayout[key] > 0, `${asset.id}.sheetLayout.${key} must be a positive integer`);
    }
  });
  ["cellWidthPx", "cellHeightPx"].forEach((key) => {
    if (asset.sheetLayout[key] !== undefined) {
      assert(Number.isFinite(asset.sheetLayout[key]) && asset.sheetLayout[key] > 0, `${asset.id}.sheetLayout.${key} must be a positive number`);
    }
  });
}

function validateSheetDimensions(deckDir, asset) {
  const sourcePath = resolveAssetPath(deckDir, asset.sourcePath);
  if (!sourcePath || !fs.existsSync(sourcePath)) return;
  const dimensions = pngDimensions(sourcePath);
  const layout = asset.sheetLayout;
  if (layout.sourceWidthPx !== undefined) {
    assert(dimensions.width === layout.sourceWidthPx, `${asset.id}.sheetLayout.sourceWidthPx ${layout.sourceWidthPx} does not match PNG width ${dimensions.width}`);
  }
  if (layout.sourceHeightPx !== undefined) {
    assert(dimensions.height === layout.sourceHeightPx, `${asset.id}.sheetLayout.sourceHeightPx ${layout.sourceHeightPx} does not match PNG height ${dimensions.height}`);
  }
  if (layout.cellWidthPx !== undefined) {
    assert(Math.abs(layout.cellWidthPx - dimensions.width / layout.columns) <= 0.01, `${asset.id}.sheetLayout.cellWidthPx does not match sourceWidthPx / columns`);
  }
  if (layout.cellHeightPx !== undefined) {
    assert(Math.abs(layout.cellHeightPx - dimensions.height / layout.rows) <= 0.01, `${asset.id}.sheetLayout.cellHeightPx does not match sourceHeightPx / rows`);
  }
}

function pngDimensions(filePath) {
  const buffer = fs.readFileSync(filePath);
  if (buffer.subarray(0, 8).toString("hex") !== "89504e470d0a1a0a") {
    throw new Error(`expected PNG: ${filePath}`);
  }
  return {
    width: buffer.readUInt32BE(16),
    height: buffer.readUInt32BE(20),
  };
}

function validateAssetXmlPrompt(asset) {
  assert(asset.xmlPrompt && typeof asset.xmlPrompt === "object" && !Array.isArray(asset.xmlPrompt), `${asset.id}.xmlPrompt must be an object`);
  Object.keys(asset.xmlPrompt).forEach((key) => assert(allowedAssetXmlPromptKeys.has(key), `${asset.id}.xmlPrompt unknown key: ${key}`));
  allowedAssetXmlPromptKeys.forEach((key) => {
    assertNonEmptyString(asset.xmlPrompt[key], `${asset.id}.xmlPrompt.${key}`);
    assert(/^<[^>]+>[\s\S]*<\/[^>]+>$/.test(asset.xmlPrompt[key].trim()), `${asset.id}.xmlPrompt.${key} must be wrapped in XML-style tags`);
  });
  if (asset.sheetLayout) {
    const requirement = asset.xmlPrompt.assetRequirement;
    [
      `columns="${asset.sheetLayout.columns}"`,
      `rows="${asset.sheetLayout.rows}"`,
      `panelCount="${asset.sheetLayout.columns * asset.sheetLayout.rows}"`,
      'cellOrder="row-major-left-to-right"',
    ].forEach((needle) => assert(requirement.includes(needle), `${asset.id}.xmlPrompt.assetRequirement missing ${needle}`));
  }
}

function validateCrop(asset) {
  assert(asset.crop && typeof asset.crop === "object" && !Array.isArray(asset.crop), `${asset.id}.crop must be an object`);
  Object.keys(asset.crop).forEach((key) => assert(allowedCropKeys.has(key), `${asset.id}.crop unknown key: ${key}`));
  ["x", "y", "width", "height"].forEach((field) => {
    assert(Number.isFinite(asset.crop[field]), `${asset.id}.crop.${field} must be a finite number`);
  });
  assert(asset.crop.x >= 0, `${asset.id}.crop.x must be >= 0`);
  assert(asset.crop.y >= 0, `${asset.id}.crop.y must be >= 0`);
  assert(asset.crop.width > 0, `${asset.id}.crop.width must be > 0`);
  assert(asset.crop.height > 0, `${asset.id}.crop.height must be > 0`);
  assert(["px", "percent"].includes(asset.crop.unit), `${asset.id}.crop.unit must be px or percent`);
  if (asset.crop.unit === "percent") {
    assert(asset.crop.x <= 100, `${asset.id}.crop.x must be <= 100 for percent crops`);
    assert(asset.crop.y <= 100, `${asset.id}.crop.y must be <= 100 for percent crops`);
    assert(asset.crop.width <= 100, `${asset.id}.crop.width must be <= 100 for percent crops`);
    assert(asset.crop.height <= 100, `${asset.id}.crop.height must be <= 100 for percent crops`);
    assert(asset.crop.x + asset.crop.width <= 100, `${asset.id}.crop x + width must be <= 100 for percent crops`);
    assert(asset.crop.y + asset.crop.height <= 100, `${asset.id}.crop y + height must be <= 100 for percent crops`);
  }
}

function validateExpectedSubjectBounds(asset) {
  assert(asset.expectedSubjectBounds && typeof asset.expectedSubjectBounds === "object" && !Array.isArray(asset.expectedSubjectBounds), `${asset.id}.expectedSubjectBounds must be an object`);
  validatePercentBox(asset.expectedSubjectBounds, `${asset.id}.expectedSubjectBounds`);
}

function validateCropSafety(asset) {
  assert(asset.cropSafety && typeof asset.cropSafety === "object" && !Array.isArray(asset.cropSafety), `${asset.id}.cropSafety must be an object`);
  Object.keys(asset.cropSafety).forEach((key) => assert(allowedCropSafetyKeys.has(key), `${asset.id}.cropSafety unknown key: ${key}`));
  ["safeMarginPercent", "edgeBandPercent", "maxEdgeInkRatio", "maxEdgeLineCoverage", "maxAdjacentPanelInkRatio"].forEach((key) => {
    if (asset.cropSafety[key] !== undefined) {
      assert(Number.isFinite(asset.cropSafety[key]), `${asset.id}.cropSafety.${key} must be a finite number`);
      assert(asset.cropSafety[key] >= 0, `${asset.id}.cropSafety.${key} must be >= 0`);
    }
  });
  if (asset.cropSafety.edgeBandPercent !== undefined) {
    assert(asset.cropSafety.edgeBandPercent >= 1 && asset.cropSafety.edgeBandPercent <= 20, `${asset.id}.cropSafety.edgeBandPercent must be 1-20`);
  }
  ["maxEdgeInkRatio", "maxEdgeLineCoverage", "maxAdjacentPanelInkRatio"].forEach((key) => {
    if (asset.cropSafety[key] !== undefined) {
      assert(asset.cropSafety[key] <= 1, `${asset.id}.cropSafety.${key} must be <= 1`);
    }
  });
  if (asset.cropSafety.reviewerRequired !== undefined) {
    assert(typeof asset.cropSafety.reviewerRequired === "boolean", `${asset.id}.cropSafety.reviewerRequired must be boolean`);
  }
  if (asset.cropSafety.forbiddenEdgeArtifacts !== undefined) {
    assertStringArray(asset.cropSafety.forbiddenEdgeArtifacts, `${asset.id}.cropSafety.forbiddenEdgeArtifacts`, 1);
  }
}

function validatePercentBox(box, label) {
  ["x", "y", "width", "height"].forEach((field) => {
    assert(Number.isFinite(box[field]), `${label}.${field} must be a finite number`);
  });
  assert(box.unit === "percent", `${label}.unit must be percent`);
  assert(box.x >= 0 && box.y >= 0, `${label}.x and ${label}.y must be >= 0`);
  assert(box.width > 0 && box.height > 0, `${label}.width and ${label}.height must be > 0`);
  assert(box.x + box.width <= 100, `${label} x + width must be <= 100`);
  assert(box.y + box.height <= 100, `${label} y + height must be <= 100`);
}

function validateCropMasks(asset) {
  assert(Array.isArray(asset.cropMasks), `${asset.id}.cropMasks must be an array`);
  asset.cropMasks.forEach((mask, index) => {
    assert(mask && typeof mask === "object" && !Array.isArray(mask), `${asset.id}.cropMasks[${index}] must be an object`);
    Object.keys(mask).forEach((key) => assert(allowedCropMaskKeys.has(key), `${asset.id}.cropMasks[${index}] unknown key: ${key}`));
    assert(mask.kind === "whiteout", `${asset.id}.cropMasks[${index}].kind must be whiteout`);
    ["x", "y", "width", "height"].forEach((key) => {
      assert(typeof mask[key] === "number", `${asset.id}.cropMasks[${index}].${key} must be a number`);
      assert(mask[key] >= 0, `${asset.id}.cropMasks[${index}].${key} must be >= 0`);
    });
    assert(mask.width > 0 && mask.height > 0, `${asset.id}.cropMasks[${index}] must have positive width and height`);
    assert(["px", "percent"].includes(mask.unit), `${asset.id}.cropMasks[${index}].unit is invalid`);
    if (mask.unit === "percent") {
      assert(mask.x + mask.width <= 100, `${asset.id}.cropMasks[${index}] x + width must be <= 100`);
      assert(mask.y + mask.height <= 100, `${asset.id}.cropMasks[${index}] y + height must be <= 100`);
    }
  });
}

function validateSemanticRequirements(asset) {
  assert(asset.semanticRequirements && typeof asset.semanticRequirements === "object", `${asset.id}.semanticRequirements is required`);
  const requirements = asset.semanticRequirements;
  Object.keys(requirements).forEach((key) => assert(allowedSemanticRequirementKeys.has(key), `${asset.id}.semanticRequirements unknown key: ${key}`));
  assertStringArray(requirements.mustShow, `${asset.id}.semanticRequirements.mustShow`, 3);
  assertStringArray(requirements.mustNotShow, `${asset.id}.semanticRequirements.mustNotShow`, 0);
  assertStringArray(requirements.teachingQuestions, `${asset.id}.semanticRequirements.teachingQuestions`, 2);
  assert(Number.isFinite(requirements.minimumPassScore), `${asset.id}.semanticRequirements.minimumPassScore is required`);
  assert(requirements.minimumPassScore >= 0 && requirements.minimumPassScore <= 100, `${asset.id}.semanticRequirements.minimumPassScore must be 0-100`);
  if (asset.kind === "sprite-sheet" || asset.kind === "crop-region" || /sprite-sheet|sheet|crop/i.test(`${asset.notes || ""} ${asset.generationPrompt || ""}`)) {
    const forbiddenText = requirements.mustNotShow.join(" ");
    assert(/번호|number|cell|sheet|시트/i.test(forbiddenText), `${asset.id}.semanticRequirements.mustNotShow must forbid visible sheet/cell numbering`);
  }
}

function validateCharacterContract(asset) {
  const text = `${asset.teachingRole || ""} ${asset.generationPrompt || ""} ${asset.alt || ""} ${(asset.semanticRequirements?.mustShow || []).join(" ")}`;
  const refs = new Set(asset.characterRefs || []);
  if (/김아이|Kimai/i.test(text)) {
    assert(refs.has("kimai"), `${asset.id} mentions 김아이/Kimai but characterRefs lacks kimai`);
  }
  if (/최아이|Choi/i.test(text)) {
    assert(refs.has("choi-ai"), `${asset.id} mentions 최아이/Choi but characterRefs lacks choi-ai`);
  }
  if (/박아이|Park/i.test(text)) {
    assert(refs.has("park-ai"), `${asset.id} mentions 박아이/Park but characterRefs lacks park-ai`);
  }
}

function hashFiles(deckDir, files) {
  const hash = crypto.createHash("sha256");
  files.forEach((file) => {
    const filePath = path.join(deckDir, file);
    hash.update(file);
    hash.update("\0");
    hash.update(fs.existsSync(filePath) ? fs.readFileSync(filePath) : "");
    hash.update("\0");
  });
  return `sha256:${hash.digest("hex")}`;
}

function loadRegistry(deckDir) {
  const registryPath = path.join(deckDir, "assets", "slides.js");
  if (!fs.existsSync(registryPath)) {
    return null;
  }
  const context = { window: {} };
  vm.createContext(context);
  vm.runInContext(fs.readFileSync(registryPath, "utf8"), context, { filename: registryPath });
  return context.window.DECK_SLIDES || null;
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function checkForbiddenFields(value, pathLabel) {
  if (Array.isArray(value)) {
    value.forEach((item, index) => checkForbiddenFields(item, `${pathLabel}[${index}]`));
    return;
  }
  if (!value || typeof value !== "object") {
    return;
  }
  Object.entries(value).forEach(([key, child]) => {
    assert(!forbiddenSlideKeys.has(key), `${pathLabel}.${key} duplicates source metadata; use evidenceClaimIds only`);
    checkForbiddenFields(child, `${pathLabel}.${key}`);
  });
}

function validateClaimMap(claimMap) {
  assert(typeof claimMap.topic === "string" && claimMap.topic.trim(), "claim-source-map.topic is required");
  assert(/^\d{4}-\d{2}-\d{2}$/.test(claimMap.checkedDate || ""), "claim-source-map.checkedDate must be YYYY-MM-DD");
  assert(Array.isArray(claimMap.claims), "claim-source-map.claims must be an array");
  const ids = new Set();
  claimMap.claims.forEach((claim) => {
    assert(claim.id && !ids.has(claim.id), `claim id must be unique: ${claim.id}`);
    ids.add(claim.id);
    assert(claim.claim, `${claim.id}.claim is required`);
    assert(["official", "supporting", "local", "inference"].includes(claim.sourceType), `${claim.id}.sourceType is invalid`);
    assert(["slide", "speaker-note", "appendix", "avoid"].includes(claim.useLocation), `${claim.id}.useLocation is invalid`);
    assert(["high", "medium", "low"].includes(claim.confidence), `${claim.id}.confidence is invalid`);
    if (claim.sourceType === "inference") {
      assert(claim.notes && claim.notes.trim(), `${claim.id} inference claims require notes`);
    } else {
      assert(claim.source && claim.checkedDate, `${claim.id} source and checkedDate are required`);
    }
  });
  assert(
    (Array.isArray(claimMap.claimsToAvoid) && claimMap.claimsToAvoid.length > 0) || claimMap.claimsToAvoidReviewed === true,
    "claimsToAvoid must be non-empty, or claimsToAvoidReviewed must be true"
  );
}

function validateSectionPlan(sectionPlan, slideIds) {
  assert(Number.isFinite(sectionPlan.timeboxMinutes), "section-plan.timeboxMinutes is required");
  assert(Array.isArray(sectionPlan.sections), "section-plan.sections must be an array");
  const total = sectionPlan.sections.reduce((sum, section) => {
    assert(section.id && section.title, "each section requires id and title");
    assert(section.learningObjective, `${section.id}.learningObjective is required`);
    assert(Number.isFinite(section.estimatedMinutes), `${section.id}.estimatedMinutes is required`);
    (section.slides || []).forEach((slideId) => assert(slideIds.has(slideId), `${section.id} references missing slide ${slideId}`));
    return sum + section.estimatedMinutes;
  }, 0);
  assert(total <= sectionPlan.timeboxMinutes, `section estimated minutes ${total} exceed timebox ${sectionPlan.timeboxMinutes}`);
}

function validateGlossary(glossary) {
  assert(Array.isArray(glossary.terms), "glossary.terms must be an array");
  const terms = new Set();
  glossary.terms.forEach((item) => {
    assert(item.term && item.definition, "glossary terms require term and definition");
    assert(["whole-word", "exact-phrase"].includes(item.match), `${item.term}.match is invalid`);
    assert(!terms.has(item.term), `duplicate glossary term: ${item.term}`);
    terms.add(item.term);
  });
  return terms;
}

function validateSlideSpec(spec, claimMap, glossaryTerms, assetPack, options = {}) {
  assert(Array.isArray(spec.slides), "slide-spec.slides must be an array");
  const claimIds = new Set(claimMap.claims.map((claim) => claim.id));
  const avoidClaimIds = new Set(claimMap.claims.filter((claim) => claim.useLocation === "avoid").map((claim) => claim.id));
  const assetIds = new Set((assetPack.assets || []).map((asset) => asset.id));
  const warnings = [];
  const blockers = [];
  const slideIds = new Set();
  let minutes = 0;
  spec.slides.forEach((slide, index) => {
    assert(slide.id && !slideIds.has(slide.id), `slide ${index + 1} id is missing or duplicate`);
    slideIds.add(slide.id);
    ["section", "sectionObjective", "title", "message", "visualIntent", "speakerNote"].forEach((field) => {
      assert(typeof slide[field] === "string" && slide[field].trim(), `${slide.id}.${field} is required`);
    });
    assert(Number.isFinite(slide.estimatedMinutes), `${slide.id}.estimatedMinutes is required`);
    minutes += slide.estimatedMinutes;
    assert(Array.isArray(slide.evidenceClaimIds), `${slide.id}.evidenceClaimIds must be an array`);
    slide.evidenceClaimIds.forEach((claimId) => {
      assert(claimIds.has(claimId), `${slide.id} references missing claim ${claimId}`);
      assert(!avoidClaimIds.has(claimId), `${slide.id} references avoid claim ${claimId}`);
    });
    (slide.glossaryTerms || []).forEach((term) => assert(glossaryTerms.has(term), `${slide.id} references undefined glossary term ${term}`));
    if (slide.presenterCues !== undefined) {
      assert(Array.isArray(slide.presenterCues), `${slide.id}.presenterCues must be an array`);
      assert(slide.presenterCues.length <= 3, `${slide.id}.presenterCues must contain at most 3 items`);
      slide.presenterCues.forEach((cue) => assert(typeof cue === "string" && cue.trim(), `${slide.id}.presenterCues entries must be non-empty strings`));
    }
    if (slide.bridge !== undefined) {
      assert(typeof slide.bridge === "string" && slide.bridge.trim(), `${slide.id}.bridge must be a non-empty string`);
    }
    if (slide.visualType !== undefined) {
      assert(allowedVisualTypes.has(slide.visualType), `${slide.id}.visualType is invalid`);
    }
    if (slide.visualAsset !== undefined) {
      assert(typeof slide.visualAsset === "string" && slide.visualAsset.trim(), `${slide.id}.visualAsset must be a non-empty string`);
      const assetPath = path.isAbsolute(slide.visualAsset) ? slide.visualAsset : path.join(root, slide.visualAsset);
      assert(fs.existsSync(assetPath), `${slide.id}.visualAsset does not exist: ${slide.visualAsset}`);
    }
    if (slide.visualAssetId != null) {
      assert(assetIds.has(slide.visualAssetId), `${slide.id} references missing asset ${slide.visualAssetId}`);
      const asset = assetPack.assets.find((item) => item.id === slide.visualAssetId);
      if (asset.status === "planned") {
        const message = `${slide.id} references planned asset ${slide.visualAssetId}; generate or map it before build`;
        if (options.stage === "structure") warnings.push(`${message}; projector build remains blocked`);
        else blockers.push(message);
      }
      assert(!/prototype/i.test(asset.notes || ""), `${slide.id} references prototype asset ${slide.visualAssetId}; replace it before projector build`);
      assert(
        Array.isArray(asset.explanationAnchors) && asset.explanationAnchors.length >= 3,
        `${slide.id} visual asset ${slide.visualAssetId} needs at least 3 explanation anchors`
      );
      validateSemanticRequirements(asset);
    }
    if (slide.visualPrompt !== undefined) {
      assert(typeof slide.visualPrompt === "string" && slide.visualPrompt.trim(), `${slide.id}.visualPrompt must be a non-empty string`);
    }
    if (slide.xmlPrompt !== undefined) {
      ["instruction", "screenContent", "speakerNavigation", "assetRequirement"].forEach((field) => {
        assert(typeof slide.xmlPrompt[field] === "string" && slide.xmlPrompt[field].trim(), `${slide.id}.xmlPrompt.${field} is required`);
        assert(/^<[^>]+>[\s\S]*<\/[^>]+>$/.test(slide.xmlPrompt[field].trim()), `${slide.id}.xmlPrompt.${field} must be wrapped in XML-style tags`);
      });
      assert(!slide.xmlPrompt.instruction.includes(slide.message), `${slide.id}.xmlPrompt.instruction must not duplicate screen message`);
    }
    if (slide.interaction !== undefined) {
      assert(slide.interaction && typeof slide.interaction === "object" && !Array.isArray(slide.interaction), `${slide.id}.interaction must be an object`);
      assert(allowedInteractionTypes.has(slide.interaction.type), `${slide.id}.interaction.type is invalid`);
      assert(typeof slide.interaction.description === "string" && slide.interaction.description.trim(), `${slide.id}.interaction.description is required`);
    }
    checkForbiddenFields(slide, `slide ${slide.id}`);
  });
  return { slideIds, minutes, warnings, blockers };
}

function printIssueSummary(label, items, limit = 20) {
  if (!items.length) {
    return;
  }
  console.log(`${label} - ${items.length}`);
  items.slice(0, limit).forEach((item) => console.log(`${label.split(" ")[0]} ${item}`));
  if (items.length > limit) {
    console.log(`${label.split(" ")[0]} ${items.length - limit} more`);
  }
}

function validateManifest(deckDir, manifest) {
  assert(manifest.jobId && manifest.topicSlug && manifest.createdAt, "job-manifest requires jobId, topicSlug, and createdAt");
  assert(Array.isArray(manifest.stages), "job-manifest.stages must be an array");
  manifest.stages.forEach((stage) => {
    ["name", "owner", "inputHash", "outputHash", "status", "evidencePath"].forEach((field) => assert(stage[field] !== undefined, `${stage.name || "stage"}.${field} is required`));
    assert(["PASS", "WARN", "FAIL"].includes(stage.status), `${stage.name}.status is invalid`);
    assert(Array.isArray(stage.inputs) && Array.isArray(stage.outputs), `${stage.name}.inputs and outputs are required`);
    const actualInputHash = hashFiles(deckDir, stage.inputs);
    assert(stage.inputHash === actualInputHash || stage.inputs.length === 0, `${stage.name}.inputHash is stale`);
    if (stage.status === "PASS" && stage.outputs.length > 0 && stage.outputHash) {
      const actualOutputHash = hashFiles(deckDir, stage.outputs);
      assert(stage.outputHash === actualOutputHash, `${stage.name}.outputHash is stale`);
    }
  });
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  const deckDir = resolveDeckDir(options.deckDirInput);
  requiredFiles.forEach((file) => assert(fs.existsSync(path.join(deckDir, file)), `${file} is missing`));

  const claimMap = readJson(deckDir, "claim-source-map.json");
  const sectionPlan = readJson(deckDir, "section-plan.json");
  const spec = readJson(deckDir, "slide-spec.json");
  const glossary = readJson(deckDir, "glossary.json");
  const manifest = readJson(deckDir, "job-manifest.json");
  const assetPack = readAssetPack(deckDir);

  validateClaimMap(claimMap);
  const glossaryTerms = validateGlossary(glossary);
  const { slideIds, minutes, warnings, blockers } = validateSlideSpec(spec, claimMap, glossaryTerms, assetPack, options);
  validateSectionPlan(sectionPlan, slideIds);
  assert(minutes <= sectionPlan.timeboxMinutes, `slide estimated minutes ${minutes} exceed timebox ${sectionPlan.timeboxMinutes}`);
  validateManifest(deckDir, manifest);

  const registry = loadRegistry(deckDir);
  if (registry) {
    assert(Array.isArray(registry), "assets/slides.js must define window.DECK_SLIDES array");
    assert(registry.length === spec.slides.length, `rendered slide count ${registry.length} differs from spec ${spec.slides.length}`);
  }

  console.log(`PASS source map schema - ${claimMap.claims.length} claims`);
  console.log(`PASS slide spec schema - ${spec.slides.length} slides`);
  console.log("PASS evidence claim resolution");
  console.log("PASS glossary registry");
  console.log(`PASS asset pack - ${assetPack.assets.length} assets`);
  printIssueSummary("WARN planned visual assets", warnings);
  printIssueSummary("FAIL planned visual assets", blockers);
  if (blockers.length) {
    throw new Error(`projector build blocked by ${blockers.length} planned visual asset references`);
  }
  console.log(`PASS generated deck contract (${options.stage})`);
}

try {
  main();
} catch (error) {
  console.error(`FAIL ${error.message}`);
  process.exitCode = 1;
}
