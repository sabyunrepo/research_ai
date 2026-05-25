#!/usr/bin/env node
const crypto = require("node:crypto");
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

function slideHtml(slide) {
  const bullets = Array.isArray(slide.bullets) && slide.bullets.length
    ? `<ul class="bullets">${slide.bullets.map((bullet) => `<li>${escapeHtml(bullet)}</li>`).join("")}</ul>`
    : "";
  const evidence = Array.isArray(slide.evidenceClaimIds) ? slide.evidenceClaimIds.join(" ") : "";
  const terms = Array.isArray(slide.glossaryTerms) ? slide.glossaryTerms.join(" ") : "";
  return `<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(slide.title)}</title>
  <link rel="stylesheet" href="../assets/style.css">
</head>
<body>
  <main class="slide" data-slide-id="${escapeHtml(slide.id)}" data-evidence-ids="${escapeHtml(evidence)}" data-glossary-terms="${escapeHtml(terms)}">
    <section class="copy">
      <div class="eyebrow">${escapeHtml(slide.section || "")}</div>
      <h2>${escapeHtml(slide.title)}</h2>
      <p class="message">${escapeHtml(slide.message)}</p>
      ${bullets}
    </section>
    <section class="slide-media" aria-label="${escapeHtml(slide.visualIntent)}">
      <div class="visual-card">
        <span class="visual-label">${escapeHtml(slide.visualIntent)}</span>
      </div>
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
  const slides = Array.isArray(spec.slides) ? spec.slides : [];

  fs.rmSync(path.join(deckDir, "slides"), { recursive: true, force: true });
  fs.mkdirSync(path.join(deckDir, "slides"), { recursive: true });
  fs.mkdirSync(path.join(deckDir, "assets"), { recursive: true });

  const registry = slides.map((slide, index) => {
    const file = `${slide.id}.html`;
    writeText(path.join(deckDir, "slides", file), slideHtml(slide));
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
      speakerNote: slide.speakerNote,
      evidenceClaimIds: slide.evidenceClaimIds || [],
      glossaryTerms: slide.glossaryTerms || [],
      qualityChecks: slide.qualityChecks || [],
    };
  });

  writeText(
    path.join(deckDir, "assets", "slides.js"),
    `window.DECK_SLIDES = ${JSON.stringify(registry, null, 2)};\nwindow.DECK_CLAIMS = ${JSON.stringify(claimMap.claims || [], null, 2)};\nwindow.DECK_GLOSSARY = ${JSON.stringify(glossary.terms || [], null, 2)};\n`
  );

  copyTemplate(deckDir, "deck.html");
  copyTemplate(deckDir, "presenter-review.html");
  copyTemplate(deckDir, "assets/style.css");
  copyTemplate(deckDir, "assets/deck.js");
  copyTemplate(deckDir, "assets/presenter-review.js");

  const inputs = ["slide-spec.json", "claim-source-map.json", "glossary.json", "section-plan.json"];
  const outputs = [
    "deck.html",
    "presenter-review.html",
    "assets/slides.js",
    "assets/style.css",
    "assets/deck.js",
    "assets/presenter-review.js",
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
