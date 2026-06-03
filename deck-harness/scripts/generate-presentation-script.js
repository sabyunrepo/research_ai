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

function cleanText(value) {
  return String(value || "")
    .replace(/\s+/g, " ")
    .replace(/와 실제 용어 .*?를 함께 보여 줍니다\.?/g, "")
    .trim();
}

function sentence(value) {
  const text = cleanText(value);
  if (!text) return "";
  return /[.!?。！？습니다다요죠까]$/.test(text) ? text : `${text}.`;
}

function stripSentenceEnd(value) {
  return cleanText(value).replace(/[.!?。！？]+$/g, "");
}

function unique(items) {
  return [...new Set(items.map(cleanText).filter(Boolean))];
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
  return unique(candidates)
    .filter((item) => item.length <= 32 && !/함께 보여|selectedTemplate|undefined/.test(item))
    .slice(0, 5);
}

function sectionKey(section = "") {
  if (/Act 0/.test(section)) return "act0";
  if (/Act 1/.test(section)) return "act1";
  if (/Act 2/.test(section)) return "act2";
  if (/Act 3/.test(section)) return "act3";
  if (/Act 4/.test(section)) return "act4";
  if (/Act 5/.test(section)) return "act5";
  if (/Act 6/.test(section)) return "act6";
  if (/Wrap-up/.test(section)) return "wrap";
  return "default";
}

const sectionFrames = {
  act0: {
    opening: "오늘은 AI를 어려운 기계가 아니라 새로 입사한 동료, 김아이로 놓고 시작하겠습니다.",
    analogy: "회사에서도 아무리 똑똑한 신입이라도 회사 상황, 업무 기준, 결과물 형식을 알려 줘야 일을 제대로 합니다.",
    term: "오늘 말하는 하네스는 바로 그 업무 환경, 기준, 피드백 장치를 묶은 이름입니다.",
    question: "여러분 업무에서 신입에게 절대 빠뜨리면 안 되는 정보 하나는 무엇인가요?",
  },
  act1: {
    opening: "첫 단계는 일을 시키기 전에 책상부터 정리하는 것입니다.",
    analogy: "책상 위에 올라온 자료는 김아이의 판단 재료가 되고, 없는 자료는 김아이가 추측으로 채우게 됩니다.",
    term: "이 책상에 해당하는 실제 용어가 컨텍스트이고, 필요한 자료만 고르는 일이 컨텍스트 정리입니다.",
    question: "지금 맡기려는 일에서 김아이가 꼭 봐야 할 자료와 치워야 할 자료는 무엇인가요?",
  },
  act2: {
    opening: "책상을 정리했다면 이제 김아이에게 어떤 일을 맡길지 말해야 합니다.",
    analogy: "좋은 업무 지시는 멋진 문장이 아니라 목표, 자료, 조건, 출력, 완료 기준이 빠지지 않은 작업지시서입니다.",
    term: "AI에게 주는 이런 업무 지시를 프롬프트라고 부릅니다.",
    question: "내가 자주 쓰는 지시문에서 목표, 자료, 완료 기준 중 무엇이 가장 자주 빠지나요?",
  },
  act3: {
    opening: "이번에는 한 번의 요청이 아니라 김아이가 매번 지켜야 하는 회사 내규를 보겠습니다.",
    analogy: "책상 위 자료는 이번 일에만 쓰이고, 내규는 어떤 일을 하든 계속 지켜야 하는 공통 기준입니다.",
    term: "프로젝트에서 이 내규 역할을 하는 문서가 CLAUDE.md 같은 지침 파일입니다.",
    question: "매번 반복해서 설명하는 협업 기준이 있다면, 그것은 일회성 자료인가요, 내규인가요?",
  },
  act4: {
    opening: "이제 반복되는 일을 매번 새로 설명하지 않도록 업무 매뉴얼로 묶어 보겠습니다.",
    analogy: "사람에게만 남아 있는 반복 지시는 담당자가 바뀌면 흔들리지만, 매뉴얼은 시작 조건과 절차를 남깁니다.",
    term: "AI가 읽는 반복 업무 매뉴얼을 여기서는 Skill로 연결해서 보겠습니다.",
    question: "내 업무 중 매번 비슷하게 설명하는 일이 있다면 Skill 후보가 될 수 있을까요?",
  },
  act5: {
    opening: "매뉴얼이 있어도 김아이 한 명에게 모든 일을 맡기면 다시 복잡해집니다.",
    analogy: "회사에서 조사, 작성, 검토, 승인 역할을 나누듯이 AI 작업도 역할 카드를 나누면 판단이 선명해집니다.",
    term: "이렇게 책임을 나눠 맡는 역할 카드를 Agent라고 부릅니다.",
    question: "내 업무에서 조사자, 작성자, 검토자를 한 사람에게 몰아주고 있지는 않나요?",
  },
  act6: {
    opening: "마지막 단계는 김아이 팀이 끝났다고 말했을 때 무엇을 보고 믿을지 정하는 것입니다.",
    analogy: "완료 보고만 듣는 것이 아니라 작업 기록, 기준표, 남은 위험을 보고 통과와 보류를 가르는 검문소를 둡니다.",
    term: "이 완료 직전 자동 검문소를 켜는 대표 장치를 Hook으로 보겠습니다.",
    question: "내 업무에서 완료라고 말하려면 어떤 증거가 반드시 있어야 하나요?",
  },
  wrap: {
    opening: "여기서는 오늘 배운 장치를 내 업무에 어떻게 가져갈지 정리합니다.",
    analogy: "모든 장치를 한꺼번에 붙이는 것보다 자주 흔들리는 지점부터 고치는 편이 현실적입니다.",
    term: "하네스는 거창한 시스템 이름이 아니라, 반복해서 좋은 결과로 돌아오게 만드는 업무 장치입니다.",
    question: "내 업무에서 먼저 고칠 한 지점은 자료, 지시, 규칙, 매뉴얼, 역할, 검증 중 어디입니까?",
  },
  default: {
    opening: "이 장에서는 앞의 흐름을 이어서 다음 판단 기준을 보겠습니다.",
    analogy: "핵심은 김아이가 추측하지 않고 기준에 맞춰 일하게 만드는 것입니다.",
    term: "전문 용어는 업무 비유로 이해한 뒤 이름만 붙이면 됩니다.",
    question: "지금 기준을 여러분 업무에 대입하면 무엇이 달라질지 생각해 보세요.",
  },
};

function frameFor(slide) {
  return sectionFrames[sectionKey(slide.section)] || sectionFrames.default;
}

function isPracticeSlide(slide) {
  return /practice|실습/i.test(`${slide.id || ""} ${slide.title || ""}`);
}

function isSectionStart(index, slides) {
  return index === 0 || slides[index - 1].section !== slides[index].section;
}

function anchorPhrase(anchors) {
  if (!anchors.length) return "";
  if (anchors.length === 1) return `"${anchors[0]}"`;
  if (anchors.length === 2) return `"${anchors[0]}", "${anchors[1]}"`;
  return anchors.slice(0, 4).map((item) => `"${item}"`).join(", ");
}

function visualLine(slide, anchors) {
  if (!anchors.length) {
    return "슬라이드의 그림은 장식이 아니라 지금 설명하는 판단 순서를 보여 주는 표지판으로 보면 됩니다.";
  }
  if (isPracticeSlide(slide)) {
    return `여기서는 ${anchorPhrase(anchors)}를 실습 순서로 잡고, 참가자가 자기 업무에 바로 대입하게 안내하면 됩니다.`;
  }
  if (sectionKey(slide.section) === "act5") {
    return `여기서는 ${anchorPhrase(anchors)}를 보면서 역할 카드가 어떻게 나뉘는지 먼저 잡겠습니다.`;
  }
  if (sectionKey(slide.section) === "act6") {
    return `여기서는 ${anchorPhrase(anchors)}를 보면서 완료 주장보다 어떤 증거를 볼지에 초점을 맞추겠습니다.`;
  }
  return `여기서는 ${anchorPhrase(anchors)}를 기준점으로 잡고, 김아이에게 무엇을 알려 줘야 하는지 풀어 보겠습니다.`;
}

function termLine(slide, frame) {
  const terms = displayTerms(slide).slice(0, 3);
  if (!terms.length) return frame.term;
  return `${frame.term} 오늘 슬라이드의 실제 용어는 ${terms.join(", ")}입니다. 이름을 외우기보다, 어떤 업무 장치를 가리키는지 먼저 잡으면 됩니다.`;
}

function displayTerms(slide) {
  const terms = unique(slide.glossaryTerms || []);
  const isEvaluationSlide = /Evaluation/.test(`${slide.title || ""} ${slide.rewrittenScreen?.realTerm || ""}`);
  if (!isEvaluationSlide && terms.includes("Hook")) {
    return terms.filter((term) => term !== "Evaluation");
  }
  return terms;
}

function interactionPrompt(slide, anchors) {
  if (isPracticeSlide(slide)) {
    return "잠깐 멈추고, 화면의 기준을 여러분 업무 하나에 직접 대입하면 무엇이 달라질까요?";
  }
  const frame = frameFor(slide);
  if (anchors.length >= 3) {
    return `${anchors.slice(0, 3).join(", ")} 중에서 지금 내 업무에 가장 자주 빠지는 항목은 무엇인가요? 하나만 골라 보세요.`;
  }
  return frame.question;
}

function transitionFor(slide) {
  return sentence(slide.bridge) || "이 기준을 기억한 채 다음 장으로 넘어가겠습니다.";
}

function buildNarrativeScript(slide, index, slides, anchors) {
  const frame = frameFor(slide);
  const title = sentence(slide.title);
  const message = sentence(slide.speakerNote || slide.message);
  const transition = transitionFor(slide);
  const opening = isSectionStart(index, slides)
    ? `${frame.opening} `
    : "";
  const practiceLine = isPracticeSlide(slide)
    ? "이 장은 설명을 듣고 넘어가는 시간이 아니라, 방금 배운 기준을 내 업무에 꽂아 보는 시간입니다."
    : "";
  const lines = [
    `${opening}제목 그대로, ${title}`,
    message,
    visualLine(slide, anchors),
    frame.analogy,
    termLine(slide, frame),
    practiceLine,
    `여기서 청중에게 확인할 질문은 이것입니다. ${interactionPrompt(slide, anchors)}`,
    `이제 다음 흐름으로 이렇게 넘기면 됩니다. ${transition}`,
  ].filter(Boolean);
  return lines.join(" ");
}

function shortCue(value, max = 22) {
  const text = stripSentenceEnd(value);
  if (text.length <= max) return text;
  return `${text.slice(0, max - 1)}…`;
}

function buildKeywordFlow(slide, anchors) {
  const frame = frameFor(slide);
  const terms = displayTerms(slide);
  const transition = stripSentenceEnd(transitionFor(slide));
  const anchorCue = anchors.length ? anchors.slice(0, 3).join(" / ") : shortCue(slide.title, 24);
  const flow = [
    {
      label: "도입",
      cue: shortCue(slide.title, 24),
      say: `지금 장면을 ${sectionKey(slide.section) === "act0" ? "김아이 세계관" : "업무 장치"} 안에 놓고 시작합니다.`,
    },
    {
      label: "화면앵커",
      cue: shortCue(anchorCue, 28),
      say: anchors.length ? "항목을 읽기보다 무엇을 줄이는 장치인지 짚습니다." : "그림을 판단 순서의 표지판으로 짚습니다.",
    },
    {
      label: "업무비유",
      cue: shortCue(frame.analogy, 26),
      say: "회사 업무 상황으로 바꿔 일반인이 바로 이해하게 만듭니다.",
    },
    {
      label: terms.length ? "실제용어" : "핵심",
      cue: terms.length ? shortCue(terms.join(" / "), 38) : shortCue(slide.message || slide.speakerNote, 28),
      say: terms.length ? "비유를 잡은 뒤 실제 용어 이름을 붙입니다." : "김아이가 추측하지 않게 만드는 기준으로 정리합니다.",
    },
    {
      label: "청중질문",
      cue: shortCue(interactionPrompt(slide, anchors), 30),
      say: "내 업무에 대입할 질문을 던지고 잠깐 생각할 틈을 둡니다.",
    },
    {
      label: "다음연결",
      cue: shortCue(transition, 30),
      say: "다음 슬라이드가 왜 필요한지 한 문장으로 넘깁니다.",
    },
  ];
  return flow;
}

function deliveryTips(slide) {
  const tips = [
    "원고를 그대로 낭독하지 말고, keywordFlow를 보며 자연스럽게 풀어 말한다.",
    "전문 용어는 회사 업무 비유를 먼저 말한 뒤 이름만 붙인다.",
  ];
  if ((slide.glossaryTerms || []).length) {
    tips.push(`${slide.glossaryTerms.join(", ")}는 외우게 하지 말고 오늘 장치의 이름표로 소개한다.`);
  }
  if (slide.visualAssetId || slide.visualIntent || screenBullets(slide).length) {
    tips.push("이미지와 화면 항목은 설명 순서의 앵커로 사용한다.");
  }
  if (isPracticeSlide(slide)) {
    tips.push("실습 안내에서는 정답을 먼저 말하지 말고 참가자가 자신의 업무에 대입할 시간을 준다.");
  }
  return tips;
}

function buildScript(slide, index, slides) {
  const anchors = screenBullets(slide);
  const transition = transitionFor(slide);
  return {
    index: index + 1,
    id: slide.id,
    section: slide.section || "",
    title: slide.title || "",
    estimatedMinutes: slide.estimatedMinutes || (isPracticeSlide(slide) ? 2 : 1),
    audience: "AI/개발 비전문가를 포함한 일반 직장인",
    objective: slide.sectionObjective || "",
    speakingGoal: sentence(slide.message || slide.speakerNote),
    script: buildNarrativeScript(slide, index, slides, anchors),
    keywordFlow: buildKeywordFlow(slide, anchors),
    interactionPrompt: interactionPrompt(slide, anchors),
    transition,
    sourceSpeakerNote: slide.speakerNote || "",
    sourcePresenterCues: slide.presenterCues || [],
    screenAnchors: anchors,
    deliveryTips: deliveryTips(slide),
  };
}

function markdownKeywordFlow(flow = []) {
  if (!Array.isArray(flow) || !flow.length) return ["- 없음"];
  return flow.map((item) => `- **${item.label}**: ${item.cue} - ${item.say}`);
}

function markdownFor(deckSlug, generatedAt, entries) {
  const lines = [
    `# ${deckSlug} 발표 스크립트`,
    "",
    "목적: 일반인 대상 강의에서 발표자가 슬라이드별로 말할 내용을 실제 원고와 키워드 진행 큐로 확인하기 위한 문서.",
    "원천 문서: slide-spec.json",
    "수정해야 할 때: 슬라이드 메시지, 발표 흐름, 비유, 실습 브릿지가 바뀔 때",
    "수정하면 안 되는 경우: 슬라이드 원천 메시지를 바꾸지 않고 표현만 다듬는 수준을 넘어서는 내용 추가",
    "관련 산출물: presentation-script.json, presenter-review.html, deck.html, speaker.html",
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
    lines.push("### 발표 원고");
    lines.push("");
    lines.push(entry.script);
    lines.push("");
    lines.push("### 키워드 진행 큐");
    lines.push("");
    lines.push(...markdownKeywordFlow(entry.keywordFlow));
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
      editableFields: ["script", "keywordFlow", "interactionPrompt", "transition", "deliveryTips"],
      preserveFields: ["id", "index", "section", "title"],
    },
    slides: entries,
  };
  writeJson(path.join(deckDir, "presentation-script.json"), payload);
  fs.writeFileSync(path.join(deckDir, "presentation-script.md"), markdownFor(deckSlug, generatedAt, entries), "utf8");
  console.log(`Wrote ${entries.length} slide scripts to ${path.relative(root, deckDir)}/presentation-script.json`);
}

main();
