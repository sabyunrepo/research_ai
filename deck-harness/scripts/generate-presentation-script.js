#!/usr/bin/env node
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..", "..");

function usage() {
  console.error("Usage: node deck-harness/scripts/generate-presentation-script.js <deck-dir>");
  process.exit(1);
}

function resolveDeckDir(input) {
  if (!input) usage();
  return path.isAbsolute(input) ? input : path.join(root, input);
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function writeJson(filePath, data) {
  fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

function sentence(value) {
  const text = String(value || "").trim();
  if (!text) return "";
  return /[.!?。！？습니다다요]$/.test(text) ? text : `${text}.`;
}

function unique(items) {
  return [...new Set(items.map((item) => String(item || "").trim()).filter(Boolean))];
}

function screenBullets(slide) {
  const rewritten = slide.rewrittenScreen || slide.templateRewrite?.screenStructure || {};
  const candidates = [
    ...(slide.bullets || []),
    ...(rewritten.imageAnchors || []),
    ...(rewritten.promiseBullets || []),
    ...(rewritten.evidenceAnchors || []),
    ...(rewritten.supportingAnchors || []),
    ...(rewritten.actionList || []),
    ...(rewritten.criteria || []).map((item) => item.text || item.label || item),
    ...(rewritten.steps || []).map((item) => item.label || item.text || item),
    rewritten.metaphorTerm,
    rewritten.realTerm,
    rewritten.bridgeLine,
  ];
  return unique(candidates).slice(0, 5);
}

function sectionTone(section) {
  if (/Act 0/.test(section)) return "오늘 강의의 세계관을 여는 장입니다.";
  if (/Act 1/.test(section)) return "이제 김아이의 책상 위에 무엇을 올릴지 정합니다.";
  if (/Act 2/.test(section)) return "이제 김아이에게 일을 어떻게 맡길지 정합니다.";
  if (/Act 3/.test(section)) return "이제 매번 지켜야 하는 회사 내규를 다룹니다.";
  if (/Act 4/.test(section)) return "이제 반복되는 일을 매뉴얼로 고정하는 방법을 봅니다.";
  if (/Act 5/.test(section)) return "이제 김아이 혼자가 아니라 역할을 나눈 팀으로 생각합니다.";
  if (/Act 6/.test(section)) return "마지막으로 일이 끝났다고 말하기 전에 확인하는 검문소를 만듭니다.";
  return "이 장의 흐름을 차분히 이어 갑니다.";
}

function audiencePrompt(slide, bullets) {
  const title = slide.title || "";
  if (/실습|직접|해봅니다|연습/.test(title)) {
    return "잠깐 멈추고, 지금 화면의 기준을 여러분의 업무에 그대로 대입해 보겠습니다.";
  }
  if (bullets.length >= 3) {
    return `여기서는 ${bullets.slice(0, 3).join(", ")} 세 가지를 순서대로 짚겠습니다.`;
  }
  if (/빈칸|추측|모르는/.test(`${title} ${slide.message || ""}`)) {
    return "여기서 중요한 질문은 '김아이가 무엇을 모르는 상태인가?'입니다.";
  }
  if (/검증|검문소|확인|증거/.test(`${title} ${slide.message || ""}`)) {
    return "여기서는 말로 완료했다고 하는 것보다, 무엇을 증거로 볼지에 집중합니다.";
  }
  return "이 장에서는 화면의 문장을 먼저 읽고, 바로 업무 상황으로 바꿔 생각해 보겠습니다.";
}

function anchorLineFor(bullets) {
  if (!bullets.length) return "";
  if (bullets.length === 1) {
    return `화면의 "${bullets[0]}" 문구를 짚고, 이 말이 오늘 강의에서 어떤 역할을 하는지 풀어 말하겠습니다.`;
  }
  return `화면에 보이는 ${bullets.slice(0, 4).map((item) => `"${item}"`).join(", ")} 항목을 순서대로 가리키면서 설명하겠습니다.`;
}

function analogyLine(slide) {
  const text = `${slide.title || ""} ${slide.message || ""} ${(slide.glossaryTerms || []).join(" ")}`;
  if (/Act 0/.test(slide.section || "")) {
    return "일반 업무로 바꾸면, 뛰어난 신입사원에게도 상황과 기준을 알려 줘야 결과가 흔들리지 않는다는 뜻입니다.";
  }
  if (/Context|데스크|책상|자료|정보 선별/.test(text)) {
    return "쉽게 말하면, 김아이 책상 위에 이번 일에 필요한 자료만 올려 두는 작업입니다.";
  }
  if (/Prompt|업무 지시|지시/.test(text)) {
    return "쉽게 말하면, 김아이에게 '무엇을, 왜, 어떤 형식으로, 언제 끝난 것으로 볼지'를 알려 주는 업무 지시서입니다.";
  }
  if (/CLAUDE|내규|규칙|사규/.test(text)) {
    return "쉽게 말하면, 한 번만 말하고 끝나는 요청이 아니라 김아이가 매번 지켜야 하는 회사 내규입니다.";
  }
  if (/Skill|매뉴얼|반복/.test(text)) {
    return "쉽게 말하면, 매번 새로 설명하지 않아도 되도록 반복 업무의 순서를 업무 매뉴얼로 묶어 두는 일입니다.";
  }
  if (/Agent|Subagent|역할|팀/.test(text)) {
    return "쉽게 말하면, 김아이 한 명에게 모든 일을 맡기지 않고 조사, 작성, 검토처럼 역할 카드를 나누는 방식입니다.";
  }
  if (/MCP|도구|권한|열쇠/.test(text)) {
    return "쉽게 말하면, 역할마다 사용할 수 있는 도구 열쇠를 다르게 주는 권한 설계입니다.";
  }
  if (/Hook|Evaluation|Quality Gate|검증|검문소|증거/.test(text)) {
    return "쉽게 말하면, 김아이가 '끝났습니다'라고 말했을 때 바로 믿지 않고 증거를 확인하는 검문소입니다.";
  }
  return "일반 업무로 바꾸면, 뛰어난 신입사원에게도 상황과 기준을 알려 줘야 결과가 흔들리지 않는다는 뜻입니다.";
}

function deliveryTips(slide) {
  const tips = ["슬라이드 문장을 그대로 길게 읽지 말고, 김아이 비유로 한 번 풀어 말한다."];
  if ((slide.glossaryTerms || []).length) {
    tips.push(`전문 용어는 ${slide.glossaryTerms.join(", ")} 라벨로 짧게 연결하고, 설명은 회사 업무 비유를 우선한다.`);
  }
  if (slide.visualAssetId || slide.visualIntent) {
    tips.push("이미지는 장식이 아니라 설명 순서의 앵커로 사용한다.");
  }
  if (/실습|practice/i.test(slide.id) || /실습/.test(slide.title || "")) {
    tips.push("실습 안내에서는 정답을 먼저 말하지 말고, 참가자가 판단할 시간을 준다.");
  }
  return tips;
}

function buildScript(slide, index, slides) {
  const previous = slides[index - 1];
  const bullets = screenBullets(slide);
  const title = sentence(slide.title);
  const message = sentence(slide.message);
  const note = sentence(slide.speakerNote);
  const bridge = sentence(slide.bridge);
  const isSectionStart = !previous || previous.section !== slide.section;
  const sectionIntro = isSectionStart ? `${sectionTone(slide.section || "")} ` : "";
  const bulletLine = bullets.length
    ? anchorLineFor(bullets)
    : "";
  const plainRestatement = note && note !== message ? note : message;
  const prompt = audiencePrompt(slide, bullets);
  const transition = bridge || "이 기준을 기억한 채 다음 장으로 넘어가겠습니다.";
  const script = [
    `${sectionIntro}이 슬라이드에서는 ${title}`,
    plainRestatement,
    bulletLine,
    prompt,
    analogyLine(slide),
    transition,
  ]
    .filter(Boolean)
    .join(" ");

  return {
    index: index + 1,
    id: slide.id,
    section: slide.section || "",
    title: slide.title || "",
    estimatedMinutes: slide.estimatedMinutes || 1,
    audience: "AI/개발 비전문가를 포함한 일반 직장인",
    objective: slide.sectionObjective || "",
    speakingGoal: message,
    script,
    interactionPrompt: prompt,
    transition,
    sourceSpeakerNote: slide.speakerNote || "",
    sourcePresenterCues: slide.presenterCues || [],
    screenAnchors: bullets,
    deliveryTips: deliveryTips(slide),
  };
}

function markdownFor(deckSlug, generatedAt, entries) {
  const lines = [
    `# ${deckSlug} 발표 스크립트`,
    "",
    "목적: 일반인 대상 강의에서 발표자가 슬라이드별로 말할 내용을 원고형으로 확인하고 수정하기 위한 문서.",
    "원천 문서: slide-spec.json",
    "수정해야 할 때: 슬라이드 메시지, 발표 흐름, 비유, 실습 브릿지가 바뀔 때",
    "수정하면 안 되는 경우: 슬라이드 원천 메시지를 바꾸지 않고 표현만 다듬는 수준을 넘어서는 내용 추가",
    "관련 산출물: presentation-script.json, presenter-review.html, deck.html",
    "",
    `Generated: ${generatedAt}`,
    "",
  ];
  for (const entry of entries) {
    lines.push(`## ${entry.index}. ${entry.title}`);
    lines.push("");
    lines.push(`- Slide ID: \`${entry.id}\``);
    lines.push(`- Section: ${entry.section}`);
    lines.push(`- Estimated minutes: ${entry.estimatedMinutes}`);
    lines.push("");
    lines.push("### 발표 스크립트");
    lines.push("");
    lines.push(entry.script);
    lines.push("");
    lines.push("### 청중에게 던질 질문/행동");
    lines.push("");
    lines.push(entry.interactionPrompt);
    lines.push("");
    lines.push("### 다음 장 연결");
    lines.push("");
    lines.push(entry.transition);
    lines.push("");
  }
  return `${lines.join("\n")}\n`;
}

function main() {
  const deckDir = resolveDeckDir(process.argv[2]);
  const specPath = path.join(deckDir, "slide-spec.json");
  if (!fs.existsSync(specPath)) {
    throw new Error(`missing slide-spec.json: ${deckDir}`);
  }
  const spec = readJson(specPath);
  const slides = Array.isArray(spec.slides) ? spec.slides : [];
  const generatedAt = new Date().toISOString();
  const deckSlug = path.basename(deckDir);
  const entries = slides.map((slide, index) => buildScript(slide, index, slides));
  const payload = {
    deckSlug,
    generatedAt,
    source: "slide-spec.json",
    audience: "일반인 대상 강의",
    editingContract: {
      editableFields: ["script", "interactionPrompt", "transition", "deliveryTips"],
      preserveFields: ["id", "index", "section", "title"],
    },
    slides: entries,
  };
  writeJson(path.join(deckDir, "presentation-script.json"), payload);
  fs.writeFileSync(path.join(deckDir, "presentation-script.md"), markdownFor(deckSlug, generatedAt, entries), "utf8");
  console.log(`Wrote ${entries.length} slide scripts to ${path.relative(root, deckDir)}/presentation-script.json`);
}

main();
