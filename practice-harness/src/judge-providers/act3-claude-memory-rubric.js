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
      enum: [
        "act2-prompt-brief-v1",
        "act3-claude-memory-v1",
        "act4-mini-brainstorming-skill-v1",
        "act5-agent-team-runbook-v1",
      ],
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

function deterministicSummary(deterministicResult) {
  return JSON.stringify(
    {
      score: deterministicResult.score,
      maxScore: deterministicResult.maxScore,
      checks: deterministicResult.checks,
      feedback: deterministicResult.feedback,
      verificationLog: deterministicResult.verificationLog,
    },
    null,
    2,
  );
}

function learnerInput(value) {
  return JSON.stringify(value, null, 2);
}

function buildSupplementalJudgeInput({
  practice,
  attempt,
  deterministicResult,
  rubricTitle,
  criteria,
}) {
  return [
    {
      role: "system",
      content: [
        {
          type: "input_text",
          text: [
            "You are a strict Korean teaching assistant for a beginner AI-agent workshop.",
            "Evaluate the learner submission as supplemental feedback only.",
            "Do not change the deterministic score or unlock decision.",
            "Return only structured JSON that matches the schema.",
            "Use the rubricId exactly as requested.",
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
            `Rubric: ${rubricTitle}`,
            `Return rubricId: ${rubricTitle}`,
            "",
            "Deterministic result:",
            deterministicSummary(deterministicResult),
            "",
            "Judge the learner submission against these criteria:",
            criteria.map((item) => `- ${item}`).join("\n"),
            "",
            "Learner input:",
            learnerInput(attempt.input),
          ].join("\n"),
        },
      ],
    },
  ];
}

function buildAct2PromptBriefInput(args) {
  return buildSupplementalJudgeInput({
    ...args,
    rubricTitle: "act2-prompt-brief-v1",
    criteria: [
      "The prompt states what to make and where it will be used.",
      "It names the source material or context the AI should use.",
      "It defines output format, constraints, and completion criteria.",
      "It avoids keyword soup and reads like a usable work instruction.",
      "The feedback should identify the most important missing ingredient first.",
    ],
  });
}

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
            "Return rubricId: act3-claude-memory-v1",
            "",
            "Deterministic result:",
            deterministicSummary(deterministicResult),
            "",
            "Judge the submitted CLAUDE.md against these criteria:",
            "- It chooses the project scope for workshop/project rules instead of global or user scope.",
            "- It removes overbroad, conflicting, stale, or secret-bearing always-on rules.",
            "- It separates long examples/checklists/procedures into reference docs, Skills, settings, or hooks.",
            "- It preserves user-change safety and verification-before-completion rules.",
            "- It does not include secrets, API keys, stale decisions, or risky rules like skipping tests.",
            "- It is understandable for beginners.",
            "",
            "Learner choices:",
            JSON.stringify(
              {
                scope: attempt.input.scope,
                removedRuleIds: attempt.input.removedRuleIds,
              },
              null,
              2,
            ),
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
            "Return rubricId: act4-mini-brainstorming-skill-v1",
            "",
            "Deterministic result:",
            deterministicSummary(deterministicResult),
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

function buildAct5AgentTeamRunbookInput(args) {
  return buildSupplementalJudgeInput({
    ...args,
    rubricTitle: "act5-agent-team-runbook-v1",
    criteria: [
      "The runbook separates Coordinator, Researcher, Implementer, and Reviewer responsibilities.",
      "It includes local execution evidence instead of only describing intentions.",
      "It assigns Skill usage and tool permissions to the appropriate roles.",
      "It records at least one retry or adjustment based on a prior attempt.",
      "The final report includes remaining risk or human review needs.",
    ],
  });
}

function rubricForPractice(practice) {
  if (practice && practice.id === "act2-prompt-brief") {
    return {
      id: "act2-prompt-brief-v1",
      schema: JUDGE_RESULT_SCHEMA,
      inputBuilder: buildAct2PromptBriefInput,
    };
  }

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

  if (practice && practice.id === "act5-agent-team-runbook") {
    return {
      id: "act5-agent-team-runbook-v1",
      schema: JUDGE_RESULT_SCHEMA,
      inputBuilder: buildAct5AgentTeamRunbookInput,
    };
  }

  return null;
}

module.exports = {
  rubricForPractice,
};
