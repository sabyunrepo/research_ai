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

const PROJECT_VERIFICATION_COMMANDS = [
  "npm test",
  "npm run qa:practice",
  "node scripts/run-lecture-cuts-hook.js pre-handoff",
];
const ALLOW_EMPTY_EVIDENCE = process.argv.includes("--allow-empty-evidence");
const VERIFICATION_RESULT_PATTERNS = [
  /\b(pass(?:ed|es)?|success|successful|ok|검증\s*(?:통과|완료)|테스트\s*(?:통과|완료)|완료)\b/i,
  /\b(fail(?:ed|ure)?|error|warn(?:ing)?|실패|오류|경고)\b/i,
];
const RESIDUAL_RISK_PATTERNS = [
  /남은\s*(?:위험|리스크|risk)/i,
  /residual\s*risk/i,
  /risk(?:s)?\s*(?:remaining|left)?/i,
  /테스트(?:하지|는 못|를 못)|검증(?:하지|은 못|을 못)/i,
];
const QUESTION_PATTERNS = [
  /사용자(?:의)?\s*(?:판단|확인|입력|답변|선택|질문).*(?:필요|대기)/i,
  /(?:need|needs|requires?)\s+(?:user|your)\s+(?:input|decision|confirmation)/i,
  /(?:어떻게|어느|무엇을|어떤).*\?/,
];
const BLOCK_REASON = "검증 명령 결과와 남은 위험 보고가 없어 완료를 막습니다.";

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
      const message = entry.message || entry;
      const role = message.role || entry.role;
      if (!["assistant", "tool", "tool_result"].includes(role)) {
        continue;
      }
      chunks.push(extractText(message.content || entry.content || entry.result || ""));
    } catch {
      chunks.push(line);
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
  }
  return "";
}

function hasAnyPattern(text, patterns) {
  return patterns.some((pattern) => pattern.test(text));
}

function hasVerificationCommand(text) {
  return PROJECT_VERIFICATION_COMMANDS.some((command) => text.includes(command));
}

function evaluateEvidence(hookInput) {
  const transcriptText = readTranscriptText(
    hookInput.transcript_path || hookInput.transcriptPath || hookInput.transcript?.path,
  );
  const responseText = [
    extractText(hookInput.response || hookInput.assistant_response || hookInput.last_response || ""),
    transcriptText,
  ].filter(Boolean).join("\n");

  if (!responseText.trim() && ALLOW_EMPTY_EVIDENCE) {
    return {
      outcome: "finished",
      reason: "Hook 입력에 마지막 응답이나 transcript가 없어 Codex 경로에서는 빈 증거 오판을 건너뜁니다.",
    };
  }

  if (hasAnyPattern(responseText, QUESTION_PATTERNS)) {
    return { outcome: "askuserQuestion", reason: "사용자 판단이나 추가 입력이 필요합니다." };
  }

  const hasCommand = hasVerificationCommand(responseText);
  const hasResult = hasAnyPattern(responseText, VERIFICATION_RESULT_PATTERNS);
  const hasRisk = hasAnyPattern(responseText, RESIDUAL_RISK_PATTERNS);

  if (hasCommand && hasResult && hasRisk) {
    return { outcome: "finished" };
  }

  return { outcome: "block", reason: BLOCK_REASON };
}

function main() {
  const hookInput = readHookInput();
  let status = readStatus();

  if (TERMINAL_STATUSES.has(status.status)) {
    allow();
    return;
  }

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

    if (status.attempts > (Number(status.max_block_attempts) || DEFAULT_STATUS.max_block_attempts)) {
      status.status = "blocked";
      status.stop_hook_active = false;
      status.blocked_at = new Date().toISOString();
      status.last_reason = [
        evidence.reason,
        "반복 제한에 도달했으므로 block 대신 blocked 상태로 통과합니다. 최종 응답에서 남은 위험과 미완료 검증을 보고하세요.",
      ].join(" ");
      writeStatus(status);
      allow(status.last_reason);
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
