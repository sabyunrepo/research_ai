const slides = window.LECTURE_SLIDES || [];

const deck = document.querySelector("#deck");
const printButton = document.querySelector("#printDeck");

function makeSlideNumber(index) {
  const number = String(index + 1).padStart(2, "0");
  return `${number} / ${slides.length}`;
}

function getSlideFile(slide) {
  return typeof slide === "string" ? slide : slide.file;
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

async function renderDeck() {
  deck.replaceChildren();

  try {
    const frames = await Promise.all(slides.map(loadSlide));
    deck.append(...frames);
  } catch (error) {
    const message = document.createElement("p");
    message.className = "deck-error";
    message.textContent = `슬라이드를 불러오지 못했습니다: ${error.message}`;
    deck.append(message);
  }
}

printButton?.addEventListener("click", () => window.print());

renderDeck();
