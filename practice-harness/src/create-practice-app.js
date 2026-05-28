const { PracticeHarnessError } = require("./errors");
const { evaluateWithJudgeProvider } = require("./judge-provider");
const { readJsonBody, sendError, sendJson } = require("./json-http");
const { scorePracticeAttempt } = require("./scoring-engine");

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function providerName(provider) {
  if (typeof provider === "string") return provider;
  if (provider && typeof provider.name === "string") return provider.name;
  return "unknown";
}

function providerWarning(provider, message) {
  return {
    provider: providerName(provider),
    message,
  };
}

function isJsonSafe(value, seen = new WeakSet()) {
  if (value === null) return true;

  const valueType = typeof value;
  if (valueType === "string" || valueType === "boolean") return true;
  if (valueType === "number") return Number.isFinite(value);
  if (
    valueType === "undefined" ||
    valueType === "bigint" ||
    valueType === "function" ||
    valueType === "symbol"
  ) {
    return false;
  }

  if (seen.has(value)) return false;
  seen.add(value);

  if (Array.isArray(value)) {
    return value.every((item) => isJsonSafe(item, seen));
  }

  if (!isPlainObject(value)) return false;

  return Object.values(value).every((item) => isJsonSafe(item, seen));
}

function sanitizeJudgeResult({ judgeProvider, judgeResult, providerWarnings }) {
  if (judgeResult === null) {
    return { judgeResult: null, providerWarnings };
  }

  if (!isJsonSafe(judgeResult)) {
    return {
      judgeResult: null,
      providerWarnings: providerWarnings.concat(
        providerWarning(
          judgeProvider,
          "Judge provider returned a result that is not JSON-safe",
        ),
      ),
    };
  }

  return {
    judgeResult: JSON.parse(JSON.stringify(judgeResult)),
    providerWarnings,
  };
}

function statusForError(error) {
  if (error && error.code === "invalid_input") return 400;
  if (
    error &&
    (error.code === "practice_not_found" || error.code === "attempt_not_found")
  ) {
    return 404;
  }

  return 500;
}

function publicError(error) {
  if (error instanceof PracticeHarnessError) {
    return {
      statusCode: statusForError(error),
      code: error.code,
      message: error.message,
    };
  }

  return {
    statusCode: 500,
    code: "internal_error",
    message: "Unexpected practice harness error",
  };
}

function validateAttemptBody(body) {
  if (!isPlainObject(body)) {
    throw new PracticeHarnessError("invalid_input", "Request body must be an object");
  }

  if (
    typeof body.learnerSessionId !== "string" ||
    body.learnerSessionId.trim() === ""
  ) {
    throw new PracticeHarnessError(
      "invalid_input",
      "learnerSessionId must be a non-empty string",
    );
  }

  if (!Object.prototype.hasOwnProperty.call(body, "input")) {
    throw new PracticeHarnessError("invalid_input", "input is required");
  }

  if (
    Object.prototype.hasOwnProperty.call(body, "clientAttemptId") &&
    (typeof body.clientAttemptId !== "string" || body.clientAttemptId.trim() === "")
  ) {
    throw new PracticeHarnessError(
      "invalid_input",
      "clientAttemptId must be a non-empty string when provided",
    );
  }
}

function attemptResponseFromStoredAttempt(storedAttempt) {
  return {
    attemptId: storedAttempt.attemptId,
    practiceId: storedAttempt.practiceId,
    learnerSessionId: storedAttempt.learnerSessionId,
    attemptNumber: storedAttempt.attemptNumber,
    score: storedAttempt.score,
    maxScore: storedAttempt.maxScore,
    unlocked: storedAttempt.unlocked,
    checks: storedAttempt.checks,
    feedback: storedAttempt.feedback,
    verificationLog: storedAttempt.verificationLog,
    unlockArtifact: storedAttempt.unlockArtifact,
    judgeResult: storedAttempt.judgeResult,
    providerWarnings: storedAttempt.providerWarnings,
    createdAt: storedAttempt.createdAt,
  };
}

async function createAttempt({
  definitionStore,
  attemptStore,
  judgeProvider,
  practiceId,
  body,
}) {
  validateAttemptBody(body);

  const practice = definitionStore.getPractice(practiceId);
  const deterministicResult = scorePracticeAttempt({
    practice,
    input: body.input,
  });
  const createdAt = new Date().toISOString();
  const unlocked =
    deterministicResult.unlocked !== undefined
      ? deterministicResult.unlocked
      : deterministicResult.score >= practice.unlockThreshold;

  const draftAttempt = {
    practiceId,
    learnerSessionId: body.learnerSessionId,
    input: body.input,
    score: deterministicResult.score,
    maxScore: deterministicResult.maxScore,
    unlocked,
    checks: deterministicResult.checks,
    feedback: deterministicResult.feedback,
    verificationLog: deterministicResult.verificationLog,
    unlockArtifact: deterministicResult.unlockArtifact,
    createdAt,
  };

  const providerResult = await evaluateWithJudgeProvider({
    provider: judgeProvider || "none",
    practice,
    attempt: draftAttempt,
    deterministicResult,
  });
  const sanitizedProviderResult = sanitizeJudgeResult({
    judgeProvider: judgeProvider || "none",
    judgeResult: providerResult.judgeResult,
    providerWarnings: providerResult.providerWarnings,
  });

  return attemptStore.createAttempt({
    ...draftAttempt,
    judgeResult: sanitizedProviderResult.judgeResult,
    providerWarnings: sanitizedProviderResult.providerWarnings,
  });
}

function idempotencyKeyForAttempt({ practiceId, body }) {
  if (
    !Object.prototype.hasOwnProperty.call(body, "clientAttemptId") ||
    typeof body.clientAttemptId !== "string" ||
    body.clientAttemptId.trim() === ""
  ) {
    return null;
  }

  return JSON.stringify([
    practiceId,
    body.learnerSessionId.trim(),
    body.clientAttemptId.trim(),
  ]);
}

function createPracticeApp({ definitionStore, attemptStore, judgeProvider = "none" }) {
  if (!definitionStore || !attemptStore) {
    throw new Error("definitionStore and attemptStore are required");
  }

  const inFlightAttemptsByClientId = new Map();
  const completedAttemptIdByClientId = new Map();

  async function createAttemptWithIdempotency({ practiceId, body }) {
    validateAttemptBody(body);
    const idempotencyKey = idempotencyKeyForAttempt({ practiceId, body });
    if (!idempotencyKey) {
      return createAttempt({
        definitionStore,
        attemptStore,
        judgeProvider,
        practiceId,
        body,
      });
    }

    const completedAttemptId = completedAttemptIdByClientId.get(idempotencyKey);
    if (completedAttemptId) {
      try {
        return attemptStore.getAttempt({ practiceId, attemptId: completedAttemptId });
      } catch (error) {
        completedAttemptIdByClientId.delete(idempotencyKey);
      }
    }

    const inFlightAttempt = inFlightAttemptsByClientId.get(idempotencyKey);
    if (inFlightAttempt) return inFlightAttempt;

    const attemptPromise = createAttempt({
      definitionStore,
      attemptStore,
      judgeProvider,
      practiceId,
      body,
    })
      .then((storedAttempt) => {
        completedAttemptIdByClientId.set(idempotencyKey, storedAttempt.attemptId);
        return storedAttempt;
      })
      .finally(() => {
        inFlightAttemptsByClientId.delete(idempotencyKey);
      });

    inFlightAttemptsByClientId.set(idempotencyKey, attemptPromise);
    return attemptPromise;
  }

  return async function practiceApp(request, response) {
    const url = new URL(request.url, "http://practice-harness.local");
    const pathParts = url.pathname.split("/").filter(Boolean);

    try {
      if (
        request.method === "GET" &&
        pathParts.length === 2 &&
        pathParts[0] === "api" &&
        pathParts[1] === "practices"
      ) {
        sendJson(response, 200, {
          ok: true,
          practices: definitionStore.listPractices(),
        });
        return;
      }

      if (
        request.method === "GET" &&
        pathParts.length === 3 &&
        pathParts[0] === "api" &&
        pathParts[1] === "practices"
      ) {
        sendJson(response, 200, {
          ok: true,
          practice: definitionStore.getPractice(pathParts[2]),
        });
        return;
      }

      if (
        pathParts.length === 4 &&
        pathParts[0] === "api" &&
        pathParts[1] === "practices" &&
        pathParts[3] === "attempts" &&
        request.method === "POST"
      ) {
        const body = await readJsonBody(request);
        const storedAttempt = await createAttemptWithIdempotency({
          practiceId: pathParts[2],
          body,
        });

        sendJson(response, 201, {
          ok: true,
          attempt: attemptResponseFromStoredAttempt(storedAttempt),
        });
        return;
      }

      if (
        pathParts.length === 5 &&
        pathParts[0] === "api" &&
        pathParts[1] === "practices" &&
        pathParts[3] === "attempts" &&
        request.method === "GET"
      ) {
        const storedAttempt = attemptStore.getAttempt({
          practiceId: pathParts[2],
          attemptId: pathParts[4],
        });

        sendJson(response, 200, {
          ok: true,
          attempt: attemptResponseFromStoredAttempt(storedAttempt),
        });
        return;
      }

      sendError(response, 404, "not_found", "Practice harness route not found");
    } catch (error) {
      const publicResponse = publicError(error);
      sendError(
        response,
        publicResponse.statusCode,
        publicResponse.code,
        publicResponse.message,
      );
    }
  };
}

module.exports = {
  createPracticeApp,
};
