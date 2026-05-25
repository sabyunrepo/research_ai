const slides = window.LECTURE_SLIDES || [];

const reviewDeck = document.querySelector("#reviewDeck");
const glossaryTerms = (window.LECTURE_GLOSSARY || []).slice().sort((a, b) => b[0].length - a[0].length);
const glossaryExplanations = new Map(glossaryTerms.map(([term, explanation]) => [term.toLowerCase(), explanation]));
const glossaryPattern = new RegExp(`(?<![A-Za-z0-9])(${glossaryTerms.map(([term]) => term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})(?![A-Za-z0-9])`, "gi");
const glossaryIgnoredSelector = "script, style, pre, code, a, button, input, textarea, select, [data-glossary]";

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


function makeSlideNumber(index) {
  const number = String(index + 1).padStart(2, "0");
  return `${number} / ${slides.length}`;
}

async function fetchDocument(file) {
  const response = await fetch(file, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`${file} failed with ${response.status}`);
  }

  return new DOMParser().parseFromString(await response.text(), "text/html");
}

async function loadScripts() {
  const preview = await fetchDocument("presenter-preview.html");
  return slides.map((slide, index) => {
    if (slide.speaker) {
      return {
        meta: `${slide.parent} · ${slide.reviewTitle}`,
        heading: slide.speaker.heading || slide.reviewTitle,
        script: slide.speaker.html,
        sources: slide.sources || [],
      };
    }

    const sourceId = slide.scriptSource || `cut-${slide.parent || String(index).padStart(2, "0")}`;
    const id = `#${sourceId}`;
    const cut = preview.querySelector(id);
    return {
      meta: cut?.querySelector(".preview-meta")?.textContent?.trim() || makeSlideNumber(index),
      heading: cut?.querySelector("h2")?.textContent?.trim() || slide.reviewTitle || `Slide ${index + 1}`,
      script: cut?.querySelector(".script-full")?.innerHTML || "<strong>상세 발표 스크립트</strong><p>등록된 스크립트가 없습니다.</p>",
      sources: slide.sources || [],
    };
  });
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
  const parsed = await fetchDocument(file);
  const slideElement = parsed.querySelector(".slide");

  if (!slideElement) {
    throw new Error(`${file} does not include .slide`);
  }

  slideElement.querySelectorAll(".note").forEach((note) => note.remove());

  const frame = document.createElement("article");
  frame.className = `deck-frame ${slideInfo.sectionStart ? "is-section-start" : "is-section-detail"}`;
  frame.setAttribute("aria-label", parsed.title || file);
  frame.dataset.source = file;
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

function makeScriptPanel(scriptInfo) {
  const panel = document.createElement("section");
  panel.className = "review-script";

  const meta = document.createElement("p");
  meta.className = "review-meta";
  meta.textContent = scriptInfo.meta;

  const heading = document.createElement("h2");
  heading.textContent = scriptInfo.heading;

  const body = document.createElement("div");
  body.className = "review-script-body";
  body.innerHTML = scriptInfo.script;

  panel.append(meta, heading, body);

  if (scriptInfo.sources?.length) {
    const sources = document.createElement("div");
    sources.className = "review-sources";
    scriptInfo.sources.forEach((source) => {
      const link = document.createElement("a");
      link.href = source.url;
      link.textContent = source.label;
      link.target = "_blank";
      link.rel = "noreferrer";
      sources.append(link);
    });
    panel.append(sources);
  }

  return panel;
}

async function renderReviewDeck() {
  reviewDeck.replaceChildren();

  try {
    const scripts = await loadScripts();
    const slidesAndScripts = await Promise.all(
      slides.map(async (file, index) => ({
        frame: await loadSlide(file, index),
        script: scripts[index],
      })),
    );

    slidesAndScripts.forEach(({ frame, script }) => {
      const row = document.createElement("article");
      row.className = "review-cut";
      row.append(frame, makeScriptPanel(script));
      reviewDeck.append(row);
    });
  } catch (error) {
    const message = document.createElement("p");
    message.className = "deck-error";
    message.textContent = `발표자 검토 화면을 불러오지 못했습니다: ${error.message}`;
    reviewDeck.append(message);
  }
}

renderReviewDeck();
