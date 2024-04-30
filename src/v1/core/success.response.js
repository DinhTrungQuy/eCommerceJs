"use strict";

const { ReasonPhrases, StatusCodes } = require("../consts/httpStatusCode");

class SuccessResponse {
  constructor({ message, status, metadata }) {
    this.message = message;
    this.status = status;
    this.metadata = metadata;
  }

  send(res) {
    return res.status(this.status).json({
      message: this.message,
      metadata: this.metadata,
    });
  }
}
class OK extends SuccessResponse {
  constructor(message = ReasonPhrases.OK, metadata) {
    super({ message, status: StatusCodes.OK, metadata });
  }
}

class Created extends SuccessResponse {
  constructor(message = ReasonPhrases.CREATED, metadata) {
    super({ message, status: StatusCodes.CREATED, metadata });
  }
}

module.exports = {
  OK,
  Created,
};
