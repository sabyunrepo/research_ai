#!/usr/bin/env node
const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..", "..");

function usage() {
  console.error("Usage: node deck-harness/scripts/explode-warning-crops-to-single-images.js <deck-dir> [--dry-run] [--report=path]");
  process.exit(1);
}

function parseArgs(argv) {
  const options = {
    deckDirInput: null,
    dryRun: false,
    reportPath: null,
  };
  argv.forEach((arg) => {
    if (arg === "--dry-run") {
      options.dryRun = true;
      return;
    }
    if (arg.startsWith("--report=")) {
      options.reportPath = arg.slice("--report=".length);
      return;
    }
    if (!options.deckDirInput) {
      options.deckDirInput = arg;
      return;
    }
    usage();
  });
  if (!options.deckDirInput) usage();
  return {
    ...options,
    deckDir: path.isAbsolute(options.deckDirInput) ? options.deckDirInput : path.join(root, options.deckDirInput),
  };
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function writeJson(filePath, data) {
  fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`);
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

function refreshManifestHashes(deckDir) {
  const manifestPath = path.join(deckDir, "job-manifest.json");
  if (!fs.existsSync(manifestPath)) return;
  const manifest = readJson(manifestPath);
  if (!manifest || !Array.isArray(manifest.stages)) return;
  manifest.stages.forEach((stage) => {
    if (Array.isArray(stage.inputs)) {
      stage.inputHash = hashFiles(deckDir, stage.inputs);
    }
  });
  writeJson(manifestPath, manifest);
}

function warningItems(review) {
  return (review.checked || []).filter((item) => item.status === "WARN" && item.assetId);
}

function nextSourcePath(asset) {
  return `assets/visuals/${asset.id}-single.png`;
}

function updatedPrompt(asset) {
  const prompt = String(asset.generationPrompt || "").trim();
  const suffix = [
    "Generate this as one standalone illustration, not as a crop from a sprite sheet.",
    "Leave generous white padding around all characters, Korean labels, arrows, and blue accents.",
    "Do not draw slide frames, card frames, panel borders, crop marks, or page chrome; the deck harness owns those deterministic composition details.",
  ].join(" ");
  if (prompt.includes("Generate this as one standalone illustration")) return prompt;
  return `${prompt} ${suffix}`;
}

function transformAsset(asset, warning) {
  const previousCropRegion = {
    sourcePath: asset.sourcePath,
    sourceAssetId: asset.sourceAssetId,
    sheetCellIndex: asset.sheetCellIndex,
    crop: asset.crop,
    cropPolicy: asset.cropPolicy || "declared-cell",
    cropSafety: asset.cropSafety,
    reviewStatus: warning.status,
    reviewWarnings: warning.cropQa?.warnings || [],
    reviewedCropPath: warning.cropPath,
    reviewedSourcePath: warning.sourcePath,
  };
  const notes = [
    asset.notes,
    "Exploded from sprite-sheet crop after asset-crop-review WARN; regenerate as a standalone single-image asset.",
  ].filter(Boolean).join(" ");
  const next = {
    ...asset,
    kind: "single-image",
    status: "planned",
    sourcePath: nextSourcePath(asset),
    generationMode: "single-image-first",
    generationPrompt: updatedPrompt(asset),
    notes,
    previousCropRegion,
    deterministicComposition: {
      owner: "deck-harness",
      slot: "visualAssetId",
      frame: "template-owned",
      objectFit: "contain",
      forbiddenInImage: [
        "sprite sheet",
        "multi-panel grid",
        "panel border",
        "crop mark",
        "slide frame",
        "page chrome",
      ],
    },
  };
  delete next.sourceAssetId;
  delete next.sheetCellIndex;
  delete next.crop;
  delete next.cropPolicy;
  delete next.cropMasks;
  return next;
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  const assetPackPath = path.join(options.deckDir, "asset-pack.json");
  const reviewPath = path.join(options.deckDir, "asset-crop-review.json");
  if (!fs.existsSync(assetPackPath)) throw new Error(`asset-pack.json missing in ${options.deckDir}`);
  if (!fs.existsSync(reviewPath)) throw new Error(`asset-crop-review.json missing in ${options.deckDir}`);

  const assetPack = readJson(assetPackPath);
  const review = readJson(reviewPath);
  const warningsById = new Map(warningItems(review).map((item) => [item.assetId, item]));
  const converted = [];
  const skipped = [];
  const assets = (assetPack.assets || []).map((asset) => {
    const warning = warningsById.get(asset.id);
    if (!warning) return asset;
    if (asset.kind !== "crop-region") {
      skipped.push({ id: asset.id, reason: `expected crop-region, found ${asset.kind}` });
      return asset;
    }
    const next = transformAsset(asset, warning);
    converted.push({
      id: asset.id,
      fromKind: asset.kind,
      toKind: next.kind,
      previousSourcePath: asset.sourcePath,
      nextSourcePath: next.sourcePath,
      sourceAssetId: asset.sourceAssetId,
      sheetCellIndex: asset.sheetCellIndex,
      warningCount: warning.cropQa?.warnings?.length || 0,
    });
    return next;
  });
  const missing = [...warningsById.keys()].filter((id) => !converted.some((item) => item.id === id) && !skipped.some((item) => item.id === id));
  missing.forEach((id) => skipped.push({ id, reason: "warning asset not found in asset-pack" }));

  const report = {
    generatedAt: new Date().toISOString(),
    deck: path.relative(root, options.deckDir),
    dryRun: options.dryRun,
    reviewWarningCount: warningsById.size,
    convertedCount: converted.length,
    skippedCount: skipped.length,
    converted,
    skipped,
  };
  const reportPath = options.reportPath
    ? (path.isAbsolute(options.reportPath) ? options.reportPath : path.join(root, options.reportPath))
    : path.join(options.deckDir, "single-image-explode-report.json");

  if (!options.dryRun) {
    writeJson(assetPackPath, { ...assetPack, assets });
    refreshManifestHashes(options.deckDir);
  }
  writeJson(reportPath, report);

  console.log(`Single-image explode report: ${path.relative(root, reportPath)}`);
  console.log(`Review warning crop assets: ${warningsById.size}`);
  console.log(`Converted to single-image: ${converted.length}`);
  console.log(`Skipped: ${skipped.length}`);
  if (skipped.length) process.exitCode = 1;
}

try {
  main();
} catch (error) {
  console.error(`FAIL ${error.message}`);
  process.exitCode = 1;
}
