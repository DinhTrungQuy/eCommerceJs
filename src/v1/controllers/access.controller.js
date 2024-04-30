"use strict";

const { OK } = require("../core/success.response");
const AccessService = require("../services/access.service");

class AccessController {
  signUp = async (req, res, next) => {
    let signUp = await AccessService.signUp(req.body);
    return new OK({ metadata: signUp }).send(res);
  };
}

module.exports = new AccessController();
