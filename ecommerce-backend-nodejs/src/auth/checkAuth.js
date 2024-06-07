"use strict";

const HEADER = require("../consts/header");
const { ForbiddenResponse } = require("../core/error.response");
const apiKeyService = require("../services/apiKey.service");

const apiKey = async (req, res, next) => {
  const key = req.headers[HEADER.API_KEY]?.toString();
  // if (!key) {
  //   throw new ForbiddenResponse(`Invalid API key`);
  // }
  const objKey = await apiKeyService.findById(key);

  if (!objKey) {
    throw new ForbiddenResponse(`Invalid API key`);
  }

  req.objKey = objKey;
  next();
};

const permissions = (permission) => {
  return async (req, res, next) => {
    const objKey = req.objKey;
    if (!objKey.permissions.includes(permission)) {
      throw new ForbiddenResponse(`Permission denied`);
    }
    next();
  };
};

module.exports = { apiKey, permissions };
