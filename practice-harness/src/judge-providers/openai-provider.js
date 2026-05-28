const { rubricForPractice } = require("./act3-claude-memory-rubric");

const DEFAULT_MODEL = "gpt-5.4-nano";
const RESPONSES_URL = "https://api.openai.com/v1/responses";

function extractOutputText(responseBody) {
  if (typeof responseBody.output_text === "string") return responseBody.output_text;

  for (const outputItem of responseBody.output || []) {
    for (const contentItem of outputItem.content || []) {
      if (typeof contentItem.text === "string") return contentItem.text;
    }
  }

  throw new Error("OpenAI response did not contain output_text");
}

function normalizeJudgeResult({ parsed, model }) {
  return {
    rubricId: parsed.rubricId,
    provider: "openai",
    model,
    verdict: parsed.verdict,
    confidence: parsed.confidence,
    summary: parsed.summary,
    strengths: parsed.strengths,
    risks: parsed.risks,
    suggestions: parsed.suggestions,
    shouldReviewManually: parsed.shouldReviewManually,
  };
}

function createOpenAiJudgeProvider({
  apiKey,
  model = DEFAULT_MODEL,
  fetchImpl = globalThis.fetch,
  url = RESPONSES_URL,
} = {}) {
  if (!apiKey) {
    throw new Error("OpenAI judge provider requires an API key");
  }
  if (typeof fetchImpl !== "function") {
    throw new Error("OpenAI judge provider requires fetch");
  }

  return {
    name: "openai",
    model,
    async evaluate({ practice, attempt, deterministicResult }) {
      const rubric = rubricForPractice(practice);
      if (!rubric) {
        throw new Error(`No OpenAI judge rubric for practice: ${practice && practice.id}`);
      }

      const response = await fetchImpl(url, {
        method: "POST",
        headers: {
          authorization: `Bearer ${apiKey}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          model,
          input: rubric.inputBuilder({ practice, attempt, deterministicResult }),
          text: {
            format: {
              type: "json_schema",
              name: "practice_judge_result",
              strict: true,
              schema: rubric.schema,
            },
          },
        }),
      });

      if (!response.ok) {
        let message = `OpenAI API returned HTTP ${response.status}`;
        try {
          const errorBody = await response.json();
          if (errorBody && errorBody.error && errorBody.error.message) {
            message = `${message}: ${errorBody.error.message}`;
          }
        } catch (_error) {
          // Keep the status-only message when the error body is not JSON.
        }
        throw new Error(message);
      }

      const responseBody = await response.json();
      const outputText = extractOutputText(responseBody);
      const parsed = JSON.parse(outputText);
      return normalizeJudgeResult({ parsed, model });
    },
  };
}

module.exports = {
  createOpenAiJudgeProvider,
  DEFAULT_MODEL,
};
