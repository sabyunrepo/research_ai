(() => {
  const slides = window.DECK_SLIDES || [];
  const glossary = window.DECK_GLOSSARY || [];
  const deck = document.querySelector("#deck");
  const counter = document.querySelector("[data-counter]");
  const deckStatus = document.querySelector("#deckStatus");
  const syncStatus = document.querySelector("#presentationSyncStatus");
  const presentButton = document.querySelector("#presentDeck");
  const printButton = document.querySelector("#printDeck");
  const previousButton = document.querySelector("[data-prev]");
  const nextButton = document.querySelector("[data-next]");
  let active = 0;
  let latestRevision = 0;

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
    const definitions = new Map(glossaryTerms.map((item) => {
      const parts = [
        item.koreanLabel ? `${item.koreanLabel}` : "",
        item.definition ? `정의: ${item.definition}` : "",
        item.analogy ? `비유: ${item.analogy}` : "",
        item.practiceMeaning ? `실습: ${item.practiceMeaning}` : "",
      ].filter(Boolean);
      return [item.term.toLowerCase(), parts.join("\n")];
    }));
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

  function setSyncStatus(message, state = "") {
    if (!syncStatus) return;
    syncStatus.textContent = message;
    syncStatus.dataset.state = state;
  }

  async function publishState(index, source = "deck") {
    if (window.location.protocol === "file:") return;
    try {
      const response = await fetch("/api/presentation/state", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ index, source }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok || payload.ok === false) throw new Error(payload.error || `HTTP ${response.status}`);
      latestRevision = Math.max(latestRevision, payload.revision || 0);
      setSyncStatus("동기화됨", "online");
    } catch (error) {
      setSyncStatus(`동기화 실패: ${error.message}`, "error");
    }
  }

  async function render(options = {}) {
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
    runSlideMotion(frame);
    if (counter) counter.textContent = `${active + 1} / ${slides.length}`;
    if (deckStatus) deckStatus.textContent = `${String(active + 1).padStart(2, "0")} / ${slides.length} · ${slide.title || slide.id}`;
    if (previousButton) previousButton.disabled = active === 0;
    if (nextButton) nextButton.disabled = active === slides.length - 1;
    if (options.publish !== false) publishState(active, options.source || "deck");
  }

  function runSlideMotion(frame) {
    if (!frame || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      frame?.setAttribute("data-motion-state", "reduced");
      return;
    }
    const choreography = [
      { selector: ".eyebrow", y: -6, delay: 0 },
      { selector: "h2", y: 14, delay: 70 },
      { selector: ".message", y: 10, delay: 150 },
      { selector: ".bullets li, .bullets span, .handoff-actions span", y: 8, delay: 230, stagger: 65 },
      { selector: ".slide-media", y: 16, delay: 250 },
      { selector: ".slide-bridge", y: 8, delay: 410 },
    ];
    let count = 0;
    choreography.forEach((step) => {
      frame.querySelectorAll(step.selector).forEach((node, index) => {
        count += 1;
        node.animate(
          [
            { opacity: 0, transform: `translateY(${step.y}px)` },
            { opacity: 1, transform: "translateY(0)" },
          ],
          {
            duration: step.selector === "h2" ? 520 : 380,
            delay: step.delay + index * (step.stagger || 0),
            easing: "cubic-bezier(.2,.8,.2,1)",
            fill: "both",
          }
        );
      });
    });
    const visual = frame.querySelector(".visual-figure img");
    if (visual) {
      count += 1;
      visual.animate(
        [
          { opacity: 0, transform: "translateY(10px) scale(.985)" },
          { opacity: 1, transform: "translateY(0) scale(1)" },
        ],
        { duration: 520, delay: 320, easing: "cubic-bezier(.2,.8,.2,1)", fill: "both" }
      );
    }
    frame.dataset.motionState = "played";
    frame.dataset.motionCount = String(count);
  }

  function go(next) {
    const target = Math.max(0, Math.min(slides.length - 1, active + next));
    location.hash = `#slide-${target + 1}`;
    render({ source: "deck" });
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
      if (isFullscreen) await document.exitFullscreen();
      setPresentationMode(false);
      return;
    }
    setPresentationMode(true);
    try {
      await document.documentElement.requestFullscreen();
    } catch {
      setPresentationMode(true);
    }
  }

  async function exportPdf() {
    if (window.location.protocol === "file:") {
      window.print();
      return;
    }
    const originalLabel = printButton?.textContent || "Print / PDF";
    if (printButton) {
      printButton.disabled = true;
      printButton.textContent = "Exporting...";
    }
    setSyncStatus("PDF 생성 중", "online");
    try {
      const response = await fetch("/api/deck/export-pdf", { method: "POST" });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok || payload.ok === false) throw new Error(payload.error || `HTTP ${response.status}`);
      setSyncStatus("PDF 생성 완료", "online");
      const opened = window.open(payload.pdfUrl, "_blank", "noreferrer");
      if (!opened) window.location.href = payload.pdfUrl;
    } catch (error) {
      setSyncStatus(`PDF 생성 실패: ${error.message}`, "error");
    } finally {
      if (printButton) {
        printButton.disabled = false;
        printButton.textContent = originalLabel;
      }
    }
  }

  function connectEvents() {
    if (window.location.protocol === "file:" || !window.EventSource) return;
    const events = new EventSource("/api/presentation/events");
    events.addEventListener("state", (event) => {
      const payload = JSON.parse(event.data);
      if ((payload.revision || 0) <= latestRevision) return;
      latestRevision = payload.revision || 0;
      const index = Math.max(0, Math.min(slides.length - 1, payload.index || 0));
      history.replaceState(null, "", `${location.pathname}${location.search}#slide-${index + 1}`);
      render({ publish: false, source: "remote" });
      setSyncStatus(`원격 이동: ${index + 1}`, "online");
    });
    events.addEventListener("open", () => setSyncStatus("동기화 연결됨", "online"));
    events.addEventListener("error", () => setSyncStatus("동기화 재연결 중", "error"));
  }

  document.querySelector("[data-prev]")?.addEventListener("click", () => go(-1));
  document.querySelector("[data-next]")?.addEventListener("click", () => go(1));
  printButton?.addEventListener("click", exportPdf);
  presentButton?.addEventListener("click", togglePresentationMode);
  document.addEventListener("fullscreenchange", () => setPresentationMode(Boolean(document.fullscreenElement)));
  window.addEventListener("hashchange", () => render({ source: "hash" }));
  window.addEventListener("keydown", (event) => {
    if (event.target?.closest?.("input, textarea, select, [contenteditable='true']")) return;
    if (event.key === "ArrowLeft") go(-1);
    if (event.key === "ArrowRight") go(1);
    if (event.key === "PageUp" || event.key === "Backspace") go(-1);
    if (event.key === "PageDown" || event.key === " ") {
      event.preventDefault();
      go(1);
    }
    if (event.key.toLowerCase() === "f") {
      event.preventDefault();
      togglePresentationMode();
    }
  });
  fetch("/api/presentation/state", { cache: "no-store" })
    .then((response) => response.ok ? response.json() : null)
    .then((state) => {
      if (state && !location.hash) {
        latestRevision = state.revision || 0;
        const index = Math.max(0, Math.min(slides.length - 1, state.index || 0));
        history.replaceState(null, "", `${location.pathname}${location.search}#slide-${index + 1}`);
      }
    })
    .catch(() => {})
    .finally(() => {
      render({ publish: false });
      connectEvents();
    });
})();
