"use strict";
const { NotFoundResponse } = require("../core/error.response");
const { findCartById } = require("../models/resitories/cart.repo");
const { checkoutProduct } = require("../models/resitories/product.repo");
const { getDiscountAmount } = require("./discount.service");

class CheckoutService {
  static async checkoutReview({ cart_id, userId, shop_order_ids }) {
    const foundCart = await findCartById({ cart_id });
    if (!foundCart) {
      throw new NotFoundResponse("Cart not found");
    }
    const checkout_order = {
      totalPrice: 0,
      feeShip: 0,
      totalDiscount: 0,
      totalCheckout: 0,
    };
    for (let i = 0; i < shop_order_ids.length; i++) {
      const { shop_id, shop_discount, item_products } = shop_order_ids[i];
      const checkout = await checkoutProduct({ item_products, shop_id });
      checkout_order.totalPrice = checkout.reduce(
        (acc, item) => acc + item.product_price * item.quantity,
        0
      );
      const discount = await getDiscountAmount({
        discount_code: shop_discount,
        shopId: shop_id,
        products: item_products,
      });
      checkout_order.totalDiscount += discount.discount;
      checkout_order.totalCheckout =
        checkout_order.totalPrice - checkout_order.totalDiscount;
    }
    return checkout_order;
  }

  static async orderByUser() {
    const {} = await CheckoutService.checkoutReview({
      cart_id,
      userId,
      shop_order_ids,
    });
  }
}
module.exports = CheckoutService;
