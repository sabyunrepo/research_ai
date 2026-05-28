(() => {
  const slides = window.DECK_SLIDES || [];
  const glossary = window.DECK_GLOSSARY || [];
  const deck = document.querySelector("#deck");
  const counter = document.querySelector("[data-counter]");
  let active = 0;

  const glossaryTerms = glossary
    .filter((item) => item.term && item.definition)
    .sort((a, b) => b.term.length - a.term.length);

  function escapeRegExp(value) {
    return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  function showPopover(target) {
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
    popover.style.left = `${Math.min(Math.max(rect.left, margin), window.innerWidth - popoverRect.width - margin)}px`;
    popover.style.top = `${Math.min(rect.bottom + margin, window.innerHeight - popoverRect.height - margin)}px`;
  }

  function hidePopover() {
    document.querySelector("#glossaryPopover")?.classList.remove("is-visible");
  }

  function applyGlossary(root) {
    if (!root || !glossaryTerms.length) return;
    const ignoredSelector = "script, style, pre, code, a, button, input, textarea, select, [data-glossary]";
    const pattern = new RegExp(`(?<![A-Za-z0-9])(${glossaryTerms.map((item) => escapeRegExp(item.term)).join("|")})(?![A-Za-z0-9])`, "gi");
    const definitions = new Map(glossaryTerms.map((item) => [item.term.toLowerCase(), item.definition]));
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const textNodes = [];
    while (walker.nextNode()) {
      const textNode = walker.currentNode;
      const parent = textNode.parentElement;
      pattern.lastIndex = 0;
      if (parent && !parent.closest(ignoredSelector) && pattern.test(textNode.nodeValue)) {
        textNodes.push(textNode);
      }
    }
    textNodes.forEach((textNode) => {
      pattern.lastIndex = 0;
      const fragment = document.createDocumentFragment();
      const value = textNode.nodeValue;
      let lastIndex = 0;
      let match;
      while ((match = pattern.exec(value))) {
        if (match.index > lastIndex) fragment.append(document.createTextNode(value.slice(lastIndex, match.index)));
        const node = document.createElement("span");
        node.className = "glossary-term";
        node.tabIndex = 0;
        node.dataset.glossary = definitions.get(match[0].toLowerCase()) || "";
        node.textContent = match[0];
        node.addEventListener("mouseenter", () => showPopover(node));
        node.addEventListener("mouseleave", hidePopover);
        node.addEventListener("focus", () => showPopover(node));
        node.addEventListener("blur", hidePopover);
        fragment.append(node);
        lastIndex = match.index + match[0].length;
      }
      if (lastIndex < value.length) fragment.append(document.createTextNode(value.slice(lastIndex)));
      textNode.replaceWith(fragment);
    });
  }

  function slideIndexFromHash() {
    const match = location.hash.match(/^#slide-(\d+)$/);
    return match ? Math.max(0, Math.min(slides.length - 1, Number(match[1]) - 1)) : 0;
  }

  async function render() {
    if (!deck) return;
    active = slideIndexFromHash();
    const slide = slides[active];
    if (!slide) {
      deck.innerHTML = '<div class="deck-frame"><main class="slide"><section class="copy"><h2>No slides</h2></section></main></div>';
      return;
    }
    const response = await fetch(`slides/${slide.file}`);
    const html = await response.text();
    const doc = new DOMParser().parseFromString(html, "text/html");
    const main = doc.querySelector(".slide");
    main?.querySelectorAll("[src], [href]").forEach((node) => {
      const attr = node.hasAttribute("src") ? "src" : "href";
      const value = node.getAttribute(attr);
      if (value?.startsWith("../")) {
        node.setAttribute(attr, value.slice(3));
      }
    });
    deck.innerHTML = "";
    const frame = document.createElement("div");
    frame.className = "deck-frame";
    frame.dataset.slideId = slide.id;
    frame.append(main || document.createTextNode(`Missing slide ${slide.id}`));
    deck.append(frame);
    applyGlossary(frame);
    if (counter) counter.textContent = `${active + 1} / ${slides.length}`;
  }

  function go(next) {
    const target = Math.max(0, Math.min(slides.length - 1, active + next));
    location.hash = `#slide-${target + 1}`;
    render();
  }

  document.querySelector("[data-prev]")?.addEventListener("click", () => go(-1));
  document.querySelector("[data-next]")?.addEventListener("click", () => go(1));
  window.addEventListener("hashchange", render);
  window.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") go(-1);
    if (event.key === "ArrowRight") go(1);
  });
  render();
})();
