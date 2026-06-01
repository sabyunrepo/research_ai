#!/usr/bin/env node
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..", "..");

function usage() {
  console.error("Usage: node deck-harness/scripts/prepare-asset-generation-prompts.js <deck-dir> [--limit=N] [--include-review-warnings] [--explode-warning-sheets] [--only-review-warnings] [--only-single-image-first] [--clean-single-image-first]");
  process.exit(1);
}

function resolveDeckDir(input) {
  if (!input) usage();
  return path.isAbsolute(input) ? input : path.join(root, input);
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function parseArgs(argv) {
  const options = {
    deckDirInput: null,
    limit: Infinity,
    includeReviewWarnings: false,
    explodeWarningSheets: false,
    onlyReviewWarnings: false,
    onlySingleImageFirst: false,
    cleanSingleImageFirst: false,
  };
  argv.forEach((arg) => {
    if (arg.startsWith("--limit=")) {
      options.limit = Number(arg.slice("--limit=".length));
      if (!Number.isFinite(options.limit) || options.limit < 1) usage();
      return;
    }
    if (arg === "--include-review-warnings") {
      options.includeReviewWarnings = true;
      return;
    }
    if (arg === "--explode-warning-sheets") {
      options.explodeWarningSheets = true;
      return;
    }
    if (arg === "--only-review-warnings") {
      options.onlyReviewWarnings = true;
      return;
    }
    if (arg === "--only-single-image-first") {
      options.onlySingleImageFirst = true;
      return;
    }
    if (arg === "--clean-single-image-first") {
      options.onlySingleImageFirst = true;
      options.cleanSingleImageFirst = true;
      return;
    }
    if (!options.deckDirInput) {
      options.deckDirInput = arg;
      return;
    }
    usage();
  });
  return options;
}

function cropReviewWarnings(deckDir) {
  const reviewPath = path.join(deckDir, "asset-crop-review.json");
  if (!fs.existsSync(reviewPath)) return { sourceIds: new Set(), assetIds: new Set() };
  const review = readJson(reviewPath);
  const warnings = (review.checked || []).filter((item) => item.status === "WARN");
  return {
    sourceIds: new Set(warnings.filter((item) => item.sourceAssetId).map((item) => item.sourceAssetId)),
    assetIds: new Set(warnings.filter((item) => item.assetId).map((item) => item.assetId)),
  };
}

function designRules() {
  const designPath = path.join(root, "디자인.md");
  const text = fs.existsSync(designPath) ? fs.readFileSync(designPath, "utf8") : "";
  const rules = [
    "white background #ffffff",
    "minimal black hand-drawn linework",
    "one blue accent #2563eb only",
    "simple doodle-like lecture illustration",
    "no gradients",
    "no glow, glass, blur, or glossy effects",
    "no photorealistic, 3D, or complex icon set",
    "large readable visual anchors for projector use",
    "consistent Kimai character: same round face, small antenna headset, simple desk-work posture, black linework, blue accent only",
    "no visible cell numbers, circled numbers, sheet labels, crop marks, borders, or panel numbering inside final artwork",
  ];
  if (text.includes("그라데이션")) rules.push("strictly follow 디자인.md: gradients and decorative effects are forbidden");
  if (text.includes("최대 2색")) rules.push("strictly follow 디자인.md: use black/white plus at most one blue accent");
  return rules;
}

function roundPercent(value) {
  return Number(value.toFixed(3));
}

function panelCoordinateLines(asset) {
  const layout = asset.sheetLayout;
  if (!layout) return [];
  const columns = Number(layout.columns);
  const rows = Number(layout.rows);
  if (!Number.isInteger(columns) || !Number.isInteger(rows)) return [];
  const safeMargin = Number(layout.safeMarginPercent ?? layout.insetPercent ?? 2);
  const cellWidth = 100 / columns;
  const cellHeight = 100 / rows;
  const sourceWidth = layout.sourceWidthPx;
  const sourceHeight = layout.sourceHeightPx;
  const cellWidthPx = layout.cellWidthPx;
  const cellHeightPx = layout.cellHeightPx;
  const lines = [
    "<assetRequirement>",
    `  <sheetLayout id="${asset.id}" columns="${columns}" rows="${rows}" panelCount="${columns * rows}" cellOrder="row-major-left-to-right" safeMargin="${safeMargin}%"${sourceWidth ? ` sourceWidthPx="${sourceWidth}"` : ""}${sourceHeight ? ` sourceHeightPx="${sourceHeight}"` : ""}${cellWidthPx ? ` cellWidthPx="${cellWidthPx}"` : ""}${cellHeightPx ? ` cellHeightPx="${cellHeightPx}"` : ""}${layout.panelAspectRatio ? ` panelAspectRatio="${layout.panelAspectRatio}"` : ""}>`,
  ];
  for (let index = 1; index <= columns * rows; index += 1) {
    const col = (index - 1) % columns;
    const row = Math.floor((index - 1) / columns);
    lines.push(`    <panel index="${index}" row="${row + 1}" column="${col + 1}" x="${roundPercent(col * cellWidth)}%" y="${roundPercent(row * cellHeight)}%" width="${roundPercent(cellWidth)}%" height="${roundPercent(cellHeight)}%"${cellWidthPx ? ` xPx="${roundPercent(col * cellWidthPx)}" widthPx="${roundPercent(cellWidthPx)}"` : ""}${cellHeightPx ? ` yPx="${roundPercent(row * cellHeightPx)}" heightPx="${roundPercent(cellHeightPx)}"` : ""} safeMargin="${safeMargin}%">Keep every character, label, and blue accent inside this safe margin; leave white gutter at all panel edges.</panel>`);
  }
  lines.push("  </sheetLayout>");
  lines.push("  <forbidden>visible panel numbers, circled numbers, cell labels, crop marks, adjacent panel text, cut-off Korean text, cut-off character bodies, edge artifacts</forbidden>");
  lines.push("</assetRequirement>");
  return lines;
}

function singleImageRequirementLines(asset) {
  return [
    "<assetRequirement>",
    `  <singleImage id="${asset.id}" generationMode="single-image-first" target="${asset.sourcePath || `assets/visuals/${asset.id}.png`}">`,
    "    Generate exactly one standalone illustration, not a sprite sheet and not a grid.",
    "    Keep the full character, labels, arrows, and blue accent marks comfortably inside the image with generous white padding.",
    "    The deck harness will place this image into deterministic CSS/card frames, so do not draw slide frames, crop marks, panel borders, or page chrome.",
    "    Use short readable Korean labels only when they are essential to the teaching point; prefer 1-3 word labels over sentences.",
    "  </singleImage>",
    "  <forbidden>sprite sheet, multi-panel grid, visible panel numbers, circled numbers, row or column labels, crop marks, adjacent panel text, cut-off Korean text, cut-off character bodies, decorative frame, hard edge artifacts</forbidden>",
    "</assetRequirement>",
  ];
}

function promptRowsForAsset(asset, rules, queueKind) {
  const kind = queueKind || asset.kind;
  const target = asset.sourcePath || `assets/visuals/${asset.id}.png`;
  const requirementLines = kind === "single-image-from-warning"
    ? singleImageRequirementLines(asset)
    : asset.xmlPrompt
      ? [
        asset.xmlPrompt.instruction,
        asset.xmlPrompt.assetRequirement,
        asset.xmlPrompt.negativePrompt,
        asset.xmlPrompt.reviewChecklist,
      ]
      : asset.kind === "sprite-sheet"
        ? panelCoordinateLines(asset)
        : singleImageRequirementLines(asset);
  return [
    `Kind: \`${kind}\``,
    `Target: \`${target}\``,
    asset.kind === "crop-region" && asset.sourceAssetId ? `Previous source sheet: \`${asset.sourceAssetId}\`` : null,
    "",
    "```text",
    "Use case: scientific-educational",
    "Asset type: Korean beginner workshop lecture image",
    `Asset id: ${asset.id}`,
    `Teaching role: ${asset.teachingRole}`,
    `Primary request: ${asset.generationPrompt}`,
    `Explanation anchors: ${(asset.explanationAnchors || []).join("; ")}`,
    `Design constraints: ${rules.join("; ")}.`,
    "Composition: keep one clear teaching point, enough whitespace, and visible workplace/requester/context relationships when relevant. Keep Kimai visually consistent across all generated assets.",
    "Deterministic composition contract: create only the standalone drawing; the deck harness owns final frame, tilt, card shadow, object-fit, and placement.",
    "Avoid: decorative backgrounds, dense text, tiny labels, generic office icon clusters, gradients, shadows used as decoration, glass effects, glow, 3D, photorealism, visible cell numbers, circled numbers, grid labels, crop marks, or sprite-sheet borders.",
    ...requirementLines,
    "```",
    "",
  ].filter((line) => line !== null);
}

function cleanSingleImageRows(asset, rules) {
  const target = asset.sourcePath || `assets/visuals/${asset.id}.png`;
  const mustShow = asset.semanticRequirements?.mustShow || [];
  const mustNotShow = asset.semanticRequirements?.mustNotShow || [];
  const labels = [...new Set((asset.explanationAnchors || [])
    .map((item) => String(item).trim())
    .filter(Boolean)
    .filter((item) => item.length <= 28))];
  const textRule = labels.length
    ? `Only these visible labels are allowed: ${labels.join("; ")}. No other title, speech bubble, paragraph, UI text, document text, file path, or extra label.`
    : "Do not include any readable text, title, speech bubble, paragraph, UI text, document text, file path, or label.";
  return [
    "Kind: `single-image`",
    `Target: \`${target}\``,
    "",
    "```text",
    "Use case: scientific-educational",
    "Asset type: Korean beginner workshop lecture image",
    `Asset id: ${asset.id}`,
    `Teaching role: ${asset.teachingRole}`,
    `Required visual meaning: ${asset.teachingRole}`,
    mustShow.length ? `Must show: ${mustShow.join("; ")}.` : null,
    `Visible text contract: ${textRule}`,
    `Design constraints: ${rules.join("; ")}.`,
    "Composition: create exactly one complete standalone illustration on a pure white background. Keep one clear teaching point, generous whitespace, and fully visible characters, labels, arrows, cards, documents, and blue accents.",
    "Character contract: keep Kimai visually consistent as a friendly AI new employee with round face, small headset or antenna, simple office posture, black linework, and one blue accent such as tie or name badge.",
    "Deterministic composition contract: create only the standalone drawing; the deck harness owns final frame, tilt, card shadow, object-fit, and placement.",
    `Avoid: ${[
      ...mustNotShow,
      "sprite sheet",
      "multi-panel grid",
      "visible panel number",
      "circled number",
      "row or column label",
      "crop mark",
      "panel border",
      "slide frame",
      "page chrome",
      "decorative background",
      "gradient",
      "glow",
      "blur",
      "glass",
      "3D",
      "photorealism",
      "watermark",
      "clipped Korean text",
      "clipped character",
    ].join("; ")}.`,
    "<assetRequirement>",
    `  <singleImage id="${asset.id}" generationMode="single-image-first" target="${target}">`,
    "    Generate one standalone illustration only.",
    "    Keep the full subject comfortably inside the image with generous white padding.",
    "    Do not draw frames, crop marks, panel borders, page chrome, or sheet/grid structure.",
    "  </singleImage>",
    "</assetRequirement>",
    "```",
    "",
  ].filter((line) => line !== null);
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  const deckDir = resolveDeckDir(options.deckDirInput);
  const assetPack = readJson(path.join(deckDir, "asset-pack.json"));
  const reviewWarnings = cropReviewWarnings(deckDir);
  const assets = assetPack.assets || [];
  const queued = [];
  assets.forEach((asset) => {
    if (options.onlySingleImageFirst) {
      if (asset.kind === "single-image" && asset.status === "planned" && asset.generationMode === "single-image-first") {
        queued.push({ asset, queueKind: "single-image" });
      }
      return;
    }
    if (!options.onlyReviewWarnings && ["single-image", "sprite-sheet"].includes(asset.kind) && asset.status === "planned") {
      queued.push({ asset, queueKind: asset.kind });
      return;
    }
    if (options.includeReviewWarnings && ["single-image", "sprite-sheet"].includes(asset.kind) && reviewWarnings.sourceIds.has(asset.id)) {
      queued.push({ asset, queueKind: asset.kind });
      return;
    }
    if (options.explodeWarningSheets && asset.kind === "crop-region" && reviewWarnings.assetIds.has(asset.id)) {
      queued.push({ asset, queueKind: "single-image-from-warning" });
    }
  });
  const promptable = queued.slice(0, options.limit);
  const rules = designRules();
  const promptItems = promptable.map(({ asset, queueKind }, index) => {
    const rows = options.cleanSingleImageFirst && asset.kind === "single-image" && asset.generationMode === "single-image-first"
      ? cleanSingleImageRows(asset, rules)
      : promptRowsForAsset(asset, rules, queueKind);
    return {
      index: index + 1,
      id: asset.id,
      kind: queueKind || asset.kind,
      target: asset.sourcePath || `assets/visuals/${asset.id}.png`,
      generationMode: asset.generationMode || (queueKind === "single-image-from-warning" ? "single-image-first" : undefined),
      deterministicComposition: asset.deterministicComposition,
      previousCropRegion: asset.previousCropRegion,
      promptText: rows.join("\n"),
    };
  });
  const output = [
    "# Asset Generation Prompts",
    "",
    "## Source",
    "",
    `Deck: \`${path.relative(root, deckDir)}\``,
    "Design source: `디자인.md`",
    "",
    "## Design Rules Applied",
    "",
    ...rules.map((rule) => `- ${rule}`),
    "",
    "## Prompt Queue",
    "",
    `Promptable planned assets: ${promptable.length}`,
    options.includeReviewWarnings
      ? `Crop-review warning source sheets included: ${reviewWarnings.sourceIds.size}`
      : "Crop-review warning source sheets included: 0",
    options.explodeWarningSheets
      ? `Crop-review warning crop assets exploded as single images: ${reviewWarnings.assetIds.size}`
      : "Crop-review warning crop assets exploded as single images: 0",
    options.onlyReviewWarnings
      ? "Queue mode: review warnings only"
      : options.onlySingleImageFirst
        ? "Queue mode: planned single-image-first assets only"
        : "Queue mode: planned assets plus requested review warnings",
    "",
    ...promptItems.flatMap((item) => [
      `### ${item.index}. ${item.id}`,
      "",
      item.promptText,
      "",
    ]),
  ].join("\n");
  const reportPath = path.join(deckDir, "asset-generation-prompts.md");
  const queuePath = path.join(deckDir, "asset-generation-queue.json");
  fs.writeFileSync(reportPath, `${output}\n`);
  fs.writeFileSync(queuePath, `${JSON.stringify({
    generatedAt: new Date().toISOString(),
    deck: path.relative(root, deckDir),
    designSource: "디자인.md",
    queueMode: options.onlyReviewWarnings
      ? "review-warnings-only"
      : options.cleanSingleImageFirst
        ? "clean-planned-single-image-first-only"
        : options.onlySingleImageFirst
        ? "planned-single-image-first-only"
        : "planned-assets-plus-requested-review-warnings",
    promptableCount: promptItems.length,
    items: promptItems,
  }, null, 2)}\n`);
  console.log(`Asset generation prompts: ${path.relative(root, reportPath)}`);
  console.log(`Asset generation queue: ${path.relative(root, queuePath)}`);
  console.log(`Promptable planned assets: ${promptable.length}`);
}

try {
  main();
} catch (error) {
  console.error(`FAIL ${error.message}`);
  process.exitCode = 1;
}
