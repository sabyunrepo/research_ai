(() => {
  const slides = window.DECK_SLIDES || [];
  const claims = new Map((window.DECK_CLAIMS || []).map((claim) => [claim.id, claim]));
  const review = document.querySelector("#review");

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function evidenceList(slide) {
    const ids = slide.evidenceClaimIds || [];
    if (!ids.length) return "<p class=\"review-evidence\">Evidence: none</p>";
    return `<ul class="review-evidence">${ids
      .map((id) => {
        const claim = claims.get(id);
        return `<li><strong>${escapeHtml(id)}</strong>: ${escapeHtml(claim?.claim || "missing claim")} ${claim?.source ? `(${escapeHtml(claim.source)})` : ""}</li>`;
      })
      .join("")}</ul>`;
  }

  function render() {
    if (!review) return;
    review.innerHTML = slides
      .map(
        (slide) => `<section class="review-cut" data-slide-id="${escapeHtml(slide.id)}">
          <div class="review-slide">
            <div class="eyebrow">${escapeHtml(slide.section || "")}</div>
            <h2>${escapeHtml(slide.title)}</h2>
            <p>${escapeHtml(slide.message)}</p>
          </div>
          <div class="review-script">
            <strong>Speaker Note</strong>
            <p>${escapeHtml(slide.speakerNote || "")}</p>
            <strong>Evidence Claim IDs</strong>
            ${evidenceList(slide)}
          </div>
        </section>`
      )
      .join("");
  }

  render();
})();
