#!/usr/bin/env node
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..", "..", "..", "..");
const deckDir = path.join(root, "generated-decks", "kimai-workshop-content");
const outputPath = path.join(root, "docs", "harness", "notebooklm-sources", "kimai-workshop-slide-content-only.md");

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function clean(value) {
  return String(value || "")
    .replace(/\r/g, "")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function unique(items) {
  return [...new Set((items || []).map(clean).filter(Boolean))];
}

function bulletBlock(items, indent = "") {
  const list = unique(items);
  return list.length ? list.map((item) => `${indent}- ${item}`).join("\n") : `${indent}- 없음`;
}

function visibleScreenEntries(screen = {}) {
  const excluded = new Set([
    "bridge",
    "transition",
    "presenterCues",
    "sourcePresenterCues",
    "speakerNote",
    "keywordFlow",
  ]);
  return Object.entries(screen).filter(([key, value]) => {
    if (excluded.has(key)) return false;
    if (value == null || value === "") return false;
    return true;
  });
}

function normalizedSlotName(key) {
  return key === "bridgeLine" ? "termLine" : key;
}

function renderValue(value, indent = "") {
  if (Array.isArray(value)) return `\n${bulletBlock(value, `${indent}  `)}`;
  if (value && typeof value === "object") {
    return `\n${Object.entries(value)
      .map(([key, item]) => `${indent}  - ${key}: ${clean(Array.isArray(item) ? item.join(", ") : item)}`)
      .join("\n")}`;
  }
  return ` ${clean(value)}`;
}

function main() {
  const spec = readJson(path.join(deckDir, "slide-spec.json"));
  const assetPack = readJson(path.join(deckDir, "asset-pack.json"));
  const assets = new Map((assetPack.assets || []).map((asset) => [asset.id, asset]));
  const sections = [];
  const seenSections = new Set();
  for (const slide of spec.slides || []) {
    if (!seenSections.has(slide.section)) {
      seenSections.add(slide.section);
      sections.push({ section: slide.section, objective: slide.sectionObjective });
    }
  }

  const lines = [
    "# 김아이 워크숍 전체덱 - 슬라이드 내용만",
    "",
    `생성 시각: ${new Date().toISOString()}`,
    "",
    "이 문서는 NotebookLM 주입용 소스입니다. `generated-decks/kimai-workshop-content/slide-spec.json`에서 청중이 보는 화면 문구만 추출했습니다. 발표 스크립트, speaker notes, presenter cues, transition/bridge, 리뷰 콘솔 메타데이터는 제외했습니다.",
    "",
    "## 덱 메타데이터",
    "",
    "- deck: 김아이 워크숍 전체덱",
    "- source: `generated-decks/kimai-workshop-content/slide-spec.json`",
    `- slide count: ${spec.slides.length}`,
    "- included: title, message, bullets, rewrittenScreen의 화면 슬롯, 시각자료 의미 요약",
    "- excluded: 발표 스크립트, speaker notes, presenter cues, transition/bridge, review/debug metadata",
    "",
    "## 섹션 목록",
    "",
  ];

  for (const section of sections) lines.push(`- ${section.section}: ${clean(section.objective)}`);
  lines.push("");

  (spec.slides || []).forEach((slide, index) => {
    const asset = assets.get(slide.visualAssetId || "");
    lines.push("---", "");
    lines.push(`## Slide ${String(index + 1).padStart(2, "0")} - ${clean(slide.title)}`);
    lines.push(`- id: ${slide.id}`);
    lines.push(`- file: ${slide.id}.html`);
    lines.push(`- section: ${clean(slide.section)}`);
    lines.push("### 기본 화면 문구");
    lines.push(`- title: ${clean(slide.title)}`);
    if (slide.message) lines.push(`- message: ${clean(slide.message)}`);
    lines.push("bullets:");
    lines.push(bulletBlock(slide.bullets || []));
    const entries = visibleScreenEntries(slide.rewrittenScreen || {});
    if (entries.length) {
      lines.push("### 템플릿 화면 슬롯");
      for (const [key, value] of entries) lines.push(`- ${normalizedSlotName(key)}:${renderValue(value)}`);
    }
    lines.push("### 시각자료 의미");
    lines.push(`- visual intent: ${clean(slide.visualIntent) || "없음"}`);
    if (asset?.teachingRole) lines.push(`- asset teaching role: ${clean(asset.teachingRole)}`);
    if (asset?.explanationAnchors?.length) {
      lines.push(`- asset explanation anchors: ${asset.explanationAnchors.map(clean).join(", ")}`);
    }
    lines.push("");
  });

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, `${lines.join("\n")}\n`);
  console.log(`Wrote ${path.relative(root, outputPath)}`);
}

main();
