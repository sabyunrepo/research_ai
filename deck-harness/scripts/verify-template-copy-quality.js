#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..", "..");

const badEndings = [
  /알지[.]$/,
  /보여[.]$/,
  /품질을[.]$/,
  /Prompt는[.]$/,
  /기준으로 해야 할지[.]$/,
  /subfolder[.]$/,
  /실제 작업에서는[.]$/,
  /재사용하기[.]$/,
  /확인[.]$/,
  /매뉴얼[.]$/,
  /처리하는[.]$/,
  /먼저[.]$/,
  /짧게[.]$/,
  /필요할 때[.]$/,
  /연습하기 위해[.]$/,
  /섞일 수[.]$/,
  /나누는[.]$/,
  /필수검증[.]$/,
  /예제 구조를[.]$/,
];

function usage() {
  console.error("Usage: node deck-harness/scripts/verify-template-copy-quality.js <deck-dir>");
}

function textValues(slide) {
  const screen = slide.rewrittenScreen || slide.templateRewrite?.screenStructure || {};
  return [
    ["title", slide.title],
    ["message", slide.message],
    ["bridge", slide.bridge],
    ["screen.headline", screen.headline],
    ["screen.message", screen.message],
    ["screen.bridge", screen.bridge],
  ].filter(([, value]) => typeof value === "string" && value.trim());
}

function main() {
  const deckDir = process.argv[2] ? path.resolve(root, process.argv[2]) : "";
  if (!deckDir) {
    usage();
    process.exit(2);
  }
  const spec = JSON.parse(fs.readFileSync(path.join(deckDir, "slide-spec.json"), "utf8"));
  const failures = [];

  for (const [index, slide] of spec.slides.entries()) {
    const prefix = `${index + 1}:${slide.id}`;
    const screen = slide.rewrittenScreen || slide.templateRewrite?.screenStructure || {};
    if (!slide.templateRewrite?.copyPolish) failures.push(`${prefix} missing templateRewrite.copyPolish marker`);
    for (const [field, value] of textValues(slide)) {
      if (value.length > 92) failures.push(`${prefix} ${field} too long for projector copy (${value.length})`);
      if (badEndings.some((pattern) => pattern.test(value.trim()))) failures.push(`${prefix} ${field} has dangling ending: ${value}`);
      if (/\.\s*[A-Za-z가-힣]{1,8}[.]$/.test(value) && value.includes("Prompt는")) failures.push(`${prefix} ${field} has truncated mixed sentence: ${value}`);
    }
    if (slide.mainTemplate === "workflow-strip") {
      for (const step of screen.steps || []) {
        const label = step.label || "";
        if (label.length > 10) failures.push(`${prefix} workflow label too long: ${label}`);
        if (/[→=]/.test(label)) failures.push(`${prefix} workflow label still contains syntax marker: ${label}`);
      }
    }
    if (slide.mainTemplate === "decision-gate") {
      for (const criterion of screen.criteria || []) {
        const text = criterion.text || "";
        if (text.length > 14) failures.push(`${prefix} decision criterion too long: ${text}`);
      }
    }
    if (slide.mainTemplate === "brief-window") {
      for (const row of screen.rows || []) {
        const text = row.text || "";
        if (text.length > 18) failures.push(`${prefix} brief row too long: ${row.label}: ${text}`);
      }
    }
    if (slide.mainTemplate === "term-bridge" && screen.metaphorTerm && screen.realTerm) {
      if (!screen.bridgeLine || !screen.bridgeLine.includes(screen.realTerm)) {
        failures.push(`${prefix} term bridge does not connect to real term`);
      }
      if (/은 실제 하네스 용어로|은 실제 용어로|을 실제 용어|를 실제 용어|설계을|Engineering로|Prompt로|Context로|Skill로/.test(screen.bridgeLine)) {
        failures.push(`${prefix} term bridge has awkward particle copy: ${screen.bridgeLine}`);
      }
    }
  }

  if (failures.length) {
    console.error(["FAIL template copy quality", ...failures].join("\n"));
    process.exit(1);
  }
  console.log(`PASS template copy quality: ${spec.slides.length} slides`);
}

try {
  main();
} catch (error) {
  console.error(`FAIL template copy quality: ${error.message}`);
  process.exit(1);
}
