#!/usr/bin/env node
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const specPath = path.join(root, "lecture-cuts", "slide-spec.json");
const outputPath = path.join(root, "docs", "harness", "lecture-cuts-llm-context-pack.md");

function cleanText(value) {
  return String(value || "")
    .replace(/\r/g, "")
    .replace(/[ \t]+\n/g, "\n")
    .trim();
}

function bulletList(items) {
  if (!items?.length) return "- 없음";
  return items.map((item) => `- ${cleanText(item)}`).join("\n");
}

function sourceList(sources) {
  if (!sources?.length) return "- 없음";
  const lines = [];
  sources.forEach((source) => {
    if (Array.isArray(source.links)) {
      lines.push(`- ${source.label} (${source.sourceScope || "unknown"})`);
      source.links.forEach((link) => {
        lines.push(`  - ${link.label}: ${link.url}`);
      });
      return;
    }
    lines.push(`- ${source.label}${source.url ? `: ${source.url}` : ""} (${source.sourceScope || "unknown"})`);
  });
  return lines.join("\n");
}

function slideBlock(slide) {
  const title = cleanText(slide.title);
  const subtitle = cleanText(slide.subtitle);
  const speaker = cleanText(slide.speaker?.text).replace(/^상세 발표 스크립트\s*/, "");
  const note = slide.note?.present ? cleanText(slide.note.text) : "";

  return `## Slide ${String(slide.index).padStart(2, "0")} / ${slide.id}

- file: \`${slide.file}\`
- section: ${slide.section?.title || "미분류"} (${slide.section?.index || "?"}/${slide.section?.total || "?"})
- kind: ${slide.kind || "unknown"}
- contentHash: \`${slide.contentHash}\`

### 슬라이드 화면 내용

**제목:** ${title || "없음"}

**부제:** ${subtitle || "없음"}

**불릿:**
${bulletList(slide.bullets)}

**발표자 노트:** ${note || "없음"}

**미디어/시각자료:** ${slide.mediaRefs?.length ? slide.mediaRefs.map((ref) => `\`${ref}\``).join(", ") : "없음"}

### 발표 스크립트

${speaker || "등록된 발표 스크립트 없음"}

### 출처

${sourceList(slide.sources)}
`;
}

function main() {
  const spec = JSON.parse(fs.readFileSync(specPath, "utf8"));
  if (!Array.isArray(spec.slides) || spec.slides.length === 0) {
    throw new Error("lecture-cuts/slide-spec.json에 slides 배열이 없습니다.");
  }

  const sections = [...new Map(spec.slides.map((slide) => [slide.section?.id, slide.section]).filter(([id]) => id)).values()];
  const markdown = `# Lecture Cuts LLM Context Pack

이 파일은 다른 LLM에 전체 발표 덱을 주입하기 위한 1회성 컨텍스트 팩입니다. 슬라이드별로 화면 문구와 발표 스크립트를 함께 묶었습니다.

## 사용 지시문

다른 LLM에 이 파일을 줄 때는 아래처럼 요청하면 됩니다.

\`\`\`text
아래는 87장짜리 한국어 강의 슬라이드의 슬라이드별 화면 내용과 발표 스크립트입니다.
각 Slide 블록을 독립 단위로 보되, 전체 흐름도 함께 고려해 주세요.
검토할 때는 1) 슬라이드 문구의 오탈자와 한국어 자연스러움, 2) 발표 스크립트의 문장 품질, 3) 슬라이드와 스크립트의 불일치, 4) 출처가 필요한 사실 주장, 5) 발표 흐름상 중복/비약을 찾아 주세요.
수정 제안은 반드시 Slide 번호와 file을 붙여서 제시해 주세요.
\`\`\`

## 덱 메타데이터

- deck: ${spec.deck || "lecture-cuts"}
- slide count: ${spec.slides.length}
- registry: \`${spec.registryFile}\`
- generatedBy: ${spec.generatedBy || "unknown"}
- source contract: \`lecture-cuts/slide-spec.json\`

## 섹션 목록

${sections.map((section) => `- ${section.id}: ${section.title} (${section.total} slides)`).join("\n")}

## 슬라이드별 컨텍스트

${spec.slides.map(slideBlock).join("\n---\n\n")}
`;

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, markdown);
  console.log(`Wrote ${path.relative(root, outputPath)}`);
  console.log(`Slides exported: ${spec.slides.length}`);
}

try {
  main();
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
