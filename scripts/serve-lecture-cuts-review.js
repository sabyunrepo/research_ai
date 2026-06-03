#!/usr/bin/env node
const { spawnSync } = require("node:child_process");
const fs = require("node:fs");
const http = require("node:http");
const path = require("node:path");
const vm = require("node:vm");

const { createPracticeApp } = require("../practice-harness/src/create-practice-app");
const {
  createPracticeDefinitionStore,
} = require("../practice-harness/src/practice-definition-store");
const {
  createMemoryAttemptStore,
} = require("../practice-harness/src/stores/memory-attempt-store");

const root = path.resolve(__dirname, "..");
const deckRegistryPath = path.join(root, "presentation-decks.json");
const portIndex = process.argv.indexOf("--port");
const port = Number(portIndex >= 0 ? process.argv[portIndex + 1] : process.env.PORT || 8766);
const host = process.env.HOST || "127.0.0.1";
const audienceOnly = process.argv.includes("--audience-only") || process.env.AUDIENCE_ONLY === "1";
let deckSelection = resolveDeckSelection();
const maxBodyBytes = 10 * 1024 * 1024;
const presentationClients = new Set();
const audienceClients = new Set();
const presentationState = {
  index: 0,
  source: "server",
  revision: 0,
  updatedAt: new Date().toISOString(),
};
const practiceApp = createPracticeApp({
  definitionStore: createPracticeDefinitionStore(),
  attemptStore: createMemoryAttemptStore({
    maxAttempts: Number(process.env.PRACTICE_MAX_ATTEMPTS || 10000),
  }),
  judgeProvider: "none",
});

const contentTypes = new Map([
  [".html", "text/html; charset=utf-8"],
  [".css", "text/css; charset=utf-8"],
  [".js", "text/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".md", "text/markdown; charset=utf-8"],
  [".png", "image/png"],
  [".jpg", "image/jpeg"],
  [".jpeg", "image/jpeg"],
  [".svg", "image/svg+xml; charset=utf-8"],
  [".webp", "image/webp"],
]);

function getArgValue(name) {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : "";
}

function readDeckRegistry() {
  if (!fs.existsSync(deckRegistryPath)) {
    return { defaultDeck: "lecture-cuts", decks: [] };
  }
  return JSON.parse(fs.readFileSync(deckRegistryPath, "utf8"));
}

function listDecksAndExit() {
  const registry = readDeckRegistry();
  const decks = Array.isArray(registry.decks) ? registry.decks : [];
  decks.forEach((deck) => {
    const marker = deck.id === registry.defaultDeck ? "*" : " ";
    console.log(`${marker} ${deck.id}\t${deck.root}\t${deck.status || "unknown"}\t${deck.title || ""}`);
  });
  process.exit(0);
}

function normalizeDeckSelection(deck) {
  return {
    ...deck,
    root: path.isAbsolute(deck.root) ? deck.root : path.join(root, deck.root),
  };
}

function findDeckSelection(deckId) {
  const registry = readDeckRegistry();
  const decks = Array.isArray(registry.decks) ? registry.decks : [];
  const deck = decks.find((entry) => entry.id === deckId);
  if (!deck) {
    const known = decks.map((entry) => entry.id).join(", ") || "(none)";
    throw new Error(`Unknown presentation deck: ${deckId}. Known decks: ${known}`);
  }
  if (deck.status && deck.status !== "ready") {
    throw new Error(`Presentation deck is not ready: ${deckId} (${deck.status})`);
  }
  return normalizeDeckSelection(deck);
}

function resolveDeckSelection() {
  if (process.argv.includes("--list-decks")) {
    listDecksAndExit();
  }

  const explicitRoot = getArgValue("--deck-root") || process.env.PRESENTATION_DECK_ROOT || "";
  if (explicitRoot) {
    const resolvedRoot = path.isAbsolute(explicitRoot) ? explicitRoot : path.join(root, explicitRoot);
    return {
      id: path.basename(resolvedRoot),
      title: path.basename(resolvedRoot),
      root: resolvedRoot,
      contract: "custom",
    };
  }

  const registry = readDeckRegistry();
  const deckId = getArgValue("--deck") || process.env.PRESENTATION_DECK || registry.defaultDeck || "lecture-cuts";
  return findDeckSelection(deckId);
}

function getDeckRoot() {
  return deckSelection.root;
}

function getSlidesPath() {
  return path.join(getDeckRoot(), "assets", "slides.js");
}

function runDeckHarnessBuild(deckRoot) {
  const builder = path.join(root, "deck-harness", "scripts", "build-deck-from-spec.js");
  const result = spawnSync(process.execPath, [builder, deckRoot], {
    cwd: root,
    encoding: "utf8",
    maxBuffer: 1024 * 1024 * 8,
  });
  if (result.status !== 0) {
    throw new Error(
      [
        "덱 재생성에 실패했습니다.",
        result.stdout ? `STDOUT:\n${result.stdout}` : "",
        result.stderr ? `STDERR:\n${result.stderr}` : "",
      ].filter(Boolean).join("\n"),
    );
  }
  return `${result.stdout || ""}${result.stderr || ""}`.trim();
}

function validateDeckRoot() {
  const requiredFiles = deckSelection.contract === "deck-harness"
    ? [
        "deck.html",
        "speaker.html",
        "audience.html",
        "presenter-review.html",
        "presentation-script.json",
        path.join("assets", "slides.js"),
        path.join("assets", "style.css"),
        path.join("assets", "deck.js"),
        path.join("assets", "speaker.js"),
        path.join("assets", "audience.js"),
        path.join("assets", "presenter-review.js"),
      ]
    : [
        "deck.html",
        "speaker.html",
        "audience.html",
        "presenter-review.html",
        path.join("assets", "slides.js"),
        path.join("assets", "style.css"),
        path.join("assets", "deck.js"),
        path.join("assets", "speaker.js"),
        path.join("assets", "audience.js"),
      ];
  const deckRoot = getDeckRoot();
  const missing = requiredFiles.filter((file) => !fs.existsSync(path.join(deckRoot, file)));
  if (missing.length) {
    throw new Error(`Presentation deck ${deckSelection.id} is missing runtime files: ${missing.join(", ")}`);
  }
}

validateDeckRoot();

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, { "Content-Type": "application/json; charset=utf-8" });
  response.end(`${JSON.stringify(payload)}\n`);
}

function sendPresentationEvent(client, event, payload) {
  client.write(`event: ${event}\n`);
  client.write(`data: ${JSON.stringify(payload)}\n\n`);
}

function broadcastPresentationState() {
  for (const client of presentationClients) {
    sendPresentationEvent(client, "state", presentationState);
  }
  for (const client of audienceClients) {
    sendPresentationEvent(client, "state", getAudienceState());
  }
}

function readRequestJson(request) {
  return new Promise((resolve, reject) => {
    let bytes = 0;
    let body = "";
    request.setEncoding("utf8");
    request.on("data", (chunk) => {
      bytes += Buffer.byteLength(chunk);
      if (bytes > maxBodyBytes) {
        reject(new Error("요청 본문이 너무 큽니다."));
        request.destroy();
        return;
      }
      body += chunk;
    });
    request.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        reject(new Error("JSON 요청 본문을 해석하지 못했습니다."));
      }
    });
    request.on("error", reject);
  });
}

function loadSlides() {
  const slidesPath = getSlidesPath();
  const code = fs.readFileSync(slidesPath, "utf8");
  const context = { window: {} };
  vm.createContext(context);
  vm.runInContext(code, context, { filename: path.relative(root, slidesPath) });
  if (deckSelection.contract === "deck-harness" && Array.isArray(context.window.DECK_SLIDES)) {
    return context.window.DECK_SLIDES;
  }
  if (!Array.isArray(context.window.LECTURE_SLIDES)) {
    throw new Error("assets/slides.js에서 슬라이드 배열을 찾지 못했습니다.");
  }
  return context.window.LECTURE_SLIDES;
}

function writeSlides(slides) {
  const slidesPath = getSlidesPath();
  fs.writeFileSync(slidesPath, `window.LECTURE_SLIDES = ${JSON.stringify(slides, null, 2)};\n`);
}

function getSlideFile(slide) {
  const file = typeof slide === "string" ? slide : slide.file;
  if (deckSelection.contract === "deck-harness" && file && !file.startsWith("slides/")) {
    return `slides/${file}`;
  }
  return file;
}

function getSlidePath(file) {
  const deckRoot = getDeckRoot();
  const slidePath = path.normalize(path.join(deckRoot, file));
  if (!slidePath.startsWith(deckRoot + path.sep)) {
    throw new Error(`허용되지 않는 슬라이드 경로입니다: ${file}`);
  }
  return slidePath;
}

function extractMainSlide(html) {
  const match = html.match(/<main\b[^>]*class=["'][^"']*\bslide\b[^"']*["'][^>]*>[\s\S]*<\/main>/i);
  return match ? match[0] : "";
}

function extractNoteHtml(slideHtml) {
  const match = slideHtml.match(/<div\b[^>]*class=["'][^"']*\bnote\b[^"']*["'][^>]*>[\s\S]*?<\/div>/i);
  return match ? match[0] : "";
}

function sanitizeAudienceSlide(slideHtml) {
  return slideHtml
    .replace(/<div\b[^>]*class=["'][^"']*\bnote\b[^"']*["'][^>]*>[\s\S]*?<\/div>/gi, "")
    .replace(/<script\b[\s\S]*?<\/script>/gi, "")
    .replace(/<style\b[\s\S]*?<\/style>/gi, "")
    .replace(/\s+on[a-z]+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, "");
}

function getAudienceSlides() {
  const slides = loadSlides();
  const maxIndex = Math.min(presentationState.index, slides.length - 1);
  return slides.slice(0, maxIndex + 1).map((slide, index) => ({
    index,
    file: getSlideFile(slide),
    title: slide.title || slide.reviewTitle || getSlideFile(slide),
    sectionId: slide.sectionId || "",
    sectionTitle: slide.sectionTitle || "",
    sectionStart: Boolean(slide.sectionStart),
    sectionIndex: slide.sectionIndex || 1,
    sectionTotal: slide.sectionTotal || 1,
  }));
}

function sendDeckHarnessAudienceSlide(response, slide, index, slides) {
  const file = getSlideFile(slide);
  const rawHtml = fs.readFileSync(getSlidePath(file), "utf8");
  const audienceStyle = `<style>
    body {
      min-height: 100vh;
      margin: 0;
      display: grid;
      place-items: center;
      overflow: hidden;
      background: #ffffff;
    }
    body > main.slide {
      width: min(100vw, calc(100vh * 16 / 9));
      height: auto;
      aspect-ratio: 16 / 9;
      min-height: 0;
      margin: 0;
      display: grid !important;
      grid-template-columns: 0.92fr 1.08fr !important;
      gap: 32px !important;
    }
    body > main.slide.slide--focus,
    body > main.slide.slide--no-visual.slide--focus,
    body > main.slide.slide--handoff,
    body > main.slide.slide--no-visual.slide--handoff {
      grid-template-columns: 1fr !important;
      place-items: center !important;
      text-align: center !important;
    }
    body > main.slide.slide-template--opening-hero {
      grid-template-columns: minmax(0, .9fr) minmax(300px, 1fr) !important;
      padding: 68px 78px !important;
      place-items: stretch !important;
      text-align: left !important;
    }
    body > main.slide.slide-template--opening-hero .copy {
      align-items: flex-start !important;
      text-align: left !important;
    }
    body > main.slide.slide-template--opening-hero h2 {
      max-width: 690px !important;
      font-size: 62px !important;
      line-height: 1.05 !important;
    }
    body > main.slide .lc-visual {
      grid-column: auto !important;
      grid-row: auto !important;
      justify-self: center !important;
      width: min(100%, 560px) !important;
      min-height: 360px !important;
    }
    body > main.slide::after {
      content: "${String(index + 1).padStart(2, "0")} / ${slides.length}";
      position: absolute;
      right: 18px;
      bottom: 14px;
      color: #5f6368;
      font: 800 14px/1 var(--font-body, ui-sans-serif, system-ui, sans-serif);
    }
  </style>`;
  const glossaryRuntime = [
    '<script defer src="/assets/slides.js"></script>',
    '<script defer src="/assets/glossary-tooltips.js"></script>',
  ].join("\n");
  const safeHtml = rawHtml
    .replace(/<script\b[\s\S]*?<\/script>/gi, "")
    .replace(/href=["']\.\.\/assets\//g, 'href="/assets/')
    .replace(/src=["']\.\.\/assets\//g, 'src="/assets/')
    .replace(/<\/head>/i, `${audienceStyle}\n${glossaryRuntime}\n</head>`);
  response.writeHead(200, {
    "Content-Type": "text/html; charset=utf-8",
    "Cache-Control": "no-store",
  });
  response.end(safeHtml);
}

function getAudienceState() {
  return {
    index: presentationState.index,
    revision: presentationState.revision,
    updatedAt: presentationState.updatedAt,
  };
}

function sendAudienceSlide(response, index) {
  const slides = loadSlides();
  if (!Number.isInteger(index) || index < 0 || index >= slides.length || index > presentationState.index) {
    sendJson(response, 403, { ok: false, error: "아직 공개되지 않은 슬라이드입니다." });
    return;
  }

  const slide = slides[index];
  if (deckSelection.contract === "deck-harness") {
    sendDeckHarnessAudienceSlide(response, slide, index, slides);
    return;
  }
  const file = getSlideFile(slide);
  const rawHtml = fs.readFileSync(getSlidePath(file), "utf8");
  const mainSlide = extractMainSlide(rawHtml);
  if (!mainSlide) {
    sendJson(response, 500, { ok: false, error: `${file}에서 main.slide를 찾지 못했습니다.` });
    return;
  }

  const title = slide.reviewTitle || file;
  const sectionLabel = slide.sectionTitle
    ? slide.sectionStart
      ? `SECTION ${slide.sectionId} · ${slide.sectionTitle}`
      : `${slide.sectionTitle} · ${slide.sectionIndex || 1}/${slide.sectionTotal || 1}`
    : "";
  const safeSlide = sanitizeAudienceSlide(mainSlide);
  const bodyClass = slide.sectionStart ? "is-section-start" : "is-section-detail";
  response.writeHead(200, {
    "Content-Type": "text/html; charset=utf-8",
    "Cache-Control": "no-store",
  });
  response.end(`<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <base href="/">
  <title>${escapeHtml(title)}</title>
  <link rel="stylesheet" href="/assets/style.css">
</head>
<body class="audience-slide-body">
  <article class="deck-frame audience-slide-frame ${bodyClass}" aria-label="${escapeHtml(title)}">
    ${safeSlide}
    <div class="deck-section-label">${escapeHtml(sectionLabel)}</div>
    <div class="deck-slide-number">${String(index + 1).padStart(2, "0")} / ${slides.length}</div>
  </article>
</body>
</html>`);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function preserveNoteHtml(nextSlideHtml, previousSlideHtml) {
  if (extractNoteHtml(nextSlideHtml)) {
    return nextSlideHtml;
  }
  const note = extractNoteHtml(previousSlideHtml);
  if (!note) {
    return nextSlideHtml;
  }
  return nextSlideHtml.replace(/<\/section>/i, `${note}</section>`);
}

function writeSlideHtml(file, nextSlideHtml) {
  const slidePath = getSlidePath(file);
  const currentHtml = fs.readFileSync(slidePath, "utf8");
  const currentSlideHtml = extractMainSlide(currentHtml);
  if (!currentSlideHtml) {
    throw new Error(`${file}에서 main.slide를 찾지 못했습니다.`);
  }
  const slideHtml = preserveNoteHtml(nextSlideHtml, currentSlideHtml);
  fs.writeFileSync(slidePath, currentHtml.replace(currentSlideHtml, slideHtml));
}

function normalizeChange(change) {
  if (!change || typeof change !== "object") {
    throw new Error("변경 항목 형식이 올바르지 않습니다.");
  }
  const file = String(change.file || "").trim();
  const hasScript = Object.prototype.hasOwnProperty.call(change, "heading") || Object.prototype.hasOwnProperty.call(change, "html");
  const hasCues = Object.prototype.hasOwnProperty.call(change, "cues");
  const heading = hasScript ? String(change.heading || "").trim() : undefined;
  const html = hasScript ? String(change.html || "").trim() : undefined;
  const cues = hasCues && change.cues && typeof change.cues === "object"
    ? {
        purpose: String(change.cues.purpose || "").trim(),
      }
    : undefined;
  const slideHtml = Object.prototype.hasOwnProperty.call(change, "slideHtml") ? String(change.slideHtml || "").trim() : undefined;
  if (!/^[\w.-]+\.html$/.test(file)) {
    throw new Error(`허용되지 않는 슬라이드 파일명입니다: ${file}`);
  }
  if (!hasScript && !hasCues && !slideHtml) {
    throw new Error(`${file}에 저장할 변경 내용이 없습니다.`);
  }
  if (hasScript && !heading) {
    throw new Error(`${file}의 스크립트 제목이 비어 있습니다.`);
  }
  if (hasScript && !html) {
    throw new Error(`${file}의 발표 스크립트 본문이 비어 있습니다.`);
  }
  if (heading && heading.length > 240) {
    throw new Error(`${file}의 스크립트 제목이 너무 깁니다.`);
  }
  if (html && html.length > 30000) {
    throw new Error(`${file}의 발표 스크립트 본문이 너무 깁니다.`);
  }
  if (hasCues) {
    const cueTextLength = [
      cues.purpose,
    ].join(" ").length;
    if (cueTextLength > 2000) {
      throw new Error(`${file}의 발표 큐가 너무 깁니다.`);
    }
  }
  if (slideHtml) {
    if (!/^<main\b[^>]*class=["'][^"']*\bslide\b/i.test(slideHtml)) {
      throw new Error(`${file}의 슬라이드 HTML은 main.slide로 시작해야 합니다.`);
    }
    if (/<script\b|<style\b/i.test(slideHtml)) {
      throw new Error(`${file}의 슬라이드 HTML에는 script/style 태그를 저장할 수 없습니다.`);
    }
    if (slideHtml.length > 120000) {
      throw new Error(`${file}의 슬라이드 HTML이 너무 깁니다.`);
    }
  }
  return { file, heading, html, cues, slideHtml, hasScript, hasCues };
}

function regenerateContract() {
  if (deckSelection.contract !== "lecture-cuts") {
    return "";
  }
  const result = spawnSync(process.execPath, ["scripts/export-lecture-cuts-contract.js"], {
    cwd: root,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
  if (result.error) {
    throw result.error;
  }
  if (result.status !== 0) {
    const output = [result.stdout, result.stderr].filter(Boolean).join("\n").trim();
    throw new Error(`slide-spec 재생성 실패${output ? `\n${output}` : ""}`);
  }
  return result.stdout.trim();
}

function writeJson(filePath, data) {
  fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

function normalizeKeywordFlow(value) {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => ({
      label: String(item?.label || "").trim(),
      cue: String(item?.cue || "").trim(),
      say: String(item?.say || "").trim(),
    }))
    .filter((item) => item.label && item.cue && item.say);
}

function normalizeLines(value) {
  if (Array.isArray(value)) {
    return value.map((item) => String(item || "").trim()).filter(Boolean);
  }
  return String(value || "")
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function setScreenArray(screen, key, values) {
  if (!screen || !key) return;
  const current = screen[key];
  if (Array.isArray(current) && current.some((item) => item && typeof item === "object")) {
    screen[key] = values.map((value, index) => {
      const previous = current[index] && typeof current[index] === "object" ? current[index] : {};
      if (Object.prototype.hasOwnProperty.call(previous, "label")) {
        return { ...previous, label: value };
      }
      if (Object.prototype.hasOwnProperty.call(previous, "text")) {
        return { ...previous, text: value };
      }
      return { ...previous, text: value };
    });
    return;
  }
  screen[key] = values;
}

function setScreenBullets(slide, screen, bullets) {
  if (!screen) return;
  const template = slide.mainTemplate || slide.templateRewrite?.selectedTemplate || "";
  const preferredKeyByTemplate = {
    "opening-hero": "promiseBullets",
    "kimai-structure": "imageAnchors",
    "assertion-scene": "evidenceAnchors",
    "workflow-strip": "steps",
    "decision-gate": "criteria",
    "brief-window": "rows",
    "practice-handoff": "actionList",
    "recap-map": "mapNodes",
    "single-concept": "supportingAnchors",
  };
  const preferredKey = preferredKeyByTemplate[template];
  if (preferredKey) {
    setScreenArray(screen, preferredKey, bullets);
    return;
  }
  for (const key of ["anchors", "imageAnchors", "evidenceAnchors", "steps", "criteria", "actionList", "mapNodes", "supportingAnchors"]) {
    if (Array.isArray(screen[key])) {
      setScreenArray(screen, key, bullets);
      return;
    }
  }
  screen.anchors = bullets;
}

function applySlideTextChange(slide, change) {
  let changed = false;
  const setText = (field) => {
    if (!Object.prototype.hasOwnProperty.call(change, field)) return;
    slide[field] = String(change[field] || "").trim();
    changed = true;
  };

  setText("title");
  setText("message");
  setText("bridge");

  if (Object.prototype.hasOwnProperty.call(change, "bullets")) {
    slide.bullets = normalizeLines(change.bullets);
    changed = true;
  }

  if (!changed) return false;

  for (const screen of [slide.rewrittenScreen, slide.templateRewrite?.screenStructure]) {
    if (!screen) continue;
    if (Object.prototype.hasOwnProperty.call(change, "title")) {
      screen.headline = slide.title;
      if (Object.prototype.hasOwnProperty.call(screen, "heroLine")) {
        screen.heroLine = slide.title;
      }
    }
    if (Object.prototype.hasOwnProperty.call(change, "message")) {
      screen.message = slide.message;
    }
    if (Object.prototype.hasOwnProperty.call(change, "bridge")) {
      screen.bridge = slide.bridge;
    }
    if (Object.prototype.hasOwnProperty.call(change, "bullets")) {
      setScreenBullets(slide, screen, slide.bullets || []);
    }
  }

  return true;
}

function markdownKeywordFlow(flow = []) {
  const normalized = normalizeKeywordFlow(flow);
  if (!normalized.length) return ["- 없음"];
  return normalized.map((item) => `- **${item.label}**: ${item.cue} - ${item.say}`);
}

function generatedScriptMarkdown(deckSlug, generatedAt, entries) {
  const lines = [
    `# ${deckSlug} 발표 스크립트`,
    "",
    "목적: 일반인 대상 강의에서 발표자가 슬라이드별로 말할 내용을 실제 원고와 키워드 진행 큐로 확인하고 수정하기 위한 문서.",
    "원천 문서: slide-spec.json",
    "관련 산출물: presentation-script.json, presenter-review.html, deck.html, speaker.html",
    "",
    `Generated: ${generatedAt}`,
    "",
  ];
  for (const entry of entries) {
    lines.push(`## ${entry.index}. ${entry.title}`);
    lines.push("");
    lines.push(`- Slide ID: \`${entry.id}\``);
    lines.push(`- Section: ${entry.section}`);
    lines.push(`- Estimated minutes: ${entry.estimatedMinutes}`);
    lines.push("");
    lines.push("### 발표 원고");
    lines.push("");
    lines.push(entry.script || "");
    lines.push("");
    lines.push("### 키워드 진행 큐");
    lines.push("");
    lines.push(...markdownKeywordFlow(entry.keywordFlow));
    lines.push("");
    lines.push("### 청중에게 던질 질문/행동");
    lines.push("");
    lines.push(entry.interactionPrompt || "");
    lines.push("");
    lines.push("### 다음 장 연결");
    lines.push("");
    lines.push(entry.transition || "");
    lines.push("");
  }
  return `${lines.join("\n")}\n`;
}

async function handleDeckHarnessSave(request, response) {
  try {
    const payload = await readRequestJson(request);
    if (!Array.isArray(payload.slides)) {
      throw new Error("slides 배열이 필요합니다.");
    }
    const deckRoot = getDeckRoot();
    const specPath = path.join(deckRoot, "slide-spec.json");
    const scriptPath = path.join(deckRoot, "presentation-script.json");
    if (!fs.existsSync(specPath)) {
      throw new Error("slide-spec.json을 찾지 못했습니다.");
    }
    if (!fs.existsSync(scriptPath)) {
      throw new Error("presentation-script.json을 찾지 못했습니다.");
    }
    const spec = JSON.parse(fs.readFileSync(specPath, "utf8"));
    const specSlides = Array.isArray(spec.slides) ? spec.slides : [];
    const slideIds = new Set(specSlides.map((slide) => slide.id));
    const specById = new Map(specSlides.map((slide) => [slide.id, slide]));
    const script = JSON.parse(fs.readFileSync(scriptPath, "utf8"));
    const entries = Array.isArray(script.slides) ? script.slides : [];
    const byId = new Map(entries.map((entry) => [entry.id, entry]));
    let saved = 0;
    let savedScripts = 0;
    let savedSlides = 0;
    for (const change of payload.slides) {
      const id = String(change?.id || "").trim();
      if (!slideIds.has(id)) {
        throw new Error(`알 수 없는 슬라이드 id입니다: ${id || "(missing)"}`);
      }
      const specSlide = specById.get(id);
      const entry = byId.get(id);
      let changedScript = false;
      for (const field of ["script", "interactionPrompt", "transition"]) {
        if (Object.prototype.hasOwnProperty.call(change, field)) {
          if (!entry) {
            throw new Error(`발표 스크립트 항목을 찾지 못했습니다: ${id}`);
          }
          entry[field] = String(change[field] || "").trim();
          changedScript = true;
        }
      }
      if (Object.prototype.hasOwnProperty.call(change, "keywordFlow")) {
        if (!entry) {
          throw new Error(`발표 스크립트 항목을 찾지 못했습니다: ${id}`);
        }
        entry.keywordFlow = normalizeKeywordFlow(change.keywordFlow);
        changedScript = true;
      }

      const changedSlide = applySlideTextChange(specSlide, change);
      if (changedSlide && entry) {
        entry.title = specSlide.title;
        entry.transition = specSlide.bridge || entry.transition || "";
        entry.screenAnchors = specSlide.bullets || [];
      }
      if (changedScript) {
        savedScripts += 1;
      }
      if (changedSlide) {
        savedSlides += 1;
      }
      saved += 1;
    }
    let contractOutput = "";
    if (savedSlides > 0) {
      writeJson(specPath, spec);
      contractOutput = runDeckHarnessBuild(deckRoot);
    }
    if (savedScripts > 0 || savedSlides > 0) {
      script.updatedAt = new Date().toISOString();
      writeJson(scriptPath, script);
      fs.writeFileSync(
        path.join(deckRoot, "presentation-script.md"),
        generatedScriptMarkdown(script.deckSlug || deckSelection.id, script.updatedAt, entries),
        "utf8",
      );
    }
    sendJson(response, 200, {
      ok: true,
      saved,
      savedScripts,
      savedCues: 0,
      savedSlides,
      contractOutput,
    });
  } catch (error) {
    sendJson(response, 400, { ok: false, error: error.message });
  }
}

async function handleSave(request, response) {
  if (deckSelection.contract === "deck-harness") {
    await handleDeckHarnessSave(request, response);
    return;
  }
  try {
    const payload = await readRequestJson(request);
    if (!Array.isArray(payload.slides)) {
      throw new Error("slides 배열이 필요합니다.");
    }
    const changes = payload.slides.map(normalizeChange);
    const slides = loadSlides();
    const byFile = new Map(changes.map((change) => [change.file, change]));
    const missing = new Set(byFile.keys());
    let savedScripts = 0;
    let savedCues = 0;
    let savedSlides = 0;

    slides.forEach((slide) => {
      if (!slide || typeof slide !== "object") return;
      const change = byFile.get(slide.file);
      if (!change) return;
      if (change.hasScript) {
        slide.speaker = {
          ...(slide.speaker || {}),
          heading: change.heading,
          html: change.html,
        };
        savedScripts += 1;
      }
      if (change.hasCues) {
        slide.speaker = {
          ...(slide.speaker || {}),
          cues: change.cues,
        };
        savedCues += 1;
      }
      if (change.slideHtml) {
        writeSlideHtml(slide.file, change.slideHtml);
        savedSlides += 1;
      }
      missing.delete(slide.file);
    });

    if (missing.size) {
      throw new Error(`등록되지 않은 슬라이드입니다: ${[...missing].join(", ")}`);
    }

    if (savedScripts > 0 || savedCues > 0 || savedSlides > 0) {
      writeSlides(slides);
      const exportOutput = regenerateContract();
      sendJson(response, 200, {
        ok: true,
        saved: savedScripts + savedCues + savedSlides,
        savedScripts,
        savedCues,
        savedSlides,
        regenerated: Boolean(exportOutput),
        exportOutput,
      });
      return;
    }

    sendJson(response, 200, { ok: true, saved: 0, savedScripts, savedCues, savedSlides, regenerated: false });
  } catch (error) {
    sendJson(response, 400, { ok: false, error: error.message });
  }
}

async function handlePresentationState(request, response) {
  try {
    const payload = await readRequestJson(request);
    const slides = loadSlides();
    const index = Number(payload.index);
    if (!Number.isInteger(index) || index < 0 || index >= slides.length) {
      throw new Error(`슬라이드 index가 범위를 벗어났습니다: ${payload.index}`);
    }

    presentationState.index = index;
    presentationState.source = String(payload.source || "unknown").slice(0, 48);
    presentationState.revision += 1;
    presentationState.updatedAt = new Date().toISOString();
    broadcastPresentationState();
    sendJson(response, 200, { ok: true, ...presentationState });
  } catch (error) {
    sendJson(response, 400, { ok: false, error: error.message });
  }
}

function handleDeckPdfExport(response) {
  if (deckSelection.contract !== "deck-harness") {
    sendJson(response, 400, {
      ok: false,
      error: "PDF export is only available for deck-harness decks.",
    });
    return;
  }

  const deckRoot = getDeckRoot();
  const pdfFile = `${path.basename(deckRoot)}-slides.pdf`;
  const pdfPath = path.join(deckRoot, pdfFile);
  const exporter = path.join(root, "deck-harness", "scripts", "export-deck-pdf.js");
  const result = spawnSync(process.execPath, [exporter, deckRoot, pdfPath], {
    cwd: root,
    encoding: "utf8",
    maxBuffer: 1024 * 1024 * 16,
  });

  if (result.status !== 0) {
    sendJson(response, 500, {
      ok: false,
      error: "PDF export failed.",
      stdout: result.stdout || "",
      stderr: result.stderr || "",
    });
    return;
  }

  sendJson(response, 200, {
    ok: true,
    pdfUrl: `/${pdfFile}`,
    pdfPath,
    output: `${result.stdout || ""}${result.stderr || ""}`.trim(),
  });
}

function handlePresentationEvents(request, response) {
  response.writeHead(200, {
    "Content-Type": "text/event-stream; charset=utf-8",
    "Cache-Control": "no-store, no-transform",
    Connection: "keep-alive",
    "X-Accel-Buffering": "no",
  });
  response.write("\n");
  presentationClients.add(response);
  sendPresentationEvent(response, "state", presentationState);
  request.on("close", () => {
    presentationClients.delete(response);
  });
}

function handleAudienceSlides(request, response) {
  try {
    sendJson(response, 200, {
      ok: true,
      state: getAudienceState(),
      slides: getAudienceSlides(),
    });
  } catch (error) {
    sendJson(response, 500, { ok: false, error: error.message });
  }
}

function handleAudienceEvents(request, response) {
  response.writeHead(200, {
    "Content-Type": "text/event-stream; charset=utf-8",
    "Cache-Control": "no-store, no-transform",
    Connection: "keep-alive",
    "X-Accel-Buffering": "no",
  });
  response.write("\n");
  const client = {
    write(chunk) {
      response.write(chunk);
    },
  };
  const sendState = () => sendPresentationEvent(client, "state", getAudienceState());
  audienceClients.add(client);
  sendState();
  request.on("close", () => {
    audienceClients.delete(client);
  });
}

function isAudienceStaticPath(pathname) {
  if (pathname === "/" || pathname === "/audience.html") return true;
  if (pathname === "/assets/style.css" || pathname === "/assets/audience.js" || pathname === "/assets/glossary.js") return true;
  return /^\/assets\/(?:handdrawn|generated)\/[\w.-]+\.(?:png|jpg|jpeg|svg|webp)$/i.test(pathname);
}

function isPublicAudienceRequest(request) {
  return audienceOnly || Boolean(request.headers["cf-ray"] || request.headers["cf-connecting-ip"]);
}

function getRequestPathname(request) {
  try {
    return new URL(request.url, `http://${request.headers.host || `${host}:${port}`}`)
      .pathname;
  } catch {
    return null;
  }
}

function isPracticeApiPath(pathname) {
  return pathname === "/api/practices" || pathname.startsWith("/api/practices/");
}

function publicDeck(deck) {
  return {
    id: deck.id,
    title: deck.title || deck.id,
    root: deck.root,
    status: deck.status || "unknown",
    notes: deck.notes || "",
    selected: deck.id === deckSelection.id,
    available: (deck.status || "") === "ready",
  };
}

function handleDeckList(response) {
  const registry = readDeckRegistry();
  const decks = Array.isArray(registry.decks) ? registry.decks : [];
  sendJson(response, 200, {
    ok: true,
    currentDeck: deckSelection.id,
    defaultDeck: registry.defaultDeck || "",
    decks: decks.map(publicDeck),
  });
}

async function handleDeckSelect(request, response) {
  try {
    const payload = await readRequestJson(request);
    const deckId = String(payload.deckId || "").trim();
    if (!deckId) {
      throw new Error("deckId가 필요합니다.");
    }
    const nextDeck = findDeckSelection(deckId);
    const previousDeckId = deckSelection.id;
    deckSelection = nextDeck;
    validateDeckRoot();
    presentationState.index = 0;
    presentationState.source = "deck-switch";
    presentationState.revision += 1;
    presentationState.updatedAt = new Date().toISOString();
    broadcastPresentationState();
    sendJson(response, 200, {
      ok: true,
      previousDeckId,
      currentDeck: deckSelection.id,
      state: presentationState,
    });
  } catch (error) {
    sendJson(response, 400, { ok: false, error: error.message });
  }
}

function sendDeckSelector(response) {
  response.writeHead(200, {
    "Content-Type": "text/html; charset=utf-8",
    "Cache-Control": "no-store",
  });
  response.end(`<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Presentation Decks</title>
  <style>
    :root { color-scheme: light; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
    body { margin: 0; background: #f7f5f0; color: #171717; }
    main { width: min(960px, calc(100vw - 40px)); margin: 48px auto; }
    header { display: flex; justify-content: space-between; gap: 24px; align-items: end; margin-bottom: 24px; }
    h1 { margin: 0; font-size: 34px; letter-spacing: 0; }
    p { line-height: 1.6; }
    .actions { display: flex; flex-wrap: wrap; gap: 8px; }
    a, button { border: 1px solid #171717; background: #fffdf7; color: #171717; border-radius: 6px; padding: 10px 14px; font: inherit; text-decoration: none; cursor: pointer; }
    button[disabled] { color: #8a8176; border-color: #c9c1b8; cursor: not-allowed; }
    .deck-list { display: grid; gap: 12px; }
    .deck-card { border: 1px solid #171717; border-radius: 8px; background: #fffdf7; padding: 18px; display: grid; gap: 12px; }
    .deck-card[data-selected="true"] { box-shadow: inset 0 0 0 3px #f4c542; }
    .deck-head { display: flex; justify-content: space-between; gap: 16px; align-items: start; }
    .deck-head h2 { margin: 0; font-size: 22px; letter-spacing: 0; }
    .meta { margin: 0; color: #59524a; font-size: 14px; }
    .status { white-space: nowrap; border: 1px solid #171717; border-radius: 999px; padding: 4px 10px; background: #f4c542; font-size: 13px; }
    .status[data-ready="false"] { background: #eee8dc; color: #6f665f; border-color: #c9c1b8; }
    #status { min-height: 24px; color: #3d332a; }
  </style>
</head>
<body>
  <main>
    <header>
      <div>
        <h1>발표자료 선택</h1>
        <p id="status">등록된 발표자료를 불러오는 중입니다.</p>
      </div>
      <nav class="actions" aria-label="현재 발표 화면">
        <a href="/deck.html">발표 화면</a>
        <a href="/speaker.html">발표자 콘솔</a>
        <a href="/audience.html">청강자 화면</a>
        <a href="/presenter-review.html">검토/수정</a>
      </nav>
    </header>
    <section id="deckList" class="deck-list" aria-label="등록된 발표자료"></section>
  </main>
  <script>
    const deckList = document.querySelector("#deckList");
    const status = document.querySelector("#status");

    async function fetchDecks() {
      const response = await fetch("/api/decks", { cache: "no-store" });
      const payload = await response.json();
      if (!response.ok || !payload.ok) throw new Error(payload.error || "덱 목록을 불러오지 못했습니다.");
      return payload;
    }

    async function selectDeck(deckId) {
      status.textContent = deckId + " 발표자료로 전환하는 중입니다.";
      const response = await fetch("/api/decks/current", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deckId }),
      });
      const payload = await response.json();
      if (!response.ok || !payload.ok) throw new Error(payload.error || "발표자료를 바꾸지 못했습니다.");
      await render();
      status.textContent = deckId + " 발표자료로 전환했습니다. 발표 화면과 발표자 콘솔을 새로고침하세요.";
    }

    function makeCard(deck) {
      const card = document.createElement("article");
      card.className = "deck-card";
      card.dataset.selected = String(deck.selected);
      const readyText = deck.available ? (deck.selected ? "현재 선택됨" : "사용 가능") : "준비 필요";
      card.innerHTML = \`
        <div class="deck-head">
          <div>
            <h2>\${deck.title}</h2>
            <p class="meta">\${deck.id} · \${deck.root}</p>
          </div>
          <span class="status" data-ready="\${deck.available}">\${readyText}</span>
        </div>
        <p class="meta">\${deck.notes || ""}</p>
      \`;
      const actions = document.createElement("div");
      actions.className = "actions";
      const select = document.createElement("button");
      select.type = "button";
      select.textContent = deck.selected ? "선택됨" : "이 덱으로 전환";
      select.disabled = deck.selected || !deck.available;
      select.addEventListener("click", () => selectDeck(deck.id).catch((error) => {
        status.textContent = error.message;
      }));
      actions.append(select);
      card.append(actions);
      return card;
    }

    async function render() {
      const payload = await fetchDecks();
      deckList.replaceChildren(...payload.decks.map(makeCard));
      status.textContent = "현재 선택된 발표자료: " + payload.currentDeck;
    }

    render().catch((error) => {
      status.textContent = error.message;
    });
  </script>
</body>
</html>`);
}

function sendDeckHarnessSpeaker(response) {
  response.writeHead(200, {
    "Content-Type": "text/html; charset=utf-8",
    "Cache-Control": "no-store",
  });
  response.end(`<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(deckSelection.title || deckSelection.id)} 발표자 콘솔</title>
  <link rel="icon" href="data:,">
  <link rel="stylesheet" href="/assets/style.css">
  <script src="/assets/slides.js"></script>
  <style>
    body { margin: 0; background: #f7f5f0; color: #171717; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
    .console { width: min(1520px, calc(100vw - 48px)); margin: 28px auto 56px; display: grid; gap: 18px; }
    .console-header { display: flex; align-items: end; justify-content: space-between; gap: 20px; border-bottom: 1px solid #171717; padding-bottom: 16px; }
    .console-header h1 { margin: 4px 0 0; font-size: 34px; letter-spacing: 0; }
    .console-header p { margin: 0; color: #59524a; font-weight: 800; }
    .actions { display: flex; gap: 8px; flex-wrap: wrap; }
    .actions a, .actions button { border: 1px solid #171717; background: #fffdf7; color: #171717; border-radius: 8px; padding: 10px 14px; font: inherit; font-weight: 900; text-decoration: none; cursor: pointer; }
    .actions button:disabled { color: #8a8176; border-color: #c9c1b8; cursor: not-allowed; }
    .console-grid { display: grid; grid-template-columns: minmax(760px, 1.4fr) minmax(420px, .85fr); gap: 22px; align-items: start; }
    .panel { border: 1px solid #171717; border-radius: 8px; background: #fffdf7; padding: 16px; }
    .slide-frame-wrap { position: relative; width: 100%; aspect-ratio: 16 / 9; overflow: hidden; border: 1px solid #171717; border-radius: 8px; background: #fff; }
    .slide-frame { position: absolute; inset: 0; width: 100%; height: 100%; border: 0; background: #fff; }
    .script { position: sticky; top: 18px; display: grid; gap: 12px; }
    .meta { color: #59524a; font-weight: 900; }
    .script h2 { margin: 0; font-size: 24px; line-height: 1.2; }
    .script-box { border: 1px solid #171717; border-radius: 8px; background: #fff; padding: 14px; font-size: 18px; line-height: 1.62; font-weight: 800; white-space: pre-wrap; }
    .cue { display: grid; gap: 6px; }
    .cue strong { font-size: 14px; }
    .cue p { margin: 0; border: 1px solid #171717; border-radius: 8px; background: #fff; padding: 12px; font-weight: 800; line-height: 1.5; }
    .keyword-flow { display: grid; gap: 8px; }
    .keyword-flow ul { list-style: none; margin: 0; padding: 0; display: grid; gap: 8px; }
    .keyword-flow li { border: 1px solid #171717; border-radius: 8px; background: #fff; padding: 10px 12px; display: grid; gap: 4px; }
    .keyword-flow b { font-size: 13px; }
    .keyword-flow span { font-weight: 900; }
    .keyword-flow small { color: #59524a; font-weight: 800; line-height: 1.35; }
  </style>
</head>
<body>
  <main class="console">
    <header class="console-header">
      <div>
        <p>Speaker Console · ${escapeHtml(deckSelection.id)}</p>
        <h1>발표자 콘솔</h1>
      </div>
      <nav class="actions" aria-label="발표자 콘솔 이동">
        <a href="/">덱 선택</a>
        <a href="/deck.html" target="_blank" rel="noreferrer">발표 화면</a>
        <a href="/audience.html" target="_blank" rel="noreferrer">청강자 화면</a>
        <a href="/presenter-review.html">검토/수정</a>
        <button type="button" id="previous">이전</button>
        <button type="button" id="next">다음</button>
      </nav>
    </header>
    <section class="console-grid">
      <div class="panel">
        <div class="slide-frame-wrap">
          <iframe id="currentFrame" class="slide-frame" title="현재 슬라이드"></iframe>
        </div>
      </div>
      <aside class="panel script">
        <p class="meta" id="counter">-- / --</p>
        <h2 id="title">불러오는 중입니다.</h2>
        <div class="script-box" id="scriptBox"></div>
        <div class="keyword-flow">
          <strong>키워드 진행 큐</strong>
          <ul id="keywordFlow"></ul>
        </div>
        <div class="cue">
          <strong>청중 질문/행동</strong>
          <p id="interaction"></p>
        </div>
        <div class="cue">
          <strong>다음 장 연결</strong>
          <p id="transition"></p>
        </div>
      </aside>
    </section>
  </main>
  <script>
    const slides = window.DECK_SLIDES || [];
    const byId = new Map();
    let active = 0;
    let latestRevision = 0;
    const frame = document.querySelector("#currentFrame");
    const counter = document.querySelector("#counter");
    const title = document.querySelector("#title");
    const scriptBox = document.querySelector("#scriptBox");
    const keywordFlow = document.querySelector("#keywordFlow");
    const interaction = document.querySelector("#interaction");
    const transition = document.querySelector("#transition");
    const previous = document.querySelector("#previous");
    const next = document.querySelector("#next");

    async function loadScripts() {
      const response = await fetch("/presentation-script.json", { cache: "no-store" });
      if (!response.ok) return;
      const payload = await response.json();
      for (const entry of payload.slides || []) byId.set(entry.id, entry);
    }

    async function publish(index) {
      const response = await fetch("/api/presentation/state", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ index, source: "speaker" }),
      });
      const payload = await response.json().catch(() => ({}));
      latestRevision = Math.max(latestRevision, payload.revision || 0);
    }

    function renderKeywordFlow(items = []) {
      keywordFlow.replaceChildren();
      for (const item of items) {
        if (!item || !item.label || !item.cue) continue;
        const row = document.createElement("li");
        const label = document.createElement("b");
        const cue = document.createElement("span");
        const say = document.createElement("small");
        label.textContent = item.label;
        cue.textContent = item.cue;
        say.textContent = item.say || "";
        row.append(label, cue, say);
        keywordFlow.append(row);
      }
    }

    function render(index, options = {}) {
      if (!slides.length) return;
      active = Math.max(0, Math.min(slides.length - 1, index));
      const slide = slides[active];
      const script = byId.get(slide.id) || {};
      frame.src = "/slides/" + slide.file;
      counter.textContent = String(active + 1).padStart(2, "0") + " / " + slides.length;
      title.textContent = slide.title || script.title || slide.id;
      scriptBox.textContent = script.script || slide.speakerNote || "";
      renderKeywordFlow(script.keywordFlow || []);
      interaction.textContent = script.interactionPrompt || "";
      transition.textContent = script.transition || slide.bridge || "";
      previous.disabled = active === 0;
      next.disabled = active === slides.length - 1;
      if (options.publish !== false) publish(active).catch(() => {});
    }

    previous.addEventListener("click", () => render(active - 1));
    next.addEventListener("click", () => render(active + 1));
    window.addEventListener("keydown", (event) => {
      if (event.target?.closest?.("input, textarea, select, [contenteditable='true']")) return;
      if (event.key === "ArrowLeft") render(active - 1);
      if (event.key === "ArrowRight") render(active + 1);
    });
    if (window.EventSource) {
      const events = new EventSource("/api/presentation/events");
      events.addEventListener("state", (event) => {
        const payload = JSON.parse(event.data);
        if ((payload.revision || 0) <= latestRevision) return;
        latestRevision = payload.revision || 0;
        render(payload.index || 0, { publish: false });
      });
    }
    Promise.all([
      loadScripts(),
      fetch("/api/presentation/state", { cache: "no-store" }).then((response) => response.json()).catch(() => ({ index: 0 })),
    ]).then(([, state]) => {
      latestRevision = state.revision || 0;
      render(state.index || 0, { publish: false });
    });
  </script>
</body>
</html>`);
}

function sendDeckHarnessAudience(response) {
  response.writeHead(200, {
    "Content-Type": "text/html; charset=utf-8",
    "Cache-Control": "no-store",
  });
  response.end(`<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(deckSelection.title || deckSelection.id)} 청강자 화면</title>
  <link rel="icon" href="data:,">
  <style>
    body { margin: 0; background: #111; color: #fff; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
    .audience { height: 100vh; display: grid; grid-template-rows: auto 1fr; }
    header { display: flex; justify-content: space-between; align-items: center; gap: 16px; padding: 10px 16px; background: #fffdf7; color: #171717; border-bottom: 1px solid #171717; }
    header strong { font-size: 18px; }
    header a { border: 1px solid #171717; color: #171717; background: #fff; border-radius: 8px; padding: 8px 12px; text-decoration: none; font-weight: 900; }
    iframe { width: 100%; height: 100%; border: 0; background: #fff; }
  </style>
</head>
<body>
  <main class="audience">
    <header>
      <strong id="status">청강자 화면</strong>
      <a href="/">덱 선택</a>
    </header>
    <iframe id="frame" title="현재 공개 슬라이드"></iframe>
  </main>
  <script>
    const frame = document.querySelector("#frame");
    const status = document.querySelector("#status");
    let latestRevision = 0;
    function show(index) {
      frame.src = "/api/audience/slide/" + index;
      status.textContent = "청강자 화면 · " + String(index + 1).padStart(2, "0");
    }
    fetch("/api/presentation/state", { cache: "no-store" })
      .then((response) => response.json())
      .then((state) => {
        latestRevision = state.revision || 0;
        show(state.index || 0);
      })
      .catch(() => show(0));
    if (window.EventSource) {
      const events = new EventSource("/api/audience/events");
      events.addEventListener("state", (event) => {
        const payload = JSON.parse(event.data);
        if ((payload.revision || 0) <= latestRevision) return;
        latestRevision = payload.revision || 0;
        show(payload.index || 0);
      });
    }
  </script>
</body>
</html>`);
}

function sendText(response, statusCode, message) {
  response.writeHead(statusCode, { "Content-Type": "text/plain; charset=utf-8" });
  response.end(`${message}\n`);
}

function serveStatic(request, response, publicAudienceOnly = isPublicAudienceRequest(request)) {
  const url = new URL(request.url, `http://${request.headers.host || `${host}:${port}`}`);
  let rawPathname;
  try {
    rawPathname = decodeURIComponent(url.pathname);
  } catch {
    sendText(response, 400, "Bad request");
    return;
  }
  if (publicAudienceOnly && !isAudienceStaticPath(rawPathname)) {
    sendText(response, 404, "Not found");
    return;
  }
  const pathname = rawPathname === "/" ? (publicAudienceOnly ? "/audience.html" : "/index.html") : rawPathname;
  if (deckSelection.contract === "deck-harness") {
    if (pathname === "/speaker.html" && !fs.existsSync(path.join(getDeckRoot(), "speaker.html"))) {
      sendDeckHarnessSpeaker(response);
      return;
    }
    if (pathname === "/audience.html" && !fs.existsSync(path.join(getDeckRoot(), "audience.html"))) {
      sendDeckHarnessAudience(response);
      return;
    }
  }
  const deckRoot = getDeckRoot();
  const requestedPath = path.normalize(path.join(deckRoot, pathname));

  if (!requestedPath.startsWith(deckRoot + path.sep) && requestedPath !== deckRoot) {
    sendText(response, 403, "Forbidden");
    return;
  }

  fs.readFile(requestedPath, (error, data) => {
    if (error) {
      sendText(
        response,
        error.code === "ENOENT" ? 404 : 500,
        error.code === "ENOENT" ? "Not found" : error.message,
      );
      return;
    }
    response.writeHead(200, {
      "Content-Type": contentTypes.get(path.extname(requestedPath).toLowerCase()) || "application/octet-stream",
      "Cache-Control": "no-store",
    });
    response.end(data);
  });
}

const server = http.createServer((request, response) => {
  const publicAudienceOnly = isPublicAudienceRequest(request);
  const pathname = getRequestPathname(request);
  if (!pathname) {
    sendText(response, 400, "Bad request");
    return;
  }
  if (isPracticeApiPath(pathname)) {
    practiceApp(request, response);
    return;
  }
  if (!publicAudienceOnly && request.method === "GET" && pathname === "/") {
    sendDeckSelector(response);
    return;
  }
  if (!publicAudienceOnly && request.method === "GET" && pathname === "/api/decks") {
    handleDeckList(response);
    return;
  }
  if (!publicAudienceOnly && request.method === "POST" && pathname === "/api/decks/current") {
    handleDeckSelect(request, response);
    return;
  }
  if (request.method === "GET" && pathname === "/api/audience/slides") {
    handleAudienceSlides(request, response);
    return;
  }
  if (request.method === "GET" && pathname === "/api/audience/events") {
    handleAudienceEvents(request, response);
    return;
  }
  if (request.method === "GET" && pathname.startsWith("/api/audience/slide/")) {
    const index = Number(pathname.split("/").pop());
    sendAudienceSlide(response, index);
    return;
  }
  if (publicAudienceOnly) {
    if (request.method === "GET" || request.method === "HEAD") {
      serveStatic(request, response, publicAudienceOnly);
      return;
    }
    sendText(response, 405, "Method not allowed");
    return;
  }
  if (request.method === "GET" && pathname === "/api/presentation/state") {
    sendJson(response, 200, { ok: true, ...presentationState });
    return;
  }
  if (request.method === "GET" && pathname === "/api/presentation/events") {
    handlePresentationEvents(request, response);
    return;
  }
  if (request.method === "POST" && pathname === "/api/presentation/state") {
    handlePresentationState(request, response);
    return;
  }
  if (request.method === "POST" && pathname === "/api/deck/export-pdf") {
    handleDeckPdfExport(response);
    return;
  }
  if (request.method === "POST" && pathname === "/api/presenter-review/save") {
    handleSave(request, response);
    return;
  }
  if (request.method === "GET" || request.method === "HEAD") {
    serveStatic(request, response, publicAudienceOnly);
    return;
  }
  sendText(response, 405, "Method not allowed");
});

server.listen(port, host, () => {
  const address = server.address();
  const actualPort = typeof address === "object" && address ? address.port : port;
  console.log(`Presentation deck: ${deckSelection.id} (${path.relative(root, getDeckRoot()) || "."})`);
  console.log(`Deck selector: http://${host}:${actualPort}/`);
  console.log(`Presenter review server: http://${host}:${actualPort}/presenter-review.html`);
  console.log(`Speaker console: http://${host}:${actualPort}/speaker.html`);
  console.log(`Stage deck: http://${host}:${actualPort}/deck.html`);
  console.log(`Audience page: http://${host}:${actualPort}/audience.html${audienceOnly ? " (audience-only)" : ""}`);
});
