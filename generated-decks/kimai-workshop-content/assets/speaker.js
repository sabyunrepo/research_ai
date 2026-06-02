(() => {
  const slides = window.DECK_SLIDES || [];
  const scriptById = new Map();
  const currentFrame = document.querySelector("#currentSlideFrame");
  const currentSlideLabel = document.querySelector("#currentSlideLabel");
  const currentPreviewLabel = document.querySelector("#currentPreviewLabel");
  const currentSlideTitle = document.querySelector("#currentSlideTitle");
  const speakerStatus = document.querySelector("#speakerStatus");
  const speakerSyncStatus = document.querySelector("#speakerSyncStatus");
  const speakerMeta = document.querySelector("#speakerMeta");
  const speakerPromptTitle = document.querySelector("#speakerPromptTitle");
  const speakerPromptBody = document.querySelector("#speakerPromptBody");
  const speakerCuePanel = document.querySelector("#speakerCuePanel");
  const previousButton = document.querySelector("#speakerPrevious");
  const nextButton = document.querySelector("#speakerNext");
  const timerToggle = document.querySelector("#timerToggle");
  const timerReset = document.querySelector("#timerReset");
  const totalTimerDisplay = document.querySelector("#speakerTotalTimer");
  const slideTimerDisplay = document.querySelector("#speakerSlideTimer");
  let currentIndex = 0;
  let latestRevision = 0;
  let totalTimerStartedAt = 0;
  let totalTimerElapsedMs = 0;
  let slideTimerStartedAt = 0;
  let slideTimerElapsedMs = 0;
  let timerInterval = null;

  function makeSlideLabel(index) {
    return `${String(index + 1).padStart(2, "0")} / ${slides.length}`;
  }

  function setSyncStatus(message, state = "") {
    if (!speakerSyncStatus) return;
    speakerSyncStatus.textContent = message;
    speakerSyncStatus.dataset.state = state;
  }

  function renderCueList(script = {}) {
    speakerCuePanel.replaceChildren();
    if (Array.isArray(script.keywordFlow) && script.keywordFlow.length) {
      script.keywordFlow.forEach((item) => {
        if (!item?.label || !item?.cue) return;
        const row = document.createElement("p");
        const strong = document.createElement("strong");
        const span = document.createElement("span");
        const small = document.createElement("small");
        strong.textContent = item.label;
        span.textContent = item.cue;
        small.textContent = item.say || "";
        row.append(strong, span, small);
        speakerCuePanel.append(row);
      });
    }
    [
      ["청중 질문/행동", script.interactionPrompt],
      ["다음 장 연결", script.transition],
    ].filter(([, value]) => value).forEach(([label, value]) => {
      const row = document.createElement("p");
      const strong = document.createElement("strong");
      const span = document.createElement("span");
      strong.textContent = label;
      span.textContent = value;
      row.append(strong, span);
      speakerCuePanel.append(row);
    });
  }

  function renderSpeaker(index) {
    if (!slides.length) {
      if (speakerStatus) speakerStatus.textContent = "등록된 슬라이드가 없습니다.";
      return;
    }
    currentIndex = Math.max(0, Math.min(slides.length - 1, index));
    const slide = slides[currentIndex];
    const script = scriptById.get(slide.id) || {};
    const label = makeSlideLabel(currentIndex);
    const title = slide.title || script.title || slide.id;
    currentFrame.src = `slides/${slide.file}`;
    currentSlideLabel.textContent = label;
    currentPreviewLabel.textContent = label;
    currentSlideTitle.textContent = title;
    speakerMeta.textContent = `${slide.section || "Slide"} · ${title}`;
    speakerPromptTitle.textContent = title;
    speakerPromptBody.textContent = script.script || slide.speakerNote || "";
    renderCueList(script);
    previousButton.disabled = currentIndex === 0;
    nextButton.disabled = currentIndex === slides.length - 1;
    if (speakerStatus) speakerStatus.textContent = `${label} · ${title}`;
  }

  async function publishSpeakerState(index) {
    if (window.location.protocol === "file:") {
      setSyncStatus("동기화 없음: 로컬 파일 모드", "offline");
      return;
    }
    try {
      const response = await fetch("/api/presentation/state", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ index, source: "speaker" }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok || payload.ok === false) throw new Error(payload.error || `HTTP ${response.status}`);
      latestRevision = Math.max(latestRevision, payload.revision || 0);
      setSyncStatus("동기화됨", "online");
    } catch (error) {
      setSyncStatus(`동기화 실패: ${error.message}`, "error");
    }
  }

  function setSpeakerSlide(index, options = {}) {
    const previousIndex = currentIndex;
    renderSpeaker(index);
    if (currentIndex !== previousIndex) resetSlideTimer();
    if (options.publish !== false) publishSpeakerState(currentIndex);
  }

  async function loadScripts() {
    try {
      const response = await fetch("presentation-script.json", { cache: "no-store" });
      if (!response.ok) return;
      const payload = await response.json();
      (payload.slides || []).forEach((entry) => scriptById.set(entry.id, entry));
    } catch {
      // Fallback to speakerNote.
    }
  }

  async function loadInitialState() {
    try {
      const response = await fetch("/api/presentation/state", { cache: "no-store" });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const payload = await response.json();
      latestRevision = payload.revision || 0;
      setSpeakerSlide(payload.index || 0, { publish: false });
      setSyncStatus("동기화 연결됨", "online");
    } catch (error) {
      setSpeakerSlide(0, { publish: false });
      setSyncStatus(`동기화 대기: ${error.message}`, "error");
    }
  }

  function connectEvents() {
    if (window.location.protocol === "file:" || !window.EventSource) return;
    const events = new EventSource("/api/presentation/events");
    events.addEventListener("state", (event) => {
      const payload = JSON.parse(event.data);
      if ((payload.revision || 0) <= latestRevision) return;
      latestRevision = payload.revision || 0;
      setSpeakerSlide(payload.index || 0, { publish: false });
      setSyncStatus(`원격 이동: ${payload.index + 1}`, "online");
    });
    events.addEventListener("open", () => setSyncStatus("동기화 연결됨", "online"));
    events.addEventListener("error", () => setSyncStatus("동기화 재연결 중", "error"));
  }

  function formatElapsed(ms) {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    return `${String(minutes).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
  }

  function elapsedTime(startedAt, elapsedMs) {
    return elapsedMs + (startedAt ? Date.now() - startedAt : 0);
  }

  function updateTimer() {
    totalTimerDisplay.textContent = formatElapsed(elapsedTime(totalTimerStartedAt, totalTimerElapsedMs));
    slideTimerDisplay.textContent = formatElapsed(elapsedTime(slideTimerStartedAt, slideTimerElapsedMs));
  }

  function resetSlideTimer() {
    slideTimerElapsedMs = 0;
    slideTimerStartedAt = totalTimerStartedAt ? Date.now() : 0;
    updateTimer();
  }

  function toggleTimer() {
    if (totalTimerStartedAt) {
      const now = Date.now();
      totalTimerElapsedMs += now - totalTimerStartedAt;
      slideTimerElapsedMs += now - slideTimerStartedAt;
      totalTimerStartedAt = 0;
      slideTimerStartedAt = 0;
      clearInterval(timerInterval);
      timerInterval = null;
      timerToggle.textContent = "Start";
      updateTimer();
      return;
    }
    const now = Date.now();
    totalTimerStartedAt = now;
    slideTimerStartedAt = now;
    timerInterval = setInterval(updateTimer, 250);
    timerToggle.textContent = "Pause";
    updateTimer();
  }

  function resetTimer() {
    const now = Date.now();
    totalTimerStartedAt = totalTimerStartedAt ? now : 0;
    slideTimerStartedAt = totalTimerStartedAt ? now : 0;
    totalTimerElapsedMs = 0;
    slideTimerElapsedMs = 0;
    updateTimer();
  }

  previousButton.addEventListener("click", () => setSpeakerSlide(currentIndex - 1));
  nextButton.addEventListener("click", () => setSpeakerSlide(currentIndex + 1));
  timerToggle.addEventListener("click", toggleTimer);
  timerReset.addEventListener("click", resetTimer);
  window.addEventListener("keydown", (event) => {
    if (event.target?.closest?.("input, textarea, select, [contenteditable='true']")) return;
    if (["ArrowRight", "PageDown", " "].includes(event.key)) {
      event.preventDefault();
      setSpeakerSlide(currentIndex + 1);
    } else if (["ArrowLeft", "PageUp", "Backspace"].includes(event.key)) {
      event.preventDefault();
      setSpeakerSlide(currentIndex - 1);
    }
  });

  loadScripts().then(loadInitialState).then(connectEvents);
  updateTimer();
})();
