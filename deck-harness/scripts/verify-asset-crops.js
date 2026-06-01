#!/usr/bin/env node
const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const zlib = require("node:zlib");

const root = path.resolve(__dirname, "..", "..");

function usage() {
  console.error("Usage: node deck-harness/scripts/verify-asset-crops.js <deck-dir>");
  process.exit(1);
}

function resolveDeckDir(input) {
  if (!input) usage();
  return path.isAbsolute(input) ? input : path.join(root, input);
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

function readPng(filePath) {
  const buffer = fs.readFileSync(filePath);
  if (buffer.subarray(0, 8).toString("hex") !== "89504e470d0a1a0a") {
    throw new Error(`expected PNG: ${filePath}`);
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
    throw new Error(`unsupported PNG format for crop QA: ${filePath}`);
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

function sha256File(filePath) {
  return crypto.createHash("sha256").update(fs.readFileSync(filePath)).digest("hex");
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

function roundPercent(value) {
  return Number(value.toFixed(3));
}

function expectedCrop(sourceAsset, asset) {
  if (asset.cropPolicy === "content-safe") return asset.crop;
  if (!sourceAsset.sheetLayout) return asset.crop;
  const panelNumber = asset.sheetCellIndex;
  const columns = Number(sourceAsset.sheetLayout.columns);
  const rows = Number(sourceAsset.sheetLayout.rows);
  const baseInset = Number(sourceAsset.sheetLayout.insetPercent ?? 0.8);
  const inset = Math.max(
    baseInset,
    Number(sourceAsset.sheetLayout.safeMarginPercent ?? 0),
    Number(asset.cropSafety?.safeMarginPercent ?? 0),
  );
  if (!Number.isInteger(panelNumber) || !Number.isInteger(columns) || !Number.isInteger(rows)) {
    throw new Error(`${asset.id} cannot derive expected crop from sheetLayout`);
  }
  const cellWidth = 100 / columns;
  const cellHeight = 100 / rows;
  const col = (panelNumber - 1) % columns;
  const row = Math.floor((panelNumber - 1) / columns);
  return {
    x: roundPercent(col * cellWidth + inset),
    y: roundPercent(row * cellHeight + inset),
    width: roundPercent(cellWidth - inset * 2),
    height: roundPercent(cellHeight - inset * 2),
    unit: "percent",
  };
}

function percentBoxToPixels(image, box) {
  return {
    left: Math.round(image.width * box.x / 100),
    top: Math.round(image.height * box.y / 100),
    width: Math.round(image.width * box.width / 100),
    height: Math.round(image.height * box.height / 100),
  };
}

function pixelAt(image, x, y) {
  const offset = (y * image.width + x) * image.bytesPerPixel;
  if (image.colorType === 0) {
    const v = image.pixels[offset];
    return { r: v, g: v, b: v, a: 255 };
  }
  if (image.colorType === 4) {
    const v = image.pixels[offset];
    return { r: v, g: v, b: v, a: image.pixels[offset + 1] };
  }
  return {
    r: image.pixels[offset],
    g: image.pixels[offset + 1],
    b: image.pixels[offset + 2],
    a: image.bytesPerPixel > 3 ? image.pixels[offset + 3] : 255,
  };
}

function isInk(pixel) {
  if (pixel.a < 16) return false;
  return pixel.r < 238 || pixel.g < 238 || pixel.b < 238;
}

function measureInk(image, box) {
  const left = Math.max(0, box.left);
  const top = Math.max(0, box.top);
  const right = Math.min(image.width, box.left + box.width);
  const bottom = Math.min(image.height, box.top + box.height);
  let total = 0;
  let ink = 0;
  for (let y = top; y < bottom; y += 1) {
    for (let x = left; x < right; x += 1) {
      total += 1;
      if (isInk(pixelAt(image, x, y))) ink += 1;
    }
  }
  return { total, ink, ratio: total ? Number((ink / total).toFixed(5)) : 0 };
}

function maxLineCoverage(image, box, orientation) {
  const left = Math.max(0, box.left);
  const top = Math.max(0, box.top);
  const right = Math.min(image.width, box.left + box.width);
  const bottom = Math.min(image.height, box.top + box.height);
  let maxCoverage = 0;
  if (orientation === "horizontal") {
    for (let y = top; y < bottom; y += 1) {
      let ink = 0;
      for (let x = left; x < right; x += 1) {
        if (isInk(pixelAt(image, x, y))) ink += 1;
      }
      maxCoverage = Math.max(maxCoverage, right > left ? ink / (right - left) : 0);
    }
  } else {
    for (let x = left; x < right; x += 1) {
      let ink = 0;
      for (let y = top; y < bottom; y += 1) {
        if (isInk(pixelAt(image, x, y))) ink += 1;
      }
      maxCoverage = Math.max(maxCoverage, bottom > top ? ink / (bottom - top) : 0);
    }
  }
  return Number(maxCoverage.toFixed(5));
}

function edgeBoxes(image, bandPercent) {
  const bandX = Math.max(1, Math.round(image.width * bandPercent / 100));
  const bandY = Math.max(1, Math.round(image.height * bandPercent / 100));
  return {
    top: { left: 0, top: 0, width: image.width, height: bandY },
    right: { left: image.width - bandX, top: 0, width: bandX, height: image.height },
    bottom: { left: 0, top: image.height - bandY, width: image.width, height: bandY },
    left: { left: 0, top: 0, width: bandX, height: image.height },
  };
}

function edgeArtifactChecks(image, asset) {
  const safety = asset.cropSafety || {};
  const bandPercent = Number(safety.edgeBandPercent ?? 6);
  const maxEdgeInkRatio = Number(safety.maxEdgeInkRatio ?? 0.18);
  const maxEdgeLineCoverage = Number(safety.maxEdgeLineCoverage ?? 0.5);
  const checks = Object.entries(edgeBoxes(image, bandPercent)).map(([edge, box]) => {
    const measurement = measureInk(image, box);
    const lineCoverage = maxLineCoverage(image, box, edge === "top" || edge === "bottom" ? "horizontal" : "vertical");
    const lineViolation = lineCoverage > maxEdgeLineCoverage;
    const status = measurement.ratio <= maxEdgeInkRatio && !lineViolation ? "PASS" : "WARN";
    return {
      edge,
      bandPercent,
      inkRatio: measurement.ratio,
      maxInkRatio: maxEdgeInkRatio,
      maxLineCoverage,
      lineCoverage,
      maxEdgeLineCoverage,
      status,
      interpretation: status === "PASS"
        ? "edge has enough whitespace for declared safe crop"
        : "edge has dense ink or a long continuous line; reviewer must check for clipped text, character cutoff, crop boundary, or adjacent panel residue",
    };
  });
  return checks;
}

function subjectBoundCheck(image, asset) {
  const subject = asset.expectedSubjectBounds;
  if (!subject) {
    return {
      status: "WARN",
      observation: "expectedSubjectBounds missing; manual reviewer must confirm characters and labels are not cut",
    };
  }
  const bounds = percentBoxToPixels(image, subject);
  const outsideBoxes = [
    { left: 0, top: 0, width: image.width, height: bounds.top },
    { left: 0, top: bounds.top + bounds.height, width: image.width, height: image.height - (bounds.top + bounds.height) },
    { left: 0, top: bounds.top, width: bounds.left, height: bounds.height },
    { left: bounds.left + bounds.width, top: bounds.top, width: image.width - (bounds.left + bounds.width), height: bounds.height },
  ];
  const outsideInk = outsideBoxes.reduce((sum, box) => {
    const m = measureInk(image, box);
    return { total: sum.total + m.total, ink: sum.ink + m.ink };
  }, { total: 0, ink: 0 });
  const ratio = outsideInk.total ? Number((outsideInk.ink / outsideInk.total).toFixed(5)) : 0;
  const maxAdjacent = Number(asset.cropSafety?.maxAdjacentPanelInkRatio ?? 0.09);
  return {
    expectedSubjectBounds: subject,
    outsideSubjectInkRatio: ratio,
    maxAdjacentPanelInkRatio: maxAdjacent,
    status: ratio <= maxAdjacent ? "PASS" : "WARN",
    observation: ratio <= maxAdjacent
      ? "ink is concentrated inside the expected subject bounds"
      : "ink outside expected subject bounds may be adjacent panel residue or an oversized/cut subject",
  };
}

function cropQaChecks(cropPath, asset) {
  const image = readPng(cropPath);
  const edgeChecks = edgeArtifactChecks(image, asset);
  const subjectCheck = subjectBoundCheck(image, asset);
  const warnings = [
    ...edgeChecks.filter((check) => check.status !== "PASS").map((check) => {
      const issues = [];
      if (check.inkRatio > check.maxInkRatio) issues.push(`ink ${check.inkRatio} > ${check.maxInkRatio}`);
      if (check.lineCoverage > check.maxEdgeLineCoverage) {
        issues.push(`line coverage ${check.lineCoverage} > ${check.maxEdgeLineCoverage}`);
      }
      return `${check.edge} edge ${issues.join(", ")}`;
    }),
    subjectCheck.status !== "PASS" ? subjectCheck.observation : null,
  ].filter(Boolean);
  return {
    reviewerRequired: asset.cropSafety?.reviewerRequired !== false,
    forbiddenEdgeArtifacts: asset.cropSafety?.forbiddenEdgeArtifacts || [
      "visible panel number",
      "adjacent panel text",
      "clipped Korean label",
      "clipped character body",
      "crop boundary mark",
    ],
    edgeChecks,
    subjectCheck,
    status: warnings.length ? "WARN" : "PASS",
    warnings,
  };
}

function cropPixels(sourceDimensions, crop) {
  const left = crop.unit === "percent" ? Math.round(sourceDimensions.width * crop.x / 100) : Math.round(crop.x);
  const top = crop.unit === "percent" ? Math.round(sourceDimensions.height * crop.y / 100) : Math.round(crop.y);
  const width = crop.unit === "percent" ? Math.round(sourceDimensions.width * crop.width / 100) : Math.round(crop.width);
  const height = crop.unit === "percent" ? Math.round(sourceDimensions.height * crop.height / 100) : Math.round(crop.height);
  return { left, top, width, height };
}

function nearlyEqual(a, b) {
  return Math.abs(Number(a) - Number(b)) <= 0.001;
}

function assertCropMatches(actual, expected, assetId) {
  ["x", "y", "width", "height"].forEach((field) => {
    if (!nearlyEqual(actual[field], expected[field])) {
      throw new Error(`${assetId}.crop.${field} ${actual[field]} does not match expected ${expected[field]}`);
    }
  });
  if (actual.unit !== expected.unit) {
    throw new Error(`${assetId}.crop.unit ${actual.unit} does not match expected ${expected.unit}`);
  }
}

function main() {
  const deckDir = resolveDeckDir(process.argv[2]);
  const assetPack = readJson(path.join(deckDir, "asset-pack.json"));
  const byId = new Map((assetPack.assets || []).map((asset) => [asset.id, asset]));
  const report = {
    generatedAt: new Date().toISOString(),
    deck: path.relative(root, deckDir),
    assetPackHash: hashFiles(deckDir, ["asset-pack.json"]),
    checked: [],
  };

  (assetPack.assets || []).forEach((asset) => {
    if (asset.kind !== "crop-region") return;
    const sourceAsset = byId.get(asset.sourceAssetId);
    if (!sourceAsset) throw new Error(`${asset.id} references missing sourceAssetId ${asset.sourceAssetId}`);
    if (sourceAsset.sheetLayout && !asset.sheetCellIndex) {
      throw new Error(`${asset.id} missing sheetCellIndex for sheetLayout source ${sourceAsset.id}`);
    }
    const sourcePath = resolveAssetPath(deckDir, sourceAsset.sourcePath);
    const cropPath = resolveAssetPath(deckDir, asset.sourcePath);
    if (!fs.existsSync(sourcePath)) throw new Error(`${sourceAsset.id}.sourcePath missing: ${sourceAsset.sourcePath}`);
    if (!fs.existsSync(cropPath)) throw new Error(`${asset.id}.sourcePath missing: ${asset.sourcePath}`);
    const sourceDimensions = pngDimensions(sourcePath);
    const cropDimensions = pngDimensions(cropPath);
    const expected = expectedCrop(sourceAsset, asset);
    assertCropMatches(asset.crop, expected, asset.id);
    const expectedPixels = cropPixels(sourceDimensions, expected);
    if (cropDimensions.width !== expectedPixels.width || cropDimensions.height !== expectedPixels.height) {
      throw new Error(`${asset.id} dimensions ${cropDimensions.width}x${cropDimensions.height} do not match expected crop ${expectedPixels.width}x${expectedPixels.height}`);
    }
    const cropQa = cropQaChecks(cropPath, asset);
    report.checked.push({
      assetId: asset.id,
      sourceAssetId: asset.sourceAssetId,
      sheetCellIndex: asset.sheetCellIndex || null,
      cropPolicy: asset.cropPolicy || "declared-cell",
      sourcePath: sourceAsset.sourcePath,
      cropPath: asset.sourcePath,
      sourceDimensions,
      cropDimensions,
      cropSafety: asset.cropSafety || null,
      expectedSubjectBounds: asset.expectedSubjectBounds || null,
      expectedCrop: expected,
      actualCrop: asset.crop,
      sourceSha256: sha256File(sourcePath),
      cropSha256: sha256File(cropPath),
      cropQa,
      status: cropQa.status === "PASS" ? "PASS" : "WARN",
    });
  });

  const reportPath = path.join(deckDir, "asset-crop-review.json");
  writeJson(reportPath, report);
  const warnCount = report.checked.filter((item) => item.status === "WARN").length;
  console.log(`${warnCount ? "WARN" : "PASS"} asset crop verification - ${report.checked.length} crops${warnCount ? `, ${warnCount} require reviewer attention` : ""}`);
}

try {
  main();
} catch (error) {
  console.error(`FAIL ${error.message}`);
  process.exitCode = 1;
}
