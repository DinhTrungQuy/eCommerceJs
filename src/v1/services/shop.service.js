"use strict";

const shopModel = require("../models/shop.model");

const findByEmail = async (email) => {
  return await shopModel.findOne({ email: email }).lean();
};
