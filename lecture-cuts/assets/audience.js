const audienceStatus = document.querySelector("#audienceStatus");
const audienceProgress = document.querySelector("#audienceProgress");
const audienceFrame = document.querySelector("#audienceSlideFrame");
const audiencePrevious = document.querySelector("#audiencePrevious");
const audienceNext = document.querySelector("#audienceNext");
const audienceLiveToggle = document.querySelector("#audienceLiveToggle");
const audienceSlideList = document.querySelector("#audienceSlideList");
let availableSlides = [];
let currentIndex = 0;
let liveMode = true;
let latestRevision = 0;

function setAudienceStatus(message) {
  audienceStatus.textContent = message;
}

function getMaxIndex() {
  return Math.max(0, availableSlides.length - 1);
}

function makeLabel(index) {
  return `${String(index + 1).padStart(2, "0")} / ${availableSlides.length || "--"}`;
}

function setLiveMode(nextLiveMode) {
  liveMode = nextLiveMode;
  audienceLiveToggle.setAttribute("aria-pressed", String(liveMode));
  audienceLiveToggle.textContent = liveMode ? "Live" : "Review";
  audienceLiveToggle.dataset.state = liveMode ? "live" : "review";
}

function renderSlideList() {
  audienceSlideList.replaceChildren();
  availableSlides.forEach((slide) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "audience-slide-list-item";
    button.dataset.index = String(slide.index);
    button.setAttribute("aria-current", String(slide.index === currentIndex));
    const number = document.createElement("strong");
    number.textContent = String(slide.index + 1).padStart(2, "0");
    const title = document.createElement("span");
    title.textContent = slide.title || slide.file;
    button.append(number, title);
    button.addEventListener("click", () => {
      setLiveMode(false);
      setAudienceSlide(slide.index);
    });
    audienceSlideList.append(button);
  });
}

function setAudienceSlide(index) {
  if (!availableSlides.length) {
    return;
  }
  currentIndex = Math.min(Math.max(index, 0), getMaxIndex());
  audienceFrame.src = `/api/audience/slide/${currentIndex}`;
  const slide = availableSlides[currentIndex];
  audienceProgress.textContent = makeLabel(currentIndex);
  audiencePrevious.disabled = currentIndex === 0;
  audienceNext.disabled = currentIndex >= getMaxIndex();
  setAudienceStatus(`${makeLabel(currentIndex)} · ${slide.title || slide.file}${liveMode ? " · Live" : " · Review"}`);
  audienceSlideList.querySelectorAll(".audience-slide-list-item").forEach((button) => {
    button.setAttribute("aria-current", String(Number(button.dataset.index) === currentIndex));
  });
}

async function refreshAudienceSlides(options = {}) {
  const response = await fetch("/api/audience/slides", { cache: "no-store" });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok || !payload.ok) {
    throw new Error(payload.error || `HTTP ${response.status}`);
  }
  availableSlides = payload.slides || [];
  latestRevision = Math.max(latestRevision, payload.state?.revision || 0);
  renderSlideList();
  const targetIndex = options.forceLive || liveMode ? getMaxIndex() : Math.min(currentIndex, getMaxIndex());
  setAudienceSlide(targetIndex);
}

function connectAudienceEvents() {
  if (!window.EventSource) {
    return;
  }
  const events = new EventSource("/api/audience/events");
  events.addEventListener("state", async (event) => {
    const payload = JSON.parse(event.data);
    if ((payload.revision || 0) <= latestRevision) {
      return;
    }
    latestRevision = payload.revision || 0;
    try {
      await refreshAudienceSlides({ forceLive: liveMode });
    } catch (error) {
      setAudienceStatus(`업데이트 실패: ${error.message}`);
    }
  });
  events.addEventListener("error", () => {
    setAudienceStatus("라이브 연결을 재시도하는 중입니다.");
  });
}

audiencePrevious.addEventListener("click", () => {
  setLiveMode(false);
  setAudienceSlide(currentIndex - 1);
});
audienceNext.addEventListener("click", () => {
  const nextIndex = currentIndex + 1;
  setLiveMode(nextIndex >= getMaxIndex());
  setAudienceSlide(nextIndex);
});
audienceLiveToggle.addEventListener("click", () => {
  setLiveMode(!liveMode);
  if (liveMode) {
    setAudienceSlide(getMaxIndex());
  } else {
    setAudienceStatus(`${makeLabel(currentIndex)} · Review`);
  }
});
window.addEventListener("keydown", (event) => {
  if (event.target?.closest?.("input, textarea, select, [contenteditable='true']")) {
    return;
  }
  if (["ArrowLeft", "PageUp", "Backspace"].includes(event.key)) {
    event.preventDefault();
    setLiveMode(false);
    setAudienceSlide(currentIndex - 1);
  } else if (["ArrowRight", "PageDown", " "].includes(event.key)) {
    event.preventDefault();
    const nextIndex = currentIndex + 1;
    setLiveMode(nextIndex >= getMaxIndex());
    setAudienceSlide(nextIndex);
  }
});

refreshAudienceSlides({ forceLive: true })
  .then(connectAudienceEvents)
  .catch((error) => {
    setAudienceStatus(`청강자 화면을 불러오지 못했습니다: ${error.message}`);
  });
