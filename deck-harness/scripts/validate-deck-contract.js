#!/usr/bin/env node
const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = path.resolve(__dirname, "..", "..");
const requiredFiles = ["claim-source-map.json", "section-plan.json", "slide-spec.json", "glossary.json", "job-manifest.json"];
const forbiddenSlideKeys = new Set(["source", "url", "checkedDate", "sourceType", "confidence", "sourceSummary", "sourceUrl", "sources"]);

function usage() {
  console.error("Usage: node deck-harness/scripts/validate-deck-contract.js <deck-dir>");
  process.exit(1);
}

function resolveDeckDir(input) {
  if (!input) {
    usage();
  }
  return path.isAbsolute(input) ? input : path.join(root, input);
}

function readJson(deckDir, file) {
  return JSON.parse(fs.readFileSync(path.join(deckDir, file), "utf8"));
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

function loadRegistry(deckDir) {
  const registryPath = path.join(deckDir, "assets", "slides.js");
  if (!fs.existsSync(registryPath)) {
    return null;
  }
  const context = { window: {} };
  vm.createContext(context);
  vm.runInContext(fs.readFileSync(registryPath, "utf8"), context, { filename: registryPath });
  return context.window.DECK_SLIDES || null;
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function checkForbiddenFields(value, pathLabel) {
  if (Array.isArray(value)) {
    value.forEach((item, index) => checkForbiddenFields(item, `${pathLabel}[${index}]`));
    return;
  }
  if (!value || typeof value !== "object") {
    return;
  }
  Object.entries(value).forEach(([key, child]) => {
    assert(!forbiddenSlideKeys.has(key), `${pathLabel}.${key} duplicates source metadata; use evidenceClaimIds only`);
    checkForbiddenFields(child, `${pathLabel}.${key}`);
  });
}

function validateClaimMap(claimMap) {
  assert(typeof claimMap.topic === "string" && claimMap.topic.trim(), "claim-source-map.topic is required");
  assert(/^\d{4}-\d{2}-\d{2}$/.test(claimMap.checkedDate || ""), "claim-source-map.checkedDate must be YYYY-MM-DD");
  assert(Array.isArray(claimMap.claims), "claim-source-map.claims must be an array");
  const ids = new Set();
  claimMap.claims.forEach((claim) => {
    assert(claim.id && !ids.has(claim.id), `claim id must be unique: ${claim.id}`);
    ids.add(claim.id);
    assert(claim.claim, `${claim.id}.claim is required`);
    assert(["official", "supporting", "local", "inference"].includes(claim.sourceType), `${claim.id}.sourceType is invalid`);
    assert(["slide", "speaker-note", "appendix", "avoid"].includes(claim.useLocation), `${claim.id}.useLocation is invalid`);
    assert(["high", "medium", "low"].includes(claim.confidence), `${claim.id}.confidence is invalid`);
    if (claim.sourceType === "inference") {
      assert(claim.notes && claim.notes.trim(), `${claim.id} inference claims require notes`);
    } else {
      assert(claim.source && claim.checkedDate, `${claim.id} source and checkedDate are required`);
    }
  });
  assert(
    (Array.isArray(claimMap.claimsToAvoid) && claimMap.claimsToAvoid.length > 0) || claimMap.claimsToAvoidReviewed === true,
    "claimsToAvoid must be non-empty, or claimsToAvoidReviewed must be true"
  );
}

function validateSectionPlan(sectionPlan, slideIds) {
  assert(Number.isFinite(sectionPlan.timeboxMinutes), "section-plan.timeboxMinutes is required");
  assert(Array.isArray(sectionPlan.sections), "section-plan.sections must be an array");
  const total = sectionPlan.sections.reduce((sum, section) => {
    assert(section.id && section.title, "each section requires id and title");
    assert(section.learningObjective, `${section.id}.learningObjective is required`);
    assert(Number.isFinite(section.estimatedMinutes), `${section.id}.estimatedMinutes is required`);
    (section.slides || []).forEach((slideId) => assert(slideIds.has(slideId), `${section.id} references missing slide ${slideId}`));
    return sum + section.estimatedMinutes;
  }, 0);
  assert(total <= sectionPlan.timeboxMinutes, `section estimated minutes ${total} exceed timebox ${sectionPlan.timeboxMinutes}`);
}

function validateGlossary(glossary) {
  assert(Array.isArray(glossary.terms), "glossary.terms must be an array");
  const terms = new Set();
  glossary.terms.forEach((item) => {
    assert(item.term && item.definition, "glossary terms require term and definition");
    assert(["whole-word", "exact-phrase"].includes(item.match), `${item.term}.match is invalid`);
    assert(!terms.has(item.term), `duplicate glossary term: ${item.term}`);
    terms.add(item.term);
  });
  return terms;
}

function validateSlideSpec(spec, claimMap, glossaryTerms) {
  assert(Array.isArray(spec.slides), "slide-spec.slides must be an array");
  const claimIds = new Set(claimMap.claims.map((claim) => claim.id));
  const avoidClaimIds = new Set(claimMap.claims.filter((claim) => claim.useLocation === "avoid").map((claim) => claim.id));
  const slideIds = new Set();
  let minutes = 0;
  spec.slides.forEach((slide, index) => {
    assert(slide.id && !slideIds.has(slide.id), `slide ${index + 1} id is missing or duplicate`);
    slideIds.add(slide.id);
    ["section", "sectionObjective", "title", "message", "visualIntent", "speakerNote"].forEach((field) => {
      assert(typeof slide[field] === "string" && slide[field].trim(), `${slide.id}.${field} is required`);
    });
    assert(Number.isFinite(slide.estimatedMinutes), `${slide.id}.estimatedMinutes is required`);
    minutes += slide.estimatedMinutes;
    assert(Array.isArray(slide.evidenceClaimIds), `${slide.id}.evidenceClaimIds must be an array`);
    slide.evidenceClaimIds.forEach((claimId) => {
      assert(claimIds.has(claimId), `${slide.id} references missing claim ${claimId}`);
      assert(!avoidClaimIds.has(claimId), `${slide.id} references avoid claim ${claimId}`);
    });
    (slide.glossaryTerms || []).forEach((term) => assert(glossaryTerms.has(term), `${slide.id} references undefined glossary term ${term}`));
    checkForbiddenFields(slide, `slide ${slide.id}`);
  });
  return { slideIds, minutes };
}

function validateManifest(deckDir, manifest) {
  assert(manifest.jobId && manifest.topicSlug && manifest.createdAt, "job-manifest requires jobId, topicSlug, and createdAt");
  assert(Array.isArray(manifest.stages), "job-manifest.stages must be an array");
  manifest.stages.forEach((stage) => {
    ["name", "owner", "inputHash", "outputHash", "status", "evidencePath"].forEach((field) => assert(stage[field] !== undefined, `${stage.name || "stage"}.${field} is required`));
    assert(["PASS", "WARN", "FAIL"].includes(stage.status), `${stage.name}.status is invalid`);
    assert(Array.isArray(stage.inputs) && Array.isArray(stage.outputs), `${stage.name}.inputs and outputs are required`);
    const actualInputHash = hashFiles(deckDir, stage.inputs);
    assert(stage.inputHash === actualInputHash || stage.inputs.length === 0, `${stage.name}.inputHash is stale`);
    if (stage.status === "PASS" && stage.outputs.length > 0 && stage.outputHash) {
      const actualOutputHash = hashFiles(deckDir, stage.outputs);
      assert(stage.outputHash === actualOutputHash, `${stage.name}.outputHash is stale`);
    }
  });
}

function main() {
  const deckDir = resolveDeckDir(process.argv[2]);
  requiredFiles.forEach((file) => assert(fs.existsSync(path.join(deckDir, file)), `${file} is missing`));

  const claimMap = readJson(deckDir, "claim-source-map.json");
  const sectionPlan = readJson(deckDir, "section-plan.json");
  const spec = readJson(deckDir, "slide-spec.json");
  const glossary = readJson(deckDir, "glossary.json");
  const manifest = readJson(deckDir, "job-manifest.json");

  validateClaimMap(claimMap);
  const glossaryTerms = validateGlossary(glossary);
  const { slideIds, minutes } = validateSlideSpec(spec, claimMap, glossaryTerms);
  validateSectionPlan(sectionPlan, slideIds);
  assert(minutes <= sectionPlan.timeboxMinutes, `slide estimated minutes ${minutes} exceed timebox ${sectionPlan.timeboxMinutes}`);
  validateManifest(deckDir, manifest);

  const registry = loadRegistry(deckDir);
  if (registry) {
    assert(Array.isArray(registry), "assets/slides.js must define window.DECK_SLIDES array");
    assert(registry.length === spec.slides.length, `rendered slide count ${registry.length} differs from spec ${spec.slides.length}`);
  }

  console.log("PASS generated deck contract");
  console.log(`PASS source map schema - ${claimMap.claims.length} claims`);
  console.log(`PASS slide spec schema - ${spec.slides.length} slides`);
  console.log("PASS evidence claim resolution");
  console.log("PASS glossary registry");
}

try {
  main();
} catch (error) {
  console.error(`FAIL ${error.message}`);
  process.exitCode = 1;
}
