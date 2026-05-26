#!/usr/bin/env node
const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = path.resolve(__dirname, "..");
const deckRoot = path.join(root, "lecture-cuts");
const harnessRoot = path.join(root, "docs", "harness");
const slideSpecPath = path.join(deckRoot, "slide-spec.json");
const inventoryPath = path.join(harnessRoot, "lecture-cuts-content-inventory.md");
const sourceMapPath = path.join(harnessRoot, "lecture-cuts-source-map.json");
const slideHtmlCachePath = path.join(deckRoot, "assets", "slide-html.js");

function readText(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

function writeText(filePath, text) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, text);
}

function rel(filePath) {
  return path.relative(root, filePath).split(path.sep).join("/");
}

function deckRel(fileName) {
  return `lecture-cuts/${fileName}`;
}

function stableJson(data) {
  return `${JSON.stringify(data, null, 2)}\n`;
}

function decodeEntities(value) {
  return value
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCodePoint(parseInt(code, 16)));
}

function textFromHtml(html) {
  return decodeEntities(
    html
      .replace(/<script\b[\s\S]*?<\/script>/gi, "")
      .replace(/<style\b[\s\S]*?<\/style>/gi, "")
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/p>/gi, "\n")
      .replace(/<\/li>/gi, "\n")
      .replace(/<[^>]+>/g, " ")
      .replace(/[ \t\r\f\v]+/g, " ")
      .replace(/\n\s+/g, "\n")
      .replace(/\s+\n/g, "\n")
      .trim()
  );
}

function oneLine(value) {
  return value.replace(/\s+/g, " ").trim();
}

function extractTitleTag(html) {
  const match = html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i);
  return match ? oneLine(textFromHtml(match[1])) : "";
}

function extractFirstTag(html, tagName) {
  const match = html.match(new RegExp(`<${tagName}\\b[^>]*>([\\s\\S]*?)<\\/${tagName}>`, "i"));
  return match ? oneLine(textFromHtml(match[1])) : "";
}

function extractByClass(html, tagName, className) {
  const pattern = new RegExp(
    `<${tagName}\\b[^>]*class=["'][^"']*\\b${className}\\b[^"']*["'][^>]*>([\\s\\S]*?)<\\/${tagName}>`,
    "i"
  );
  const match = html.match(pattern);
  return match ? match[1] : "";
}

function extractMainSlideHtml(html, file) {
  const match = html.match(/<main\b[^>]*class=["'][^"']*\bslide\b[^"']*["'][^>]*>[\s\S]*<\/main>/i);
  if (!match) {
    throw new Error(`${file} does not include main.slide`);
  }
  return match[0];
}

function extractListItems(html, className) {
  const block = extractByClass(html, "ul", className);
  if (!block) {
    return [];
  }
  return Array.from(block.matchAll(/<li\b[^>]*>([\s\S]*?)<\/li>/gi))
    .map((match) => oneLine(textFromHtml(match[1])))
    .filter(Boolean);
}

function extractLocalRefs(html) {
  const refs = [];
  const attrPattern = /\b(?:href|src)=["']([^"']+)["']/g;
  const cssPattern = /url\(["']?([^"')]+)["']?\)/g;
  for (const pattern of [attrPattern, cssPattern]) {
    let match;
    while ((match = pattern.exec(html))) {
      const value = match[1].trim();
      if (!value || value.startsWith("#") || /^(https?:|mailto:|tel:|data:|javascript:)/.test(value)) {
        continue;
      }
      refs.push(value.split("#")[0].split("?")[0]);
    }
  }
  return [...new Set(refs)].sort();
}

function sha256(text) {
  return `sha256:${crypto.createHash("sha256").update(text).digest("hex")}`;
}

function loadSlides() {
  const registryPath = path.join(deckRoot, "assets", "slides.js");
  const code = readText(registryPath);
  const context = { window: {} };
  vm.createContext(context);
  vm.runInContext(code, context, { filename: rel(registryPath) });
  const slides = context.window.LECTURE_SLIDES;
  if (!Array.isArray(slides) || slides.length === 0) {
    throw new Error("window.LECTURE_SLIDES must be a non-empty array");
  }
  return slides.map((slide) => (typeof slide === "string" ? { file: slide } : slide));
}

function parsePreviewCuts() {
  const previewPath = path.join(deckRoot, "presenter-preview.html");
  if (!fs.existsSync(previewPath)) {
    return {};
  }
  const html = readText(previewPath);
  const cuts = {};
  const sectionPattern =
    /<section\b[^>]*class=["'][^"']*\bpreview-cut\b[^"']*["'][^>]*id=["']cut-([^"']+)["'][^>]*>([\s\S]*?)<\/section>/gi;
  let match;
  while ((match = sectionPattern.exec(html))) {
    const parent = match[1];
    const body = match[2];
    const scriptHtml = extractByClass(body, "div", "script-full");
    cuts[parent] = {
      parent,
      title: extractFirstTag(body, "h2"),
      subtitle: oneLine(textFromHtml(extractByClass(body, "p", "subtitle"))),
      scriptHtml,
      scriptText: textFromHtml(scriptHtml),
      sourceFile: "lecture-cuts/presenter-preview.html",
      sourceAnchor: `cut-${parent}`,
    };
  }
  return cuts;
}

function parseSourcePage() {
  const sourcePath = path.join(deckRoot, "sources.html");
  if (!fs.existsSync(sourcePath)) {
    return [];
  }
  const html = readText(sourcePath);
  return Array.from(html.matchAll(/<article\b[^>]*class=["'][^"']*\bsource-card\b[^"']*["'][^>]*>([\s\S]*?)<\/article>/gi)).map(
    (articleMatch, index) => {
      const body = articleMatch[1];
      const links = Array.from(body.matchAll(/<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)).map((linkMatch) => ({
        label: oneLine(textFromHtml(linkMatch[2])) || linkMatch[1],
        url: linkMatch[1],
      }));
      return {
        index: index + 1,
        label: oneLine(textFromHtml(extractFirstTag(body, "strong"))),
        description: oneLine(textFromHtml(extractFirstTag(body, "p"))),
        links,
        sourceFile: "lecture-cuts/sources.html",
      };
    }
  );
}

function normalizeSources(slide, globalSources) {
  if (Array.isArray(slide.sources) && slide.sources.length > 0) {
    return slide.sources.map((source) => {
      if (typeof source === "string") {
        return { label: source, url: source, sourceScope: "slide" };
      }
      return { ...source, sourceScope: "slide" };
    });
  }
  return globalSources.map((source) => ({
    label: source.label,
    url: source.links.length === 1 ? source.links[0].url : undefined,
    links: source.links,
    sourceScope: "deck-global",
  }));
}

function resolveTitle(slide, html, file) {
  const h2 = extractFirstTag(html, "h2");
  if (h2) {
    return { value: h2, source: `${deckRel(file)}:<h2>`, confidence: "high" };
  }
  const h1 = extractFirstTag(html, "h1");
  if (h1) {
    return { value: h1, source: `${deckRel(file)}:<h1>`, confidence: "high" };
  }
  const title = extractTitleTag(html);
  if (title) {
    return { value: title, source: `${deckRel(file)}:<title>`, confidence: "medium" };
  }
  if (slide.reviewTitle) {
    return { value: slide.reviewTitle, source: "lecture-cuts/assets/slides.js:reviewTitle", confidence: "medium" };
  }
  return { value: path.basename(file, ".html"), source: `${deckRel(file)}:filename`, confidence: "low" };
}

function resolveSubtitle(html, file) {
  const subtitle = oneLine(textFromHtml(extractByClass(html, "p", "subtitle")));
  if (subtitle) {
    return { value: subtitle, source: `${deckRel(file)}:<p.subtitle>`, confidence: "high" };
  }
  return { value: "", source: `${deckRel(file)}:no p.subtitle`, confidence: "high" };
}

function resolveBullets(html, file) {
  const bullets = extractListItems(html, "bullets");
  if (bullets.length) {
    return { value: bullets, source: `${deckRel(file)}:<ul.bullets>`, confidence: "high" };
  }
  return { value: [], source: `${deckRel(file)}:no ul.bullets`, confidence: "high" };
}

function resolveNote(html, file) {
  const noteHtml = extractByClass(html, "div", "note");
  if (noteHtml) {
    return {
      value: { present: true, text: oneLine(textFromHtml(noteHtml)) },
      source: `${deckRel(file)}:<div.note>`,
      confidence: "high",
    };
  }
  return { value: { present: false, text: "" }, source: `${deckRel(file)}:no div.note`, confidence: "high" };
}

function resolveSpeaker(slide, previewCuts) {
  if (slide.speaker && (slide.speaker.html || slide.speaker.heading)) {
    return {
      value: {
        source: "inline",
        heading: slide.speaker.heading || slide.reviewTitle || "",
        html: slide.speaker.html || "",
        text: textFromHtml(slide.speaker.html || ""),
        cues: slide.speaker.cues || null,
        sourceFile: "lecture-cuts/assets/slides.js",
      },
      source: "lecture-cuts/assets/slides.js:speaker",
      confidence: "high",
    };
  }
  const parentCut = previewCuts[slide.parent];
  if (parentCut && parentCut.scriptText) {
    return {
      value: {
        source: "presenter-preview",
        heading: parentCut.title || slide.reviewTitle || "",
        html: parentCut.scriptHtml,
        text: parentCut.scriptText,
        sourceFile: parentCut.sourceFile,
        sourceAnchor: parentCut.sourceAnchor,
      },
      source: `${parentCut.sourceFile}#${parentCut.sourceAnchor}`,
      confidence: "medium",
    };
  }
  return {
    value: {
      source: "missing",
      heading: "",
      html: "",
      text: "",
      sourceFile: "",
    },
    source: "missing",
    confidence: "low",
  };
}

function resolveSection(slide) {
  if (slide.sectionTitle) {
    return {
      value: {
        id: slide.sectionId || "",
        title: slide.sectionTitle,
        index: slide.sectionIndex || null,
        total: slide.sectionTotal || null,
        isStart: Boolean(slide.sectionStart),
      },
      source: "lecture-cuts/assets/slides.js:section*",
      confidence: "high",
    };
  }
  return {
    value: {
      id: slide.parent || "",
      title: slide.parent ? `Parent ${slide.parent}` : "",
      index: null,
      total: null,
      isStart: false,
    },
    source: "lecture-cuts/assets/slides.js:parent",
    confidence: "medium",
  };
}

function buildSlideContract(slide, index, previewCuts, globalSources) {
  const htmlPath = path.join(deckRoot, slide.file);
  if (!fs.existsSync(htmlPath)) {
    throw new Error(`registered slide is missing: ${slide.file}`);
  }

  const html = readText(htmlPath);
  const id = path.basename(slide.file, ".html");
  const title = resolveTitle(slide, html, slide.file);
  const subtitle = resolveSubtitle(html, slide.file);
  const bullets = resolveBullets(html, slide.file);
  const note = resolveNote(html, slide.file);
  const speaker = resolveSpeaker(slide, previewCuts);
  const section = resolveSection(slide);
  const sources = normalizeSources(slide, globalSources);
  const sourceConfidence = Array.isArray(slide.sources) && slide.sources.length > 0 ? "high" : "medium";
  const sourceFile = deckRel(slide.file);

  return {
    index: index + 1,
    id,
    file: slide.file,
    sourceFile,
    parent: slide.parent || "",
    kind: slide.kind || "",
    reviewTitle: slide.reviewTitle || "",
    section: section.value,
    title: title.value,
    subtitle: subtitle.value,
    bullets: bullets.value,
    note: note.value,
    mediaRefs: extractLocalRefs(html).filter((ref) => !ref.endsWith(".html") && ref !== "assets/style.css"),
    speaker: speaker.value,
    speakerSource: speaker.value.source,
    sources,
    contentHash: sha256(html),
    fieldSources: {
      file: "lecture-cuts/assets/slides.js:file",
      section: section.source,
      title: title.source,
      subtitle: subtitle.source,
      bullets: bullets.source,
      note: note.source,
      mediaRefs: `${sourceFile}:href/src/url references`,
      speaker: speaker.source,
      sources: Array.isArray(slide.sources) && slide.sources.length > 0 ? "lecture-cuts/assets/slides.js:sources" : "lecture-cuts/sources.html:deck-global",
      contentHash: sourceFile,
    },
    fieldConfidence: {
      file: "high",
      section: section.confidence,
      title: title.confidence,
      subtitle: subtitle.confidence,
      bullets: bullets.confidence,
      note: note.confidence,
      mediaRefs: "high",
      speaker: speaker.confidence,
      sources: sourceConfidence,
      contentHash: "high",
    },
  };
}

function summarizeBy(items, keyFn) {
  return items.reduce((acc, item) => {
    const key = keyFn(item) || "(empty)";
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
}

function buildInventory(spec) {
  const speakerSummary = summarizeBy(spec.slides, (slide) => slide.speakerSource);
  const sectionSummary = summarizeBy(spec.slides, (slide) => slide.section.title);
  const lowConfidence = collectLowConfidence(spec);
  const slideSpecificSources = spec.slides.filter((slide) => slide.sources.some((source) => source.sourceScope === "slide")).length;
  const missingNotes = spec.slides.filter((slide) => !slide.note.present);
  const noBullets = spec.slides.filter((slide) => slide.bullets.length === 0);

  const lines = [
    "# lecture-cuts content inventory",
    "",
    "이 파일은 `scripts/export-lecture-cuts-contract.js`가 현재 `lecture-cuts/` 덱에서 추출한 재현 기준입니다.",
    "다른 주제로 발표자료를 만들 때 이 덱의 구조, 필드 출처, 검증 기준을 golden reference로 사용합니다.",
    "",
    "## Summary",
    "",
    `- Slide count: ${spec.slides.length}`,
    `- Registry: ${spec.registryFile}`,
    `- Source contract: ${spec.outputFiles.slideSpec}`,
    `- Source map: ${spec.outputFiles.sourceMap}`,
    `- Slide-specific source annotations: ${slideSpecificSources}`,
    `- Deck-global source references: ${spec.sourcePageLinks.length}`,
    "",
    "## Section Counts",
    "",
    ...Object.entries(sectionSummary).map(([section, count]) => `- ${section}: ${count}`),
    "",
    "## Speaker Source Counts",
    "",
    ...Object.entries(speakerSummary).map(([source, count]) => `- ${source}: ${count}`),
    "",
    "## Optional Field Coverage",
    "",
    `- Slides without bullet list: ${noBullets.length}`,
    `- Slides without inline note block: ${missingNotes.length}`,
    "",
    "## Extraction Confidence",
    "",
    lowConfidence.length
      ? `Low-confidence fields found: ${lowConfidence.length}`
      : "No low-confidence fields. `node scripts/export-lecture-cuts-contract.js --check-confidence` should pass.",
    "",
  ];

  if (lowConfidence.length) {
    lines.push(
      ...lowConfidence.slice(0, 100).map((item) => `- ${item.slideId}.${item.field}: ${item.source}`),
      "",
      "Low-confidence 항목은 다음 에이전트 단계에서 사람이 확인하거나 원천 파일을 보강해야 합니다.",
      ""
    );
  }

  lines.push(
    "## Slide Index",
    "",
    "| # | id | title | section | speaker | sources | hash |",
    "|---:|---|---|---|---|---:|---|",
    ...spec.slides.map((slide) => {
      const title = slide.title.replace(/\|/g, "\\|");
      const section = slide.section.title.replace(/\|/g, "\\|");
      return `| ${slide.index} | \`${slide.id}\` | ${title} | ${section} | ${slide.speakerSource} | ${slide.sources.length} | \`${slide.contentHash.slice(0, 19)}...\` |`;
    }),
    ""
  );

  return `${lines.join("\n")}\n`;
}

function buildSourceMap(spec) {
  return {
    schemaVersion: 1,
    deck: spec.deck,
    registryFile: spec.registryFile,
    presenterPreviewFile: spec.presenterPreviewFile,
    sourcesFile: spec.sourcesFile,
    outputFiles: spec.outputFiles,
    slideCount: spec.slides.length,
    sourcePageLinks: spec.sourcePageLinks,
    slides: spec.slides.map((slide) => ({
      id: slide.id,
      file: slide.file,
      sourceFile: slide.sourceFile,
      parent: slide.parent,
      section: slide.section,
      title: slide.title,
      speakerSource: slide.speakerSource,
      speakerSourceFile: slide.speaker.sourceFile,
      speakerSourceAnchor: slide.speaker.sourceAnchor || "",
      sources: slide.sources,
      contentHash: slide.contentHash,
      fieldSources: slide.fieldSources,
      fieldConfidence: slide.fieldConfidence,
    })),
  };
}

function collectLowConfidence(spec) {
  return spec.slides.flatMap((slide) =>
    Object.entries(slide.fieldConfidence)
      .filter(([, confidence]) => confidence === "low")
      .map(([field]) => ({
        slideId: slide.id,
        file: slide.file,
        field,
        source: slide.fieldSources[field] || "",
      }))
  );
}

function exportContract() {
  const slides = loadSlides();
  const previewCuts = parsePreviewCuts();
  const sourcePageLinks = parseSourcePage();
  const spec = {
    schemaVersion: 1,
    generatedBy: "scripts/export-lecture-cuts-contract.js",
    deck: "lecture-cuts",
    registryFile: "lecture-cuts/assets/slides.js",
    presenterPreviewFile: "lecture-cuts/presenter-preview.html",
    sourcesFile: "lecture-cuts/sources.html",
    outputFiles: {
      slideSpec: "lecture-cuts/slide-spec.json",
      contentInventory: "docs/harness/lecture-cuts-content-inventory.md",
      sourceMap: "docs/harness/lecture-cuts-source-map.json",
      slideHtmlCache: "lecture-cuts/assets/slide-html.js",
    },
    sourcePageLinks,
    slides: slides.map((slide, index) => buildSlideContract(slide, index, previewCuts, sourcePageLinks)),
  };

  writeText(slideSpecPath, stableJson(spec));
  writeText(sourceMapPath, stableJson(buildSourceMap(spec)));
  writeText(inventoryPath, buildInventory(spec));
  writeText(
    slideHtmlCachePath,
    `window.LECTURE_SLIDE_HTML = ${stableJson(
      Object.fromEntries(slides.map((slide) => [slide.file, extractMainSlideHtml(readText(path.join(deckRoot, slide.file)), slide.file)]))
    )};`
  );

  console.log(`Wrote ${rel(slideSpecPath)}`);
  console.log(`Wrote ${rel(sourceMapPath)}`);
  console.log(`Wrote ${rel(inventoryPath)}`);
  console.log(`Wrote ${rel(slideHtmlCachePath)}`);
  console.log(`Slides exported: ${spec.slides.length}`);
  console.log(`Low-confidence fields: ${collectLowConfidence(spec).length}`);
}

function checkConfidence() {
  if (!fs.existsSync(slideSpecPath)) {
    throw new Error("lecture-cuts/slide-spec.json does not exist. Run the exporter first.");
  }
  const spec = JSON.parse(readText(slideSpecPath));
  const lows = collectLowConfidence(spec);
  if (spec.slides.length !== 56) {
    console.error(`FAIL expected 56 slides, found ${spec.slides.length}`);
    process.exit(1);
  }
  if (lows.length) {
    console.error(`FAIL low-confidence fields found: ${lows.length}`);
    lows.slice(0, 50).forEach((item) => {
      console.error(`- ${item.slideId}.${item.field}: ${item.source}`);
    });
    process.exit(1);
  }
  console.log("PASS extraction confidence");
  console.log(`Slides checked: ${spec.slides.length}`);
}

function main() {
  if (process.argv.includes("--check-confidence")) {
    checkConfidence();
    return;
  }
  exportContract();
}

main();
