const slides = window.LECTURE_SLIDES || [];

const deck = document.querySelector("#deck");
const printButton = document.querySelector("#printDeck");
const previousButton = document.querySelector("#previousSlide");
const nextButton = document.querySelector("#nextSlide");
const deckStatus = document.querySelector("#deckStatus");
let frames = [];
let currentSlideIndex = 0;
const glossaryTerms = (window.LECTURE_GLOSSARY || []).slice().sort((a, b) => b[0].length - a[0].length);
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
  const response = await fetch(file, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`${file} failed with ${response.status}`);
  }

  const html = await response.text();
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
previousButton?.addEventListener("click", () => moveSlide(-1));
nextButton?.addEventListener("click", () => moveSlide(1));
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
  }
});

renderDeck();
