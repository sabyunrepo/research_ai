#!/usr/bin/env node
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const specPath = path.join(root, "lecture-cuts", "slide-spec.json");
const outputDir = path.join(root, "docs", "harness", "notebooklm-sources");

function cleanText(value) {
  return String(value || "")
    .replace(/\r/g, "")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function bulletList(items) {
  if (!items?.length) return "- 없음";
  return items.map((item) => `- ${cleanText(item)}`).join("\n");
}

function speakerText(slide) {
  return cleanText(slide.speaker?.text).replace(/^상세 발표 스크립트\s*/, "").trim();
}

function slideStructureBlock(slide) {
  return `## Slide ${String(slide.index).padStart(2, "0")} - ${cleanText(slide.title)}

- file: \`${slide.file}\`
- section: ${slide.section?.title || "미분류"} (${slide.section?.index || "?"}/${slide.section?.total || "?"})
- kind: ${slide.kind || "unknown"}

### 화면 구성

**제목:** ${cleanText(slide.title) || "없음"}

**부제:** ${cleanText(slide.subtitle) || "없음"}

**불릿:**
${bulletList(slide.bullets)}

**발표자 노트:** ${slide.note?.present ? cleanText(slide.note.text) : "없음"}

**미디어/시각자료:** ${slide.mediaRefs?.length ? slide.mediaRefs.map((ref) => `\`${ref}\``).join(", ") : "없음"}

### 개선된 발표 스크립트

${speakerText(slide) || "등록된 발표 스크립트 없음"}
`;
}

function main() {
  const spec = JSON.parse(fs.readFileSync(specPath, "utf8"));
  if (!Array.isArray(spec.slides) || spec.slides.length === 0) {
    throw new Error("Expected at least one slide in lecture-cuts/slide-spec.json");
  }

  fs.mkdirSync(outputDir, { recursive: true });
  const generatedAt = new Date().toISOString();
  const sections = [...new Map(spec.slides.map((slide) => [slide.section?.id, slide.section]).filter(([id]) => id)).values()];

  const promptDoc = `# AI Agent Harness Engineering - 개선본 발표 프롬프트

생성 시각: ${generatedAt}

이 문서는 NotebookLM에서 \`AI Agent Harness Engineering: Building Scalable Automation Workflows\` 강의 덱의 발표 스크립트와 구성 검토를 요청할 때 사용할 기준 프롬프트입니다.

## 발표 목표

- 청중이 "프롬프트를 잘 쓰는 요령"이 아니라 "AI가 반복해서 안전하게 일하는 작업 환경을 설계하는 법"을 이해하게 합니다.
- Prompt, Context, Skill, Subagent, Hook, MCP, Evaluation, Handoff를 하나의 자동화 하네스 구조로 연결합니다.
- 초보 수강생도 따라올 수 있도록 공식 용어는 유지하되, 첫 등장 때 한국어로 짧게 풀이합니다.
- 발표자는 화면의 제목, 부제, 불릿, 노트와 같은 순서로 말하고, 화면에 없는 새 주장이나 출처 없는 사례를 추가하지 않습니다.

## 발표 톤

- 한국어 구어체로 말합니다.
- "발표자는", "이 슬라이드는" 같은 메타 설명을 피하고, 청중에게 직접 설명합니다.
- 과장된 마케팅 문구보다 실제 작업 흐름, 실패 증상, 검증 방법을 중심으로 설명합니다.
- 각 슬라이드는 앞 장의 핵심을 한 문장으로 이어받고, 다음 장으로 넘어갈 이유를 자연스럽게 남깁니다.

## NotebookLM 요청 템플릿

\`\`\`text
아래 강의 덱의 Slide <번호> 발표 스크립트를 개선해 주세요.

요청:
- 한국어로 자연스럽게 발표자가 실제로 말할 수 있는 스크립트로 개선해 주세요.
- 화면의 제목, 부제, 불릿, 발표자 노트와 어긋나는 새 주장이나 예시는 넣지 마세요.
- 초보 수강생도 이해할 수 있게 전문 용어는 첫 등장 때 짧게 풀어 주세요.
- 기존 스크립트보다 흐름을 더 매끄럽게 만들되, 과장된 마케팅 문구는 피하세요.
- 다음 슬라이드로 넘어가는 연결 문장을 마지막에 자연스럽게 넣어도 됩니다.
- 결과는 교체 가능한 발표 스크립트 본문만 주세요. "개선안", "요약", Markdown 제목은 붙이지 마세요.
\`\`\`

## 섹션 흐름

${sections.map((section) => `- ${section.id}: ${section.title} (${section.total} slides)`).join("\n")}

## 품질 기준

- 화면 문구와 발표 스크립트가 같은 개념을 설명해야 합니다.
- 공식 파일명과 명령어는 원문으로 유지합니다.
- \`CLAUDE.md\`, \`Skill\`, \`Subagent\`, \`Hook\`, \`MCP\`, \`Evaluation\`, \`HANDOFF.md\` 같은 핵심 용어는 흐름상 필요한 곳에서 빠지면 안 됩니다.
- 발표 스크립트에는 NotebookLM citation 표기인 \`[1]\`, \`[2]\`를 넣지 않습니다.
- 완료 전에는 slide count ${spec.slides.length}, speaker script ${spec.slides.length}개, source-sensitive term alignment를 확인합니다.
`;

  const structureDoc = `# AI Agent Harness Engineering - 개선본 슬라이드 구성

생성 시각: ${generatedAt}

이 문서는 현재 \`lecture-cuts/\` 덱의 개선된 발표 스크립트와 슬라이드 화면 구성을 NotebookLM에 넣기 위한 소스입니다.

## 덱 메타데이터

- deck: ${spec.deck || "lecture-cuts"}
- slide count: ${spec.slides.length}
- registry: \`${spec.registryFile}\`
- source contract: \`lecture-cuts/slide-spec.json\`
- presenter scripts: ${spec.slides.length} inline speaker scripts
- 개선 범위: 현재 포함된 Slide 1-${spec.slides.length} 전체 발표 스크립트는 NotebookLM 순차 요청으로 개선 후 반영됨

## 섹션 목록

${sections.map((section) => `- ${section.id}: ${section.title} (${section.total} slides)`).join("\n")}

## 슬라이드별 구성과 개선 스크립트

${spec.slides.map(slideStructureBlock).join("\n---\n\n")}
`;

  const promptPath = path.join(outputDir, "lecture-cuts-improved-presentation-prompt.md");
  const structurePath = path.join(outputDir, "lecture-cuts-improved-slide-structure.md");
  fs.writeFileSync(promptPath, promptDoc);
  fs.writeFileSync(structurePath, structureDoc);
  console.log(`Wrote ${path.relative(root, promptPath)}`);
  console.log(`Wrote ${path.relative(root, structurePath)}`);
}

try {
  main();
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
