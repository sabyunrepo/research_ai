#!/usr/bin/env node
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const root = path.resolve(__dirname, "..", "..", "..", "..");
const deckDir = path.join(root, "generated-decks", "kimai-workshop-content");
const outputRoot = path.join(root, "docs", "harness", "notebooklm-script-rewrites", "kimai-workshop-content");
const notebookProject = "/Users/sabyun/goinfre/notebooklm-py";
const cliModule = "notebooklm.notebooklm_cli";

function usage() {
  console.error([
    "Usage: node .codex/skills/notebooklm-project/scripts/rewrite-kimai-range.js --notebook-id ID --from N --to N [--dry-run] [--fresh-chat] [--force] [--compact-prompt] [--no-inject-generated-sources]",
    "",
    "Requests one NotebookLM answer per slide and applies the answer to presentation-script.json unless --dry-run is set.",
  ].join("\n"));
  process.exit(1);
}

function parseArgs(argv) {
  const args = { from: null, to: null, notebookId: "", dryRun: false, freshChat: false, force: false, compactPrompt: false, injectGeneratedSources: true };
  for (let index = 0; index < argv.length; index += 1) {
    const item = argv[index];
    if (item === "--from") args.from = Number(argv[++index]);
    else if (item === "--to") args.to = Number(argv[++index]);
    else if (item === "--notebook-id" || item === "-n") args.notebookId = argv[++index];
    else if (item === "--dry-run") args.dryRun = true;
    else if (item === "--fresh-chat") args.freshChat = true;
    else if (item === "--force") args.force = true;
    else if (item === "--compact-prompt") args.compactPrompt = true;
    else if (item === "--no-inject-generated-sources") args.injectGeneratedSources = false;
    else usage();
  }
  if (!args.notebookId || !Number.isInteger(args.from) || !Number.isInteger(args.to)) usage();
  if (args.from < 1 || args.to < args.from) usage();
  return args;
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function writeJson(filePath, data) {
  fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`);
}

function clean(value) {
  return String(value || "").replace(/\r/g, "").replace(/\n{3,}/g, "\n\n").trim();
}

function stripNotebookLmAnswer(answer) {
  let text = clean(answer)
    .replace(/\[[0-9]+(?:,\s*[0-9]+)*\]/g, "")
    .replace(/^```(?:text|markdown)?\s*/i, "")
    .replace(/```$/i, "")
    .trim();
  text = text
    .split(/\n+/)
    .filter((line) => !/^#{1,6}\s/.test(line.trim()))
    .filter((line) => !/^(개선안|발표\s*스크립트|스크립트|요약)\s*[:：]?$/i.test(line.trim()))
    .join("\n")
    .trim();
  return text;
}

function containsEmoji(text) {
  return /[\p{Extended_Pictographic}\u{1F1E6}-\u{1F1FF}\u{2600}-\u{27BF}]/u.test(String(text || ""));
}

function visibleScreenSummary(slide) {
  const screen = slide.rewrittenScreen || {};
  const excluded = new Set([
    "bridge",
    "transition",
    "presenterCues",
    "sourcePresenterCues",
    "speakerNote",
    "keywordFlow",
  ]);
  const lines = [
    `제목: ${slide.title}`,
    `메시지: ${slide.message || "없음"}`,
    `불릿: ${(slide.bullets || []).join(" / ") || "없음"}`,
  ];
  for (const [key, value] of Object.entries(screen)) {
    if (excluded.has(key)) continue;
    if (value == null || value === "") continue;
    lines.push(`${key === "bridgeLine" ? "termLine" : key}: ${Array.isArray(value) ? value.join(" / ") : clean(value)}`);
  }
  return lines.join("\n");
}

function buildPrompt({ slide, entry, previous, next, previousRewrittenScripts, compactPrompt }) {
  const rewrittenFlow = previousRewrittenScripts.length
    ? previousRewrittenScripts
      .slice(-3)
      .map((item) => `Slide ${item.index} ${item.title}\n${item.script}`)
      .join("\n\n---\n\n")
    : "아직 이 실행에서 새로 받은 개선본 스크립트가 없습니다.";
  if (compactPrompt) {
    return `김아이 워크숍 Slide ${entry.index} 발표 대본만 작성해 주세요.

조건:
- 설명문이 아니라 강사가 실제로 말하는 한국어 대본입니다.
- 이모지, Markdown, 번호, 제목, citation은 쓰지 마세요.
- 3문단: 도입 대사, 김아이 업무 장면 전개, 다음 슬라이드 브릿지.
- "제목 그대로", "여기서는", "오늘 슬라이드", "기준점으로 잡고" 같은 해설 표현은 금지입니다.
- 회사 업무 비유를 먼저 말하고, 전문 용어는 짧게 붙이세요.

이전 슬라이드: ${previous ? `${previous.index}. ${previous.title}` : "없음"}
다음 슬라이드: ${next ? `${next.index}. ${next.title}` : "없음. 전체 발표 마무리"}
직전 확정 스크립트:
${previous ? previous.script : "없음"}

대상 화면:
${visibleScreenSummary(slide)}

기존 스크립트 참고:
${entry.script}

교체할 발표 대본 본문만 출력해 주세요.`;
  }
  return `김아이 워크숍 발표 스크립트를 슬라이드별로 교체하고 있습니다.

요청:
- 아래 대상 슬라이드 1장에 대한 발표 스크립트 본문만 한국어 구어체로 작성해 주세요.
- 이것은 설명문이나 슬라이드 해설문이 아니라, 강사가 무대에서 실제로 말하는 발표 대본입니다.
- Markdown 제목, 번호 목록, 설명, citation 표기([1], [2]) 없이 발표자가 그대로 읽고 다듬을 수 있는 본문만 주세요.
- 이모지는 사용하지 마세요.
- 현재 덱의 기존 presentation-script.json 형식과 플로우에 맞춰 주세요.
- 일반인 대상 강의입니다. 전문 용어는 회사 업무 비유를 먼저 말하고 이름표처럼 짧게 붙여 주세요.
- 화면에 없는 새 주장이나 출처 없는 사례를 추가하지 마세요.
- 기존 NotebookLM에 있는 발표 스크립트 소스의 톤과 길이를 유지하되, 아래 화면 문구와 현재 구조에 맞게 자연스럽게 다시 구성해 주세요.
- 마지막 문장은 다음 슬라이드 흐름에 맞는 연결 문장으로 마무리하세요. 마지막 슬라이드라면 자연스럽게 종료 인사로 마무리하세요.
- "제목 그대로", "여기서는", "기준점으로 잡고", "오늘 슬라이드", "청중에게 확인할 질문은" 같은 설명문 표현은 쓰지 마세요.
- "자, 팀장님들.", "한번 생각해 보겠습니다.", "이런 일이 생깁니다.", "그럼 다음으로 보겠습니다."처럼 실제 강의 현장에서 말하는 리듬을 사용하세요.

구성 방식:
- 출력은 제목이나 번호 없이 3개 문단으로 구성해 주세요.
- 1문단은 도입 대사입니다. 직전 슬라이드의 개념과 이번 슬라이드의 개념을 회사 업무 비유로 연결하고, 김아이 캐릭터를 자연스럽게 불러오세요.
- 2문단은 전개 대사입니다. 김아이가 실제 업무를 처리하는 장면을 말하듯이 보여 주고, 왜 이 장치가 필요한지 청중이 납득하게 만드세요.
- 3문단은 브릿지 대사입니다. 이번 슬라이드의 결론을 말로 정리하고 다음 슬라이드로 넘어갈 질문을 던지세요.
- 예시 구조: 내규가 테두리라면 매뉴얼은 징검다리입니다. 김아이가 똑똑해서 일을 한 번에 섞어 처리할 수 있으니 순서를 잡아줘야 합니다. 그렇다면 반복되는 업무에서는 왜 매번 같은 순서를 다르게 말하게 될까요?

대상 슬라이드:
- Slide ${entry.index}
- id: ${slide.id}
- section: ${slide.section}
- title: ${slide.title}

앞뒤 흐름:
- 이전 슬라이드: ${previous ? `${previous.index}. ${previous.title}` : "없음"}
- 다음 슬라이드: ${next ? `${next.index}. ${next.title}` : "없음. 전체 발표 마무리"}

직전 확정 스크립트 참고:
${previous ? previous.script : "없음"}

화면 문구와 구조:
${visibleScreenSummary(slide)}

현재 스크립트 형식 참고:
${entry.script}

이번 실행에서 이미 NotebookLM이 생성한 직전 개선본 흐름:
${rewrittenFlow}

교체할 발표 스크립트 본문만 출력해 주세요.`;
}

function runNotebookLm(promptPath, notebookId, freshChat) {
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
    "--prompt-file",
    promptPath,
    "--json",
    "--timeout",
    "180",
  ];
  if (freshChat) args.splice(args.indexOf("--json"), 0, "--new", "--yes");
  let lastError = null;
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    const result = spawnSync("uv", args, {
      cwd: root,
      encoding: "utf8",
      maxBuffer: 1024 * 1024 * 12,
    });
    if (result.status === 0) {
      try {
        return JSON.parse(result.stdout);
      } catch (error) {
        lastError = new Error(`NotebookLM returned non-JSON output:\n${result.stdout}\n${error.message}`);
      }
    } else {
      lastError = new Error(`NotebookLM request failed:\nSTDOUT:\n${result.stdout}\nSTDERR:\n${result.stderr}`);
    }
    if (attempt < 3) {
      console.error(`NotebookLM request attempt ${attempt} failed; retrying.`);
      sleep(attempt * 3000);
    }
  }
  throw lastError;
}

function addGeneratedScriptSource({ notebookId, entry, script }) {
  const content = [
    `# 김아이 워크숍 NotebookLM 개선 발표 스크립트 - Slide ${String(entry.index).padStart(2, "0")}`,
    "",
    `- slide: ${entry.index}`,
    `- id: ${entry.id}`,
    `- title: ${entry.title}`,
    "- purpose: 다음 슬라이드 발표 스크립트 생성 시 앞선 개선본의 톤, 길이, 연결 흐름을 참고하기 위한 소스",
    "",
    "## 발표 스크립트",
    "",
    script,
  ].join("\n");
  const args = [
    "run",
    "--project",
    notebookProject,
    "--extra",
    "browser",
    "python",
    "-m",
    cliModule,
    "source",
    "add",
    content,
    "-n",
    notebookId,
    "--title",
    `김아이 개선 발표 스크립트 Slide ${String(entry.index).padStart(2, "0")} - ${entry.title}`,
    "--type",
    "text",
    "--json",
  ];
  const result = spawnSync("uv", args, {
    cwd: root,
    encoding: "utf8",
    maxBuffer: 1024 * 1024 * 8,
  });
  if (result.status !== 0) {
    throw new Error(`NotebookLM generated-script source injection failed for slide ${entry.index}:\nSTDOUT:\n${result.stdout}\nSTDERR:\n${result.stderr}`);
  }
  try {
    return JSON.parse(result.stdout);
  } catch (error) {
    throw new Error(`NotebookLM source add returned non-JSON output for slide ${entry.index}:\n${result.stdout}\n${error.message}`);
  }
}

function responsePathFor(entry) {
  return path.join(outputRoot, "responses", `slide-${String(entry.index).padStart(3, "0")}.json`);
}

function injectedPathFor(entry) {
  return path.join(outputRoot, "injected-sources", `slide-${String(entry.index).padStart(3, "0")}.json`);
}

function sleep(ms) {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
}

function validateAnswer(answer, entry) {
  if ((answer.match(/[가-힣]/g) || []).length < 180) throw new Error(`Suspiciously short answer for slide ${entry.index}`);
  if (/^\s*[-*]\s/m.test(answer) || /\[[0-9]+/.test(answer) || containsEmoji(answer)) {
    throw new Error(`Answer format rejected for slide ${entry.index}`);
  }
  const explanatoryPhrases = [
    "제목 그대로",
    "여기서는",
    "기준점으로 잡고",
    "오늘 슬라이드",
    "화면의 제목",
    "청중에게 확인할 질문은",
    "다음 흐름으로",
    "풀어 보겠습니다",
  ];
  const found = explanatoryPhrases.find((phrase) => answer.includes(phrase));
  if (found) throw new Error(`Answer sounds explanatory for slide ${entry.index}: ${found}`);
}

function markdownFor(data) {
  const lines = [
    "# kimai-workshop-content 발표 스크립트",
    "",
    "목적: 일반인 대상 강의에서 발표자가 슬라이드별로 말할 내용을 실제 원고와 키워드 진행 큐로 확인하고 수정하기 위한 문서.",
    "원천 문서: slide-spec.json",
    "관련 산출물: presentation-script.json, presenter-review.html, deck.html, speaker.html",
    "",
    `Generated: ${new Date().toISOString()}`,
    "",
  ];
  for (const entry of data.slides) {
    lines.push(`## ${entry.index}. ${entry.title}`, "");
    lines.push(`- Slide ID: \`${entry.id}\``);
    lines.push(`- Section: ${entry.section}`);
    lines.push(`- Estimated minutes: ${entry.estimatedMinutes}`, "");
    lines.push("### 발표 원고", "", entry.script, "");
    lines.push("### 키워드 진행 큐", "");
    for (const cue of entry.keywordFlow) lines.push(`- **${cue.label}**: ${cue.cue} - ${cue.say}`);
    lines.push("", "### 청중에게 던질 질문/행동", "", entry.interactionPrompt, "");
    lines.push("### 다음 장 연결", "", entry.transition, "");
  }
  return `${lines.join("\n")}\n`;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const spec = readJson(path.join(deckDir, "slide-spec.json"));
  const scriptPath = path.join(deckDir, "presentation-script.json");
  const markdownPath = path.join(deckDir, "presentation-script.md");
  const script = readJson(scriptPath);
  const specById = new Map(spec.slides.map((slide) => [slide.id, slide]));
  const targets = script.slides.filter((entry) => entry.index >= args.from && entry.index <= args.to);
  if (targets.length !== args.to - args.from + 1) throw new Error(`Expected ${args.to - args.from + 1} target slides, got ${targets.length}`);

  fs.mkdirSync(path.join(outputRoot, "prompts"), { recursive: true });
  fs.mkdirSync(path.join(outputRoot, "responses"), { recursive: true });
  fs.mkdirSync(path.join(outputRoot, "injected-sources"), { recursive: true });
  const previousRewrittenScripts = [];

  for (const entry of targets) {
    const slide = specById.get(entry.id);
    if (!slide) throw new Error(`Missing spec slide for ${entry.id}`);
    const previous = script.slides[entry.index - 2] || null;
    const next = script.slides[entry.index] || null;
    const prompt = buildPrompt({ slide, entry, previous, next, previousRewrittenScripts, compactPrompt: args.compactPrompt });
    const promptPath = path.join(outputRoot, "prompts", `slide-${String(entry.index).padStart(3, "0")}.txt`);
    fs.writeFileSync(promptPath, prompt);

    const responsePath = responsePathFor(entry);
    let answer = "";
    if (!args.force && fs.existsSync(responsePath)) {
      const saved = readJson(responsePath);
      answer = clean(saved.appliedScript || "");
      validateAnswer(answer, entry);
      console.log(`Reusing saved response for slide ${entry.index}: ${entry.id}`);
    } else {
      console.log(`Requesting slide ${entry.index}: ${entry.id}`);
      const tmpPrompt = path.join(os.tmpdir(), `kimai-notebooklm-slide-${String(entry.index).padStart(3, "0")}.txt`);
      fs.writeFileSync(tmpPrompt, prompt);
      const response = runNotebookLm(tmpPrompt, args.notebookId, args.freshChat);
      fs.rmSync(tmpPrompt, { force: true });
      answer = stripNotebookLmAnswer(response.answer || "");
      validateAnswer(answer, entry);
      fs.writeFileSync(
        responsePath,
        `${JSON.stringify({ slideIndex: entry.index, id: entry.id, requestedAt: new Date().toISOString(), response, appliedScript: answer }, null, 2)}\n`,
      );
    }
    if (args.injectGeneratedSources && !args.dryRun) {
      const injectedPath = injectedPathFor(entry);
      if (!args.force && fs.existsSync(injectedPath)) {
        console.log(`Reusing saved source injection record for slide ${entry.index}: ${entry.id}`);
      } else {
        const injectedSource = addGeneratedScriptSource({ notebookId: args.notebookId, entry, script: answer });
        fs.writeFileSync(
          injectedPath,
          `${JSON.stringify({ slideIndex: entry.index, id: entry.id, injectedAt: new Date().toISOString(), injectedSource }, null, 2)}\n`,
        );
        sleep(12000);
      }
    }
    previousRewrittenScripts.push({ index: entry.index, title: entry.title, script: answer });
    if (!args.dryRun) {
      entry.script = answer;
      entry.sourceSpeakerNote = entry.sourceSpeakerNote || "";
      script.updatedAt = new Date().toISOString();
      writeJson(scriptPath, script);
      fs.writeFileSync(markdownPath, markdownFor(script));
    }
  }
}

main();
