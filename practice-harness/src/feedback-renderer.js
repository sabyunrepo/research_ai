function missedRequiredFeedback(question, choice) {
  return {
    type: "missing_required",
    questionId: question.id,
    choiceId: choice.id,
    label: choice.label,
    message: choice.missingFeedback || `${choice.label} 정보가 빠졌습니다.`,
  };
}

function selectedNoiseFeedback(question, choice) {
  return {
    type: "selected_noise",
    questionId: question.id,
    choiceId: choice.id,
    label: choice.label,
    kind: choice.kind,
    message: choice.feedback || `${choice.label} 정보는 지금 목표를 흐릴 수 있습니다.`,
  };
}

module.exports = {
  missedRequiredFeedback,
  selectedNoiseFeedback,
};
