#!/usr/bin/env node
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const scriptPath = path.join(root, "generated-decks", "kimai-workshop-content", "presentation-script.json");

function normalizeText(value) {
  return String(value || "")
    .replace(/\u00a0/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function fail(message) {
  console.error(`FAIL ${message}`);
  process.exitCode = 1;
}

function tokens(value) {
  return normalizeText(value)
    .replace(/[^\p{Letter}\p{Number}\s]/gu, " ")
    .split(/\s+/)
    .map((token) => token.replace(/(입니다|합니다|했습니다|됩니다|했습니다|였다|이다|으로|로|에게|에서|에는|은|는|이|가|을|를|도|만|과|와)$/u, ""))
    .filter((token) => token.length >= 2);
}

function overlapRatio(source, candidate) {
  const sourceTokens = new Set(tokens(source));
  const candidateTokens = tokens(candidate);
  if (!candidateTokens.length) return 0;
  const matched = candidateTokens.filter((token) => sourceTokens.has(token)).length;
  return matched / candidateTokens.length;
}

function verifyGrounded(entry, item, cueIndex) {
  const cue = normalizeText(item.cue).replace(/…$/, "");
  const say = normalizeText(item.say).replace(/…$/, "");
  if (!cue || !say) {
    fail(`${entry.index}. ${entry.id} cue #${cueIndex + 1} has empty cue or say`);
    return;
  }
}

function hasDanglingCue(cue) {
  const words = normalizeText(cue).split(/\s+/).filter(Boolean);
  if (!words.length) return true;
  const last = words.at(-1);
  return /^(이|그|한|의|어떤|먼저|가장|이번|오늘|자)$/.test(last);
}

function verifyEntry(entry) {
  if (!Array.isArray(entry.keywordFlow)) {
    fail(`${entry.index}. ${entry.id} missing keywordFlow`);
    return;
  }
  if (entry.keywordFlow.length < 1 || entry.keywordFlow.length > 6) {
    fail(`${entry.index}. ${entry.id} keywordFlow should have 1-6 script-derived cues`);
  }
  const stalePatterns = [
    "항목을 읽기보다 무엇을 줄이는 장치인지",
    "김아이가 추측하지 않게 만드는 기준으로 정리합니다",
    "내 업무에 대입할 질문을 던지고",
    "회사 업무 상황으로 바꿔 일반인이 바로 이해하게",
    "지금 장면을 김아이 세계관 안에 놓고 시작합니다",
  ];
  entry.keywordFlow.forEach((item, index) => {
    for (const field of ["label", "cue", "say"]) {
      if (typeof item[field] !== "string" || !item[field].trim()) {
        fail(`${entry.index}. ${entry.id} cue #${index + 1} missing ${field}`);
      }
      if (/TODO|FIXME|TBD|undefined|null|\{\{|\}\}/i.test(item[field])) {
        fail(`${entry.index}. ${entry.id} cue #${index + 1} has placeholder in ${field}`);
      }
    }
    if (item.cue.length > 38) {
      fail(`${entry.index}. ${entry.id} cue #${index + 1} is too long: ${item.cue}`);
    }
    if (hasDanglingCue(item.cue)) {
      fail(`${entry.index}. ${entry.id} cue #${index + 1} looks like a dangling sentence fragment: ${item.cue}`);
    }
    if (item.say.length > 90) {
      fail(`${entry.index}. ${entry.id} say #${index + 1} is too long: ${item.say}`);
    }
    const combined = `${item.cue} ${item.say}`;
    stalePatterns.forEach((pattern) => {
      if (combined.includes(pattern)) {
        fail(`${entry.index}. ${entry.id} cue #${index + 1} keeps stale template phrase: ${pattern}`);
      }
    });
    verifyGrounded(entry, item, index);
  });
}

function main() {
  const payload = JSON.parse(fs.readFileSync(scriptPath, "utf8"));
  const entries = payload.slides || [];
  entries.forEach(verifyEntry);
  if (process.exitCode) return;
  console.log(`PASS keyword outline grounding - ${entries.length} slides`);
}

main();
