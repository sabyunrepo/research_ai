const JUDGE_RESULT_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: [
    "rubricId",
    "verdict",
    "confidence",
    "summary",
    "strengths",
    "risks",
    "suggestions",
    "shouldReviewManually",
  ],
  properties: {
    rubricId: {
      type: "string",
      enum: ["act3-claude-memory-v1", "act4-mini-brainstorming-skill-v1"],
    },
    verdict: { type: "string", enum: ["pass", "warn", "fail"] },
    confidence: { type: "number", minimum: 0, maximum: 1 },
    summary: { type: "string" },
    strengths: { type: "array", items: { type: "string" } },
    risks: { type: "array", items: { type: "string" } },
    suggestions: { type: "array", items: { type: "string" } },
    shouldReviewManually: { type: "boolean" },
  },
};

function buildAct3ClaudeMemoryInput({ practice, attempt, deterministicResult }) {
  return [
    {
      role: "system",
      content: [
        {
          type: "input_text",
          text: [
            "You are a strict Korean teaching assistant for a beginner Claude Code workshop.",
            "Evaluate the learner's proposed CLAUDE.md as supplemental feedback only.",
            "Do not change the deterministic score or unlock decision.",
            "Return only structured JSON that matches the schema.",
            "Be concise, concrete, and safe for a learner-facing result screen.",
          ].join("\n"),
        },
      ],
    },
    {
      role: "user",
      content: [
        {
          type: "input_text",
          text: [
            `Practice: ${practice.title || practice.id}`,
            "",
            "Deterministic result:",
            JSON.stringify(
              {
                score: deterministicResult.score,
                maxScore: deterministicResult.maxScore,
                checks: deterministicResult.checks,
                feedback: deterministicResult.feedback,
              },
              null,
              2,
            ),
            "",
            "Judge the submitted CLAUDE.md against these criteria:",
            "- It is short, stable, and suitable as always-loaded project memory.",
            "- It does not copy the installer source verbatim.",
            "- It separates long examples/checklists/procedures into reference docs, Skills, settings, or hooks.",
            "- It preserves user-change safety and verification-before-completion rules.",
            "- It does not include secrets, API keys, stale decisions, or risky rules like skipping tests.",
            "- It is understandable for beginners.",
            "",
            "Learner submitted CLAUDE.md:",
            attempt.input.document,
          ].join("\n"),
        },
      ],
    },
  ];
}

function buildAct4MiniBrainstormingSkillInput({ practice, attempt, deterministicResult }) {
  return [
    {
      role: "system",
      content: [
        {
          type: "input_text",
          text: [
            "You are a strict Korean teaching assistant for a beginner AI-agent workshop.",
            "Evaluate the learner's mini-brainstorming Skill as supplemental feedback only.",
            "Do not change the deterministic score or unlock decision.",
            "Return only structured JSON that matches the schema.",
            "Be concise, concrete, and learner-facing.",
          ].join("\n"),
        },
      ],
    },
    {
      role: "user",
      content: [
        {
          type: "input_text",
          text: [
            `Practice: ${practice.title || practice.id}`,
            "",
            "Deterministic result:",
            JSON.stringify(
              {
                score: deterministicResult.score,
                maxScore: deterministicResult.maxScore,
                checks: deterministicResult.checks,
                feedback: deterministicResult.feedback,
              },
              null,
              2,
            ),
            "",
            "Judge the submitted Skill against these criteria:",
            "- It has clear YAML frontmatter with name and trigger-oriented description.",
            "- It tells the agent to ask one question at a time and wait for the user.",
            "- It defines scope boundaries and non-goals before implementation.",
            "- It compares 2-3 approaches with tradeoffs.",
            "- It requires user approval before moving to implementation or a written plan.",
            "- It produces a compact spec or decision summary as output.",
            "- It is understandable for non-developer learners.",
            "",
            "Learner submitted Skill:",
            attempt.input.document,
          ].join("\n"),
        },
      ],
    },
  ];
}

function rubricForPractice(practice) {
  if (practice && practice.id === "act3-context-workbench") {
    return {
      id: "act3-claude-memory-v1",
      schema: JUDGE_RESULT_SCHEMA,
      inputBuilder: buildAct3ClaudeMemoryInput,
    };
  }

  if (practice && practice.id === "act4-mini-brainstorming-skill") {
    return {
      id: "act4-mini-brainstorming-skill-v1",
      schema: JUDGE_RESULT_SCHEMA,
      inputBuilder: buildAct4MiniBrainstormingSkillInput,
    };
  }

  return null;
}

module.exports = {
  rubricForPractice,
};
