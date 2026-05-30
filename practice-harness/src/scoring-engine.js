const { PracticeHarnessError } = require("./errors");
const {
  missedRequiredFeedback,
  selectedNoiseFeedback,
} = require("./feedback-renderer");
const { buildUnlockArtifact } = require("./unlock-policy");

const MISSING_REQUIRED_PENALTY = 1;
const NOISE_KINDS = new Set(["noise", "pollution"]);

function clampScore(score, maxScore) {
  return Math.max(0, Math.min(maxScore, score));
}

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function invalidInput(message, details = {}) {
  return new PracticeHarnessError("invalid_input", message, details);
}

function invalidPracticeDefinition(message, details = {}) {
  return new PracticeHarnessError("invalid_practice_definition", message, details);
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function buildChoiceIndex(question) {
  return new Map(question.choices.map((choice) => [choice.id, choice]));
}

function statusFromRatio(ratio) {
  if (ratio === 1) return "pass";
  if (ratio > 0) return "partial";
  return "fail";
}

function statusFromCount(count) {
  if (count === 0) return "pass";
  if (count <= 3) return "partial";
  return "fail";
}

function createCheck(id, label, status, explanation) {
  return { id, label, status, explanation };
}

function buildVerificationLog(checks) {
  return checks.map((check) => ({
    checkId: check.id,
    status: check.status,
    message: check.explanation,
  }));
}

function matchesAnyPattern(text, patterns) {
  const normalizedText = text.toLocaleLowerCase();
  return patterns.some((pattern) => normalizedText.includes(String(pattern).toLocaleLowerCase()));
}

function getPatternGroups(criterion) {
  if (Array.isArray(criterion.patternGroups)) return criterion.patternGroups;
  if (Array.isArray(criterion.requiredPatternGroups)) return criterion.requiredPatternGroups;
  if (Array.isArray(criterion.patterns)) return [criterion.patterns];
  return [];
}

function evaluateCriterion(criterion, prompt) {
  const patternGroups = getPatternGroups(criterion);
  const matchedGroupCount = patternGroups.filter((patterns) =>
    matchesAnyPattern(prompt, patterns),
  ).length;

  if (patternGroups.length === 0 || matchedGroupCount === 0) {
    return {
      score: 0,
      status: "fail",
    };
  }

  if (matchedGroupCount === patternGroups.length) {
    return {
      score: criterion.points,
      status: "pass",
    };
  }

  return {
    score: Math.floor((criterion.points * matchedGroupCount) / patternGroups.length / 2),
    status: "partial",
  };
}

function countMatches(text, patterns) {
  return patterns.reduce((count, pattern) => {
    return matchesAnyPattern(text, [pattern]) ? count + 1 : count;
  }, 0);
}

function evaluateBriefStructure(prompt) {
  const trimmedPrompt = prompt.trim();
  const connectivePatterns = [
    "위한",
    "에서는",
    "에서",
    "으로",
    "하고",
    "하며",
    "함께",
    "때",
    "각",
    "없이",
    "나눠",
  ];
  const hasEnoughLength = trimmedPrompt.length >= 80;
  const hasConnectedConditions = countMatches(trimmedPrompt, connectivePatterns) >= 2;
  const hasSentenceBoundary = /[.!?]|[요다]\s|줘[.\s]/.test(trimmedPrompt);
  const passed = hasEnoughLength && hasConnectedConditions && hasSentenceBoundary;

  return {
    passed,
    cap: passed ? null : 85,
    check: createCheck(
      "brief-structure-check",
      "브리프 구조",
      passed ? "pass" : "fail",
      passed
        ? "키워드 나열이 아니라 조건이 문장으로 연결된 브리프입니다."
        : "키워드 나열에 가까워 고득점이 제한됩니다. 조건과 의도를 문장으로 연결해 주세요.",
    ),
  };
}

function flattenChecklistItems(practice) {
  return (practice.groups || []).flatMap((group) =>
    (group.items || []).map((item) => ({ ...item, groupId: group.id })),
  );
}

function scoreChecklistUnlockPractice({ practice, input }) {
  if (!isPlainObject(input) || !Array.isArray(input.selectedIds)) {
    throw invalidInput("input.selectedIds must be an array");
  }

  const itemIndex = new Map(flattenChecklistItems(practice).map((item) => [item.id, item]));
  const seenItemIds = new Set();
  const selectedItems = [];

  for (const itemId of input.selectedIds) {
    if (seenItemIds.has(itemId)) {
      throw invalidInput("Duplicate selected id", { itemId });
    }
    seenItemIds.add(itemId);

    const item = itemIndex.get(itemId);
    if (!item) {
      throw invalidInput("Unknown selected id", { itemId });
    }
    selectedItems.push(item);
  }

  const rawScore = selectedItems.reduce((sum, item) => sum + item.points, 0);
  const requiredItems = Array.from(itemIndex.values()).filter((item) => item.requiredForUnlock);
  const missingRequiredItems = requiredItems.filter((item) => !seenItemIds.has(item.id));
  const blockingItems = selectedItems.filter((item) => item.blocksUnlock);
  const unlocked = missingRequiredItems.length === 0 && blockingItems.length === 0;

  const loopSafetyPass = seenItemIds.has("stop-loop-guard") && blockingItems.length === 0;
  const completionEvidencePass =
    seenItemIds.has("evidence-run-tests") && seenItemIds.has("evidence-show-logs");
  const stateMachinePass =
    seenItemIds.has("trigger-before-final") &&
    seenItemIds.has("state-read-attempt") &&
    seenItemIds.has("state-write-complete") &&
    seenItemIds.has("stop-requires-incomplete");

  const checks = [
    createCheck(
      "loop-safety-check",
      "반복 방지",
      loopSafetyPass ? "pass" : "fail",
      loopSafetyPass
        ? "반복 block을 막는 조건이 포함되었습니다."
        : "반복 block을 막는 loop guard가 필요합니다.",
    ),
    createCheck(
      "completion-evidence-check",
      "완료 근거",
      completionEvidencePass ? "pass" : "fail",
      completionEvidencePass
        ? "완료를 확인할 검증 결과와 로그가 포함되었습니다."
        : "완료를 판단할 검증 결과 또는 로그가 부족합니다.",
    ),
    createCheck(
      "state-machine-check",
      "상태 전환",
      stateMachinePass ? "pass" : "fail",
      stateMachinePass
        ? "트리거, 상태 기록, 미완료 조건이 연결되었습니다."
        : "Stop hook이 언제 막고 언제 통과할지 상태 전환이 부족합니다.",
    ),
  ];

  const feedback = [
    ...missingRequiredItems.map((item) => ({
      type: "missing_required",
      itemId: item.id,
      message: `${item.label} 항목이 필요합니다.`,
    })),
    ...blockingItems.map((item) => ({
      type: "blocks_unlock",
      itemId: item.id,
      message: item.feedback,
    })),
  ];

  const result = {
    practiceId: practice.id,
    score: clampScore(rawScore, practice.maxScore),
    maxScore: practice.maxScore,
    unlocked,
    checks,
    feedback,
    selectedIds: input.selectedIds.slice(),
    verificationLog: buildVerificationLog(checks),
  };

  if (unlocked) {
    result.unlockArtifact = buildUnlockArtifact(practice);
  }

  return result;
}

function buildContextItemIndex(practice) {
  return new Map((practice.items || []).map((item) => [item.id, item]));
}

function scoreContextSelectionPractice({ practice, input }) {
  if (!isPlainObject(input) || !Array.isArray(input.selectedIds)) {
    throw invalidInput("input.selectedIds must be an array");
  }

  const itemIndex = buildContextItemIndex(practice);
  const seenItemIds = new Set();
  const selectedItems = [];

  for (const itemId of input.selectedIds) {
    if (seenItemIds.has(itemId)) {
      throw invalidInput("Duplicate selected id", { itemId });
    }
    seenItemIds.add(itemId);

    const item = itemIndex.get(itemId);
    if (!item) {
      throw invalidInput("Unknown selected id", { itemId });
    }
    selectedItems.push(item);
  }

  const selectedRequiredItems = selectedItems.filter((item) => item.kind === "required");
  const requiredItems = Array.from(itemIndex.values()).filter((item) => item.kind === "required");
  const missingRequiredItems = requiredItems.filter((item) => !seenItemIds.has(item.id));
  const pollutionItems = selectedItems.filter((item) => item.kind === "pollution");
  const outOfScopeItems = selectedItems.filter((item) => item.kind === "out-of-scope");
  const hasMobileContext = seenItemIds.has("mobile-cta-visible");
  const hasDesktopContext = seenItemIds.has("desktop-three-column");
  const responsiveCount = [hasMobileContext, hasDesktopContext].filter(Boolean).length;
  const hasFocusState = seenItemIds.has("focus-state");
  const rawScore = selectedItems.reduce((sum, item) => sum + item.points, 0);
  const allPositiveItemsSelected = Array.from(itemIndex.values())
    .filter((item) => item.points > 0)
    .every((item) => seenItemIds.has(item.id));
  const cleanSelectionBonus =
    allPositiveItemsSelected && pollutionItems.length === 0 && outOfScopeItems.length === 0
      ? practice.maxScore - rawScore
      : 0;

  const checks = [
    createCheck(
      "required-context-check",
      "필수 맥락",
      statusFromRatio(requiredItems.length === 0 ? 0 : selectedRequiredItems.length / requiredItems.length),
      missingRequiredItems.length === 0
        ? "필수 맥락이 모두 선택되었습니다."
        : `필수 맥락 ${missingRequiredItems.length}개가 빠졌습니다.`,
    ),
    createCheck(
      "stale-context-check",
      "오래된 맥락",
      pollutionItems.length === 0 ? "pass" : "fail",
      pollutionItems.length === 0
        ? "폐기되었거나 미확정인 맥락이 선택되지 않았습니다."
        : `오염 맥락 ${pollutionItems.length}개가 선택되었습니다.`,
    ),
    createCheck(
      "responsive-context-check",
      "반응형 조건",
      statusFromRatio(responsiveCount / 2),
      responsiveCount === 2
        ? "모바일과 데스크톱 배치 조건이 모두 포함되었습니다."
        : "모바일 첫 화면 CTA와 데스크톱 3열 배치 조건이 함께 필요합니다.",
    ),
    createCheck(
      "accessibility-context-check",
      "접근성 조건",
      hasFocusState ? "pass" : "fail",
      hasFocusState
        ? "버튼 focus 상태 기준이 포함되었습니다."
        : "버튼 focus 상태 기준이 필요합니다.",
    ),
    createCheck(
      "scope-noise-check",
      "범위 밖 정보",
      outOfScopeItems.length === 0 ? "pass" : "fail",
      outOfScopeItems.length === 0
        ? "다음 섹션 범위의 정보가 섞이지 않았습니다."
        : `범위 밖 정보 ${outOfScopeItems.length}개가 선택되었습니다.`,
    ),
  ];

  const feedback = [
    ...missingRequiredItems.map((item) => ({
      type: "missing_required",
      itemId: item.id,
      message: `${item.label} 항목이 필요합니다.`,
    })),
    ...pollutionItems.map((item) => ({
      type: "selected_pollution",
      itemId: item.id,
      message: item.feedback || `${item.label} 항목은 현재 맥락을 오염시킵니다.`,
    })),
    ...outOfScopeItems.map((item) => ({
      type: "selected_out_of_scope",
      itemId: item.id,
      message: item.feedback || `${item.label} 항목은 이번 작업 범위 밖입니다.`,
    })),
  ];

  return {
    practiceId: practice.id,
    score: clampScore(rawScore + cleanSelectionBonus, practice.maxScore),
    maxScore: practice.maxScore,
    checks,
    feedback,
    selectedIds: input.selectedIds.slice(),
    verificationLog: buildVerificationLog(checks),
  };
}

function lineCount(document) {
  return document.trim().split(/\r?\n/).length;
}

function hasMarkdownSection(document, sectionTitle) {
  return new RegExp(`^#{2,3}\\s+${escapeRegExp(sectionTitle)}\\s*$`, "im").test(document);
}

function containsAny(document, patterns) {
  return patterns.some((pattern) => pattern.test(document));
}

function scoreClaudeMemoryPractice({ practice, input }) {
  if (
    !isPlainObject(input) ||
    typeof input.scope !== "string" ||
    input.scope.trim() === "" ||
    typeof input.document !== "string" ||
    input.document.trim() === ""
  ) {
    throw invalidInput("input.scope and input.document are required");
  }

  if (
    Object.prototype.hasOwnProperty.call(input, "removedRuleIds") &&
    !Array.isArray(input.removedRuleIds)
  ) {
    throw invalidInput("input.removedRuleIds must be an array when provided");
  }

  const document = input.document.trim();
  const lowerDocument = document.toLocaleLowerCase();
  const scope = input.scope.trim();
  const validScopeIds = new Set((practice.learning.scopeOptions || []).map((option) => option.id));
  if (!validScopeIds.has(scope)) {
    throw invalidInput("Unknown CLAUDE.md scope", { scope });
  }

  const removedRuleIds = input.removedRuleIds || [];
  const removedRuleIdSet = new Set();
  for (const ruleId of removedRuleIds) {
    if (removedRuleIdSet.has(ruleId)) {
      throw invalidInput("Duplicate removed rule id", { ruleId });
    }
    removedRuleIdSet.add(ruleId);
  }
  const ruleCards = practice.learning.ruleCards || [];
  const ruleIndex = new Map(ruleCards.map((rule) => [rule.id, rule]));
  for (const ruleId of removedRuleIdSet) {
    if (!ruleIndex.has(ruleId)) {
      throw invalidInput("Unknown removed rule id", { ruleId });
    }
  }

  const sections = [
    "프로젝트 목표",
    "작업 전 확인",
    "사용자 변경 보존",
    "구현 원칙",
    "테스트와 확인",
    "QA/보안 리뷰",
    "프로젝트 참조",
  ];
  const presentSections = sections.filter((section) => hasMarkdownSection(document, section));
  const lineLimitPass = lineCount(document) <= 200;
  const coreSectionsPass = presentSections.length >= 6;
  const hasUserChangeRule = /기존 변경|사용자.*변경|되돌리지/.test(document);
  const hasDestructiveRule = /삭제|초기화|대량 변경|destructive|reset --hard|rm -rf/.test(lowerDocument);
  const safetyRulesPass = hasUserChangeRule && hasDestructiveRule;
  const hasVerificationRule = /검증하지 못|완료.*말하지|테스트|브라우저|빌드/.test(document);
  const hasReferenceSplitRule = /reference|참조|Skill|별도 문서|분리/.test(document);
  const scopeSelectionPass = scope === "project";
  const rulesToRemove = ruleCards.filter((rule) => rule.kind === "remove");
  const rulesToKeep = ruleCards.filter((rule) => rule.kind === "keep");
  const removedAllRiskyRules = rulesToRemove.every((rule) => removedRuleIdSet.has(rule.id));
  const removedNoKeepRules = rulesToKeep.every((rule) => !removedRuleIdSet.has(rule.id));
  const ruleTrimPass = removedAllRiskyRules && removedNoKeepRules;
  const installerNoisePatterns = [
    /최초 적용 모드/,
    /이 파일은 Claude Code를 처음 사용하는/,
    /설치용 원본 템플릿/,
    /OS별 명령 예시/,
    /긴 계획 예시/,
    /도구별 fallback/,
  ];
  const installerNoisePass = !containsAny(document, installerNoisePatterns);
  const dangerousPatterns = [
    /테스트가 오래 걸리면 생략/,
    /보라색 그라디언트/,
    /API\s*키.*적어둔다/i,
    /개인 토큰.*적어둔다/,
    /최종 HTML을 직접 고쳐도 된다/,
    /사용자.*변경.*되돌려도/,
  ];
  const dangerousMemoryPass = !containsAny(document, dangerousPatterns);

  const checks = [
    createCheck(
      "scope-selection-check",
      "적용 범위 선택",
      scopeSelectionPass ? "pass" : "fail",
      scopeSelectionPass
        ? "워크숍 프로젝트 규칙을 project 범위에 두기로 선택했습니다."
        : "이번 실습의 회사 내규는 global/user가 아니라 project 범위에 두어야 합니다.",
    ),
    createCheck(
      "rule-trim-check",
      "과한 내규 제거",
      ruleTrimPass ? "pass" : "fail",
      ruleTrimPass
        ? "항상 켜두면 위험하거나 충돌하는 후보 내규를 제거했습니다."
        : "테스트 생략, 오래된 디자인 결정, 민감 정보, 최종 산출물 직접 수정 허용 같은 과한 내규를 제거해야 합니다.",
    ),
    createCheck(
      "line-limit-check",
      "200줄 제한",
      lineLimitPass ? "pass" : "fail",
      lineLimitPass ? "최종 CLAUDE.md가 200줄 이하입니다." : "최종 CLAUDE.md는 200줄 이하로 압축해야 합니다.",
    ),
    createCheck(
      "core-sections-check",
      "핵심 섹션",
      statusFromRatio(presentSections.length / sections.length),
      coreSectionsPass
        ? "핵심 섹션이 충분히 남았습니다."
        : `핵심 섹션 ${sections.length - presentSections.length}개 이상이 부족합니다.`,
    ),
    createCheck(
      "safety-rules-check",
      "사용자 변경 보호",
      safetyRulesPass ? "pass" : "fail",
      safetyRulesPass
        ? "사용자 변경 보존과 위험 명령 승인 규칙이 포함되었습니다."
        : "사용자 변경 보존과 삭제/초기화 승인 규칙이 필요합니다.",
    ),
    createCheck(
      "verification-rules-check",
      "검증 전 완료 금지",
      hasVerificationRule ? "pass" : "fail",
      hasVerificationRule
        ? "검증하지 못했을 때 완료 선언을 금지하는 규칙이 포함되었습니다."
        : "검증하지 못했으면 완료라고 말하지 않는 규칙이 필요합니다.",
    ),
    createCheck(
      "reference-split-check",
      "긴 절차 분리",
      hasReferenceSplitRule ? "pass" : "fail",
      hasReferenceSplitRule
        ? "긴 절차를 reference 또는 Skill로 분리하는 기준이 포함되었습니다."
        : "긴 예시와 반복 절차를 reference 또는 Skill로 분리하는 기준이 필요합니다.",
    ),
    createCheck(
      "installer-noise-check",
      "설치용 설명 제거",
      installerNoisePass ? "pass" : "fail",
      installerNoisePass
        ? "최초 적용 모드와 긴 설치 설명이 최종 기억에서 제거되었습니다."
        : "설치용 원본 설명이 최종 CLAUDE.md에 그대로 남아 있습니다.",
    ),
    createCheck(
      "dangerous-memory-check",
      "위험 기억 제거",
      dangerousMemoryPass ? "pass" : "fail",
      dangerousMemoryPass
        ? "항상 켜두면 위험한 규칙이 제거되었습니다."
        : "테스트 생략, 오래된 디자인 결정, 토큰/API key 같은 위험 기억이 남아 있습니다.",
    ),
  ];

  let score = 0;
  if (scopeSelectionPass) score += 15;
  if (ruleTrimPass) score += 15;
  if (lineLimitPass) score += 10;
  score += Math.round((presentSections.length / sections.length) * 15);
  if (safetyRulesPass) score += 12;
  if (hasVerificationRule) score += 12;
  if (hasReferenceSplitRule) score += 11;
  if (installerNoisePass) score += 10;
  if (dangerousMemoryPass) score += 10;

  const feedback = [];
  for (const check of checks) {
    if (check.status === "pass") continue;
    const typeByCheckId = {
      "scope-selection-check": "wrong_scope",
      "rule-trim-check": "rule_overload",
      "line-limit-check": "line_limit",
      "core-sections-check": "missing_core_sections",
      "safety-rules-check": "missing_safety_rule",
      "verification-rules-check": "missing_verification_rule",
      "reference-split-check": "missing_reference_split",
      "installer-noise-check": "installer_noise",
      "dangerous-memory-check": "dangerous_memory",
    };
    feedback.push({
      type: typeByCheckId[check.id] || "claude_memory",
      checkId: check.id,
      message: check.explanation,
    });
  }

  const scoreCap =
    scopeSelectionPass && ruleTrimPass && installerNoisePass && dangerousMemoryPass
      ? practice.maxScore
      : practice.unlockThreshold - 1;

  return {
    practiceId: practice.id,
    score: clampScore(Math.min(score, scoreCap), practice.maxScore),
    maxScore: practice.maxScore,
    checks,
    feedback,
    scope,
    removedRuleIds: removedRuleIds.slice(),
    document,
    verificationLog: buildVerificationLog(checks),
  };
}

function scoreMultiQuestionChoicePractice({ practice, input }) {
  if (!isPlainObject(input) || !isPlainObject(input.answers)) {
    throw invalidInput("input.answers must be an object");
  }

  let rawScore = 0;
  let selectedRequiredCount = 0;
  let requiredCount = 0;
  let missingRequiredCount = 0;
  let noiseCount = 0;
  const feedback = [];
  const questionScores = [];

  for (const question of practice.questions || []) {
    const selectedIds = input.answers[question.id] || [];
    if (!Array.isArray(selectedIds)) {
      throw invalidInput("Question answer must be an array", { questionId: question.id });
    }

    const choiceIndex = buildChoiceIndex(question);
    const selectedChoices = [];
    const seenChoiceIds = new Set();

    for (const choiceId of selectedIds) {
      if (seenChoiceIds.has(choiceId)) {
        throw invalidInput("Duplicate choice id", { questionId: question.id, choiceId });
      }
      seenChoiceIds.add(choiceId);

      const choice = choiceIndex.get(choiceId);
      if (!choice) {
        throw invalidInput("Unknown choice id", { questionId: question.id, choiceId });
      }
      selectedChoices.push(choice);
      rawScore += choice.points;

      if (choice.kind === "required") selectedRequiredCount += 1;
      if (NOISE_KINDS.has(choice.kind)) {
        noiseCount += 1;
        feedback.push(selectedNoiseFeedback(question, choice));
      }
    }

    let questionScore = selectedChoices.reduce((sum, choice) => sum + choice.points, 0);

    for (const choice of question.choices) {
      if (choice.kind !== "required") continue;

      requiredCount += 1;
      if (!selectedIds.includes(choice.id)) {
        missingRequiredCount += 1;
        rawScore -= MISSING_REQUIRED_PENALTY;
        questionScore -= MISSING_REQUIRED_PENALTY;
        feedback.push(missedRequiredFeedback(question, choice));
      }
    }

    questionScores.push({
      questionId: question.id,
      score: Math.max(0, questionScore),
      selectedChoiceIds: selectedIds.slice(),
    });
  }

  const requiredRatio = requiredCount === 0 ? 0 : selectedRequiredCount / requiredCount;
  const ambiguityStatus = missingRequiredCount === 0 ? "pass" : "partial";
  const actionabilityStatus = requiredRatio >= 0.8 ? "pass" : statusFromRatio(requiredRatio);
  const checks = [
    createCheck(
      "required-info-check",
      "필수 정보",
      statusFromRatio(requiredRatio),
      missingRequiredCount === 0
        ? "필수 정보가 모두 선택되었습니다."
        : `필수 정보 ${missingRequiredCount}개가 빠졌습니다.`,
    ),
    createCheck(
      "scope-noise-check",
      "범위 밖 정보",
      statusFromCount(noiseCount),
      noiseCount === 0
        ? "범위 밖 정보가 선택되지 않았습니다."
        : `범위를 흐리는 정보 ${noiseCount}개가 선택되었습니다.`,
    ),
    createCheck(
      "ambiguity-check",
      "추측 빈칸",
      ambiguityStatus,
      missingRequiredCount === 0
        ? "김아이가 추측해야 할 큰 빈칸이 없습니다."
        : "빠진 필수 정보 때문에 김아이가 일부 조건을 추측하게 됩니다.",
    ),
    createCheck(
      "actionability-check",
      "실행 가능성",
      actionabilityStatus,
      actionabilityStatus === "pass"
        ? "바로 실행할 수 있을 만큼 기준이 충분합니다."
        : "실행 기준이 일부 부족합니다.",
    ),
  ];

  return {
    practiceId: practice.id,
    score: clampScore(rawScore, practice.maxScore),
    maxScore: practice.maxScore,
    checks,
    feedback,
    questionScores,
    verificationLog: buildVerificationLog(checks),
  };
}

function scorePromptBriefPractice({ practice, input }) {
  if (!isPlainObject(input) || typeof input.prompt !== "string" || input.prompt.trim() === "") {
    throw invalidInput("input.prompt must be a non-blank string");
  }

  let rawScore = 0;
  const feedback = [];
  const checks = (practice.criteria || []).map((criterion) => {
    const evaluation = evaluateCriterion(criterion, input.prompt);
    const passed = evaluation.status === "pass";

    if (passed) {
      rawScore += evaluation.score;
    } else {
      rawScore += evaluation.score;
      feedback.push({
        type: evaluation.status === "partial" ? "partial_criterion" : "missing_criterion",
        criterionId: criterion.id,
        label: criterion.label,
        message:
          criterion.missingFeedback ||
          `${criterion.label || criterion.id} 기준을 만족하는 내용이 필요합니다.`,
      });
    }

    return createCheck(
      criterion.checkId || `${criterion.id}-check`,
      criterion.label,
      evaluation.status,
      evaluation.status === "pass"
        ? `${criterion.label} 기준이 포함되었습니다.`
        : criterion.missingFeedback ||
            `${criterion.label || criterion.id} 기준을 만족하는 내용이 필요합니다.`,
    );
  });

  const structureEvaluation = evaluateBriefStructure(input.prompt);
  checks.push(structureEvaluation.check);

  if (!structureEvaluation.passed) {
    feedback.push({
      type: "brief_structure",
      message: structureEvaluation.check.explanation,
    });
  }

  const finalScore =
    structureEvaluation.cap === null
      ? rawScore
      : Math.min(rawScore, structureEvaluation.cap);

  return {
    practiceId: practice.id,
    score: clampScore(finalScore, practice.maxScore),
    maxScore: practice.maxScore,
    checks,
    feedback,
    prompt: input.prompt,
    verificationLog: buildVerificationLog(checks),
  };
}

function hasYamlFrontmatter(document) {
  return /^---\s*\n[\s\S]+?\n---(?:\s*\n|$)/.test(document.trimStart());
}

function getFrontmatterValue(document, key) {
  const frontmatterMatch = document.trimStart().match(/^---\s*\n([\s\S]+?)\n---(?:\s*\n|$)/);
  if (!frontmatterMatch) return "";

  const line = frontmatterMatch[1]
    .split(/\r?\n/)
    .find((candidate) => candidate.toLocaleLowerCase().startsWith(`${key}:`));

  if (!line) return "";
  return line.slice(line.indexOf(":") + 1).trim().replace(/^["']|["']$/g, "");
}

function hasSection(document, heading) {
  return new RegExp(`^#{1,3}\\s+${heading}\\s*$`, "im").test(document);
}

function getSectionContent(document, heading) {
  const lines = document.split(/\r?\n/);
  const headingPattern = new RegExp(`^#{1,3}\\s+${heading}\\s*$`, "i");
  const startIndex = lines.findIndex((line) => headingPattern.test(line.trim()));
  if (startIndex === -1) return "";

  const nextHeadingIndex = lines.findIndex((line, index) => {
    return index > startIndex && /^#{1,3}\s+\S/.test(line.trim());
  });
  const endIndex = nextHeadingIndex === -1 ? lines.length : nextHeadingIndex;
  return lines.slice(startIndex + 1, endIndex).join("\n");
}

function countStepItems(document) {
  const stepsContent = getSectionContent(document, "Steps");
  if (stepsContent.trim() === "") return 0;
  return stepsContent
    .split(/\r?\n/)
    .filter((line) => /^\s*(?:[-*]|\d+\.)\s+\S+/.test(line)).length;
}

function hasNumberedOrBulletedSteps(document) {
  return countStepItems(document) > 0;
}

function matchesAnyRegex(text, patterns) {
  return patterns.some((pattern) => pattern.test(text));
}

function parseRunbookSections(record) {
  const sectionNames = [
    "Attempt 1",
    "Attempt 2",
    "Coordinator",
    "Researcher",
    "Implementer",
    "Reviewer",
    "Result",
    "Final report",
  ];
  const headingPattern = new RegExp(
    `^[ \\t]*(?:#+[ \\t]*)?(${sectionNames.join("|")})[ \\t]*:?.*$`,
    "gim",
  );
  const matches = Array.from(record.matchAll(headingPattern));
  const sections = new Map();

  for (let index = 0; index < matches.length; index += 1) {
    const match = matches[index];
    const name = match[1].toLocaleLowerCase();
    const contentStart = match.index + match[0].length;
    const contentEnd = index + 1 < matches.length ? matches[index + 1].index : record.length;
    const content = record.slice(contentStart, contentEnd).trim();
    if (!sections.has(name)) sections.set(name, []);
    sections.get(name).push(content);
  }

  return sections;
}

function getRunbookSectionText(sections, name) {
  return (sections.get(name.toLocaleLowerCase()) || []).join("\n");
}

function getRunbookAttemptBlock(record, attemptNumber) {
  const startPattern = new RegExp(`^[ \\t]*(?:#+[ \\t]*)?Attempt[ \\t]*${attemptNumber}\\b.*$`, "im");
  const startMatch = record.match(startPattern);
  if (!startMatch) return "";

  const startIndex = startMatch.index + startMatch[0].length;
  const nextAttemptMatch = record.slice(startIndex).match(/^[ \t]*(?:#+[ \t]*)?Attempt[ \t]+\d+\b.*$/im);
  const endIndex = nextAttemptMatch ? startIndex + nextAttemptMatch.index : record.length;
  return record.slice(startIndex, endIndex).trim();
}

function countRunbookEvidenceLines(sectionText) {
  return sectionText
    .split(/\r?\n/)
    .filter((line) => /^\s*(?:[-*]|\d+\.)\s+\S+/.test(line.trim()) && line.trim().length >= 30)
    .length;
}

function hasSubstantialRunbookSection(sectionText, requiredPatterns) {
  const lowerSection = sectionText.toLocaleLowerCase();
  return (
    sectionText.trim().length >= 55 &&
    countRunbookEvidenceLines(sectionText) >= 1 &&
    requiredPatterns.every((patterns) => matchesAnyRegex(lowerSection, patterns))
  );
}

function hasCommandLikeLine(record) {
  return record.split(/\r?\n/).some((line) =>
    matchesAnyRegex(line.toLocaleLowerCase(), [
      /node\s+--test/,
      /\bnpm\s+test\b/,
      /verify-/,
      /\bcurl\b/,
      /실행\s*명령/,
    ]),
  );
}

function hasResultEvidence(record) {
  return record.split(/\r?\n/).some((line) =>
    matchesAnyRegex(line.toLocaleLowerCase(), [
      /\bpass(?:ed)?\b/,
      /\bfail(?:ed)?\b/,
      /\bexit\s*0\b/,
      /통과/,
      /실패/,
      /로그/,
    ]),
  );
}

function evaluateLocalRunbookRecord(record) {
  const lowerRecord = record.toLocaleLowerCase();
  const sections = parseRunbookSections(record);
  const attempt2Block = getRunbookAttemptBlock(record, 2);
  const roleSections = {
    coordinator: getRunbookSectionText(sections, "Coordinator"),
    researcher: getRunbookSectionText(sections, "Researcher"),
    implementer: getRunbookSectionText(sections, "Implementer"),
    reviewer: getRunbookSectionText(sections, "Reviewer"),
  };
  const roleCount = Object.values(roleSections).filter((section) => section.trim() !== "").length;
  const coordinatorSubstantial = hasSubstantialRunbookSection(roleSections.coordinator, [
    [/goal|목표/],
    [/constraint|제약/],
    [/mini[-\s]?brainstorming|brainstorming skill|브레인스토밍.*skill|skill.*브레인스토밍/],
  ]);
  const researcherSubstantial = hasSubstantialRunbookSection(roleSections.researcher, [
    [/read|research|조사|읽/],
    [/no implementation|did not implement|구현\s*금지|구현하지/],
  ]);
  const implementerSubstantial = hasSubstantialRunbookSection(roleSections.implementer, [
    [/implement|changed|수정|구현/],
    [/no source judgment|did not make source|source-quality judgments|출처\s*판단\s*금지|출처.*임의/],
  ]);
  const reviewerSubstantial = hasSubstantialRunbookSection(roleSections.reviewer, [
    [/review|검토/],
    [/no edit|did not edit|수정\s*금지|직접\s*수정하지/],
  ]);
  const hasAllRoles = [coordinatorSubstantial, researcherSubstantial, implementerSubstantial, reviewerSubstantial]
    .every(Boolean);
  const hasSingleAgentAntiPattern = matchesAnyRegex(lowerRecord, [
    /single[-\s]?agent/,
    /one agent/,
    /one person/,
    /same agent/,
    /한\s*명/,
    /혼자/,
  ]);
  const hasSeparatedOutputs = hasAllRoles && !hasSingleAgentAntiPattern;

  const roleSeparationPassed =
    hasSeparatedOutputs &&
    researcherSubstantial &&
    implementerSubstantial &&
    reviewerSubstantial;

  const skillAssignmentPassed =
    coordinatorSubstantial &&
    matchesAnyRegex(roleSections.coordinator.toLocaleLowerCase(), [
      /mini[-\s]?brainstorming/,
      /brainstorming skill/,
      /브레인스토밍.*skill/,
      /skill.*브레인스토밍/,
    ]);

  const toolPermissionPassed =
    researcherSubstantial &&
    implementerSubstantial &&
    reviewerSubstantial;

  const hasAttemptStructure = /^\s*attempt\s*1\b/im.test(record) || /1차\s*시도/.test(record);
  const hasResultStructure = /^\s*result\s*:/im.test(record) || /결과\s*:/.test(record);
  const hasLocalExecutionNote = hasCommandLikeLine(record) && hasResultEvidence(record);
  const recordLongEnough = record.trim().length >= 240;
  const executionPassed =
    hasAttemptStructure && hasResultStructure && hasLocalExecutionNote && recordLongEnough;
  const executionPartial =
    !executionPassed && (hasAttemptStructure || hasResultStructure || hasLocalExecutionNote);

  const iterationPassed =
    (/^\s*attempt\s*2\b/im.test(record) || /2차\s*시도/.test(record)) &&
    matchesAnyRegex(attempt2Block.toLocaleLowerCase(), [
      /changed role/,
      /changed tool/,
      /role assignment/,
      /tool permission/,
      /역할.*바/,
      /권한.*바/,
      /역할.*변경/,
      /권한.*변경/,
    ]) &&
    hasCommandLikeLine(attempt2Block) &&
    hasResultEvidence(attempt2Block);

  return {
    checks: [
      createCheck(
        "role-separation-check",
        "역할 분리",
        roleSeparationPassed ? "pass" : roleCount >= 2 && !hasSingleAgentAntiPattern ? "partial" : "fail",
        roleSeparationPassed
          ? "Coordinator, Researcher, Implementer, Reviewer 출력과 금지 책임이 분리되었습니다."
          : "한 명에게 모든 일을 맡기지 말고 역할별 출력과 금지 책임을 분리해야 합니다.",
      ),
      createCheck(
        "skill-assignment-check",
        "Skill 배정",
        skillAssignmentPassed ? "pass" : "fail",
        skillAssignmentPassed
          ? "Coordinator의 mini-brainstorming Skill 적용이 기록되었습니다."
          : "Coordinator가 mini-brainstorming Skill을 적용한 기록이 필요합니다.",
      ),
      createCheck(
        "tool-permission-check",
        "도구 권한",
        toolPermissionPassed ? "pass" : "fail",
        toolPermissionPassed
          ? "역할별 금지 행동과 도구 권한 조정이 기록되었습니다."
          : "Researcher/Implementer/Reviewer의 금지 행동과 도구 권한 구분이 필요합니다.",
      ),
      createCheck(
        "execution-record-check",
        "실행 기록",
        executionPassed ? "pass" : executionPartial ? "partial" : "fail",
        executionPassed
          ? "Attempt/Result 구조와 로컬 실행 결과가 충분히 기록되었습니다."
          : "Attempt/Result 구조, 로컬 실행 명령, 통과/실패 결과를 더 분명히 남겨야 합니다.",
      ),
      createCheck(
        "iteration-check",
        "2차 조정",
        iterationPassed ? "pass" : "fail",
        iterationPassed
          ? "2차 시도에서 역할 또는 도구 권한을 바꾼 기록이 있습니다."
          : "2차 시도에서 역할이나 도구 권한을 바꿔 본 기록이 필요합니다.",
      ),
    ],
    caps: {
      roleSeparation: roleSeparationPassed ? null : hasSingleAgentAntiPattern ? 65 : 78,
      execution: executionPassed ? null : executionPartial ? 82 : 60,
      iteration: iterationPassed ? null : 90,
    },
  };
}

function scoreLocalRunbookPractice({ practice, input }) {
  if (
    !isPlainObject(input) ||
    typeof input.record !== "string" ||
    input.record.trim() === ""
  ) {
    throw invalidInput("input.record must be a non-blank string");
  }

  const recordEvaluation = evaluateLocalRunbookRecord(input.record);
  const checkWeights = new Map([
    ["role-separation-check", 25],
    ["skill-assignment-check", 20],
    ["tool-permission-check", 20],
    ["execution-record-check", 20],
    ["iteration-check", 15],
  ]);
  const recordScore = recordEvaluation.checks.reduce((sum, check) => {
    const weight = checkWeights.get(check.id) || 0;
    if (check.status === "pass") return sum + weight;
    if (check.status === "partial") return sum + Math.floor(weight / 2);
    return sum;
  }, 0);
  const rawScore = recordScore;
  const scoreCap = Math.min(
    practice.maxScore,
    ...Object.values(recordEvaluation.caps).filter((cap) => cap !== null),
  );

  const feedback = [
    ...recordEvaluation.checks
      .filter((check) => check.status !== "pass")
      .map((check) => ({
        type: "record_structure",
        checkId: check.id,
        message: check.explanation,
      })),
  ];

  return {
    practiceId: practice.id,
    score: clampScore(Math.min(rawScore, scoreCap), practice.maxScore),
    maxScore: practice.maxScore,
    checks: recordEvaluation.checks,
    feedback,
    record: input.record,
    verificationLog: buildVerificationLog(recordEvaluation.checks),
  };
}

function evaluateSkillDocumentCriterion(criterion, document) {
  const description = getFrontmatterValue(document, "description");
  const lowerDocument = document.toLocaleLowerCase();
  const lowerDescription = description.toLocaleLowerCase();

  switch (criterion.id) {
    case "trigger-description":
      return (
        description.trim().length >= 30 &&
        matchesAnyRegex(lowerDescription, [
          /\buse when\b/,
          /\btrigger\b/,
          /when a user/,
          /필요할 때/,
          /사용.*때/,
          /트리거/,
        ]) &&
        matchesAnyRegex(lowerDescription, [
          /vague|unclear|idea|brainstorm/,
          /아이디어|브레인스토밍|막연|정리/,
        ])
      );
    case "one-question-at-a-time":
      return matchesAnyRegex(lowerDocument, [
        /one question at a time/,
        /exactly one question/,
        /ask .*one question/,
        /한 번에\s*(하나|1개)의?\s*질문/,
        /질문.*하나/,
      ]);
    case "scope-boundary":
      return matchesAnyRegex(lowerDocument, [
        /scope boundary/,
        /out(?:\s|-)?of(?:\s|-)?scope/,
        /unrelated .*outside/,
        /범위.*(경계|밖|벗어나|제한)/,
        /선택한 아이디어 밖/,
      ]);
    case "approach-comparison":
      return (
        matchesAnyRegex(lowerDocument, [/compare|comparison|비교/]) &&
        matchesAnyRegex(lowerDocument, [/approaches|alternatives|접근안|대안/]) &&
        matchesAnyRegex(lowerDocument, [/tradeoff|trade-off|pros|cons|장단점|장점|단점/])
      );
    case "approval-gate":
      return (
        matchesAnyRegex(lowerDocument, [/approval|approve|confirm|승인|확인/]) &&
        matchesAnyRegex(lowerDocument, [/before moving|before .*implementation|넘어가기 전|전에/])
      );
    case "spec-output":
      return (
        matchesAnyRegex(lowerDocument, [/\bspec\b/, /명세|기획서|산출/]) &&
        countMatches(lowerDocument, [
          "goal",
          "audience",
          "constraints",
          "chosen approach",
          "rejected alternatives",
          "목표",
          "대상",
          "제약",
          "선택한 접근",
          "제외한 대안",
        ]) >= 3
      );
    case "output-format":
      return hasSection(document, "Output Format") || hasSection(document, "출력 형식");
    default:
      return false;
  }
}

function scoreSkillDocumentPractice({ practice, input }) {
  if (!isPlainObject(input) || typeof input.document !== "string" || input.document.trim() === "") {
    throw invalidInput("input.document must be a non-blank string");
  }

  const document = input.document;
  const frontmatterPass = hasYamlFrontmatter(document);
  const name = getFrontmatterValue(document, "name");
  const namePass = name.length > 0;
  const stepsPass = hasSection(document, "Steps") && hasNumberedOrBulletedSteps(document);
  const stepItemCount = countStepItems(document);
  const outputFormatPass = evaluateSkillDocumentCriterion(
    { id: "output-format" },
    document,
  );
  const structureDepthPass = stepsPass && stepItemCount >= 5 && outputFormatPass;
  const scaffoldPlaceholderPass =
    !/(?:TODO|Fill in|채워 넣기)\s*:/i.test(document) &&
    !/\[(?:여기에|작성|기입)[^\]]*\]/.test(document);

  let rawScore = 0;
  const feedback = [];
  const criteriaById = new Map((practice.criteria || []).map((criterion) => [criterion.id, criterion]));

  const structuralChecks = [
    {
      id: "frontmatter-check",
      label: "Frontmatter",
      passed: frontmatterPass,
      message: frontmatterPass
        ? "YAML frontmatter가 포함되었습니다."
        : "문서 시작에 YAML frontmatter가 필요합니다.",
      feedbackType: "missing_structure",
    },
    {
      id: "name-check",
      label: "Skill 이름",
      passed: namePass,
      message: namePass
        ? "frontmatter에 name이 포함되었습니다."
        : "frontmatter에 name 값을 넣어야 합니다.",
      feedbackType: "missing_structure",
    },
    {
      id: "steps-check",
      label: "절차",
      passed: stepsPass,
      message: stepsPass
        ? "Steps 섹션에 실행 절차가 포함되었습니다."
        : "Steps 섹션과 실행 절차 목록이 필요합니다.",
      feedbackType: "missing_structure",
    },
  ];

  const checks = [];
  for (const structuralCheck of structuralChecks.slice(0, 2)) {
    checks.push(
      createCheck(
        structuralCheck.id,
        structuralCheck.label,
        structuralCheck.passed ? "pass" : "fail",
        structuralCheck.message,
      ),
    );
    if (!structuralCheck.passed) {
      feedback.push({
        type: structuralCheck.feedbackType,
        checkId: structuralCheck.id,
        message: structuralCheck.message,
      });
    }
  }

  const triggerCriterion = criteriaById.get("trigger-description");
  if (triggerCriterion) {
    const passed = evaluateSkillDocumentCriterion(triggerCriterion, document);
    if (passed) {
      rawScore += triggerCriterion.points;
    } else {
      feedback.push({
        type: "missing_criterion",
        criterionId: triggerCriterion.id,
        label: triggerCriterion.label,
        message: triggerCriterion.missingFeedback,
      });
    }
    checks.push(
      createCheck(
        triggerCriterion.checkId || "description-trigger-check",
        triggerCriterion.label,
        passed ? "pass" : "fail",
        passed ? `${triggerCriterion.label} 기준이 포함되었습니다.` : triggerCriterion.missingFeedback,
      ),
    );
  }

  const stepsCheck = structuralChecks[2];
  checks.push(
    createCheck(
      stepsCheck.id,
      stepsCheck.label,
      stepsCheck.passed ? "pass" : "fail",
      stepsCheck.message,
    ),
  );
  if (!stepsCheck.passed) {
    feedback.push({
      type: stepsCheck.feedbackType,
      checkId: stepsCheck.id,
      message: stepsCheck.message,
    });
  }

  checks.push(
    createCheck(
      "skill-structure-depth-check",
      "절차 깊이",
      structureDepthPass ? "pass" : "fail",
      structureDepthPass
        ? "Steps와 Output Format이 분리되어 있고 실행 단계가 충분합니다."
        : "Steps 섹션에는 최소 5개의 bullet/numbered step이 필요하고 Output Format은 별도 섹션이어야 합니다.",
    ),
  );
  if (!structureDepthPass) {
    feedback.push({
      type: "skill_structure",
      checkId: "skill-structure-depth-check",
      message: "Steps 섹션에는 최소 5개의 bullet/numbered step이 필요하고 Output Format은 별도 섹션이어야 합니다.",
    });
  }
  if (!scaffoldPlaceholderPass) {
    feedback.push({
      type: "skill_structure",
      checkId: "skill-placeholder-check",
      message: "작성용 placeholder가 남아 있어 제출용 Skill 문서로 볼 수 없습니다.",
    });
  }

  const remainingCriterionIds = [
    "output-format",
    "one-question-at-a-time",
    "scope-boundary",
    "approach-comparison",
    "approval-gate",
    "spec-output",
  ];

  for (const criterionId of remainingCriterionIds) {
    const criterion = criteriaById.get(criterionId);
    if (!criterion) continue;

    const passed = evaluateSkillDocumentCriterion(criterion, document);
    if (passed) {
      rawScore += criterion.points;
    } else {
      feedback.push({
        type: "missing_criterion",
        criterionId: criterion.id,
        label: criterion.label,
        message: criterion.missingFeedback,
      });
    }

    checks.push(
      createCheck(
        criterion.checkId || `${criterion.id}-check`,
        criterion.label,
        passed ? "pass" : "fail",
        passed ? `${criterion.label} 기준이 포함되었습니다.` : criterion.missingFeedback,
      ),
    );
  }

  const structureCapReasons = checks
    .filter((check) =>
      [
        "frontmatter-check",
        "name-check",
        "steps-check",
        "skill-structure-depth-check",
        "output-format-check",
      ].includes(check.id) && check.status !== "pass",
    )
    .map((check) => check.id);
  const scoreCap =
    structureCapReasons.length === 0 && scaffoldPlaceholderPass
      ? practice.maxScore
      : Math.max(0, (practice.unlockThreshold || practice.maxScore) - 1);
  if (structureCapReasons.length > 0) {
    feedback.push({
      type: "skill_structure",
      checkIds: structureCapReasons,
      message: "핵심 Skill 문서 구조가 빠져 unlock threshold 미만으로 점수가 제한됩니다.",
    });
  }

  return {
    practiceId: practice.id,
    score: clampScore(Math.min(rawScore, scoreCap), practice.maxScore),
    maxScore: practice.maxScore,
    checks,
    feedback,
    document,
    verificationLog: buildVerificationLog(checks),
  };
}

function scorePracticeAttempt({ practice, input }) {
  switch (practice.type) {
    case "context-selection":
      return scoreContextSelectionPractice({ practice, input });
    case "multi-question-choice":
      return scoreMultiQuestionChoicePractice({ practice, input });
    case "prompt-brief":
      return scorePromptBriefPractice({ practice, input });
    case "claude-memory":
      return scoreClaudeMemoryPractice({ practice, input });
    case "skill-document":
      return scoreSkillDocumentPractice({ practice, input });
    case "local-runbook":
      return scoreLocalRunbookPractice({ practice, input });
    case "checklist-unlock":
      return scoreChecklistUnlockPractice({ practice, input });
    default:
      throw invalidPracticeDefinition("Unknown practice type", {
        practiceId: practice.id,
        practiceType: practice.type,
      });
  }
}

module.exports = {
  scorePracticeAttempt,
};
