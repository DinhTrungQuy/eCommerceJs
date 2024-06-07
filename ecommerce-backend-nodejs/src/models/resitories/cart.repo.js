"use strict";
const { NotFoundResponse } = require("../../core/error.response");
const { convertToObjectIdMongodb } = require("../../utils");
const cartModel = require("../cart.model");

const createUserCart = async ({ userId, product }) => {
  const query = { cart_userId: userId, cart_state: "active" };
  const updateOrInsert = {
    $addToSet: {
      cart_products: product,
    },
  };
  const options = { upsert: true, new: true };
  return cartModel.create(query, updateOrInsert, options);
};

const findCartById = async ({ cart_id }) => {
  return await cartModel
    .findOne({
      _id: convertToObjectIdMongodb(cart_id),
      cart_state: "active",
    })
    .lean();
};

const updateProductToCart = async ({ product, userId }) => {
  const query = { cart_userId: userId, cart_state: "active" };
  const update = {
    $push: {
      cart_products: product,
    },
  };
  const options = { upsert: true, new: true };
  return await cartModel.findOneAndUpdate(query, update, options);
};

const updateUserCartQuantitySet = async ({ userId, product }) => {
  const { product_id, quantity } = product;
  const query = {
    cart_userId: convertToObjectIdMongodb(userId),
    "cart_products.product_id": product_id,
  };
  const fountProduct = await cartModel.findOne(query);
  if (!fountProduct) {
    return await updateProductToCart({ userId, product });
  }
  const update = {
    $set: {
      "cart_products.$.quantity": quantity,
    },
  };
  const options = { upsert: true, new: true };
  return await cartModel.findOneAndUpdate(query, update, options);
};

const updateUserCartQuantityInc = async ({ userId, product }) => {
  const { product_id, quantity } = product;
  const query = {
    cart_userId: convertToObjectIdMongodb(userId),
    "cart_products.product_id": product_id,
  };
  const fountProduct = await cartModel.findOne(query);
  if (!fountProduct) {
    return await updateProductToCart({ userId, product });
  }
  const update = {
    $inc: {
      "cart_products.$.quantity": quantity,
    },
  };
  const options = { upsert: true, new: true };
  return await cartModel.findOneAndUpdate(query, update, options);
};

const deleteProductInUserCart = async ({ userId, product_id }) => {
  const query = { cart_userId: userId, cart_state: "active" };
  const update = {
    $pull: {
      cart_products: { product_id },
    },
  };
  const options = { new: true };
  // Update the cart to remove the specified product
  const updatedCart = await cartModel.findOneAndUpdate(query, update, options);

  // Check if the cart was found and updated
  if (!updatedCart) {
    throw new NotFoundResponse("Cart not found or product not in cart");
  }

  return updatedCart;
};

module.exports = {
  createUserCart,
  findCartById,
  updateUserCartQuantitySet,
  updateUserCartQuantityInc,
  updateProductToCart,
  deleteProductInUserCart,
};
