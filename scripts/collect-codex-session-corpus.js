#!/usr/bin/env node
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const readline = require("node:readline");
const { spawnSync } = require("node:child_process");

const root = path.resolve(__dirname, "..");
const projectRoot = root;
const sessionRoot = path.join(os.homedir(), ".codex", "sessions");
const memoryPath = path.join(os.homedir(), ".codex", "memories", "MEMORY.md");
const harnessDir = path.join(root, "docs", "harness");
const inventoryPath = path.join(harnessDir, "codex-session-inventory.md");
const sourceMapPath = path.join(harnessDir, "codex-session-source-map.json");
const decisionLogPath = path.join(harnessDir, "codex-session-decision-log.md");
const expectedTopLevelSessions = 4;

const KEYWORDS = [
  "research_ai",
  "lecture-cuts",
  "lecture-deck",
  "deck-harness",
  "발표자료",
  "강의",
  "워크숍",
  "하네스",
  "에이전트",
  "스킬",
  "검증",
  "근거",
  "handoff",
  "glossary",
  "source",
  "slide",
  "topic-to-deck",
];

function walkJsonlFiles(dir) {
  if (!fs.existsSync(dir)) {
    return [];
  }
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      return walkJsonlFiles(fullPath);
    }
    return entry.isFile() && entry.name.endsWith(".jsonl") ? [fullPath] : [];
  });
}

function readFirstLine(filePath) {
  const fd = fs.openSync(filePath, "r");
  try {
    const chunkSize = 1024 * 1024;
    const buffer = Buffer.alloc(chunkSize);
    const bytesRead = fs.readSync(fd, buffer, 0, chunkSize, 0);
    return buffer.subarray(0, bytesRead).toString("utf8").split("\n")[0];
  } finally {
    fs.closeSync(fd);
  }
}

function parseFirstMeta(filePath) {
  const firstLine = readFirstLine(filePath);
  if (!firstLine.trim()) {
    return null;
  }
  try {
    const event = JSON.parse(firstLine);
    if (event.type !== "session_meta") {
      return null;
    }
    const payload = event.payload || {};
    const spawn = payload.source?.subagent?.thread_spawn || {};
    return {
      id: payload.id || path.basename(filePath, ".jsonl"),
      timestamp: payload.timestamp || event.timestamp || "",
      cwd: payload.cwd || "",
      originator: payload.originator || "",
      threadSource: payload.thread_source || "",
      parentThreadId: spawn.parent_thread_id || "",
      agentNickname: payload.agent_nickname || spawn.agent_nickname || "",
      agentRole: payload.agent_role || spawn.agent_role || "",
      filePath,
    };
  } catch (error) {
    return null;
  }
}

function getTextFromMessagePayload(payload) {
  const content = payload?.content;
  if (!Array.isArray(content)) {
    return "";
  }
  return content
    .map((part) => part?.text || part?.input_text || part?.output_text || "")
    .filter(Boolean)
    .join("\n");
}

function compactText(text, maxLength = 420) {
  const compacted = String(text || "")
    .replace(/\s+/g, " ")
    .trim();
  if (compacted.length <= maxLength) {
    return compacted;
  }
  return `${compacted.slice(0, maxLength - 3)}...`;
}

function isRelevantText(text) {
  const lower = String(text || "").toLowerCase();
  return KEYWORDS.some((keyword) => lower.includes(keyword.toLowerCase()));
}

function addCapped(list, value, limit) {
  if (value && list.length < limit) {
    list.push(value);
  }
}

async function scanTranscript(filePath) {
  const summary = {
    userMessages: [],
    assistantMessages: [],
    relevantMessages: [],
    commands: [],
    commitRefs: [],
    warnings: [],
    lineCount: 0,
  };

  const stream = fs.createReadStream(filePath, { encoding: "utf8" });
  const rl = readline.createInterface({ input: stream, crlfDelay: Infinity });

  for await (const line of rl) {
    summary.lineCount += 1;
    if (!line.trim()) {
      continue;
    }

    let event;
    try {
      event = JSON.parse(line);
    } catch (error) {
      continue;
    }

    if (event.type === "response_item") {
      const payload = event.payload || {};
      if (payload.type === "message") {
        const text = compactText(getTextFromMessagePayload(payload), 700);
        if (payload.role === "user") {
          addCapped(summary.userMessages, text, 12);
        }
        if (payload.role === "assistant") {
          addCapped(summary.assistantMessages, text, 12);
        }
        if (isRelevantText(text)) {
          addCapped(summary.relevantMessages, text, 18);
        }
      }

      if (payload.type === "function_call") {
        const argsText = payload.arguments || "";
        if (payload.name === "exec_command" && /git commit|node |rg |npm |pnpm /.test(argsText)) {
          addCapped(summary.commands, compactText(argsText, 300), 20);
        }
      }

      if (payload.type === "function_call_output") {
        const output = typeof payload.output === "string" ? payload.output : JSON.stringify(payload.output || "");
        const commitMatches = output.match(/\[[^\]]+\s+([0-9a-f]{7,40})\]\s+([^\n]+)/g) || [];
        for (const match of commitMatches) {
          addCapped(summary.commitRefs, compactText(match, 180), 20);
        }
        if (/WARN|FAIL|error|오류|누락|부족|위험/i.test(output)) {
          addCapped(summary.warnings, compactText(output, 300), 20);
        }
      }
    }

    if (event.type === "event_msg") {
      const message = event.payload?.message || "";
      if (isRelevantText(message)) {
        addCapped(summary.relevantMessages, compactText(message, 500), 18);
      }
    }
  }

  return summary;
}

function getGitCommits() {
  const result = spawnSync("git", ["log", "--oneline", "--decorate=short", "-20"], {
    cwd: root,
    encoding: "utf8",
  });
  if (result.status !== 0) {
    return [];
  }
  return result.stdout
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function discoverSessionNotes() {
  const notesDir = path.join(root, "session-notes");
  if (!fs.existsSync(notesDir)) {
    return [];
  }
  return fs
    .readdirSync(notesDir)
    .filter((name) => name.endsWith(".md"))
    .map((name) => {
      const notePath = path.join(notesDir, name);
      const text = fs.readFileSync(notePath, "utf8");
      return {
        path: path.relative(root, notePath),
        title: text.split("\n").find((line) => line.startsWith("# "))?.replace(/^#\s+/, "") || name,
      };
    });
}

function getMemoryRefs() {
  if (!fs.existsSync(memoryPath)) {
    return [];
  }
  const text = fs.readFileSync(memoryPath, "utf8");
  const lines = text.split("\n");
  const refs = [];
  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    if (/research_ai|lecture-deck|deck-harness|html_css/i.test(line)) {
      refs.push({
        line: index + 1,
        text: compactText(line, 240),
      });
    }
  }
  return refs.slice(0, 24);
}

function deriveSessionDecisions(session) {
  const combined = [
    ...session.scan.userMessages,
    ...session.scan.assistantMessages,
    ...session.scan.relevantMessages,
  ].join("\n");
  const decisions = [];
  const risks = [];

  if (/4시간|워크숍/.test(combined)) {
    decisions.push("4시간 워크숍 기준으로 강의 자료 흐름과 검증 기준을 맞춘다.");
  }
  if (/lecture-cuts/.test(combined)) {
    decisions.push("lecture-cuts/를 현재 강의 본편 또는 golden reference로 다룬다.");
  }
  if (/lecture-deck/.test(combined)) {
    decisions.push("lecture-deck/는 재사용 가능한 HTML/CSS deck harness 샘플로 취급한다.");
  }
  if (/glossary|용어|tooltip|툴팁/i.test(combined)) {
    decisions.push("일반인이 모를 개발 용어와 영문 표현은 glossary/tooltip으로 설명한다.");
  }
  if (/근거|source|출처|공식/i.test(combined)) {
    decisions.push("기술적 주장과 공식 API/도구 설명은 출처와 확인 날짜를 남긴다.");
  }
  if (/agent|subagent|에이전트/i.test(combined)) {
    decisions.push("조사, 검증, 비판, handoff는 역할별 에이전트로 분리한다.");
  }
  if (/harness|하네스|검증/i.test(combined)) {
    decisions.push("자료 생성은 일회성 편집이 아니라 반복 가능한 harness와 gate로 관리한다.");
  }
  if (/step by step|천천히 생각|단계별/i.test(combined)) {
    decisions.push("추론 관련 문구는 한국어 중심으로 설명하고 필요한 곳에 원문을 병기한다.");
  }

  if (/WARN|FAIL|overflow|누락|부족|겹치|중복|partial|pressure|두가지/i.test(combined)) {
    risks.push("대화 중 발견된 경고, 중복, tooltip 부분 매칭, overflow, 출처 누락 이슈를 회귀 검증에 포함해야 한다.");
  }
  if (/mock|TODO|partial/i.test(combined)) {
    risks.push("미완성 placeholder나 mock 산출물은 handoff 전에 차단해야 한다.");
  }

  return {
    decisions: [...new Set(decisions)],
    risks: [...new Set(risks)],
  };
}

function markdownList(items, fallback = "- none") {
  if (!items || items.length === 0) {
    return fallback;
  }
  return items.map((item) => `- ${item}`).join("\n");
}

function buildInventory({ topLevelSessions, subagentSessions, sessionNotes, memoryRefs, gitCommits }) {
  const status = topLevelSessions.length === expectedTopLevelSessions ? "PASS" : "NEEDS-REVIEW";
  const lines = [];
  lines.push("# Codex Session Inventory");
  lines.push("");
  lines.push(`Generated: ${new Date().toISOString()}`);
  lines.push(`Project root: ${projectRoot}`);
  lines.push(`Discovery criterion: session_meta.cwd equals project root.`);
  lines.push("");
  lines.push("## Summary");
  lines.push("");
  lines.push(`Status: ${status}`);
  lines.push(`Expected top-level sessions: ${expectedTopLevelSessions}`);
  lines.push(`Top-level sessions discovered: ${topLevelSessions.length}`);
  lines.push(`Subagent sessions discovered: ${subagentSessions.length}`);
  lines.push("");

  if (topLevelSessions.length !== expectedTopLevelSessions) {
    lines.push("## Discovery Mismatch");
    lines.push("");
    lines.push("- Manual selection is required before downstream deck-harness generation.");
    lines.push("- Do not treat this corpus as complete until the mismatch is resolved.");
    lines.push("");
  }

  topLevelSessions.forEach((session, index) => {
    lines.push(`## Session ${index + 1}: ${session.id}`);
    lines.push("");
    lines.push(`Status: included`);
    lines.push(`Date: ${session.timestamp || "unknown"}`);
    lines.push(`Raw transcript path: ${session.filePath}`);
    lines.push(`Related commits: ${session.scan.commitRefs.length ? session.scan.commitRefs.join("; ") : "not detected in transcript scan"}`);
    lines.push("");
    lines.push("### 발견");
    lines.push(markdownList(session.scan.userMessages.slice(0, 4).map((text) => compactText(text, 260))));
    lines.push("");
    lines.push("### 수행");
    lines.push(markdownList(session.scan.assistantMessages.slice(0, 4).map((text) => compactText(text, 260))));
    lines.push("");
    lines.push("### 판단");
    lines.push(markdownList(session.decisions));
    lines.push("");
    lines.push("### 미해결");
    lines.push(markdownList(session.risks, "- 명시적으로 추출된 미해결 위험 없음. downstream agent가 원문과 repo artifact로 재확인해야 함."));
    lines.push("");
    lines.push("### 근거");
    lines.push(`- ${session.filePath} - raw Codex JSONL transcript`);
    if (sessionNotes.length) {
      for (const note of sessionNotes) {
        lines.push(`- ${note.path} - local session note`);
      }
    }
    lines.push("");
  });

  lines.push("## Excluded Subagent Sessions");
  lines.push("");
  if (subagentSessions.length === 0) {
    lines.push("- none");
  } else {
    for (const session of subagentSessions) {
      const parentIncluded = topLevelSessions.some((parent) => parent.id === session.parentThreadId);
      lines.push(`- ${session.id}: excluded-subagent, parent=${session.parentThreadId || "unknown"}, parentIncluded=${parentIncluded ? "yes" : "no"}, path=${session.filePath}`);
    }
  }
  lines.push("");

  lines.push("## Session Notes");
  lines.push("");
  lines.push(markdownList(sessionNotes.map((note) => `${note.path}: ${note.title}`)));
  lines.push("");

  lines.push("## Memory Pointers");
  lines.push("");
  lines.push(markdownList(memoryRefs.map((ref) => `MEMORY.md:${ref.line} - ${ref.text}`)));
  lines.push("");

  lines.push("## Recent Git Context");
  lines.push("");
  lines.push(markdownList(gitCommits.slice(0, 10)));
  lines.push("");

  return lines.join("\n");
}

function buildSourceMap({ topLevelSessions, subagentSessions, sessionNotes, memoryRefs }) {
  return {
    generatedAt: new Date().toISOString(),
    projectRoot,
    expectedTopLevelSessions,
    actualTopLevelSessions: topLevelSessions.length,
    status: topLevelSessions.length === expectedTopLevelSessions ? "PASS" : "NEEDS_REVIEW",
    sessions: topLevelSessions.map((session, index) => ({
      id: session.id,
      status: "included",
      date: session.timestamp,
      rawPath: session.filePath,
      summaryPath: `docs/harness/codex-session-inventory.md#session-${index + 1}-${session.id.toLowerCase()}`,
      repoArtifacts: [
        "session-notes/2026-05-23-ai-harness-automation-workflow.md",
        "docs/harness/html-css-deck-automation-harness-v1.md",
        "docs/superpowers/plans/2026-05-25-lecture-cuts-agent-harness-plan.md",
      ].filter((artifact) => fs.existsSync(path.join(root, artifact))),
      decisionsExtracted: session.decisions.map((_, decisionIndex) => `${session.id}-decision-${String(decisionIndex + 1).padStart(3, "0")}`),
      risksExtracted: session.risks.map((_, riskIndex) => `${session.id}-risk-${String(riskIndex + 1).padStart(3, "0")}`),
    })),
    subagentSessions: subagentSessions.map((session) => ({
      id: session.id,
      status: "excluded-subagent",
      parentThreadId: session.parentThreadId || null,
      rawPath: session.filePath,
      agentNickname: session.agentNickname || null,
      agentRole: session.agentRole || null,
    })),
    sessionNotes,
    memoryReferences: memoryRefs,
  };
}

function buildDecisionLog({ topLevelSessions }) {
  const stable = [];
  const risks = [];
  for (const session of topLevelSessions) {
    for (const decision of session.decisions) {
      stable.push(`${decision} (source: ${session.id})`);
    }
    for (const risk of session.risks) {
      risks.push(`${risk} (source: ${session.id})`);
    }
  }

  const stableUnique = [...new Set(stable)];
  const risksUnique = [...new Set(risks)];
  const lines = [];
  lines.push("# Codex Session Decision Log");
  lines.push("");
  lines.push(`Generated: ${new Date().toISOString()}`);
  lines.push("");
  lines.push("## Stable Decisions");
  lines.push("");
  lines.push(markdownList(stableUnique, "- No stable decisions extracted. Review raw transcripts before continuing."));
  lines.push("");
  lines.push("## Superseded Decisions");
  lines.push("");
  lines.push("- Earlier sample-only harness expectations are superseded by the reusable topic-to-deck workflow requirement.");
  lines.push("- A non-empty HANDOFF.md check is superseded by a parsed reproduction contract with commands, risks, and evidence paths.");
  lines.push("- Native browser title tooltip behavior is superseded by the custom glossary tooltip requirement.");
  lines.push("");
  lines.push("## Quality Failures Observed");
  lines.push("");
  lines.push(markdownList(risksUnique));
  lines.push("");
  lines.push("## User Preferences");
  lines.push("");
  lines.push("- Korean-first explanations for general learners.");
  lines.push("- Technical English terms may appear when useful, but the Korean meaning and original phrase must be clear.");
  lines.push("- Deck work should be evidence-backed, browser-verified, and reproducible through scripts.");
  lines.push("- Agent outputs should be summarized into findings, actions, judgment, unresolved items, and evidence.");
  lines.push("- Reusable workflow, harness, skills, and handoff matter more than one-off slide editing.");
  lines.push("");
  lines.push("## Workflow Requirements");
  lines.push("");
  lines.push("- Collect all four project-level Codex sessions before building generic deck-harness agents or skills.");
  lines.push("- Treat subagent transcripts as supporting evidence tied to their parent session, not as separate top-level user sessions.");
  lines.push("- Use the session source map when a decision, risk, or preference comes from conversation history.");
  lines.push("- Keep generated deck quality gates tied to source maps, slide specs, glossary registry, presenter review, and handoff evidence.");
  lines.push("");
  lines.push("## Open Questions");
  lines.push("");
  if (topLevelSessions.length !== expectedTopLevelSessions) {
    lines.push(`- Expected ${expectedTopLevelSessions} top-level sessions, discovered ${topLevelSessions.length}. Manual session selection is required.`);
  } else {
    lines.push("- None for Task 0A. Downstream tasks still need to inspect the raw transcripts before using a session-derived rule.");
  }
  lines.push("");
  return lines.join("\n");
}

async function collect() {
  const files = walkJsonlFiles(sessionRoot);
  const metas = files.map(parseFirstMeta).filter(Boolean);
  const projectSessions = metas
    .filter((meta) => meta.cwd === projectRoot)
    .sort((a, b) => String(a.timestamp).localeCompare(String(b.timestamp)));

  const topLevelRaw = projectSessions.filter((meta) => meta.threadSource !== "subagent");
  const subagentSessions = projectSessions.filter((meta) => meta.threadSource === "subagent");

  const topLevelSessions = [];
  for (const session of topLevelRaw) {
    const scan = await scanTranscript(session.filePath);
    const extracted = deriveSessionDecisions({ ...session, scan });
    topLevelSessions.push({
      ...session,
      scan,
      decisions: extracted.decisions,
      risks: extracted.risks,
    });
  }

  const sessionNotes = discoverSessionNotes();
  const memoryRefs = getMemoryRefs();
  const gitCommits = getGitCommits();

  fs.mkdirSync(harnessDir, { recursive: true });
  fs.writeFileSync(
    inventoryPath,
    buildInventory({ topLevelSessions, subagentSessions, sessionNotes, memoryRefs, gitCommits }),
    "utf8",
  );
  fs.writeFileSync(
    sourceMapPath,
    `${JSON.stringify(buildSourceMap({ topLevelSessions, subagentSessions, sessionNotes, memoryRefs }), null, 2)}\n`,
    "utf8",
  );
  fs.writeFileSync(decisionLogPath, buildDecisionLog({ topLevelSessions }), "utf8");

  console.log(`Wrote ${path.relative(root, inventoryPath)}`);
  console.log(`Wrote ${path.relative(root, sourceMapPath)}`);
  console.log(`Wrote ${path.relative(root, decisionLogPath)}`);
  console.log(`Top-level sessions discovered: ${topLevelSessions.length}`);
  console.log(`Subagent sessions discovered: ${subagentSessions.length}`);

  if (topLevelSessions.length !== expectedTopLevelSessions) {
    process.exitCode = 1;
  }
}

function checkOutputs() {
  const required = [inventoryPath, sourceMapPath, decisionLogPath];
  const missing = required.filter((filePath) => !fs.existsSync(filePath) || fs.statSync(filePath).size === 0);
  if (missing.length) {
    for (const filePath of missing) {
      console.error(`Missing or empty: ${path.relative(root, filePath)}`);
    }
    process.exit(1);
  }

  const sourceMap = JSON.parse(fs.readFileSync(sourceMapPath, "utf8"));
  if (sourceMap.actualTopLevelSessions !== expectedTopLevelSessions) {
    console.error(`Expected ${expectedTopLevelSessions} top-level sessions, found ${sourceMap.actualTopLevelSessions}`);
    process.exit(1);
  }

  console.log("PASS codex session corpus outputs");
  console.log(`Top-level sessions discovered: ${sourceMap.actualTopLevelSessions}`);
  console.log(`Subagent sessions discovered: ${sourceMap.subagentSessions.length}`);
}

async function main() {
  const args = new Set(process.argv.slice(2));
  if (args.has("--check")) {
    checkOutputs();
    return;
  }
  if (args.has("--help")) {
    console.log("Usage: node scripts/collect-codex-session-corpus.js [--discover|--check]");
    return;
  }
  await collect();
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exit(1);
});
