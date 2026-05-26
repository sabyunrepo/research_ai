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
const outputRoot = path.join(root, "docs", "harness", "notebooklm-script-rewrites");

const notebookId = "7a396cd0-ba07-4fe1-8d1d-1bed73a766aa";
const sourceId = "75683e74-c7b3-43dd-9d85-a850b0cb9f4e";
const notebookProject = "/Users/sabyun/goinfre/notebooklm-py";
const cliModule = "notebooklm.notebooklm_cli";

function usage() {
  console.error(
    [
      "Usage: node scripts/rewrite-lecture-cuts-speakers-notebooklm.js [--from N] [--to N] [--dry-run] [--fresh-chat]",
      "",
      "Options:",
      "  --from N      First 1-based slide index. Default: 30",
      "  --to N        Last 1-based slide index. Default: 87",
      "  --dry-run     Request NotebookLM and save responses, but do not rewrite slides.js",
      "  --fresh-chat  Use `ask --new --yes` for each slide. This clears NotebookLM's current chat thread.",
    ].join("\n")
  );
}

function parseArgs(argv) {
  const args = { from: 30, to: 87, dryRun: false, freshChat: false };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--from") {
      args.from = Number(argv[++index]);
    } else if (arg === "--to") {
      args.to = Number(argv[++index]);
    } else if (arg === "--dry-run") {
      args.dryRun = true;
    } else if (arg === "--fresh-chat") {
      args.freshChat = true;
    } else if (arg === "--help" || arg === "-h") {
      usage();
      process.exit(0);
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }
  if (!Number.isInteger(args.from) || !Number.isInteger(args.to) || args.from < 1 || args.to < args.from) {
    throw new Error(`Invalid slide range: ${args.from}-${args.to}`);
  }
  return args;
}

function readSlides() {
  const code = fs.readFileSync(slidesPath, "utf8");
  const context = { window: {} };
  vm.createContext(context);
  vm.runInContext(code, context, { filename: slidesPath });
  if (!Array.isArray(context.window.LECTURE_SLIDES)) {
    throw new Error("window.LECTURE_SLIDES must be an array");
  }
  return context.window.LECTURE_SLIDES;
}

function stripScriptLabel(value) {
  return String(value || "").replace(/^상세 발표 스크립트\s*/, "").trim();
}

function toParagraphHtml(answer) {
  const paragraphs = String(answer || "")
    .replace(/\r/g, "")
    .replace(/\s*\[(?:\d+)(?:\s*,\s*\d+)*\]/g, "")
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  if (paragraphs.length === 0) {
    throw new Error("NotebookLM returned an empty answer");
  }

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
  const speaker = stripScriptLabel(slide.speaker?.text);
  const bullets = Array.isArray(slide.bullets) && slide.bullets.length
    ? slide.bullets.map((bullet) => `- ${bullet}`).join("\n")
    : "- 없음";
  const sources = Array.isArray(slide.sources) && slide.sources.length
    ? slide.sources
        .map((source) => {
          if (Array.isArray(source.links)) {
            return `- ${source.label}: ${source.links.map((link) => link.url || link.label).join(", ")}`;
          }
          return `- ${source.label}${source.url ? `: ${source.url}` : ""}`;
        })
        .join("\n")
    : "- 없음";

  return `아래 87장짜리 강의 덱 중 Slide ${slide.index} 발표 스크립트만 개선해 주세요.

요청:
- 한국어로 자연스럽게 발표자가 실제로 말할 수 있는 스크립트로 개선해 주세요.
- 화면의 제목, 부제, 불릿, 발표자 노트와 어긋나는 새 주장이나 예시는 넣지 마세요.
- 초보 수강생도 이해할 수 있게 전문 용어는 첫 등장 때 짧게 풀어 주세요.
- 기존 스크립트보다 흐름을 더 매끄럽게 만들되, 과장된 마케팅 문구는 피하세요.
- 다음 슬라이드로 넘어가는 연결 문장을 마지막에 자연스럽게 넣어도 됩니다.
- 결과는 교체 가능한 발표 스크립트 본문만 주세요. "개선안", "요약", Markdown 제목은 붙이지 마세요.

Slide ${slide.index}
file: ${slide.file}
section: ${slide.section?.title || slide.sectionTitle || "미분류"}
제목: ${slide.title}
부제: ${slide.subtitle || "없음"}
불릿:
${bullets}
발표자 노트: ${slide.note?.text || "없음"}
출처:
${sources}

현재 발표 스크립트:
${speaker}
`;
}

function runNotebookLm(promptPath, freshChat) {
  const args = [
    "run",
    "--project",
    notebookProject,
    "--extra",
    "browser",
    "python",
    "-m",
    cliModule,
    "ask",
    "-n",
    notebookId,
    "-s",
    sourceId,
    "--prompt-file",
    promptPath,
    "--json",
    "--timeout",
    "120",
  ];
  if (freshChat) {
    args.splice(args.indexOf("--json"), 0, "--new", "--yes");
  }

  const result = spawnSync("uv", args, {
    cwd: root,
    encoding: "utf8",
    maxBuffer: 1024 * 1024 * 8,
  });

  if (result.status !== 0) {
    throw new Error(`NotebookLM request failed:\nSTDOUT:\n${result.stdout}\nSTDERR:\n${result.stderr}`);
  }

  try {
    return JSON.parse(result.stdout);
  } catch (error) {
    throw new Error(`NotebookLM returned non-JSON output:\n${result.stdout}\n${error.message}`);
  }
}

function writeSlides(slides) {
  fs.writeFileSync(slidesPath, `window.LECTURE_SLIDES = ${JSON.stringify(slides, null, 2)};\n`);
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const spec = JSON.parse(fs.readFileSync(specPath, "utf8"));
  const slides = readSlides();
  fs.mkdirSync(outputRoot, { recursive: true });

  for (const slide of spec.slides.filter((item) => item.index >= args.from && item.index <= args.to)) {
    const registrySlide = slides[slide.index - 1];
    if (!registrySlide || registrySlide.file !== slide.file) {
      throw new Error(`Registry mismatch at slide ${slide.index}: expected ${slide.file}`);
    }

    const prompt = buildPrompt(slide);
    const promptPath = path.join(os.tmpdir(), `notebooklm-slide-${String(slide.index).padStart(3, "0")}.txt`);
    fs.writeFileSync(promptPath, prompt);

    console.log(`Requesting slide ${slide.index}: ${slide.file}`);
    const response = runNotebookLm(promptPath, args.freshChat);
    fs.unlinkSync(promptPath);

    if (!response.answer || response.answer.trim().length < 80) {
      throw new Error(`Suspiciously short answer for slide ${slide.index}`);
    }

    const output = {
      slideIndex: slide.index,
      file: slide.file,
      title: slide.title,
      requestedAt: new Date().toISOString(),
      freshChat: args.freshChat,
      response,
    };
    fs.writeFileSync(
      path.join(outputRoot, `slide-${String(slide.index).padStart(3, "0")}.json`),
      `${JSON.stringify(output, null, 2)}\n`
    );

    if (!args.dryRun) {
      registrySlide.speaker = registrySlide.speaker || {};
      registrySlide.speaker.heading = registrySlide.speaker.heading || slide.title;
      registrySlide.speaker.html = toParagraphHtml(response.answer);
      writeSlides(slides);
    }

    console.log(`Saved slide ${slide.index}`);
  }
}

try {
  main();
} catch (error) {
  console.error(error.stack || error.message);
  process.exitCode = 1;
}
