#!/usr/bin/env node
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const specPath = path.join(root, "lecture-cuts", "slide-spec.json");
const defaultSlides = "6,7";
const slideArgIndex = process.argv.indexOf("--slides");
const slideArg = slideArgIndex >= 0 ? process.argv[slideArgIndex + 1] : defaultSlides;

function words(text) {
  return String(text || "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}.]+/gu, " ")
    .split(/\s+/)
    .filter((word) => word.length >= 2);
}

function unique(values) {
  return [...new Set(values)];
}

function jaccard(a, b) {
  const left = new Set(a);
  const right = new Set(b);
  const intersection = [...left].filter((value) => right.has(value)).length;
  const union = new Set([...left, ...right]).size;
  return union ? intersection / union : 0;
}

function visibleText(slide) {
  return [
    slide.title,
    slide.subtitle,
    ...(slide.bullets || []),
    slide.note?.text || "",
  ]
    .filter(Boolean)
    .join(" ");
}

function roleFor(slide) {
  const text = visibleText(slide);
  if (/책임|섞이면|맡는/.test(text)) return "responsibility boundary";
  if (/지시\s*→|승격|단단한 구조|한 번 말할/.test(text)) return "sequence/process";
  if (/예시|example|before|after/.test(text)) return "example";
  if (/연습|실습|practice/.test(text)) return "practice instruction";
  if (/다음|전환/.test(text)) return "transition";
  return "concept definition";
}

function resolveTargets(spec) {
  const indexes = slideArg
    .split(",")
    .map((value) => Number(value.trim()))
    .filter(Number.isInteger);
  if (indexes.length < 2) {
    throw new Error("--slides must include at least two numeric slide indexes");
  }
  return indexes.map((index) => {
    const slide = spec.slides.find((candidate) => candidate.index === index);
    if (!slide) {
      throw new Error(`Slide index ${index} not found in lecture-cuts/slide-spec.json`);
    }
    return slide;
  });
}

function main() {
  const spec = JSON.parse(fs.readFileSync(specPath, "utf8"));
  const slides = resolveTargets(spec);
  const findings = [];

  for (let index = 0; index < slides.length - 1; index += 1) {
    const left = slides[index];
    const right = slides[index + 1];
    const visibleOverlap = jaccard(unique(words(visibleText(left))), unique(words(visibleText(right))));
    const scriptOverlap = jaccard(unique(words(left.speaker?.text || "")), unique(words(right.speaker?.text || "")));
    const leftRole = roleFor(left);
    const rightRole = roleFor(right);
    const sameSection = left.section?.id && left.section.id === right.section?.id;
    const risk =
      (leftRole === rightRole && visibleOverlap >= 0.18) ||
      (sameSection && visibleOverlap >= 0.24) ||
      scriptOverlap >= 0.22;

    findings.push({
      pair: `${left.index}-${right.index}`,
      left: `${left.index} ${left.file}`,
      right: `${right.index} ${right.file}`,
      leftRole,
      rightRole,
      visibleOverlap: Number(visibleOverlap.toFixed(3)),
      scriptOverlap: Number(scriptOverlap.toFixed(3)),
      status: risk ? "WARN" : "PASS",
    });
  }

  const hasWarn = findings.some((finding) => finding.status === "WARN");
  findings.forEach((finding) => {
    console.log(`${finding.status} slides ${finding.pair}`);
    console.log(`  left: ${finding.left} (${finding.leftRole})`);
    console.log(`  right: ${finding.right} (${finding.rightRole})`);
    console.log(`  visibleOverlap: ${finding.visibleOverlap}`);
    console.log(`  scriptOverlap: ${finding.scriptOverlap}`);
  });

  if (hasWarn) {
    console.log("WARN redundancy risk - neighboring slides need role separation review");
  } else {
    console.log("PASS redundancy risk - neighboring slides have distinct teaching roles");
  }
}

try {
  main();
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
