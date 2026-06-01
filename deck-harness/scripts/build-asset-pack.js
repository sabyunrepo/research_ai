#!/usr/bin/env node
const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const zlib = require("node:zlib");

const root = path.resolve(__dirname, "..", "..");

function usage() {
  console.error("Usage: node deck-harness/scripts/build-asset-pack.js [--check] <deck-dir>");
  process.exit(1);
}

function parseArgs(argv) {
  const check = argv.includes("--check");
  const args = argv.filter((arg) => arg !== "--check");
  if (args.length !== 1) usage();
  return {
    check,
    deckDir: path.isAbsolute(args[0]) ? args[0] : path.join(root, args[0]),
  };
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function writeJson(filePath, data) {
  fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`);
}

function resolveAssetPath(deckDir, sourcePath) {
  if (!sourcePath) return "";
  if (path.isAbsolute(sourcePath)) return sourcePath;
  const deckRelative = path.join(deckDir, sourcePath);
  if (sourcePath.startsWith("assets/") || fs.existsSync(deckRelative)) return deckRelative;
  return path.join(root, sourcePath);
}

function defaultCropSourcePath(deckDir, asset) {
  return path.relative(root, path.join(deckDir, "assets", "visuals", `${asset.id}.png`));
}

function roundPercent(value) {
  return Number(value.toFixed(3));
}

function panelNumberFromPrompt(sourceAsset, assetId) {
  const pattern = new RegExp(`Panel\\s+(\\d+)\\s*:\\s*${assetId.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i");
  const match = String(sourceAsset.generationPrompt || "").match(pattern);
  return match ? Number(match[1]) : null;
}

function cropFromSheetLayout(sourceAsset, asset) {
  if (asset.cropPolicy === "content-safe") return asset.crop;
  const layout = sourceAsset.sheetLayout;
  if (!layout) return asset.crop;
  const panelNumber = asset.sheetCellIndex || panelNumberFromPrompt(sourceAsset, asset.id);
  if (!Number.isInteger(panelNumber)) return asset.crop;
  const columns = Number(layout.columns);
  const rows = Number(layout.rows);
  const inset = Number(layout.insetPercent ?? 0.8);
  if (!Number.isInteger(columns) || !Number.isInteger(rows) || columns < 1 || rows < 1) {
    throw new Error(`${sourceAsset.id}.sheetLayout must define positive integer columns and rows`);
  }
  if (panelNumber < 1 || panelNumber > columns * rows) {
    throw new Error(`${asset.id}.sheetCellIndex ${panelNumber} is outside ${columns}x${rows} sheet ${sourceAsset.id}`);
  }
  const cellWidth = 100 / columns;
  const cellHeight = 100 / rows;
  const col = (panelNumber - 1) % columns;
  const row = Math.floor((panelNumber - 1) / columns);
  const safeInset = Math.max(
    inset,
    Number(layout.safeMarginPercent ?? 0),
    Number(asset.cropSafety?.safeMarginPercent ?? 0),
  );
  return {
    x: roundPercent(col * cellWidth + safeInset),
    y: roundPercent(row * cellHeight + safeInset),
    width: roundPercent(cellWidth - safeInset * 2),
    height: roundPercent(cellHeight - safeInset * 2),
    unit: "percent",
  };
}

function hashFile(filePath) {
  return `sha256:${crypto.createHash("sha256").update(fs.readFileSync(filePath)).digest("hex")}`;
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
    if (stage.status === "PASS" && Array.isArray(stage.outputs) && stage.outputs.length > 0 && stage.outputHash) {
      stage.outputHash = hashFiles(deckDir, stage.outputs);
    }
  });
  writeJson(manifestPath, manifest);
}

function projectorRequiredAssetIds(deckDir, byId) {
  const specPath = path.join(deckDir, "slide-spec.json");
  const required = new Set();
  if (!fs.existsSync(specPath)) return required;
  const spec = readJson(specPath);
  (spec.slides || []).forEach((slide) => {
    if (!slide.visualAssetId) return;
    required.add(slide.visualAssetId);
    const asset = byId.get(slide.visualAssetId);
    if (asset?.kind === "crop-region" && asset.sourceAssetId) {
      required.add(asset.sourceAssetId);
    }
  });
  return required;
}

function cropImage(sourcePath, targetPath, crop, options = {}) {
  const image = readPng(sourcePath);
  const left = crop.unit === "percent" ? Math.round(image.width * crop.x / 100) : Math.round(crop.x);
  const top = crop.unit === "percent" ? Math.round(image.height * crop.y / 100) : Math.round(crop.y);
  const width = crop.unit === "percent" ? Math.round(image.width * crop.width / 100) : Math.round(crop.width);
  const height = crop.unit === "percent" ? Math.round(image.height * crop.height / 100) : Math.round(crop.height);
  if (left < 0 || top < 0 || width <= 0 || height <= 0 || left + width > image.width || top + height > image.height) {
    throw new Error(`crop is outside image bounds for ${sourcePath}`);
  }
  if (options.check) return;
  fs.mkdirSync(path.dirname(targetPath), { recursive: true });
  const output = Buffer.alloc(width * height * image.bytesPerPixel);
  for (let row = 0; row < height; row += 1) {
    const sourceStart = ((top + row) * image.width + left) * image.bytesPerPixel;
    const targetStart = row * width * image.bytesPerPixel;
    image.pixels.copy(output, targetStart, sourceStart, sourceStart + width * image.bytesPerPixel);
  }
  applyWhiteoutMasks(output, width, height, image.bytesPerPixel, options.masks || []);
  fs.writeFileSync(targetPath, writePng({ width, height, colorType: image.colorType, bitDepth: image.bitDepth, pixels: output }));
}

function applyWhiteoutMasks(pixels, width, height, bytesPerPixel, masks) {
  masks.forEach((mask) => {
    if (mask.kind && mask.kind !== "whiteout") return;
    const left = mask.unit === "percent" ? Math.round(width * mask.x / 100) : Math.round(mask.x);
    const top = mask.unit === "percent" ? Math.round(height * mask.y / 100) : Math.round(mask.y);
    const maskWidth = mask.unit === "percent" ? Math.round(width * mask.width / 100) : Math.round(mask.width);
    const maskHeight = mask.unit === "percent" ? Math.round(height * mask.height / 100) : Math.round(mask.height);
    for (let y = Math.max(0, top); y < Math.min(height, top + maskHeight); y += 1) {
      for (let x = Math.max(0, left); x < Math.min(width, left + maskWidth); x += 1) {
        const offset = (y * width + x) * bytesPerPixel;
        pixels[offset] = 255;
        if (bytesPerPixel > 1) pixels[offset + 1] = 255;
        if (bytesPerPixel > 2) pixels[offset + 2] = 255;
        if (bytesPerPixel > 3) pixels[offset + 3] = 255;
      }
    }
  });
}

function readPng(filePath) {
  const buffer = fs.readFileSync(filePath);
  if (buffer.subarray(0, 8).toString("hex") !== "89504e470d0a1a0a") {
    throw new Error(`unsupported image format for crop-region, expected PNG: ${filePath}`);
  }
  let offset = 8;
  let header = null;
  const idat = [];
  while (offset < buffer.length) {
    const length = buffer.readUInt32BE(offset);
    const type = buffer.subarray(offset + 4, offset + 8).toString("ascii");
    const data = buffer.subarray(offset + 8, offset + 8 + length);
    offset += length + 12;
    if (type === "IHDR") {
      header = {
        width: data.readUInt32BE(0),
        height: data.readUInt32BE(4),
        bitDepth: data[8],
        colorType: data[9],
        compression: data[10],
        filter: data[11],
        interlace: data[12],
      };
    } else if (type === "IDAT") {
      idat.push(data);
    } else if (type === "IEND") {
      break;
    }
  }
  if (!header) throw new Error(`PNG is missing IHDR: ${filePath}`);
  if (header.bitDepth !== 8 || header.compression !== 0 || header.filter !== 0 || header.interlace !== 0) {
    throw new Error(`unsupported PNG crop format for ${filePath}; expected 8-bit non-interlaced PNG`);
  }
  const bytesPerPixelByColorType = { 0: 1, 2: 3, 4: 2, 6: 4 };
  const bytesPerPixel = bytesPerPixelByColorType[header.colorType];
  if (!bytesPerPixel) throw new Error(`unsupported PNG color type ${header.colorType} for ${filePath}`);
  const inflated = zlib.inflateSync(Buffer.concat(idat));
  const rowBytes = header.width * bytesPerPixel;
  const pixels = Buffer.alloc(rowBytes * header.height);
  let sourceOffset = 0;
  for (let y = 0; y < header.height; y += 1) {
    const filterType = inflated[sourceOffset];
    sourceOffset += 1;
    const row = inflated.subarray(sourceOffset, sourceOffset + rowBytes);
    sourceOffset += rowBytes;
    unfilterPngRow(row, pixels, y * rowBytes, rowBytes, bytesPerPixel, filterType, y === 0 ? null : pixels.subarray((y - 1) * rowBytes, y * rowBytes));
  }
  return { ...header, bytesPerPixel, pixels };
}

function unfilterPngRow(row, output, targetOffset, rowBytes, bytesPerPixel, filterType, previousRow) {
  for (let x = 0; x < rowBytes; x += 1) {
    const left = x >= bytesPerPixel ? output[targetOffset + x - bytesPerPixel] : 0;
    const up = previousRow ? previousRow[x] : 0;
    const upLeft = previousRow && x >= bytesPerPixel ? previousRow[x - bytesPerPixel] : 0;
    let value;
    if (filterType === 0) value = row[x];
    else if (filterType === 1) value = row[x] + left;
    else if (filterType === 2) value = row[x] + up;
    else if (filterType === 3) value = row[x] + Math.floor((left + up) / 2);
    else if (filterType === 4) value = row[x] + paethPredictor(left, up, upLeft);
    else throw new Error(`unsupported PNG filter type ${filterType}`);
    output[targetOffset + x] = value & 0xff;
  }
}

function paethPredictor(left, up, upLeft) {
  const p = left + up - upLeft;
  const pa = Math.abs(p - left);
  const pb = Math.abs(p - up);
  const pc = Math.abs(p - upLeft);
  if (pa <= pb && pa <= pc) return left;
  if (pb <= pc) return up;
  return upLeft;
}

function writePng(image) {
  const bytesPerPixelByColorType = { 0: 1, 2: 3, 4: 2, 6: 4 };
  const bytesPerPixel = bytesPerPixelByColorType[image.colorType];
  const rowBytes = image.width * bytesPerPixel;
  const raw = Buffer.alloc((rowBytes + 1) * image.height);
  for (let y = 0; y < image.height; y += 1) {
    raw[y * (rowBytes + 1)] = 0;
    image.pixels.copy(raw, y * (rowBytes + 1) + 1, y * rowBytes, (y + 1) * rowBytes);
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(image.width, 0);
  ihdr.writeUInt32BE(image.height, 4);
  ihdr[8] = image.bitDepth;
  ihdr[9] = image.colorType;
  return Buffer.concat([
    Buffer.from("89504e470d0a1a0a", "hex"),
    pngChunk("IHDR", ihdr),
    pngChunk("IDAT", zlib.deflateSync(raw)),
    pngChunk("IEND", Buffer.alloc(0)),
  ]);
}

function pngChunk(type, data) {
  const typeBuffer = Buffer.from(type, "ascii");
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length, 0);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([typeBuffer, data])), 0);
  return Buffer.concat([length, typeBuffer, data, crc]);
}

function crc32(buffer) {
  let crc = 0xffffffff;
  for (const byte of buffer) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit += 1) {
      crc = crc & 1 ? (crc >>> 1) ^ 0xedb88320 : crc >>> 1;
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function main() {
  const { check, deckDir } = parseArgs(process.argv.slice(2));
  const assetPackPath = path.join(deckDir, "asset-pack.json");
  const assetPack = readJson(assetPackPath);
  const assets = Array.isArray(assetPack.assets) ? assetPack.assets : [];
  const byId = new Map(assets.map((asset) => [asset.id, asset]));
  const generated = [];
  const cropped = [];
  const pendingBlockers = [];
  const pendingUnused = [];
  const failed = [];
  const requiredAssetIds = projectorRequiredAssetIds(deckDir, byId);

  function recordPending(asset, message) {
    if (requiredAssetIds.has(asset.id)) pendingBlockers.push(message);
    else pendingUnused.push(message);
  }

  assets.forEach((asset) => {
    if (asset.kind !== "crop-region") {
      const targetPath = resolveAssetPath(deckDir, asset.sourcePath);
      if (targetPath && fs.existsSync(targetPath)) {
        const nextStatus = asset.kind === "existing-image" ? "existing" : "generated";
        if (asset.status !== nextStatus) {
          if (!check) asset.status = nextStatus;
          generated.push(`${asset.id} -> ${path.relative(root, targetPath)}`);
        }
      } else if (asset.status === "planned") {
        recordPending(asset, `${asset.id} (${asset.kind}) -> ${asset.sourcePath || "missing sourcePath"}`);
      }
      return;
    }

    if (!asset.sourcePath) {
      if (!check) asset.sourcePath = defaultCropSourcePath(deckDir, asset);
    }
    const targetPath = resolveAssetPath(deckDir, asset.sourcePath || defaultCropSourcePath(deckDir, asset));
    const sourceAsset = byId.get(asset.sourceAssetId);
    const sourcePath = sourceAsset ? resolveAssetPath(deckDir, sourceAsset.sourcePath) : "";
    if (!sourceAsset || !fs.existsSync(sourcePath)) {
      recordPending(asset, `${asset.id} (crop-region) waits for ${asset.sourceAssetId}`);
      return;
    }
    try {
      const normalizedCrop = cropFromSheetLayout(sourceAsset, asset);
      if (!check && normalizedCrop) asset.crop = normalizedCrop;
      const hasReviewedContentSafeCrop = asset.cropPolicy === "content-safe" && fs.existsSync(targetPath);
      if (!hasReviewedContentSafeCrop) {
        cropImage(sourcePath, targetPath, normalizedCrop || asset.crop, { check, masks: asset.cropMasks || [] });
      }
      if (!check) asset.status = "cropped";
      const contract = [
        asset.cropPolicy || "declared-cell",
        `cell=${asset.sheetCellIndex || "manual"}`,
        asset.cropSafety?.safeMarginPercent != null ? `safe=${asset.cropSafety.safeMarginPercent}%` : null,
        hasReviewedContentSafeCrop ? "preserved-reviewed-crop" : null,
      ].filter(Boolean).join(", ");
      cropped.push(`${asset.id} -> ${path.relative(root, targetPath)}${check ? " (check only)" : ` (${hashFile(targetPath)})`} [${contract}]`);
    } catch (error) {
      failed.push(`${asset.id}: ${error.message}`);
    }
  });

  if (check) {
    console.log(`Asset build check: ${path.relative(root, deckDir)}`);
    console.log(`Generated or mapped source assets: ${generated.length}`);
    console.log(`Cropped assets: ${cropped.length}`);
    console.log(`Pending projector blockers: ${pendingBlockers.length}`);
    console.log(`Pending unused assets: ${pendingUnused.length}`);
    console.log(`Failed assets: ${failed.length}`);
    if (failed.length || pendingBlockers.length) {
      process.exitCode = 1;
    }
    return;
  }

  writeJson(assetPackPath, assetPack);
  const reportPath = path.join(deckDir, "asset-build-report.md");
  fs.writeFileSync(reportPath, `# Asset Build Report

## Command

\`\`\`sh
node deck-harness/scripts/build-asset-pack.js ${path.relative(root, deckDir)}
\`\`\`

## Summary

- Generated or mapped source assets: ${generated.length}
- Cropped assets: ${cropped.length}
- Pending projector blockers: ${pendingBlockers.length}
- Pending unused assets: ${pendingUnused.length}
- Failed assets: ${failed.length}

## Generated Or Mapped

${generated.length ? generated.map((item) => `- ${item}`).join("\n") : "- none"}

## Cropped

${cropped.length ? cropped.map((item) => `- ${item}`).join("\n") : "- none"}

## Pending

${pendingBlockers.length ? pendingBlockers.map((item) => `- ${item}`).join("\n") : "- none"}

## Pending Unused

${pendingUnused.length ? pendingUnused.map((item) => `- ${item}`).join("\n") : "- none"}

## Failed

${failed.length ? failed.map((item) => `- ${item}`).join("\n") : "- none"}
`);
  refreshManifestHashes(deckDir);

  console.log(`Asset build report: ${path.relative(root, reportPath)}`);
  console.log(`Generated or mapped source assets: ${generated.length}`);
  console.log(`Cropped assets: ${cropped.length}`);
  console.log(`Pending projector blockers: ${pendingBlockers.length}`);
  console.log(`Pending unused assets: ${pendingUnused.length}`);
  console.log(`Failed assets: ${failed.length}`);
  if (failed.length || pendingBlockers.length) {
    process.exitCode = 1;
  }
}

try {
  main();
} catch (error) {
  console.error(`FAIL ${error.message}`);
  process.exitCode = 1;
}
