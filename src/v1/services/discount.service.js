"use strict";

const discountModel = require("../models/discount.model");

const { BadRequestResponse } = require("../core/error.response");
const {
  addDiscount,
  findDiscount,
  findAllDiscountCodesUnSelect,
} = require("../models/resitories/discount.repo");
const { convertToObjectIdMongodb } = require("../utils");
const { findAllProucts } = require("../models/resitories/product.repo");

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
      discount_shopId: convertToObjectIdMongodb(discount_shopId),
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
      discount_shopId: convertToObjectIdMongodb(discount_shopId),
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
      discount_shopId: convertToObjectIdMongodb(discount_shopId),
    });
    if (!foundDiscount) {
      throw new BadRequestResponse("Discount code already exists");
    }
    const { discount_appiles_to, discount_product_ids } = foundDiscount;
    if (discount_appiles_to === "all") {
      return findAllProucts({
        limit: +limit,
        page: +page,
        filter: {
          isPublished: true,
          product_shop: convertToObjectIdMongodb(discount_shopId),
        },
        sort: "ctime",
        select: ["product_name"],
      });
    }
    if (discount_appiles_to === "specific") {
      return findAllProucts({
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
    }
  }

  static async getAllDiscountCodeByShopId({
    limit,
    page,
    sort,
    filter,
    unSelect,
  }) {
    const discounts = await findAllDiscountCodesUnSelect({
      limit: +limit,
      page: +page,
      sort,
      filter,
      unSelect,
    });
    return discounts;
  }
}
