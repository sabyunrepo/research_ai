#!/usr/bin/env node
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = path.resolve(__dirname, "..");
const deckRoot = path.join(root, "lecture-cuts");

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

function decodeEntities(value = "") {
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
      .replace(/[ \t\r\f\v]+/g, " ")
      .replace(/\n\s+/g, "\n")
      .replace(/\s+\n/g, "\n")
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
  return match ? textFromHtml(match[1]).replace(/\s+/g, " ").trim() : "";
}

function extractListItems(html, className) {
  const block = extractByClass(html, "ul", className);
  if (!block) {
    return [];
  }
  return Array.from(block.matchAll(/<li\b[^>]*>([\s\S]*?)<\/li>/gi))
    .map((match) => textFromHtml(match[1]).replace(/\s+/g, " ").trim())
    .filter(Boolean);
}

function loadSlides() {
  const code = fs.readFileSync(path.join(deckRoot, "assets", "slides.js"), "utf8");
  const context = { window: {} };
  vm.createContext(context);
  vm.runInContext(code, context, { filename: "lecture-cuts/assets/slides.js" });
  if (!Array.isArray(context.window.LECTURE_SLIDES)) {
    throw new Error("window.LECTURE_SLIDES must be an array");
  }
  return context.window.LECTURE_SLIDES;
}

function splitSentences(text) {
  return text
    .replace(/\s+/g, " ")
    .split(/(?<=[.!?。]|다\.|요\.|니다\.)\s+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);
}

function summarizeItems(items, limit = 20) {
  return items.slice(0, limit).join("; ");
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function stripOfficialArtifacts(text) {
  return text
    .replace(/SKILL\.md/g, "")
    .replace(/\.claude\/skills\/?/g, "")
    .replace(/skill-name\//g, "")
    .replace(/SubagentStop/g, "")
    .replace(/Stop event/g, "")
    .replace(/OpenAI Evaluation Best Practices/g, "");
}

function mixedTermIssue(text, term) {
  const normalized = stripOfficialArtifacts(text);
  const allowed = term.allowedPatterns.some((pattern) => pattern.test(normalized));
  const remainder = term.allowedPatterns.reduce((value, pattern) => value.replace(pattern, ""), normalized);
  const hasEnglish = new RegExp(`\\b${escapeRegex(term.en)}s?\\b`).test(remainder);
  const hasKorean = term.koPatterns.some((pattern) => pattern.test(remainder));

  if (!hasEnglish || !hasKorean) {
    return "";
  }

  return allowed
    ? `${term.en}/${term.koLabel} after first-use pair`
    : `${term.en}/${term.koLabel}`;
}

function main() {
  const slides = loadSlides();
  const longTitles = [];
  const longSubtitles = [];
  const longBullets = [];
  const longSpeakerSentences = [];
  const mixedTerms = [];
  const awkwardSpacing = [];
  const duplicateAdjacentStarts = [];

  slides.forEach((slide) => {
    const html = fs.readFileSync(path.join(deckRoot, slide.file), "utf8");
    const title = extractFirstTag(html, "h2") || extractFirstTag(html, "h1");
    const subtitle = textFromHtml(extractByClass(html, "p", "subtitle")).replace(/\s+/g, " ").trim();
    const bullets = extractListItems(html, "bullets");
    const speaker = textFromHtml(slide.speaker?.html || "").replace(/\s+/g, " ").trim();

    if (title.length > 34) {
      longTitles.push(`${slide.file}: title ${title.length}자`);
    }
    if (subtitle.length > 72) {
      longSubtitles.push(`${slide.file}: subtitle ${subtitle.length}자`);
    }
    bullets.forEach((bullet, index) => {
      if (bullet.length > 42) {
        longBullets.push(`${slide.file}: bullet${index + 1} ${bullet.length}자`);
      }
    });

    splitSentences(speaker).forEach((sentence, index) => {
      if (sentence.length > 155) {
        longSpeakerSentences.push(`${slide.file}: sentence${index + 1} ${sentence.length}자`);
      }
    });

    const combined = `${title} ${subtitle} ${bullets.join(" ")} ${speaker}`;
    [
      {
        en: "Hook",
        koLabel: "훅",
        koPatterns: [/훅/],
        allowedPatterns: [/훅\s*\(Hook\)/g],
      },
      {
        en: "Skill",
        koLabel: "스킬",
        koPatterns: [/스킬/],
        allowedPatterns: [/스킬\s*\(Skill\)/g],
      },
      {
        en: "Subagent",
        koLabel: "서브에이전트",
        koPatterns: [/서브에이전트/],
        allowedPatterns: [/서브에이전트\s*\(Subagents?\)/g],
      },
      {
        en: "Evaluation",
        koLabel: "평가",
        koPatterns: [/평가/],
        allowedPatterns: [/평가\s*\(Evaluation\)/g, /검증\/평가\s*\(Evaluation\)/g],
      },
    ].forEach((term) => {
      const issue = mixedTermIssue(combined, term);
      if (issue) {
        mixedTerms.push(`${slide.file}: ${issue}`);
      }
    });

    const spacingPatterns = [
      [/할수/g, "할 수"],
      [/될수/g, "될 수"],
      [/수있/g, "수 있"],
      [/것 입니다/g, "것입니다"],
      [/해야합니다/g, "해야 합니다"],
    ];
    spacingPatterns.forEach(([pattern, expected]) => {
      if (pattern.test(combined)) {
        awkwardSpacing.push(`${slide.file}: ${pattern} -> ${expected}`);
      }
    });

    const starts = splitSentences(speaker)
      .map((sentence) => sentence.slice(0, 9))
      .filter(Boolean);
    for (let index = 1; index < starts.length; index += 1) {
      if (starts[index] === starts[index - 1]) {
        duplicateAdjacentStarts.push(`${slide.file}: "${starts[index]}"`);
        break;
      }
    }
  });

  if (longTitles.length) warn("long visible titles", summarizeItems(longTitles));
  else pass("long visible titles", "0");

  if (longSubtitles.length) warn("long subtitles", summarizeItems(longSubtitles));
  else pass("long subtitles", "0");

  if (longBullets.length) warn("long bullet lines", summarizeItems(longBullets));
  else pass("long bullet lines", "0");

  if (longSpeakerSentences.length) warn("long speaker sentences", summarizeItems(longSpeakerSentences));
  else pass("long speaker sentences", "0");

  if (mixedTerms.length) warn("mixed Korean/English terms", summarizeItems(mixedTerms));
  else pass("mixed Korean/English terms", "0");

  if (awkwardSpacing.length) warn("spacing candidates", summarizeItems(awkwardSpacing));
  else pass("spacing candidates", "0");

  if (duplicateAdjacentStarts.length) warn("duplicate adjacent sentence starts", summarizeItems(duplicateAdjacentStarts));
  else pass("duplicate adjacent sentence starts", "0");

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
