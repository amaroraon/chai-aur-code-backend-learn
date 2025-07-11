class AppError extends Error {
  constructor(
    statusCode,
    message = "something went wrong",
    errors = [],
    stack = ""
  ) {
    super(message);

    this.message = message;
    this.errors = errors;
    this.statusCode = statusCode;
    this.success = false;
    this.data = null;

    if (stack) {
      this.stack = stack;
    } else {
      Error.stackTraceLimit(this, this.constructor);
    }
  }
}

export { AppError };
