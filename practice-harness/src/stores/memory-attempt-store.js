const { PracticeHarnessError } = require("../errors");

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function formatAttemptId(sequence) {
  return `attempt_${String(sequence).padStart(6, "0")}`;
}

function getPracticeBucket(attemptsByPractice, practiceId) {
  if (!attemptsByPractice.has(practiceId)) {
    attemptsByPractice.set(practiceId, {
      attemptsById: new Map(),
      attemptsByLearner: new Map(),
      nextAttemptNumberByLearner: new Map(),
    });
  }

  return attemptsByPractice.get(practiceId);
}

function getLearnerAttempts(practiceBucket, learnerSessionId) {
  if (!practiceBucket.attemptsByLearner.has(learnerSessionId)) {
    practiceBucket.attemptsByLearner.set(learnerSessionId, []);
  }

  return practiceBucket.attemptsByLearner.get(learnerSessionId);
}

function removeStoredAttempt(attemptsByPractice, storedAttempt) {
  const practiceBucket = attemptsByPractice.get(storedAttempt.practiceId);
  if (!practiceBucket) return;

  practiceBucket.attemptsById.delete(storedAttempt.attemptId);
  const learnerAttempts = practiceBucket.attemptsByLearner.get(
    storedAttempt.learnerSessionId,
  );
  if (learnerAttempts) {
    const index = learnerAttempts.findIndex(
      (attempt) => attempt.attemptId === storedAttempt.attemptId,
    );
    if (index >= 0) learnerAttempts.splice(index, 1);
    if (learnerAttempts.length === 0) {
      practiceBucket.attemptsByLearner.delete(storedAttempt.learnerSessionId);
    }
  }
  if (
    practiceBucket.attemptsById.size === 0 &&
    practiceBucket.attemptsByLearner.size === 0
  ) {
    attemptsByPractice.delete(storedAttempt.practiceId);
  }
}

function createMemoryAttemptStore(options = {}) {
  const maxAttempts =
    options.maxAttempts === undefined ? Infinity : Number(options.maxAttempts);
  if (
    maxAttempts !== Infinity &&
    (!Number.isInteger(maxAttempts) || maxAttempts < 1)
  ) {
    throw new Error("maxAttempts must be a positive integer");
  }

  const attemptsByPractice = new Map();
  const attemptOrder = [];
  let nextAttemptSequence = 1;

  return {
    createAttempt(attempt) {
      const practiceBucket = getPracticeBucket(attemptsByPractice, attempt.practiceId);
      const learnerAttempts = getLearnerAttempts(
        practiceBucket,
        attempt.learnerSessionId,
      );
      const nextAttemptNumber =
        practiceBucket.nextAttemptNumberByLearner.get(attempt.learnerSessionId) || 1;
      const storedAttempt = {
        ...clone(attempt),
        attemptId: formatAttemptId(nextAttemptSequence),
        attemptNumber: nextAttemptNumber,
      };

      nextAttemptSequence += 1;
      practiceBucket.nextAttemptNumberByLearner.set(
        attempt.learnerSessionId,
        nextAttemptNumber + 1,
      );
      practiceBucket.attemptsById.set(storedAttempt.attemptId, storedAttempt);
      learnerAttempts.push(storedAttempt);
      attemptOrder.push(storedAttempt);
      while (attemptOrder.length > maxAttempts) {
        const expiredAttempt = attemptOrder.shift();
        removeStoredAttempt(attemptsByPractice, expiredAttempt);
      }

      return clone(storedAttempt);
    },

    getAttempt({ practiceId, attemptId }) {
      const practiceBucket = attemptsByPractice.get(practiceId);
      const attempt = practiceBucket && practiceBucket.attemptsById.get(attemptId);

      if (!attempt) {
        throw new PracticeHarnessError(
          "attempt_not_found",
          `Practice attempt not found: ${attemptId}`,
          { practiceId, attemptId },
        );
      }

      return clone(attempt);
    },

    listAttempts({ practiceId, learnerSessionId }) {
      const practiceBucket = attemptsByPractice.get(practiceId);
      if (!practiceBucket) return [];

      const learnerAttempts = practiceBucket.attemptsByLearner.get(learnerSessionId);
      if (!learnerAttempts) return [];

      return learnerAttempts.map((attempt) => clone(attempt));
    },
  };
}

module.exports = {
  createMemoryAttemptStore,
};
