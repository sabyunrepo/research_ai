#!/usr/bin/env node
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const vm = require("node:vm");
const { spawnSync } = require("node:child_process");

const root = path.resolve(__dirname, "..");
const deckRoot = path.join(root, "lecture-cuts");
const slidesPath = path.join(deckRoot, "assets", "slides.js");
const specPath = path.join(deckRoot, "slide-spec.json");
const outputRoot = path.join(root, "docs", "harness", "notebooklm-feedback-rewrites");

const notebookId = "7a396cd0-ba07-4fe1-8d1d-1bed73a766aa";
const sourceIds = [
  "47e05e2c-43c4-4dd8-aeb3-68fb7b2e74ed",
  "65cdf63a-0fe6-41b6-ac7e-39ecf9cd0b87",
  "76dd74e3-63bf-44c7-8b09-449bab55336f",
];

function parseArgs(argv) {
  const args = { slides: [8, 9, 10, 11, 12, 13, 14, 17, 18, 19, 20, 21, 22, 23, 55, 56, 57, 76] };
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === "--slides") {
      args.slides = argv[++i].split(",").map((value) => Number(value.trim())).filter(Boolean);
    } else {
      throw new Error(`Unknown argument: ${argv[i]}`);
    }
  }
  return args;
}

function loadSlides() {
  const code = fs.readFileSync(slidesPath, "utf8");
  const context = { window: {} };
  vm.createContext(context);
  vm.runInContext(code, context, { filename: slidesPath });
  if (!Array.isArray(context.window.LECTURE_SLIDES)) {
    throw new Error("window.LECTURE_SLIDES must be an array");
  }
  return context.window.LECTURE_SLIDES;
}

function clean(value) {
  return String(value || "").replace(/\r/g, "").trim();
}

function stripLabel(value) {
  return clean(value).replace(/^상세 발표 스크립트\s*/, "").trim();
}

function toParagraphHtml(answer) {
  const paragraphs = clean(answer)
    .replace(/\s*\[(?:\d+)(?:\s*,\s*\d+)*\]/g, "")
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
  if (!paragraphs.length) throw new Error("empty answer");

  const escapeHtml = (value) =>
    value
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  return `<strong>상세 발표 스크립트</strong>${paragraphs
    .map((paragraph) => `<p>${escapeHtml(paragraph).replace(/\n/g, "<br>")}</p>`)
    .join("")}`;
}

function buildPrompt(slide) {
  return `NotebookLM 피드백을 반영해 Slide ${slide.index} 발표 스크립트를 다시 써 주세요.

이번 수정의 목표:
- "이 장의 핵심은", "화면에서는", "발표자는", "대본은", "먼저 짚습니다", "다음 장으로 넘어가며" 같은 문서 설명형/발표 행동 지시문을 완전히 제거합니다.
- 청중에게 직접 말하는 현장 발표 구어체로 바꿉니다.
- 기능 설명 전에 실무에서 겪는 답답함이나 공감 포인트를 먼저 제시합니다.
- 가능한 경우 기존 강의의 핵심 비유인 작업장, 공장, 작업대, 공구, 검문소, 의사/전문의, 인수인계 비유를 자연스럽게 연결합니다.
- 마지막 문장은 다음 슬라이드로 넘어갈 이유를 질문이나 자연스러운 브릿지로 말합니다.
- 화면의 제목, 부제, 불릿, 발표자 노트와 어긋나는 새 주장이나 출처 없는 사실은 넣지 않습니다.
- 결과는 교체 가능한 발표 스크립트 본문만 주세요. 제목, 요약, 마크다운 헤더, citation 번호는 붙이지 마세요.

Slide ${slide.index}
file: ${slide.file}
section: ${slide.section?.title || "미분류"} (${slide.section?.index || "?"}/${slide.section?.total || "?"})
제목: ${slide.title}
부제: ${slide.subtitle || "없음"}
불릿:
${slide.bullets?.length ? slide.bullets.map((bullet) => `- ${bullet}`).join("\n") : "- 없음"}
발표자 노트: ${slide.note?.text || "없음"}

현재 발표 스크립트:
${stripLabel(slide.speaker?.text)}
`;
}

function ask(promptPath) {
  const args = [
    "run",
    "--project",
    "/Users/sabyun/goinfre/notebooklm-py",
    "--extra",
    "browser",
    "python",
    "-m",
    "notebooklm.notebooklm_cli",
    "ask",
    "-n",
    notebookId,
  ];
  for (const sourceId of sourceIds) args.push("-s", sourceId);
  args.push("--new", "--yes", "--prompt-file", promptPath, "--json", "--timeout", "120");
  const result = spawnSync("uv", args, { cwd: root, encoding: "utf8", maxBuffer: 1024 * 1024 * 8 });
  if (result.status !== 0) throw new Error(`NotebookLM failed:\n${result.stdout}\n${result.stderr}`);
  return JSON.parse(result.stdout);
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const spec = JSON.parse(fs.readFileSync(specPath, "utf8"));
  const slides = loadSlides();
  fs.mkdirSync(outputRoot, { recursive: true });

  for (const slideNo of args.slides) {
    const slide = spec.slides.find((candidate) => candidate.index === slideNo);
    if (!slide) throw new Error(`Slide ${slideNo} not found`);
    const registrySlide = slides[slideNo - 1];
    if (!registrySlide || registrySlide.file !== slide.file) throw new Error(`Registry mismatch for slide ${slideNo}`);

    const promptPath = path.join(os.tmpdir(), `notebooklm-feedback-slide-${String(slideNo).padStart(3, "0")}.txt`);
    fs.writeFileSync(promptPath, buildPrompt(slide));
    console.log(`Requesting feedback rewrite for slide ${slideNo}: ${slide.file}`);
    const response = ask(promptPath);
    fs.unlinkSync(promptPath);
    if (!response.answer || response.answer.trim().length < 120) {
      throw new Error(`Suspicious short answer for slide ${slideNo}`);
    }

    fs.writeFileSync(
      path.join(outputRoot, `slide-${String(slideNo).padStart(3, "0")}.json`),
      `${JSON.stringify({ slideIndex: slideNo, file: slide.file, title: slide.title, response }, null, 2)}\n`
    );
    registrySlide.speaker = registrySlide.speaker || {};
    registrySlide.speaker.heading = registrySlide.speaker.heading || slide.title;
    registrySlide.speaker.html = toParagraphHtml(response.answer);
    fs.writeFileSync(slidesPath, `window.LECTURE_SLIDES = ${JSON.stringify(slides, null, 2)};\n`);
    console.log(`Saved slide ${slideNo}`);
  }
}

try {
  main();
} catch (error) {
  console.error(error.stack || error.message);
  process.exitCode = 1;
}
