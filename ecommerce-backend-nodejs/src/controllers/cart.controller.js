"use strict";

const { OK, Created } = require("../core/success.response");
const CartService = require("../services/cart.service");

class CartController {
  async createUserCart(req, res, next) {
    let cart = await CartService.createUserCart({
      userId: req.userId,
      product: req.body.product,
    });
    return new Created({
      metadata: cart,
      message: "Create Cart Successfully",
    }).send(res);
  }

  async addToCart(req, res, next) {
    let cart = await CartService.addToCart({
      userId: req.userId,
      product: req.body.product,
    });
    return new Created({
      metadata: cart,
      message: "Add Product To Cart Successfully",
    }).send(res);
  }

  async deleteProductInUserCart(req, res, next) {
    let cart = await CartService.deleteProductInUserCart({
      userId: req.userId,
      product_id: req.params.product_id,
    });
    return new OK({
      metadata: cart,
      message: "Delete Product From Cart Successfully",
    }).send(res);
  }

  async getUserCart(req, res, next) {
    let cart = await CartService.getUserCart({
      userId: req.userId,
    });
    return new OK({
      metadata: cart,
      message: "Get User Cart Successfully",
    }).send(res);
  }

  async updateUserCart(req, res, next) {
    try {
      let cart = await CartService.addToCartV2({
        userId: req.userId,
        shop_oder_ids: req.body.shop_oder_ids,
      });
      return new OK({
        metadata: cart,
        message: "Update User Cart Successfully",
      }).send(res);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new CartController();
