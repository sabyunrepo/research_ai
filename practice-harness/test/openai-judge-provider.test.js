const assert = require("node:assert/strict");
const test = require("node:test");

const { createOpenAiJudgeProvider } = require("../src/judge-providers/openai-provider");
const { createJudgeProviderFromEnv } = require("../src/judge-providers/provider-registry");

const practice = {
  id: "act3-context-workbench",
  type: "claude-memory",
  title: "실습 3: CLAUDE.md 회사 내규를 정합니다",
};

const act4Practice = {
  id: "act4-mini-brainstorming-skill",
  type: "skill-document",
  title: "실습 4: 미니 브레인스토밍 Skill을 만듭니다",
};

const attempt = {
  input: {
    scope: "project",
    removedRuleIds: [
      "remove-skip-tests",
      "remove-old-purple",
      "remove-api-key",
      "remove-direct-output-edit",
    ],
    document: "# CLAUDE.md\n\n## 프로젝트 목표\n- 안전하게 작업한다.",
  },
};

const deterministicResult = {
  score: 92,
  maxScore: 100,
  checks: [{ id: "line-limit-check", status: "pass", explanation: "200줄 이하입니다." }],
  feedback: [],
};

test("OpenAI judge provider builds a Responses API structured-output request", async () => {
  const requests = [];
  const provider = createOpenAiJudgeProvider({
    apiKey: "test-key",
    model: "gpt-5.1",
    fetchImpl: async (url, options) => {
      requests.push({ url, options });
      return {
        ok: true,
        status: 200,
        json: async () => ({
          output_text: JSON.stringify({
            rubricId: "act3-claude-memory-v1",
            verdict: "pass",
            confidence: 0.88,
            summary: "CLAUDE.md로 쓸 수 있게 잘 압축했습니다.",
            strengths: ["핵심 섹션이 선명합니다."],
            risks: [],
            suggestions: ["프로젝트 참조 표를 실제 파일과 맞추세요."],
            shouldReviewManually: false,
          }),
        }),
      };
    },
  });

  const result = await provider.evaluate({ practice, attempt, deterministicResult });

  assert.equal(provider.name, "openai");
  assert.equal(requests.length, 1);
  assert.equal(requests[0].url, "https://api.openai.com/v1/responses");
  assert.equal(requests[0].options.method, "POST");
  assert.equal(requests[0].options.headers.authorization, "Bearer test-key");
  const body = JSON.parse(requests[0].options.body);
  assert.equal(body.model, "gpt-5.1");
  assert.equal(body.temperature, 0);
  assert.equal(body.text.format.type, "json_schema");
  assert.equal(body.text.format.strict, true);
  assert.equal(body.text.format.name, "practice_judge_result");
  assert.match(JSON.stringify(body.input), /CLAUDE\.md/);
  assert.deepEqual(result, {
    rubricId: "act3-claude-memory-v1",
    provider: "openai",
    model: "gpt-5.1",
    verdict: "pass",
    confidence: 0.88,
    summary: "CLAUDE.md로 쓸 수 있게 잘 압축했습니다.",
    strengths: ["핵심 섹션이 선명합니다."],
    risks: [],
    suggestions: ["프로젝트 참조 표를 실제 파일과 맞추세요."],
    shouldReviewManually: false,
  });
});

test("OpenAI judge provider defaults to the cost-effective nano model", async () => {
  const requests = [];
  const provider = createOpenAiJudgeProvider({
    apiKey: "test-key",
    fetchImpl: async (url, options) => {
      requests.push({ url, options });
      return {
        ok: true,
        status: 200,
        json: async () => ({
          output_text: JSON.stringify({
            rubricId: "act3-claude-memory-v1",
            verdict: "pass",
            confidence: 0.9,
            summary: "기본 모델로 보조 검토했습니다.",
            strengths: [],
            risks: [],
            suggestions: [],
            shouldReviewManually: false,
          }),
        }),
      };
    },
  });

  await provider.evaluate({ practice, attempt, deterministicResult });

  assert.equal(provider.model, "gpt-5.4-nano");
  assert.equal(JSON.parse(requests[0].options.body).model, "gpt-5.4-nano");
});

test("OpenAI judge provider supports act4 skill-document rubric", async () => {
  const requests = [];
  const provider = createOpenAiJudgeProvider({
    apiKey: "test-key",
    fetchImpl: async (url, options) => {
      requests.push({ url, options });
      return {
        ok: true,
        status: 200,
        json: async () => ({
          output_text: JSON.stringify({
            rubricId: "act4-mini-brainstorming-skill-v1",
            verdict: "warn",
            confidence: 0.82,
            summary: "Skill 문서 구조는 있으나 승인 게이트가 더 선명해야 합니다.",
            strengths: ["트리거와 절차가 분리되어 있습니다."],
            risks: ["질문 후 대기 규칙이 약합니다."],
            suggestions: ["구현 전 사용자 승인 문장을 별도 단계로 두세요."],
            shouldReviewManually: false,
          }),
        }),
      };
    },
  });

  const result = await provider.evaluate({
    practice: act4Practice,
    attempt: {
      input: {
        document: "# Mini Brainstorming\n\n## Steps\n1. Ask one question.",
      },
    },
    deterministicResult,
  });

  assert.equal(requests.length, 1);
  assert.match(JSON.stringify(JSON.parse(requests[0].options.body).input), /mini-brainstorming/i);
  assert.equal(result.rubricId, "act4-mini-brainstorming-skill-v1");
  assert.equal(result.verdict, "warn");
});

test("OpenAI judge provider supports free-form practice rubrics", async () => {
  const requests = [];
  const provider = createOpenAiJudgeProvider({
    apiKey: "test-key",
    fetchImpl: async (url, options) => {
      requests.push({ url, options });
      const body = JSON.parse(options.body);
      const text = JSON.stringify(body.input);
      const rubricId = [
        "act2-prompt-brief-v1",
        "act3-claude-memory-v1",
        "act4-mini-brainstorming-skill-v1",
        "act5-agent-team-runbook-v1",
      ].find((id) => text.includes(id));
      return {
        ok: true,
        status: 200,
        json: async () => ({
          output_text: JSON.stringify({
            rubricId,
            verdict: "pass",
            confidence: 0.82,
            summary: `${rubricId} reviewed`,
            strengths: [],
            risks: [],
            suggestions: [],
            shouldReviewManually: false,
          }),
        }),
      };
    },
  });

  const practices = [
    { id: "act2-prompt-brief", input: { prompt: "보고서 초안을 만들어줘." }, rubricId: "act2-prompt-brief-v1" },
    { id: "act3-context-workbench", input: attempt.input, rubricId: "act3-claude-memory-v1" },
    { id: "act4-mini-brainstorming-skill", input: { document: "# Skill\n\n## Steps\n1. Ask one question." }, rubricId: "act4-mini-brainstorming-skill-v1" },
    { id: "act5-agent-team-runbook", input: { record: "Coordinator, Researcher, Implementer, Reviewer ran locally." }, rubricId: "act5-agent-team-runbook-v1" },
  ];

  for (const item of practices) {
    const result = await provider.evaluate({
      practice: { id: item.id, title: item.id },
      attempt: { input: item.input },
      deterministicResult,
    });
    assert.equal(result.rubricId, item.rubricId);
  }

  assert.equal(requests.length, 4);
});

test("OpenAI judge provider skips practices without AI rubric", async () => {
  const requests = [];
  const provider = createOpenAiJudgeProvider({
    apiKey: "test-key",
    fetchImpl: async () => {
      requests.push("unexpected");
    },
  });

  const act1Result = await provider.evaluate({
    practice: { id: "act1-info-selection", type: "multi-question-choice" },
    attempt,
    deterministicResult,
  });
  const act6Result = await provider.evaluate({
    practice: { id: "act6-stop-hook-gate", type: "checklist-unlock" },
    attempt,
    deterministicResult,
  });

  assert.equal(act1Result, null);
  assert.equal(act6Result, null);
  assert.deepEqual(requests, []);
});

test("provider registry uses OPEN_AI_API and defaults to none when disabled", () => {
  assert.equal(createJudgeProviderFromEnv({}).name, "none");
  assert.equal(
    createJudgeProviderFromEnv({
      PRACTICE_JUDGE_PROVIDER: "none",
      OPEN_AI_API: "test-key",
    }).name,
    "none",
  );

  const provider = createJudgeProviderFromEnv({
    PRACTICE_JUDGE_PROVIDER: "openai",
    OPEN_AI_API: "test-key",
    OPENAI_MODEL: "gpt-5.2",
  });

  assert.equal(provider.name, "openai");
  assert.equal(provider.model, "gpt-5.2");
});
