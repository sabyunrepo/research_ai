const { PracticeHarnessError } = require("./errors");

const DEFAULT_MAX_BYTES = 64 * 1024;

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, {
    "content-type": "application/json; charset=utf-8",
  });
  response.end(JSON.stringify(payload));
}

function readRequestBody(request, maxBytes) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let bytesRead = 0;
    let oversized = false;

    request.on("data", (chunk) => {
      if (oversized) return;

      bytesRead += chunk.length;
      if (bytesRead > maxBytes) {
        oversized = true;
        chunks.length = 0;
        reject(
          new PracticeHarnessError(
            "invalid_input",
            `Request body must be ${maxBytes} bytes or smaller`,
          ),
        );
        return;
      }

      chunks.push(chunk);
    });

    request.on("end", () => {
      if (oversized) return;
      resolve(Buffer.concat(chunks).toString("utf8"));
    });

    request.on("error", reject);
  });
}

async function readJsonBody(request, { maxBytes = DEFAULT_MAX_BYTES } = {}) {
  const body = await readRequestBody(request, maxBytes);

  if (body.trim() === "") {
    throw new PracticeHarnessError("invalid_input", "Request body must be valid JSON");
  }

  try {
    return JSON.parse(body);
  } catch {
    throw new PracticeHarnessError("invalid_input", "Request body must be valid JSON");
  }
}

function sendError(response, statusCode, code, message) {
  sendJson(response, statusCode, {
    ok: false,
    error: { code, message },
  });
}

module.exports = {
  sendJson,
  readJsonBody,
  sendError,
};
