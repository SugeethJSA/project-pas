function notFoundHandler(_req, res) {
  return res.status(404).json({
    success: false,
    error: "Route not found",
  });
}

function errorHandler(err, _req, res, _next) {
  if (res.headersSent) {
    return;
  }

  const statusCode = err.statusCode || 500;
  return res.status(statusCode).json({
    success: false,
    error: err.message || "Internal server error",
  });
}

module.exports = {
  notFoundHandler,
  errorHandler,
};
