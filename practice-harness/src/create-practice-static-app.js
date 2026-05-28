const fs = require("node:fs/promises");
const path = require("node:path");

const PUBLIC_DIR = path.join(__dirname, "..", "public");

const CONTENT_TYPES = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml; charset=utf-8",
};

function isApiRequest(urlPathname) {
  return urlPathname === "/api" || urlPathname.startsWith("/api/");
}

function isPracticeClientRoute(urlPathname) {
  return /^\/act\/\d+$/.test(urlPathname) || /^\/practices\/[a-z0-9-]+$/i.test(urlPathname);
}

function sendStaticError(response, statusCode, message) {
  response.writeHead(statusCode, {
    "content-type": "text/plain; charset=utf-8",
    "cache-control": "no-store",
  });
  response.end(message);
}

function resolvePublicPath(urlPathname) {
  const decodedPath = decodeURIComponent(urlPathname);
  const relativePath = decodedPath === "/" ? "index.html" : decodedPath.slice(1);
  const filePath = path.resolve(PUBLIC_DIR, relativePath);

  if (!filePath.startsWith(PUBLIC_DIR + path.sep) && filePath !== PUBLIC_DIR) {
    return null;
  }

  return filePath;
}

function createPracticeStaticApp({ apiApp, publicDir = PUBLIC_DIR }) {
  if (typeof apiApp !== "function") {
    throw new Error("apiApp is required");
  }

  return async function practiceStaticApp(request, response) {
    let url;
    try {
      url = new URL(request.url, "http://practice-harness.local");
    } catch (error) {
      sendStaticError(response, 400, "Bad request path");
      return;
    }

    if (isApiRequest(url.pathname)) {
      await apiApp(request, response);
      return;
    }

    if (request.method !== "GET" && request.method !== "HEAD") {
      sendStaticError(response, 405, "Method not allowed");
      return;
    }

    let filePath;
    try {
      const decodedPath = decodeURIComponent(url.pathname);
      const relativePath = decodedPath === "/" ? "index.html" : decodedPath.slice(1);
      filePath = path.resolve(publicDir, relativePath);
    } catch (error) {
      sendStaticError(response, 400, "Bad request path");
      return;
    }

    const resolvedPublicDir = path.resolve(publicDir);
    if (
      !filePath.startsWith(resolvedPublicDir + path.sep) &&
      filePath !== resolvedPublicDir
    ) {
      sendStaticError(response, 404, "Not found");
      return;
    }

    try {
      const body = await fs.readFile(filePath);
      response.writeHead(200, {
        "content-type":
          CONTENT_TYPES[path.extname(filePath).toLowerCase()] ||
          "application/octet-stream",
        "cache-control": "no-store",
      });
      if (request.method === "HEAD") response.end();
      else response.end(body);
    } catch (error) {
      if (error.code === "ENOENT" || error.code === "EISDIR") {
        if (isPracticeClientRoute(url.pathname)) {
          const body = await fs.readFile(path.join(publicDir, "index.html"));
          response.writeHead(200, {
            "content-type": CONTENT_TYPES[".html"],
            "cache-control": "no-store",
          });
          if (request.method === "HEAD") response.end();
          else response.end(body);
          return;
        }
        sendStaticError(response, 404, "Not found");
        return;
      }
      sendStaticError(response, 500, "Static file server error");
    }
  };
}

module.exports = {
  createPracticeStaticApp,
  isPracticeClientRoute,
  resolvePublicPath,
};
