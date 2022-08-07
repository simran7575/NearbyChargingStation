function CustomError(message, code) {
  return {
    statusCode: code,
    message: message,
  };
}
module.exports = CustomError;
