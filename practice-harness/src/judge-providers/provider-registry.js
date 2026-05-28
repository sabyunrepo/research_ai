const { createOpenAiJudgeProvider, DEFAULT_MODEL } = require("./openai-provider");

function noneProvider() {
  return { name: "none" };
}

function createJudgeProviderFromEnv(env = process.env) {
  const providerName = (env.PRACTICE_JUDGE_PROVIDER || "none").toLocaleLowerCase();
  if (providerName === "none" || providerName === "off" || providerName === "false") {
    return noneProvider();
  }

  if (providerName === "openai") {
    const apiKey = env.OPEN_AI_API || env.OPENAI_API_KEY;
    if (!apiKey) return noneProvider();
    return createOpenAiJudgeProvider({
      apiKey,
      model: env.OPENAI_MODEL || DEFAULT_MODEL,
    });
  }

  return noneProvider();
}

module.exports = {
  createJudgeProviderFromEnv,
  noneProvider,
};
