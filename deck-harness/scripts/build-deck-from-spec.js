#!/usr/bin/env node
const crypto = require("node:crypto");
const { spawnSync } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

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
  const script = `
import sys
from PIL import Image

source, target, x, y, width, height, unit = sys.argv[1:]
image = Image.open(source)
img_width, img_height = image.size
x = float(x)
y = float(y)
width = float(width)
height = float(height)
if unit == "percent":
    left = round(img_width * x / 100)
    top = round(img_height * y / 100)
    right = round(img_width * (x + width) / 100)
    bottom = round(img_height * (y + height) / 100)
else:
    left = round(x)
    top = round(y)
    right = round(x + width)
    bottom = round(y + height)
cropped = image.crop((left, top, right, bottom))
cropped.save(target)
`;
  fs.mkdirSync(path.dirname(targetPath), { recursive: true });
  const result = spawnSync("python3", ["-c", script, sourcePath, targetPath, String(crop.x), String(crop.y), String(crop.width), String(crop.height), crop.unit], {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
  if (result.status !== 0) {
    throw new Error(`failed to crop visual asset: ${result.stderr || result.stdout}`);
  }
}

function copyVisualAsset(deckDir, slide, assetPack) {
  const asset = findAsset(assetPack, slide);
  const sourceAsset = sourceAssetFor(assetPack, asset);
  const visualAsset = sourceAsset?.sourcePath || slide.visualAsset;
  if (!visualAsset) {
    return "";
  }
  const sourcePath = path.isAbsolute(visualAsset) ? visualAsset : path.join(root, visualAsset);
  if (!fs.existsSync(sourcePath)) {
    throw new Error(`missing visual asset for ${slide.id}: ${visualAsset}`);
  }
  const safeBase = asset?.kind === "crop-region"
    ? `${asset.id}.png`
    : path.basename(sourcePath).replace(/[^a-zA-Z0-9._-]/g, "-");
  const targetRelative = `assets/visuals/${slide.id}-${safeBase}`;
  const targetPath = path.join(deckDir, targetRelative);
  fs.mkdirSync(path.dirname(targetPath), { recursive: true });
  if (asset?.kind === "crop-region") {
    cropImage(sourcePath, targetPath, asset.crop);
  } else {
    fs.copyFileSync(sourcePath, targetPath);
  }
  return `../${targetRelative}`;
}

function visualHtml(slide) {
  if (slide.renderedVisualAsset) {
    return `<figure class="visual-figure visual-${escapeHtml(slide.visualType || "existing-image")}">
        <img src="${escapeHtml(slide.renderedVisualAsset)}" alt="${escapeHtml(slide.visualIntent)}">
      </figure>`;
  }
  return `<div class="visual-card visual-${escapeHtml(slide.visualType || "minimal-diagram")}">
        <span class="visual-label">${escapeHtml(slide.visualIntent)}</span>
      </div>`;
}

function slideHtml(slide) {
  const screen = screenModel(slide);
  const bullets = Array.isArray(screen.bullets) && screen.bullets.length
    ? `<ul class="bullets">${screen.bullets.map((bullet) => `<li>${escapeHtml(bullet)}</li>`).join("")}</ul>`
    : "";
  const bridge = screen.bridge ? `<footer class="slide-bridge">${escapeHtml(screen.bridge)}</footer>` : "";
  const evidence = Array.isArray(slide.evidenceClaimIds) ? slide.evidenceClaimIds.join(" ") : "";
  const terms = Array.isArray(slide.glossaryTerms) ? slide.glossaryTerms.join(" ") : "";
  const isWideVisual = slide.assetCrop?.unit === "percent" && slide.assetCrop.width >= 90 && slide.assetCrop.height <= 40;
  const slideClass = isWideVisual ? "slide slide--wide-visual" : "slide";
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
    <section class="slide-media" aria-label="${escapeHtml(slide.visualIntent)}">
      ${visualHtml(slide)}
    </section>
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

function main() {
  const deckDir = resolveDeckDir(process.argv[2]);
  const spec = readJson(path.join(deckDir, "slide-spec.json"));
  const claimMap = readJson(path.join(deckDir, "claim-source-map.json"));
  const glossary = readJson(path.join(deckDir, "glossary.json"));
  const assetPack = readAssetPack(deckDir);
  const assetReview = readOptionalJson(deckDir, "asset-review.json");
  const slides = Array.isArray(spec.slides) ? spec.slides : [];

  fs.rmSync(path.join(deckDir, "slides"), { recursive: true, force: true });
  fs.rmSync(path.join(deckDir, "assets", "visuals"), { recursive: true, force: true });
  fs.mkdirSync(path.join(deckDir, "slides"), { recursive: true });
  fs.mkdirSync(path.join(deckDir, "assets"), { recursive: true });

  const registry = slides.map((slide, index) => {
    const file = `${slide.id}.html`;
    const builtSlide = {
      ...slide,
      assetRecord: findAsset(assetPack, slide),
      renderedVisualAsset: copyVisualAsset(deckDir, slide, assetPack),
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
      sourceAssetId: builtSlide.assetRecord?.sourceAssetId || "",
      assetTeachingRole: builtSlide.assetTeachingRole || "",
      assetExplanationAnchors: builtSlide.assetRecord?.explanationAnchors || [],
      assetSemanticRequirements: builtSlide.assetRecord?.semanticRequirements || null,
      assetCrop: builtSlide.assetCrop || null,
      renderedVisualAsset: builtSlide.renderedVisualAsset || "",
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

main();
