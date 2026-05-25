(() => {
  const slides = window.DECK_SLIDES || [];
  const deck = document.querySelector("#deck");
  const counter = document.querySelector("[data-counter]");
  let active = 0;

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
    deck.innerHTML = "";
    const frame = document.createElement("div");
    frame.className = "deck-frame";
    frame.dataset.slideId = slide.id;
    frame.append(main || document.createTextNode(`Missing slide ${slide.id}`));
    deck.append(frame);
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
