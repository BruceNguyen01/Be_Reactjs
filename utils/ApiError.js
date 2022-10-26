class ApiError extends Error {
  constructor(statusCode, message, type = 'api Error', uuid = '') {
    super(message);
    this.statusCode = statusCode;
    this.type = type;
    this.uuid = uuid;
  }
}

export default ApiError;
