#!/usr/bin/env node
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const scriptPath = path.join(root, "generated-decks", "kimai-workshop-content", "presentation-script.json");
const rewriteRoot = path.join(root, "docs", "harness", "notebooklm-script-rewrites", "kimai-workshop-content");

function countRange(dir) {
  return fs
    .readdirSync(dir)
    .filter((name) => /^slide-0([0-6][0-9]|7[0-4])\.json$/.test(name))
    .length;
}

const data = JSON.parse(fs.readFileSync(scriptPath, "utf8"));
const emoji = /[\p{Extended_Pictographic}\u{1F1E6}-\u{1F1FF}\u{2600}-\u{27BF}]/u;
const explanatoryPhrases = [
  "제목 그대로",
  "여기서는",
  "기준점으로 잡고",
  "오늘 슬라이드",
  "화면의 제목",
  "청중에게 확인할 질문은",
  "다음 흐름으로",
  "풀어 보겠습니다",
];

const bad = [];
for (const entry of data.slides.filter((entry) => entry.index >= 1 && entry.index <= 74)) {
  if (emoji.test(entry.script)) bad.push(`${entry.index}: emoji`);
  for (const phrase of explanatoryPhrases) {
    if (entry.script.includes(phrase)) bad.push(`${entry.index}: ${phrase}`);
  }
  if ((entry.script.match(/[가-힣]/g) || []).length < 180) bad.push(`${entry.index}: short`);
}

const responses = countRange(path.join(rewriteRoot, "responses"));
const injected = countRange(path.join(rewriteRoot, "injected-sources"));
if (responses !== 74) bad.push(`responses: expected 74 got ${responses}`);
if (injected !== 74) bad.push(`injected: expected 74 got ${injected}`);

if (bad.length) {
  console.error(bad.join("\n"));
  process.exit(1);
}

console.log("PASS kimai NotebookLM rewrite range - 74 slides");
