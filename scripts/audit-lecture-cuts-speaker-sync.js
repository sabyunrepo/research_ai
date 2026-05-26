#!/usr/bin/env node
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = path.resolve(__dirname, "..");
const deckRoot = path.join(root, "lecture-cuts");
const genericPhrase = "이 슬라이드는 한 번에 설명하려던 내용을 짧은 증거 화면으로 나눈 것입니다";

const sourceSensitiveTerms = [
  { label: "Hook", slide: /\bHook\b|후크|훅/i, speaker: /\bHook\b|후크|훅|검문소|이벤트/i },
  { label: "MCP", slide: /\bMCP\b|Model Context Protocol/i, speaker: /\bMCP\b|Model Context Protocol|도구|resources|prompts|서버|client|host/i },
  { label: "Skill", slide: /\bSkill\b|스킬/i, speaker: /\bSkill\b|스킬|절차|매뉴얼/i },
  { label: "Subagent", slide: /\bSubagent\b|서브에이전트|agent/i, speaker: /\bSubagent\b|서브에이전트|agent|에이전트|컨텍스트/i },
  { label: "Evaluation", slide: /\bEvaluation\b|평가|검증/i, speaker: /\bEvaluation\b|평가|검증|rubric|통과/i },
  { label: "CLAUDE.md", slide: /CLAUDE\.md/i, speaker: /CLAUDE\.md|프로젝트 기억|항상 켜진 기억|프로젝트 지침|프로젝트 규칙|계층/i },
  { label: "permission", slide: /permission|권한/i, speaker: /permission|권한|읽기|쓰기|승인/i },
];

const results = [];

function record(level, name, detail = "") {
  results.push({ level, name, detail });
}

function pass(name, detail = "") {
  record("PASS", name, detail);
}

function warn(name, detail = "") {
  record("WARN", name, detail);
}

function fail(name, detail = "") {
  record("FAIL", name, detail);
}

function readDeckFile(relativePath) {
  return fs.readFileSync(path.join(deckRoot, relativePath), "utf8");
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

function textFromHtml(html = "") {
  return decodeEntities(
    html
      .replace(/<script\b[\s\S]*?<\/script>/gi, "")
      .replace(/<style\b[\s\S]*?<\/style>/gi, "")
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/p>/gi, "\n")
      .replace(/<\/li>/gi, "\n")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim()
  );
}

function extractByClass(html, tagName, className) {
  const pattern = new RegExp(
    `<${tagName}\\b[^>]*class=["'][^"']*\\b${className}\\b[^"']*["'][^>]*>([\\s\\S]*?)<\\/${tagName}>`,
    "i"
  );
  const match = html.match(pattern);
  return match ? match[1] : "";
}

function extractFirstTag(html, tagName) {
  const match = html.match(new RegExp(`<${tagName}\\b[^>]*>([\\s\\S]*?)<\\/${tagName}>`, "i"));
  return match ? textFromHtml(match[1]) : "";
}

function loadSlides() {
  const code = readDeckFile("assets/slides.js");
  const context = { window: {} };
  vm.createContext(context);
  vm.runInContext(code, context, { filename: "lecture-cuts/assets/slides.js" });
  if (!Array.isArray(context.window.LECTURE_SLIDES)) {
    throw new Error("window.LECTURE_SLIDES must be an array");
  }
  return context.window.LECTURE_SLIDES;
}

function parsePreviewScripts() {
  const previewPath = path.join(deckRoot, "presenter-preview.html");
  if (!fs.existsSync(previewPath)) {
    return {};
  }
  const html = fs.readFileSync(previewPath, "utf8");
  const scripts = {};
  const sectionPattern =
    /<section\b[^>]*class=["'][^"']*\bpreview-cut\b[^"']*["'][^>]*id=["']cut-([^"']+)["'][^>]*>([\s\S]*?)<\/section>/gi;
  let match;
  while ((match = sectionPattern.exec(html))) {
    const parent = match[1];
    scripts[parent] = textFromHtml(extractByClass(match[2], "div", "script-full"));
  }
  return scripts;
}

function slideTextFor(slide) {
  const html = readDeckFile(slide.file);
  const title = extractFirstTag(html, "h2") || extractFirstTag(html, "h1");
  const subtitle = textFromHtml(extractByClass(html, "p", "subtitle"));
  const note = textFromHtml(extractByClass(html, "div", "note"));
  const body = textFromHtml(html);
  return { title, subtitle, note, body };
}

function main() {
  const slides = loadSlides();
  const previewScripts = parsePreviewScripts();
  const missing = [];
  const fallback = [];
  const generic = [];
  const termMismatches = [];

  slides.forEach((slide) => {
    const slideText = slideTextFor(slide);
    const inlineSpeaker = slide.speaker ? textFromHtml(slide.speaker.html || "") : "";
    const fallbackSpeaker = slide.parent ? previewScripts[slide.parent] || "" : "";
    const speakerText = inlineSpeaker || fallbackSpeaker;

    if (!speakerText) {
      missing.push(slide.file);
      return;
    }
    if (!inlineSpeaker) {
      fallback.push(slide.file);
    }
    if (speakerText.includes(genericPhrase)) {
      generic.push(slide.file);
    }

    const combinedSlideText = `${slideText.title} ${slideText.subtitle} ${slideText.note} ${slideText.body}`;
    sourceSensitiveTerms.forEach((term) => {
      if (term.slide.test(combinedSlideText) && !term.speaker.test(speakerText)) {
        termMismatches.push(`${slide.file}:${term.label}`);
      }
    });
  });

  if (missing.length) {
    fail("missing presenter scripts", `${missing.length}: ${missing.join(", ")}`);
  } else {
    pass("presenter script resolution", `${slides.length} slides resolved`);
  }

  if (fallback.length) {
    warn("presenter-preview fallback scripts", `${fallback.length}: ${fallback.join(", ")}`);
  } else {
    pass("presenter-preview fallback scripts", "0");
  }

  if (generic.length) {
    warn("generic presenter scripts", `${generic.length}: ${generic.join(", ")}`);
  } else {
    pass("generic presenter scripts", "0");
  }

  if (termMismatches.length) {
    warn("source-sensitive term mismatches", `${termMismatches.length}: ${termMismatches.slice(0, 50).join(", ")}`);
  } else {
    pass("source-sensitive term mismatches", "0");
  }

  results.forEach((result) => {
    console.log(`${result.level} ${result.name}${result.detail ? ` - ${result.detail}` : ""}`);
  });

  if (results.some((result) => result.level === "FAIL")) {
    process.exitCode = 1;
  }
}

try {
  main();
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
