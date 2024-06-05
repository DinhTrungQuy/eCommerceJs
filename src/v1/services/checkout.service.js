"use strict";
const { NotFoundResponse } = require("../core/error.response");
const { findCartById } = require("../models/resitories/cart.repo");
const { checkoutProduct } = require("../models/resitories/product.repo");
const { getDiscountAmount } = require("./discount.service");
const RedisService = require("./redis.service");

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
      shop_order_ids_new: shop_order_ids,
    };
    for (let i = 0; i < shop_order_ids.length; i++) {
      let { shop_id, shop_discount, item_products } = shop_order_ids[i];
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
      checkout_order.shop_order_ids_new[i].item_products = discount.products;
      checkout_order.totalDiscount += discount.discount;
      checkout_order.totalCheckout =
        checkout_order.totalPrice - checkout_order.totalDiscount;
    }
    return checkout_order;
  }

  static async orderByUser({ cart_id, userId, shop_order_ids }) {
    const {
      totalPrice,
      feeShip,
      totalDiscount,
      totalCheckout,
      shop_order_ids_new,
    } = await CheckoutService.checkoutReview({
      cart_id,
      userId,
      shop_order_ids,
    });
    const products = shop_order_ids_new.flatMap((v) => v.item_products);
    const redisClient = RedisService.createService();
    await redisClient.createClient();
    for (let index = 0; index < products.length; index++) {
      console.log(products[index]);
      const lockKey = await redisClient.acquireLock({
        product_id: products[index].product_id,
        quantity: products[index].quantity,
        cart_id: cart_id,
      });
      if (lockKey) {
        redisClient.releaseLock(lockKey);
      }
    }
  }
}
module.exports = CheckoutService;
