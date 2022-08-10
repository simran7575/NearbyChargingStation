function CustomError(message, code) {
  return {
    statusCode: code,
    message: message,
    success: false,
  };
}
module.exports = CustomError;
