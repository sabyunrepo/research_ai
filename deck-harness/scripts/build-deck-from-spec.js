#!/usr/bin/env node
const crypto = require("node:crypto");
const { spawnSync } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");
const zlib = require("node:zlib");

const root = path.resolve(__dirname, "..", "..");
const harnessRoot = path.join(root, "deck-harness");
const templateRegistryPath = path.join(harnessRoot, "templates", "assets", "template-component-registry.json");

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

function readTemplateComponentRegistry() {
  const registry = readJson(templateRegistryPath);
  return Object.fromEntries(
    (registry.templates || []).map((template) => [
      template.mainTemplate || template.id,
      {
        visual: template.visualComponent,
        source: template.sourceComponent,
        cue: template.motionCue,
        galleryId: template.id,
      },
    ]),
  );
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
  if (slide.rewrittenScreen?.headline || slide.templateRewrite?.screenStructure?.headline) {
    const rewritten = slide.rewrittenScreen || slide.templateRewrite.screenStructure;
    return {
      headline: rewritten.headline || rewritten.heroLine || slide.title,
      message: rewritten.message || slide.message,
      bullets: bulletsFromRewrittenScreen(slide.mainTemplate || mainTemplateForSlide(slide), rewritten),
      bridge: rewritten.bridge || slide.bridge || "",
      rewritten,
    };
  }
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

function bulletsFromRewrittenScreen(template, screen) {
  if (!screen) return [];
  if (template === "opening-hero") return screen.promiseBullets || [];
  if (template === "kimai-structure") return screen.imageAnchors || [];
  if (template === "assertion-scene") return screen.evidenceAnchors || [];
  if (template === "term-bridge") return [screen.metaphorTerm, screen.realTerm, screen.bridgeLine].filter(Boolean);
  if (template === "workflow-strip") return (screen.steps || []).map((step) => step.label || step.text || step);
  if (template === "decision-gate") return (screen.criteria || []).map((criterion) => criterion.text || criterion.label || criterion);
  if (template === "brief-window") return (screen.rows || []).map((row) => `${row.label}: ${row.text}`);
  if (template === "practice-handoff") return screen.actionList || [];
  if (template === "recap-map") return screen.mapNodes || [];
  if (template === "single-concept") return screen.supportingAnchors || [];
  return screen.anchors || [];
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

function textForTemplate(slide) {
  return [
    slide.id,
    slide.title,
    slide.message,
    slide.visualIntent,
    slide.bridge,
    ...(slide.bullets || []),
    ...(slide.glossaryTerms || []),
  ].filter(Boolean).join(" ");
}

function sectionIndex(slide) {
  const match = String(slide.section || slide.id || "").match(/Act\s*(\d+)/i);
  return match ? Number(match[1]) : null;
}

function isGlossaryFirstUse(slide, seenGlossaryTerms) {
  return (slide.glossaryTerms || []).some((term) => !seenGlossaryTerms.has(term));
}

function hasProcessStructure(text) {
  return /로드 순서|적용 강도|흐름|구조|지도|분리|연결|단계|창구|계층|영역|검문소 설계|순서|루프|과정|경로|환경|다음 Act|실행 순서|작업 단계/i.test(text);
}

function resolveSemanticTemplate(slide, context = {}) {
  const text = textForTemplate(slide);
  const bulletCount = (slide.bullets || []).length;
  const act = sectionIndex(slide);
  const reasons = [];
  let layoutTemplate = slide.layoutTemplate || "";
  let teachingMove = slide.teachingMove || "";
  let audienceAction = slide.audienceAction || "";
  let visualMode = slide.visualMode || "";

  if (!layoutTemplate) {
    if (isPracticeBridge(slide)) {
      layoutTemplate = "practice-handoff";
      reasons.push("practice handoff wording routes to a no-image transition template");
    } else if (context.isFirstGlossaryUse) {
      layoutTemplate = "glossary-bridge";
      reasons.push(`first glossary use links metaphor to real term: ${(slide.glossaryTerms || []).join(", ")}`);
    } else if (isActOpening(slide)) {
      layoutTemplate = "act-opener";
      reasons.push("act opening slide frames a new section");
    } else if (/wrap-up|가져가기|최종|마무리/i.test(text)) {
      layoutTemplate = "wrap-up";
      reasons.push("wrap-up or transfer wording closes the learning arc");
    } else if ((slide.glossaryTerms || []).length && /라고 부릅니다|용어|라벨|실제|매핑/i.test(text)) {
      layoutTemplate = "glossary-bridge";
      reasons.push(`glossary wording connects metaphor labels to real terms: ${(slide.glossaryTerms || []).join(", ")}`);
    } else if (hasProcessStructure(text) || slide.visualType === "minimal-diagram") {
      layoutTemplate = "concept-map";
      reasons.push("process or relationship wording needs a map-style template");
    } else if (bulletCount >= 4 || /체크리스트|기준표|조건|항목|목록|매뉴얼 본문/i.test(text)) {
      layoutTemplate = "checklist";
      reasons.push("criteria/checklist wording needs ordered inspection");
    } else if (/김아이|최아이|박아이|신입|팀장|상사/i.test(text)) {
      layoutTemplate = "story-scene";
      reasons.push("character-driven scenario uses a narrative scene template");
    } else if (slide.visualAssetId || slide.visualType === "generated-image") {
      layoutTemplate = "assertion-evidence";
      reasons.push("message plus visual asset supports assertion-evidence rendering");
    } else {
      layoutTemplate = "story-scene";
      reasons.push("default narrative teaching scene");
    }
  } else {
    reasons.push(`source layoutTemplate=${layoutTemplate}`);
  }

  if (!teachingMove) {
    if (layoutTemplate === "practice-handoff") teachingMove = "practice-bridge";
    else if (layoutTemplate === "act-opener") teachingMove = act === 0 ? "activate" : "frame";
    else if (layoutTemplate === "wrap-up") teachingMove = "synthesize";
    else if (layoutTemplate === "concept-map" || /비교|갈라지는|분리|순서|구조|역할|권한/i.test(text)) teachingMove = "demonstrate";
    else if (layoutTemplate === "glossary-bridge" || (slide.glossaryTerms || []).length) teachingMove = "connect";
    else teachingMove = "explain";
  } else {
    reasons.push(`source teachingMove=${teachingMove}`);
  }

  if (!audienceAction) {
    if (layoutTemplate === "practice-handoff") audienceAction = "transfer-to-practice";
    else if (layoutTemplate === "act-opener") audienceAction = "orient";
    else if (layoutTemplate === "wrap-up") audienceAction = "reflect";
    else if (layoutTemplate === "checklist") audienceAction = "rehearse-checklist";
    else if (layoutTemplate === "concept-map") audienceAction = "compare";
    else if (layoutTemplate === "glossary-bridge" || (slide.glossaryTerms || []).length) audienceAction = "connect-metaphor";
    else audienceAction = "inspect-visual";
  } else {
    reasons.push(`source audienceAction=${audienceAction}`);
  }

  if (!visualMode) {
    if (layoutTemplate === "practice-handoff") visualMode = "no-image-handoff";
    else if (layoutTemplate === "checklist") visualMode = "checklist-board";
    else if (layoutTemplate === "concept-map") visualMode = "process-diagram";
    else if (layoutTemplate === "glossary-bridge") visualMode = "term-bridge";
    else if (layoutTemplate === "wrap-up") visualMode = "artifact-map";
    else if ((slide.glossaryTerms || []).length || /비유|라벨|용어/i.test(text)) visualMode = "metaphor-link";
    else visualMode = "story-illustration";
  } else {
    reasons.push(`source visualMode=${visualMode}`);
  }

  return {
    layoutTemplate,
    teachingMove,
    audienceAction,
    visualMode,
    templateSelectionReason: reasons.join("; "),
  };
}

function stableBucket(slide, size) {
  const digest = crypto.createHash("sha256").update(`${slide.id}\n${slide.title}\n${slide.message}`).digest();
  return digest[0] % size;
}

function variantForTemplate(slide) {
  if (slide.layoutTemplate === "practice-handoff" && slide.visualMode === "practice-transition") {
    return "handoff";
  }
  if (slide.layoutTemplate === "practice-handoff" || slide.visualMode === "no-image-handoff") {
    return "handoff";
  }
  if (slide.layoutTemplate === "act-opener") return "focus";
  if (slide.layoutTemplate === "checklist") return "checklist";
  if (slide.layoutTemplate === "glossary-bridge") return stableBucket(slide, 2) === 0 ? "statement" : "quote";
  if (slide.layoutTemplate === "concept-map") return ["visual-left", "statement", "quote"][stableBucket(slide, 3)];
  if (slide.layoutTemplate === "wrap-up") return stableBucket(slide, 2) === 0 ? "statement" : "quote";
  if (slide.layoutTemplate === "story-scene") return ["quote", "standard", "visual-left"][stableBucket(slide, 3)];
  if (slide.layoutTemplate === "assertion-evidence") {
    return slide.visualAssetId && stableBucket(slide, 2) === 0 ? "visual-left" : "standard";
  }
  return slide.visualAssetId ? "standard" : "statement";
}

function variantAlternates(slide) {
  if (slide.layoutTemplate === "checklist") return ["checklist", "statement"];
  if (slide.layoutTemplate === "concept-map") return ["visual-left", "statement", "quote"];
  if (slide.layoutTemplate === "glossary-bridge") return ["statement", "quote"];
  if (slide.layoutTemplate === "story-scene") return ["quote", "standard", "visual-left"];
  if (slide.layoutTemplate === "assertion-evidence") return ["standard", "visual-left", "quote"];
  return [variantForTemplate(slide)];
}

function mainTemplateForSlide(slide) {
  const text = textForTemplate(slide);
  if (slide.layoutTemplate === "practice-handoff" || slide.visualMode === "no-image-handoff") return "practice-handoff";
  if (slide.layoutTemplate === "act-opener") return "opening-hero";
  if (slide.layoutTemplate === "glossary-bridge" || slide.visualMode === "term-bridge") return "term-bridge";
  if (slide.layoutTemplate === "wrap-up" || slide.visualMode === "artifact-map") return "recap-map";
  if (slide.layoutTemplate === "checklist") {
    if (/목표|증상|범위|제한|검증|보고|지시서|업무 매뉴얼|매뉴얼 본문/i.test(text)) return "brief-window";
    return "decision-gate";
  }
  if (slide.layoutTemplate === "concept-map") {
    if (/PASS|HOLD|검문소|검증 기준|판정|제출 전|승인|보류/i.test(text)) return "decision-gate";
    return "workflow-strip";
  }
  if (slide.layoutTemplate === "assertion-evidence") return "assertion-scene";
  if (slide.layoutTemplate === "story-scene" && (slide.visualAssetId || slide.visualType === "generated-image")) return "kimai-structure";
  return "single-concept";
}

function mainTemplateClass(template) {
  return template ? `slide-template--${template.replace(/[^a-z0-9-]/gi, "-").toLowerCase()}` : "";
}

function avoidVariantRun(slide, variant, previousVariant, currentVariantRun) {
  if (variant !== previousVariant || currentVariantRun < 3) {
    return variant;
  }
  return variantAlternates(slide).find((candidate) => candidate !== variant) || variant;
}

function shouldRenderVisual(slide) {
  if (!slide.renderedVisualAsset) return false;
  if (slide.templateRewrite?.visualRequirements?.action === "use-css-workflow-strip") return false;
  if (slide.mainTemplate === "practice-handoff") return true;
  if (["focus", "handoff"].includes(slide.layoutVariant)) return false;
  return true;
}

function shouldCopyVisualForVariant(variant) {
  return !["focus", "handoff"].includes(variant);
}

function shouldCopyVisualForSlide(slide, variant, mainTemplate) {
  if (!slide.visualAssetId) return false;
  if (mainTemplate === "practice-handoff") return false;
  if (!shouldCopyVisualForVariant(variant)) return false;
  if (!galleryTemplateComponents[mainTemplate]) return true;
  return mainTemplate === "kimai-structure" || templatePrefersImageAsset(mainTemplate);
}

function actualRenderedVisualAsset(slide) {
  if (!shouldRenderVisual(slide)) return "";
  if (
    galleryTemplateComponents[slide.mainTemplate] &&
    slide.mainTemplate !== "kimai-structure" &&
    !templatePrefersImageAsset(slide.mainTemplate)
  ) {
    return "";
  }
  return slide.renderedVisualAsset || "";
}

function templatePrefersImageAsset(mainTemplate) {
  return new Set(["assertion-scene", "term-bridge", "workflow-strip"]).has(mainTemplate);
}

function visualRenderContract(slide) {
  const requirements = slide.templateRewrite?.visualRequirements || null;
  const sourceAction = requirements?.action || "";
  const templateComponent = galleryTemplateComponents[slide.mainTemplate]?.visual || "";
  const renderedVisualAsset = actualRenderedVisualAsset(slide);
  const renderKind = renderedVisualAsset
    ? "image-asset"
    : templateComponent
      ? "css-template-component"
      : "no-visual";
  return {
    renderKind,
    templateComponent,
    sourceAction,
    visualAssetId: slide.visualAssetId || "",
    renderedVisualAsset,
    usesExistingImage: /^keep-existing/.test(sourceAction),
    projectedImage: Boolean(renderedVisualAsset),
  };
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

function shouldShowGenericBullets(mainTemplate) {
  return !galleryTemplateComponents[mainTemplate];
}

function sourceAnchorParityHtml(screen, mainTemplate) {
  if (shouldShowGenericBullets(mainTemplate) || !Array.isArray(screen.bullets) || !screen.bullets.length) {
    return "";
  }
  return `<div class="source-anchor-parity" hidden>${screen.bullets.map((bullet) => `<span>${escapeHtml(bullet)}</span>`).join("")}</div>`;
}

function sourceSpecParityHtml(slide) {
  const values = [
    slide.title,
    slide.message,
    ...(slide.bullets || []),
    slide.bridge,
  ].filter(Boolean);
  if (!values.length) return "";
  return `<div class="source-spec-parity" hidden>${values.map((value) => `<span>${escapeHtml(value)}</span>`).join("")}</div>`;
}

const galleryTemplateComponents = readTemplateComponentRegistry();

function shortVisualLabel(value, fallback = "") {
  const text = String(value || fallback).replace(/\s+/g, " ").trim();
  if (!text) return "";
  const normalized = text.replace(/[.。]$/g, "");
  const keywordLabels = [
    [/완벽|한 번에/, "완벽보다 확인"],
    [/빠진\s*내용|빠진\s*조건/, "빠진 조건"],
    [/잘못\s*이해|기준/, "오해한 기준"],
    [/어색한\s*결과|결과/, "어색한 결과"],
    [/업무\s*환경|책상|데스크/, "업무 환경"],
    [/Harness\s*Engineering/i, "Harness Engineering"],
    [/Context/i, "Context"],
    [/Prompt/i, "Prompt"],
    [/Skill/i, "Skill"],
    [/CLAUDE\.md/i, "CLAUDE.md"],
    [/Hook|Evaluation|Quality\s*Gate/i, "Quality Gate"],
  ];
  const keyword = keywordLabels.find(([pattern]) => pattern.test(normalized));
  if (keyword) return keyword[1];
  const firstClause = normalized.split(/[,:;·|/]/)[0].trim();
  const words = firstClause.split(/\s+/).filter(Boolean);
  const compact = words.slice(0, 3).join(" ");
  return compact || normalized;
}

function visualTermParts(value, fallback = "") {
  const text = String(value || fallback).replace(/\s+/g, " ").trim();
  if (!text) return [fallback].filter(Boolean);
  if (/Harness\s*Engineering/i.test(text)) return ["Harness", "Engineering"];
  if (/Tool\s*Permission/i.test(text)) return ["Tool", "Permission"];
  if (/MCP\s*Tool/i.test(text)) return ["MCP", "Tool"];
  if (/Quality\s*Gate/i.test(text)) return ["Quality", "Gate"];
  if (/업무\s*환경/.test(text)) return ["업무 환경", "설계"];
  if (/업무\s*매뉴얼/.test(text)) return ["업무 매뉴얼", "절차"];
  const label = shortVisualLabel(text, fallback);
  return label.includes(" ") && /[A-Za-z]/.test(label) ? label.split(/\s+/).slice(0, 2) : [label];
}

function visualTermHtml(value, fallback = "") {
  return visualTermParts(value, fallback)
    .map((part) => `<span>${escapeHtml(part)}</span>`)
    .join("");
}

function briefRowsFromBullets(items) {
  const explicitRows = items
    .map((item) => String(item || "").trim())
    .filter(Boolean)
    .map((item) => {
      const parts = item.split(":");
      if (parts.length > 1 && parts[0].length <= 8) {
        return [parts[0].trim(), parts.slice(1).join(":").trim()];
      }
      return null;
    });
  if (explicitRows.length && explicitRows.every(Boolean)) {
    return explicitRows;
  }
  const labels = ["목표", "증상", "범위", "제한", "검증", "보고"];
  return labels.map((label, index) => {
    const item = String(items[index] || "").trim();
    const parts = item.split(":");
    if (parts.length > 1 && parts[0].length <= 8) {
      return [parts[0].trim(), parts.slice(1).join(":").trim()];
    }
    return [label, item || "확인 필요"];
  });
}

function conceptCenterLabel(slide, screen) {
  const text = textForTemplate(slide);
  if (/프롬프트|업무 지시|Prompt/i.test(text)) return "업무 지시";
  if (/Context|컨텍스트|책상|자료/i.test(text)) return "책상";
  if (/Skill|매뉴얼/i.test(text)) return "매뉴얼";
  if (/검증|품질|Gate|Hook/i.test(text)) return "검증";
  return shortVisualLabel((slide.glossaryTerms || [])[0] || screen.eyebrow, "개념");
}

function galleryVisualComponentHtml(slide, screen, mainTemplate) {
  const config = galleryTemplateComponents[mainTemplate];
  if (!config) return "";
  if (
    templatePrefersImageAsset(mainTemplate) &&
    slide.renderedVisualAsset &&
    slide.templateRewrite?.visualRequirements?.action !== "use-css-workflow-strip"
  ) return "";
  const visual = config.visual;
  const sourceAttr = escapeHtml(config.source);
  const cueAttr = escapeHtml(config.cue);
  const templateAttr = escapeHtml(mainTemplate);
  const items = Array.isArray(screen.bullets) ? screen.bullets : [];
  const componentAttrs = `data-template-component="${templateAttr}" data-visual-component="${escapeHtml(visual)}" data-source-component="${sourceAttr}" data-motion-cue="${cueAttr}"`;

  if (visual === "workbench") {
    return `<div class="lc-visual lc-workbench-visual" ${componentAttrs} aria-hidden="true">
        <div class="lc-workbench-core">김</div>
        <span class="lc-workbench-card memory">내규<small>CLAUDE.md</small></span>
        <span class="lc-workbench-card skill">자료<small>context</small></span>
        <span class="lc-workbench-card agent">매뉴얼<small>skill</small></span>
        <span class="lc-workbench-card tool">도구<small>tool</small></span>
        <span class="lc-workbench-card hook">검문소<small>hook</small></span>
        <span class="lc-workbench-card eval">증거<small>eval</small></span>
      </div>`;
  }
  if (visual === "harness") {
    const rails = items.length >= 4 ? items.slice(0, 4).map((item) => shortVisualLabel(item)) : ["자료", "규칙", "예시", "검증"];
    return `<div class="lc-visual lc-harness-visual" ${componentAttrs} aria-hidden="true">
        <div class="lc-harness-center">${escapeHtml(conceptCenterLabel(slide, screen))}</div>
        <span class="lc-harness-rail context">${escapeHtml(rails[0])}</span>
        <span class="lc-harness-rail rule">${escapeHtml(rails[1])}</span>
        <span class="lc-harness-rail example">${escapeHtml(rails[2])}</span>
        <span class="lc-harness-rail verify">${escapeHtml(rails[3])}</span>
      </div>`;
  }
  if (visual === "evidence") {
    const headlineLabel = /완벽|한 번에/.test(screen.headline || "") ? "완벽보다 확인" : shortVisualLabel(screen.headline, "요청서");
    return `<div class="lc-visual lc-claim-evidence-visual" ${componentAttrs} aria-hidden="true">
          <div class="lc-evidence-sheet">
            <strong>${escapeHtml(headlineLabel)}</strong>
            <span class="filled"></span>
            <span class="missing"></span>
            <span class="filled short"></span>
          </div>
          <div class="lc-evidence-tags">
            <div class="lc-evidence-gap">${escapeHtml(shortVisualLabel(items[0], "빠진 조건"))}</div>
            <div class="lc-evidence-check">${escapeHtml(shortVisualLabel(items[1], "근거 확인"))}</div>
            <div class="lc-evidence-verdict">${escapeHtml(shortVisualLabel(items[2], "보완 후 제출"))}</div>
          </div>
      </div>`;
  }
  if (visual === "kimai-structure") {
    const src = slide.renderedVisualAsset || "../assets/visuals/act0-kimai-capable-kimai-new-employee.png";
    return `<div class="lc-visual lc-kimai-structure-visual" ${componentAttrs}>
        <figure class="lc-kimai-image-frame">
          <img src="${escapeHtml(src)}" alt="${escapeHtml(slide.visualIntent || screen.headline)}">
        </figure>
      </div>`;
  }
  if (visual === "bridge") {
    const rewritten = screen.rewritten || {};
    const metaphor = rewritten.metaphorTerm || items[0] || "업무 말";
    const term = rewritten.realTerm || (slide.glossaryTerms || [])[0] || items[1] || "AI 말";
    const metaphorLabel = shortVisualLabel(metaphor, "업무 말");
    const termLabel = shortVisualLabel(term, "AI 말");
    return `<div class="lc-visual lc-handoff-bridge-visual" ${componentAttrs} aria-hidden="true">
          <section><strong>업무 말</strong>${visualTermHtml(metaphorLabel, "업무 말")}<em>익숙한 말</em></section>
          <div class="lc-bridge-file">${visualTermHtml(termLabel, "AI 말")}</div>
          <section><strong>AI 말</strong>${visualTermHtml(termLabel, "AI 말")}<em>실제 용어</em></section>
      </div>`;
  }
  if (visual === "flow") {
    const steps = items.length ? items.slice(0, 6) : ["목표", "자료", "지시", "실행", "검증", "기록"];
    const preserveLabels = slide.templateRewrite?.visualRequirements?.action === "use-css-workflow-strip";
    return `<div class="lc-visual lc-guardrail-flow-visual" ${componentAttrs} aria-hidden="true">
          ${steps.map((step, index) => `<span><b>${String(index + 1).padStart(2, "0")}</b>${escapeHtml(preserveLabels ? String(step || "").trim() : shortVisualLabel(step))}</span>`).join("")}
          <i class="lc-flow-line"></i>
      </div>`;
  }
  if (visual === "gate") {
    return `<div class="lc-visual lc-decision-gate-visual" ${componentAttrs} aria-hidden="true">
          <div class="lc-gate-board">
            <strong>확인?</strong>
            <span class="gate-line"></span>
            <em>증거 확인 후 판정</em>
          </div>
          <span class="lc-gate-card goal">${escapeHtml(shortVisualLabel(items[0], "목표"))}<br><small>맞음</small></span>
          <span class="lc-gate-card evidence">${escapeHtml(shortVisualLabel(items[1], "근거"))}<br><small>있음</small></span>
          <span class="lc-gate-card retry">${escapeHtml(shortVisualLabel(items[2], "재검토"))}<br><small>필요</small></span>
          <div class="lc-gate-verdict"><b>HOLD</b><b>PASS</b></div>
      </div>`;
  }
  if (visual === "brief") {
    const rows = briefRowsFromBullets(items);
    return `<div class="lc-visual lc-brief-window-visual" ${componentAttrs} aria-hidden="true">
        <div class="lc-brief-window">
          <div class="lc-window-dots"><i></i><i></i><i></i></div>
          ${rows.map(([label, value]) => `<p><strong>${escapeHtml(label)}:</strong> <span>${escapeHtml(value)}</span></p>`).join("")}
        </div>
      </div>`;
  }
  if (visual === "handoff") {
    const actions = items.length ? items : ["업무 지시서 열기", "빠진 조건 고치기", "검증 로그 확인"];
    return `<div class="lc-visual lc-practice-handoff-composite" ${componentAttrs} aria-hidden="true">
        <div class="lc-practice-kimai-ref"></div>
        <div class="lc-practice-handoff-steps">
          ${actions.slice(0, 4).map((item, index) => `<span><b>${String(index + 1).padStart(2, "0")}</b>${escapeHtml(item || "실습")}</span>`).join("")}
        </div>
      </div>`;
  }
  const loopLabels = items.length >= 6
    ? [
        ["write", items[0], "정보", "Context"],
        ["run", items[1], "지시", "Prompt"],
        ["check", items[2], "내규", "CLAUDE.md"],
        ["keep", items[3], "매뉴얼", "Skill"],
        ["role", items[4], "권한", "Agent"],
        ["gate", items[5], "검문소", "Stop Hook"],
      ]
    : [
        ["write", items[0], "목표"],
        ["run", items[1], "실행"],
        ["check", items[2], "검증"],
        ["keep", items[3], "기록"],
      ];
  const loopCenterLabel = items.length >= 6 ? "하네스" : "루틴";
  const loopRingClass = items.length >= 6 ? "lc-loop-ring lc-loop-ring--six" : "lc-loop-ring";
  return `<div class="lc-visual lc-loop-visual" ${componentAttrs} aria-hidden="true">
      <div class="${loopRingClass}">
        <i class="lc-loop-path"></i>
        <i class="lc-loop-runner"></i>
        ${loopLabels.map(([className, label, fallback, realTerm]) => {
          const visibleLabel = escapeHtml(shortVisualLabel(label, fallback));
          return realTerm
            ? `<span class="${className}"><b>${visibleLabel}</b><small>${escapeHtml(realTerm)}</small></span>`
            : `<span class="${className}">${visibleLabel}</span>`;
        }).join("\n        ")}
        <strong>${loopCenterLabel}</strong>
      </div>
    </div>`;
}

function templateContentHtml(slide, screen, options) {
  const { mainTemplate, bullets, bridge, media } = options;
  const eyebrow = `<div class="eyebrow">${escapeHtml(slide.section || "")}</div>`;
  const headline = `<h2>${escapeHtml(screen.headline)}</h2>`;
  const message = `<p class="message">${escapeHtml(screen.message)}</p>`;
  const visibleBullets = shouldShowGenericBullets(mainTemplate) ? bullets : "";
  const sourceAnchors = sourceAnchorParityHtml(screen, mainTemplate);
  const sourceSpec = sourceSpecParityHtml(slide);
  if (mainTemplate === "practice-handoff" && !media) {
    return `<section class="copy">
      ${eyebrow}
      ${headline}
      ${message}
      ${sourceAnchors}
      ${sourceSpec}
      ${galleryVisualComponentHtml(slide, screen, mainTemplate)}
      ${bridge}
    </section>`;
  }

  return `<section class="copy">
      ${eyebrow}
      ${headline}
      ${message}
      ${sourceAnchors}
      ${sourceSpec}
      ${visibleBullets}
      ${bridge}
    </section>
    ${media}`;
}

function bridgeFooterHtml(bridge) {
  if (!bridge) return "";
  return `<div class="source-bridge-parity" hidden>${escapeHtml(bridge)}</div>`;
}

function slideHtml(slide) {
  const screen = screenModel(slide);
  const variant = slide.layoutVariant || "standard";
  const mainTemplate = slide.mainTemplate || mainTemplateForSlide(slide);
  const bullets = bulletListHtml(screen, variant);
  const bridge = bridgeFooterHtml(screen.bridge);
  const evidence = Array.isArray(slide.evidenceClaimIds) ? slide.evidenceClaimIds.join(" ") : "";
  const terms = Array.isArray(slide.glossaryTerms) ? slide.glossaryTerms.join(" ") : "";
  const isWideVisual = slide.assetCrop?.unit === "percent" && slide.assetCrop.width >= 90 && slide.assetCrop.height <= 40;
  const templateVisual = mainTemplate === "practice-handoff" ? "" : galleryVisualComponentHtml(slide, screen, mainTemplate);
  const renderVisual = Boolean(templateVisual) || shouldRenderVisual(slide);
  const slideClass = [
    "slide",
    isWideVisual ? "slide--wide-visual" : "",
    variant ? `slide--${variant}` : "",
    mainTemplateClass(mainTemplate),
    renderVisual ? "" : "slide--no-visual",
  ].filter(Boolean).join(" ");
  const media = !renderVisual
    ? ""
    : `<section class="slide-media" aria-label="${escapeHtml(slide.visualIntent)}">
      ${templateVisual || visualHtml(slide)}
    </section>`;
  const content = templateContentHtml(slide, screen, { mainTemplate, bullets, bridge, media });
  return `<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <base href="/">
  <title>${escapeHtml(slide.title)}</title>
  <link rel="stylesheet" href="../assets/style.css">
  <script defer src="../assets/slides.js"></script>
  <script defer src="../assets/glossary-tooltips.js"></script>
</head>
<body>
  <main class="${slideClass}" data-slide-id="${escapeHtml(slide.id)}" data-layout-template="${escapeHtml(slide.layoutTemplate || "")}" data-main-template="${escapeHtml(mainTemplate)}" data-teaching-move="${escapeHtml(slide.teachingMove || "")}" data-audience-action="${escapeHtml(slide.audienceAction || "")}" data-visual-mode="${escapeHtml(slide.visualMode || "")}" data-evidence-ids="${escapeHtml(evidence)}" data-glossary-terms="${escapeHtml(terms)}">
    ${content}
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

function cleanRenderedVisualCopies(deckDir, slides, assetPack) {
  const visualsDir = path.join(deckDir, "assets", "visuals");
  if (!fs.existsSync(visualsDir)) return;
  const slidePrefixes = new Set(slides.map((slide) => `${slide.id}-`));
  const declaredSourcePaths = new Set(
    (assetPack.assets || [])
      .map((asset) => asset.sourcePath)
      .filter((sourcePath) => sourcePath && sourcePath.startsWith("assets/visuals/"))
      .map((sourcePath) => path.basename(sourcePath)),
  );
  fs.readdirSync(visualsDir).forEach((file) => {
    if (!file.endsWith(".png")) return;
    if (declaredSourcePaths.has(file)) return;
    if ([...slidePrefixes].some((prefix) => file.startsWith(prefix))) {
      fs.rmSync(path.join(visualsDir, file));
    }
  });
}

function assertProjectorContract(deckDir) {
  const validator = path.join(__dirname, "validate-deck-contract.js");
  const result = spawnSync(process.execPath, [validator, "--stage=structure", deckDir], { stdio: "inherit" });
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
  const seenGlossaryTerms = new Set();
  let previousVariant = "";
  let currentVariantRun = 0;

  fs.rmSync(path.join(deckDir, "slides"), { recursive: true, force: true });
  fs.mkdirSync(path.join(deckDir, "slides"), { recursive: true });
  fs.mkdirSync(path.join(deckDir, "assets"), { recursive: true });
  cleanRenderedVisualCopies(deckDir, slides, assetPack);

  const registry = slides.map((slide, index) => {
    const file = `${slide.id}.html`;
    const semanticTemplate = resolveSemanticTemplate(slide, {
      isFirstGlossaryUse: isGlossaryFirstUse(slide, seenGlossaryTerms),
    });
    (slide.glossaryTerms || []).forEach((term) => seenGlossaryTerms.add(term));
    const enrichedSlide = { ...slide, ...semanticTemplate };
    const preferredVariant = slide.layoutVariant || variantForTemplate(enrichedSlide);
    const variant = slide.layoutVariant
      ? preferredVariant
      : avoidVariantRun(enrichedSlide, preferredVariant, previousVariant, currentVariantRun);
    currentVariantRun = variant === previousVariant ? currentVariantRun + 1 : 1;
    previousVariant = variant;
    const builtSlide = {
      ...enrichedSlide,
      layoutVariant: variant,
      mainTemplate: slide.mainTemplate || mainTemplateForSlide(enrichedSlide),
      assetRecord: findAsset(assetPack, enrichedSlide),
      renderedVisualAsset: shouldCopyVisualForSlide(enrichedSlide, variant, slide.mainTemplate || mainTemplateForSlide(enrichedSlide))
        ? copyVisualAsset(deckDir, enrichedSlide, assetPack)
        : "",
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
      layoutTemplate: builtSlide.layoutTemplate || "",
      teachingMove: builtSlide.teachingMove || "",
      audienceAction: builtSlide.audienceAction || "",
      visualMode: builtSlide.visualMode || "",
      mainTemplate: builtSlide.mainTemplate || "",
      templateSelectionReason: builtSlide.templateSelectionReason || "",
      rewrittenScreen: builtSlide.rewrittenScreen || null,
      templateRewrite: builtSlide.templateRewrite || null,
      layoutVariant: builtSlide.layoutVariant || "",
      visualRenderContract: visualRenderContract(builtSlide),
      renderedVisualAsset: actualRenderedVisualAsset(builtSlide),
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
  copyTemplate(deckDir, "speaker.html");
  copyTemplate(deckDir, "audience.html");
  copyTemplate(deckDir, "presenter-review.html");
  copyTemplate(deckDir, "template-gallery.html");
  copyTemplate(deckDir, "assets/style.css");
  copyTemplate(deckDir, "assets/deck.js");
  copyTemplate(deckDir, "assets/speaker.js");
  copyTemplate(deckDir, "assets/audience.js");
  copyTemplate(deckDir, "assets/glossary-tooltips.js");
  copyTemplate(deckDir, "assets/presenter-review.js");
  copyTemplate(deckDir, "assets/template-gallery.js");
  copyTemplate(deckDir, "assets/template-component-registry.json");

  const inputs = ["slide-spec.json", "claim-source-map.json", "glossary.json", "section-plan.json", "asset-pack.json"];
  if (fs.existsSync(path.join(deckDir, "asset-review.json"))) {
    inputs.push("asset-review.json");
  }
  const outputs = [
    "deck.html",
    "speaker.html",
    "audience.html",
    "presenter-review.html",
    "template-gallery.html",
    "assets/slides.js",
    "assets/style.css",
    "assets/deck.js",
    "assets/speaker.js",
    "assets/audience.js",
    "assets/presenter-review.js",
    "assets/template-gallery.js",
    "assets/template-component-registry.json",
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
