class AppError extends Error {
  constructor(message, statusCode = 500, code = "INTERNAL_ERROR", details) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }
}

function notFound(req, _res, next) {
  next(new AppError(`Not found: ${req.method} ${req.originalUrl}`, 404, "NOT_FOUND"));
}

function errorHandler(err, _req, res, _next) {
  // Normalize common DB / validation failures so frontend gets actionable errors.
  let statusCode = err.statusCode || 500;
  let code = err.code || "INTERNAL_ERROR";
  let message = err.message || "Something went wrong";
  let details = err.details;

  // Mongoose validation errors
  if (err?.name === "ValidationError") {
    statusCode = 400;
    code = "VALIDATION_ERROR";
    message = "Validation failed";
    details = Object.values(err.errors || {}).map((e) => ({
      path: e.path,
      message: e.message,
    }));
  }

  // Duplicate key errors (Mongo)
  if (err?.code === 11000) {
    statusCode = 409;
    code = "DUPLICATE_KEY";
    const keys = err.keyValue ? Object.keys(err.keyValue) : [];
    message = keys.length ? `Duplicate value for: ${keys.join(", ")}` : "Duplicate key";
    details = err.keyValue;
  }

  const payload = {
    success: false,
    error: {
      code,
      message,
    },
  };
  if (details) payload.error.details = details;
  if (process.env.NODE_ENV !== "production") payload.error.stack = err.stack;
  res.status(statusCode).json(payload);
}

module.exports = { AppError, notFound, errorHandler };

