const assert = require("node:assert/strict");
const fs = require("node:fs/promises");
const http = require("node:http");
const path = require("node:path");
const test = require("node:test");

const { createPracticeStaticApp } = require("../src/create-practice-static-app");
const { createPracticeApp } = require("../src/create-practice-app");
const { createPracticeDefinitionStore } = require("../src/practice-definition-store");
const { createMemoryAttemptStore } = require("../src/stores/memory-attempt-store");

const PROJECT_ROOT = path.join(__dirname, "..", "..");

async function createTestServer() {
  const apiApp = createPracticeApp({
    definitionStore: createPracticeDefinitionStore(),
    attemptStore: createMemoryAttemptStore(),
    judgeProvider: "none",
  });
  const server = http.createServer(createPracticeStaticApp({ apiApp }));

  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const { port } = server.address();

  return {
    baseUrl: `http://127.0.0.1:${port}`,
    async close() {
      await new Promise((resolve, reject) => {
        server.close((error) => (error ? reject(error) : resolve()));
      });
    },
  };
}

test("GET / serves the practice learner UI shell", async () => {
  const server = await createTestServer();
  try {
    const response = await fetch(`${server.baseUrl}/`);
    const body = await response.text();

    assert.equal(response.status, 200);
    assert.match(response.headers.get("content-type"), /text\/html/);
    assert.match(body, /presentation-shell/);
    assert.match(body, /practice-app\.js/);
  } finally {
    await server.close();
  }
});

test("GET /act/:act serves the same practice shell for direct practice URLs", async () => {
  const server = await createTestServer();
  try {
    const response = await fetch(`${server.baseUrl}/act/2`);
    const body = await response.text();

    assert.equal(response.status, 200);
    assert.match(response.headers.get("content-type"), /text\/html/);
    assert.match(body, /presentation-shell/);
    assert.match(body, /practice-app\.js/);
  } finally {
    await server.close();
  }
});

test("GET / serves a presentation-optimized practice shell", async () => {
  const server = await createTestServer();
  try {
    const response = await fetch(`${server.baseUrl}/`);
    const body = await response.text();

    assert.equal(response.status, 200);
    assert.match(body, /presentation-shell/);
    assert.match(body, /practice-slide-frame/);
    assert.match(body, /stage-nav/);
    assert.match(body, /slide-workbench/);
    assert.match(body, /result-slide/);
    assert.match(body, /발표 실습 화면/);
  } finally {
    await server.close();
  }
});

test("presentation UI uses a fixed 16:9 slide frame like generated decks", async () => {
  const [html, stylesheet] = await Promise.all([
    fs.readFile(
      path.join(PROJECT_ROOT, "practice-harness", "public", "index.html"),
      "utf8",
    ),
    fs.readFile(
      path.join(PROJECT_ROOT, "practice-harness", "public", "styles.css"),
      "utf8",
    ),
  ]);

  assert.match(html, /<div class="practice-slide-frame">\s*<main/);
  assert.doesNotMatch(html, /class="topbar stage-header"/);
  assert.match(stylesheet, /\.practice-slide-frame\s*{/);
  assert.match(stylesheet, /aspect-ratio:\s*16\s*\/\s*9/);
  assert.match(stylesheet, /width:\s*min\(1280px,\s*calc\(100vw - 48px\),\s*calc\(\(100vh - 48px\) \* 16 \/ 9\)\)/);
  assert.match(stylesheet, /height:\s*auto/);
  assert.doesNotMatch(stylesheet, /grid-template-rows:\s*144px\s+minmax\(0,\s*1fr\)/);
  assert.match(stylesheet, /overflow:\s*hidden/);
  assert.match(stylesheet, /\.presentation-shell\s*{[\s\S]*height:\s*100vh/);
  assert.match(stylesheet, /\.presentation-shell\s*{[\s\S]*overflow:\s*hidden/);
});

test("presentation keeps operations chrome outside the slide area", async () => {
  const [html, stylesheet] = await Promise.all([
    fs.readFile(
      path.join(PROJECT_ROOT, "practice-harness", "public", "index.html"),
      "utf8",
    ),
    fs.readFile(
      path.join(PROJECT_ROOT, "practice-harness", "public", "styles.css"),
      "utf8",
    ),
  ]);

  assert.match(html, /class="session-box operator-session"/);
  assert.match(html, /<div class="practice-slide-frame">\s*<main/);
  assert.doesNotMatch(html, /AI harness practice · 실습 서버/);
  assert.doesNotMatch(html, /슬라이드 대신 이 화면을 보며 입력, 실행, 검증 결과를 함께 확인합니다\./);
  assert.match(stylesheet, /\.operator-session\s*{[\s\S]*position:\s*fixed/);
  assert.match(stylesheet, /\.operator-session\s*{[\s\S]*z-index:\s*10/);
});

test("presentation slide hides the act selector rail from the projector", async () => {
  const [html, stylesheet] = await Promise.all([
    fs.readFile(
      path.join(PROJECT_ROOT, "practice-harness", "public", "index.html"),
      "utf8",
    ),
    fs.readFile(
      path.join(PROJECT_ROOT, "practice-harness", "public", "styles.css"),
      "utf8",
    ),
  ]);

  assert.match(html, /class="stage-nav"/);
  assert.match(html, /hidden/);
  assert.match(html, /inert/);
  assert.match(html, /aria-hidden="true"/);
  assert.match(stylesheet, /\.stage-nav\s*{[\s\S]*display:\s*none/);
  assert.doesNotMatch(stylesheet, /\.presentation-layout\.has-result/);
});

test("presentation app advances through result actions instead of act selector buttons", async () => {
  const app = await fs.readFile(
    path.join(PROJECT_ROOT, "practice-harness", "public", "practice-app.js"),
    "utf8",
  );

  assert.match(app, /function renderResultActions/);
  assert.match(app, /text:\s*"다시하기"/);
  assert.match(app, /text:\s*"다음으로"/);
  assert.match(app, /function nextPracticeAfter/);
  assert.match(app, /loadPractice\(nextPractice\.id\)/);
  assert.match(app, /canGoNext:\s*true/);
  assert.doesNotMatch(app, /canGoNext:\s*attempt\.unlocked/);
  assert.match(app, /canGoNext:\s*questionNumber >= totalQuestions/);
});

test("starter template copy does not inject a skill answer into the learner input", async () => {
  const app = await fs.readFile(
    path.join(PROJECT_ROOT, "practice-harness", "public", "practice-app.js"),
    "utf8",
  );

  assert.doesNotMatch(
    app,
    /title:\s*"시작 템플릿"[\s\S]+?targetFieldName:\s*practice\.type\s*===\s*"skill-document"\s*\?\s*"document"\s*:\s*undefined/,
  );
});

test("presentation app resolves direct URLs to practice acts", async () => {
  const app = await fs.readFile(
    path.join(PROJECT_ROOT, "practice-harness", "public", "practice-app.js"),
    "utf8",
  );

  assert.match(app, /function practiceFromLocation/);
  assert.match(app, /window\.location\.pathname\.match\(\/\^\\\/act\\\/\(\\d\+\)\$\/\)/);
  assert.match(app, /state\.practices\.find\(\(practice\) => practice\.act === act\)/);
  assert.match(app, /window\.history\.pushState/);
  assert.match(app, /window\.addEventListener\("popstate"/);
});

test("Act 2 prompt brief is split into presentation-sized steps", async () => {
  const app = await fs.readFile(
    path.join(PROJECT_ROOT, "practice-harness", "public", "practice-app.js"),
    "utf8",
  );

  assert.match(app, /promptBriefPageIndex:\s*0/);
  assert.match(app, /function renderPromptBriefPractice/);
  assert.match(app, /"상황 이해"/);
  assert.match(app, /"6칸 기준"/);
  assert.match(app, /"지시문 작성"/);
  assert.match(app, /className:\s*"section-block prompt-step-slide"/);
  assert.match(app, /practice\.type === "prompt-brief"\) sections = sections\.concat\(renderPromptBriefPractice\(practice\)\)/);
  assert.match(app, /function renderPromptSubmitControls/);
});

test("Act 2 final prompt step keeps previous reset and submit in one control row", async () => {
  const app = await fs.readFile(
    path.join(PROJECT_ROOT, "practice-harness", "public", "practice-app.js"),
    "utf8",
  );

  assert.match(app, /function renderPromptSubmitControls/);
  assert.match(app, /renderPromptSubmitControls\(practice\)/);
  assert.match(app, /controls\.append\(previous,\s*reset,\s*submit\)/);
  assert.doesNotMatch(app, /practice\.type !== "prompt-brief" \|\|\s*state\.promptBriefPageIndex === PROMPT_BRIEF_LAST_PAGE/);
});

test("Act 1 progressive choice controls keep reset with the pager buttons", async () => {
  const app = await fs.readFile(
    path.join(PROJECT_ROOT, "practice-harness", "public", "practice-app.js"),
    "utf8",
  );

  assert.match(app, /function createPracticeResetButton/);
  assert.match(app, /const reset = createPracticeResetButton\(practice\)/);
  assert.match(app, /controls\.append\(previous,\s*reset,\s*next\)/);
  assert.match(app, /practice\.type !== "multi-question-choice"/);
});

test("Act 3 CLAUDE.md memory practice renders installer source and learner document input", async () => {
  const app = await fs.readFile(
    path.join(PROJECT_ROOT, "practice-harness", "public", "practice-app.js"),
    "utf8",
  );

  assert.match(app, /function renderClaudeMemoryPractice/);
  assert.match(app, /sourceTemplate/);
  assert.match(app, /설치용 원본 템플릿/);
  assert.match(app, /최종 CLAUDE\.md/);
  assert.match(app, /textarea\.name = "document"/);
  assert.match(app, /practice\.type === "claude-memory"\) sections = sections\.concat\(renderClaudeMemoryPractice\(practice\)\)/);
  assert.match(app, /if \(practice\.type === "claude-memory"\)/);
});

test("Act 3 CLAUDE.md memory practice uses normal submit and reset controls", async () => {
  const app = await fs.readFile(
    path.join(PROJECT_ROOT, "practice-harness", "public", "practice-app.js"),
    "utf8",
  );

  assert.doesNotMatch(app, /practice\.type !== "claude-memory"/);
  assert.match(app, /actions\.append\(submit\)/);
  assert.match(app, /actions\.append\(reset\)/);
});

test("multi-question retry keeps the learner on the current question", async () => {
  const app = await fs.readFile(
    path.join(PROJECT_ROOT, "practice-harness", "public", "practice-app.js"),
    "utf8",
  );

  assert.match(app, /function resetCurrentChoiceQuestion/);
  assert.match(app, /delete state\.act1Progress\.answers\[question\.id\]/);
  assert.match(app, /delete state\.act1Progress\.passed\[question\.id\]/);
  assert.match(app, /state\.act1Progress\.choicePageIndex = 0/);
  assert.match(app, /if \(practice\.type === "multi-question-choice"\) resetCurrentChoiceQuestion\(practice\)/);
  assert.doesNotMatch(app, /if \(practice\.id === "act1-info-selection"\) resetAct1Progress\(\)/);
});

test("multi-question choice allows the learner to continue after an incorrect question", async () => {
  const app = await fs.readFile(
    path.join(PROJECT_ROOT, "practice-harness", "public", "practice-app.js"),
    "utf8",
  );

  assert.match(app, /function advanceCurrentChoiceQuestion/);
  assert.match(app, /nextQuestion\.addEventListener\("click", \(\) => advanceCurrentChoiceQuestion\(practice\)\)/);
  assert.doesNotMatch(app, /nextQuestion\.disabled = true/);
  assert.doesNotMatch(app, /if \(!evaluation\.passed\) return;/);
});

test("all multi-question choice practices use the same progressive question flow", async () => {
  const app = await fs.readFile(
    path.join(PROJECT_ROOT, "practice-harness", "public", "practice-app.js"),
    "utf8",
  );

  assert.match(app, /function resetCurrentChoiceQuestion/);
  assert.match(app, /function advanceCurrentChoiceQuestion/);
  assert.match(app, /function renderProgressiveChoicePractice/);
  assert.match(app, /if \(practice\.type === "multi-question-choice"\) resetCurrentChoiceQuestion\(practice\)/);
  assert.match(app, /if \(practice\.type === "multi-question-choice"\) \{[\s\S]*sections = sections\.concat\(renderProgressiveChoicePractice\(practice\)\)/);
  assert.doesNotMatch(app, /practice\.id === "act1-info-selection"\s*\?\s*renderAct1ProgressPractice/);
});

test("presentation switches from practice slide to full result slide after checking", async () => {
  const [html, app] = await Promise.all([
    fs.readFile(
      path.join(PROJECT_ROOT, "practice-harness", "public", "index.html"),
      "utf8",
    ),
    fs.readFile(
      path.join(PROJECT_ROOT, "practice-harness", "public", "practice-app.js"),
      "utf8",
    ),
  ]);

  assert.match(html, /id="practice-slide"/);
  assert.match(html, /class="result-panel result-slide"[^>]*hidden/);
  assert.match(app, /resultPanel:\s*document\.querySelector\("#result-panel"\)/);
  assert.match(app, /practiceSlide:\s*document\.querySelector\("#practice-slide"\)/);
  assert.match(app, /function showResultSlide/);
  assert.match(app, /function showPracticeSlide/);
  assert.match(app, /nodes\.resultPanel\.hidden = false/);
  assert.match(app, /nodes\.resultPanel\.hidden = true/);
  assert.match(app, /nodes\.practiceSlide\.hidden = true/);
  assert.match(app, /nodes\.practiceSlide\.hidden = false/);
});

test("result unlock artifact renders as a readable scrollable prompt block", async () => {
  const [app, stylesheet] = await Promise.all([
    fs.readFile(
      path.join(PROJECT_ROOT, "practice-harness", "public", "practice-app.js"),
      "utf8",
    ),
    fs.readFile(
      path.join(PROJECT_ROOT, "practice-harness", "public", "styles.css"),
      "utf8",
    ),
  ]);

  assert.match(app, /function renderUnlockArtifact/);
  assert.match(app, /createElement\("pre",\s*\{\s*text:\s*attempt\.unlockArtifact\.body/);
  assert.match(app, /feedback\.push\(renderUnlockArtifact\(attempt\)\)/);
  assert.match(stylesheet, /\.result-slide\s*{[\s\S]*grid-template-columns:/);
  assert.match(stylesheet, /\.result-slide \.feedback-list\s*{[\s\S]*grid-column:\s*1/);
  assert.match(stylesheet, /\.result-slide \.verification-log\s*{[\s\S]*grid-column:\s*2/);
  assert.match(stylesheet, /\.unlock-artifact\s*{[\s\S]*overflow:\s*auto/);
  assert.match(stylesheet, /\.unlock-artifact pre\s*{[\s\S]*white-space:\s*pre-wrap/);
  assert.match(stylesheet, /\.unlock-artifact pre\s*{[\s\S]*overflow-wrap:\s*anywhere/);
  assert.match(stylesheet, /@media \(max-width: 760px\) \{[\s\S]*\.presentation-shell\s*{[\s\S]*overflow:\s*auto/);
  assert.match(stylesheet, /@media \(max-width: 760px\) \{[\s\S]*\.practice-slide-frame\s*{[\s\S]*height:\s*calc\(100vh - 16px\)/);
  assert.match(stylesheet, /@media \(max-width: 760px\) \{[\s\S]*\.practice-slide-frame\s*{[\s\S]*aspect-ratio:\s*auto/);
});

test("unlock artifact prompt can be copied with a dedicated button", async () => {
  const [app, stylesheet] = await Promise.all([
    fs.readFile(
      path.join(PROJECT_ROOT, "practice-harness", "public", "practice-app.js"),
      "utf8",
    ),
    fs.readFile(
      path.join(PROJECT_ROOT, "practice-harness", "public", "styles.css"),
      "utf8",
    ),
  ]);

  assert.match(app, /function copyTextToClipboard/);
  assert.match(app, /navigator\.clipboard\.writeText\(text\)/);
  assert.match(app, /document\.execCommand\("copy"\)/);
  assert.match(app, /text:\s*"프롬프트 복사"/);
  assert.match(app, /copyTextToClipboard\(attempt\.unlockArtifact\.body\)/);
  assert.match(stylesheet, /\.unlock-artifact-header\s*{[\s\S]*display:\s*flex/);
  assert.match(stylesheet, /\.unlock-copy-button\s*{[\s\S]*justify-self:\s*end/);
});

test("Act 1 presents choices as four-option aptitude-test pages", async () => {
  const app = await fs.readFile(
    path.join(PROJECT_ROOT, "practice-harness", "public", "practice-app.js"),
    "utf8",
  );

  assert.match(app, /choicePageIndex:\s*0/);
  assert.match(app, /const ACT1_CHOICES_PER_PAGE = 4/);
  assert.match(app, /function currentAct1Choices/);
  assert.match(app, /function saveCurrentAct1Page/);
  assert.match(app, /className:\s*"act1-choice-pager"/);
  assert.match(app, /question\.choices\.slice\(start,\s*end\)/);
  assert.match(app, /for \(const choice of currentChoices\)/);
  assert.match(app, /text:\s*"이전 선택지"/);
  assert.match(app, /text:\s*isLastChoicePage \? "문제 확인" : "다음 선택지"/);
  assert.match(app, /next\.type = isLastChoicePage \? "submit" : "button"/);
  assert.match(app, /practice\.type !== "multi-question-choice";/);
  assert.match(app, /text:\s*"다음 문제 풀기"/);
});

test("Act 1 choice cards are compact enough for four options on a slide", async () => {
  const stylesheet = await fs.readFile(
    path.join(PROJECT_ROOT, "practice-harness", "public", "styles.css"),
    "utf8",
  );

  assert.match(stylesheet, /\.act1-choice-card\s*{[\s\S]*gap:\s*8px/);
  assert.match(stylesheet, /\.act1-choice-card\s*{[\s\S]*padding:\s*10px/);
  assert.match(stylesheet, /\.act1-choice-card\s*{[\s\S]*border:\s*2px solid var\(--line\)/);
  assert.match(stylesheet, /\.act1-choice-card \.choice-row\s*{[\s\S]*min-height:\s*62px/);
  assert.match(stylesheet, /\.act1-choice-card \.choice-row\s*{[\s\S]*padding:\s*8px 10px/);
});

test("presentation stylesheet keeps result details readable from a lecture room", async () => {
  const stylesheet = await fs.readFile(
    path.join(PROJECT_ROOT, "practice-harness", "public", "styles.css"),
    "utf8",
  );

  assert.match(stylesheet, /\.feedback-item,\s*\n\.log-item\s*{/);
  assert.match(stylesheet, /font-size:\s*clamp\(19px,\s*1\.6vw,\s*26px\)/);
});

test("presentation UI keeps RED GREEN evidence in the verification layer", async () => {
  const evidence = await fs.readFile(
    path.join(
      PROJECT_ROOT,
      "docs",
      "superpowers",
      "evidence",
      "2026-05-28-practice-presentation-ui-red-green.md",
    ),
    "utf8",
  );

  assert.match(evidence, /RED/);
  assert.match(evidence, /presentation-shell/);
  assert.match(evidence, /GREEN/);
  assert.match(evidence, /79\/79|tests 79/);
});

test("result slide renders supplemental AI judge feedback when available", async () => {
  const app = await fs.readFile(
    path.join(PROJECT_ROOT, "practice-harness", "public", "practice-app.js"),
    "utf8",
  );

  assert.match(app, /function renderJudgeResult/);
  assert.match(app, /AI 보조 검토/);
  assert.match(app, /attempt\.judgeResult/);
  assert.match(app, /attempt\.providerWarnings/);
});

test("Act 5 renders a copyable one-shot agent team prompt instead of a score checklist", async () => {
  const app = await fs.readFile(
    path.join(PROJECT_ROOT, "practice-harness", "public", "practice-app.js"),
    "utf8",
  );

  assert.match(app, /practice\.learning\.teamPrompt/);
  assert.match(app, /에이전트 팀 프롬프트/);
  assert.match(app, /copyLabel:\s*"팀 프롬프트 복사"/);
  assert.doesNotMatch(app, /for \(const item of practice\.checklist \|\| \[\]\)/);
});

test("learner submissions send a clientAttemptId for duplicate-click protection", async () => {
  const app = await fs.readFile(
    path.join(PROJECT_ROOT, "practice-harness", "public", "practice-app.js"),
    "utf8",
  );

  assert.match(app, /function createClientAttemptId/);
  assert.match(app, /function rememberAttemptOnce/);
  assert.match(app, /clientAttemptId: createClientAttemptId\(practice\)/);
});

test("static app delegates API routes to practice API", async () => {
  const server = await createTestServer();
  try {
    const response = await fetch(`${server.baseUrl}/api/practices`);
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.equal(body.ok, true);
    assert.equal(body.practices.length, 6);
  } finally {
    await server.close();
  }
});

test("static app rejects traversal and malformed paths", async () => {
  const server = await createTestServer();
  try {
    const traversal = await fetch(`${server.baseUrl}/%2e%2e/package.json`);
    assert.equal(traversal.status, 404);

    const malformed = await fetch(`${server.baseUrl}/%EA`);
    assert.equal(malformed.status, 400);
  } finally {
    await server.close();
  }
});
