#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const root = path.resolve(__dirname, "..", "..");

const templateProjection = {
  "opening-hero": {
    layoutTemplate: "act-opener",
    teachingMove: "activate",
    audienceAction: "orient",
    visualMode: "story-illustration",
  },
  "kimai-structure": {
    layoutTemplate: "story-scene",
    teachingMove: "explain",
    audienceAction: "inspect-visual",
    visualMode: "story-illustration",
  },
  "assertion-scene": {
    layoutTemplate: "assertion-evidence",
    teachingMove: "explain",
    audienceAction: "inspect-visual",
    visualMode: "story-illustration",
  },
  "term-bridge": {
    layoutTemplate: "glossary-bridge",
    teachingMove: "connect",
    audienceAction: "connect-metaphor",
    visualMode: "term-bridge",
  },
  "workflow-strip": {
    layoutTemplate: "concept-map",
    teachingMove: "demonstrate",
    audienceAction: "compare",
    visualMode: "process-diagram",
  },
  "decision-gate": {
    layoutTemplate: "checklist",
    teachingMove: "demonstrate",
    audienceAction: "rehearse-checklist",
    visualMode: "checklist-board",
  },
  "brief-window": {
    layoutTemplate: "checklist",
    teachingMove: "explain",
    audienceAction: "rehearse-checklist",
    visualMode: "checklist-board",
  },
  "practice-handoff": {
    layoutTemplate: "practice-handoff",
    teachingMove: "practice-bridge",
    audienceAction: "transfer-to-practice",
    visualMode: "no-image-handoff",
  },
  "recap-map": {
    layoutTemplate: "wrap-up",
    teachingMove: "synthesize",
    audienceAction: "reflect",
    visualMode: "artifact-map",
  },
  "single-concept": {
    layoutTemplate: "story-scene",
    teachingMove: "explain",
    audienceAction: "inspect-visual",
    visualMode: "metaphor-link",
  },
};

function usage() {
  console.error(
    [
      "Usage: node deck-harness/scripts/apply-template-rewrite-plan.js <deck-dir> <plan-path> [--dry-run] [--work-dir <dir>] [--report <path>]",
      "",
      "Default mode is dry-run. It copies the deck into .codex/tmp and rewrites only the copied slide-spec.json.",
      "Use --write only when intentionally rewriting the source deck.",
    ].join("\n")
  );
}

function parseArgs(argv) {
  const positional = [];
  const options = { dryRun: true, write: false, workDir: "", report: "" };
  for (let i = 2; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--dry-run") options.dryRun = true;
    else if (arg === "--write") {
      options.write = true;
      options.dryRun = false;
    } else if (arg === "--work-dir") {
      options.workDir = argv[(i += 1)] || "";
    } else if (arg === "--report") {
      options.report = argv[(i += 1)] || "";
    } else if (arg.startsWith("--")) {
      throw new Error(`unknown option: ${arg}`);
    } else {
      positional.push(arg);
    }
  }
  if (positional.length !== 2) {
    usage();
    process.exit(2);
  }
  return { deckDir: path.resolve(root, positional[0]), planPath: path.resolve(root, positional[1]), options };
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function writeJson(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);
}

function makeWorkDir(deckDir, options) {
  if (options.write) return deckDir;
  const tmpRoot = path.join(root, ".codex", "tmp");
  fs.mkdirSync(tmpRoot, { recursive: true });
  if (options.workDir) {
    const target = path.resolve(root, options.workDir);
    if (fs.existsSync(target)) throw new Error(`work dir already exists: ${target}`);
    fs.cpSync(deckDir, target, { recursive: true });
    return target;
  }
  const target = fs.mkdtempSync(path.join(tmpRoot, "kimai-template-rewrite-"));
  const copiedDeck = path.join(target, path.basename(deckDir));
  fs.cpSync(deckDir, copiedDeck, { recursive: true });
  return copiedDeck;
}

function arrayFromRows(rows) {
  return rows.map((row) => `${row.label}: ${row.text}`);
}

function bulletsForTemplate(template, screen) {
  if (template === "opening-hero") return screen.promiseBullets || [];
  if (template === "kimai-structure") return screen.imageAnchors || [];
  if (template === "assertion-scene") return screen.evidenceAnchors || [];
  if (template === "term-bridge") return [screen.metaphorTerm, screen.realTerm, screen.bridgeLine].filter(Boolean);
  if (template === "workflow-strip") return (screen.steps || []).map((step) => step.label);
  if (template === "decision-gate") return (screen.criteria || []).map((criterion) => criterion.text);
  if (template === "brief-window") return arrayFromRows(screen.rows || []);
  if (template === "practice-handoff") return screen.actionList || [];
  if (template === "recap-map") return screen.mapNodes || [];
  if (template === "single-concept") return screen.supportingAnchors || [];
  return [];
}

function applyPlanToSlide(slide, planned) {
  const template = planned.proposed.mainTemplate;
  const projection = templateProjection[template];
  if (!projection) throw new Error(`${slide.id} has unsupported template: ${template}`);
  const screen = planned.proposed.screenStructure || {};
  const next = {
    ...slide,
    title: screen.headline || screen.heroLine || slide.title,
    message: screen.message || slide.message,
    bullets: bulletsForTemplate(template, screen),
    layoutTemplate: projection.layoutTemplate,
    teachingMove: projection.teachingMove,
    audienceAction: projection.audienceAction,
    visualMode: projection.visualMode,
    mainTemplate: template,
    rewrittenScreen: screen,
    templateRewrite: {
      sourceContractVersion: 1,
      originalSource: {
        title: planned.original.title,
        message: planned.original.message,
        bullets: planned.original.bullets || [],
        bridge: planned.original.bridge || "",
        visualIntent: planned.original.visualIntent || "",
        glossaryTerms: planned.original.glossaryTerms || [],
      },
      selectedTemplate: template,
      screenStructure: screen,
      componentData: componentDataForTemplate(template, screen, slide),
      presenterCues: presenterCuesForTemplate(template, screen, planned),
      visualRequirements: planned.proposed.imagePlan || null,
      rationale: planned.proposed.selectionBasis || planned.proposed.templateRationale || "",
      changes: planned.proposed.changes || [],
    },
  };
  if (screen.bridge || slide.bridge) {
    next.bridge = screen.bridge || slide.bridge;
  }
  return next;
}

function componentDataForTemplate(template, screen, slide) {
  if (template === "opening-hero") return { core: "김", cards: ["내규", "자료", "매뉴얼", "도구", "검문소", "증거"] };
  if (template === "kimai-structure") return { imageAnchors: screen.imageAnchors || [], visualAssetId: slide.visualAssetId || "" };
  if (template === "assertion-scene") return { sheetTitle: screen.claimLabel || "요청서", evidenceAnchors: screen.evidenceAnchors || [] };
  if (template === "term-bridge") return { metaphorTerm: screen.metaphorTerm || "", realTerm: screen.realTerm || "", bridgeLine: screen.bridgeLine || "" };
  if (template === "workflow-strip") return { steps: screen.steps || [] };
  if (template === "decision-gate") return { criteria: screen.criteria || [], passLabel: screen.passLabel || "PASS", holdLabel: screen.holdLabel || "HOLD" };
  if (template === "brief-window") return { rows: screen.rows || [] };
  if (template === "practice-handoff") return { actionList: screen.actionList || [] };
  if (template === "recap-map") return { mapNodes: screen.mapNodes || [] };
  if (template === "single-concept") return { keySentence: screen.keySentence || screen.headline || "", supportingAnchors: screen.supportingAnchors || [] };
  return {};
}

function presenterCuesForTemplate(template, screen, planned) {
  const cues = [];
  if (screen.headline) cues.push(`한 문장 결론: ${screen.headline}`);
  if (template === "workflow-strip" && screen.steps) cues.push(`순서대로 짚기: ${screen.steps.map((step) => step.label).join(" -> ")}`);
  if (template === "decision-gate" && screen.criteria) cues.push(`판정 기준: ${screen.criteria.map((criterion) => criterion.text).join(", ")}`);
  if (template === "brief-window" && screen.rows) cues.push(`업무 지시서 행: ${screen.rows.map((row) => row.label).join(", ")}`);
  if (template === "term-bridge") cues.push(`회사말을 먼저 말하고 실제 용어 ${screen.realTerm || (planned.original.glossaryTerms || [])[0] || ""}로 연결`);
  if (template === "practice-handoff") cues.push("강의 설명을 멈추고 별도 실습 화면으로 전환");
  if (screen.bridge) cues.push(`다음 연결: ${screen.bridge}`);
  return cues;
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

function refreshManifestInputHashes(workDeckDir) {
  const manifestPath = path.join(workDeckDir, "job-manifest.json");
  if (!fs.existsSync(manifestPath)) return [];
  const manifest = readJson(manifestPath);
  const refreshed = [];
  for (const stage of manifest.stages || []) {
    if (!Array.isArray(stage.inputs) || !stage.inputs.includes("slide-spec.json")) continue;
    stage.inputHash = hashFiles(workDeckDir, stage.inputs);
    refreshed.push(stage.name);
  }
  writeJson(manifestPath, manifest);
  return refreshed;
}

function main() {
  const { deckDir, planPath, options } = parseArgs(process.argv);
  const workDeckDir = makeWorkDir(deckDir, options);
  const specPath = path.join(workDeckDir, "slide-spec.json");
  const spec = readJson(specPath);
  const plan = readJson(planPath);
  const planById = new Map(plan.slides.map((slide) => [slide.id, slide]));
  const missingPlan = [];
  const applied = [];
  const unchangedTemplate = [];
  const nextSlides = spec.slides.map((slide) => {
    const planned = planById.get(slide.id);
    if (!planned) {
      missingPlan.push(slide.id);
      return slide;
    }
    const next = applyPlanToSlide(slide, planned);
    applied.push({
      id: slide.id,
      fromMainTemplate: planned.original.currentMainTemplate || null,
      toMainTemplate: next.mainTemplate,
      fromTitle: slide.title,
      toTitle: next.title,
      bulletCount: next.bullets.length,
    });
    if ((planned.original.currentMainTemplate || null) === next.mainTemplate) unchangedTemplate.push(slide.id);
    return next;
  });
  spec.slides = nextSlides;
  writeJson(specPath, spec);
  const refreshedManifestStages = refreshManifestInputHashes(workDeckDir);

  const report = {
    status: missingPlan.length ? "WARN" : "PASS",
    mode: options.write ? "write" : "dry-run",
    sourceDeckDir: path.relative(root, deckDir),
    workDeckDir: path.relative(root, workDeckDir),
    planPath: path.relative(root, planPath),
    slideCount: spec.slides.length,
    appliedCount: applied.length,
    missingPlan,
    unchangedTemplateCount: unchangedTemplate.length,
    changedTemplateCount: applied.length - unchangedTemplate.length,
    refreshedManifestStages,
    templateDistribution: nextSlides.reduce((counts, slide) => {
      counts[slide.mainTemplate] = (counts[slide.mainTemplate] || 0) + 1;
      return counts;
    }, {}),
    applied,
  };
  const reportPath = options.report ? path.resolve(root, options.report) : path.join(workDeckDir, "template-rewrite-application-report.json");
  writeJson(reportPath, report);
  console.log(
    JSON.stringify(
      {
        status: report.status,
        mode: report.mode,
        workDeckDir: report.workDeckDir,
        reportPath: path.relative(root, reportPath),
        slideCount: report.slideCount,
        appliedCount: report.appliedCount,
        changedTemplateCount: report.changedTemplateCount,
        templateDistribution: report.templateDistribution,
      },
      null,
      2
    )
  );
}

try {
  main();
} catch (error) {
  console.error(`FAIL apply template rewrite plan: ${error.message}`);
  process.exit(1);
}
