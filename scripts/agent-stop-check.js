#!/usr/bin/env node
const fs = require("node:fs");
const path = require("node:path");

const PROJECT_ROOT = path.resolve(__dirname, "..");
const STATUS_PATH = path.join(PROJECT_ROOT, ".agent-status.json");
const TERMINAL_STATUSES = new Set(["finished", "blocked", "failed", "askuserQuestion"]);
const DEFAULT_STATUS = {
  status: "processing",
  attempts: 0,
  max_block_attempts: 3,
  stop_hook_active: false,
};

const QUESTION_PATTERNS = [
  /사용자(?:의)?\s*(?:판단|확인|입력|답변|선택|질문).*(?:필요|대기)/i,
  /(?:need|needs|requires?)\s+(?:user|your)\s+(?:input|decision|confirmation)/i,
  /(?:어떻게|어느|무엇을|어떤).*\?/,
];
const REMAINING_WORK_PATTERNS = [
  /"status"\s*:\s*"(?:pending|in_progress)"/i,
  /\b(?:pending|in_progress|todo|fixme)\b/i,
  /\b(?:remaining|unfinished|incomplete|unresolved)\s+(?:work|task|plan|step|item|risk|issue)s?\b/i,
  /\b(?:still|next)\s+(?:need|needs|step|work|task|run|verify|check|implement|update|fix)\b/i,
  /(?:남은|남아\s*있는)\s*(?:작업|계획|할\s*일|항목|수정|구현|확인|검증|이슈)/i,
  /(?:아직|계속)\s*(?:해야|진행|작업|수정|구현|확인|검증)/i,
  /미완료|미해결|진행\s*중|대기\s*중/i,
];
const NO_REMAINING_WORK_PATTERNS = [
  /남은\s*(?:작업|계획|할\s*일|위험|리스크)\s*[:：]?\s*(?:없음|없습니다|없다|0개|none)/i,
  /(?:no|none)\s+(?:remaining|unfinished|incomplete|unresolved)\s+(?:work|task|plan|risk|issue)s?/i,
  /remaining\s+risk\s*[:：]?\s*(?:none|no)/i,
];
const BLOCK_REASON = [
  "남은 작업이나 진행 중인 계획이 감지되었습니다.",
  "final 답변을 쓰지 말고 남은 작업을 계속 진행하세요.",
  "더 진행할 수 없거나 사용자 판단이 필요하면 askuserQuestion, blocked, failed 중 맞는 상태로 전환한 뒤 통과시키세요.",
].join(" ");

function readHookInput() {
  try {
    const raw = fs.readFileSync(0, "utf8").trim();
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writeJson(payload) {
  process.stdout.write(`${JSON.stringify(payload)}\n`);
}

function allow(reason) {
  writeJson({
    decision: "allow",
    continue: true,
    ...(reason ? { reason } : {}),
  });
}

function block(reason) {
  writeJson({
    decision: "block",
    continue: false,
    reason,
    systemMessage: reason,
  });
}

function readStatus() {
  try {
    return { ...DEFAULT_STATUS, ...JSON.parse(fs.readFileSync(STATUS_PATH, "utf8")) };
  } catch {
    return { ...DEFAULT_STATUS, started_at: new Date().toISOString() };
  }
}

function writeStatus(status) {
  const safeStatus = {
    status: status.status,
    attempts: Number(status.attempts) || 0,
    max_block_attempts: Number(status.max_block_attempts) || DEFAULT_STATUS.max_block_attempts,
    stop_hook_active: Boolean(status.stop_hook_active),
    session_id: status.session_id,
    started_at: status.started_at,
    last_checked_at: status.last_checked_at,
    finished_at: status.finished_at,
    blocked_at: status.blocked_at,
    failed_at: status.failed_at,
    askuser_at: status.askuser_at,
    last_reason: status.last_reason,
  };
  fs.writeFileSync(STATUS_PATH, `${JSON.stringify(safeStatus, null, 2)}\n`, "utf8");
}

function readTranscriptText(transcriptPath) {
  if (!transcriptPath || typeof transcriptPath !== "string") {
    return "";
  }

  const resolvedPath = path.resolve(transcriptPath);
  let raw = "";
  try {
    raw = fs.readFileSync(resolvedPath, "utf8");
  } catch {
    return "";
  }

  const lines = raw.trim().split(/\n+/).slice(-80);
  const chunks = [];

  for (const line of lines) {
    try {
      const entry = JSON.parse(line);
      if (entry.type === "response_item" && entry.payload) {
        const payload = entry.payload;
        if (payload.role === "user") {
          continue;
        }
        const callName = String(payload.name || payload.call_name || payload.tool_name || "");
        if (/update_plan|plan/i.test(callName)) {
          chunks.push(extractText(payload.arguments || payload.input || ""));
          continue;
        }
        if (payload.role === "assistant") {
          chunks.push(extractText(payload.content || payload.output || ""));
        }
        continue;
      }

      const message = entry.message || entry;
      const role = message.role || entry.role;
      if (role !== "assistant") {
        continue;
      }
      chunks.push(extractText(message.content || entry.content || entry.result || ""));
    } catch {
      continue;
    }
  }

  return chunks.filter(Boolean).join("\n").slice(-24000);
}

function extractText(value) {
  if (typeof value === "string") {
    return value;
  }
  if (Array.isArray(value)) {
    return value.map(extractText).filter(Boolean).join("\n");
  }
  if (value && typeof value === "object") {
    if (typeof value.text === "string") {
      return value.text;
    }
    if (typeof value.content === "string") {
      return value.content;
    }
    try {
      return JSON.stringify(value);
    } catch {
      return "";
    }
  }
  return "";
}

function hasAnyPattern(text, patterns) {
  return patterns.some((pattern) => pattern.test(text));
}

function hasNoRemainingWorkStatement(text) {
  return NO_REMAINING_WORK_PATTERNS.some((pattern) => pattern.test(text));
}

function stripNoRemainingWorkLines(text) {
  return text
    .split(/\n+/)
    .filter((line) => !hasNoRemainingWorkStatement(line))
    .join("\n");
}

function hasRemainingWork(text) {
  const filteredText = stripNoRemainingWorkLines(text);
  return REMAINING_WORK_PATTERNS.some((pattern) => pattern.test(filteredText));
}

function hasExplicitCompletionStatement(text) {
  return hasNoRemainingWorkStatement(text);
}

function evaluateEvidence(hookInput) {
  const transcriptText = readTranscriptText(
    hookInput.transcript_path || hookInput.transcriptPath || hookInput.transcript?.path,
  );
  const responseText = [
    extractText(hookInput.response || hookInput.assistant_response || hookInput.last_response || ""),
    transcriptText,
  ].filter(Boolean).join("\n");

  if (!responseText.trim()) {
    return {
      outcome: "finished",
      reason: "Hook 입력에서 남은 작업 신호를 확인할 수 없어 통과합니다.",
    };
  }

  if (hasAnyPattern(responseText, QUESTION_PATTERNS)) {
    return { outcome: "askuserQuestion", reason: "사용자 판단이나 추가 입력이 필요합니다." };
  }

  if (hasExplicitCompletionStatement(responseText)) {
    return { outcome: "finished", reason: "남은 작업이 없다는 명시적 완료 보고를 확인했습니다." };
  }

  if (hasRemainingWork(responseText)) {
    return { outcome: "block", reason: BLOCK_REASON };
  }

  return { outcome: "finished" };
}

function hookSessionId(hookInput) {
  return hookInput.session_id || hookInput.sessionId;
}

function hookTranscriptPath(hookInput) {
  return hookInput.transcript_path || hookInput.transcriptPath || hookInput.transcript?.path;
}

function isCurrentHookStatus(status, hookInput) {
  const currentSessionId = hookSessionId(hookInput);
  if (!currentSessionId || !status.session_id) {
    return false;
  }
  return status.session_id === currentSessionId;
}

function main() {
  const hookInput = readHookInput();
  let status = readStatus();
  const currentSessionId = hookSessionId(hookInput);

  if (TERMINAL_STATUSES.has(status.status) && isCurrentHookStatus(status, hookInput)) {
    allow();
    return;
  }

  if (
    TERMINAL_STATUSES.has(status.status) ||
    (status.session_id && currentSessionId && status.session_id !== currentSessionId)
  ) {
    status = {
      ...DEFAULT_STATUS,
      started_at: new Date().toISOString(),
    };
  }

  status.session_id = status.session_id || currentSessionId;
  if (status.stop_hook_active) {
    allow("중복 Stop hook 검문을 건너뜁니다.");
    return;
  }

  status.stop_hook_active = true;
  status.last_checked_at = new Date().toISOString();
  writeStatus(status);

  try {
    const evidence = evaluateEvidence(hookInput);

    if (evidence.outcome === "finished") {
      status.status = "finished";
      status.stop_hook_active = false;
      status.finished_at = new Date().toISOString();
      status.last_reason = evidence.reason;
      writeStatus(status);
      allow();
      return;
    }

    if (evidence.outcome === "askuserQuestion") {
      status.status = "askuserQuestion";
      status.stop_hook_active = false;
      status.askuser_at = new Date().toISOString();
      status.last_reason = evidence.reason;
      writeStatus(status);
      allow();
      return;
    }

    status.attempts = (Number(status.attempts) || 0) + 1;
    status.last_reason = evidence.reason;

    if (status.attempts >= (Number(status.max_block_attempts) || DEFAULT_STATUS.max_block_attempts)) {
      status.status = "blocked";
      status.stop_hook_active = false;
      status.blocked_at = new Date().toISOString();
      writeStatus(status);
      allow("반복 제한에 도달해 Stop hook을 통과시킵니다. 최종 응답에서 남은 작업을 보고하세요.");
      return;
    }

    status.stop_hook_active = false;
    writeStatus(status);
    block(evidence.reason);
  } catch (error) {
    status.status = "failed";
    status.stop_hook_active = false;
    status.failed_at = new Date().toISOString();
    status.last_reason = error && error.message ? error.message : "Stop hook 검사 중 알 수 없는 오류가 발생했습니다.";
    writeStatus(status);
    allow(status.last_reason);
  }
}

main();
