const presentationSyncStatus = document.querySelector("#presentationSyncStatus");
const syncEndpoint = "/api/presentation/state";
const syncEventsEndpoint = "/api/presentation/events";
let latestRemoteRevision = 0;
let pendingSyncController = null;

function setPresentationSyncStatus(message, state = "") {
  if (!presentationSyncStatus) return;
  presentationSyncStatus.textContent = message;
  presentationSyncStatus.dataset.state = state;
}

async function publishSlideIndex(index) {
  if (window.location.protocol === "file:") {
    setPresentationSyncStatus("동기화 없음: 로컬 파일 모드", "offline");
    return;
  }

  pendingSyncController?.abort();
  pendingSyncController = new AbortController();

  try {
    const response = await fetch(syncEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ index, source: "deck" }),
      signal: pendingSyncController.signal,
    });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const payload = await response.json();
    latestRemoteRevision = Math.max(latestRemoteRevision, payload.revision || 0);
    setPresentationSyncStatus("동기화됨", "online");
  } catch (error) {
    if (error.name === "AbortError") return;
    setPresentationSyncStatus(`동기화 실패: ${error.message}`, "error");
  }
}

async function loadInitialPresentationState() {
  try {
    const response = await fetch(syncEndpoint, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const payload = await response.json();
    latestRemoteRevision = payload.revision || 0;
    window.LECTURE_DECK_CONTROL?.setSlide(payload.index || 0, {
      source: "remote",
      updateHash: true,
    });
    setPresentationSyncStatus("동기화 연결됨", "online");
  } catch (error) {
    setPresentationSyncStatus(`동기화 대기: ${error.message}`, "error");
  }
}

function connectPresentationEvents() {
  if (window.location.protocol === "file:" || !window.EventSource) {
    return;
  }

  const events = new EventSource(syncEventsEndpoint);
  events.addEventListener("state", (event) => {
    const payload = JSON.parse(event.data);
    if ((payload.revision || 0) <= latestRemoteRevision) {
      return;
    }
    latestRemoteRevision = payload.revision || 0;
    window.LECTURE_DECK_CONTROL?.setSlide(payload.index || 0, {
      source: "remote",
      updateHash: true,
    });
    setPresentationSyncStatus(`원격 이동: ${payload.index + 1}`, "online");
  });
  events.addEventListener("open", () => setPresentationSyncStatus("동기화 연결됨", "online"));
  events.addEventListener("error", () => setPresentationSyncStatus("동기화 재연결 중", "error"));
}

window.addEventListener("lecture-slide-change", (event) => {
  if (event.detail?.source === "remote") {
    return;
  }
  publishSlideIndex(event.detail.index);
});

loadInitialPresentationState();
connectPresentationEvents();
