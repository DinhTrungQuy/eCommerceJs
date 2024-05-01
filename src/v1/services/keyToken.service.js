"use strict";

const { filter, update } = require("lodash");
const keytokenModel = require("../models/keytoken.model");

class KeyTokenService {
  static createKeyToken = async ({
    userId,
    publicKey,
    privateKey,
    refreshToken,
  }) => {
    const filter = { user: userId };
    const update = {
      publicKey,
      privateKey,
      refreshTokensUsed: [],
      refreshToken,
    };
    const keyToken = await keytokenModel.findOneAndUpdate(filter, update, {
      new: true,
      upsert: true,
    });
    return keyToken ? keyToken.publicKey : null;
  };
}
module.exports = KeyTokenService;
