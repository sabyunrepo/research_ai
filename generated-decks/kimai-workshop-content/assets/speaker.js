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
  const practiceStatusToggle = document.querySelector("#practiceStatusToggle");
  const practiceStatusModal = document.querySelector("#practiceStatusModal");
  const practiceStatusClose = document.querySelector("#practiceStatusClose");
  const practiceStatusMeta = document.querySelector("#practiceStatusMeta");
  const practiceStatusBody = document.querySelector("#practiceStatusBody");
  let currentIndex = 0;
  let latestRevision = 0;
  let practiceStatusOpen = false;
  let practiceStatusInterval = null;
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

  function fitCurrentSlidePreview() {
    const previewDocument = currentFrame.contentDocument;
    if (!previewDocument) return;

    let style = previewDocument.querySelector("#speakerPreviewFitStyle");
    if (!style) {
      style = previewDocument.createElement("style");
      style.id = "speakerPreviewFitStyle";
      previewDocument.head.append(style);
    }

    const frameWidth = Math.max(1, currentFrame.clientWidth);
    const frameHeight = Math.max(1, currentFrame.clientHeight);
    const scale = Math.min(frameWidth / 1280, frameHeight / 720);
    const offsetX = Math.max(0, (frameWidth - 1280 * scale) / 2);
    const offsetY = Math.max(0, (frameHeight - 720 * scale) / 2);

    style.textContent = `
      html {
        width: 100% !important;
        height: 100% !important;
        overflow: hidden !important;
        background: #ffffff !important;
      }
      body {
        width: 1280px !important;
        height: 720px !important;
        margin: 0 !important;
        overflow: hidden !important;
        background: #ffffff !important;
        transform: translate(${offsetX}px, ${offsetY}px) scale(${scale});
        transform-origin: top left !important;
      }
      .slide {
        width: 1280px !important;
        height: 720px !important;
        min-height: 0 !important;
      }
    `;
  }

  function normalizeText(value) {
    return String(value || "")
      .replace(/\u00a0/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function escapeRegExp(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  function collectKeywordTerms(script = {}) {
    const stopWords = new Set(["도입", "전개", "소개", "질문", "문제", "결과", "정리", "전환", "확장", "역할"]);
    const terms = [];
    const add = (value) => {
      const term = normalizeText(value);
      if (term.length >= 2 && !stopWords.has(term)) terms.push(term);
    };

    (script.keywordFlow || []).forEach((item) => {
      add(item?.cue);
      normalizeText(item?.cue)
        .split(/\s+/)
        .forEach(add);
    });

    return Array.from(new Set(terms)).sort((a, b) => b.length - a.length);
  }

  function renderHighlightedText(target, text, terms) {
    target.replaceChildren();
    const source = String(text || "").replace(/\u00a0/g, " ");
    const activeTerms = terms.filter((term) => source.includes(term));
    if (!source || !activeTerms.length) {
      target.textContent = source;
      return;
    }

    const matcher = new RegExp(activeTerms.map(escapeRegExp).join("|"), "g");
    let cursor = 0;
    source.replace(matcher, (match, offset) => {
      if (offset > cursor) target.append(document.createTextNode(source.slice(cursor, offset)));
      const mark = document.createElement("mark");
      mark.className = "speaker-keyword-highlight";
      mark.textContent = match;
      target.append(mark);
      cursor = offset + match.length;
      return match;
    });
    if (cursor < source.length) target.append(document.createTextNode(source.slice(cursor)));
  }

  function getScriptBackedInteraction(script = {}) {
    const scriptText = normalizeText(script.script);
    const interactionPrompt = normalizeText(script.interactionPrompt);
    if (!scriptText || !interactionPrompt) return "";
    return scriptText.includes(interactionPrompt) ? interactionPrompt : "";
  }

  function renderCueList(script = {}) {
    speakerCuePanel.replaceChildren();
    const keywordTerms = collectKeywordTerms(script);
    if (Array.isArray(script.keywordFlow) && script.keywordFlow.length) {
      script.keywordFlow.forEach((item) => {
        if (!item?.label || !item?.cue) return;
        const row = document.createElement("p");
        const strong = document.createElement("strong");
        const span = document.createElement("span");
        const small = document.createElement("small");
        strong.textContent = item.label;
        renderHighlightedText(span, item.cue, keywordTerms);
        renderHighlightedText(small, item.say || "", keywordTerms);
        row.append(strong, span, small);
        speakerCuePanel.append(row);
      });
    }
    [
      ["청중 질문/행동", getScriptBackedInteraction(script)],
      ["다음 장 연결", script.transition],
    ].filter(([, value]) => value).forEach(([label, value]) => {
      const row = document.createElement("p");
      const strong = document.createElement("strong");
      const span = document.createElement("span");
      strong.textContent = label;
      renderHighlightedText(span, value, keywordTerms);
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
    renderHighlightedText(speakerPromptBody, script.script || slide.speakerNote || "", collectKeywordTerms(script));
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

  function formatTime(value) {
    if (!value) return "-";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "-";
    return date.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  }

  function renderPracticeStatus(payload) {
    const learners = payload.learners || [];
    practiceStatusMeta.textContent = `${learners.length}명 · ${payload.logPath || ""} · ${formatTime(payload.generatedAt)}`;
    practiceStatusBody.replaceChildren();
    if (!learners.length) {
      const empty = document.createElement("p");
      empty.textContent = "아직 입장한 청중이 없습니다.";
      practiceStatusBody.append(empty);
      return;
    }
    learners.forEach((learner) => {
      const row = document.createElement("article");
      row.className = "practice-status-row";
      const progress = learner.progress || {};
      const latestAttempt = learner.latestAttempt || {};
      const name = document.createElement("div");
      const location = document.createElement("div");
      const score = document.createElement("div");
      const time = document.createElement("div");
      const log = document.createElement("ol");
      log.className = "practice-attempt-log";
      const nameStrong = document.createElement("strong");
      const nameSmall = document.createElement("small");
      const locationStrong = document.createElement("strong");
      const locationSmall = document.createElement("small");
      const scoreStrong = document.createElement("strong");
      const scoreSmall = document.createElement("small");
      const timeStrong = document.createElement("strong");
      const timeSmall = document.createElement("small");
      nameStrong.textContent = `${learner.displayName || learner.nickname} ${learner.disambiguator || ""}`.trim();
      nameSmall.textContent = learner.learnerSessionId;
      locationStrong.textContent = progress.practiceId || learner.currentPracticeId || "슬라이드";
      locationSmall.textContent = `${progress.stage || "-"} · slide ${Number.isInteger(progress.slideIndex) ? progress.slideIndex + 1 : "-"}`;
      scoreStrong.textContent = learner.score === null || learner.score === undefined ? "-" : String(learner.score);
      scoreSmall.textContent = `${learner.passed ? "통과" : "진행 중"} · ${learner.attemptCount || 0}회`;
      timeStrong.textContent = formatTime(progress.updatedAt || latestAttempt.recordedAt);
      timeSmall.textContent = "최근 활동";
      name.append(nameStrong, nameSmall);
      location.append(locationStrong, locationSmall);
      score.append(scoreStrong, scoreSmall);
      time.append(timeStrong, timeSmall);
      (learner.attempts || []).forEach((attempt) => {
        const item = document.createElement("li");
        item.textContent = `${formatTime(attempt.recordedAt)} · ${attempt.practiceId} · score ${attempt.score ?? "-"} · ${attempt.passed ? "pass" : "open"}`;
        log.append(item);
      });
      row.append(name, location, score, time);
      if (log.children.length) row.append(log);
      practiceStatusBody.append(row);
    });
  }

  async function refreshPracticeStatus() {
    if (!practiceStatusOpen) return;
    try {
      const response = await fetch("/api/presenter/practice-status", { cache: "no-store" });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok || payload.ok === false) throw new Error(payload.error || `HTTP ${response.status}`);
      renderPracticeStatus(payload);
    } catch (error) {
      practiceStatusMeta.textContent = `불러오기 실패: ${error.message}`;
    }
  }

  function openPracticeStatus() {
    practiceStatusOpen = true;
    practiceStatusModal.hidden = false;
    refreshPracticeStatus();
    if (!practiceStatusInterval) {
      practiceStatusInterval = setInterval(refreshPracticeStatus, 2000);
    }
  }

  function closePracticeStatus() {
    practiceStatusOpen = false;
    practiceStatusModal.hidden = true;
    if (practiceStatusInterval) {
      clearInterval(practiceStatusInterval);
      practiceStatusInterval = null;
    }
  }

  previousButton.addEventListener("click", () => setSpeakerSlide(currentIndex - 1));
  nextButton.addEventListener("click", () => setSpeakerSlide(currentIndex + 1));
  currentFrame.addEventListener("load", fitCurrentSlidePreview);
  window.addEventListener("resize", fitCurrentSlidePreview);
  timerToggle.addEventListener("click", toggleTimer);
  timerReset.addEventListener("click", resetTimer);
  practiceStatusToggle.addEventListener("click", openPracticeStatus);
  practiceStatusClose.addEventListener("click", closePracticeStatus);
  practiceStatusModal.addEventListener("click", (event) => {
    if (event.target === practiceStatusModal) closePracticeStatus();
  });
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
