"use strict";

const shopModel = require("../models/shop.model");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const KeyTokenService = require("./keyToken.service");
const { createTokenPair } = require("../auth/authUltils");
const { getInfoData } = require("../utils");
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
        return { status: 409, message: "Email already exists" };
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
          modulusLength: 4096,
          publicKeyEncoding: {
            type: "spki",
            format: "pem",
          },
          privateKeyEncoding: {
            type: "pkcs8",
            format: "pem",
          },
        });

        const publicKeyString = await KeyTokenService.createKeyToken({
          userId: newShop._id,
          publicKey,
          privateKey,
        });

        if (!publicKeyString) {
          return { status: 500, message: "Error creating public key" };
        }

        const token = await createTokenPair(
          { userId: newShop._id, email: newShop.email },
          publicKey,
          privateKey
        );
        return {
          status: 200,
          message: "Sign up successfully",
          metadata: {
            shop: getInfoData({
              field: ["_id", "name", "email"],
              object: newShop,
            }),
            token,
          },
        };
      }
      return { status: 500, message: "Error creating shop" };
    } catch (err) {
      return { status: 500, message: err.message };
    }
  };
}

module.exports = AccessService;
