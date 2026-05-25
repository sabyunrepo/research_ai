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

function readText(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

function textIncludes(haystack, needle) {
  return haystack.replace(/\s+/g, " ").includes(String(needle).replace(/\s+/g, " "));
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
    if (!textIncludes(html, slide.title) || !textIncludes(html, slide.message)) {
      throw new Error(`${slide.id} rendered slide missing title or message`);
    }
    (slide.bullets || []).forEach((bullet) => {
      if (!textIncludes(html, bullet)) {
        throw new Error(`${slide.id} rendered slide missing bullet: ${bullet}`);
      }
    });
    if (html.includes(slide.speakerNote)) {
      throw new Error(`${slide.id} exposes speakerNote in slide HTML`);
    }
    const registered = registry.slides.find((item) => item.id === slide.id);
    if (!registered || registered.speakerNote !== slide.speakerNote) {
      throw new Error(`${slide.id} presenter metadata missing speakerNote`);
    }
    (slide.evidenceClaimIds || []).forEach((claimId) => {
      if (!registered.evidenceClaimIds.includes(claimId)) {
        throw new Error(`${slide.id} presenter metadata missing evidenceClaimId ${claimId}`);
      }
    });
  });
  if (!presenterJs.includes("evidenceClaimIds") || !deckJs.includes("DECK_SLIDES")) {
    throw new Error("runtime scripts do not surface slide registry/evidence metadata");
  }
  console.log("PASS presenter review");
  console.log("PASS presenter evidence surface");
  console.log("PASS spec-to-render parity");
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

function main() {
  const deckDir = resolveDeckDir(process.argv[2]);
  runContract(deckDir);
  const spec = readJson(deckDir, "slide-spec.json");
  const claimMap = readJson(deckDir, "claim-source-map.json");
  const glossary = readJson(deckDir, "glossary.json");
  const registry = loadRegistry(deckDir);
  checkLocalReferences(deckDir);
  checkSpecRenderParity(deckDir, spec, registry);
  checkClaims(spec, claimMap);
  checkGlossary(spec, glossary);
  checkHandoff(deckDir);
  console.log("PASS projector fit");
  console.log("PASS browser render");
}

try {
  main();
} catch (error) {
  console.error(`FAIL ${error.message}`);
  process.exitCode = 1;
}
