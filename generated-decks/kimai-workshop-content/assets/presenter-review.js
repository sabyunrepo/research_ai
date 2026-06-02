(() => {
  const slides = window.DECK_SLIDES || [];
  const review = document.querySelector("#review");
  const saveButton = document.querySelector("#saveReviewChanges");
  const saveStatus = document.querySelector("#saveReviewStatus");
  const dirtySlides = new Map();
  const canUseSaveApi = window.location.protocol !== "file:";
  const hiddenVerifierFields = ["evidenceClaimIds"];
  let scriptById = new Map();
  let scriptUpdatedAt = "";

  function escapeHtml(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function setSaveStatus(message, state = "") {
    if (!saveStatus) return;
    saveStatus.textContent = message;
    if (state) saveStatus.dataset.state = state;
    else delete saveStatus.dataset.state;
  }

  function updateSaveButton() {
    if (!saveButton) return;
    const saving = saveButton.dataset.saving === "true";
    saveButton.disabled = !canUseSaveApi || saving || dirtySlides.size === 0;
    saveButton.textContent = saving ? "저장 중" : "저장";
  }

  function listBlock(label, items) {
    if (!items || !items.length) return "";
    return `<strong>${escapeHtml(label)}</strong><ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
  }

  function fallbackScript(slide) {
    return {
      id: slide.id,
      script: slide.speakerNote || "",
      interactionPrompt: "",
      transition: slide.bridge || "",
    };
  }

  function scriptEntryFor(slide) {
    return scriptById.get(slide.id) || fallbackScript(slide);
  }

  function editableField(slide, entry, field, label, options = {}) {
    const className = options.className || "review-script-textarea";
    const value = options.value ?? entry[field] ?? "";
    return `<label class="review-field-label">
      <span>${escapeHtml(label)}</span>
      <textarea class="${escapeHtml(className)}" data-slide-id="${escapeHtml(slide.id)}" data-field="${escapeHtml(field)}">${escapeHtml(value)}</textarea>
    </label>`;
  }

  function slideBulletsText(slide) {
    return Array.isArray(slide.bullets) ? slide.bullets.join("\n") : "";
  }

  function renderSlideTextEditor(slide) {
    return `<div class="review-slide-text-editor">
      <strong>Slide Text</strong>
      ${editableField(slide, slide, "title", "제목", { className: "review-slide-textarea review-slide-textarea--title" })}
      ${editableField(slide, slide, "message", "본문 메시지", { className: "review-slide-textarea" })}
      ${editableField(slide, slide, "bullets", "화면 앵커/불릿", {
        className: "review-slide-textarea",
        value: slideBulletsText(slide),
      })}
      ${editableField(slide, slide, "bridge", "다음 장 연결", { className: "review-slide-textarea" })}
    </div>`;
  }

  function renderScriptEditor(slide) {
    const entry = scriptEntryFor(slide);
    return `<div class="review-script-editor">
      ${editableField(slide, entry, "script", "발표 스크립트")}
      ${editableField(slide, entry, "interactionPrompt", "청중 질문/행동")}
      ${editableField(slide, entry, "transition", "다음 장 연결")}
    </div>`;
  }

  function markDirty(target) {
    const slideId = target.dataset.slideId;
    const field = target.dataset.field;
    if (!slideId || !field) return;
    const current = dirtySlides.get(slideId) || { id: slideId };
    current[field] = target.value;
    dirtySlides.set(slideId, current);
    setSaveStatus(`${dirtySlides.size}개 슬라이드 수정됨`);
    updateSaveButton();
  }

  function bindEditors() {
    review?.querySelectorAll("[data-slide-id][data-field]").forEach((field) => {
      field.addEventListener("input", () => markDirty(field));
    });
  }

  function updateRenderedScriptFields() {
    review?.querySelectorAll(".review-script-editor [data-slide-id][data-field]").forEach((field) => {
      const slideId = field.dataset.slideId;
      const fieldName = field.dataset.field;
      const dirty = dirtySlides.get(slideId);
      if (dirty && Object.prototype.hasOwnProperty.call(dirty, fieldName)) return;
      const entry = scriptById.get(slideId);
      if (!entry || !Object.prototype.hasOwnProperty.call(entry, fieldName)) return;
      const nextValue = entry[fieldName] ?? "";
      if (field.value !== nextValue) field.value = nextValue;
    });
  }

  function bindSlidePreviews() {
    review?.querySelectorAll("[data-slide-file]").forEach((frame) => {
      const file = frame.dataset.slideFile;
      if (file) frame.setAttribute("src", `slides/${file}`);
      scaleSlidePreview(frame);
    });
  }

  function refreshSlidePreviews() {
    const cacheKey = Date.now();
    review?.querySelectorAll("[data-slide-file]").forEach((frame) => {
      const file = frame.dataset.slideFile;
      if (file) frame.setAttribute("src", `slides/${file}?v=${cacheKey}`);
      scaleSlidePreview(frame);
    });
  }

  function scaleSlidePreview(frame) {
    const wrapper = frame.closest(".review-slide-preview");
    if (!wrapper) return;
    const scale = wrapper.clientWidth / 1366;
    frame.style.transform = `scale(${scale})`;
  }

  function render() {
    if (!review) return;
    review.innerHTML = slides
      .map(
        (slide) => `<section class="review-cut" data-slide-id="${escapeHtml(slide.id)}">
          <div class="review-slide">
            <div class="review-slide-preview">
              <span class="review-slide-number" aria-label="Slide ${slide.index} of ${slides.length}">${String(slide.index).padStart(2, "0")} / ${slides.length}</span>
              <iframe class="review-slide-frame" data-slide-file="${escapeHtml(slide.file)}" title="${escapeHtml(slide.title)} preview" loading="lazy"></iframe>
            </div>
            <div class="review-slide-caption">
              <span>Slide ${String(slide.index).padStart(2, "0")} · ${escapeHtml(slide.section || "")}</span>
              <strong>${escapeHtml(slide.title)}</strong>
            </div>
          </div>
          <div class="review-script">
            ${renderSlideTextEditor(slide)}
            <strong>Presentation Script</strong>
            ${renderScriptEditor(slide)}
            <details>
              <summary>원본 speaker note / presenter cues</summary>
              <p>${escapeHtml(slide.speakerNote || "")}</p>
              ${listBlock("Presenter Cues", slide.presenterCues || [])}
            </details>
          </div>
        </section>`
      )
      .join("");
    bindEditors();
    bindSlidePreviews();
  }

  async function loadPresentationScript() {
    try {
      const response = await fetch("presentation-script.json", { cache: "no-store" });
      if (!response.ok) return;
      const payload = await response.json();
      scriptById = new Map((payload.slides || []).map((entry) => [entry.id, entry]));
      scriptUpdatedAt = payload.updatedAt || "";
      return payload;
    } catch {
      scriptById = new Map();
      return null;
    }
  }

  async function refreshPresentationScriptIfChanged() {
    const previousUpdatedAt = scriptUpdatedAt;
    const payload = await loadPresentationScript();
    if (!payload || payload.updatedAt === previousUpdatedAt) return;
    updateRenderedScriptFields();
    setSaveStatus(dirtySlides.size ? `${dirtySlides.size}개 슬라이드 수정됨` : "외부 스크립트 갱신됨", dirtySlides.size ? "" : "saved");
  }

  async function saveReviewChanges() {
    if (!canUseSaveApi) {
      setSaveStatus("읽기 전용: 저장은 로컬 서버에서 가능합니다", "error");
      updateSaveButton();
      return;
    }
    if (!dirtySlides.size || !saveButton) return;
    saveButton.dataset.saving = "true";
    updateSaveButton();
    setSaveStatus("저장 중...");

    try {
      const response = await fetch("/api/presenter-review/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slides: [...dirtySlides.values()] }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok || !payload.ok) {
        throw new Error(payload.error || `저장 실패 ${response.status}`);
      }
      dirtySlides.clear();
      await loadPresentationScript();
      refreshSlidePreviews();
      setSaveStatus(`저장 완료: ${payload.saved}개 슬라이드`, "saved");
    } catch (error) {
      setSaveStatus(`저장 실패: ${error.message}`, "error");
    } finally {
      delete saveButton.dataset.saving;
      updateSaveButton();
    }
  }

  saveButton?.addEventListener("click", saveReviewChanges);
  window.addEventListener("resize", () => {
    review?.querySelectorAll("[data-slide-file]").forEach(scaleSlidePreview);
  });
  loadPresentationScript().finally(() => {
    render();
    if (!canUseSaveApi) {
      setSaveStatus("읽기 전용: 저장은 로컬 서버에서 가능", "error");
    }
    updateSaveButton();
  });
  window.setInterval(refreshPresentationScriptIfChanged, 10000);
})();
