"use strict";

const { StatusCodes, ReasonPhrases } = require("../consts/httpStatusCode");

class ErrorResponse extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

class ConflictResponse extends ErrorResponse {
  constructor(message = ReasonPhrases.CONFLICT, status = StatusCodes.CONFLICT) {
    super(message, status);
  }
}

class NotFoundResponse extends ErrorResponse {
  constructor(message = ReasonPhrases.NOT_FOUND, status) {
    super(message, status);
    this.status = StatusCodes.NOT_FOUND;
    this.message = message;
  }
}

class ForbiddenResponse extends ErrorResponse {
  constructor(message = ReasonPhrases.FORBIDDEN, status) {
    super(message, status);
    this.status = StatusCodes.FORBIDDEN;
    this.message = message;
  }
}

module.exports = {
  ErrorResponse,
  ConflictResponse,
  NotFoundResponse,
  ForbiddenResponse,
};
