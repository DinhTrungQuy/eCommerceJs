"use strict";

const { OK, Created } = require("../core/success.response");
const AccessService = require("../services/access.service");

class AccessController {
  handleRefreshToken = async (req, res, next) => {
    let refreshToken = await AccessService.handleRefreshToken(req.body);
    return new OK({ metadata: refreshToken }).send(res);
  };
  signUp = async (req, res, next) => {
    let signUp = await AccessService.signUp(req.body);
    return new Created({ metadata: signUp }).send(res);
  };

  login = async (req, res, next) => {
    let login = await AccessService.login(req.body);
    return new OK({ metadata: login }).send(res);
  };

  logout = async (req, res, next) => {
    let logout = await AccessService.logout(req.keyStore);
    return new OK({ metadata: logout }).send(res);
  };
}

module.exports = new AccessController();
