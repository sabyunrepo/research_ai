(() => {
  const slides = window.DECK_SLIDES || [];
  const claims = new Map((window.DECK_CLAIMS || []).map((claim) => [claim.id, claim]));
  const assetReviews = new Map((window.DECK_ASSET_REVIEWS || []).map((item) => [item.assetId, item]));
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

  function listBlock(label, items) {
    if (!items || !items.length) return "";
    return `<strong>${escapeHtml(label)}</strong><ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
  }

  function visualBlock(slide) {
    const rows = [
      slide.visualType ? `Type: ${slide.visualType}` : "",
      slide.visualAssetId ? `Asset ID: ${slide.visualAssetId}` : "",
      slide.visualAsset ? `Asset: ${slide.visualAsset}` : "",
      slide.assetTeachingRole ? `Teaching role: ${slide.assetTeachingRole}` : "",
      slide.visualPrompt ? `Prompt: ${slide.visualPrompt}` : "",
      slide.interaction ? `Interaction: ${slide.interaction.type} - ${slide.interaction.description}` : "",
      slide.bridge ? `Bridge: ${slide.bridge}` : "",
    ].filter(Boolean);
    const traceRows = [
      slide.visualAssetId ? `visualAssetId: ${slide.visualAssetId}` : "",
      slide.sourceAssetId ? `sourceAssetId: ${slide.sourceAssetId}` : "",
      slide.assetCrop ? `assetCrop: x=${slide.assetCrop.x}, y=${slide.assetCrop.y}, width=${slide.assetCrop.width}, height=${slide.assetCrop.height}, unit=${slide.assetCrop.unit}` : "",
      slide.renderedVisualAsset ? `renderedVisualAsset: ${slide.renderedVisualAsset}` : "",
    ].filter(Boolean);
    return `${listBlock("Visual / Interaction", rows)}${listBlock("Asset Trace", traceRows)}${listBlock("Asset Explanation Anchors", slide.assetExplanationAnchors || [])}`;
  }

  function semanticContractBlock(slide) {
    const contract = slide.assetSemanticRequirements;
    if (!contract) return "";
    const score = Number.isFinite(contract.minimumPassScore) ? [`Minimum pass score: ${contract.minimumPassScore}`] : [];
    const assetReview = slide.visualAssetId ? assetReviews.get(slide.visualAssetId) : null;
    const reviewRows = assetReview
      ? [
          `Status: ${assetReview.status}`,
          `Score: ${assetReview.score}`,
          assetReview.summary ? `Summary: ${assetReview.summary}` : "",
        ].filter(Boolean)
      : ["Status: missing asset-review.json entry"];
    const forbiddenRows = (assetReview?.forbiddenElementFindings || []).map((finding) => `${finding.observed ? "Observed" : "Not observed"}: ${finding.label} - ${finding.evidence}`);
    return `<strong>Visual Semantic Contract</strong>
      ${listBlock("Must Show", contract.mustShow || [])}
      ${listBlock("Must Not Show", contract.mustNotShow || [])}
      ${listBlock("Teaching Questions", contract.teachingQuestions || [])}
      ${listBlock("Review Threshold", score)}
      ${listBlock("Visual Review Status", reviewRows)}
      ${listBlock("Forbidden Element Findings", forbiddenRows)}`;
  }

  function xmlBlock(slide) {
    if (!slide.xmlPrompt) return "";
    const blocks = [
      ["Instruction", slide.xmlPrompt.instruction],
      ["Screen Content", slide.xmlPrompt.screenContent],
      ["Speaker Navigation", slide.xmlPrompt.speakerNavigation],
      ["Asset Requirement", slide.xmlPrompt.assetRequirement],
    ];
    return `<strong>XML Prompt Boundaries</strong>${blocks.map(([label, value]) => `<details><summary>${escapeHtml(label)}</summary><pre><code>${escapeHtml(value || "")}</code></pre></details>`).join("")}`;
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
            ${listBlock("Presenter Cues", slide.presenterCues || [])}
            ${visualBlock(slide)}
            ${semanticContractBlock(slide)}
            ${xmlBlock(slide)}
            <strong>Evidence Claim IDs</strong>
            ${evidenceList(slide)}
          </div>
        </section>`
      )
      .join("");
  }

  render();
})();
