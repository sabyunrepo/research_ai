#!/usr/bin/env node
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = path.resolve(__dirname, "..");
const deckRoot = path.join(root, "lecture-cuts");
const reportPath = path.join(root, "docs", "audits", "2026-05-25-lecture-cuts-slide-script-composition-review.md");
const manualFindingsPath = path.join(
  root,
  "docs",
  "audits",
  "2026-05-25-lecture-cuts-slide-script-composition-agent-findings.md"
);

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

function extractFirstTag(html, tagName) {
  const match = html.match(new RegExp(`<${tagName}\\b[^>]*>([\\s\\S]*?)<\\/${tagName}>`, "i"));
  return match ? textFromHtml(match[1]).replace(/\s+/g, " ").trim() : "";
}

function extractByClass(html, tagName, className) {
  const pattern = new RegExp(
    `<${tagName}\\b[^>]*class=["'][^"']*\\b${className}\\b[^"']*["'][^>]*>([\\s\\S]*?)<\\/${tagName}>`,
    "i"
  );
  const match = html.match(pattern);
  return match ? match[1] : "";
}

function extractListItems(html, className) {
  const block = extractByClass(html, "ul", className);
  if (!block) return [];
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

function tokenize(text) {
  const stopwords = new Set([
    "그리고",
    "하지만",
    "입니다",
    "합니다",
    "있는",
    "없는",
    "것은",
    "것이",
    "것을",
    "이제",
    "다음",
    "앞서",
    "AI",
    "the",
    "and",
    "with",
  ]);
  return Array.from(
    new Set(
      text
        .replace(/[^\p{L}\p{N}._/-]+/gu, " ")
        .split(/\s+/)
        .map((token) => token.trim())
        .filter((token) => token.length >= 2 && !stopwords.has(token))
    )
  );
}

function countCodeLines(html) {
  return Array.from(html.matchAll(/<pre\b[^>]*><code\b[^>]*>([\s\S]*?)<\/code><\/pre>/gi))
    .map((match) => textFromHtml(match[1]).split(/\n+/).filter(Boolean).length)
    .reduce((sum, count) => sum + count, 0);
}

function hasMedia(html) {
  return /<section\b[^>]*class=["'][^"']*\bslide-media\b/i.test(html);
}

function severityRank(value) {
  return { P1: 1, P2: 2, P3: 3 }[value] || 4;
}

function addFinding(findings, finding) {
  findings.push(finding);
}

function analyzeSlide(slide, index, slides) {
  const html = fs.readFileSync(path.join(deckRoot, slide.file), "utf8");
  const title = extractFirstTag(html, "h2") || extractFirstTag(html, "h1");
  const subtitle = textFromHtml(extractByClass(html, "p", "subtitle")).replace(/\s+/g, " ").trim();
  const bullets = extractListItems(html, "bullets");
  const note = textFromHtml(extractByClass(html, "div", "note")).replace(/\s+/g, " ").trim();
  const visibleText = [title, subtitle, bullets.join(" "), note].filter(Boolean).join(" ");
  const speaker = textFromHtml(slide.speaker?.html || "").replace(/\s+/g, " ").trim();
  const visibleTokens = tokenize(visibleText);
  const matchedTokens = visibleTokens.filter((token) => speaker.includes(token));
  const overlap = visibleTokens.length ? matchedTokens.length / visibleTokens.length : 1;
  const codeLines = countCodeLines(html);
  const speakerLength = speaker.length;
  const visibleLength = visibleText.length;
  const findings = [];
  const slideNo = index + 1;

  if (speakerLength > 1500 && visibleLength < 120) {
    addFinding(findings, {
      severity: "P2",
      category: "load",
      slideNo,
      file: slide.file,
      title,
      issue: "화면 정보에 비해 대본이 길어 발표자가 화면을 붙잡고 설명하기 어렵습니다.",
      evidence: `visible ${visibleLength}자, script ${speakerLength}자`,
      recommendation: "화면에 2-3개 앵커 키워드를 추가하거나, 대본을 화면 요소 순서로 나눕니다.",
      surface: "slide HTML + presenter script",
    });
  }

  if (codeLines >= 7 && speakerLength > 1300) {
    addFinding(findings, {
      severity: "P2",
      category: "load",
      slideNo,
      file: slide.file,
      title,
      issue: "코드/파일 예시가 긴데 대본도 길어 인지 부하가 높습니다.",
      evidence: `${codeLines} code lines, script ${speakerLength}자`,
      recommendation: "코드 예시는 핵심 줄을 강조하거나 대본에서 읽을 순서를 명확히 지정합니다.",
      surface: "slide HTML + presenter script",
    });
  }

  if (bullets.length > 4) {
    addFinding(findings, {
      severity: "P3",
      category: "screen",
      slideNo,
      file: slide.file,
      title,
      issue: "불릿이 5개 이상이라 한 장의 교육 역할이 넓어질 수 있습니다.",
      evidence: `${bullets.length} bullets`,
      recommendation: "핵심 불릿 3-4개만 남기거나 보조 항목은 대본으로 이동합니다.",
      surface: "slide HTML + presenter script",
    });
  }

  if (speakerLength > 900 && overlap < 0.22) {
    addFinding(findings, {
      severity: "P2",
      category: "script",
      slideNo,
      file: slide.file,
      title,
      issue: "대본이 화면의 구체 단어를 충분히 회수하지 않아 슬라이드와 말이 따로 갈 수 있습니다.",
      evidence: `keyword overlap ${(overlap * 100).toFixed(0)}%`,
      recommendation: "대본 첫 1-2문단에서 제목, 불릿, 코드/도표 라벨을 같은 순서로 짚습니다.",
      surface: "presenter script",
    });
  }

  if (slide.sectionStart && index > 0 && !/(이제|다음|앞서|여기까지|이번|오늘|넘어)/.test(speaker.slice(0, 240))) {
    addFinding(findings, {
      severity: "P3",
      category: "flow",
      slideNo,
      file: slide.file,
      title,
      issue: "섹션 시작 슬라이드의 첫 문단에 전환 신호가 약합니다.",
      evidence: `previous ${slides[index - 1]?.file || "none"} -> current ${slide.file}`,
      recommendation: "첫 문단에 이전 섹션의 결론과 이번 섹션의 질문을 한 문장으로 연결합니다.",
      surface: "presenter script",
    });
  }

  if (!hasMedia(html) && speakerLength > 1000) {
    addFinding(findings, {
      severity: "P3",
      category: "screen",
      slideNo,
      file: slide.file,
      title,
      issue: "긴 설명을 받쳐줄 시각 앵커가 약합니다.",
      evidence: "no slide-media section",
      recommendation: "작은 비교표, 체크리스트, 흐름 화살표 중 하나를 추가할 후보로 둡니다.",
      surface: "slide HTML",
    });
  }

  return findings;
}

function formatFinding(finding) {
  return [
    `- **${finding.severity} / ${finding.category} / Slide ${finding.slideNo} / \`${finding.file}\`**`,
    `  - 제목: ${finding.title}`,
    `  - 발견: ${finding.issue}`,
    `  - 근거: ${finding.evidence}`,
    `  - 제안: ${finding.recommendation}`,
    `  - 수정면: ${finding.surface}`,
  ].join("\n");
}

function main() {
  const slides = loadSlides();
  const manualFindings = fs.existsSync(manualFindingsPath)
    ? fs.readFileSync(manualFindingsPath, "utf8").trim()
    : "- No manual/subagent findings file found.";
  const findings = slides.flatMap((slide, index) => analyzeSlide(slide, index, slides));
  findings.sort((a, b) => severityRank(a.severity) - severityRank(b.severity) || a.slideNo - b.slideNo);
  const p1 = findings.filter((finding) => finding.severity === "P1");
  const p2 = findings.filter((finding) => finding.severity === "P2");
  const p3 = findings.filter((finding) => finding.severity === "P3");
  const focus = findings.filter((finding) => finding.slideNo >= 24 && finding.slideNo <= 34);
  const top = findings.slice(0, 18);
  const generatedAt = new Date().toISOString();

  const report = `# Lecture Cuts Slide-Script Composition Review

Generated: ${generatedAt}

## Summary

- Slides checked: ${slides.length}
- P1 findings: ${p1.length}
- P2 findings: ${p2.length}
- P3 findings: ${p3.length}
- Focus range checked: Slides 24-34, including current browser vicinity around Slide 29
- Audit role: report generator for slide job clarity, script fit, explainability, flow bridge, and cognitive load

## Verdict

${p1.length ? "FAIL: P1 findings require correction before presentation handoff." : p2.length ? "WARN: no P1 blocker, but P2 improvements can make the lecture easier to deliver." : "PASS: no blocking composition issue detected by heuristics."}

## Top Findings

${top.length ? top.map(formatFinding).join("\n\n") : "- No findings."}

## Slide 24-34 Focus Findings

${focus.length ? focus.map(formatFinding).join("\n\n") : "- No focus-range findings from the heuristic pass."}

## Manual/Subagent Findings

Source: \`${path.relative(root, manualFindingsPath)}\`

${manualFindings}

## Good Patterns To Preserve

- Slides with visible comparison structures work well when the script speaks through the left/right or before/after order.
- Checkpoint slides are useful because they turn concept explanation into participant output.
- File/path/code slides are strongest when literal artifacts remain visible and the script explains why each artifact exists.
- The current first-use terminology policy helps learners map Korean explanations back to official English documentation.

## Recommended Next Work

1. Review P2 load/script findings first; these are the places most likely to feel hard to present live.
2. For any accepted finding, update slide HTML, hidden note, and \`lecture-cuts/assets/slides.js\` together.
3. Regenerate the contract with \`node scripts/export-lecture-cuts-contract.js\`.
4. Re-run \`node scripts/verify-lecture-cuts-harness.js\`.
5. Append accepted fixes and deferred items to \`lecture-cuts/HANDOFF.md\`.
`;

  fs.mkdirSync(path.dirname(reportPath), { recursive: true });
  fs.writeFileSync(reportPath, report);

  console.log(`PASS slide-script composition report - ${reportPath}`);
  console.log(`Slides checked: ${slides.length}`);
  console.log(`Findings: P1=${p1.length}, P2=${p2.length}, P3=${p3.length}`);

  if (process.argv.includes("--fail-on-p1") && p1.length) {
    process.exitCode = 1;
  }
}

try {
  main();
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
