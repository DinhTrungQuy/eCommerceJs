"use strict";
const {
  BadRequestResponse,
  NotFoundResponse,
} = require("../core/error.response");
const cartModel = require("../models/cart.model");
const {
  createUserCart,
  deleteProductInUserCart,
  updateUserCartQuantityInc,
  updateUserCartQuantitySet,
} = require("../models/resitories/cart.repo");
const { findProductById } = require("../models/resitories/product.repo");

class CartService {
  static async createUserCart({ userId, product }) {
    return await createUserCart({ userId, product });
  }

  static async updateUserCartQuantity({ userId, product }) {
    return await updateUserCartQuantity({ userId, product });
  }

  static async addToCart({ userId, product = {} }) {
    const userCart = await cartModel.findOne({ cart_userId: userId });
    if (!userCart) {
      return createUserCart({ userId, product });
    }
    if (!userCart.cart_products.length) {
      userCart.cart_products = [product];
      return userCart.save();
    }
    return await updateUserCartQuantitySet({ userId, product });
  }

  static async addToCartV2({ userId, shop_oder_ids }) {
    for (let i = 0; i < shop_oder_ids.length; i++) {
      let v = shop_oder_ids[i];
      const { product_id, quantity, old_quantity } = v;
      console.log(product_id);
      const foundProduct = await findProductById({ product_id });
      if (!foundProduct) {
        throw new NotFoundResponse("Product not found");
      }
      if (foundProduct.product_shop.toString() !== v.shop_id) {
        throw new BadRequestResponse("Product not found in shop");
      }
      if (quantity === 0) {
        await deleteProductInUserCart({ userId, productId: product_id });
      }
      await updateUserCartQuantityInc({
        userId,
        product: {
          product_id,
          quantity: quantity - old_quantity,
        },
      });
    }
  }

  static async deleteProductInUserCart({ userId, product_id }) {
    return await deleteProductInUserCart({ userId, product_id });
  }

  static async getUserCart({ userId }) {
    return await cartModel.findOne({ cart_userId: userId }).lean();
  }
}

module.exports = CartService;
