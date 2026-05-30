#!/usr/bin/env node

const assert = require("node:assert/strict");
const fs = require("node:fs");
const http = require("node:http");
const os = require("node:os");
const path = require("node:path");
const { spawn } = require("node:child_process");

const { createPracticeApp } = require("../practice-harness/src/create-practice-app");
const {
  createPracticeStaticApp,
} = require("../practice-harness/src/create-practice-static-app");
const {
  createPracticeDefinitionStore,
} = require("../practice-harness/src/practice-definition-store");
const {
  createMemoryAttemptStore,
} = require("../practice-harness/src/stores/memory-attempt-store");
const {
  successfulAttemptCaseByAct,
} = require("../practice-harness/test/helpers/successful-attempts");

const DEFAULT_CHROME_PATHS = [
  process.env.CHROME_BIN,
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Chromium.app/Contents/MacOS/Chromium",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
].filter(Boolean);

function findChrome() {
  const chrome = DEFAULT_CHROME_PATHS.find((candidate) => fs.existsSync(candidate));
  if (!chrome) throw new Error("Chrome/Chromium binary not found. Set CHROME_BIN.");
  return chrome;
}

function createServer({ judgeProvider = "none" } = {}) {
  const apiApp = createPracticeApp({
    definitionStore: createPracticeDefinitionStore(),
    attemptStore: createMemoryAttemptStore(),
    judgeProvider,
  });
  return http.createServer(createPracticeStaticApp({ apiApp }));
}

function listen(server) {
  return new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", () => {
      server.off("error", reject);
      resolve(`http://127.0.0.1:${server.address().port}`);
    });
  });
}

function close(server) {
  return new Promise((resolve, reject) => {
    server.close((error) => {
      if (error) reject(error);
      else resolve();
    });
  });
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function waitForExit(child, timeoutMs) {
  return new Promise((resolve) => {
    let settled = false;
    const timer = setTimeout(() => {
      if (settled) return;
      settled = true;
      resolve(false);
    }, timeoutMs);
    child.once("exit", () => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      resolve(true);
    });
  });
}

async function stopChrome(child) {
  if (child.exitCode !== null || child.signalCode) return;
  child.kill("SIGTERM");
  const exited = await waitForExit(child, 1500);
  if (!exited) {
    child.kill("SIGKILL");
    await waitForExit(child, 1500);
  }
}

async function waitForDevToolsPort(userDataDir, timeoutMs = 10000) {
  const activePortPath = path.join(userDataDir, "DevToolsActivePort");
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    if (fs.existsSync(activePortPath)) {
      const [port] = fs.readFileSync(activePortPath, "utf8").trim().split("\n");
      if (port) return Number(port);
    }
    await delay(100);
  }
  throw new Error("Chrome did not expose a DevTools port in time.");
}

async function getPageWebSocketUrl(port) {
  const deadline = Date.now() + 10000;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(`http://127.0.0.1:${port}/json/list`);
      const pages = await response.json();
      const page = pages.find((item) =>
        item.type === "page" &&
        item.webSocketDebuggerUrl &&
        !String(item.url || "").startsWith("chrome-extension://")
      );
      if (page) return page.webSocketDebuggerUrl;
    } catch (error) {
      // Chrome is still starting.
    }
    await delay(100);
  }
  throw new Error("Chrome DevTools page target was not available in time.");
}

class CdpClient {
  constructor(webSocketUrl) {
    this.nextId = 1;
    this.pending = new Map();
    this.loadResolvers = [];
    this.socket = new WebSocket(webSocketUrl);
    this.socket.addEventListener("message", (event) => this.handleMessage(event));
  }

  async open() {
    if (this.socket.readyState === WebSocket.OPEN) return;
    await new Promise((resolve, reject) => {
      this.socket.addEventListener("open", resolve, { once: true });
      this.socket.addEventListener("error", reject, { once: true });
    });
  }

  handleMessage(event) {
    const message = JSON.parse(event.data);
    if (message.id && this.pending.has(message.id)) {
      const { resolve, reject } = this.pending.get(message.id);
      this.pending.delete(message.id);
      if (message.error) reject(new Error(message.error.message));
      else resolve(message.result || {});
      return;
    }
    if (message.method === "Page.loadEventFired") {
      const resolvers = this.loadResolvers.splice(0);
      resolvers.forEach((resolve) => resolve());
    }
  }

  send(method, params = {}) {
    const id = this.nextId;
    this.nextId += 1;
    this.socket.send(JSON.stringify({ id, method, params }));
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
    });
  }

  async evaluate(expression, awaitPromise = false) {
    const result = await this.send("Runtime.evaluate", {
      expression,
      awaitPromise,
      returnByValue: true,
    });
    if (result.exceptionDetails) {
      throw new Error(result.exceptionDetails.text || "Browser evaluation failed");
    }
    return result.result ? result.result.value : undefined;
  }

  waitForLoad(timeoutMs = 8000) {
    return new Promise((resolve) => {
      const timer = setTimeout(resolve, timeoutMs);
      this.loadResolvers.push(() => {
        clearTimeout(timer);
        resolve();
      });
    });
  }

  close() {
    this.socket.close();
  }
}

async function launchBrowser() {
  const userDataDir = fs.mkdtempSync(path.join(os.tmpdir(), "practice-ui-flow-"));
  const child = spawn(
    findChrome(),
    [
      "--headless=new",
      "--disable-gpu",
      "--disable-background-networking",
      "--disable-component-update",
      "--disable-default-apps",
      "--disable-extensions",
      "--disable-features=MediaRouter,OptimizationHints",
      "--disable-sync",
      "--hide-scrollbars",
      "--metrics-recording-only",
      "--no-first-run",
      "--remote-debugging-port=0",
      `--user-data-dir=${userDataDir}`,
      "--window-size=1280,800",
      "about:blank",
    ],
    { stdio: "ignore" },
  );
  const port = await waitForDevToolsPort(userDataDir);
  const client = new CdpClient(await getPageWebSocketUrl(port));
  await client.open();
  await client.send("Page.enable");
  await client.send("Runtime.enable");
  await client.send("Emulation.setDeviceMetricsOverride", {
    width: 1280,
    height: 800,
    deviceScaleFactor: 1,
    mobile: false,
  });
  return { child, client, userDataDir };
}

async function cleanupBrowser(browser) {
  browser.client.close();
  await stopChrome(browser.child);
  fs.rmSync(browser.userDataDir, { force: true, recursive: true });
}

async function navigate(client, url) {
  await client.send("Page.navigate", { url });
  await client.waitForLoad();
  await client.evaluate(
    "document.fonts && document.fonts.ready ? document.fonts.ready.then(() => true) : true",
    true,
  );
  await waitFor(
    client,
    "document.querySelector('#practice-heading') && document.querySelector('#practice-heading').innerText.trim().length > 0",
  );
}

async function waitFor(client, predicateExpression, timeoutMs = 8000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    const passed = await client.evaluate(`Boolean(${predicateExpression})`);
    if (passed) return;
    await delay(100);
  }
  throw new Error(`Timed out waiting for: ${predicateExpression}`);
}

async function waitForText(client, text, timeoutMs = 8000) {
  const escaped = JSON.stringify(text);
  await waitFor(client, `document.body.innerText.includes(${escaped})`, timeoutMs);
}

async function clickButton(client, text) {
  const escaped = JSON.stringify(text);
  const clicked = await client.evaluate(`
    (() => {
      const button = Array.from(document.querySelectorAll("button")).find((item) =>
        item.textContent.trim() === ${escaped}
      );
      if (!button) return false;
      button.click();
      return true;
    })()
  `);
  assert.equal(clicked, true, `button not found: ${text}`);
}

async function clickFirstButton(client, texts) {
  const clicked = await client.evaluate(`
    (() => {
      const texts = ${JSON.stringify(texts)};
      const button = Array.from(document.querySelectorAll("button")).find((item) =>
        texts.includes(item.textContent.trim())
      );
      if (!button) return false;
      button.click();
      return true;
    })()
  `);
  assert.equal(clicked, true, `button not found: ${texts.join(" or ")}`);
}

async function submitForm(client) {
  const submitted = await client.evaluate(`
    (() => {
      const button = document.querySelector('form button[type="submit"]');
      if (!button) return false;
      button.click();
      return true;
    })()
  `);
  assert.equal(submitted, true, "submit button not found");
}

async function fillTextarea(client, name, value) {
  await client.evaluate(`
    (() => {
      const field = document.querySelector(${JSON.stringify(`textarea[name="${name}"]`)});
      if (!field) throw new Error("textarea not found: ${name}");
      field.value = ${JSON.stringify(value)};
      field.dispatchEvent(new Event("input", { bubbles: true }));
      field.dispatchEvent(new Event("change", { bubbles: true }));
      return true;
    })()
  `);
}

async function checkValues(client, name, values) {
  await client.evaluate(`
    (() => {
      const values = new Set(${JSON.stringify(values)});
      for (const input of document.querySelectorAll(${JSON.stringify(`input[name="${name}"]`)})) {
        if (values.has(input.value) && !input.checked) input.click();
      }
      return true;
    })()
  `);
}

async function expectScore(client, scoreText) {
  await waitFor(client, `document.querySelector(".score-meter strong") && document.querySelector(".score-meter strong").textContent.trim() === ${JSON.stringify(scoreText)}`);
  await waitFor(client, "Boolean(document.querySelector('#result-dialog[role=\"dialog\"]'))");
  await assertResultModalContract(client, scoreText);
}

async function assertResultModalContract(client, scoreText) {
  const summaryJson = await client.evaluate(`
    JSON.stringify((() => {
      const dialog = document.querySelector('#result-dialog[role="dialog"]');
      const meter = document.querySelector('#score-meter');
      const retryHeading = Array.from(document.querySelectorAll('.result-section h3')).find((heading) =>
        heading.textContent.trim() === '다시 시도할 때'
      );
      return {
        dialogVisible: Boolean(dialog),
        scoreText: meter?.querySelector('strong')?.textContent.trim() || '',
        scoreClassName: meter?.className || '',
        hasNextAction: Boolean(dialog && dialog.innerText.includes('다음 행동')),
        hasMissingItems: Boolean(dialog && dialog.innerText.includes('빠진 항목')),
        hasRetrySection: Boolean(retryHeading),
        hasInlineResult: Boolean(document.querySelector('.inline-result')),
        hasNextPracticeCopy: Boolean(dialog && dialog.innerText.includes('다음 실습')),
      };
    })())
  `);
  const summary = JSON.parse(summaryJson);
  assert.equal(summary.dialogVisible, true, "result must be shown in a modal dialog");
  assert.equal(summary.scoreText, scoreText, "result modal score must match expected score");
  assert.equal(summary.hasNextAction, true, "result modal must explain the next action");
  assert.equal(summary.hasMissingItems, true, "result modal must show missing-item feedback");
  assert.equal(summary.hasInlineResult, false, "result must not also render as an inline result");
  assert.equal(summary.hasNextPracticeCopy, false, "result modal must not expose next-practice navigation");
  if (scoreText === "100점") {
    assert.match(summary.scoreClassName, /pass/, "100점 result must use pass styling");
    assert.equal(summary.hasRetrySection, false, "passing result must not show retry instructions");
  } else {
    assert.match(summary.scoreClassName, /fail/, "non-100 result must use fail styling");
    assert.equal(summary.hasRetrySection, true, "non-100 result must show retry instructions");
  }
}

async function expectResultIncludes(client, scoreText, text) {
  await expectScore(client, scoreText);
  await waitForText(client, "다음 행동");
  await waitForText(client, "빠진 항목");
  await waitForText(client, "다시 시도할 때");
  await waitForText(client, text);
}

async function verifyAct1RejectsRandomChoice(client, baseUrl) {
  await navigate(client, `${baseUrl}/act/1`);
  await waitForText(client, "오늘 할 일");
  await clickButton(client, "문제 시작");
  const guideStillVisible = await client.evaluate("document.body.innerText.includes('오늘 할 일')");
  assert.equal(guideStillVisible, false, "Act 1 guide should leave the main work area after starting");
  const initialDialogVisible = await client.evaluate("Boolean(document.querySelector('[role=\"dialog\"]'))");
  assert.equal(initialDialogVisible, false, "result dialog should not be visible before submitting");
  const stalePlaceholderVisible = await client.evaluate("document.body.innerText.includes('아직 제출하지 않았습니다.')");
  assert.equal(stalePlaceholderVisible, false, "pre-submit placeholder result text should not be visible");
  await clickButton(client, "다음 선택지");
  await checkValues(client, "q1", ["q1-old-design-system"]);
  await clickButton(client, "다음 선택지");
  await clickButton(client, "문제 확인");
  await waitFor(client, "Boolean(document.querySelector('#result-dialog[role=\"dialog\"]'))");
  await expectScore(client, "0점");
  const inlineResultVisible = await client.evaluate("Boolean(document.querySelector('.inline-result'))");
  assert.equal(inlineResultVisible, false, "Act 1 problem confirmation must show the modal result instead of an inline result");
  await waitForText(client, "빠진 항목");
  await waitForText(client, "페이지 목적과 행동이 없으면 김아이가 카드의 우선순위를 추측합니다.");
  await waitForText(client, "전체 디자인 시스템은 지금 카드 하나를 만드는 범위를 넓힙니다.");
  await waitForText(client, "다음 문제로");
  const nextPracticeVisible = await client.evaluate("document.body.innerText.includes('다음 실습')");
  assert.equal(nextPracticeVisible, false, "Practice result modal must not expose next-practice navigation");
  const wronglyPassed = await client.evaluate("document.body.innerText.includes('문제 통과했습니다.')");
  assert.equal(wronglyPassed, false, "Act 1 random/noise-only choice must not pass question 1");
}

async function verifyAct1QuestionScoreReflectsSelections(client, baseUrl) {
  await navigate(client, `${baseUrl}/act/1`);
  await clickButton(client, "문제 시작");
  await checkValues(client, "q1", [
    "q1-purpose-action",
    "q1-responsive-breakpoints",
    "q1-real-content",
    "q1-brand-style",
  ]);
  await clickButton(client, "다음 선택지");
  await checkValues(client, "q1", [
    "q1-state-verification",
    "q1-output-format",
  ]);
  await clickButton(client, "다음 선택지");
  await clickButton(client, "문제 확인");
  await expectScore(client, "100점");
  await waitForText(client, "이 문제를 통과했습니다. 다음 문제로 이동하세요.");
  await waitForText(client, "빠진 항목이 없습니다.");
  const unrelatedQuestionFeedbackVisible = await client.evaluate(`
    document.body.innerText.includes("발생 환경이 없으면 김아이가 문제를 재현하기 어렵습니다.")
  `);
  assert.equal(
    unrelatedQuestionFeedbackVisible,
    false,
    "Act 1 question modal must not show missing feedback from later unanswered questions",
  );
}

async function verifyGlossaryTooltip(client, baseUrl) {
  await navigate(client, `${baseUrl}/act/2`);
  await waitFor(client, "document.querySelectorAll('[data-glossary]').length >= 3");
  const nativeTitleCount = await client.evaluate("document.querySelectorAll('[data-glossary][title]').length");
  assert.equal(nativeTitleCount, 0, "Glossary terms must use the custom popover instead of native title tooltips");
  const focused = await client.evaluate(`
    (() => {
      const term = Array.from(document.querySelectorAll('[data-glossary]')).find((item) =>
        item.textContent.trim() === '반응형' || item.textContent.trim() === 'HTML/CSS'
      );
      if (!term) return false;
      term.focus();
      term.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
      return true;
    })()
  `);
  assert.equal(focused, true, "expected at least one glossary term in Act 2");
  await waitFor(client, "document.querySelector('#glossaryPopover.is-visible') && document.querySelector('#glossaryPopover').textContent.length > 10");
  const tooltipText = await client.evaluate("document.querySelector('#glossaryPopover').textContent");
  assert.match(tooltipText, /화면|웹|모바일|데스크톱/);
  const describedBy = await client.evaluate("document.activeElement.getAttribute('aria-describedby')");
  assert.equal(describedBy, "glossaryPopover", "glossary trigger must reference the tooltip with aria-describedby");
  await client.evaluate(`
    document.activeElement.dispatchEvent(new KeyboardEvent("keydown", {
      key: "Escape",
      bubbles: true,
    }))
  `);
  await waitFor(client, "!document.querySelector('#glossaryPopover.is-visible')");
}

async function verifyAct2VaguePromptShowsFailure(client, baseUrl) {
  await navigate(client, `${baseUrl}/act/2`);
  await clickButton(client, "다음");
  await clickButton(client, "다음");
  await fillTextarea(client, "prompt", "반응형 카드 만들어줘");
  await submitForm(client);
  await expectResultIncludes(client, "20점", "점수가 부족합니다.");
  const focusInsideDialog = await client.evaluate("Boolean(document.querySelector('#result-dialog')?.contains(document.activeElement))");
  assert.equal(focusInsideDialog, true, "result modal should move focus inside the dialog");
  await client.evaluate(`
    document.activeElement.dispatchEvent(new KeyboardEvent("keydown", {
      key: "Escape",
      bubbles: true,
    }))
  `);
  await waitFor(client, "!document.querySelector('#result-dialog[role=\"dialog\"]')");
  await fillTextarea(client, "prompt", successfulAttemptCaseByAct(2).body.input.prompt);
  await submitForm(client);
  await expectScore(client, "100점");
  await waitForText(client, "시도 비교");
  await waitForText(client, "현재 세션 최고 점수");
  await waitForText(client, "직전 시도 대비 변화");
  const nextPracticeVisible = await client.evaluate("document.body.innerText.includes('다음 실습')");
  assert.equal(nextPracticeVisible, false, "Act 2 result modal must not expose next-practice navigation");
}

async function verifyAct2PendingState(client, baseUrl) {
  await navigate(client, `${baseUrl}/act/2`);
  await clickButton(client, "다음");
  await clickButton(client, "다음");
  await waitFor(client, "document.querySelector('textarea[name=\"prompt\"]')");
  await fillTextarea(client, "prompt", successfulAttemptCaseByAct(2).body.input.prompt);
  await submitForm(client);
  await waitForText(client, "검증 중");
  await waitForText(client, "기본 채점 후 AI 보조 검토를 실행하고 있습니다.");
  await waitForText(client, "입력 접수");
  await waitForText(client, "채점 실행");
  const submitLocked = await client.evaluate(`
    (() => {
      const button = Array.from(document.querySelectorAll("button")).find((item) =>
        item.textContent.trim() === "검사 중..."
      );
      return Boolean(button && button.disabled);
    })()
  `);
  assert.equal(submitLocked, true, "Act 2 submit button should show and lock pending state");
  await expectScore(client, "100점");
}

async function verifyAct3WrongScopeShowsFailure(client, baseUrl) {
  const input = successfulAttemptCaseByAct(3).body.input;
  await navigate(client, `${baseUrl}/act/3`);
  await checkValues(client, "scope", ["global"]);
  await checkValues(client, "removedRuleIds", ["keep-user-changes"]);
  await fillTextarea(client, "document", input.document);
  await submitForm(client);
  await expectResultIncludes(client, "80점", "점수가 부족합니다.");
}

async function verifyAct4StarterTemplateShowsFailure(client, baseUrl) {
  await navigate(client, `${baseUrl}/act/4`);
  const starterTemplate = await client.evaluate(`
    document.querySelector('.template-block pre')?.textContent || ''
  `);
  assert.match(starterTemplate, /name: mini-brainstorming/);
  await fillTextarea(client, "document", starterTemplate);
  await submitForm(client);
  await expectResultIncludes(client, "89점", "점수가 부족합니다.");
  await waitForText(client, "placeholder");
}

async function verifyAct5SingleAgentShowsFailure(client, baseUrl) {
  await navigate(client, `${baseUrl}/act/5`);
  await fillTextarea(client, "record", `
Attempt 1
Coordinator:
- I gave one agent every responsibility: research, implementation, source judgment, review, and final report.
- The same agent edited files, decided whether sources were reliable, ran no separate reviewer step, and wrote all outputs together.
Result:
- One person handled everything without separated role outputs.
`);
  await submitForm(client);
  await expectResultIncludes(client, "10점", "점수가 부족합니다.");
}

async function verifyAct6MissingLoopGuardShowsFailure(client, baseUrl) {
  const selectedIds = successfulAttemptCaseByAct(6).body.input.selectedIds.filter((id) => id !== "stop-loop-guard");
  await navigate(client, `${baseUrl}/act/6`);
  await checkValues(client, "selectedIds", selectedIds);
  await submitForm(client);
  await expectResultIncludes(client, "85점", "점수가 부족합니다.");
  const unlockVisible = await client.evaluate("document.body.innerText.includes('프롬프트 복사')");
  assert.equal(unlockVisible, false, "Act 6 must not show the unlock prompt copy button before loop guard passes");
}

async function completeAct1(client, baseUrl) {
  await navigate(client, `${baseUrl}/act/1`);
  await clickButton(client, "문제 시작");
  const answers = successfulAttemptCaseByAct(1).body.input.answers;
  for (const questionId of ["q1", "q2", "q3"]) {
    for (let page = 0; page < 4; page += 1) {
      await checkValues(client, questionId, answers[questionId]);
      await clickFirstButton(client, ["다음 선택지", "문제 확인"]);
      await delay(150);
      const resultVisible = await client.evaluate("Boolean(document.querySelector('#result-dialog[role=\"dialog\"]'))");
      if (resultVisible) break;
    }
    if (questionId !== "q3") {
      await waitFor(client, "Boolean(document.querySelector('#result-dialog[role=\"dialog\"]'))");
      await clickButton(client, "다음 문제로");
      await waitForText(client, "문제");
    }
  }
  await expectScore(client, "100점");
}

async function completeAct2(client, baseUrl) {
  await navigate(client, `${baseUrl}/act/2`);
  await clickButton(client, "다음");
  await clickButton(client, "다음");
  await waitFor(client, "document.querySelector('textarea[name=\"prompt\"]')");
  await fillTextarea(client, "prompt", successfulAttemptCaseByAct(2).body.input.prompt);
  await submitForm(client);
  await expectScore(client, "100점");
}

async function completeAct3(client, baseUrl) {
  await navigate(client, `${baseUrl}/act/3`);
  const input = successfulAttemptCaseByAct(3).body.input;
  await waitForText(client, "CLAUDE.md 적용 범위 선택");
  await checkValues(client, "scope", [input.scope]);
  await checkValues(client, "removedRuleIds", input.removedRuleIds);
  await fillTextarea(client, "document", input.document);
  await submitForm(client);
  await expectScore(client, "100점");
}

async function completeAct4(client, baseUrl) {
  await navigate(client, `${baseUrl}/act/4`);
  await fillTextarea(client, "document", successfulAttemptCaseByAct(4).body.input.document);
  await submitForm(client);
  await expectScore(client, "100점");
}

async function completeAct5(client, baseUrl) {
  await navigate(client, `${baseUrl}/act/5`);
  await waitForText(client, "역할별 프롬프트 템플릿");
  await waitForText(client, "Skill 배정과 Tool 권한 안내");
  await waitForText(client, "실행 기록 템플릿");
  await fillTextarea(client, "record", successfulAttemptCaseByAct(5).body.input.record);
  await submitForm(client);
  await expectScore(client, "100점");
}

async function completeAct6(client, baseUrl) {
  await navigate(client, `${baseUrl}/act/6`);
  await checkValues(client, "selectedIds", successfulAttemptCaseByAct(6).body.input.selectedIds);
  await submitForm(client);
  await expectScore(client, "100점");
  await waitForText(client, "프롬프트 복사");
}

async function main() {
  const browser = await launchBrowser();
  const delayedServer = createServer({
    judgeProvider: {
      name: "delayed-test-provider",
      async evaluate() {
        await delay(1200);
        return null;
      },
    },
  });
  const delayedBaseUrl = await listen(delayedServer);
  try {
    await verifyAct2PendingState(browser.client, delayedBaseUrl);
    console.log("PASS act2 pending state shows progress while provider is running");
  } finally {
    await close(delayedServer);
  }

  const server = createServer();
  const baseUrl = await listen(server);
  try {
    const flows = [
      ["act1", completeAct1],
      ["act2", completeAct2],
      ["act3", completeAct3],
      ["act4", completeAct4],
      ["act5", completeAct5],
      ["act6", completeAct6],
    ];
    await verifyAct1RejectsRandomChoice(browser.client, baseUrl);
    console.log("PASS act1 rejects random/noise-only choice");
    await verifyAct1QuestionScoreReflectsSelections(browser.client, baseUrl);
    console.log("PASS act1 question score reflects selected choices");
    await verifyGlossaryTooltip(browser.client, baseUrl);
    console.log("PASS glossary tooltips render with custom popover");
    await verifyAct2VaguePromptShowsFailure(browser.client, baseUrl);
    console.log("PASS act2 vague prompt shows locked failure result");
    await verifyAct3WrongScopeShowsFailure(browser.client, baseUrl);
    console.log("PASS act3 wrong scope shows locked failure result");
    await verifyAct4StarterTemplateShowsFailure(browser.client, baseUrl);
    console.log("PASS act4 starter template shows locked failure result");
    await verifyAct5SingleAgentShowsFailure(browser.client, baseUrl);
    console.log("PASS act5 single-agent record shows locked failure result");
    await verifyAct6MissingLoopGuardShowsFailure(browser.client, baseUrl);
    console.log("PASS act6 missing loop guard hides unlock artifact");
    for (const [name, flow] of flows) {
      await flow(browser.client, baseUrl);
      console.log(`PASS ${name} UI flow submits and renders 100점`);
    }
    console.log("PASS practice UI flow QA");
  } finally {
    await cleanupBrowser(browser);
    await close(server);
  }
}

main().catch((error) => {
  console.error(error && error.stack ? error.stack : String(error));
  process.exitCode = 1;
});
