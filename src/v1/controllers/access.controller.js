"use strict";

const { OK, Created } = require("../core/success.response");
const AccessService = require("../services/access.service");

class AccessController {
  signUp = async (req, res, next) => {
    let signUp = await AccessService.signUp(req.body);
    return new Created({ metadata: signUp }).send(res);
  };

  login = async (req, res, next) => {
    let login = await AccessService.login(req.body);
    return new OK({ metadata: login }).send(res);
  };
}

module.exports = new AccessController();
