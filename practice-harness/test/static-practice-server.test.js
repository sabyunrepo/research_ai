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
const HTML_PATH = path.join(PROJECT_ROOT, "practice-harness", "public", "index.html");
const CSS_PATH = path.join(PROJECT_ROOT, "practice-harness", "public", "styles.css");
const REACT_SOURCE_PATH = path.join(PROJECT_ROOT, "practice-harness", "react-src", "App.jsx");
const BUNDLE_PATH = path.join(PROJECT_ROOT, "practice-harness", "public", "practice-app.js");

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

test("GET / serves the React practice learner shell", async () => {
  const server = await createTestServer();
  try {
    const response = await fetch(`${server.baseUrl}/`);
    const body = await response.text();

    assert.equal(response.status, 200);
    assert.match(response.headers.get("content-type"), /text\/html/);
    assert.match(body, /id="practice-root"/);
    assert.match(body, /practice-app\.js/);
  } finally {
    await server.close();
  }
});

test("GET /act/:act serves the same React shell for direct practice URLs", async () => {
  const server = await createTestServer();
  try {
    const response = await fetch(`${server.baseUrl}/act/2`);
    const body = await response.text();

    assert.equal(response.status, 200);
    assert.match(response.headers.get("content-type"), /text\/html/);
    assert.match(body, /id="practice-root"/);
    assert.match(body, /practice-app\.js/);
  } finally {
    await server.close();
  }
});

test("React app resolves direct URLs and loads full practice definitions", async () => {
  const source = await fs.readFile(REACT_SOURCE_PATH, "utf8");

  assert.match(source, /function practiceFromLocation/);
  assert.match(source, /window\.location\.pathname\.match\(\^?\/\^\\\/act\\\/\(\\d\+\)\$\//);
  assert.match(source, /window\.location\.pathname\.match\(\^?\/\^\\\/practices\\\/\(\[a-z0-9-\]\+\)\$\//);
  assert.match(source, /window\.history\.pushState/);
  assert.match(source, /window\.addEventListener\("popstate"/);
  assert.match(source, /fetchJson\(`\/api\/practices\/\$\{next\.id\}`\)/);
});

test("React app decomposes the learner UI into act-specific components", async () => {
  const source = await fs.readFile(REACT_SOURCE_PATH, "utf8");

  assert.match(source, /GLOSSARY_TERMS/);
  assert.match(source, /function GlossaryText/);
  assert.match(source, /data-glossary/);
  assert.match(source, /role="button"/);
  assert.match(source, /role", "tooltip"/);
  assert.doesNotMatch(source, /title=\{/);
  assert.match(source, /function PracticeNavigator/);
  assert.match(source, /function LearningGuide/);
  assert.match(source, /function isRequiredChoice/);
  assert.match(source, /function isBlockingChoice/);
  assert.match(source, /function Act1Practice/);
  assert.match(source, /function Act2Practice/);
  assert.match(source, /function TextPractice/);
  assert.match(source, /function ChecklistPractice/);
  assert.match(source, /function ResultDialog/);
  assert.doesNotMatch(source, /아직 제출하지 않았습니다/);
  assert.match(source, /function JudgeResult/);
  assert.match(source, /function AttemptHistory/);
  assert.match(source, /function act1QuestionResult/);
  assert.match(source, /function questionMaxScore/);
  assert.match(source, /이 문제를 통과했습니다/);
  assert.match(source, /시도 비교/);
});

test("React app shows pending state and protects against duplicate submits", async () => {
  const source = await fs.readFile(REACT_SOURCE_PATH, "utf8");

  assert.match(source, /function StatusBanner/);
  assert.match(source, /aria-busy=\{disabled\}/);
  assert.match(source, /검사 중\.\.\./);
  assert.match(source, /기본 채점 후 AI 보조 검토를 실행하고 있습니다/);
  assert.match(source, /결과가 준비되면 이 창에서 바로 점수와 빠진 항목을 보여줍니다/);
  assert.match(source, /pending-steps/);
  assert.match(source, /중복 제출을 막기 위해 버튼을 잠갔습니다/);
  assert.match(source, /function clientAttemptIdFor/);
  assert.match(source, /clientAttemptId: clientAttemptIdFor\(practice\)/);
  assert.match(source, /disabled=\{disabled\}/);
  assert.match(source, /function focusableElements/);
  assert.match(source, /event\.key === "Escape"/);
  assert.match(source, /onKeyDown=\{onDialogKeyDown\}/);
  assert.match(source, /aria-describedby=\{activeTooltipId\}/);
});

test("React app preserves required Act 3, Act 5, and Act 6 learner affordances", async () => {
  const source = await fs.readFile(REACT_SOURCE_PATH, "utf8");

  assert.match(source, /sourceTemplate/);
  assert.match(source, /defaultDocument/);
  assert.match(source, /scopeOptions/);
  assert.match(source, /ruleCards/);
  assert.match(source, /기본 제공 파일 확인/);
  assert.match(source, /원본 전체 복사/);
  assert.match(source, /CLAUDE\.md 적용 범위 선택/);
  assert.match(source, /과한 내규 제거/);
  assert.match(source, /프로젝트 루트에 남길 CLAUDE\.md 초안/);
  assert.match(source, /learning\.teamPrompt/);
  assert.match(source, /roleTemplates/);
  assert.match(source, /toolPermissions/);
  assert.match(source, /runbookTemplate/);
  assert.match(source, /팀 프롬프트 복사/);
  assert.match(source, /역할별 프롬프트 템플릿/);
  assert.match(source, /Skill 배정과 Tool 권한 안내/);
  assert.match(source, /practice\.groups \|\|/);
  assert.match(source, /unlockArtifact/);
  assert.match(source, /프롬프트 복사/);
});

test("React result UI prioritizes next action and keeps evidence secondary", async () => {
  const source = await fs.readFile(REACT_SOURCE_PATH, "utf8");

  assert.match(source, /다음 행동/);
  assert.match(source, /빠진 항목/);
  assert.match(source, /좋았던 점/);
  assert.match(source, /다시 시도할 때/);
  assert.match(source, /AI 보조 검토/);
  assert.match(source, /검증 로그/);
  assert.match(source, /<details id="verification-log" className="verification-log">/);
  assert.doesNotMatch(source, /InlinePracticeResult/);
  assert.doesNotMatch(source, /현재 점수로 결과 보기/);
  assert.doesNotMatch(source, /다음 실습으로/);
  assert.match(source, /다음 문제로/);
  assert.doesNotMatch(source, /\$\{warning\.provider\}:\s*\$\{warning\.message\}/);
});

test("React stylesheet uses a readable learner layout instead of a fixed deck frame", async () => {
  const stylesheet = await fs.readFile(CSS_PATH, "utf8");

  assert.match(stylesheet, /\.practice-app-shell\s*{/);
  assert.match(stylesheet, /\.learner-layout\s*{/);
  assert.match(stylesheet, /\.workbench\s*{/);
  assert.match(stylesheet, /\.result-modal-backdrop\s*{/);
  assert.match(stylesheet, /\.result-dialog\s*{/);
  assert.match(stylesheet, /\.stage-nav\s*{/);
  assert.match(stylesheet, /width:\s*min\(1440px,\s*calc\(100vw - 40px\)\)/);
  assert.doesNotMatch(stylesheet, /aspect-ratio:\s*16\s*\/\s*9/);
  assert.doesNotMatch(stylesheet, /\.presentation-shell/);
});

test("React stylesheet makes loading, results, and unlock artifacts readable", async () => {
  const stylesheet = await fs.readFile(CSS_PATH, "utf8");

  assert.match(stylesheet, /\.glossary-term\s*{/);
  assert.match(stylesheet, /\.glossary-popover\s*{/);
  assert.match(stylesheet, /\.glossary-popover\.is-visible\s*{/);
  assert.match(stylesheet, /\.status-banner\s*{/);
  assert.match(stylesheet, /\.spinner\s*{/);
  assert.match(stylesheet, /\.large-spinner\s*{/);
  assert.match(stylesheet, /\.pending-dialog-header\s*{/);
  assert.match(stylesheet, /\.pending-steps \.feedback-item\s*{/);
  assert.match(stylesheet, /@keyframes spin/);
  assert.match(stylesheet, /\.score-meter\.pending\s*{/);
  assert.match(stylesheet, /\.result-section\s*{/);
  assert.match(stylesheet, /\.attempt-history\s*{/);
  assert.match(stylesheet, /\.attempt-summary-grid\s*{/);
  assert.match(stylesheet, /\.attempt-list li\.current\s*{/);
  assert.match(stylesheet, /\.verification-log\s*{/);
  assert.match(stylesheet, /\.unlock-artifact\s*{/);
  assert.match(stylesheet, /\.unlock-artifact pre\s*{/);
  assert.match(stylesheet, /white-space:\s*pre-wrap/);
  assert.match(stylesheet, /overflow-wrap:\s*anywhere/);
});

test("built practice bundle exists and bootstraps React into the static shell", async () => {
  const bundle = await fs.readFile(BUNDLE_PATH, "utf8");

  assert.match(bundle, /practice-root/);
  assert.match(bundle, /createRoot/);
  assert.match(bundle, /clientAttemptIdFor/);
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
