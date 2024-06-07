"use strict";

const apikeyModel = require("../models/apikey.model");
const crypto = require("crypto");
class apiKeyService {
  static findById = async (key) => {
    // await apikeyModel.create({
    //   key: crypto.randomBytes(16).toString("hex"),
    //   permissions: ["0000", "1111"],
    //   status: true,
    // });
    const apiKey = await apikeyModel.findOne({ key: key, status: true }).lean();
    return apiKey;
  };
}

module.exports = apiKeyService;
