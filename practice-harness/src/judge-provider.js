const DEFAULT_TIMEOUT_MS = 10_000;

function providerName(provider) {
  if (typeof provider === "string") return provider;
  if (provider && typeof provider.name === "string") return provider.name;
  return "unknown";
}

function isNoneProvider(provider) {
  return provider === "none" || providerName(provider) === "none";
}

function cloneDeterministicResult(deterministicResult) {
  if (typeof structuredClone === "function") {
    return structuredClone(deterministicResult);
  }

  return JSON.parse(JSON.stringify(deterministicResult));
}

function providerWarning(provider, message) {
  return {
    provider: providerName(provider),
    message,
  };
}

function isPromiseLike(value) {
  return value !== null && typeof value === "object" && typeof value.then === "function";
}

function observeDiscardedProviderResult(providerResult) {
  if (isPromiseLike(providerResult)) {
    providerResult.catch(() => {});
  }
}

async function raceProviderWithTimeout(providerResult, timeoutMs) {
  let timeoutId;
  const timeout = new Promise((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new Error(`Judge provider timed out after ${timeoutMs}ms`));
    }, timeoutMs);
  });

  try {
    return await Promise.race([Promise.resolve(providerResult), timeout]);
  } finally {
    clearTimeout(timeoutId);
  }
}

async function evaluateWithJudgeProvider({
  provider,
  practice,
  attempt,
  deterministicResult,
  timeoutMs = DEFAULT_TIMEOUT_MS,
}) {
  if (!provider || isNoneProvider(provider)) {
    return {
      judgeResult: null,
      providerWarnings: [],
    };
  }

  if (typeof provider.evaluate !== "function") {
    return {
      judgeResult: null,
      providerWarnings: [
        providerWarning(provider, "Judge provider is missing an evaluate function"),
      ],
    };
  }

  try {
    const evaluateStartedAt = Date.now();
    const providerResult = provider.evaluate({
      practice,
      attempt,
      deterministicResult: cloneDeterministicResult(deterministicResult),
    });
    const evaluateElapsedMs = Date.now() - evaluateStartedAt;

    if (evaluateElapsedMs > timeoutMs) {
      observeDiscardedProviderResult(providerResult);

      return {
        judgeResult: null,
        providerWarnings: [
          providerWarning(
            provider,
            `Judge provider contract violation: evaluate blocked for ${evaluateElapsedMs}ms before returning, exceeding timeout ${timeoutMs}ms`,
          ),
        ],
      };
    }

    // In-process timeout cannot kill blocking code, so blocking-before-return is detected and rejected; killable isolation belongs in future provider adapters.
    if (!isPromiseLike(providerResult)) {
      return {
        judgeResult: null,
        providerWarnings: [
          providerWarning(
            provider,
            "Judge provider contract violation: evaluate must return a Promise immediately",
          ),
        ],
      };
    }

    const judgeResult = await raceProviderWithTimeout(providerResult, timeoutMs);

    return {
      judgeResult,
      providerWarnings: [],
    };
  } catch (error) {
    return {
      judgeResult: null,
      providerWarnings: [
        providerWarning(provider, error && error.message ? error.message : String(error)),
      ],
    };
  }
}

module.exports = {
  evaluateWithJudgeProvider,
};
