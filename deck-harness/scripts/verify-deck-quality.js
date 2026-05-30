#!/usr/bin/env node
const { spawnSync } = require("node:child_process");
const crypto = require("node:crypto");
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

function sha256(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function pngDimensions(filePath) {
  const buffer = fs.readFileSync(filePath);
  if (buffer.subarray(0, 8).toString("hex") !== "89504e470d0a1a0a") {
    throw new Error(`expected PNG evidence file: ${filePath}`);
  }
  return {
    width: buffer.readUInt32BE(16),
    height: buffer.readUInt32BE(20),
  };
}

function stableStringify(value) {
  if (Array.isArray(value)) {
    return `[${value.map((item) => stableStringify(item)).join(",")}]`;
  }
  if (value && typeof value === "object") {
    return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${stableStringify(value[key])}`).join(",")}}`;
  }
  return JSON.stringify(value);
}

function resolveAssetPath(deckDir, sourcePath) {
  if (!sourcePath) {
    return null;
  }
  return path.isAbsolute(sourcePath) ? sourcePath : path.join(deckDir, sourcePath);
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

function runGate(deckDir, script) {
  const result = spawnSync(process.execPath, [script, path.relative(root, deckDir)], {
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
    const screenValues = new Set([screen.headline, screen.message, screen.bridge, ...(screen.bullets || [])].filter(Boolean));
    const screenText = [...screenValues].join("\n");
    if (slide.speakerNote && !screenValues.has(slide.speakerNote) && html.includes(slide.speakerNote)) {
      throw new Error(`${slide.id} exposes speakerNote in slide HTML`);
    }
    if (slide.xmlPrompt?.instruction && html.includes(slide.xmlPrompt.instruction)) {
      throw new Error(`${slide.id} exposes XML instruction block in slide HTML`);
    }
    if (slide.xmlPrompt?.assetRequirement && html.includes(slide.xmlPrompt.assetRequirement)) {
      throw new Error(`${slide.id} exposes XML asset requirement block in slide HTML`);
    }
    (slide.presenterCues || []).forEach((cue) => {
      if (!screenText.includes(cue) && html.includes(cue)) {
        throw new Error(`${slide.id} exposes presenter cue in slide HTML: ${cue}`);
      }
    });
    if (registered?.assetTeachingRole && registered.assetTeachingRole !== slide.visualIntent && html.includes(registered.assetTeachingRole)) {
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

function rejectGenericEvidence(value, label) {
  const text = String(value || "");
  const genericPatterns = [
    /present on disk and the reviewed sheet\/crop contains/i,
    /contains the requested .* teaching scene/i,
    /No forbidden element was recorded/i,
    /visual inspection/i,
    /treated as present/i,
    /label checked/i,
    /teaching role:\s*undefined/i,
    /exact semantic labels must be rechecked/i,
  ];
  assertReview(!genericPatterns.some((pattern) => pattern.test(text)), `${label} is generic evidence, not concrete visual observation`);
}

function requireEvidencePath(deckDir, value, label) {
  requireNonEmptyString(value, label);
  const evidencePath = resolveAssetPath(deckDir, value);
  assertReview(evidencePath && fs.existsSync(evidencePath), `${label} does not exist: ${value}`);
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

function validateAssetReview(deckDir, review, referencedAssets) {
  assertReview(review && typeof review === "object" && !Array.isArray(review), "review root must be an object");
  const allowedReviewKeys = new Set(["reviewedAt", "reviewMethod", "assets"]);
  const allowedAssetReviewKeys = new Set([
    "assetId",
    "sourcePath",
    "assetSha256",
    "semanticRequirementsSha256",
    "status",
    "score",
    "summary",
    "mustShowResults",
    "forbiddenElementFindings",
    "imageDimensions",
    "reviewerMethod",
  ]);
  const allowedMustShowKeys = new Set(["label", "result", "evidence", "observation", "evidencePath"]);
  const allowedForbiddenKeys = new Set(["label", "observed", "evidence", "observation", "evidencePath"]);
  Object.keys(review).forEach((key) => assertReview(allowedReviewKeys.has(key), `unknown top-level key: ${key}`));
  requireNonEmptyString(review.reviewedAt, "reviewedAt");
  requireNonEmptyString(review.reviewMethod, "reviewMethod");
  assertReview(Array.isArray(review.assets), "assets must be an array");

  const reviewsByAsset = new Map();
  review.assets.forEach((item, index) => {
    assertReview(item && typeof item === "object" && !Array.isArray(item), `assets[${index}] must be an object`);
    Object.keys(item).forEach((key) => assertReview(allowedAssetReviewKeys.has(key), `assets[${index}] unknown key: ${key}`));
    requireNonEmptyString(item.assetId, `assets[${index}].assetId`);
    requireNonEmptyString(item.sourcePath, `${item.assetId}.sourcePath`);
    assertReview(/^[a-f0-9]{64}$/.test(item.assetSha256 || ""), `${item.assetId}.assetSha256 must be a sha256 hex digest`);
    assertReview(/^[a-f0-9]{64}$/.test(item.semanticRequirementsSha256 || ""), `${item.assetId}.semanticRequirementsSha256 must be a sha256 hex digest`);
    assertReview(!reviewsByAsset.has(item.assetId), `duplicate assetId: ${item.assetId}`);
    assertReview(["PASS", "FAIL", "WARN"].includes(item.status), `${item.assetId}.status must be PASS, FAIL, or WARN`);
    assertReview(Number.isFinite(item.score) && item.score >= 0 && item.score <= 100, `${item.assetId}.score must be a finite number from 0 to 100`);
    requireNonEmptyString(item.summary, `${item.assetId}.summary`);
    rejectGenericEvidence(item.summary, `${item.assetId}.summary`);
    reviewsByAsset.set(item.assetId, item);
  });

  referencedAssets.forEach(({ asset }, assetId) => {
    const item = reviewsByAsset.get(assetId);
    assertReview(item, `missing review for referenced semantic asset ${assetId}`);
    const requirements = asset.semanticRequirements;
    assertReview(item.sourcePath === asset.sourcePath, `${assetId}.sourcePath stale: expected ${asset.sourcePath}`);
    const assetPath = resolveAssetPath(deckDir, asset.sourcePath);
    assertReview(assetPath && fs.existsSync(assetPath), `${assetId}.sourcePath does not exist: ${asset.sourcePath}`);
    const actualAssetHash = sha256(fs.readFileSync(assetPath));
    assertReview(item.assetSha256 === actualAssetHash, `${assetId}.assetSha256 stale: expected ${actualAssetHash}`);
    const dimensions = pngDimensions(assetPath);
    assertReview(item.imageDimensions && typeof item.imageDimensions === "object", `${assetId}.imageDimensions is required`);
    assertReview(item.imageDimensions.width === dimensions.width, `${assetId}.imageDimensions.width stale: expected ${dimensions.width}`);
    assertReview(item.imageDimensions.height === dimensions.height, `${assetId}.imageDimensions.height stale: expected ${dimensions.height}`);
    requireNonEmptyString(item.reviewerMethod, `${assetId}.reviewerMethod`);
    const actualRequirementsHash = sha256(stableStringify(requirements));
    assertReview(
      item.semanticRequirementsSha256 === actualRequirementsHash,
      `${assetId}.semanticRequirementsSha256 stale: expected ${actualRequirementsHash}`
    );
    requireUniqueRows(item.mustShowResults, requirements.mustShow || [], `${assetId}.mustShowResults`, (row, index) => {
      Object.keys(row).forEach((key) => assertReview(allowedMustShowKeys.has(key), `${assetId}.mustShowResults[${index}] unknown key: ${key}`));
      assertReview(["PASS", "FAIL"].includes(row.result), `${assetId}.mustShowResults[${index}].result must be PASS or FAIL`);
      requireNonEmptyString(row.evidence, `${assetId}.mustShowResults[${index}].evidence`);
      rejectGenericEvidence(row.evidence, `${assetId}.mustShowResults[${index}].evidence`);
      requireNonEmptyString(row.observation, `${assetId}.mustShowResults[${index}].observation`);
      rejectGenericEvidence(row.observation, `${assetId}.mustShowResults[${index}].observation`);
      requireEvidencePath(deckDir, row.evidencePath, `${assetId}.mustShowResults[${index}].evidencePath`);
    });
    requireUniqueRows(item.forbiddenElementFindings, requirements.mustNotShow || [], `${assetId}.forbiddenElementFindings`, (row, index) => {
      Object.keys(row).forEach((key) => assertReview(allowedForbiddenKeys.has(key), `${assetId}.forbiddenElementFindings[${index}] unknown key: ${key}`));
      assertReview(typeof row.observed === "boolean", `${assetId}.forbiddenElementFindings[${index}].observed must be boolean`);
      requireNonEmptyString(row.evidence, `${assetId}.forbiddenElementFindings[${index}].evidence`);
      rejectGenericEvidence(row.evidence, `${assetId}.forbiddenElementFindings[${index}].evidence`);
      requireNonEmptyString(row.observation, `${assetId}.forbiddenElementFindings[${index}].observation`);
      rejectGenericEvidence(row.observation, `${assetId}.forbiddenElementFindings[${index}].observation`);
      requireEvidencePath(deckDir, row.evidencePath, `${assetId}.forbiddenElementFindings[${index}].evidencePath`);
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
  const reviews = validateAssetReview(deckDir, review, semanticAssets);
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

function cssBlock(css, selector) {
  const escapedSelector = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = new RegExp(`(?:^|\\n)${escapedSelector}\\s*\\{([\\s\\S]*?)\\n\\}`, "m");
  const match = css.match(pattern);
  return match ? match[1] : "";
}

function numericDeclaration(block, property) {
  const match = block.match(new RegExp(`${property}\\s*:\\s*([0-9.]+)`));
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

function checkVisualPolishRules(deckDir, registry) {
  const css = readText(path.join(deckDir, "assets", "style.css"));
  if (!css.includes("Gmarket Sans") || !/h2\s*\{[\s\S]*?font-weight\s*:\s*900/.test(css)) {
    throw new Error("style.css must use heavy Gmarket Sans title styling");
  }
  const bridgeBlock = cssBlock(css, ".slide-bridge");
  if (!bridgeBlock) {
    throw new Error("style.css missing .slide-bridge contract");
  }
  if (/border-left\s*:/.test(bridgeBlock) || /var\(--blue\)/.test(bridgeBlock)) {
    throw new Error(".slide-bridge must not use blue accent bar or blue emphasis");
  }
  const bridgeWeight = numericDeclaration(bridgeBlock, "font-weight");
  if (!Number.isFinite(bridgeWeight) || bridgeWeight > 400) {
    throw new Error(".slide-bridge must be visually light with font-weight <= 400");
  }
  if (!/@keyframes\s+slide-enter/.test(css) || !/@keyframes\s+visual-rise/.test(css) || !/prefers-reduced-motion/.test(css)) {
    throw new Error("style.css missing motion contract with reduced-motion fallback");
  }

  const variants = new Set();
  let placeholderCount = 0;
  registry.slides.forEach((slide) => {
    const html = readText(path.join(deckDir, "slides", slide.file));
    const classMatch = html.match(/<main class="([^"]+)"/);
    const classes = classMatch ? classMatch[1].split(/\s+/) : [];
    classes.filter((item) => item.startsWith("slide--")).forEach((item) => variants.add(item));
    if (html.includes("visual-card")) placeholderCount += 1;
  });
  if (variants.size < 4) {
    throw new Error(`generated deck needs at least 4 slide layout variants, found ${variants.size}`);
  }
  if (placeholderCount > 0) {
    throw new Error(`generated deck contains ${placeholderCount} visual placeholder cards`);
  }
  console.log("PASS visual polish rules");
}

function checkVisualDirectoryInventory(deckDir, assetPack) {
  const visualsDir = path.join(deckDir, "assets", "visuals");
  if (!fs.existsSync(visualsDir)) {
    throw new Error("assets/visuals directory missing");
  }
  const allowed = new Set();
  const projectorRequired = new Set();
  const assetsById = new Map((assetPack.assets || []).map((asset) => [asset.id, asset]));
  (assetPack.assets || []).forEach((asset) => {
    if (asset.sourcePath && asset.status !== "planned") {
      allowed.add(asset.sourcePath);
    }
  });
  const manifest = readOptionalJson(deckDir, "job-manifest.json");
  (manifest?.stages || []).forEach((stage) => {
    (stage.outputs || []).forEach((output) => {
      if (output.startsWith("assets/visuals/") && output.endsWith(".png")) allowed.add(output);
    });
  });
  const spec = readJson(deckDir, "slide-spec.json");
  spec.slides.forEach((slide) => {
    if (!slide.visualAssetId) return;
    const asset = assetsById.get(slide.visualAssetId);
    if (asset?.sourcePath) projectorRequired.add(asset.sourcePath);
  });
  const actual = fs.readdirSync(visualsDir).filter((file) => file.endsWith(".png")).map((file) => `assets/visuals/${file}`);
  const undeclared = actual.filter((file) => !allowed.has(file));
  const missingProjector = [...projectorRequired].filter((file) => !fs.existsSync(path.join(deckDir, file)));
  if (undeclared.length) {
    throw new Error(`assets/visuals contains undeclared PNG files: ${undeclared.slice(0, 8).join("; ")}${undeclared.length > 8 ? `; ${undeclared.length - 8} more` : ""}`);
  }
  if (missingProjector.length) {
    throw new Error(`projector visual assets missing from assets/visuals: ${missingProjector.slice(0, 8).join("; ")}`);
  }
  console.log("PASS visual directory inventory");
}

function checkAssetCropReview(deckDir) {
  const report = readOptionalJson(deckDir, "asset-crop-review.json");
  if (!report) {
    throw new Error("asset-crop-review.json missing; run verify-asset-crops after build-asset-pack");
  }
  const expectedAssetPackHash = `sha256:${sha256(Buffer.concat([
    Buffer.from("asset-pack.json\0"),
    fs.readFileSync(path.join(deckDir, "asset-pack.json")),
    Buffer.from("\0"),
  ]))}`;
  if (report.assetPackHash !== expectedAssetPackHash) {
    throw new Error("asset-crop-review assetPackHash is stale");
  }
  if (!Array.isArray(report.checked) || !report.checked.length) {
    throw new Error("asset-crop-review must check at least one crop-region asset");
  }
  report.checked.forEach((item, index) => {
    if (item.status !== "PASS") throw new Error(`asset-crop-review[${index}] is not PASS: ${item.status}`);
    if (!item.assetId || !item.sourceAssetId || !item.cropPath || !item.sourcePath) {
      throw new Error(`asset-crop-review[${index}] missing asset/source paths`);
    }
    if (!item.cropSafety || !item.cropQa) {
      throw new Error(`asset-crop-review[${index}] missing cropSafety/cropQa contract`);
    }
    if (!item.cropQa.reviewerRequired) {
      throw new Error(`asset-crop-review[${index}] must require reviewer QA for semantic crop risks`);
    }
    if (!Array.isArray(item.cropQa.edgeChecks) || item.cropQa.edgeChecks.length !== 4) {
      throw new Error(`asset-crop-review[${index}] must include four edge checks`);
    }
    item.cropQa.edgeChecks.forEach((check) => {
      if (check.status !== "PASS") {
        throw new Error(`asset-crop-review[${index}] unresolved edge artifact risk: ${check.edge}`);
      }
    });
    if (!item.cropQa.subjectCheck || item.cropQa.subjectCheck.status !== "PASS") {
      throw new Error(`asset-crop-review[${index}] unresolved subject-bound crop risk`);
    }
    const cropPath = resolveAssetPath(deckDir, item.cropPath);
    const sourcePath = resolveAssetPath(deckDir, item.sourcePath);
    if (!cropPath || !fs.existsSync(cropPath)) throw new Error(`asset-crop-review[${index}] cropPath missing: ${item.cropPath}`);
    if (!sourcePath || !fs.existsSync(sourcePath)) throw new Error(`asset-crop-review[${index}] sourcePath missing: ${item.sourcePath}`);
    if (item.cropSha256 !== sha256(fs.readFileSync(cropPath))) throw new Error(`asset-crop-review[${index}] cropSha256 stale`);
    if (item.sourceSha256 !== sha256(fs.readFileSync(sourcePath))) throw new Error(`asset-crop-review[${index}] sourceSha256 stale`);
    const dimensions = pngDimensions(cropPath);
    if (!item.cropDimensions || item.cropDimensions.width !== dimensions.width || item.cropDimensions.height !== dimensions.height) {
      throw new Error(`asset-crop-review[${index}] cropDimensions stale`);
    }
  });
  console.log(`PASS asset crop review - ${report.checked.length} crops`);
}

function checkBrowserRenderReport(deckDir) {
  const report = readOptionalJson(deckDir, "browser-render-report.json");
  if (!report) {
    throw new Error("browser-render-report.json missing; browser render cannot be marked PASS without screenshot evidence");
  }
  const manifest = readOptionalJson(deckDir, "job-manifest.json");
  const buildDeckStage = (manifest?.stages || []).find((stage) => stage.name === "build-deck");
  if (!report.deckOutputHash || !buildDeckStage?.outputHash || report.deckOutputHash !== buildDeckStage.outputHash) {
    throw new Error("browser-render-report deckOutputHash is stale or missing");
  }
  if (!["PASS", "WARN"].includes(report.status)) {
    throw new Error(`browser-render-report status blocks quality gate: ${report.status || "missing"}`);
  }
  if (report.status === "WARN") {
    throw new Error(`browser-render-report contains unresolved visual warnings: ${report.summary || "missing summary"}`);
  }
  if (!Array.isArray(report.captures) || report.captures.length < 5) {
    throw new Error("browser-render-report requires at least 5 captures across representative slides/viewports");
  }
  const spec = readJson(deckDir, "slide-spec.json");
  if (report.coverage === "all-slides-desktop-plus-projector-mobile") {
    const desktopSlides = new Set(report.captures
      .filter((capture) => capture.viewport?.width === 1366 && capture.viewport?.height === 768)
      .map((capture) => capture.slideNumber));
    (spec.slides || []).forEach((slide, index) => {
      if (!desktopSlides.has(index + 1)) {
        throw new Error(`browser-render-report missing all-slide desktop capture for slide ${index + 1}`);
      }
    });
  }
  const viewportKeys = new Set();
  report.captures.forEach((capture, index) => {
    if (!capture || typeof capture !== "object") throw new Error(`browser-render-report.captures[${index}] must be an object`);
    if (!capture.viewport || !Number.isFinite(capture.viewport.width) || !Number.isFinite(capture.viewport.height)) {
      throw new Error(`browser-render-report.captures[${index}] missing viewport dimensions`);
    }
    viewportKeys.add(`${capture.viewport.width}x${capture.viewport.height}`);
    if (!Number.isFinite(capture.slideNumber)) {
      throw new Error(`browser-render-report.captures[${index}] missing slideNumber`);
    }
    const screenshotPath = resolveAssetPath(deckDir, capture.screenshotPath);
    if (!screenshotPath || !fs.existsSync(screenshotPath)) {
      throw new Error(`browser-render-report.captures[${index}] screenshot missing: ${capture.screenshotPath}`);
    }
    const dimensions = pngDimensions(screenshotPath);
    if (capture.screenshotSha256 && capture.screenshotSha256 !== sha256(fs.readFileSync(screenshotPath))) {
      throw new Error(`browser-render-report.captures[${index}] screenshotSha256 stale`);
    }
    if (capture.imageDimensions) {
      if (capture.imageDimensions.width !== dimensions.width || capture.imageDimensions.height !== dimensions.height) {
        throw new Error(`browser-render-report.captures[${index}] imageDimensions stale`);
      }
    }
    if (typeof capture.observation !== "string" || capture.observation.trim().length < 24) {
      throw new Error(`browser-render-report.captures[${index}] requires a concrete visual observation`);
    }
  });
  ["1366x768", "1024x768"].forEach((viewport) => {
    if (!viewportKeys.has(viewport)) throw new Error(`browser-render-report missing required viewport ${viewport}`);
  });
  if (![...viewportKeys].some((viewport) => Number(viewport.split("x")[0]) <= 430)) {
    throw new Error("browser-render-report missing mobile-width viewport evidence");
  }
  console.log("PASS browser render evidence");
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
  validateAssetReview(deckDir, review, referencedSemanticAssets(spec, assetPack));
  runContract(deckDir);
  runGate(deckDir, "deck-harness/scripts/verify-deck-design-contract.js");
  runGate(deckDir, "deck-harness/scripts/verify-motion-contract.js");
  runGate(deckDir, "deck-harness/scripts/verify-slide-layout-variety.js");
  runGate(deckDir, "deck-harness/scripts/verify-glossary-depth.js");
  const registry = loadRegistry(deckDir);
  checkLocalReferences(deckDir);
  checkSpecRenderParity(deckDir, spec, registry);
  checkClaims(spec, claimMap);
  checkGlossary(spec, glossary);
  checkVisualSemanticReviews(deckDir, spec, assetPack);
  checkVisualDirectoryInventory(deckDir, assetPack);
  runGate(deckDir, "deck-harness/scripts/verify-asset-crops.js");
  checkAssetCropReview(deckDir);
  checkHandoff(deckDir);
  checkVisualPolishRules(deckDir, registry);
  checkResponsiveProjectorRules(deckDir);
  console.log("PASS projector fit");
  checkBrowserRenderReport(deckDir);
}

try {
  main();
} catch (error) {
  console.error(`FAIL ${error.message}`);
  process.exitCode = 1;
}
