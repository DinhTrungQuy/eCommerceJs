"use strict";

const { ForbiddenResponse } = require("../core/error.response");
const apiKeyService = require("../services/apiKey.service");

const HEADER = {
  API_KEY: "x-api-key",
  AUTHORIZATION: "authorization",
};

const apiKey = async (req, res, next) => {
  const key = req.headers[HEADER.API_KEY]?.toString();
  if (!key) {
    throw new ForbiddenResponse(`Invalid API key`);
  }
  const objKey = await apiKeyService.findById(key);
  console.log(objKey);
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

const asyncHandler = (func) => {
  return (req, res, next) => {
    func(req, res, next).catch(next);
  };
};

module.exports = { apiKey, permissions, asyncHandler };
