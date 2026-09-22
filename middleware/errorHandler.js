function sendError(res, statusCode, errorCode, message) {
  return res.status(statusCode).json({
    error_code: errorCode,
    message: message,
    timestamp: new Date().toISOString()
  });
}

module.exports = { sendError };