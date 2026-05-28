(function () {
  const ACT1_CHOICES_PER_PAGE = 4;
  const PROMPT_BRIEF_LAST_PAGE = 2;
  const CONTEXT_LAST_PAGE = 5;
  const CONTEXT_PAGE_ITEM_IDS = [
    ["current-audience", "stale-purple-gradient", "required-copy"],
    ["hook-details", "final-title", "old-title"],
    ["mobile-cta-visible", "brand-colors", "unconfirmed-discount", "desktop-three-column"],
    ["no-price", "existing-button-style", "focus-state", "beginner-feedback"],
  ];

  const state = {
    practices: [],
    currentPractice: null,
    attempts: [],
    pendingClientAttemptIds: {},
    promptBriefPageIndex: 0,
    promptDraft: "",
    contextPageIndex: 0,
    contextSelection: new Set(),
    act1Progress: {
      questionIndex: 0,
      choicePageIndex: 0,
      answers: {},
      passed: {},
    },
  };

  const nodes = {
    layout: document.querySelector("#presentation-layout"),
    practiceSlide: document.querySelector("#practice-slide"),
    resultPanel: document.querySelector("#result-panel"),
    sessionId: document.querySelector("#session-id"),
    practiceList: document.querySelector("#practice-list"),
    heading: document.querySelector("#practice-heading"),
    form: document.querySelector("#practice-form"),
    score: document.querySelector("#score-meter"),
    feedback: document.querySelector("#feedback-list"),
    log: document.querySelector("#verification-log"),
  };

  function escapeText(value) {
    return String(value ?? "");
  }

  function createElement(tagName, options = {}) {
    const element = document.createElement(tagName);
    if (options.className) element.className = options.className;
    if (options.text !== undefined) element.textContent = escapeText(options.text);
    if (options.html !== undefined) element.innerHTML = options.html;
    return element;
  }

  async function copyTextToClipboard(text) {
    if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
      await navigator.clipboard.writeText(text);
      return;
    }

    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.top = "-1000px";
    document.body.append(textarea);
    textarea.select();
    document.execCommand("copy");
    textarea.remove();
  }

  async function fetchJson(url, options) {
    const response = await fetch(url, options);
    const body = await response.json();
    if (!response.ok || body.ok === false) {
      const message = body.error ? body.error.message : `HTTP ${response.status}`;
      throw new Error(message);
    }
    return body;
  }

  function stableSessionId() {
    const stored = window.localStorage.getItem("practiceHarnessSessionId");
    if (stored) return stored;
    const created = `learner-${Math.random().toString(36).slice(2, 8)}`;
    window.localStorage.setItem("practiceHarnessSessionId", created);
    return created;
  }

  function createClientAttemptId(practice) {
    if (state.pendingClientAttemptIds[practice.id]) {
      return state.pendingClientAttemptIds[practice.id];
    }

    const randomPart =
      window.crypto && typeof window.crypto.randomUUID === "function"
        ? window.crypto.randomUUID()
        : Math.random().toString(36).slice(2, 10);
    const clientAttemptId = `${practice.id}-${Date.now()}-${randomPart}`;
    state.pendingClientAttemptIds[practice.id] = clientAttemptId;
    return clientAttemptId;
  }

  function clearClientAttemptId(practice) {
    delete state.pendingClientAttemptIds[practice.id];
  }

  function rememberAttemptOnce(attempt) {
    if (!state.attempts.some((item) => item.attemptId === attempt.attemptId)) {
      state.attempts.unshift(attempt);
    }
  }

  function renderPracticeList() {
    if (!nodes.practiceList) return;

    nodes.practiceList.replaceChildren(
      ...state.practices.map((practice) => {
        const item = createElement("li");
        const button = createElement("button", {
          text: `${practice.act}. ${practice.title.replace(/^실습 \d+:\s*/, "")}`,
        });
        button.type = "button";
        button.setAttribute(
          "aria-current",
          state.currentPractice && state.currentPractice.id === practice.id
            ? "true"
            : "false",
        );
        button.addEventListener("click", () => {
          if (state.currentPractice && state.currentPractice.id === practice.id) return;
          loadPractice(practice.id);
        });
        item.append(button);
        return item;
      }),
    );
  }

  function nextPracticeAfter(practice) {
    const currentIndex = state.practices.findIndex((item) => item.id === practice.id);
    if (currentIndex === -1) return null;
    return state.practices[currentIndex + 1] || null;
  }

  function practiceRoutePath(practice) {
    return `/act/${practice.act}`;
  }

  function practiceFromLocation() {
    const actMatch = window.location.pathname.match(/^\/act\/(\d+)$/);
    if (actMatch) {
      const act = Number(actMatch[1]);
      return state.practices.find((practice) => practice.act === act) || null;
    }

    const practiceMatch = window.location.pathname.match(/^\/practices\/([a-z0-9-]+)$/i);
    if (practiceMatch) {
      return state.practices.find((practice) => practice.id === practiceMatch[1]) || null;
    }

    return null;
  }

  function showResultSlide() {
    nodes.resultPanel.hidden = false;
    nodes.practiceSlide.hidden = true;
  }

  function showPracticeSlide() {
    nodes.resultPanel.hidden = true;
    nodes.practiceSlide.hidden = false;
  }

  function resetCurrentPractice() {
    const practice = state.currentPractice;
    if (!practice) return;
    if (practice.type === "multi-question-choice") resetCurrentChoiceQuestion(practice);
    if (practice.type === "prompt-brief") state.promptDraft = "";
    if (practice.type === "context-selection") {
      state.contextPageIndex = 0;
      state.contextSelection = new Set();
    }
    renderForm(practice);
    nodes.form.reset();
    renderEmptyResult();
  }

  function createPracticeResetButton(practice) {
    const reset = createElement("button", { className: "secondary-button", text: "초기화" });
    reset.type = "button";
    reset.addEventListener("click", () => {
      if (practice.type === "multi-question-choice") {
        resetAct1Progress();
        renderForm(practice);
      }
      if (practice.type === "prompt-brief") state.promptDraft = "";
      if (practice.type === "context-selection") {
        state.contextPageIndex = 0;
        state.contextSelection = new Set();
      }
      nodes.form.reset();
      renderEmptyResult();
    });
    return reset;
  }

  function renderResultActions({ canGoNext = false } = {}) {
    const actions = createElement("div", { className: "result-actions" });
    const retry = createElement("button", {
      className: "secondary-button",
      text: "다시하기",
    });
    retry.type = "button";
    retry.addEventListener("click", resetCurrentPractice);
    actions.append(retry);

    const nextPractice = state.currentPractice
      ? nextPracticeAfter(state.currentPractice)
      : null;
    if (canGoNext && nextPractice) {
      const next = createElement("button", {
        className: "primary-button",
        text: "다음으로",
      });
      next.type = "button";
      next.addEventListener("click", () => {
        loadPractice(nextPractice.id);
      });
      actions.append(next);
    }

    return actions;
  }

  function renderHeading(practice) {
    nodes.heading.replaceChildren(
      createElement("p", { text: `Act ${practice.act} · ${practice.type}` }),
      createElement("h2", { text: practice.title }),
      createElement("p", {
        text: `통과 기준 ${practice.unlockThreshold}/${practice.maxScore}. 결과는 점수, 빠진 항목, 검증 로그로 바로 확인합니다.`,
      }),
    );
  }

  function checkbox({ name, id, label, kind, checked = false }) {
    const row = createElement("label", { className: "choice-row" });
    const input = document.createElement("input");
    input.type = "checkbox";
    input.name = name;
    input.value = id;
    input.checked = checked;
    row.append(input, createElement("span", { text: label }));
    if (kind) row.append(createElement("span", { className: "kind", text: kind }));
    else row.append(createElement("span"));
    return row;
  }

  function renderLearningGuide(practice) {
    if (!practice.learning) return [];

    const guide = createElement("section", { className: "learning-guide" });
    guide.append(
      createElement("p", { className: "step-label", text: "오늘 할 일" }),
      createElement("h3", { text: practice.learning.goal }),
      createElement("p", { text: practice.learning.task }),
    );

    if (practice.learning.why) {
      guide.append(createElement("p", { className: "why-note", text: practice.learning.why }));
    }

    if (practice.learning.beforeExample) {
      const example = createElement("div", { className: "example-block" });
      example.append(
        createElement("strong", { text: "Before" }),
        createElement("code", { text: practice.learning.beforeExample }),
      );
      guide.append(example);
    }

    if (Array.isArray(practice.learning.hints) && practice.learning.hints.length > 0) {
      const hintList = createElement("ul", { className: "hint-list" });
      for (const hint of practice.learning.hints) {
        hintList.append(createElement("li", { text: hint }));
      }
      guide.append(createElement("h4", { text: "힌트" }), hintList);
    }

    if (Array.isArray(practice.learning.ingredients)) {
      guide.append(
        renderPillGrid(
          "좋은 업무 지시 6칸",
          practice.learning.ingredients.map((item) => ({
            label: item.label,
            description: item.description,
          })),
        ),
      );
    }

    if (Array.isArray(practice.learning.kindLegend)) {
      guide.append(
        renderPillGrid(
          "자료 종류",
          practice.learning.kindLegend.map((item) => ({
            label: item.label,
            description: item.description,
          })),
        ),
      );
    }

    if (Array.isArray(practice.learning.toolPermissions)) {
      const permissionList = createElement("ul", { className: "hint-list" });
      for (const permission of practice.learning.toolPermissions) {
        permissionList.append(createElement("li", { text: permission }));
      }
      guide.append(createElement("h4", { text: "역할별 Tool 권한" }), permissionList);
    }

    if (practice.learning.runbookTemplate) {
      guide.append(
        renderTemplateBlock({
          title: "실행 기록 템플릿",
          body: practice.learning.runbookTemplate,
          targetFieldName: "record",
        }),
      );
    }

    if (practice.learning.starterTemplate) {
      guide.append(
        renderTemplateBlock({
          title: "시작 템플릿",
          body: practice.learning.starterTemplate,
        }),
      );
    }

    if (Array.isArray(practice.learning.retryPrompts)) {
      const retryList = createElement("ul", { className: "hint-list" });
      for (const retryPrompt of practice.learning.retryPrompts) {
        retryList.append(createElement("li", { text: retryPrompt }));
      }
      guide.append(createElement("h4", { text: "재시도 기준" }), retryList);
    }

    if (practice.learning.unlockIntro) {
      guide.append(createElement("p", { className: "unlock-note", text: practice.learning.unlockIntro }));
    }

    if (practice.learning.bridge) {
      guide.append(createElement("p", { className: "bridge-note", text: practice.learning.bridge }));
    }

    return [guide].concat(renderRoleTemplates(practice));
  }

  function renderPillGrid(title, items) {
    const wrapper = createElement("div", { className: "pill-section" });
    wrapper.append(createElement("h4", { text: title }));
    const grid = createElement("div", { className: "pill-grid" });
    for (const item of items) {
      const pill = createElement("div", { className: "pill-card" });
      pill.append(
        createElement("strong", { text: item.label }),
        createElement("span", { text: item.description }),
      );
      grid.append(pill);
    }
    wrapper.append(grid);
    return wrapper;
  }

  function renderRoleTemplates(practice) {
    if (!practice.learning || !Array.isArray(practice.learning.roleTemplates)) return [];

    const section = createElement("section", { className: "section-block template-section" });
    section.append(
      createElement("h3", { text: "로컬 AI 도구에 붙여 넣을 역할 템플릿" }),
      createElement("p", { text: "각 역할은 자기 책임만 맡습니다. 복사해서 사용하는 도구의 role prompt 또는 새 대화 첫 메시지에 붙여 넣으세요." }),
    );
    for (const template of practice.learning.roleTemplates) {
      section.append(
        renderTemplateBlock({
          title: template.title,
          body: template.body,
        }),
      );
    }
    return [section];
  }

  function renderTemplateBlock({ title, body, targetFieldName, copyLabel = "복사" }) {
    const block = createElement("div", { className: "template-block" });
    const header = createElement("div", { className: "template-header" });
    header.append(createElement("strong", { text: title }));
    const copy = createElement("button", { className: "secondary-button small-button", text: copyLabel });
    copy.type = "button";
    copy.addEventListener("click", async () => {
      const originalLabel = copyLabel;
      if (targetFieldName) {
        const field = nodes.form.querySelector(`[name="${targetFieldName}"]`);
        if (field) field.value = body;
      }
      if (navigator.clipboard) await navigator.clipboard.writeText(body);
      copy.textContent = "복사됨";
      setTimeout(() => {
        copy.textContent = originalLabel;
      }, 1000);
    });
    header.append(copy);
    block.append(header, createElement("pre", { text: body }));
    return block;
  }

  function resetAct1Progress() {
    state.act1Progress = {
      questionIndex: 0,
      choicePageIndex: 0,
      answers: {},
      passed: {},
    };
  }

  function resetCurrentChoiceQuestion(practice) {
    const question = currentAct1Question(practice);
    if (!question) return;
    state.act1Progress.choicePageIndex = 0;
    delete state.act1Progress.answers[question.id];
    delete state.act1Progress.passed[question.id];
  }

  function advanceCurrentChoiceQuestion(practice) {
    state.act1Progress.questionIndex += 1;
    state.act1Progress.choicePageIndex = 0;
    renderForm(practice);
    renderEmptyResult();
  }

  function currentAct1Question(practice) {
    return practice.questions[state.act1Progress.questionIndex];
  }

  function currentAct1Choices(question) {
    const start = state.act1Progress.choicePageIndex * ACT1_CHOICES_PER_PAGE;
    const end = start + ACT1_CHOICES_PER_PAGE;
    return question.choices.slice(start, end);
  }

  function saveCurrentAct1Page(question) {
    const saved = new Set(state.act1Progress.answers[question.id] || []);
    for (const choice of currentAct1Choices(question)) {
      const input = nodes.form.querySelector(`input[name="${question.id}"][value="${choice.id}"]`);
      if (input && input.checked) saved.add(choice.id);
      else saved.delete(choice.id);
    }
    state.act1Progress.answers[question.id] = Array.from(saved);
  }

  function evaluateChoiceQuestion(question, selectedIds) {
    const selected = new Set(selectedIds);
    const missingRequired = question.choices.filter(
      (choice) => choice.kind === "required" && !selected.has(choice.id),
    );
    const blockingChoices = question.choices.filter(
      (choice) =>
        selected.has(choice.id) &&
        (choice.kind === "noise" || choice.kind === "pollution"),
    );

    return {
      passed: missingRequired.length === 0 && blockingChoices.length === 0,
      feedback: missingRequired
        .map((choice) => choice.missingFeedback)
        .concat(blockingChoices.map((choice) => choice.feedback)),
    };
  }

  function renderQuestionResult({ questionNumber, totalQuestions, evaluation }) {
    showResultSlide();
    nodes.score.className = `score-meter ${evaluation.passed ? "pass" : "fail"}`;
    nodes.score.replaceChildren(
      createElement("strong", {
        text: evaluation.passed ? "통과" : "다시",
      }),
      createElement("span", {
        text: `${questionNumber}/${totalQuestions}번 문제 ${
          evaluation.passed ? "통과했습니다." : "확인이 필요합니다."
        }`,
      }),
    );

    const feedbackItems = evaluation.feedback.length
      ? evaluation.feedback
      : ["이 문제에서 빠진 항목이 없습니다."];
    nodes.feedback.replaceChildren(
      ...feedbackItems.map((message) =>
        createElement("div", { className: "feedback-item", text: message }),
      ),
    );
    nodes.log.replaceChildren(
      renderQuestionResultActions({
        canGoNext: questionNumber >= totalQuestions,
        canGoNextQuestion: questionNumber < totalQuestions,
        practice: state.currentPractice,
      }),
    );
  }

  function renderQuestionResultActions({ canGoNext = false, canGoNextQuestion = false, practice = null } = {}) {
    const actions = renderResultActions({
      canGoNext,
    });
    if (canGoNextQuestion && practice) {
      const nextQuestion = createElement("button", {
        className: "primary-button",
        text: "다음 문제 풀기",
      });
      nextQuestion.type = "button";
      nextQuestion.addEventListener("click", () => advanceCurrentChoiceQuestion(practice));
      actions.append(nextQuestion);
    }
    return actions;
  }

  function renderProgressiveChoicePractice(practice) {
    const question = currentAct1Question(practice);
    const currentChoices = currentAct1Choices(question);
    const questionNumber = state.act1Progress.questionIndex + 1;
    const pageNumber = state.act1Progress.choicePageIndex + 1;
    const pageCount = Math.ceil(question.choices.length / ACT1_CHOICES_PER_PAGE);
    const section = createElement("section", { className: "section-block" });
    section.append(
      createElement("p", {
        className: "step-label",
        text: `문제 ${questionNumber}/${practice.questions.length} · 선택지 묶음 ${pageNumber}/${pageCount}`,
      }),
      createElement("h3", { text: question.title }),
      createElement("p", { text: question.prompt }),
    );

    const pager = createElement("div", { className: "act1-choice-pager" });
    const card = createElement("div", { className: "act1-choice-card" });
    const savedAnswer = state.act1Progress.answers[question.id] || [];
    for (const choice of currentChoices) {
      card.append(
        checkbox({
          name: question.id,
          id: choice.id,
          label: choice.label,
          kind: choice.kind,
          checked: savedAnswer.includes(choice.id),
        }),
      );
    }

    const controls = createElement("div", { className: "act1-pager-controls" });
    const isLastChoicePage = state.act1Progress.choicePageIndex === pageCount - 1;
    const previous = createElement("button", {
      className: "secondary-button",
      text: "이전 선택지",
    });
    previous.type = "button";
    previous.disabled = state.act1Progress.choicePageIndex === 0;
    previous.addEventListener("click", () => {
      saveCurrentAct1Page(question);
      state.act1Progress.choicePageIndex = Math.max(0, state.act1Progress.choicePageIndex - 1);
      renderForm(practice);
      showPracticeSlide();
    });

    const next = createElement("button", {
      className: "primary-button",
      text: isLastChoicePage ? "문제 확인" : "다음 선택지",
    });
    next.type = isLastChoicePage ? "submit" : "button";
    next.addEventListener("click", () => {
      if (isLastChoicePage) return;
      saveCurrentAct1Page(question);
      state.act1Progress.choicePageIndex = Math.min(pageCount - 1, state.act1Progress.choicePageIndex + 1);
      renderForm(practice);
      showPracticeSlide();
    });

    const reset = createPracticeResetButton(practice);
    controls.append(previous, reset, next);
    pager.append(card, controls);
    section.append(pager);
    return [section];
  }

  function renderChoiceQuestions(practice) {
    return practice.questions.map((question) => {
      const section = createElement("section", { className: "section-block" });
      section.append(
        createElement("h3", { text: question.title }),
        createElement("p", { text: question.prompt }),
      );
      const options = createElement("div", { className: "option-list" });
      for (const choice of question.choices) {
        options.append(
          checkbox({
            name: question.id,
            id: choice.id,
            label: choice.label,
            kind: choice.kind,
          }),
        );
      }
      section.append(options);
      return section;
    });
  }

  function renderItemSelection(practice) {
    const section = createElement("section", { className: "section-block" });
    section.append(
      createElement("h3", { text: "작업대에 올릴 맥락을 고르세요" }),
      createElement("p", { text: "필요한 정보는 고르고, 오래되었거나 범위를 벗어난 정보는 빼세요." }),
    );
    const options = createElement("div", { className: "option-list" });
    for (const item of practice.items) {
      options.append(
        checkbox({
          name: "selectedIds",
          id: item.id,
          label: item.label,
          kind: item.kind,
        }),
      );
    }
    section.append(options);
    return [section];
  }

  function contextPageTitle() {
    return ["작업대 이해", "자료 묶음 1", "자료 묶음 2", "자료 묶음 3", "자료 묶음 4", "선택 확인"][
      state.contextPageIndex
    ];
  }

  function contextItemsForPage(practice) {
    const pageItemIds = CONTEXT_PAGE_ITEM_IDS[state.contextPageIndex - 1] || [];
    return pageItemIds
      .map((itemId) => practice.items.find((item) => item.id === itemId))
      .filter(Boolean);
  }

  function saveCurrentContextPage(practice) {
    for (const item of contextItemsForPage(practice)) {
      const input = nodes.form.querySelector(`input[name="selectedIds"][value="${item.id}"]`);
      if (input && input.checked) state.contextSelection.add(item.id);
      else state.contextSelection.delete(item.id);
    }
  }

  function moveContextPage(index, practice) {
    saveCurrentContextPage(practice);
    state.contextPageIndex = Math.max(0, Math.min(CONTEXT_LAST_PAGE, index));
    renderForm(practice);
    showPracticeSlide();
  }

  function renderContextControls(practice) {
    const controls = createElement("div", { className: "context-step-controls" });
    const previous = promptStepButton({
      text: "이전",
      disabled: state.contextPageIndex === 0,
      onClick: () => moveContextPage(state.contextPageIndex - 1, practice),
    });
    const reset = createPracticeResetButton(practice);
    const next = promptStepButton({
      text: "다음",
      primary: true,
      onClick: () => moveContextPage(state.contextPageIndex + 1, practice),
    });
    controls.append(previous, reset, next);
    return controls;
  }

  function renderContextSubmitControls(practice) {
    const controls = createElement("div", { className: "context-step-controls" });
    const previous = promptStepButton({
      text: "이전",
      onClick: () => moveContextPage(state.contextPageIndex - 1, practice),
    });
    const reset = createPracticeResetButton(practice);
    const submit = createElement("button", {
      className: "primary-button",
      text: "실행",
    });
    submit.type = "submit";
    controls.append(previous, reset, submit);
    return controls;
  }

  function renderContextSummary(practice) {
    const summary = createElement("div", { className: "context-summary" });
    const selected = practice.items.filter((item) => state.contextSelection.has(item.id));
    const selectedList = createElement("ul", { className: "hint-list compact-list" });
    for (const item of selected) {
      selectedList.append(createElement("li", { text: `${item.kind}: ${item.label}` }));
    }
    summary.append(
      createElement("h4", { text: `선택한 자료 ${selected.length}개` }),
      selected.length > 0
        ? selectedList
        : createElement("p", { text: "아직 선택한 자료가 없습니다." }),
    );
    return summary;
  }

  function renderPagedContextSelection(practice) {
    const learning = practice.learning || {};
    const section = createElement("section", {
      className: "section-block context-step-slide",
    });
    section.append(
      createElement("p", {
        className: "step-label",
        text: `단계 ${state.contextPageIndex + 1}/6 · ${contextPageTitle()}`,
      }),
    );

    if (state.contextPageIndex === 0) {
      section.append(
        createElement("h3", { text: "김아이의 작업대에는 지금 쓸 자료만 올립니다." }),
        createElement("p", { text: learning.goal }),
        createElement("p", { className: "why-note", text: learning.why }),
      );
      const hintList = createElement("ul", { className: "hint-list compact-list" });
      for (const hint of learning.hints || []) hintList.append(createElement("li", { text: hint }));
      section.append(createElement("h4", { text: "고르는 기준" }), hintList);
      if (Array.isArray(learning.kindLegend)) {
        section.append(
          renderPillGrid(
            "자료 종류",
            learning.kindLegend.map((item) => ({
              label: item.label,
              description: item.description,
            })),
          ),
        );
      }
    }

    if (state.contextPageIndex >= 1 && state.contextPageIndex <= 4) {
      section.append(
        createElement("h3", {
          text: "강의 신청 카드 컴포넌트에 필요한 자료를 고르세요.",
        }),
        createElement("p", {
          text: "필요한 자료와 빼야 할 자료가 섞여 있습니다. Act 2에서 다시 만들 카드에 도움이 되는 자료만 고르세요.",
        }),
      );
      const options = createElement("div", { className: "option-list context-option-list" });
      for (const item of contextItemsForPage(practice)) {
        options.append(
          checkbox({
            name: "selectedIds",
            id: item.id,
            label: item.label,
            kind: item.kind,
            checked: state.contextSelection.has(item.id),
          }),
        );
      }
      section.append(options);
    }

    if (state.contextPageIndex === 5) {
      section.append(
        createElement("h3", { text: "작업대에 올릴 자료를 확인하세요." }),
        createElement("p", {
          text: "필수와 도움 자료만 남기고, 오염과 범위 밖 자료가 섞이지 않았는지 확인한 뒤 실행합니다.",
        }),
        renderContextSummary(practice),
        renderContextSubmitControls(practice),
      );
    }

    if (state.contextPageIndex < CONTEXT_LAST_PAGE) {
      section.append(renderContextControls(practice));
    }
    return [section];
  }

  function renderTextPractice(practice, fieldName) {
    const section = createElement("section", { className: "section-block" });
    section.append(
      createElement("h3", {
        text:
          fieldName === "prompt"
            ? "김아이에게 보낼 지시문"
            : "Skill 문서 초안",
      }),
      createElement("p", {
        text:
          fieldName === "prompt"
            ? "목표, 맥락, 제약, 완료 기준, 출력 형식을 한 번에 확인할 수 있게 적으세요."
            : "frontmatter, Steps, Output Format이 보이도록 작성하세요.",
      }),
    );
    const label = createElement("label", { className: "field-label", text: "입력" });
    label.setAttribute("for", fieldName);
    const textarea = document.createElement("textarea");
    textarea.id = fieldName;
    textarea.name = fieldName;
    section.append(label, textarea);
    return [section];
  }

  function renderClaudeMemoryPractice(practice) {
    const learning = practice.learning || {};
    const source = createElement("section", { className: "section-block template-section" });
    source.append(
      createElement("p", { className: "step-label", text: "설치용 원본 템플릿" }),
      createElement("h3", { text: "그대로 복사하지 말고 핵심 규칙만 추리세요." }),
      createElement("p", {
        text: "아래 원본은 초보자 설치용 자료입니다. 최종 CLAUDE.md에는 항상 켜둘 짧은 운영 규칙만 남기고, 긴 예시와 체크리스트는 필요할 때 reference로 분리합니다.",
      }),
    );
    source.append(
      renderTemplateBlock({
        title: "Beginner Claude Code Instructions",
        body: learning.sourceTemplate || "",
      }),
    );

    const editor = createElement("section", { className: "section-block claude-memory-editor" });
    editor.append(
      createElement("p", { className: "step-label", text: "최종 CLAUDE.md" }),
      createElement("h3", { text: "프로젝트 루트에 남길 CLAUDE.md 초안" }),
      createElement("p", {
        text: "프로젝트 목표, 작업 전 확인, 사용자 변경 보존, 구현 원칙, 테스트와 확인, QA/보안 리뷰, 프로젝트 참조를 중심으로 200줄 이하로 작성하세요.",
      }),
    );
    const label = createElement("label", { className: "field-label", text: "CLAUDE.md 입력" });
    label.setAttribute("for", "document");
    const textarea = document.createElement("textarea");
    textarea.id = "document";
    textarea.name = "document";
    textarea.placeholder = [
      "# CLAUDE.md",
      "",
      "## 프로젝트 목표",
      "-",
      "",
      "## 작업 전 확인",
      "-",
      "",
      "## 사용자 변경 보존",
      "-",
    ].join("\n");
    editor.append(label, textarea);
    return [source, editor];
  }

  function savePromptDraft() {
    const field = nodes.form.querySelector('[name="prompt"]');
    if (field) state.promptDraft = field.value;
  }

  function promptStepButton({ text, disabled = false, onClick, primary = false }) {
    const button = createElement("button", {
      className: primary ? "primary-button" : "secondary-button",
      text,
    });
    button.type = "button";
    button.disabled = disabled;
    if (onClick) button.addEventListener("click", onClick);
    return button;
  }

  function movePromptBriefPage(index, practice) {
    savePromptDraft();
    state.promptBriefPageIndex = Math.max(0, Math.min(PROMPT_BRIEF_LAST_PAGE, index));
    renderForm(practice);
    showPracticeSlide();
  }

  function renderPromptStepControls(practice) {
    const controls = createElement("div", { className: "prompt-step-controls" });
    const previous = promptStepButton({
      text: "이전",
      disabled: state.promptBriefPageIndex === 0,
      onClick: () => movePromptBriefPage(state.promptBriefPageIndex - 1, practice),
    });
    const reset = createPracticeResetButton(practice);
    if (state.promptBriefPageIndex < PROMPT_BRIEF_LAST_PAGE) {
      const next = promptStepButton({
        text: "다음",
        primary: true,
        onClick: () => movePromptBriefPage(state.promptBriefPageIndex + 1, practice),
      });
      controls.append(previous, reset, next);
      return controls;
    }
    controls.append(previous, reset);
    return controls;
  }

  function renderPromptSubmitControls(practice) {
    const controls = createElement("div", { className: "prompt-step-controls" });
    const previous = promptStepButton({
      text: "이전",
      onClick: () => movePromptBriefPage(state.promptBriefPageIndex - 1, practice),
    });
    const reset = createPracticeResetButton(practice);
    const submit = createElement("button", {
      className: "primary-button",
      text: "실행",
    });
    submit.type = "submit";
    controls.append(previous, reset, submit);
    return controls;
  }

  function renderPromptBriefPractice(practice) {
    const learning = practice.learning;
    const section = createElement("section", { className: "section-block prompt-step-slide" });
    const titles = ["상황 이해", "6칸 기준", "지시문 작성"];
    section.append(
      createElement("p", {
        className: "step-label",
        text: `단계 ${state.promptBriefPageIndex + 1}/3 · ${titles[state.promptBriefPageIndex]}`,
      }),
    );

    if (state.promptBriefPageIndex === 0) {
      section.append(
        createElement("h3", { text: "Act 1의 실패 요청을 업무 지시서로 바꿉니다." }),
        createElement("p", { text: learning.goal }),
        createElement("p", { className: "why-note", text: learning.why }),
      );
      const example = createElement("div", { className: "example-block prompt-before" });
      example.append(
        createElement("strong", { text: "Before" }),
        createElement("code", { text: learning.beforeExample }),
      );
      section.append(example);
      const hintList = createElement("ul", { className: "hint-list compact-list" });
      for (const hint of learning.hints || []) hintList.append(createElement("li", { text: hint }));
      section.append(createElement("h4", { text: "이번 단계에서 볼 것" }), hintList);
    }

    if (state.promptBriefPageIndex === 1) {
      section.append(
        createElement("h3", { text: "좋은 업무 지시는 6칸이 빠지지 않습니다." }),
        createElement("p", { text: "각 칸을 한 문장씩 채운 뒤 마지막 단계에서 하나의 지시문으로 합칩니다." }),
        renderPillGrid("좋은 업무 지시 6칸", learning.ingredients || []),
      );
    }

    if (state.promptBriefPageIndex === 2) {
      section.append(
        createElement("h3", { text: "김아이에게 보낼 지시문을 작성하세요." }),
        createElement("p", { text: learning.task }),
      );
      const label = createElement("label", { className: "field-label", text: "입력" });
      label.setAttribute("for", "prompt");
      const textarea = document.createElement("textarea");
      textarea.id = "prompt";
      textarea.name = "prompt";
      textarea.value = state.promptDraft;
      textarea.placeholder = "목표, 대상/사용 상황, 반응형 조건, 제약 조건, 완료 기준, 출력 형식을 포함해 작성하세요.";
      textarea.addEventListener("input", () => {
        state.promptDraft = textarea.value;
      });
      const retryList = createElement("ul", { className: "hint-list compact-list" });
      for (const retryPrompt of learning.retryPrompts || []) {
        retryList.append(createElement("li", { text: retryPrompt }));
      }
      section.append(
        label,
        textarea,
        createElement("h4", { text: "재시도 기준" }),
        retryList,
        renderPromptSubmitControls(practice),
      );
    }

    if (state.promptBriefPageIndex < PROMPT_BRIEF_LAST_PAGE) {
      section.append(renderPromptStepControls(practice));
    }
    return [section];
  }

  function renderRunbook(practice) {
    const teamPrompt = createElement("section", { className: "section-block" });
    teamPrompt.append(
      createElement("h3", { text: "에이전트 팀 프롬프트" }),
      createElement("p", {
        text: "이 실습은 웹 점수 체크가 아니라 로컬 AI 도구에 붙여 넣어 실행하는 연습입니다.",
      }),
    );
    if (practice.learning && practice.learning.teamPrompt) {
      teamPrompt.append(
        renderTemplateBlock({
          title: "한 번에 복사",
          body: practice.learning.teamPrompt,
          targetFieldName: "record",
          copyLabel: "팀 프롬프트 복사",
        }),
      );
    }

    const record = createElement("section", { className: "section-block" });
    record.append(
      createElement("h3", { text: "로컬 실행 기록" }),
      createElement("p", {
        text: "복사한 팀 프롬프트를 실행한 뒤 나온 결과나 바꿔 본 점을 짧게 붙여 넣으세요.",
      }),
    );
    const textarea = document.createElement("textarea");
    textarea.name = "record";
    textarea.id = "record";
    record.append(textarea);
    return [teamPrompt, record];
  }

  function renderChecklistUnlock(practice) {
    return practice.groups.map((group) => {
      const section = createElement("section", { className: "section-block" });
      section.append(createElement("h3", { text: group.title }));
      const options = createElement("div", { className: "option-list" });
      for (const item of group.items) {
        options.append(
          checkbox({
            name: "selectedIds",
            id: item.id,
            label: item.label,
            kind: item.blocksUnlock ? "차단" : `${item.points}점`,
          }),
        );
      }
      section.append(options);
      return section;
    });
  }

  function selectedValues(form, name) {
    return Array.from(form.querySelectorAll(`input[name="${name}"]:checked`)).map(
      (input) => input.value,
    );
  }

  function inputFromForm(practice) {
    const form = nodes.form;
    const textValue = (name) => form.querySelector(`[name="${name}"]`).value;
    if (practice.type === "multi-question-choice") {
      const answers = {};
      for (const question of practice.questions) {
        answers[question.id] =
          state.act1Progress.answers[question.id] || selectedValues(form, question.id);
      }
      return { answers };
    }
    if (practice.type === "prompt-brief") {
      return { prompt: textValue("prompt") };
    }
    if (practice.type === "context-selection") {
      return { selectedIds: Array.from(state.contextSelection) };
    }
    if (practice.type === "claude-memory") {
      return { document: textValue("document") };
    }
    if (practice.type === "skill-document") {
      return { document: textValue("document") };
    }
    if (practice.type === "local-runbook") {
      return {
        record: textValue("record"),
      };
    }
    if (practice.type === "checklist-unlock") {
      return { selectedIds: selectedValues(form, "selectedIds") };
    }
    return {};
  }

  function renderForm(practice) {
    nodes.form.className = `practice-form practice-form-${practice.type}`;
    let sections =
      practice.type === "prompt-brief" || practice.type === "context-selection"
        ? []
        : renderLearningGuide(practice);
    if (practice.type === "multi-question-choice") {
      sections = sections.concat(renderProgressiveChoicePractice(practice));
    }
    if (practice.type === "prompt-brief") sections = sections.concat(renderPromptBriefPractice(practice));
    if (practice.type === "context-selection") sections = sections.concat(renderPagedContextSelection(practice));
    if (practice.type === "claude-memory") sections = sections.concat(renderClaudeMemoryPractice(practice));
    if (practice.type === "skill-document") sections = sections.concat(renderTextPractice(practice, "document"));
    if (practice.type === "local-runbook") sections = sections.concat(renderRunbook(practice));
    if (practice.type === "checklist-unlock") sections = sections.concat(renderChecklistUnlock(practice));

    const actions = createElement("div", { className: "actions" });
    const submit = createElement("button", {
      className: "primary-button",
      text:
        practice.type === "multi-question-choice"
          ? "문제 확인"
          : "실행",
    });
    submit.type = "submit";
    const reset = createPracticeResetButton(practice);
    const shouldShowSubmit =
      practice.type !== "prompt-brief" &&
      practice.type !== "context-selection" &&
      practice.type !== "multi-question-choice";
    if (shouldShowSubmit) actions.append(submit);
    if (
      practice.type !== "prompt-brief" &&
      practice.type !== "context-selection" &&
      practice.type !== "multi-question-choice"
    ) {
      actions.append(reset);
    }
    if (actions.childElementCount > 0) nodes.form.replaceChildren(...sections, actions);
    else nodes.form.replaceChildren(...sections);
  }

  function feedbackText(item) {
    return (
      item.message ||
      item.feedback ||
      item.label ||
      item.criterionId ||
      item.itemId ||
      JSON.stringify(item)
    );
  }

  function renderListBlock(title, items) {
    if (!Array.isArray(items) || items.length === 0) return null;
    const block = createElement("div", { className: "judge-list-block" });
    const list = createElement("ul", { className: "hint-list compact-list" });
    for (const item of items) list.append(createElement("li", { text: item }));
    block.append(createElement("strong", { text: title }), list);
    return block;
  }

  function renderJudgeResult(attempt) {
    if (attempt.judgeResult) {
      const judge = attempt.judgeResult;
      const panel = createElement("div", { className: "feedback-item judge-result" });
      panel.append(
        createElement("strong", {
          text: `AI 보조 검토 · ${judge.verdict || "review"}`,
        }),
        createElement("p", {
          text: judge.summary || "AI 보조 검토 결과가 도착했습니다.",
        }),
      );
      const strengths = renderListBlock("잘한 점", judge.strengths);
      const risks = renderListBlock("위험", judge.risks);
      const suggestions = renderListBlock("개선 제안", judge.suggestions);
      for (const block of [strengths, risks, suggestions]) {
        if (block) panel.append(block);
      }
      return panel;
    }

    if (Array.isArray(attempt.providerWarnings) && attempt.providerWarnings.length > 0) {
      const warning = attempt.providerWarnings[0];
      return createElement("div", {
        className: "feedback-item judge-warning",
        text: `AI 보조 검토를 사용할 수 없습니다. 기본 채점 결과를 확인하세요. (${warning.provider}: ${warning.message})`,
      });
    }

    return null;
  }

  function renderEmptyResult() {
    showPracticeSlide();
    nodes.score.className = "score-meter";
    nodes.score.replaceChildren(
      createElement("strong", { text: "-" }),
      createElement("span", { text: "아직 제출하지 않았습니다." }),
    );
    nodes.feedback.replaceChildren();
    nodes.log.replaceChildren();
  }

  function renderUnlockArtifact(attempt) {
    const artifact = createElement("div", { className: "feedback-item unlock-artifact" });
    const intro =
      state.currentPractice && state.currentPractice.learning
        ? state.currentPractice.learning.unlockIntro || ""
        : "";
    const header = createElement("div", { className: "unlock-artifact-header" });
    const copyButton = createElement("button", {
      className: "secondary-button unlock-copy-button",
      text: "프롬프트 복사",
    });
    copyButton.type = "button";
    copyButton.addEventListener("click", async () => {
      const originalText = copyButton.textContent;
      try {
        await copyTextToClipboard(attempt.unlockArtifact.body);
        copyButton.textContent = "복사됨";
      } catch (error) {
        copyButton.textContent = "복사 실패";
      } finally {
        window.setTimeout(() => {
          copyButton.textContent = originalText;
        }, 1600);
      }
    });
    header.append(createElement("strong", { text: attempt.unlockArtifact.title }), copyButton);

    if (intro) artifact.append(createElement("p", { text: intro }));
    artifact.append(
      header,
      createElement("pre", { text: attempt.unlockArtifact.body }),
    );
    return artifact;
  }

  function renderAttempt(attempt) {
    showResultSlide();
    nodes.score.className = `score-meter ${attempt.unlocked ? "pass" : "fail"}`;
    nodes.score.replaceChildren(
      createElement("strong", { text: `${attempt.score}/${attempt.maxScore}` }),
      createElement("span", {
        text: attempt.unlocked ? "통과했습니다." : "아직 통과하지 못했습니다.",
      }),
    );

    const feedback = attempt.feedback.length
      ? attempt.feedback.map((item) =>
          createElement("div", { className: "feedback-item", text: feedbackText(item) }),
        )
      : [createElement("div", { className: "feedback-item", text: "빠진 항목이 없습니다." })];

    if (attempt.unlockArtifact) {
      feedback.push(renderUnlockArtifact(attempt));
    }
    const judgeResult = renderJudgeResult(attempt);
    if (judgeResult) feedback.push(judgeResult);

    nodes.feedback.replaceChildren(...feedback);
    nodes.log.replaceChildren(
      ...attempt.verificationLog.map((entry) =>
        createElement("div", {
          className: `log-item ${entry.status}`,
          text: `${entry.status.toUpperCase()} · ${entry.checkId}: ${entry.message}`,
        }),
      ),
      renderResultActions({
        canGoNext: true,
      }),
    );
  }

  async function loadPractice(practiceId, options = {}) {
    const { updateHistory = true } = options;
    const body = await fetchJson(`/api/practices/${practiceId}`);
    state.currentPractice = body.practice;
    if (body.practice.type === "multi-question-choice") resetAct1Progress();
    if (body.practice.type === "prompt-brief") {
      state.promptBriefPageIndex = 0;
      state.promptDraft = "";
    }
    if (body.practice.type === "context-selection") {
      state.contextPageIndex = 0;
      state.contextSelection = new Set();
    }
    if (updateHistory) {
      const nextPath = practiceRoutePath(body.practice);
      if (window.location.pathname !== nextPath) {
        window.history.pushState({ practiceId: body.practice.id }, "", nextPath);
      }
    }
    renderPracticeList();
    renderHeading(body.practice);
    renderForm(body.practice);
    renderEmptyResult();
  }

  async function submitCurrentPractice(event) {
    event.preventDefault();
    const practice = state.currentPractice;
    if (!practice) return;

    if (practice.type === "multi-question-choice") {
      await submitProgressiveChoicePractice(practice);
      return;
    }
    if (practice.type === "prompt-brief") savePromptDraft();
    if (practice.type === "context-selection") saveCurrentContextPage(practice);

    try {
      const body = await fetchJson(`/api/practices/${practice.id}/attempts`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          learnerSessionId: nodes.sessionId.value.trim(),
          clientAttemptId: createClientAttemptId(practice),
          input: inputFromForm(practice),
        }),
      });
      rememberAttemptOnce(body.attempt);
      renderAttempt(body.attempt);
    } finally {
      clearClientAttemptId(practice);
    }
  }

  async function submitProgressiveChoicePractice(practice) {
    const question = currentAct1Question(practice);
    saveCurrentAct1Page(question);
    const selectedIds = state.act1Progress.answers[question.id] || [];
    const evaluation = evaluateChoiceQuestion(question, selectedIds);
    const questionNumber = state.act1Progress.questionIndex + 1;

    state.act1Progress.answers[question.id] = selectedIds;
    state.act1Progress.passed[question.id] = evaluation.passed;
    renderQuestionResult({
      questionNumber,
      totalQuestions: practice.questions.length,
      evaluation,
    });

    if (questionNumber < practice.questions.length) {
      return;
    }

    try {
      const body = await fetchJson(`/api/practices/${practice.id}/attempts`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          learnerSessionId: nodes.sessionId.value.trim(),
          clientAttemptId: createClientAttemptId(practice),
          input: inputFromForm(practice),
        }),
      });
      rememberAttemptOnce(body.attempt);
      renderAttempt(body.attempt);
    } finally {
      clearClientAttemptId(practice);
    }
  }

  async function init() {
    nodes.sessionId.value = stableSessionId();
    nodes.sessionId.addEventListener("change", () => {
      window.localStorage.setItem(
        "practiceHarnessSessionId",
        nodes.sessionId.value.trim(),
      );
    });
    nodes.form.addEventListener("submit", (event) => {
      submitCurrentPractice(event).catch((error) => {
        nodes.feedback.replaceChildren(
          createElement("div", { className: "feedback-item", text: error.message }),
        );
      });
    });

    const body = await fetchJson("/api/practices");
    state.practices = body.practices;
    renderPracticeList();
    window.addEventListener("popstate", () => {
      const practice = practiceFromLocation() || state.practices[0];
      if (practice) loadPractice(practice.id, { updateHistory: false });
    });
    const initialPractice = practiceFromLocation() || state.practices[0];
    if (initialPractice) await loadPractice(initialPractice.id, { updateHistory: false });
  }

  init().catch((error) => {
    nodes.heading.replaceChildren(
      createElement("h2", { text: "실습 UI를 불러오지 못했습니다." }),
      createElement("p", { text: error.message }),
    );
  });
})();
