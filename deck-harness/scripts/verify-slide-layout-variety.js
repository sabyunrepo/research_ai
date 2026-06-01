#!/usr/bin/env node
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = path.resolve(__dirname, "..", "..");

function usage() {
  console.error("Usage: node deck-harness/scripts/verify-slide-layout-variety.js <deck-dir>");
  process.exit(1);
}

function resolveDeckDir(input) {
  if (!input) usage();
  return path.isAbsolute(input) ? input : path.join(root, input);
}

function loadRegistry(deckDir) {
  const context = { window: {} };
  vm.createContext(context);
  vm.runInContext(fs.readFileSync(path.join(deckDir, "assets", "slides.js"), "utf8"), context);
  return context.window.DECK_SLIDES || [];
}

function main() {
  const deckDir = resolveDeckDir(process.argv[2]);
  const slides = loadRegistry(deckDir);
  if (!slides.length) throw new Error("no slides found in assets/slides.js");

  const counts = new Map();
  const templateCounts = new Map();
  const mainTemplateCounts = new Map();
  const teachingCounts = new Map();
  const actionCounts = new Map();
  const visualModeCounts = new Map();
  let longestRun = 0;
  let longestTemplateRun = 0;
  let longestMainTemplateRun = 0;
  let currentRun = 0;
  let currentTemplateRun = 0;
  let currentMainTemplateRun = 0;
  let previous = "";
  let previousTemplate = "";
  let previousMainTemplate = "";
  const missingSemantic = [];
  const missingMainTemplate = [];
  const missingReason = [];
  const handoffWithVisual = [];
  const firstGlossaryMisses = [];
  const seenGlossaryTerms = new Set();
  slides.forEach((slide) => {
    const variant = slide.layoutVariant || "standard";
    const template = slide.layoutTemplate || "";
    const mainTemplate = slide.mainTemplate || "";
    counts.set(variant, (counts.get(variant) || 0) + 1);
    if (template) templateCounts.set(template, (templateCounts.get(template) || 0) + 1);
    if (mainTemplate) mainTemplateCounts.set(mainTemplate, (mainTemplateCounts.get(mainTemplate) || 0) + 1);
    if (slide.teachingMove) teachingCounts.set(slide.teachingMove, (teachingCounts.get(slide.teachingMove) || 0) + 1);
    if (slide.audienceAction) actionCounts.set(slide.audienceAction, (actionCounts.get(slide.audienceAction) || 0) + 1);
    if (slide.visualMode) visualModeCounts.set(slide.visualMode, (visualModeCounts.get(slide.visualMode) || 0) + 1);
    ["layoutTemplate", "teachingMove", "audienceAction", "visualMode"].forEach((field) => {
      if (!slide[field]) missingSemantic.push(`${slide.id}.${field}`);
    });
    if (!mainTemplate) missingMainTemplate.push(slide.id);
    if (!slide.templateSelectionReason) missingReason.push(slide.id);
    if (
      template === "practice-handoff" &&
      slide.visualMode !== "no-image-handoff" &&
      !(slide.visualMode === "practice-transition" && slide.visualRenderContract?.renderKind === "css-template-component")
    ) {
      handoffWithVisual.push(slide.id);
    }
    const firstTerms = (slide.glossaryTerms || []).filter((term) => !seenGlossaryTerms.has(term));
    if (firstTerms.length && template !== "glossary-bridge" && template !== "practice-handoff") {
      firstGlossaryMisses.push(`${slide.id}: ${firstTerms.join(", ")}`);
    }
    (slide.glossaryTerms || []).forEach((term) => seenGlossaryTerms.add(term));
    currentRun = variant === previous ? currentRun + 1 : 1;
    previous = variant;
    longestRun = Math.max(longestRun, currentRun);
    currentTemplateRun = template && template === previousTemplate ? currentTemplateRun + 1 : 1;
    previousTemplate = template;
    longestTemplateRun = Math.max(longestTemplateRun, currentTemplateRun);
    currentMainTemplateRun = mainTemplate && mainTemplate === previousMainTemplate ? currentMainTemplateRun + 1 : 1;
    previousMainTemplate = mainTemplate;
    longestMainTemplateRun = Math.max(longestMainTemplateRun, currentMainTemplateRun);
  });

  const variants = [...counts.keys()];
  const largest = Math.max(...counts.values());
  const largestRatio = largest / slides.length;
  if (variants.length < 5) throw new Error(`expected at least 5 layout variants, found ${variants.length}`);
  if (largestRatio > 0.35) throw new Error(`largest layout cluster too high: ${largest}/${slides.length}`);
  if (longestRun > 3) throw new Error(`same layout repeats ${longestRun} slides in a row`);
  if (missingSemantic.length) throw new Error(`semantic template metadata missing: ${missingSemantic.slice(0, 10).join("; ")}${missingSemantic.length > 10 ? `; ${missingSemantic.length - 10} more` : ""}`);
  if (missingMainTemplate.length) throw new Error(`main template metadata missing: ${missingMainTemplate.slice(0, 10).join("; ")}`);
  if (missingReason.length) throw new Error(`template selection reasons missing: ${missingReason.slice(0, 10).join("; ")}`);
  if (handoffWithVisual.length) throw new Error(`practice handoff slides must not force images: ${handoffWithVisual.join("; ")}`);
  if (firstGlossaryMisses.length) throw new Error(`first glossary use must use glossary-bridge template: ${firstGlossaryMisses.slice(0, 10).join("; ")}`);

  const templates = [...templateCounts.keys()];
  const largestTemplate = Math.max(...templateCounts.values());
  const largestTemplateRatio = largestTemplate / slides.length;
  if (templates.length < 6) throw new Error(`expected at least 6 semantic layout templates, found ${templates.length}`);
  if (largestTemplateRatio > 0.45) throw new Error(`largest semantic template cluster too high: ${largestTemplate}/${slides.length}`);
  if (longestTemplateRun > 4) throw new Error(`same semantic template repeats ${longestTemplateRun} slides in a row`);
  const mainTemplates = [...mainTemplateCounts.keys()];
  const largestMainTemplate = Math.max(...mainTemplateCounts.values());
  const largestMainTemplateRatio = largestMainTemplate / slides.length;
  if (mainTemplates.length < 6) throw new Error(`expected at least 6 rendered main templates, found ${mainTemplates.length}`);
  if (largestMainTemplateRatio > 0.45) throw new Error(`largest rendered main template cluster too high: ${largestMainTemplate}/${slides.length}`);
  if (longestMainTemplateRun > 5) throw new Error(`same rendered main template repeats ${longestMainTemplateRun} slides in a row`);
  if (teachingCounts.size < 5) throw new Error(`expected at least 5 teaching moves, found ${teachingCounts.size}`);
  if (actionCounts.size < 5) throw new Error(`expected at least 5 audience actions, found ${actionCounts.size}`);
  if (visualModeCounts.size < 5) throw new Error(`expected at least 5 visual modes, found ${visualModeCounts.size}`);

  console.log(`PASS slide layout variety - ${variants.length} variants, largest ${largest}/${slides.length}, longest run ${longestRun}`);
  console.log(`PASS semantic template variety - ${templates.length} templates, largest ${largestTemplate}/${slides.length}, longest run ${longestTemplateRun}`);
  console.log(`PASS rendered template variety - ${mainTemplates.length} templates, largest ${largestMainTemplate}/${slides.length}, longest run ${longestMainTemplateRun}`);
  console.log(`PASS teaching metadata variety - ${teachingCounts.size} teaching moves, ${actionCounts.size} audience actions, ${visualModeCounts.size} visual modes`);
}

try {
  main();
} catch (error) {
  console.error(`FAIL ${error.message}`);
  process.exitCode = 1;
}
