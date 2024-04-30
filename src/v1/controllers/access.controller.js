"use strict";

const { OK } = require("../core/success.response");
const AccessService = require("../services/access.service");

class AccessController {
  signUp = async (req, res, next) => {
    let signUp = await AccessService.signUp(req.body);
    return new OK("Sign up successfully", signUp).send();
  };
}

module.exports = new AccessController();
