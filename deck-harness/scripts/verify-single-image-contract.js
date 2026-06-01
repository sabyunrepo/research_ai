#!/usr/bin/env node
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..", "..");

function usage() {
  console.error("Usage: node deck-harness/scripts/verify-single-image-contract.js <deck-dir>");
  process.exit(1);
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function resolveDeckDir(input) {
  if (!input) usage();
  return path.isAbsolute(input) ? input : path.join(root, input);
}

function resolveAssetPath(deckDir, sourcePath) {
  if (!sourcePath) return "";
  return path.isAbsolute(sourcePath) ? sourcePath : path.join(deckDir, sourcePath);
}

function pngDimensions(filePath) {
  const buffer = fs.readFileSync(filePath);
  if (buffer.subarray(0, 8).toString("hex") !== "89504e470d0a1a0a") {
    throw new Error(`not a PNG: ${filePath}`);
  }
  return {
    width: buffer.readUInt32BE(16),
    height: buffer.readUInt32BE(20),
  };
}

function main() {
  const deckDir = resolveDeckDir(process.argv[2]);
  const assetPackPath = path.join(deckDir, "asset-pack.json");
  const specPath = path.join(deckDir, "slide-spec.json");
  if (!fs.existsSync(assetPackPath)) throw new Error(`asset-pack.json missing in ${deckDir}`);
  if (!fs.existsSync(specPath)) throw new Error(`slide-spec.json missing in ${deckDir}`);

  const assetPack = readJson(assetPackPath);
  const spec = readJson(specPath);
  const requiredIds = new Set((spec.slides || []).map((slide) => slide.visualAssetId).filter(Boolean));
  const singleImageFirst = (assetPack.assets || []).filter((asset) => asset.generationMode === "single-image-first");
  const generated = [];
  const pending = [];
  const blockers = [];

  singleImageFirst.forEach((asset) => {
    if (asset.kind !== "single-image") blockers.push(`${asset.id}: generationMode requires kind single-image`);
    if (asset.sourceAssetId || asset.crop || asset.cropPolicy || asset.cropMasks || asset.sheetCellIndex) {
      blockers.push(`${asset.id}: still contains crop-region fields after single-image conversion`);
    }
    if (!asset.sourcePath || !asset.sourcePath.endsWith("-single.png")) {
      blockers.push(`${asset.id}: sourcePath must target a fresh -single.png file`);
    }
    if (!asset.previousCropRegion?.sourceAssetId || !asset.previousCropRegion?.sourcePath) {
      blockers.push(`${asset.id}: previousCropRegion must preserve old crop source metadata`);
    }
    if (asset.deterministicComposition?.owner !== "deck-harness") {
      blockers.push(`${asset.id}: deterministicComposition.owner must be deck-harness`);
    }
    const filePath = resolveAssetPath(deckDir, asset.sourcePath);
    if (fs.existsSync(filePath)) {
      const dimensions = pngDimensions(filePath);
      if (dimensions.width < 512 || dimensions.height < 512) {
        blockers.push(`${asset.id}: generated PNG is too small (${dimensions.width}x${dimensions.height})`);
      }
      generated.push(`${asset.id} ${dimensions.width}x${dimensions.height}`);
    } else if (requiredIds.has(asset.id)) {
      pending.push(asset.id);
    }
  });

  console.log(`Single-image-first assets: ${singleImageFirst.length}`);
  console.log(`Generated single-image-first assets: ${generated.length}`);
  console.log(`Pending required single-image-first assets: ${pending.length}`);
  if (generated.length) console.log(`Generated: ${generated.join("; ")}`);
  if (pending.length) console.log(`Pending: ${pending.slice(0, 12).join("; ")}${pending.length > 12 ? `; ${pending.length - 12} more` : ""}`);
  if (blockers.length) {
    blockers.forEach((blocker) => console.error(`FAIL ${blocker}`));
    process.exitCode = 1;
  }
}

try {
  main();
} catch (error) {
  console.error(`FAIL ${error.message}`);
  process.exitCode = 1;
}
