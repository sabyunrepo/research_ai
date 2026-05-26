#!/usr/bin/env node
const { spawnSync } = require("node:child_process");
const fs = require("node:fs");
const http = require("node:http");
const path = require("node:path");
const vm = require("node:vm");

const root = path.resolve(__dirname, "..");
const deckRoot = path.join(root, "lecture-cuts");
const slidesPath = path.join(deckRoot, "assets", "slides.js");
const portIndex = process.argv.indexOf("--port");
const port = Number(portIndex >= 0 ? process.argv[portIndex + 1] : process.env.PORT || 8766);
const host = process.env.HOST || "127.0.0.1";
const audienceOnly = process.argv.includes("--audience-only") || process.env.AUDIENCE_ONLY === "1";
const maxBodyBytes = 10 * 1024 * 1024;
const presentationClients = new Set();
const audienceClients = new Set();
const presentationState = {
  index: 0,
  source: "server",
  revision: 0,
  updatedAt: new Date().toISOString(),
};

const contentTypes = new Map([
  [".html", "text/html; charset=utf-8"],
  [".css", "text/css; charset=utf-8"],
  [".js", "text/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".md", "text/markdown; charset=utf-8"],
  [".png", "image/png"],
  [".jpg", "image/jpeg"],
  [".jpeg", "image/jpeg"],
  [".svg", "image/svg+xml; charset=utf-8"],
  [".webp", "image/webp"],
]);

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, { "Content-Type": "application/json; charset=utf-8" });
  response.end(`${JSON.stringify(payload)}\n`);
}

function sendPresentationEvent(client, event, payload) {
  client.write(`event: ${event}\n`);
  client.write(`data: ${JSON.stringify(payload)}\n\n`);
}

function broadcastPresentationState() {
  for (const client of presentationClients) {
    sendPresentationEvent(client, "state", presentationState);
  }
  for (const client of audienceClients) {
    sendPresentationEvent(client, "state", getAudienceState());
  }
}

function readRequestJson(request) {
  return new Promise((resolve, reject) => {
    let bytes = 0;
    let body = "";
    request.setEncoding("utf8");
    request.on("data", (chunk) => {
      bytes += Buffer.byteLength(chunk);
      if (bytes > maxBodyBytes) {
        reject(new Error("요청 본문이 너무 큽니다."));
        request.destroy();
        return;
      }
      body += chunk;
    });
    request.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        reject(new Error("JSON 요청 본문을 해석하지 못했습니다."));
      }
    });
    request.on("error", reject);
  });
}

function loadSlides() {
  const code = fs.readFileSync(slidesPath, "utf8");
  const context = { window: {} };
  vm.createContext(context);
  vm.runInContext(code, context, { filename: path.relative(root, slidesPath) });
  if (!Array.isArray(context.window.LECTURE_SLIDES)) {
    throw new Error("assets/slides.js에서 window.LECTURE_SLIDES 배열을 찾지 못했습니다.");
  }
  return context.window.LECTURE_SLIDES;
}

function writeSlides(slides) {
  fs.writeFileSync(slidesPath, `window.LECTURE_SLIDES = ${JSON.stringify(slides, null, 2)};\n`);
}

function getSlideFile(slide) {
  return typeof slide === "string" ? slide : slide.file;
}

function getSlidePath(file) {
  const slidePath = path.normalize(path.join(deckRoot, file));
  if (!slidePath.startsWith(deckRoot + path.sep)) {
    throw new Error(`허용되지 않는 슬라이드 경로입니다: ${file}`);
  }
  return slidePath;
}

function extractMainSlide(html) {
  const match = html.match(/<main\b[^>]*class=["'][^"']*\bslide\b[^"']*["'][^>]*>[\s\S]*<\/main>/i);
  return match ? match[0] : "";
}

function extractNoteHtml(slideHtml) {
  const match = slideHtml.match(/<div\b[^>]*class=["'][^"']*\bnote\b[^"']*["'][^>]*>[\s\S]*?<\/div>/i);
  return match ? match[0] : "";
}

function sanitizeAudienceSlide(slideHtml) {
  return slideHtml
    .replace(/<div\b[^>]*class=["'][^"']*\bnote\b[^"']*["'][^>]*>[\s\S]*?<\/div>/gi, "")
    .replace(/<script\b[\s\S]*?<\/script>/gi, "")
    .replace(/<style\b[\s\S]*?<\/style>/gi, "")
    .replace(/\s+on[a-z]+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, "");
}

function getAudienceSlides() {
  const slides = loadSlides();
  const maxIndex = Math.min(presentationState.index, slides.length - 1);
  return slides.slice(0, maxIndex + 1).map((slide, index) => ({
    index,
    file: getSlideFile(slide),
    title: slide.reviewTitle || getSlideFile(slide),
    sectionId: slide.sectionId || "",
    sectionTitle: slide.sectionTitle || "",
    sectionStart: Boolean(slide.sectionStart),
    sectionIndex: slide.sectionIndex || 1,
    sectionTotal: slide.sectionTotal || 1,
  }));
}

function getAudienceState() {
  return {
    index: presentationState.index,
    revision: presentationState.revision,
    updatedAt: presentationState.updatedAt,
  };
}

function sendAudienceSlide(response, index) {
  const slides = loadSlides();
  if (!Number.isInteger(index) || index < 0 || index >= slides.length || index > presentationState.index) {
    sendJson(response, 403, { ok: false, error: "아직 공개되지 않은 슬라이드입니다." });
    return;
  }

  const slide = slides[index];
  const file = getSlideFile(slide);
  const rawHtml = fs.readFileSync(getSlidePath(file), "utf8");
  const mainSlide = extractMainSlide(rawHtml);
  if (!mainSlide) {
    sendJson(response, 500, { ok: false, error: `${file}에서 main.slide를 찾지 못했습니다.` });
    return;
  }

  const title = slide.reviewTitle || file;
  const sectionLabel = slide.sectionTitle
    ? slide.sectionStart
      ? `SECTION ${slide.sectionId} · ${slide.sectionTitle}`
      : `${slide.sectionTitle} · ${slide.sectionIndex || 1}/${slide.sectionTotal || 1}`
    : "";
  const safeSlide = sanitizeAudienceSlide(mainSlide);
  const bodyClass = slide.sectionStart ? "is-section-start" : "is-section-detail";
  response.writeHead(200, {
    "Content-Type": "text/html; charset=utf-8",
    "Cache-Control": "no-store",
  });
  response.end(`<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <base href="/">
  <title>${escapeHtml(title)}</title>
  <link rel="stylesheet" href="/assets/style.css">
</head>
<body class="audience-slide-body">
  <article class="deck-frame audience-slide-frame ${bodyClass}" aria-label="${escapeHtml(title)}">
    ${safeSlide}
    <div class="deck-section-label">${escapeHtml(sectionLabel)}</div>
    <div class="deck-slide-number">${String(index + 1).padStart(2, "0")} / ${slides.length}</div>
  </article>
</body>
</html>`);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function preserveNoteHtml(nextSlideHtml, previousSlideHtml) {
  if (extractNoteHtml(nextSlideHtml)) {
    return nextSlideHtml;
  }
  const note = extractNoteHtml(previousSlideHtml);
  if (!note) {
    return nextSlideHtml;
  }
  return nextSlideHtml.replace(/<\/section>/i, `${note}</section>`);
}

function writeSlideHtml(file, nextSlideHtml) {
  const slidePath = getSlidePath(file);
  const currentHtml = fs.readFileSync(slidePath, "utf8");
  const currentSlideHtml = extractMainSlide(currentHtml);
  if (!currentSlideHtml) {
    throw new Error(`${file}에서 main.slide를 찾지 못했습니다.`);
  }
  const slideHtml = preserveNoteHtml(nextSlideHtml, currentSlideHtml);
  fs.writeFileSync(slidePath, currentHtml.replace(currentSlideHtml, slideHtml));
}

function normalizeChange(change) {
  if (!change || typeof change !== "object") {
    throw new Error("변경 항목 형식이 올바르지 않습니다.");
  }
  const file = String(change.file || "").trim();
  const hasScript = Object.prototype.hasOwnProperty.call(change, "heading") || Object.prototype.hasOwnProperty.call(change, "html");
  const hasCues = Object.prototype.hasOwnProperty.call(change, "cues");
  const heading = hasScript ? String(change.heading || "").trim() : undefined;
  const html = hasScript ? String(change.html || "").trim() : undefined;
  const cues = hasCues && change.cues && typeof change.cues === "object"
    ? {
        purpose: String(change.cues.purpose || "").trim(),
        keywords: Array.isArray(change.cues.keywords)
          ? change.cues.keywords.map((keyword) => String(keyword || "").trim()).filter(Boolean)
          : [],
        flow: Array.isArray(change.cues.flow)
          ? change.cues.flow.map((step) => String(step || "").trim()).filter(Boolean)
          : [],
        example: String(change.cues.example || "").trim(),
        bridge: String(change.cues.bridge || "").trim(),
      }
    : undefined;
  const slideHtml = Object.prototype.hasOwnProperty.call(change, "slideHtml") ? String(change.slideHtml || "").trim() : undefined;
  if (!/^[\w.-]+\.html$/.test(file)) {
    throw new Error(`허용되지 않는 슬라이드 파일명입니다: ${file}`);
  }
  if (!hasScript && !hasCues && !slideHtml) {
    throw new Error(`${file}에 저장할 변경 내용이 없습니다.`);
  }
  if (hasScript && !heading) {
    throw new Error(`${file}의 스크립트 제목이 비어 있습니다.`);
  }
  if (hasScript && !html) {
    throw new Error(`${file}의 발표 스크립트 본문이 비어 있습니다.`);
  }
  if (heading && heading.length > 240) {
    throw new Error(`${file}의 스크립트 제목이 너무 깁니다.`);
  }
  if (html && html.length > 30000) {
    throw new Error(`${file}의 발표 스크립트 본문이 너무 깁니다.`);
  }
  if (hasCues) {
    const cueTextLength = [
      cues.purpose,
      cues.keywords.join(" "),
      cues.flow.join(" "),
      cues.example,
      cues.bridge,
    ].join(" ").length;
    if (cueTextLength > 2000) {
      throw new Error(`${file}의 발표 큐가 너무 깁니다.`);
    }
  }
  if (slideHtml) {
    if (!/^<main\b[^>]*class=["'][^"']*\bslide\b/i.test(slideHtml)) {
      throw new Error(`${file}의 슬라이드 HTML은 main.slide로 시작해야 합니다.`);
    }
    if (/<script\b|<style\b/i.test(slideHtml)) {
      throw new Error(`${file}의 슬라이드 HTML에는 script/style 태그를 저장할 수 없습니다.`);
    }
    if (slideHtml.length > 120000) {
      throw new Error(`${file}의 슬라이드 HTML이 너무 깁니다.`);
    }
  }
  return { file, heading, html, cues, slideHtml, hasScript, hasCues };
}

function regenerateContract() {
  const result = spawnSync(process.execPath, ["scripts/export-lecture-cuts-contract.js"], {
    cwd: root,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
  if (result.error) {
    throw result.error;
  }
  if (result.status !== 0) {
    const output = [result.stdout, result.stderr].filter(Boolean).join("\n").trim();
    throw new Error(`slide-spec 재생성 실패${output ? `\n${output}` : ""}`);
  }
  return result.stdout.trim();
}

async function handleSave(request, response) {
  try {
    const payload = await readRequestJson(request);
    if (!Array.isArray(payload.slides)) {
      throw new Error("slides 배열이 필요합니다.");
    }
    const changes = payload.slides.map(normalizeChange);
    const slides = loadSlides();
    const byFile = new Map(changes.map((change) => [change.file, change]));
    const missing = new Set(byFile.keys());
    let savedScripts = 0;
    let savedCues = 0;
    let savedSlides = 0;

    slides.forEach((slide) => {
      if (!slide || typeof slide !== "object") return;
      const change = byFile.get(slide.file);
      if (!change) return;
      if (change.hasScript) {
        slide.speaker = {
          ...(slide.speaker || {}),
          heading: change.heading,
          html: change.html,
        };
        savedScripts += 1;
      }
      if (change.hasCues) {
        slide.speaker = {
          ...(slide.speaker || {}),
          cues: change.cues,
        };
        savedCues += 1;
      }
      if (change.slideHtml) {
        writeSlideHtml(slide.file, change.slideHtml);
        savedSlides += 1;
      }
      missing.delete(slide.file);
    });

    if (missing.size) {
      throw new Error(`등록되지 않은 슬라이드입니다: ${[...missing].join(", ")}`);
    }

    if (savedScripts > 0 || savedCues > 0 || savedSlides > 0) {
      writeSlides(slides);
      const exportOutput = regenerateContract();
      sendJson(response, 200, {
        ok: true,
        saved: savedScripts + savedCues + savedSlides,
        savedScripts,
        savedCues,
        savedSlides,
        regenerated: true,
        exportOutput,
      });
      return;
    }

    sendJson(response, 200, { ok: true, saved: 0, savedScripts, savedCues, savedSlides, regenerated: false });
  } catch (error) {
    sendJson(response, 400, { ok: false, error: error.message });
  }
}

async function handlePresentationState(request, response) {
  try {
    const payload = await readRequestJson(request);
    const slides = loadSlides();
    const index = Number(payload.index);
    if (!Number.isInteger(index) || index < 0 || index >= slides.length) {
      throw new Error(`슬라이드 index가 범위를 벗어났습니다: ${payload.index}`);
    }

    presentationState.index = index;
    presentationState.source = String(payload.source || "unknown").slice(0, 48);
    presentationState.revision += 1;
    presentationState.updatedAt = new Date().toISOString();
    broadcastPresentationState();
    sendJson(response, 200, { ok: true, ...presentationState });
  } catch (error) {
    sendJson(response, 400, { ok: false, error: error.message });
  }
}

function handlePresentationEvents(request, response) {
  response.writeHead(200, {
    "Content-Type": "text/event-stream; charset=utf-8",
    "Cache-Control": "no-store, no-transform",
    Connection: "keep-alive",
    "X-Accel-Buffering": "no",
  });
  response.write("\n");
  presentationClients.add(response);
  sendPresentationEvent(response, "state", presentationState);
  request.on("close", () => {
    presentationClients.delete(response);
  });
}

function handleAudienceSlides(request, response) {
  try {
    sendJson(response, 200, {
      ok: true,
      state: getAudienceState(),
      slides: getAudienceSlides(),
    });
  } catch (error) {
    sendJson(response, 500, { ok: false, error: error.message });
  }
}

function handleAudienceEvents(request, response) {
  response.writeHead(200, {
    "Content-Type": "text/event-stream; charset=utf-8",
    "Cache-Control": "no-store, no-transform",
    Connection: "keep-alive",
    "X-Accel-Buffering": "no",
  });
  response.write("\n");
  const client = {
    write(chunk) {
      response.write(chunk);
    },
  };
  const sendState = () => sendPresentationEvent(client, "state", getAudienceState());
  audienceClients.add(client);
  sendState();
  request.on("close", () => {
    audienceClients.delete(client);
  });
}

function isAudienceStaticPath(pathname) {
  if (pathname === "/" || pathname === "/audience.html") return true;
  if (pathname === "/assets/style.css" || pathname === "/assets/audience.js" || pathname === "/assets/glossary.js") return true;
  return /^\/assets\/(?:handdrawn|generated)\/[\w.-]+\.(?:png|jpg|jpeg|svg|webp)$/i.test(pathname);
}

function isPublicAudienceRequest(request) {
  return audienceOnly || Boolean(request.headers["cf-ray"] || request.headers["cf-connecting-ip"]);
}

function serveStatic(request, response, publicAudienceOnly = isPublicAudienceRequest(request)) {
  const url = new URL(request.url, `http://${request.headers.host || `${host}:${port}`}`);
  const rawPathname = decodeURIComponent(url.pathname);
  if (publicAudienceOnly && !isAudienceStaticPath(rawPathname)) {
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Not found\n");
    return;
  }
  const pathname = rawPathname === "/" ? (publicAudienceOnly ? "/audience.html" : "/index.html") : rawPathname;
  const requestedPath = path.normalize(path.join(deckRoot, pathname));

  if (!requestedPath.startsWith(deckRoot + path.sep) && requestedPath !== deckRoot) {
    response.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Forbidden\n");
    return;
  }

  fs.readFile(requestedPath, (error, data) => {
    if (error) {
      response.writeHead(error.code === "ENOENT" ? 404 : 500, { "Content-Type": "text/plain; charset=utf-8" });
      response.end(error.code === "ENOENT" ? "Not found\n" : `${error.message}\n`);
      return;
    }
    response.writeHead(200, {
      "Content-Type": contentTypes.get(path.extname(requestedPath).toLowerCase()) || "application/octet-stream",
      "Cache-Control": "no-store",
    });
    response.end(data);
  });
}

const server = http.createServer((request, response) => {
  const publicAudienceOnly = isPublicAudienceRequest(request);
  if (request.method === "GET" && request.url?.startsWith("/api/audience/slides")) {
    handleAudienceSlides(request, response);
    return;
  }
  if (request.method === "GET" && request.url?.startsWith("/api/audience/events")) {
    handleAudienceEvents(request, response);
    return;
  }
  if (request.method === "GET" && request.url?.startsWith("/api/audience/slide/")) {
    const url = new URL(request.url, `http://${request.headers.host || `${host}:${port}`}`);
    const index = Number(url.pathname.split("/").pop());
    sendAudienceSlide(response, index);
    return;
  }
  if (publicAudienceOnly) {
    if (request.method === "GET" || request.method === "HEAD") {
      serveStatic(request, response, publicAudienceOnly);
      return;
    }
    response.writeHead(405, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Method not allowed\n");
    return;
  }
  if (request.method === "GET" && request.url?.startsWith("/api/presentation/state")) {
    sendJson(response, 200, { ok: true, ...presentationState });
    return;
  }
  if (request.method === "GET" && request.url?.startsWith("/api/presentation/events")) {
    handlePresentationEvents(request, response);
    return;
  }
  if (request.method === "POST" && request.url?.startsWith("/api/presentation/state")) {
    handlePresentationState(request, response);
    return;
  }
  if (request.method === "POST" && request.url?.startsWith("/api/presenter-review/save")) {
    handleSave(request, response);
    return;
  }
  if (request.method === "GET" || request.method === "HEAD") {
    serveStatic(request, response, publicAudienceOnly);
    return;
  }
  response.writeHead(405, { "Content-Type": "text/plain; charset=utf-8" });
  response.end("Method not allowed\n");
});

server.listen(port, host, () => {
  console.log(`Presenter review server: http://${host}:${port}/presenter-review.html`);
  console.log(`Speaker console: http://${host}:${port}/speaker.html`);
  console.log(`Stage deck: http://${host}:${port}/deck.html`);
  console.log(`Audience page: http://${host}:${port}/audience.html${audienceOnly ? " (audience-only)" : ""}`);
});
