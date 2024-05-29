"use strict";


const {
  BadRequestResponse,
  NotFoundResponse,
} = require("../core/error.response");
const {
  addDiscount,
  findDiscount,
  findAllDiscountCodesUnSelect,
  deleteDiscountCode,
  cancelDiscountCode,
} = require("../models/resitories/discount.repo");
const { convertToObjectIdMongodb } = require("../utils");
const {
  findAllProucts,
  checkoutProduct,
} = require("../models/resitories/product.repo");

class DiscountService {
  static async createDiscountCode(payload) {
    const {
      discount_name,
      discount_description,
      discount_value,
      discount_code,
      discount_start_date,
      discount_end_date,
      discount_max_uses,
      discount_max_uses_per_user,
      discount_min_order_value,
      discount_shopId,
      discount_is_active,
      discount_appiles_to,
      discount_product_ids,
    } = payload;

    if (
      new Date() < new Date(discount_start_date) ||
      new Date(discount_end_date) < new Date()
    ) {
      throw new BadRequestResponse(
        "Discount code has expired or not started yet"
      );
    }

    if (new Date(discount_start_date) > new Date(discount_end_date)) {
      throw new BadRequestResponse(
        "Start date must be before end date of discount code"
      );
    }
    const foundDiscount = await findDiscount({
      discount_code,
      discount_shopId,
    });
    if (foundDiscount) {
      throw new BadRequestResponse("Discount code already exists");
    }

    const newDiscount = await addDiscount({
      discount_name,
      discount_description,
      discount_value,
      discount_code,
      discount_start_date: new Date(discount_start_date),
      discount_end_date: new Date(discount_end_date),
      discount_max_uses,
      discount_max_uses_per_user,
      discount_min_order_value: discount_min_order_value || 0,
      discount_shopId,
      discount_is_active,
      discount_appiles_to,
      discount_product_ids:
        discount_appiles_to === "all" ? [] : discount_product_ids,
    });
    return newDiscount;
  }

  static async getAllProductsByDiscountCode({
    discount_code,
    discount_shopId,
    limit,
    page,
  }) {
    const foundDiscount = await findDiscount({
      discount_code,
      discount_shopId,
    });
    if (!foundDiscount) {
      throw new NotFoundResponse("Discount code already exists");
    }
    const { discount_appiles_to, discount_product_ids } = foundDiscount;
    if (discount_appiles_to === "all") {
      const result = await findAllProucts({
        limit: +limit,
        page: +page,
        filter: {
          isPublished: true,
          product_shop: convertToObjectIdMongodb(discount_shopId),
        },
        sort: "ctime",
        select: ["product_name"],
      });
      return result;
    }
    if (discount_appiles_to === "specific") {
      const result = await findAllProucts({
        limit: +limit,
        page: +page,
        filter: {
          isPublished: true,
          product_shop: convertToObjectIdMongodb(discount_shopId),
          _id: { $in: discount_product_ids },
        },
        sort: "ctime",
        select: ["product_name"],
      });
      return result;
    }
  }

  static async getAllDiscountCodeByShopId({
    limit,
    page,
    sort,
    filter,
    unSelect,
  }) {
    unSelect = unSelect || ["__v", "discount_shopId"];
    console.log(filter);
    const discounts = await findAllDiscountCodesUnSelect({
      limit: +limit,
      page: +page,
      sort,
      filter,
      unSelect: ["__v", "discount_shopId"],
    });
    return discounts;
  }

  // Get discount
  static async getDiscountAmount({ discount_code, shopId, userId, products }) {
    const foundDiscount = await findDiscount({
      discount_code,
      discount_shopId: shopId,
    });
    if (!foundDiscount) {
      throw new NotFoundResponse("Discount code not found");
    }
    const {
      discount_value,
      discount_is_active,
      discount_max_uses,
      discount_start_date,
      discount_end_date,
      discount_min_order_value,
      discount_max_uses_per_user,
      discount_users_used,
      discount_type,
    } = foundDiscount;
    if (!discount_is_active) {
      throw new BadRequestResponse("Discount code is not active");
    }
    if (!discount_max_uses) {
      throw new BadRequestResponse("Discount code has been used up");
    }
    if (
      new Date() < new Date(discount_start_date) ||
      new Date(discount_end_date) < new Date()
    ) {
      throw new BadRequestResponse(
        "Discount code has expired or not started yet"
      );
    }
    let totalOrder = 0;
    if (discount_min_order_value > 0) {
      const discount_products = await checkoutProduct({
        item_products: products,
        shop_id: shopId,
      });
      totalOrder = discount_products.reduce(
        (acc, product) => acc + product.product_price * product.quantity,
        0
      );
      if (totalOrder < discount_min_order_value) {
        throw new BadRequestResponse(
          "Order value must be greater than " + discount_min_order_value
        );
      }
      if (discount_max_uses_per_user > 0) {
        // Check user has used discount code
        const userUseDiscount = discount_users_used.find(
          (v) => v.userId === userId
        );
        if (userUseDiscount) {
          throw new BadRequestResponse(
            "You have already used this discount code"
          );
        }
      }
    }
    const amount =
      discount_type === "fixed"
        ? discount_value
        : totalOrder * (discount_value / 100);
    return {
      totalOrder,
      discount: amount,
      totalPrice: totalOrder - amount,
    };
  }

  static async deleteDiscountCode({ discount_shopId, discount_code }) {
    return await deleteDiscountCode({ discount_shopId, discount_code });
  }

  static cancelDiscountCode({ shopId, discount_code, userId }) {
    return cancelDiscountCode({ shopId, discount_code, userId });
  }
}

module.exports = DiscountService;
