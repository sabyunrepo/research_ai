#!/usr/bin/env node
const crypto = require("node:crypto");
const { spawnSync } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");
const zlib = require("node:zlib");

const root = path.resolve(__dirname, "..", "..");
const harnessRoot = path.join(root, "deck-harness");

function usage() {
  console.error("Usage: node deck-harness/scripts/build-deck-from-spec.js <deck-dir>");
  process.exit(1);
}

function resolveDeckDir(input) {
  if (!input) {
    usage();
  }
  return path.isAbsolute(input) ? input : path.join(root, input);
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function readAssetPack(deckDir) {
  const assetPackPath = path.join(deckDir, "asset-pack.json");
  if (!fs.existsSync(assetPackPath)) {
    return { assets: [] };
  }
  return readJson(assetPackPath);
}

function readOptionalJson(deckDir, file) {
  const filePath = path.join(deckDir, file);
  if (!fs.existsSync(filePath)) {
    return null;
  }
  return readJson(filePath);
}

function resolveAssetPath(deckDir, sourcePath) {
  if (!sourcePath) return "";
  if (path.isAbsolute(sourcePath)) return sourcePath;
  const deckRelative = path.join(deckDir, sourcePath);
  if (sourcePath.startsWith("assets/") || fs.existsSync(deckRelative)) return deckRelative;
  return path.join(root, sourcePath);
}

function writeText(filePath, text) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, text);
}

function json(data) {
  return `${JSON.stringify(data, null, 2)}\n`;
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

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function extractFirstTag(xml, tag) {
  const match = String(xml || "").match(new RegExp(`<${tag}>([\\s\\S]*?)<\\/${tag}>`));
  return match ? match[1].trim() : "";
}

function extractAllTags(xml, tag) {
  const pattern = new RegExp(`<${tag}>([\\s\\S]*?)<\\/${tag}>`, "g");
  const values = [];
  let match;
  while ((match = pattern.exec(String(xml || "")))) {
    values.push(match[1].trim());
  }
  return values;
}

function screenModel(slide) {
  const screenXml = slide.xmlPrompt?.screenContent || "";
  const headline = extractFirstTag(screenXml, "headline") || slide.title;
  const message = extractFirstTag(screenXml, "message") || slide.message;
  const anchors = extractAllTags(screenXml, "anchor");
  const bridge = extractFirstTag(screenXml, "bridge") || slide.bridge || "";
  return {
    headline,
    message,
    bullets: anchors.length ? anchors : slide.bullets || [],
    bridge,
  };
}

function findAsset(assetPack, slide) {
  if (!slide.visualAssetId) {
    return null;
  }
  return (assetPack.assets || []).find((asset) => asset.id === slide.visualAssetId) || null;
}

function sourceAssetFor(assetPack, asset) {
  if (!asset) {
    return null;
  }
  if (asset.kind !== "crop-region") {
    return asset;
  }
  return (assetPack.assets || []).find((item) => item.id === asset.sourceAssetId) || null;
}

function cropImage(sourcePath, targetPath, crop) {
  fs.mkdirSync(path.dirname(targetPath), { recursive: true });
  const image = readPng(sourcePath);
  const left = crop.unit === "percent" ? Math.round(image.width * crop.x / 100) : Math.round(crop.x);
  const top = crop.unit === "percent" ? Math.round(image.height * crop.y / 100) : Math.round(crop.y);
  const width = crop.unit === "percent" ? Math.round(image.width * crop.width / 100) : Math.round(crop.width);
  const height = crop.unit === "percent" ? Math.round(image.height * crop.height / 100) : Math.round(crop.height);
  if (left < 0 || top < 0 || width <= 0 || height <= 0 || left + width > image.width || top + height > image.height) {
    throw new Error(`crop is outside image bounds for ${sourcePath}`);
  }
  const output = Buffer.alloc(width * height * image.bytesPerPixel);
  for (let row = 0; row < height; row += 1) {
    const sourceStart = ((top + row) * image.width + left) * image.bytesPerPixel;
    const targetStart = row * width * image.bytesPerPixel;
    image.pixels.copy(output, targetStart, sourceStart, sourceStart + width * image.bytesPerPixel);
  }
  fs.writeFileSync(targetPath, writePng({ width, height, colorType: image.colorType, bitDepth: image.bitDepth, pixels: output }));
}

function readPng(filePath) {
  const buffer = fs.readFileSync(filePath);
  const signature = "89504e470d0a1a0a";
  if (buffer.subarray(0, 8).toString("hex") !== signature) {
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
  if (!header) {
    throw new Error(`PNG is missing IHDR: ${filePath}`);
  }
  if (header.bitDepth !== 8 || header.compression !== 0 || header.filter !== 0 || header.interlace !== 0) {
    throw new Error(`unsupported PNG crop format for ${filePath}; expected 8-bit non-interlaced PNG`);
  }
  const bytesPerPixelByColorType = { 0: 1, 2: 3, 4: 2, 6: 4 };
  const bytesPerPixel = bytesPerPixelByColorType[header.colorType];
  if (!bytesPerPixel) {
    throw new Error(`unsupported PNG color type ${header.colorType} for ${filePath}`);
  }
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
    if (filterType === 0) {
      value = row[x];
    } else if (filterType === 1) {
      value = row[x] + left;
    } else if (filterType === 2) {
      value = row[x] + up;
    } else if (filterType === 3) {
      value = row[x] + Math.floor((left + up) / 2);
    } else if (filterType === 4) {
      value = row[x] + paethPredictor(left, up, upLeft);
    } else {
      throw new Error(`unsupported PNG filter type ${filterType}`);
    }
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
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;
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

function copyVisualAsset(deckDir, slide, assetPack) {
  const asset = findAsset(assetPack, slide);
  const sourceAsset = sourceAssetFor(assetPack, asset);
  const visualAsset = asset?.kind === "crop-region" && asset.sourcePath
    ? asset.sourcePath
    : sourceAsset?.sourcePath || slide.visualAsset;
  if (!visualAsset) {
    return "";
  }
  const sourcePath = resolveAssetPath(deckDir, visualAsset);
  if (!fs.existsSync(sourcePath)) {
    throw new Error(`missing visual asset for ${slide.id}: ${visualAsset}`);
  }
  const safeBase = asset?.kind === "crop-region"
    ? `${asset.id}.png`
    : path.basename(sourcePath).replace(/[^a-zA-Z0-9._-]/g, "-");
  const targetRelative = `assets/visuals/${slide.id}-${safeBase}`;
  const targetPath = path.join(deckDir, targetRelative);
  fs.mkdirSync(path.dirname(targetPath), { recursive: true });
  fs.copyFileSync(sourcePath, targetPath);
  return `../${targetRelative}`;
}

function visualHtml(slide) {
  if (slide.renderedVisualAsset) {
    return `<figure class="visual-figure visual-${escapeHtml(slide.visualType || "existing-image")}">
        <img src="${escapeHtml(slide.renderedVisualAsset)}" alt="${escapeHtml(slide.visualIntent)}">
      </figure>`;
  }
  if (slide.layoutVariant === "handoff") {
    return "";
  }
  return `<div class="visual-card visual-${escapeHtml(slide.visualType || "minimal-diagram")}">
        <span class="visual-label">${escapeHtml(slide.visualIntent)}</span>
      </div>`;
}

function isActOpening(slide) {
  return /(?:^act0-kimai-intro$|cleanup-open|work-handoff|context-recover|repeated-work|kimai-does-everything|required-pre-submit-check)/.test(slide.id || "");
}

function isPracticeBridge(slide) {
  return /practice-handoff|별도 실습 화면|실습 화면/i.test(`${slide.id || ""} ${slide.visualIntent || ""} ${slide.message || ""}`);
}

function layoutVariant(slide, index) {
  if (!slide.visualAssetId && /handoff|별도 실습 화면|실습 화면/i.test(`${slide.visualIntent || ""} ${slide.message || ""}`)) {
    return "handoff";
  }
  if (isActOpening(slide)) return "focus";
  if (isPracticeBridge(slide)) return "handoff";
  if ((slide.bullets || []).length >= 4) return "checklist";
  if ((slide.bullets || []).length <= 1) return "quote";
  if (slide.visualAssetId) {
    return ["standard", "visual-left", "statement", "quote", "checklist"][index % 5];
  }
  return ["standard", "statement", "quote"][index % 3];
}

function shouldRenderVisual(slide) {
  if (!slide.renderedVisualAsset) return false;
  if (["focus", "handoff"].includes(slide.layoutVariant)) return false;
  return true;
}

function shouldCopyVisualForVariant(variant) {
  return !["focus", "handoff"].includes(variant);
}

function bulletListHtml(screen, variant) {
  if (!Array.isArray(screen.bullets) || !screen.bullets.length) return "";
  if (variant === "handoff") {
    return `<div class="handoff-actions">${screen.bullets.map((bullet) => `<span>${escapeHtml(bullet)}</span>`).join("")}</div>`;
  }
  if (variant === "checklist") {
    return `<ol class="bullets bullets--checklist">${screen.bullets.map((bullet) => `<li>${escapeHtml(bullet)}</li>`).join("")}</ol>`;
  }
  if (variant === "statement") {
    return `<div class="bullets bullets--chips">${screen.bullets.map((bullet) => `<span>${escapeHtml(bullet)}</span>`).join("")}</div>`;
  }
  return `<ul class="bullets">${screen.bullets.map((bullet) => `<li>${escapeHtml(bullet)}</li>`).join("")}</ul>`;
}

function slideHtml(slide) {
  const screen = screenModel(slide);
  const variant = slide.layoutVariant || "standard";
  const bullets = bulletListHtml(screen, variant);
  const bridge = screen.bridge ? `<footer class="slide-bridge">${escapeHtml(screen.bridge)}</footer>` : "";
  const evidence = Array.isArray(slide.evidenceClaimIds) ? slide.evidenceClaimIds.join(" ") : "";
  const terms = Array.isArray(slide.glossaryTerms) ? slide.glossaryTerms.join(" ") : "";
  const isWideVisual = slide.assetCrop?.unit === "percent" && slide.assetCrop.width >= 90 && slide.assetCrop.height <= 40;
  const renderVisual = shouldRenderVisual(slide);
  const slideClass = [
    "slide",
    isWideVisual ? "slide--wide-visual" : "",
    variant ? `slide--${variant}` : "",
    renderVisual ? "" : "slide--no-visual",
  ].filter(Boolean).join(" ");
  const media = !renderVisual
    ? ""
    : `<section class="slide-media" aria-label="${escapeHtml(slide.visualIntent)}">
      ${visualHtml(slide)}
    </section>`;
  return `<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(slide.title)}</title>
  <link rel="stylesheet" href="../assets/style.css">
</head>
<body>
  <main class="${slideClass}" data-slide-id="${escapeHtml(slide.id)}" data-evidence-ids="${escapeHtml(evidence)}" data-glossary-terms="${escapeHtml(terms)}">
    <section class="copy">
      <div class="eyebrow">${escapeHtml(slide.section || "")}</div>
      <h2>${escapeHtml(screen.headline)}</h2>
      <p class="message">${escapeHtml(screen.message)}</p>
      ${bullets}
      ${bridge}
    </section>
    ${media}
  </main>
</body>
</html>
`;
}

function copyTemplate(deckDir, relative) {
  const source = path.join(harnessRoot, "templates", relative);
  const target = path.join(deckDir, relative);
  if (!fs.existsSync(source)) {
    throw new Error(`missing template: deck-harness/templates/${relative}`);
  }
  writeText(target, fs.readFileSync(source, "utf8"));
}

function updateManifest(deckDir, stage) {
  const manifestPath = path.join(deckDir, "job-manifest.json");
  const manifest = fs.existsSync(manifestPath)
    ? readJson(manifestPath)
    : {
        jobId: `job-${path.basename(deckDir)}`,
        topicSlug: path.basename(deckDir),
        createdAt: new Date().toISOString(),
        stages: [],
      };
  manifest.stages = Array.isArray(manifest.stages) ? manifest.stages.filter((entry) => entry.name !== stage.name) : [];
  manifest.stages.push(stage);
  writeText(manifestPath, json(manifest));
}

function cleanRenderedVisualCopies(deckDir, slides) {
  const visualsDir = path.join(deckDir, "assets", "visuals");
  if (!fs.existsSync(visualsDir)) return;
  const slidePrefixes = new Set(slides.map((slide) => `${slide.id}-`));
  fs.readdirSync(visualsDir).forEach((file) => {
    if (!file.endsWith(".png")) return;
    if ([...slidePrefixes].some((prefix) => file.startsWith(prefix))) {
      fs.rmSync(path.join(visualsDir, file));
    }
  });
}

function assertProjectorContract(deckDir) {
  const validator = path.join(__dirname, "validate-deck-contract.js");
  const result = spawnSync(process.execPath, [validator, deckDir], { stdio: "inherit" });
  if (result.status !== 0) {
    throw new Error("projector contract validation failed; deck build stopped before writing output");
  }
}

function main() {
  const deckDir = resolveDeckDir(process.argv[2]);
  assertProjectorContract(deckDir);
  const spec = readJson(path.join(deckDir, "slide-spec.json"));
  const claimMap = readJson(path.join(deckDir, "claim-source-map.json"));
  const glossary = readJson(path.join(deckDir, "glossary.json"));
  const assetPack = readAssetPack(deckDir);
  const assetReview = readOptionalJson(deckDir, "asset-review.json");
  const slides = Array.isArray(spec.slides) ? spec.slides : [];

  fs.rmSync(path.join(deckDir, "slides"), { recursive: true, force: true });
  fs.mkdirSync(path.join(deckDir, "slides"), { recursive: true });
  fs.mkdirSync(path.join(deckDir, "assets"), { recursive: true });
  cleanRenderedVisualCopies(deckDir, slides);

  const registry = slides.map((slide, index) => {
    const file = `${slide.id}.html`;
    const variant = slide.layoutVariant || layoutVariant(slide, index);
    const builtSlide = {
      ...slide,
      layoutVariant: variant,
      assetRecord: findAsset(assetPack, slide),
      renderedVisualAsset: shouldCopyVisualForVariant(variant) ? copyVisualAsset(deckDir, slide, assetPack) : "",
    };
    if (builtSlide.assetRecord) {
      builtSlide.assetTeachingRole = builtSlide.assetRecord.teachingRole;
      builtSlide.visualPrompt = slide.visualPrompt || builtSlide.assetRecord.generationPrompt;
      builtSlide.assetCrop = builtSlide.assetRecord.kind === "crop-region" ? builtSlide.assetRecord.crop : null;
    }
    writeText(path.join(deckDir, "slides", file), slideHtml(builtSlide));
    return {
      index: index + 1,
      id: slide.id,
      file,
      section: slide.section,
      sectionObjective: slide.sectionObjective,
      estimatedMinutes: slide.estimatedMinutes,
      title: slide.title,
      message: slide.message,
      bullets: slide.bullets || [],
      visualIntent: slide.visualIntent,
      visualType: slide.visualType || "",
      visualAsset: slide.visualAsset || "",
      visualPrompt: builtSlide.visualPrompt || "",
      visualAssetId: slide.visualAssetId || "",
      layoutVariant: builtSlide.layoutVariant || "",
      renderedVisualAsset: shouldRenderVisual(builtSlide) ? builtSlide.renderedVisualAsset : "",
      sourceAssetId: builtSlide.assetRecord?.sourceAssetId || "",
      assetTeachingRole: builtSlide.assetTeachingRole || "",
      assetExplanationAnchors: builtSlide.assetRecord?.explanationAnchors || [],
      assetSemanticRequirements: builtSlide.assetRecord?.semanticRequirements || null,
      assetCrop: builtSlide.assetCrop || null,
      presenterCues: slide.presenterCues || [],
      bridge: slide.bridge || "",
      interaction: slide.interaction || null,
      xmlPrompt: slide.xmlPrompt || null,
      speakerNote: slide.speakerNote,
      evidenceClaimIds: slide.evidenceClaimIds || [],
      glossaryTerms: slide.glossaryTerms || [],
      qualityChecks: slide.qualityChecks || [],
    };
  });

  writeText(
    path.join(deckDir, "assets", "slides.js"),
    `window.DECK_SLIDES = ${JSON.stringify(registry, null, 2)};\nwindow.DECK_CLAIMS = ${JSON.stringify(claimMap.claims || [], null, 2)};\nwindow.DECK_GLOSSARY = ${JSON.stringify(glossary.terms || [], null, 2)};\nwindow.DECK_ASSET_REVIEWS = ${JSON.stringify(assetReview?.assets || [], null, 2)};\n`
  );

  copyTemplate(deckDir, "deck.html");
  copyTemplate(deckDir, "presenter-review.html");
  copyTemplate(deckDir, "assets/style.css");
  copyTemplate(deckDir, "assets/deck.js");
  copyTemplate(deckDir, "assets/presenter-review.js");

  const inputs = ["slide-spec.json", "claim-source-map.json", "glossary.json", "section-plan.json", "asset-pack.json"];
  if (fs.existsSync(path.join(deckDir, "asset-review.json"))) {
    inputs.push("asset-review.json");
  }
  const outputs = [
    "deck.html",
    "presenter-review.html",
    "assets/slides.js",
    "assets/style.css",
    "assets/deck.js",
    "assets/presenter-review.js",
    ...registry.filter((slide) => slide.renderedVisualAsset).map((slide) => slide.renderedVisualAsset.replace(/^\.\.\//, "")),
    ...registry.map((slide) => `slides/${slide.file}`),
  ];
  updateManifest(deckDir, {
    name: "build-deck",
    owner: "deck-builder-agent",
    inputs,
    outputs,
    inputHash: hashFiles(deckDir, inputs),
    outputHash: hashFiles(deckDir, outputs),
    status: "PASS",
    evidencePath: "HANDOFF.md#verification",
  });

  writeText(
    path.join(deckDir, "evaluation-log.md"),
    `# Evaluation Log

## Command
node deck-harness/scripts/build-deck-from-spec.js ${path.relative(root, deckDir)}

## Exit Code
0

## Summarized Output
Built ${registry.length} slides from slide-spec.json.

## Artifact Path
${path.relative(root, deckDir)}/assets/slides.js

## Viewport
Not rendered by build step.

## Checked Date
${new Date().toISOString().slice(0, 10)}

## Unresolved Count
0

## PASS/WARN/FAIL
PASS
`
  );

  console.log(`Built ${registry.length} slides in ${path.relative(root, deckDir)}`);
  console.log(`Output hash: ${hashFiles(deckDir, outputs)}`);
}

try {
  main();
} catch (error) {
  console.error(`FAIL ${error.message}`);
  process.exitCode = 1;
}
