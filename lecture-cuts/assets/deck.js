const slides = window.LECTURE_SLIDES || [];

const deck = document.querySelector("#deck");
const printButton = document.querySelector("#printDeck");
const presentButton = document.querySelector("#presentDeck");
const previousButton = document.querySelector("#previousSlide");
const nextButton = document.querySelector("#nextSlide");
const deckStatus = document.querySelector("#deckStatus");
let frames = [];
let currentSlideIndex = 0;
window.LECTURE_RUNTIME_DIAGNOSTICS = {
  fetchLoaded: 0,
  cacheDirectLoaded: 0,
  cacheFallbackLoaded: 0,
  errors: [],
};
const glossaryTerms = [
  ["CLAUDE.md", "Claude Code가 프로젝트마다 읽는 규칙 파일입니다. 반복해서 말해야 하는 작업 원칙을 적어 둡니다."],
  ["HTML/CSS", "웹 페이지를 만드는 기본 언어입니다. 이 강의에서는 발표자료를 브라우저에서 보이게 만드는 형식으로 씁니다."],
  ["few-shot", "원하는 답변 모양을 예시 몇 개로 보여 주는 프롬프트 방식입니다."],
  ["frontmatter", "Markdown 파일 맨 위에 쓰는 설정 영역입니다. 보통 --- 사이에 name, description 같은 값을 둡니다."],
  ["PostToolUse", "Claude Code에서 도구 사용이 끝난 직후 실행되는 Hook 이벤트입니다."],
  ["SubagentStop", "Subagent 작업이 끝날 때 실행되는 Hook 이벤트입니다."],
  ["SessionStart", "세션이 시작되거나 재개될 때 실행되는 Hook 이벤트입니다."],
  ["Evaluation", "결과가 기준을 만족하는지 확인하는 평가 절차입니다. 테스트, 리뷰, 채점표가 여기에 들어갑니다."],
  ["verification", "작업이 정말 끝났는지 증거로 확인하는 과정입니다. 테스트 실행, 링크 검사, 화면 확인 등이 포함됩니다."],
  ["Spec-driven", "감으로 바로 만들지 않고 목표, 제약, 완료 기준을 먼저 문서로 고정한 뒤 구현하는 방식입니다."],
  ["reasoning model", "복잡한 문제를 단계적으로 추론하도록 설계된 AI 모델입니다."],
  ["Subagents", "메인 대화와 분리된 별도 context에서 특정 역할을 맡는 AI 작업자들입니다."],
  ["Subagent", "메인 대화와 분리된 별도 context에서 특정 역할을 맡는 AI 작업자입니다."],
  ["Agent Teams", "여러 AI 작업자를 역할별로 나눠 병렬로 일하게 하는 구성입니다."],
  ["Context Engineering", "AI가 필요한 정보를 필요한 순간에 보도록 정보의 양과 위치를 설계하는 일입니다."],
  ["progressive disclosure", "처음에는 핵심 정보만 보여 주고, 필요할 때 자세한 자료를 여는 방식입니다."],
  ["acceptance criteria", "완료 여부를 판단하는 구체적인 기준입니다."],
  ["presenter review", "발표 슬라이드와 발표자 스크립트를 함께 보는 검토 화면입니다."],
  ["slide spec", "슬라이드의 제목, 내용, 레이아웃, 검증 조건을 적은 설계서입니다."],
  ["handoff", "다음 세션이나 다음 사람이 이어받을 수 있도록 상태, 결정, 남은 일을 정리한 문서입니다."],
  ["matcher", "Hook에서 어떤 도구나 이벤트에 반응할지 고르는 패턴입니다."],
  ["command", "터미널에서 실제로 실행되는 명령입니다."],
  ["schema", "데이터가 어떤 구조와 필드를 가져야 하는지 정한 규칙입니다."],
  ["resources", "MCP server가 제공하는 읽기용 데이터나 파일 같은 자료들입니다."],
  ["resource", "MCP server가 제공하는 읽기용 데이터나 파일 같은 자료입니다."],
  ["prompts", "MCP server가 제공할 수 있는 재사용 가능한 요청 템플릿입니다."],
  ["Host", "Claude나 Codex처럼 MCP client를 만들고 실행하는 앱입니다."],
  ["Client", "Host 안에서 MCP server와 통신하는 연결 단위입니다."],
  ["Server", "도구, 자료, 프롬프트를 외부로 제공하는 프로그램입니다."],
  ["MCP", "Model Context Protocol의 약자입니다. AI 앱이 외부 도구와 표준 방식으로 연결되게 합니다."],
  ["Hooks", "특정 이벤트가 발생했을 때 자동으로 명령이나 검증을 실행하는 장치들입니다."],
  ["Hook", "특정 이벤트가 발생했을 때 자동으로 명령이나 검증을 실행하는 장치입니다."],
  ["Skills", "반복 작업 절차를 파일로 만든 재사용 가능한 매뉴얼들입니다."],
  ["Skill", "반복 작업 절차를 파일로 만든 재사용 가능한 매뉴얼입니다."],
  ["Prompt", "AI에게 이번 작업의 목표, 조건, 출력 형식을 알려 주는 요청문입니다."],
  ["Context", "AI가 현재 답변을 만들 때 참고하는 대화, 파일, 도구 설명 등 주변 정보입니다."],
  ["rubric", "주관적 품질을 흔들리지 않게 평가하기 위한 채점표입니다."],
  ["harness", "AI가 안정적으로 일하도록 규칙, 절차, 도구, 검증을 묶은 작업 환경입니다."],
  ["Loop", "조건을 만족할 때까지 작업과 검증을 반복하는 구조입니다."],
  ["Schedule", "정해진 시간이나 주기에 맞춰 작업을 실행하는 방식입니다."],
  ["API", "프로그램끼리 정해진 방식으로 기능이나 데이터를 주고받는 연결 규칙입니다."],
  ["JSON", "설정이나 데이터를 사람이 읽을 수 있는 텍스트 형태로 표현하는 형식입니다."],
  ["XML", "텍스트 안에서 역할과 경계를 태그로 구분하는 형식입니다."],
  ["CI", "Continuous Integration의 약자입니다. 코드 변경 때 자동으로 테스트와 검사를 돌리는 시스템입니다."],
  ["lint", "코드 스타일이나 잠재 오류를 자동으로 검사하는 작업입니다."],
  ["typecheck", "코드의 타입 규칙이 맞는지 검사하는 작업입니다."],
  ["build", "실행하거나 배포할 수 있는 결과물로 코드를 묶는 작업입니다."],
  ["mock", "테스트에서 실제 외부 시스템 대신 쓰는 가짜 대체물입니다."],
  ["assertion", "테스트에서 기대 결과가 맞는지 확인하는 조건입니다."],
  ["PR", "Pull Request의 약자입니다. 코드 변경을 합치기 전에 리뷰하는 요청입니다."],
  ["deck", "여러 장의 슬라이드로 이루어진 발표자료 묶음입니다."],
  ["source", "슬라이드 생성의 입력이 되는 원본 자료입니다."],
  ["tools", "AI가 호출해 실제 파일 읽기, 웹 확인, 명령 실행 같은 일을 하는 기능들입니다."],
  ["tool", "AI가 호출해 실제 파일 읽기, 웹 확인, 명령 실행 같은 일을 하는 기능입니다."],
  ["test", "기능이 의도대로 작동하는지 자동으로 확인하는 코드나 명령입니다."],
].sort((a, b) => b[0].length - a[0].length);
const glossaryExplanations = new Map(glossaryTerms.map(([term, explanation]) => [term.toLowerCase(), explanation]));
const glossaryPattern = new RegExp(`(?<![A-Za-z0-9])(${glossaryTerms.map(([term]) => term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})(?![A-Za-z0-9])`, "gi");
const glossaryIgnoredSelector = "script, style, pre, code, a, button, input, textarea, select, [data-glossary]";

function makeSlideNumber(index) {
  const number = String(index + 1).padStart(2, "0");
  return `${number} / ${slides.length}`;
}

function showGlossaryPopover(target) {
  const explanation = target.dataset.glossary;
  if (!explanation) return;
  let popover = document.querySelector("#glossaryPopover");
  if (!popover) {
    popover = document.createElement("div");
    popover.id = "glossaryPopover";
    popover.className = "glossary-popover";
    popover.setAttribute("role", "tooltip");
    document.body.append(popover);
  }
  popover.textContent = explanation;
  popover.classList.add("is-visible");
  const rect = target.getBoundingClientRect();
  const popoverRect = popover.getBoundingClientRect();
  const margin = 12;
  const left = Math.min(Math.max(rect.left + rect.width / 2 - popoverRect.width / 2, margin), window.innerWidth - popoverRect.width - margin);
  const top = rect.top > popoverRect.height + margin * 2 ? rect.top - popoverRect.height - margin : rect.bottom + margin;
  popover.style.left = `${left}px`;
  popover.style.top = `${Math.min(Math.max(top, margin), window.innerHeight - popoverRect.height - margin)}px`;
}

function hideGlossaryPopover() {
  document.querySelector("#glossaryPopover")?.classList.remove("is-visible");
}

function makeGlossaryNode(label) {
  const node = document.createElement("span");
  const explanation = glossaryExplanations.get(label.toLowerCase()) || "";
  node.className = "glossary-term";
  node.dataset.glossary = explanation;
  node.tabIndex = 0;
  node.textContent = label;
  node.setAttribute("role", "button");
  node.setAttribute("aria-label", `${label}: ${explanation}`);
  node.addEventListener("mouseenter", () => showGlossaryPopover(node));
  node.addEventListener("mouseleave", hideGlossaryPopover);
  node.addEventListener("focus", () => showGlossaryPopover(node));
  node.addEventListener("blur", hideGlossaryPopover);
  return node;
}

function applyGlossary(root) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const textNodes = [];
  while (walker.nextNode()) {
    const textNode = walker.currentNode;
    const parent = textNode.parentElement;
    glossaryPattern.lastIndex = 0;
    if (parent && !parent.closest(glossaryIgnoredSelector) && glossaryPattern.test(textNode.nodeValue)) {
      textNodes.push(textNode);
    }
  }
  textNodes.forEach((textNode) => {
    glossaryPattern.lastIndex = 0;
    const value = textNode.nodeValue;
    const fragment = document.createDocumentFragment();
    let lastIndex = 0;
    let match;
    while ((match = glossaryPattern.exec(value))) {
      if (match.index > lastIndex) {
        fragment.append(document.createTextNode(value.slice(lastIndex, match.index)));
      }
      fragment.append(makeGlossaryNode(match[0]));
      lastIndex = match.index + match[0].length;
    }
    if (lastIndex < value.length) {
      fragment.append(document.createTextNode(value.slice(lastIndex)));
    }
    textNode.replaceWith(fragment);
  });
}

function getSlideFile(slide) {
  return typeof slide === "string" ? slide : slide.file;
}

function getHashSlideIndex() {
  const match = window.location.hash.match(/^#slide-(\d+)$/);
  if (!match) {
    return 0;
  }

  const index = Number(match[1]) - 1;
  return Number.isInteger(index) && index >= 0 && index < slides.length ? index : 0;
}

function makeSectionLabel(slideInfo) {
  if (!slideInfo.sectionTitle) {
    return "";
  }

  const range = `${slideInfo.sectionIndex || 1}/${slideInfo.sectionTotal || 1}`;
  return slideInfo.sectionStart
    ? `SECTION ${slideInfo.sectionId} · ${slideInfo.sectionTitle}`
    : `${slideInfo.sectionTitle} · ${range}`;
}

async function loadSlide(slideInfo, index) {
  const file = getSlideFile(slideInfo);
  let html = "";

  const cachedSlide = window.LECTURE_SLIDE_HTML?.[file];
  if (window.location.protocol === "file:" && cachedSlide) {
    html = cachedSlide;
    window.LECTURE_RUNTIME_DIAGNOSTICS.cacheDirectLoaded += 1;
  } else {
    try {
      const response = await fetch(file, { cache: "no-store" });
      if (!response.ok) {
        throw new Error(`${file} failed with ${response.status}`);
      }
      html = await response.text();
      window.LECTURE_RUNTIME_DIAGNOSTICS.fetchLoaded += 1;
    } catch (error) {
      if (!cachedSlide) {
        window.LECTURE_RUNTIME_DIAGNOSTICS.errors.push({ file, message: error.message });
        throw error;
      }
      html = cachedSlide;
      window.LECTURE_RUNTIME_DIAGNOSTICS.cacheFallbackLoaded += 1;
    }
  }

  const parsed = new DOMParser().parseFromString(html, "text/html");
  const slideElement = parsed.querySelector(".slide");

  if (!slideElement) {
    throw new Error(`${file} does not include .slide`);
  }

  slideElement.querySelectorAll(".note").forEach((note) => note.remove());
  slideElement.querySelectorAll(".eyebrow").forEach((eyebrow) => {
    const label = eyebrow.textContent.trim();
    if (/\d+:\d+\s*-\s*\d+:\d+/.test(label) || label.includes("시간")) {
      eyebrow.remove();
    }
  });

  const frame = document.createElement("article");
  frame.className = `deck-frame ${slideInfo.sectionStart ? "is-section-start" : "is-section-detail"}`;
  frame.setAttribute("aria-label", parsed.title || file);
  frame.dataset.source = file;
  frame.dataset.slideIndex = String(index);
  if (slideInfo.sectionId) {
    frame.dataset.section = slideInfo.sectionId;
  }

  slideElement.classList.add(slideInfo.sectionStart ? "section-start-slide" : "section-detail-slide");
  applyGlossary(slideElement);

  const sectionLabel = document.createElement("div");
  sectionLabel.className = "deck-section-label";
  sectionLabel.textContent = makeSectionLabel(slideInfo);

  const badge = document.createElement("div");
  badge.className = "deck-slide-number";
  badge.textContent = makeSlideNumber(index);

  frame.append(slideElement, sectionLabel, badge);
  return frame;
}

function setActiveSlide(index, options = {}) {
  if (!frames.length) {
    return;
  }

  const boundedIndex = Math.min(Math.max(index, 0), frames.length - 1);
  currentSlideIndex = boundedIndex;

  frames.forEach((frame, frameIndex) => {
    const isActive = frameIndex === currentSlideIndex;
    frame.classList.toggle("is-active", isActive);
    frame.setAttribute("aria-hidden", String(!isActive));
  });

  if (previousButton) {
    previousButton.disabled = currentSlideIndex === 0;
  }
  if (nextButton) {
    nextButton.disabled = currentSlideIndex === frames.length - 1;
  }

  if (deckStatus) {
    const slideInfo = slides[currentSlideIndex];
    const title = slideInfo.reviewTitle || getSlideFile(slideInfo);
    deckStatus.textContent = `${makeSlideNumber(currentSlideIndex)} · ${title}`;
  }

  if (options.updateHash !== false) {
    const hash = `#slide-${currentSlideIndex + 1}`;
    history.replaceState(null, "", `${window.location.pathname}${window.location.search}${hash}`);
  }
}

function moveSlide(delta) {
  setActiveSlide(currentSlideIndex + delta);
}

function setPresentationMode(isPresenting) {
  document.body.classList.toggle("is-presenting", isPresenting);
  if (presentButton) {
    presentButton.textContent = isPresenting ? "Exit" : "Present";
    presentButton.setAttribute("aria-pressed", String(isPresenting));
  }
}

async function togglePresentationMode() {
  const isFullscreen = Boolean(document.fullscreenElement);

  if (isFullscreen || document.body.classList.contains("is-presenting")) {
    if (isFullscreen) {
      await document.exitFullscreen();
    } else {
      setPresentationMode(false);
    }
    return;
  }

  setPresentationMode(true);
  try {
    await document.documentElement.requestFullscreen();
  } catch {
    setPresentationMode(true);
  }
}

function isTypingTarget(target) {
  return target?.closest?.("input, textarea, select, [contenteditable='true']");
}

async function renderDeck() {
  deck.replaceChildren();

  try {
    frames = await Promise.all(slides.map(loadSlide));
    deck.append(...frames);
    setActiveSlide(getHashSlideIndex(), { updateHash: !window.location.hash });
  } catch (error) {
    const message = document.createElement("p");
    message.className = "deck-error";
    message.textContent = `슬라이드를 불러오지 못했습니다: ${error.message}`;
    deck.append(message);
  }
}

printButton?.addEventListener("click", () => window.print());
presentButton?.addEventListener("click", () => {
  togglePresentationMode();
});
previousButton?.addEventListener("click", () => moveSlide(-1));
nextButton?.addEventListener("click", () => moveSlide(1));
document.addEventListener("fullscreenchange", () => {
  setPresentationMode(Boolean(document.fullscreenElement));
});
window.addEventListener("hashchange", () => setActiveSlide(getHashSlideIndex(), { updateHash: false }));
window.addEventListener("keydown", (event) => {
  if (isTypingTarget(event.target)) {
    return;
  }

  if (["ArrowRight", "PageDown", " "].includes(event.key)) {
    event.preventDefault();
    moveSlide(1);
  } else if (["ArrowLeft", "PageUp", "Backspace"].includes(event.key)) {
    event.preventDefault();
    moveSlide(-1);
  } else if (event.key === "Home") {
    event.preventDefault();
    setActiveSlide(0);
  } else if (event.key === "End") {
    event.preventDefault();
    setActiveSlide(frames.length - 1);
  } else if (event.key.toLowerCase() === "f") {
    event.preventDefault();
    togglePresentationMode();
  } else if (event.key === "Escape" && document.body.classList.contains("is-presenting") && !document.fullscreenElement) {
    event.preventDefault();
    setPresentationMode(false);
  }
});

renderDeck();
