#!/usr/bin/env node
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..", "..");

function usage() {
  console.error("Usage: node deck-harness/scripts/prepare-asset-generation-prompts.js <deck-dir> [--limit=N]");
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
  const options = { deckDirInput: null, limit: Infinity };
  argv.forEach((arg) => {
    if (arg.startsWith("--limit=")) {
      options.limit = Number(arg.slice("--limit=".length));
      if (!Number.isFinite(options.limit) || options.limit < 1) usage();
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

function main() {
  const options = parseArgs(process.argv.slice(2));
  const deckDir = resolveDeckDir(options.deckDirInput);
  const assetPack = readJson(path.join(deckDir, "asset-pack.json"));
  const promptable = (assetPack.assets || [])
    .filter((asset) => asset.status === "planned" && ["single-image", "sprite-sheet"].includes(asset.kind))
    .slice(0, options.limit);
  const rules = designRules();
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
    "",
    ...promptable.flatMap((asset, index) => [
      `### ${index + 1}. ${asset.id}`,
      "",
      `Kind: \`${asset.kind}\``,
      `Target: \`${asset.sourcePath || `assets/visuals/${asset.id}.png`}\``,
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
      "Avoid: decorative backgrounds, dense text, tiny labels, generic office icon clusters, gradients, shadows used as decoration, glass effects, glow, 3D, photorealism, visible cell numbers, circled numbers, grid labels, crop marks, or sprite-sheet borders.",
      ...(asset.xmlPrompt ? [
        asset.xmlPrompt.instruction,
        asset.xmlPrompt.assetRequirement,
        asset.xmlPrompt.negativePrompt,
        asset.xmlPrompt.reviewChecklist,
      ] : panelCoordinateLines(asset)),
      "```",
      "",
    ]),
  ].join("\n");
  const reportPath = path.join(deckDir, "asset-generation-prompts.md");
  fs.writeFileSync(reportPath, `${output}\n`);
  console.log(`Asset generation prompts: ${path.relative(root, reportPath)}`);
  console.log(`Promptable planned assets: ${promptable.length}`);
}

try {
  main();
} catch (error) {
  console.error(`FAIL ${error.message}`);
  process.exitCode = 1;
}
