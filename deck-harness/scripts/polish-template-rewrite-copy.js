#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..", "..");

const danglingEndings = [
  ["저절로 알지.", "저절로 알지 못합니다."],
  ["점을 보여.", "점을 보여 줍니다."],
  ["보고서 품질을.", "보고서 품질을 높입니다."],
  [" 맡겨 버린다.", " 맡기게 됩니다."],
  ["채운다.", "채우게 됩니다."],
  ["좋아야 한다.", "좋아야 합니다."],
  ["문서다.", "문서입니다."],
  ["정한다.", "정합니다."],
  ["기준이다.", "기준입니다."],
  ["올린다.", "올립니다."],
  ["줄인다.", "줄입니다."],
  ["담는다.", "담습니다."],
  ["구조다.", "구조입니다."],
  ["본다.", "봅니다."],
];

const copyOverrides = {
  "act0-company-context": {
    message: "김아이는 회사, 부서, 상품, 이번 요청을 먼저 알려 줘야 정확히 일합니다.",
  },
  "act0-real-work-analogy": {
    message: "제품, 사용 상황, 보고서 형식이 비면 김아이는 빈칸을 추측으로 채웁니다.",
  },
  "act0-feedback-loop": {
    message: "체크리스트로 문제를 찾고, 피드백으로 고친 뒤, 다시 제출하면서 품질을 높입니다.",
    steps: ["문제 찾기", "수정 정하기", "다시 제출"],
  },
  "act0-journey-map": {
    message: "오늘은 여섯 장치를 차례로 붙여 김아이가 흔들리지 않고 일하게 만듭니다.",
    steps: ["자료", "지시", "내규", "매뉴얼", "역할", "검증"],
  },
  "act1-context-curation-close": {
    criteria: ["바로 쓸 자료", "옆에 둘 자료", "치울 자료"],
  },
  "act2-vague-outcome-risk": {
    message: "대충 던진 지시는 보고서 방향을 김아이의 추측에 맡기게 됩니다.",
  },
  "act2-unspoken-imagination": {
    message: "목적, 자료, 완료 기준이 빠지면 김아이는 자기 방식으로 빈칸을 채웁니다.",
  },
  "act2-input-output-principle": {
    message: "좋은 결과를 원하면 김아이에게 들어가는 지시와 자료부터 선명해야 합니다.",
  },
  "act2-handoff-document": {
    message: "인수인계서는 목표, 자료, 조건, 끝나는 기준을 한 번에 묶어 주는 업무 문서입니다.",
  },
  "act2-goal-use-context": {
    message: "무엇을 만들지, 어디에 쓸지, 무엇을 결정할지가 결과의 방향을 정합니다.",
    rows: [
      ["목표", "무엇을 만들지"],
      ["용도", "어디에 쓸지"],
      ["판단", "무엇을 결정할지"],
      ["형식", "어떻게 남길지"],
    ],
  },
  "act2-materials-conditions": {
    message: "참고 자료와 지켜야 할 조건을 따로 말해야 판단 기준이 흐려지지 않습니다.",
    steps: ["참고 자료", "비교 기준", "제외 조건"],
  },
  "act2-output-done-criteria": {
    message: "형식, 마감, 확인 기준이 있어야 김아이가 끝을 혼자 정하지 않습니다.",
  },
  "act2-prompt-term-mapping": {
    message: "프롬프트는 AI에게 이번 일을 맡길 때 주는 업무 지시입니다.",
  },
  "act2-prompt-reframing": {
    message: "좋은 프롬프트는 문장력보다 일, 자료, 완료 기준이 빠지지 않는 구조입니다.",
  },
  "act2-practice-handoff": {
    message: "실습 화면에서 제품 리뷰자료 보고서 지시를 고치고 피드백을 확인합니다.",
  },
  "act3-act1-context-recover": {
    headline: "Prompt, Context, CLAUDE.md는 서로 다른 자리입니다.",
    message: "Prompt는 지금 지시, Context는 지금 자료, CLAUDE.md는 매번 지킬 내규입니다.",
  },
  "act3-claude-md-fit": {
    message: "이전 작업 자료와 현재 업무가 한 책상에 섞이면 김아이는 기준을 잃습니다.",
  },
  "act3-temporary-info-danger": {
    message: "CLAUDE.md는 적용 범위에 따라 global, user, project, subfolder로 나뉩니다.",
    steps: ["연방법", "주법", "회사 사규", "부서 규칙"],
  },
  "act3-good-rule-board-shape": {
    message: "규칙은 넓은 곳에서 먼저 로드되고, 가까운 폴더 규칙이 더 강하게 적용됩니다.",
    steps: ["넓은 규칙", "회사 규칙", "부서 규칙"],
  },
  "act3-practice-handoff": {
    message: "실습 화면에서 적용 범위를 고르고, CLAUDE.md 초안을 쓴 뒤 과한 내규를 줄입니다.",
  },
  "act4-human-bound-instructions": {
    message: "반복 지시가 사람의 기억에 묶이면 매번 설명이 달라지고 같은 순서를 재사용하기 어렵습니다.",
    steps: ["매번 설명", "표현 흔들림", "순서 유실"],
  },
  "act4-different-instruction-starts": {
    message: "같은 반복 업무라도 지시가 매번 다르면 김아이는 매번 다른 출발선에서 시작합니다.",
    imageAnchors: ["먼저 질문", "바로 작성", "확인 없이 종료"],
  },
  "act4-task-manual-outside": {
    message: "업무 매뉴얼은 반복 순서를 머릿속이 아니라 문서에 고정하는 장치입니다.",
    steps: ["즉흥 판단 금지", "기억 의존 금지", "문서로 고정"],
  },
  "act4-manual-candidate-check": {
    message: "자주 반복되고, 같은 기준이 필요하고, 실수 비용이 큰 일만 매뉴얼 후보입니다.",
  },
  "act4-not-everything-manual": {
    message: "한 번만 할 일이나 기준이 흔들리는 일은 매뉴얼보다 지금 업무 지시로 처리합니다.",
  },
  "act4-manual-start-conditions": {
    message: "매뉴얼은 언제 켜고, 무엇을 확인하고, 언제 멈출지부터 정해야 합니다.",
    steps: ["켜는 요청", "필수 재료", "멈출 조건"],
  },
  "act4-short-procedure": {
    message: "본문은 실행 조건, 작업 단계, 점검 기준, 결과물 형식, 기록만 짧게 둡니다.",
    steps: ["확인 조건", "작업 단계", "점검 기준", "결과 형식", "남길 기록"],
  },
  "act4-manual-supporting-materials": {
    message: "예시, 체크리스트, 판단 기준표, 실행 재료는 본문 밖에 두고 필요할 때 꺼냅니다.",
    rows: [
      ["예시", "따라 볼 샘플"],
      ["점검", "확인할 목록"],
      ["판단", "기준표"],
      ["재료", "실행 자료"],
    ],
  },
  "act4-practice-handoff": {
    message: "실습 화면에서 시작 조건, 절차, 참고 예시, 남길 결과를 가진 Skill을 만듭니다.",
  },
  "act4-to-act5-roles": {
    message: "Skill이 절차를 안정시켜도 조사, 작성, 검토 판단은 역할별로 나누어야 합니다.",
  },
  "act5-new-hires-team": {
    message: "핵심은 사람 수가 아니라 조사, 작성, 검토의 책임 자리를 나누는 것입니다.",
  },
  "act5-agent-term-mapping": {
    message: "역할을 나눠 맡은 작업 단위를 Agent 또는 Subagent라고 부릅니다.",
  },
  "act5-security-permissions": {
    message: "모든 열쇠를 주지 않고 맡은 일에 필요한 권한과 접근 구역만 줍니다.",
  },
  "act6-required-pre-submit-check": {
    message: "결과물을 제출하기 전에는 빠진 항목과 기준 충족 여부를 먼저 확인합니다.",
  },
  "act6-work-log-evidence": {
    rows: [
      ["작업", "무엇을 했는지"],
      ["순서", "어떤 과정인지"],
      ["증거", "무엇이 남았는지"],
      ["결과", "어디서 볼지"],
    ],
  },
  "act6-goal-rubric-check": {
    rows: [
      ["목표", "처음 요청"],
      ["기준", "제출 조건"],
      ["누락", "빠진 항목"],
      ["판정", "통과/보류"],
    ],
  },
  "act6-state-status-file": {
    message: "상태표가 있어야 처리 중, 완료, 실패, 재시도 횟수를 구분할 수 있습니다.",
  },
  "act6-unlock-structure": {
    message: "Act 6은 실제 Stop Hook을 만들 프롬프트와 예제 구조를 여는 단계입니다.",
    steps: ["프롬프트", "설정 예제", "상태 파일", "검문소 코드"],
  },
};

function usage() {
  console.error("Usage: node deck-harness/scripts/polish-template-rewrite-copy.js <deck-dir>");
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function writeJson(file, data) {
  fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
}

function normalizeSentence(text) {
  if (!text) return text;
  let next = text.replace(/\s+/g, " ").trim();
  for (const [from, to] of danglingEndings) {
    if (next.endsWith(from)) next = `${next.slice(0, -from.length)}${to}`;
  }
  return next;
}

function normalizeTermBridge(screen) {
  if (!screen || !screen.realTerm) return;
  const metaphor = String(screen.metaphorTerm || "회사말").trim();
  const realTerm = String(screen.realTerm || "").trim();
  screen.bridgeLine = `${metaphor}와 실제 용어 ${realTerm}를 함께 보여 줍니다.`;
}

function applySlotOverride(screen, override) {
  if (override.steps) {
    screen.steps = override.steps.map((label, index) => ({
      step: String(index + 1).padStart(2, "0"),
      label,
    }));
  }
  if (override.criteria) {
    screen.criteria = override.criteria.map((text, index) => ({
      label: String(index + 1).padStart(2, "0"),
      text,
    }));
  }
  if (override.rows) {
    screen.rows = override.rows.map(([label, text]) => ({ label, text }));
  }
  if (override.imageAnchors) screen.imageAnchors = override.imageAnchors;
  if (override.evidenceAnchors) screen.evidenceAnchors = override.evidenceAnchors;
  if (override.actionList) screen.actionList = override.actionList;
  if (override.mapNodes) screen.mapNodes = override.mapNodes;
}

function bulletsFromScreen(template, screen) {
  if (template === "opening-hero") return screen.promiseBullets || [];
  if (template === "kimai-structure") return screen.imageAnchors || [];
  if (template === "assertion-scene") return screen.evidenceAnchors || [];
  if (template === "term-bridge") return [screen.metaphorTerm, screen.realTerm, screen.bridgeLine].filter(Boolean);
  if (template === "workflow-strip") return (screen.steps || []).map((step) => step.label);
  if (template === "decision-gate") return (screen.criteria || []).map((criterion) => criterion.text);
  if (template === "brief-window") return (screen.rows || []).map((row) => `${row.label}: ${row.text}`);
  if (template === "practice-handoff") return screen.actionList || [];
  if (template === "recap-map") return screen.mapNodes || [];
  if (template === "single-concept") return screen.supportingAnchors || [];
  return [];
}

function componentDataForTemplate(template, screen, slide) {
  if (template === "opening-hero") return { core: "김", cards: ["내규", "자료", "매뉴얼", "도구", "검문소", "증거"] };
  if (template === "kimai-structure") return { imageAnchors: screen.imageAnchors || [], visualAssetId: slide.visualAssetId || "" };
  if (template === "assertion-scene") return { sheetTitle: screen.claimLabel || "요청서", evidenceAnchors: screen.evidenceAnchors || [] };
  if (template === "term-bridge") return { metaphorTerm: screen.metaphorTerm || "", realTerm: screen.realTerm || "", bridgeLine: screen.bridgeLine || "" };
  if (template === "workflow-strip") return { steps: screen.steps || [] };
  if (template === "decision-gate") return { criteria: screen.criteria || [], passLabel: screen.passLabel || "PASS", holdLabel: screen.holdLabel || "HOLD" };
  if (template === "brief-window") return { rows: screen.rows || [] };
  if (template === "practice-handoff") return { actionList: screen.actionList || [] };
  if (template === "recap-map") return { mapNodes: screen.mapNodes || [] };
  if (template === "single-concept") return { keySentence: screen.keySentence || screen.headline || "", supportingAnchors: screen.supportingAnchors || [] };
  return {};
}

function main() {
  const deckDir = process.argv[2] ? path.resolve(root, process.argv[2]) : "";
  if (!deckDir) {
    usage();
    process.exit(2);
  }
  const specPath = path.join(deckDir, "slide-spec.json");
  const spec = readJson(specPath);
  const changed = [];

  spec.slides = spec.slides.map((slide) => {
    const template = slide.mainTemplate || slide.templateRewrite?.selectedTemplate;
    const screen = { ...(slide.rewrittenScreen || slide.templateRewrite?.screenStructure || {}) };
    const before = JSON.stringify({ title: slide.title, message: slide.message, screen });
    const override = copyOverrides[slide.id] || {};

    if (override.headline) screen.headline = override.headline;
    if (override.message) screen.message = override.message;
    if (override.bridge) screen.bridge = override.bridge;
    applySlotOverride(screen, override);

    screen.headline = normalizeSentence(screen.headline || slide.title);
    screen.message = normalizeSentence(screen.message || slide.message);
    screen.bridge = normalizeSentence(screen.bridge || slide.bridge || "");
    normalizeTermBridge(screen);

    const next = {
      ...slide,
      title: screen.headline,
      message: screen.message,
      bridge: screen.bridge || slide.bridge,
      bullets: bulletsFromScreen(template, screen),
      rewrittenScreen: screen,
      templateRewrite: {
        ...(slide.templateRewrite || {}),
        selectedTemplate: template,
        screenStructure: screen,
        componentData: componentDataForTemplate(template, screen, slide),
        copyPolish: {
          version: 1,
          appliedAt: "2026-05-31",
          rule: "template-slot-copy-polish",
        },
      },
    };

    if (JSON.stringify({ title: next.title, message: next.message, screen }) !== before) changed.push(slide.id);
    return next;
  });

  writeJson(specPath, spec);
  console.log(JSON.stringify({ status: "PASS", slideCount: spec.slides.length, changedCount: changed.length, changed }, null, 2));
}

try {
  main();
} catch (error) {
  console.error(`FAIL polish template rewrite copy: ${error.message}`);
  process.exit(1);
}
