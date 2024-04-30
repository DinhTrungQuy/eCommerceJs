"use strict";

const keytokenModel = require("../models/keytoken.model");

class KeyTokenService {
  static createKeyToken = async ({ userId, publicKey, privateKey }) => {
    const keyToken = await keytokenModel.create({
      user: userId,
      publicKey,
      privateKey,
    });
    return keyToken ? keyToken.publicKey : null;
  };
}
module.exports = KeyTokenService;
