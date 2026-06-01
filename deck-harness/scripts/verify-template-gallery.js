#!/usr/bin/env node
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..", "..");

const requiredTemplates = [
  "opening-hero",
  "single-concept",
  "assertion-scene",
  "kimai-structure",
  "term-bridge",
  "three-step-flow",
  "decision-gate",
  "brief-window",
  "practice-handoff",
  "recap-map",
];

function usage() {
  console.error("Usage: node deck-harness/scripts/verify-template-gallery.js <deck-dir>");
  process.exit(2);
}

function resolveDeckDir(input) {
  if (!input) usage();
  return path.isAbsolute(input) ? input : path.join(root, input);
}

function readText(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`missing file: ${path.relative(root, filePath)}`);
  }
  return fs.readFileSync(filePath, "utf8");
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function unique(values) {
  return [...new Set(values)];
}

function main() {
  const deckDir = resolveDeckDir(process.argv[2]);
  const html = readText(path.join(deckDir, "template-gallery.html"));
  const js = readText(path.join(deckDir, "assets", "template-gallery.js"));
  const css = readText(path.join(deckDir, "assets", "style.css"));
  const registry = JSON.parse(readText(path.join(deckDir, "assets", "template-component-registry.json")));
  const registryTemplates = Array.isArray(registry.templates) ? registry.templates : [];

  assert(html.includes("후보 템플릿"), "gallery header must describe candidate templates, not applied deck output");
  assert(!js.includes("<iframe"), "gallery must render candidate prototypes instead of embedded existing slides");
  assert(!js.includes("slides.filter"), "gallery must not depend on current slide distribution for candidate examples");
  assert(js.includes("template-component-registry.json"), "template gallery must load the shared template component registry");
  assert(registryTemplates.length === requiredTemplates.length, "shared template component registry must define every candidate template");

  const ids = unique(registryTemplates.map((template) => template.id));
  for (const templateId of requiredTemplates) {
    assert(ids.includes(templateId), `missing candidate template: ${templateId}`);
  }
  assert(ids.length === requiredTemplates.length, `expected ${requiredTemplates.length} candidate templates, found ${ids.length}`);
  assert(js.includes("candidate-slide--${escapeHtml(template.id)}"), "gallery must stamp template-specific preview classes");
  assert(js.includes("visualComponent:"), "gallery must bind each template to a named visual component");
  assert(js.includes("sourceComponent:"), "gallery must bind each template to a lecture-cuts source component");
  assert(js.includes("sourceDom:"), "gallery must expose source DOM lineage for visual review");
  assert(js.includes("motionCue:"), "gallery must bind each template to a named motion cue");
  assert(js.includes("IntersectionObserver"), "gallery must replay motion when template examples enter the viewport");
  assert(js.includes("pointerenter"), "gallery must allow motion replay during visual review");
  assert(js.includes('cards.forEach((card) => card.classList.add("is-visible"));'), "gallery examples must be visible by default for full-page visual review");
  assert(!js.includes("doodle:"), "gallery must not use the old CSS doodle contract");
  assert(!js.includes("function doodle"), "gallery must not render ad hoc sketch placeholders");
  assert(!/class="sketch\b/.test(js), "gallery must not render sketch placeholders");

  const visualComponents = unique(registryTemplates.map((template) => template.visualComponent));
  const sourceComponents = unique(registryTemplates.map((template) => template.sourceComponent));
  const sourceDoms = unique(registryTemplates.map((template) => template.sourceDom));
  const motionCues = unique(registryTemplates.map((template) => template.motionCue));
  const requiredVisualComponents = ["workbench", "harness", "evidence", "kimai-structure", "bridge", "flow", "gate", "brief", "handoff", "loop"];
  const requiredSourceComponents = [
    "workbench-visual",
    "harness-visual",
    "practice-gate-visual",
    "kimai-image-structure",
    "brief-window-visual",
    "handoff-bridge-visual",
    "guardrail-flow-visual",
    "handoff-checklist-visual",
    "loop-visual",
  ];
  const requiredMotionCues = ["reveal-anchor", "connect-context", "evidence-check", "image-frame", "term-bridge", "step-flow", "gate-check", "brief-scan", "handoff-list", "loop-map"];
  for (const componentId of requiredVisualComponents) {
    assert(visualComponents.includes(componentId), `missing visual component binding: ${componentId}`);
    assert(js.includes(`data-visual-component="${componentId}"`), `visual component must leave traceable DOM metadata: ${componentId}`);
  }
  for (const sourceId of requiredSourceComponents) {
    assert(sourceComponents.includes(sourceId), `missing lecture-cuts source component binding: ${sourceId}`);
  }
  assert(sourceDoms.some((sourceDom) => sourceDom.includes("00-1-workbench-preview.html")), "workbench source DOM lineage must point to lecture-cuts workbench source");
  assert(sourceDoms.some((sourceDom) => sourceDom.includes("01-why-harness.html")), "harness source DOM lineage must point to lecture-cuts harness source");
  assert(sourceDoms.some((sourceDom) => sourceDom.includes("21-final-workflow.html")), "flow source DOM lineage must point to lecture-cuts workflow source");
  assert(js.includes('data-source-component="${sourceAttr}"'), "source component metadata must be stamped through escaped sourceAttr");
  for (const cueId of requiredMotionCues) {
    assert(motionCues.includes(cueId), `missing motion cue binding: ${cueId}`);
  }
  assert(js.includes('data-motion-cue="${escapeHtml(motionCue)}"'), "motion cue must leave traceable DOM metadata");

  const requiredCss = [
    ".candidate-card",
    ".candidate-preview",
    ".candidate-slide",
    ".lc-visual",
    ".lc-workbench-visual",
    ".lc-harness-visual",
    ".lc-claim-evidence-visual",
    ".lc-kimai-structure-visual",
    ".lc-kimai-image-frame",
    ".lc-practice-gate-visual",
    ".lc-decision-gate-visual",
    ".lc-gate-board",
    ".lc-gate-card",
    ".lc-gate-verdict",
    ".lc-brief-window-visual",
    ".lc-brief-window",
    ".lc-handoff-bridge-visual",
    ".lc-guardrail-flow-visual",
    ".lc-handoff-checklist-visual",
    ".lc-loop-visual",
    "@keyframes layer-pop",
    "@keyframes line-grow",
    "@keyframes connector-pulse",
    "@keyframes soft-pulse",
    "@keyframes gate-check",
    "@keyframes orbit-upright",
    "@keyframes orbit-dot",
    "@media (prefers-reduced-motion: reduce)",
    ".candidate-card.is-visible",
    "[data-motion-cue=\"step-flow\"]",
    "[data-motion-cue=\"gate-check\"]",
  ];
  for (const selector of requiredCss) {
    assert(css.includes(selector), `missing CSS selector: ${selector}`);
  }
  const requiredTemplateLayoutSelectors = requiredTemplates.map((templateId) => `.candidate-slide--${templateId}`);
  for (const selector of requiredTemplateLayoutSelectors) {
    assert(css.includes(selector), `missing template-specific layout selector: ${selector}`);
  }
  assert(css.includes(".candidate-slide--practice-handoff {\n  grid-template-columns: minmax(0, 1fr);"), "practice handoff must keep a dedicated non-image full-width lecture handoff layout");
  assert(css.includes(".candidate-slide--opening-hero h3"), "opening hero must have a dedicated title scale rule");
  assert(css.includes(".candidate-slide--term-bridge .lc-visual"), "term bridge must have a dedicated bridge visual sizing rule");
  assert(css.includes(".candidate-slide--brief-window"), "brief-window must have a dedicated layout selector");
  assert(css.includes("width: min(100%, 520px);"), "base lecture-cuts subset visual width must be stage-scale, not tiny gallery doodle scale");
  assert(css.includes("min-height: 372px;"), "base lecture-cuts subset visual height must be stage-scale");
  assert(css.includes("grid-template-columns: minmax(0, 0.86fr) minmax(440px, 1fr);"), "candidate slide must reserve real stage width for visual components");
  for (const className of ["memory", "skill", "agent", "tool", "hook", "eval"]) {
    assert(js.includes(`lc-workbench-card ${className}`), `workbench parity subset must include ${className} card`);
  }
  assert(js.includes("<i class=\"lc-flow-line\"></i>"), "flow parity subset must include a dedicated full-row flow line");
  assert(css.includes(".lc-flow-line"), "flow parity subset must style a dedicated full-row flow line");
  assert(js.includes("<i class=\"lc-loop-path\"></i>"), "loop map must include a moving circular path separate from labels");
  assert(js.includes("<i class=\"lc-loop-runner\"></i>"), "loop map must include a moving runner separate from labels");
  assert(css.includes(".lc-loop-path") && css.includes("animation: slow-spin 18s linear infinite;"), "loop path must animate automatically while labels remain upright");
  assert(css.includes(".lc-loop-runner") && css.includes("animation: orbit-dot 5.2s linear infinite;"), "loop runner must orbit automatically");
  assert(!css.includes('[data-motion-cue="loop-map"] .lc-loop-ring {\n  animation: slow-spin'), "loop labels must remain stable instead of spinning the whole label ring");
  assert(!css.includes('[data-motion-cue="loop-map"] .lc-loop-ring {\n  animation: connector-pulse'), "loop map must not use the rejected fading/pulse-only motion");
  for (const briefLabel of ["목표", "증상", "범위", "제한", "검증", "보고"]) {
    assert(js.includes(`[\"${briefLabel}\"`), `brief-window must include ${briefLabel} row`);
  }
  for (const gateToken of ["lc-gate-board", "lc-gate-card goal", "lc-gate-card evidence", "lc-gate-card retry", "lc-gate-verdict"]) {
    assert(js.includes(gateToken), `decision gate must include ${gateToken}`);
  }
  assert(css.includes("--card-radius"), "hand-drawn cards must vary their border radii");
  assert(css.includes("--tilt: -3deg") && css.includes("--tilt: 2.4deg"), "hand-drawn cards must vary tilt beyond a repeated one-degree rotation");
  assert(css.includes("#e8efff"), "hand-drawn cards should use the simple pale-blue offset shadow from the reference images");
  const softPulseStart = css.indexOf("@keyframes soft-pulse");
  const nextKeyframeStart = css.indexOf("@keyframes", softPulseStart + 1);
  const softPulseBody = softPulseStart >= 0
    ? css.slice(softPulseStart, nextKeyframeStart > softPulseStart ? nextKeyframeStart : undefined)
    : "";
  assert(softPulseBody.includes("box-shadow"), "soft-pulse must preserve lecture-cuts shadow-pulse grammar");
  assert(!softPulseBody.includes("scale("), "soft-pulse must not use cheap transform scaling");
  assert(!/\.sketch\b/.test(css), "gallery CSS must not keep the rejected sketch placeholder classes");
  assert(!/\.lc-(workbench|harness|evidence|bridge|flow|gate|handoff|loop)(?!-)[\s,{]/.test(css), "gallery CSS must use lecture-cuts-style visual suffix component classes");
  assert(!/\.candidate-(doodle|process|checks|practice|translation)\b/.test(css), "gallery CSS must not keep stale pre-subset prototype classes");
  assert(css.includes("background: #fff"), "gallery must keep white background");
  assert(css.includes("var(--blue)"), "gallery must use the project accent token");
  assert(css.includes("--display:"), "gallery must define the hand-drawn display font token from 디자인.md");
  assert(css.includes("--font-display:"), "gallery must define the 디자인.md display font token");
  assert(css.includes("--font-body:"), "gallery must define the 디자인.md body font token");
  assert(css.includes("--font-code:"), "gallery must define the 디자인.md code font token");
  assert(css.includes("--font-label:"), "gallery must define the 디자인.md label font token");
  assert(css.includes("body {\n  margin: 0;\n  background: var(--paper);\n  color: var(--ink);\n  font-family: var(--body);"), "body text must use the body font token");
  assert(css.includes("h2 {\n  margin: 0;\n  font-family: var(--display);"), "slide headlines must use the display font token");
  assert(css.includes(".candidate-slide h3 {\n  font-family: var(--display);"), "template candidate headlines must use the display font token");
  assert(css.includes(".candidate-slide > p:not(.candidate-eyebrow) {\n  font-family: var(--body);"), "template candidate message text must use the body font token");
  assert(css.includes(".lc-brief-window p {\n  margin: 0;\n  font-family: var(--code);"), "brief-window document rows must use the code font token");
  assert(!css.includes("Gmarket Sans"), "gallery CSS must not mix in a separate headline font outside 디자인.md tokens");
  assert(!/gradient|glow|blur|glass/i.test(css), "gallery CSS must not introduce gradient/glow/blur/glass effects");

  const generatedSlidesDir = path.join(deckDir, "slides");
  if (fs.existsSync(generatedSlidesDir)) {
    const generatedHtml = fs
      .readdirSync(generatedSlidesDir)
      .filter((fileName) => fileName.endsWith(".html"))
      .map((fileName) => readText(path.join(generatedSlidesDir, fileName)))
      .join("\n");
    assert(!generatedHtml.includes("candidate-slide"), "candidate template gallery classes must not be applied to generated slide HTML");
    assert(!generatedHtml.includes("template-gallery"), "template gallery review surface must not leak into generated slide HTML");
    for (const templateId of ["opening-hero", "kimai-structure", "term-bridge", "workflow-strip", "decision-gate", "brief-window", "practice-handoff", "recap-map"]) {
      assert(generatedHtml.includes(`data-template-component="${templateId}"`), `generated deck must apply approved gallery component structure: ${templateId}`);
    }
    for (const componentClass of ["lc-workbench-visual", "lc-kimai-structure-visual", "lc-handoff-bridge-visual", "lc-guardrail-flow-visual", "lc-decision-gate-visual", "lc-brief-window-visual", "lc-handoff-checklist-visual", "lc-loop-visual"]) {
      assert(generatedHtml.includes(componentClass), `generated deck must include approved gallery visual component: ${componentClass}`);
    }
    assert(generatedHtml.includes('data-source-component="workbench-visual"'), "generated deck must preserve template source-component metadata");
    assert(generatedHtml.includes('data-motion-cue="step-flow"'), "generated deck must preserve motion-cue metadata");
    assert(generatedHtml.includes("lc-guardrail-flow-visual"), "generated deck must render approved component DOM, not generic bullet slots only");
  }
  const slideRegistryPath = path.join(deckDir, "assets", "slides.js");
  if (fs.existsSync(slideRegistryPath)) {
    const slideRegistry = readText(slideRegistryPath);
    assert(!slideRegistry.includes("candidate-slide"), "candidate template gallery classes must not be applied to the slide registry");
    assert(!slideRegistry.includes("template-gallery"), "template gallery review surface must not leak into the slide registry");
    assert(slideRegistry.includes('"mainTemplate": "workflow-strip"'), "slide registry must keep applied mainTemplate metadata");
    assert(slideRegistry.includes('"templateSelectionReason"'), "slide registry must explain semantic template selection");
    assert(slideRegistry.includes('"templateRewrite"'), "slide registry must expose template rewrite rationale and component data");
    assert(slideRegistry.includes('"rewrittenScreen"'), "slide registry must expose rewritten template-specific screen content");
  }

  console.log(`PASS template gallery candidates - ${ids.join(", ")} / source components - ${sourceComponents.join(", ")}`);
}

try {
  main();
} catch (error) {
  console.error(`FAIL ${error.message}`);
  process.exitCode = 1;
}
