"use strict";

const { filter, update } = require("lodash");
const keytokenModel = require("../models/keytoken.model");
const mongoose = require("mongoose");
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

  static getKeyTokenByUserId = async (userId) => {
    return await keytokenModel.findOne({ user: userId }).lean();
  };

  static removeKeyTokenById = async (id) => {
    return await keytokenModel.deleteOne({ _id: id });
  };

  static getRefreshTokenUsed = async (refreshToken) => {
    return await keytokenModel
      .findOne({ refreshTokensUsed: refreshToken })
      .lean();
  };

  static getRefreshToken = async (refreshToken) => {
    return await keytokenModel.findOne({ refreshToken }).lean();
  };

  static updateRefreshTokenById = async (
    id,
    newRefreshToken,
    oldRefeshToken
  ) => {
    return await keytokenModel.updateOne({
      _id: id,
      $set: {
        refreshToken: newRefreshToken,
      },
      $addToSet: {
        refreshTokensUsed: oldRefeshToken,
      },
    });
  };

  static removeKeyTokenByUserId = async (userId) => {
    return await keytokenModel.findOneAndDelete({ user: userId });
  };
}
module.exports = KeyTokenService;
