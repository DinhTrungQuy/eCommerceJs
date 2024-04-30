"use strict";

const shopModel = require("../models/shop.model");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const KeyTokenService = require("./keyToken.service");
const { createTokenPair } = require("../auth/authUltils");
const { getInfoData } = require("../utils");
const { ConflictResponse } = require("../core/error.response");
const { OK } = require("../core/success.response");
const saltRounds = 10;
const Roles = {
  SHOP: "SHOP",
  ADMIN: "ADMIN",
  WRITER: "WRITER",
};

class AccessService {
  static signUp = async ({ name, email, password }) => {
    try {
      const holderShop = await shopModel.findOne({ email }).lean();
      if (holderShop) {
        throw new ConflictResponse(`Email already exists`);
      }
      const passwordHash = await bcrypt.hash(password, saltRounds);

      const newShop = await shopModel.create({
        name,
        email,
        password: passwordHash,
        roles: [Roles.SHOP],
      });

      if (newShop) {
        // create private key and public key
        const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
          modulusLength: 2048,
          publicKeyEncoding: { type: "spki", format: "pem" },
          privateKeyEncoding: { type: "pkcs8", format: "pem" },
        });

        const keyToken = await KeyTokenService.createKeyToken({
          userId: newShop._id,
          publicKey,
          privateKey,
        });

        if (!keyToken) {
          throw new ConflictResponse(`Error creating public key`);
        }

        const token = await createTokenPair(
          { userId: newShop._id, email: newShop.email },
          publicKey,
          privateKey
        );
        return new OK("Sign up successfully", {
          shop: getInfoData({
            field: ["_id", "name", "email"],
            object: newShop,
          }),
          token,
        }).send();
      }
      throw new ConflictResponse(`Error creating shop`);
    } catch (err) {
      return { status: err.status || 500, message: err.message || "Error" };
    }
  };
}

module.exports = AccessService;
