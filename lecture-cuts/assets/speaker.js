const speakerSlides = window.LECTURE_SLIDES || [];
const speakerStatus = document.querySelector("#speakerStatus");
const speakerSyncStatus = document.querySelector("#speakerSyncStatus");
const currentSlideFrame = document.querySelector("#currentSlideFrame");
const nextSlideFrame = document.querySelector("#nextSlideFrame");
const currentSlideLabel = document.querySelector("#currentSlideLabel");
const nextSlideLabel = document.querySelector("#nextSlideLabel");
const speakerMeta = document.querySelector("#speakerMeta");
const speakerPromptTitle = document.querySelector("#speakerPromptTitle");
const speakerPromptBody = document.querySelector("#speakerPromptBody");
const speakerCuePanel = document.querySelector("#speakerCuePanel");
const previousButton = document.querySelector("#speakerPrevious");
const nextButton = document.querySelector("#speakerNext");
const timerToggle = document.querySelector("#timerToggle");
const timerReset = document.querySelector("#timerReset");
const timerDisplay = document.querySelector("#speakerTimer");
const stateEndpoint = "/api/presentation/state";
const eventsEndpoint = "/api/presentation/events";
let currentIndex = 0;
let latestRevision = 0;
let timerStartedAt = 0;
let timerElapsedMs = 0;
let timerInterval = null;

function getSlideFile(slide) {
  return typeof slide === "string" ? slide : slide.file;
}

function makeSlideLabel(index) {
  return `${String(index + 1).padStart(2, "0")} / ${speakerSlides.length}`;
}

function setSyncStatus(message, state = "") {
  if (!speakerSyncStatus) return;
  speakerSyncStatus.textContent = message;
  speakerSyncStatus.dataset.state = state;
}

function setSpeakerStatus(message) {
  if (!speakerStatus) return;
  speakerStatus.textContent = message;
}

function renderCueList(cues = {}) {
  speakerCuePanel.replaceChildren();
  const rows = [
    ["목적", cues.purpose],
    ["키워드", Array.isArray(cues.keywords) ? cues.keywords.join(", ") : cues.keywords],
    ["말할 순서", Array.isArray(cues.flow) ? cues.flow.join(" / ") : cues.flow],
    ["예시", cues.example],
    ["다음 연결", cues.bridge],
  ].filter(([, value]) => value);

  rows.forEach(([label, value]) => {
    const row = document.createElement("p");
    const strong = document.createElement("strong");
    strong.textContent = label;
    const span = document.createElement("span");
    span.textContent = value;
    row.append(strong, span);
    speakerCuePanel.append(row);
  });
}

function renderSpeaker(index) {
  if (!speakerSlides.length) {
    setSpeakerStatus("등록된 슬라이드가 없습니다.");
    return;
  }

  currentIndex = Math.min(Math.max(index, 0), speakerSlides.length - 1);
  const currentSlide = speakerSlides[currentIndex];
  const nextSlide = speakerSlides[currentIndex + 1];
  const currentFile = getSlideFile(currentSlide);
  const nextFile = nextSlide ? getSlideFile(nextSlide) : "";
  const speaker = currentSlide.speaker || {};

  currentSlideFrame.src = currentFile;
  nextSlideFrame.src = nextFile || "about:blank";
  currentSlideLabel.textContent = makeSlideLabel(currentIndex);
  nextSlideLabel.textContent = nextSlide ? makeSlideLabel(currentIndex + 1) : "마지막";
  speakerMeta.textContent = `${currentSlide.sectionTitle || "Slide"} · ${currentSlide.reviewTitle || currentFile}`;
  speakerPromptTitle.textContent = speaker.heading || currentSlide.reviewTitle || currentFile;
  speakerPromptBody.innerHTML = speaker.html || "<p>등록된 발표 프롬프트가 없습니다.</p>";
  renderCueList(speaker.cues || {});
  previousButton.disabled = currentIndex === 0;
  nextButton.disabled = currentIndex === speakerSlides.length - 1;
  setSpeakerStatus(`${makeSlideLabel(currentIndex)} · ${currentSlide.reviewTitle || currentFile}`);
}

async function publishSpeakerState(index) {
  if (window.location.protocol === "file:") {
    setSyncStatus("동기화 없음: 로컬 파일 모드", "offline");
    return;
  }

  try {
    const response = await fetch(stateEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ index, source: "speaker" }),
    });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const payload = await response.json();
    latestRevision = Math.max(latestRevision, payload.revision || 0);
    setSyncStatus("동기화됨", "online");
  } catch (error) {
    setSyncStatus(`동기화 실패: ${error.message}`, "error");
  }
}

function setSpeakerSlide(index, options = {}) {
  renderSpeaker(index);
  if (options.publish !== false) {
    publishSpeakerState(currentIndex);
  }
}

async function loadInitialState() {
  try {
    const response = await fetch(stateEndpoint, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
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
  if (window.location.protocol === "file:" || !window.EventSource) {
    return;
  }

  const events = new EventSource(eventsEndpoint);
  events.addEventListener("state", (event) => {
    const payload = JSON.parse(event.data);
    if ((payload.revision || 0) <= latestRevision) {
      return;
    }
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

function updateTimer() {
  const runningMs = timerStartedAt ? Date.now() - timerStartedAt : 0;
  timerDisplay.textContent = formatElapsed(timerElapsedMs + runningMs);
}

function toggleTimer() {
  if (timerStartedAt) {
    timerElapsedMs += Date.now() - timerStartedAt;
    timerStartedAt = 0;
    clearInterval(timerInterval);
    timerInterval = null;
    timerToggle.textContent = "Start";
    updateTimer();
    return;
  }

  timerStartedAt = Date.now();
  timerInterval = setInterval(updateTimer, 250);
  timerToggle.textContent = "Pause";
  updateTimer();
}

function resetTimer() {
  timerStartedAt = timerStartedAt ? Date.now() : 0;
  timerElapsedMs = 0;
  updateTimer();
}

previousButton.addEventListener("click", () => setSpeakerSlide(currentIndex - 1));
nextButton.addEventListener("click", () => setSpeakerSlide(currentIndex + 1));
timerToggle.addEventListener("click", toggleTimer);
timerReset.addEventListener("click", resetTimer);
window.addEventListener("keydown", (event) => {
  if (event.target?.closest?.("input, textarea, select, [contenteditable='true']")) {
    return;
  }
  if (["ArrowRight", "PageDown", " "].includes(event.key)) {
    event.preventDefault();
    setSpeakerSlide(currentIndex + 1);
  } else if (["ArrowLeft", "PageUp", "Backspace"].includes(event.key)) {
    event.preventDefault();
    setSpeakerSlide(currentIndex - 1);
  }
});

loadInitialState();
connectEvents();
updateTimer();
