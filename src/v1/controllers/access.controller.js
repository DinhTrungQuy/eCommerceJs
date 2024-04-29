"use strict";

const AccessService = require("../services/access.service");

class AccessController {
  signUp = async (req, res, next) => {
    var signUp = await AccessService.signUp(req.body);
    console.log(signUp.metadata);
    return res.status(signUp.status).json(signUp);
  };
}

module.exports = new AccessController();
