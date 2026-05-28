class PracticeHarnessError extends Error {
  constructor(code, message, options = {}) {
    super(message);
    this.name = "PracticeHarnessError";
    this.code = code;
    Object.assign(this, options);
  }
}

module.exports = {
  PracticeHarnessError,
};
