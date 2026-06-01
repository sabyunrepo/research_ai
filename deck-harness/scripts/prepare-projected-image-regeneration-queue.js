#!/usr/bin/env node
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = path.resolve(__dirname, "..", "..");

function usage() {
  console.error("Usage: node deck-harness/scripts/prepare-projected-image-regeneration-queue.js <deck-dir>");
  process.exit(1);
}

function resolveDeckDir(input) {
  if (!input) usage();
  return path.isAbsolute(input) ? input : path.join(root, input);
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function loadRegistry(deckDir) {
  const context = { window: {} };
  vm.createContext(context);
  vm.runInContext(fs.readFileSync(path.join(deckDir, "assets", "slides.js"), "utf8"), context, {
    filename: path.join(deckDir, "assets", "slides.js"),
  });
  return context.window.DECK_SLIDES || [];
}

function designRules() {
  const designPath = path.join(root, "디자인.md");
  const text = fs.existsSync(designPath) ? fs.readFileSync(designPath, "utf8") : "";
  const rules = [
    "pure white background",
    "minimal black hand-drawn linework",
    "one blue accent #2563eb only",
    "consistent Kimai character: round face, small headset or antenna, simple office posture",
    "standalone image only; no slide frame, crop mark, panel border, or page chrome",
    "harness owns deterministic placement, frame, tilt, shadow, and object-fit",
  ];
  if (/그라데이션|gradient/i.test(text)) rules.push("no gradients");
  if (/최대\s*2색|2색/.test(text)) rules.push("black and white plus at most one blue accent");
  return rules;
}

function promptFor(slide, asset, rules) {
  const anchors = asset.explanationAnchors || slide.assetExplanationAnchors || [];
  const mustShow = asset.semanticRequirements?.mustShow || [];
  const mustNotShow = asset.semanticRequirements?.mustNotShow || [];
  const target = asset.sourcePath || `assets/visuals/${asset.id}-single.png`;
  return [
    "Use case: Korean beginner workshop lecture image",
    `Slide: ${slide.index}. ${slide.id}`,
    `Asset id: ${asset.id}`,
    `Target: ${target}`,
    `Teaching role: ${asset.teachingRole || slide.assetTeachingRole || slide.visualIntent}`,
    `Primary request: ${asset.generationPrompt || slide.visualPrompt || slide.visualIntent}`,
    anchors.length ? `Explanation anchors: ${anchors.join("; ")}` : "",
    mustShow.length ? `Must show: ${mustShow.join("; ")}` : "",
    mustNotShow.length ? `Must not show: ${mustNotShow.join("; ")}` : "",
    `Design constraints: ${rules.join("; ")}.`,
    "Generate exactly one clean standalone illustration. Keep all important characters, labels, documents, arrows, cards, and blue accent marks comfortably inside the image with generous padding.",
    "Do not include dense Korean paragraphs. Use short labels only when they are essential to the teaching point.",
    "The deck harness will compose the image inside the selected slide template; do not draw the slide frame or final card frame in the image.",
  ].filter(Boolean).join("\n");
}

function singleImageTarget(sourcePath, assetId) {
  const fallback = `assets/visuals/${assetId}-single.png`;
  const base = sourcePath || fallback;
  return base.replace(/(?:-single)?\.png$/, "-single.png");
}

function main() {
  const deckDir = resolveDeckDir(process.argv[2]);
  const assetPack = readJson(path.join(deckDir, "asset-pack.json"));
  const assetsById = new Map((assetPack.assets || []).map((asset) => [asset.id, asset]));
  const registry = loadRegistry(deckDir);
  const rules = designRules();
  const items = registry
    .filter((slide) => slide.visualRenderContract?.usesExistingImage && slide.visualRenderContract?.projectedImage)
    .map((slide, index) => {
      const asset = assetsById.get(slide.visualAssetId) || {};
      const proposedTarget = singleImageTarget(asset.sourcePath, slide.visualAssetId);
      return {
        index: index + 1,
        slideIndex: slide.index,
        slideId: slide.id,
        visualAssetId: slide.visualAssetId,
        currentRenderedVisualAsset: slide.renderedVisualAsset,
        currentSourcePath: asset.sourcePath || "",
        proposedTarget,
        mainTemplate: slide.mainTemplate,
        layoutTemplate: slide.layoutTemplate,
        visualMode: slide.visualMode,
        deterministicComposition: {
          owner: "deck-harness",
          slot: "visualAssetId",
          outputPath: proposedTarget,
          finalPlacement: "build-deck-from-spec + template CSS",
        },
        promptText: promptFor(slide, { ...asset, sourcePath: proposedTarget }, rules),
      };
    });

  const queue = {
    generatedAt: new Date().toISOString(),
    deck: path.relative(root, deckDir),
    mode: "projected-existing-image-regeneration",
    designSource: "디자인.md",
    itemCount: items.length,
    items,
  };
  const queuePath = path.join(deckDir, "projected-image-regeneration-queue.json");
  fs.writeFileSync(queuePath, `${JSON.stringify(queue, null, 2)}\n`);
  console.log(`Projected image regeneration queue: ${path.relative(root, queuePath)}`);
  console.log(`Projected existing-image assets: ${items.length}`);
}

try {
  main();
} catch (error) {
  console.error(`FAIL prepare projected image regeneration queue: ${error.message}`);
  process.exitCode = 1;
}
