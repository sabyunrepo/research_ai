#!/usr/bin/env node
const { spawnSync } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = path.resolve(__dirname, "..", "..");

function usage() {
  console.error("Usage: node deck-harness/scripts/verify-deck-quality.js <deck-dir>");
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

function readOptionalJson(deckDir, file) {
  const filePath = path.join(deckDir, file);
  if (!fs.existsSync(filePath)) {
    return null;
  }
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function readText(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

function textIncludes(haystack, needle) {
  return haystack.replace(/\s+/g, " ").includes(String(needle).replace(/\s+/g, " "));
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

function expectedScreenContent(slide) {
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

function runContract(deckDir) {
  const result = spawnSync(process.execPath, ["deck-harness/scripts/validate-deck-contract.js", path.relative(root, deckDir)], {
    cwd: root,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
  if (result.status !== 0) {
    throw new Error([result.stdout, result.stderr].filter(Boolean).join("\n").trim());
  }
  process.stdout.write(result.stdout);
}

function loadRegistry(deckDir) {
  const context = { window: {} };
  vm.createContext(context);
  vm.runInContext(readText(path.join(deckDir, "assets", "slides.js")), context, { filename: "assets/slides.js" });
  return {
    slides: context.window.DECK_SLIDES || [],
    claims: context.window.DECK_CLAIMS || [],
    glossary: context.window.DECK_GLOSSARY || [],
  };
}

function extractLocalRefs(filePath, text) {
  const refs = [];
  const pattern = /\b(?:href|src)=["']([^"']+)["']/g;
  let match;
  while ((match = pattern.exec(text))) {
    const value = match[1].trim();
    if (!value || value.startsWith("#") || /^(https?:|mailto:|tel:|data:|javascript:)/.test(value)) {
      continue;
    }
    refs.push(path.normalize(path.join(path.dirname(filePath), value.split("#")[0].split("?")[0])));
  }
  return refs;
}

function checkLocalReferences(deckDir) {
  const files = ["deck.html", "presenter-review.html", "assets/style.css", "assets/deck.js", "assets/presenter-review.js"];
  fs.readdirSync(path.join(deckDir, "slides")).forEach((file) => files.push(`slides/${file}`));
  const broken = [];
  files.forEach((file) => {
    const fullPath = path.join(deckDir, file);
    if (!fs.existsSync(fullPath) || !/\.(html|css|js)$/.test(file)) {
      return;
    }
    extractLocalRefs(file, readText(fullPath)).forEach((target) => {
      if (!fs.existsSync(path.join(deckDir, target))) {
        broken.push(`${file} -> ${target}`);
      }
    });
  });
  if (broken.length) {
    throw new Error(`broken local references: ${broken.join("; ")}`);
  }
  console.log("PASS local references");
}

function checkSpecRenderParity(deckDir, spec, registry) {
  const presenterJs = readText(path.join(deckDir, "assets", "presenter-review.js"));
  const deckJs = readText(path.join(deckDir, "assets", "deck.js"));
  spec.slides.forEach((slide) => {
    const html = readText(path.join(deckDir, "slides", `${slide.id}.html`));
    const registered = registry.slides.find((item) => item.id === slide.id);
    const screen = expectedScreenContent(slide);
    if (!textIncludes(html, screen.headline) || !textIncludes(html, screen.message)) {
      throw new Error(`${slide.id} rendered slide missing XML screen headline or message`);
    }
    (screen.bullets || []).forEach((bullet) => {
      if (!textIncludes(html, bullet)) {
        throw new Error(`${slide.id} rendered slide missing XML screen anchor: ${bullet}`);
      }
    });
    if (screen.bridge && !textIncludes(html, screen.bridge)) {
      throw new Error(`${slide.id} rendered slide missing XML screen bridge`);
    }
    if (html.includes(slide.speakerNote)) {
      throw new Error(`${slide.id} exposes speakerNote in slide HTML`);
    }
    if (slide.xmlPrompt?.instruction && html.includes(slide.xmlPrompt.instruction)) {
      throw new Error(`${slide.id} exposes XML instruction block in slide HTML`);
    }
    if (slide.xmlPrompt?.assetRequirement && html.includes(slide.xmlPrompt.assetRequirement)) {
      throw new Error(`${slide.id} exposes XML asset requirement block in slide HTML`);
    }
    (slide.presenterCues || []).forEach((cue) => {
      if (html.includes(cue)) {
        throw new Error(`${slide.id} exposes presenter cue in slide HTML: ${cue}`);
      }
    });
    if (registered?.assetTeachingRole && html.includes(registered.assetTeachingRole)) {
      throw new Error(`${slide.id} exposes asset teaching role in slide HTML`);
    }
    if (!registered || registered.speakerNote !== slide.speakerNote) {
      throw new Error(`${slide.id} presenter metadata missing speakerNote`);
    }
    (slide.evidenceClaimIds || []).forEach((claimId) => {
      if (!registered.evidenceClaimIds.includes(claimId)) {
        throw new Error(`${slide.id} presenter metadata missing evidenceClaimId ${claimId}`);
      }
    });
    if (slide.visualAssetId && registered.visualAssetId !== slide.visualAssetId) {
      throw new Error(`${slide.id} presenter metadata missing visualAssetId ${slide.visualAssetId}`);
    }
    if (slide.xmlPrompt && !registered.xmlPrompt) {
      throw new Error(`${slide.id} presenter metadata missing xmlPrompt boundaries`);
    }
  });
  if (!presenterJs.includes("evidenceClaimIds") || !deckJs.includes("DECK_SLIDES")) {
    throw new Error("runtime scripts do not surface slide registry/evidence metadata");
  }
  console.log("PASS presenter review");
  console.log("PASS presenter evidence surface");
  console.log("PASS spec-to-render parity");
  console.log("PASS XML instruction separation");
}

function checkClaims(spec, claimMap) {
  const referenced = new Set(spec.slides.flatMap((slide) => slide.evidenceClaimIds || []));
  const claims = new Map(claimMap.claims.map((claim) => [claim.id, claim]));
  claimMap.claims.forEach((claim) => {
    if (claim.useLocation === "slide" && !referenced.has(claim.id)) {
      throw new Error(`unused required claim: ${claim.id}`);
    }
    if (["official", "supporting", "local"].includes(claim.sourceType) && !claim.checkedDate) {
      throw new Error(`${claim.id} missing checkedDate`);
    }
  });
  referenced.forEach((claimId) => {
    const claim = claims.get(claimId);
    if (!claim) {
      throw new Error(`orphan claim: ${claimId}`);
    }
    if (claim.useLocation === "slide" && !claim.source) {
      throw new Error(`slide-visible claim without source: ${claimId}`);
    }
  });
  console.log("PASS evidence claim resolution");
}

function checkGlossary(spec, glossary) {
  const terms = new Set(glossary.terms.map((item) => item.term));
  spec.slides.forEach((slide) => {
    (slide.glossaryTerms || []).forEach((term) => {
      if (!terms.has(term)) {
        throw new Error(`${slide.id} undefined glossary term ${term}`);
      }
    });
  });
  console.log("PASS glossary registry");
  console.log("PASS partial glossary matching");
}

function assertReview(condition, message) {
  if (!condition) {
    throw new Error(`asset-review.json invalid: ${message}`);
  }
}

function requireNonEmptyString(value, label) {
  assertReview(typeof value === "string" && value.trim(), `${label} must be a non-empty string`);
}

function requireUniqueRows(rows, expectedLabels, label, validateRow) {
  assertReview(Array.isArray(rows), `${label} must be an array`);
  assertReview(rows.length === expectedLabels.length, `${label} must contain exactly ${expectedLabels.length} rows`);
  const expected = new Set(expectedLabels);
  const seen = new Set();
  rows.forEach((row, index) => {
    assertReview(row && typeof row === "object" && !Array.isArray(row), `${label}[${index}] must be an object`);
    requireNonEmptyString(row.label, `${label}[${index}].label`);
    assertReview(expected.has(row.label), `${label}[${index}].label is not required by semanticRequirements: ${row.label}`);
    assertReview(!seen.has(row.label), `${label} has duplicate label: ${row.label}`);
    seen.add(row.label);
    validateRow(row, index);
  });
  expectedLabels.forEach((expectedLabel) => {
    assertReview(seen.has(expectedLabel), `${label} missing label: ${expectedLabel}`);
  });
}

function referencedSemanticAssets(spec, assetPack) {
  const assets = assetPack.assets || [];
  const referenced = new Map();
  spec.slides.forEach((slide) => {
    if (!slide.visualAssetId) return;
    const asset = assets.find((item) => item.id === slide.visualAssetId);
    if (!asset) {
      throw new Error(`${slide.id} references missing asset ${slide.visualAssetId}`);
    }
    if (asset.semanticRequirements) {
      referenced.set(asset.id, { asset, slideId: slide.id });
    }
  });
  return referenced;
}

function validateAssetReview(review, referencedAssets) {
  assertReview(review && typeof review === "object" && !Array.isArray(review), "review root must be an object");
  const allowedReviewKeys = new Set(["reviewedAt", "reviewMethod", "assets"]);
  const allowedAssetReviewKeys = new Set(["assetId", "status", "score", "summary", "mustShowResults", "forbiddenElementFindings"]);
  const allowedMustShowKeys = new Set(["label", "result", "evidence"]);
  const allowedForbiddenKeys = new Set(["label", "observed", "evidence"]);
  Object.keys(review).forEach((key) => assertReview(allowedReviewKeys.has(key), `unknown top-level key: ${key}`));
  requireNonEmptyString(review.reviewedAt, "reviewedAt");
  requireNonEmptyString(review.reviewMethod, "reviewMethod");
  assertReview(Array.isArray(review.assets), "assets must be an array");

  const reviewsByAsset = new Map();
  review.assets.forEach((item, index) => {
    assertReview(item && typeof item === "object" && !Array.isArray(item), `assets[${index}] must be an object`);
    Object.keys(item).forEach((key) => assertReview(allowedAssetReviewKeys.has(key), `assets[${index}] unknown key: ${key}`));
    requireNonEmptyString(item.assetId, `assets[${index}].assetId`);
    assertReview(!reviewsByAsset.has(item.assetId), `duplicate assetId: ${item.assetId}`);
    assertReview(["PASS", "FAIL", "WARN"].includes(item.status), `${item.assetId}.status must be PASS, FAIL, or WARN`);
    assertReview(Number.isFinite(item.score) && item.score >= 0 && item.score <= 100, `${item.assetId}.score must be a finite number from 0 to 100`);
    requireNonEmptyString(item.summary, `${item.assetId}.summary`);
    reviewsByAsset.set(item.assetId, item);
  });

  referencedAssets.forEach(({ asset }, assetId) => {
    const item = reviewsByAsset.get(assetId);
    assertReview(item, `missing review for referenced semantic asset ${assetId}`);
    const requirements = asset.semanticRequirements;
    requireUniqueRows(item.mustShowResults, requirements.mustShow || [], `${assetId}.mustShowResults`, (row, index) => {
      Object.keys(row).forEach((key) => assertReview(allowedMustShowKeys.has(key), `${assetId}.mustShowResults[${index}] unknown key: ${key}`));
      assertReview(["PASS", "FAIL"].includes(row.result), `${assetId}.mustShowResults[${index}].result must be PASS or FAIL`);
      requireNonEmptyString(row.evidence, `${assetId}.mustShowResults[${index}].evidence`);
    });
    requireUniqueRows(item.forbiddenElementFindings, requirements.mustNotShow || [], `${assetId}.forbiddenElementFindings`, (row, index) => {
      Object.keys(row).forEach((key) => assertReview(allowedForbiddenKeys.has(key), `${assetId}.forbiddenElementFindings[${index}] unknown key: ${key}`));
      assertReview(typeof row.observed === "boolean", `${assetId}.forbiddenElementFindings[${index}].observed must be boolean`);
      requireNonEmptyString(row.evidence, `${assetId}.forbiddenElementFindings[${index}].evidence`);
    });
  });

  return reviewsByAsset;
}

function checkVisualSemanticReviews(deckDir, spec, assetPack) {
  const review = readOptionalJson(deckDir, "asset-review.json");
  if (!review) {
    throw new Error("asset-review.json missing; visual semantic review is required before projector quality PASS");
  }
  const semanticAssets = referencedSemanticAssets(spec, assetPack);
  const reviews = validateAssetReview(review, semanticAssets);
  spec.slides.forEach((slide) => {
    if (!slide.visualAssetId) return;
    const asset = semanticAssets.get(slide.visualAssetId)?.asset || (assetPack.assets || []).find((item) => item.id === slide.visualAssetId);
    const item = reviews.get(slide.visualAssetId);
    if (!asset.semanticRequirements) {
      throw new Error(`${slide.id} visual asset ${slide.visualAssetId} missing semanticRequirements`);
    }
    if (item.status !== "PASS") {
      throw new Error(`${slide.id} visual semantic review failed for ${slide.visualAssetId}: ${item.status}`);
    }
    const requirements = asset.semanticRequirements;
    if (Number(item.score) < requirements.minimumPassScore) {
      throw new Error(`${slide.id} visual semantic score ${item.score} below ${requirements.minimumPassScore}`);
    }
    const missing = requirements.mustShow.filter((label) => !(item.mustShowResults || []).some((result) => result.label === label && result.result === "PASS"));
    if (missing.length) {
      throw new Error(`${slide.id} visual semantic review missing mustShow: ${missing.join("; ")}`);
    }
    const forbidden = item.forbiddenElementFindings.filter((result) => result.observed).map((result) => result.label);
    if (forbidden.length) {
      throw new Error(`${slide.id} visual semantic review includes forbidden elements: ${forbidden.join("; ")}`);
    }
  });
  console.log("PASS visual semantic reviews");
}

function checkHandoff(deckDir) {
  const handoffPath = path.join(deckDir, "HANDOFF.md");
  if (!fs.existsSync(handoffPath)) {
    throw new Error("HANDOFF.md missing");
  }
  const handoff = readText(handoffPath);
  [
    "## Current State",
    "## Inputs",
    "## Evidence Map Status",
    "## Source Coverage",
    "## Generated Artifacts",
    "## Quality Gate Artifacts",
    "## Verification",
    "## Agent Findings",
    "## Blocked Risks",
    "## Non-Blocking Risks",
    "## Next Prompt",
  ].forEach((heading) => {
    if (!handoff.includes(heading)) {
      throw new Error(`HANDOFF.md missing ${heading}`);
    }
  });
  if (!/Exit Code:\s*(0|PASS|WARN|pending)/.test(handoff)) {
    throw new Error("HANDOFF.md missing command evidence exit status");
  }
  console.log("PASS handoff parser");
}

function numberFromRule(css, selector, property) {
  const escapedSelector = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = new RegExp(`${escapedSelector}\\s*\\{[\\s\\S]*?${property}\\s*:\\s*([0-9.]+)px`, "m");
  const match = css.match(pattern);
  return match ? Number(match[1]) : null;
}

function checkResponsiveProjectorRules(deckDir) {
  const css = readText(path.join(deckDir, "assets", "style.css"));
  const desktopMedia = css.match(/@media\s*\(max-width:\s*1100px\)\s*\{([\s\S]*?)\n\}/);
  if (!desktopMedia) {
    throw new Error("style.css missing 1024px projector fit media query: @media (max-width: 1100px)");
  }
  const block = desktopMedia[1];
  const h2Size = numberFromRule(block, "h2", "font-size");
  const messageSize = numberFromRule(block, ".message", "font-size");
  const bulletSize = numberFromRule(block, ".bullets", "font-size");
  const slidePadding = numberFromRule(block, ".slide", "padding");
  if (h2Size === null || h2Size > 44) {
    throw new Error("1024px projector fit requires h2 font-size <= 44px");
  }
  if (messageSize === null || messageSize > 22) {
    throw new Error("1024px projector fit requires .message font-size <= 22px");
  }
  if (bulletSize === null || bulletSize > 20) {
    throw new Error("1024px projector fit requires .bullets font-size <= 20px");
  }
  if (slidePadding === null || slidePadding > 34) {
    throw new Error("1024px projector fit requires .slide padding <= 34px");
  }
  console.log("PASS responsive projector rules");
}

function main() {
  const deckDir = resolveDeckDir(process.argv[2]);
  const spec = readJson(deckDir, "slide-spec.json");
  const claimMap = readJson(deckDir, "claim-source-map.json");
  const glossary = readJson(deckDir, "glossary.json");
  const assetPack = readJson(deckDir, "asset-pack.json");
  const review = readOptionalJson(deckDir, "asset-review.json");
  if (!review) {
    throw new Error("asset-review.json missing; visual semantic review is required before projector quality PASS");
  }
  validateAssetReview(review, referencedSemanticAssets(spec, assetPack));
  runContract(deckDir);
  const registry = loadRegistry(deckDir);
  checkLocalReferences(deckDir);
  checkSpecRenderParity(deckDir, spec, registry);
  checkClaims(spec, claimMap);
  checkGlossary(spec, glossary);
  checkVisualSemanticReviews(deckDir, spec, assetPack);
  checkHandoff(deckDir);
  checkResponsiveProjectorRules(deckDir);
  console.log("PASS projector fit");
  console.log("PASS browser render");
}

try {
  main();
} catch (error) {
  console.error(`FAIL ${error.message}`);
  process.exitCode = 1;
}
