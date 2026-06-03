(() => {
  const audienceStatus = document.querySelector("#audienceStatus");
  const audienceProgress = document.querySelector("#audienceProgress");
  const audienceFrame = document.querySelector("#audienceSlideFrame");
  const audienceFrameCanvas = document.querySelector(".audience-frame-canvas");
  const audienceStage = document.querySelector(".audience-stage");
  const audiencePrevious = document.querySelector("#audiencePrevious");
  const audienceNext = document.querySelector("#audienceNext");
  const audienceFollowToggle = document.querySelector("#audienceFollowToggle");
  const audiencePanelToggle = document.querySelector("#audiencePanelToggle");
  const audiencePanelRestore = document.querySelector("#audiencePanelRestore");
  const audienceListPanel = document.querySelector(".audience-list-panel");
  const audienceSlideList = document.querySelector("#audienceSlideList");
  const identityPanel = document.querySelector("#audienceIdentityPanel");
  const identityForm = document.querySelector("#audienceIdentityForm");
  const identityStatus = document.querySelector("#audienceIdentityStatus");
  const nicknameInput = document.querySelector("#audienceNickname");
  const learnerBadge = document.querySelector("#audienceLearnerBadge");
  const practicePanel = document.querySelector("#audiencePracticePanel");
  const practiceTitle = document.querySelector("#audiencePracticeTitle");
  const practiceMeta = document.querySelector("#audiencePracticeMeta");
  const practiceFrame = document.querySelector("#audiencePracticeFrame");
  const practiceClose = document.querySelector("#audiencePracticeClose");
  let availableSlides = [];
  let currentIndex = 0;
  let followMode = true;
  let latestRevision = 0;
  let learner = null;
  let activePracticeId = "";
  const frameSize = { width: 1280, height: 720 };

  function setAudienceStatus(message) {
    audienceStatus.textContent = message;
  }

  function getMaxIndex() {
    return Math.max(0, availableSlides.length - 1);
  }

  function makeLabel(index) {
    return `${String(index + 1).padStart(2, "0")} / ${availableSlides.length || "--"}`;
  }

  function setFollowMode(nextFollowMode) {
    followMode = nextFollowMode;
    audienceFollowToggle.setAttribute("aria-pressed", String(followMode));
    audienceFollowToggle.dataset.state = followMode ? "following" : "paused";
    audienceFollowToggle.textContent = followMode ? "따라가는 중" : "따라가기";
  }

  function setListPanelHidden(hidden) {
    document.body.classList.toggle("audience-list-hidden", hidden);
    audienceListPanel.hidden = hidden;
    audiencePanelRestore.hidden = !hidden;
    audiencePanelToggle.setAttribute("aria-expanded", String(!hidden));
    audiencePanelToggle.textContent = hidden ? "표시" : "숨김";
    requestAnimationFrame(resizeAudienceFrame);
  }

  function resizeAudienceFrame() {
    const bounds = audienceStage.getBoundingClientRect();
    const scale = Math.min(bounds.width / frameSize.width, bounds.height / frameSize.height);
    audienceFrameCanvas.style.transform = `scale(${Math.max(0.1, scale)})`;
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
      const title = document.createElement("span");
      number.textContent = String(slide.index + 1).padStart(2, "0");
      title.textContent = slide.title || slide.file;
      button.append(number, title);
      button.addEventListener("click", () => {
        setFollowMode(false);
        setAudienceSlide(slide.index);
      });
      audienceSlideList.append(button);
    });
  }

  async function postProgress(slide, stage, practiceId = "") {
    if (!learner) return;
    await fetch("/api/learner/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        learnerSessionId: learner.learnerSessionId,
        slideIndex: slide?.index,
        slideId: slide?.id || "",
        practiceId,
        stage,
      }),
    }).catch(() => {});
  }

  function renderLearner(nextLearner) {
    learner = nextLearner;
    learnerBadge.hidden = !learner;
    learnerBadge.textContent = learner ? `${learner.displayName || learner.nickname} ${learner.disambiguator || ""}`.trim() : "";
    identityPanel.hidden = Boolean(learner);
  }

  async function ensureLearnerSession() {
    const response = await fetch("/api/learner/session", { cache: "no-store" });
    const payload = await response.json().catch(() => ({}));
    if (response.ok && payload.ok && payload.learner) {
      renderLearner(payload.learner);
    }
  }

  async function joinAudience(event) {
    event.preventDefault();
    const nickname = nicknameInput.value.trim();
    if (!nickname) return;
    identityStatus.textContent = "입장 중입니다.";
    const response = await fetch("/api/learner/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nickname }),
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok || !payload.ok) {
      identityStatus.textContent = payload.error || "입장하지 못했습니다.";
      return;
    }
    renderLearner(payload.learner);
    identityStatus.textContent = "";
    if (availableSlides[currentIndex]) postProgress(availableSlides[currentIndex], "slide");
  }

  function renderPractice(slide) {
    const practice = slide?.practiceAfter || null;
    if (!practice) {
      activePracticeId = "";
      practicePanel.hidden = true;
      practiceFrame.removeAttribute("src");
      postProgress(slide, "slide");
      return;
    }
    practicePanel.hidden = false;
    practiceTitle.textContent = practice.title || practice.practiceId;
    practiceMeta.textContent = practice.label || "";
    if (activePracticeId !== practice.practiceId) {
      activePracticeId = practice.practiceId;
      practiceFrame.src = `/practices/${encodeURIComponent(practice.practiceId)}`;
    }
    postProgress(slide, "practice-visible", practice.practiceId);
  }

  function setAudienceSlide(index) {
    if (!availableSlides.length) return;
    currentIndex = Math.min(Math.max(index, 0), getMaxIndex());
    audienceFrame.src = `/api/audience/slide/${currentIndex}`;
    const slide = availableSlides[currentIndex];
    audienceProgress.textContent = makeLabel(currentIndex);
    audiencePrevious.disabled = currentIndex === 0;
    audienceNext.disabled = currentIndex >= getMaxIndex();
    setAudienceStatus(`공개됨 · ${slide.title || slide.file}`);
    audienceSlideList.querySelectorAll(".audience-slide-list-item").forEach((button) => {
      button.setAttribute("aria-current", String(Number(button.dataset.index) === currentIndex));
    });
    renderPractice(slide);
  }

  async function refreshAudienceSlides(options = {}) {
    const response = await fetch("/api/audience/slides", { cache: "no-store" });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok || !payload.ok) throw new Error(payload.error || `HTTP ${response.status}`);
    availableSlides = payload.slides || [];
    latestRevision = Math.max(latestRevision, payload.state?.revision || 0);
    renderSlideList();
    const targetIndex = options.forceFollow || followMode ? getMaxIndex() : Math.min(currentIndex, getMaxIndex());
    setAudienceSlide(targetIndex);
  }

  function connectAudienceEvents() {
    if (!window.EventSource) return;
    const events = new EventSource("/api/audience/events");
    events.addEventListener("state", async (event) => {
      const payload = JSON.parse(event.data);
      if ((payload.revision || 0) <= latestRevision) return;
      latestRevision = payload.revision || 0;
      try {
        await refreshAudienceSlides({ forceFollow: followMode });
      } catch (error) {
        setAudienceStatus(`업데이트 실패: ${error.message}`);
      }
    });
    events.addEventListener("error", () => setAudienceStatus("라이브 연결을 재시도하는 중입니다."));
  }

  audiencePrevious.addEventListener("click", () => {
    setFollowMode(false);
    setAudienceSlide(currentIndex - 1);
  });
  audienceNext.addEventListener("click", () => {
    setFollowMode(false);
    setAudienceSlide(currentIndex + 1);
  });
  audienceFollowToggle.addEventListener("click", () => {
    setFollowMode(!followMode);
    if (followMode) setAudienceSlide(getMaxIndex());
  });
  audiencePanelToggle.addEventListener("click", () => setListPanelHidden(true));
  audiencePanelRestore.addEventListener("click", () => setListPanelHidden(false));
  practiceClose.addEventListener("click", () => {
    practicePanel.hidden = true;
    if (availableSlides[currentIndex]) postProgress(availableSlides[currentIndex], "practice-hidden", activePracticeId);
  });
  identityForm.addEventListener("submit", joinAudience);
  window.addEventListener("keydown", (event) => {
    if (event.target?.closest?.("input, textarea, select, [contenteditable='true']")) return;
    if (["ArrowLeft", "PageUp", "Backspace"].includes(event.key)) {
      event.preventDefault();
      setFollowMode(false);
      setAudienceSlide(currentIndex - 1);
    } else if (["ArrowRight", "PageDown", " "].includes(event.key)) {
      event.preventDefault();
      setFollowMode(false);
      setAudienceSlide(currentIndex + 1);
    }
  });
  window.addEventListener("resize", resizeAudienceFrame);

  setFollowMode(true);
  resizeAudienceFrame();
  ensureLearnerSession()
    .then(() => refreshAudienceSlides({ forceFollow: true }))
    .then(connectAudienceEvents)
    .catch((error) => setAudienceStatus(`청강자 화면을 불러오지 못했습니다: ${error.message}`));
})();
