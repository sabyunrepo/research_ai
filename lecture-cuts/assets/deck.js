const slides = window.LECTURE_SLIDES || [];

const deck = document.querySelector("#deck");
const printButton = document.querySelector("#printDeck");
const previousButton = document.querySelector("#previousSlide");
const nextButton = document.querySelector("#nextSlide");
const deckStatus = document.querySelector("#deckStatus");
let frames = [];
let currentSlideIndex = 0;

function makeSlideNumber(index) {
  const number = String(index + 1).padStart(2, "0");
  return `${number} / ${slides.length}`;
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
