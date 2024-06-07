"use strict";

const { ReasonPhrases, StatusCodes } = require("../consts/httpStatusCode");

class SuccessResponse {
  constructor({ message, status, metadata }) {
    this.message = message ? message : ReasonPhrases.OK;
    this.status = status ? status : StatusCodes.OK;
    this.metadata = metadata ? metadata : {};
  }

  send(res) {
    return res.status(this.status).json({
      status: this.status,
      message: this.message,
      metadata: this.metadata,
    });
  }
}
class OK extends SuccessResponse {
  constructor({ message, metadata }) {
    super({ message, status: StatusCodes.OK, metadata });
  }
}

class Created extends SuccessResponse {
  constructor({ message, metadata }) {
    super({ message, status: StatusCodes.CREATED, metadata });
  }
}

module.exports = {
  OK,
  Created,
};
