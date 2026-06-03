(() => {
  const glossary = window.DECK_GLOSSARY || [];
  const glossaryMatches = glossary
    .filter((item) => item.term && item.definition)
    .flatMap((item) => [item.term, ...(Array.isArray(item.aliases) ? item.aliases : [])]
      .filter(Boolean)
      .map((label) => ({ label, item })))
    .sort((a, b) => b.label.length - a.label.length);

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
    if (!root || !glossaryMatches.length) return;
    const ignoredSelector = "script, style, pre, code, a, button, input, textarea, select, [data-glossary]";
    const pattern = new RegExp(`(?<![A-Za-z0-9])(${glossaryMatches.map((match) => escapeRegExp(match.label)).join("|")})(?![A-Za-z0-9])`, "gi");
    const definitions = new Map(glossaryMatches.map(({ label, item }) => {
      const parts = [
        item.koreanLabel ? `${item.koreanLabel}` : "",
        item.definition ? `정의: ${item.definition}` : "",
        item.analogy ? `비유: ${item.analogy}` : "",
        item.practiceMeaning ? `실습: ${item.practiceMeaning}` : "",
      ].filter(Boolean);
      return [label.toLowerCase(), parts.join("\n")];
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

  document.addEventListener("DOMContentLoaded", () => {
    applyGlossary(document.querySelector(".slide") || document.body);
  });
})();
