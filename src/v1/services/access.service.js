"use strict";

const shopModel = require("../models/shop.model");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const KeyTokenService = require("./keyToken.service");
const { createTokenPair, verifyJWT } = require("../auth/authUltils");
const { getInfoData } = require("../utils");
const {
  ConflictResponse,
  BadRequestResponse,
  UnauthorizedResponse,
  ForbiddenResponse,
} = require("../core/error.response");
const Roles = require("../consts/roles");
const { findByEmail } = require("./shop.service");
const saltRounds = 10;

class AccessService {
  static handleRefreshToken = async (refreshToken) => {
    //check token in database if it exists
    const foundToken = await KeyTokenService.getRefreshTokenUsed(refreshToken);
    if (foundToken) {
      const { userId, email } = verifyJWT(refreshToken, foundToken.publicKey);
      await KeyTokenService.removeKeyTokenByUserId(userId);
      throw new ForbiddenResponse(`Invalid refresh token`);
    }
  };

  static login = async ({ email, password, refreshToken = null }) => {
    const foundShop = await findByEmail(email);
    // check email in database
    if (!foundShop) {
      throw new BadRequestResponse(`Shop not registered`);
    }
    const match = bcrypt.compare(password, foundShop.password);
    // compare password with hash password
    if (!match) {
      throw new UnauthorizedResponse(`Authentication failed`);
    }
    //create public key and private key
    const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
      modulusLength: 2048,
      publicKeyEncoding: {
        type: "spki",
        format: "pem",
      },
      privateKeyEncoding: {
        type: "pkcs8",
        format: "pem",
      },
    });
    // create token and refresh token
    const token = await createTokenPair(
      { userId: foundShop._id, email: foundShop.email },
      publicKey,
      privateKey
    );
    //create key token
    const keyToken = await KeyTokenService.createKeyToken({
      userId: foundShop._id,
      publicKey,
      privateKey,
      refreshToken: token.refreshToken,
    });

    return {
      shop: getInfoData({
        field: ["_id", "name", "email"],
        object: foundShop,
      }),
      token,
    };
  };

  static signUp = async ({ name, email, password }) => {
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
        publicKeyEncoding: {
          type: "spki",
          format: "pem",
        },
        privateKeyEncoding: {
          type: "pkcs8",
          format: "pem",
        },
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
      return {
        shop: getInfoData({
          field: ["_id", "name", "email"],
          object: newShop,
        }),
        token,
      };
    }
    throw new ConflictResponse(`Error creating shop`);
  };
  static logout = async (keyStore) => {
    return KeyTokenService.removeKeyTokenById(keyStore._id);
  };
}

module.exports = AccessService;
