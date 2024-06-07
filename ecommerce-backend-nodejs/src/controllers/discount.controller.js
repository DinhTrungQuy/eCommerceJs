"use strict";

const { OK, Created } = require("../core/success.response");
const DiscountService = require("../services/discount.service");

class DiscountController {
  createDiscountCode = async (req, res, next) => {
    let discountCode = await DiscountService.createDiscountCode({
      ...req.body,
      discount_shopId: req.userId,
    });
    return new Created({
      metadata: discountCode,
      message: "Created discount code successfully",
    }).send(res);
  };

  getAllProductsByDiscountCode = async (req, res, next) => {
    let products = await DiscountService.getAllProductsByDiscountCode(
      req.query
    );
    return new OK({
      metadata: products,
      message: "Get all products by discount code successfully",
    }).send(res);
  };

  getAllDiscountCodeByShopId = async (req, res, next) => {
    let discountCodes = await DiscountService.getAllDiscountCodeByShopId({
      ...req.query,
      filter: {
        discount_shopId: req.userId,
      },
    });
    return new OK({
      metadata: discountCodes,
      message: "Get all discount codes by shop id successfully",
    }).send(res);
  };

  getDiscountAmount = async (req, res, next) => {
    let discountAmount = await DiscountService.getDiscountAmount({
      ...req.body,
    });
    return new OK({
      metadata: discountAmount,
      message: "Get discount amount successfull",
    }).send(res);
  };

  deleteDiscountCode = async (req, res, next) => {
    await DiscountService.deleteDiscountCode({
      ...req.query,
      discount_shopId: req.userId,
    });
    return new OK({ message: "Delete discount code successfully" }).send(res);
  };

  cancelDiscountCode = async (req, res, next) => {
    await DiscountService.cancelDiscountCode({
      ...req.body,
      discount_shopId: userId,
    });
    return new OK({ message: "Cancel discount code successfully" }).send(res);
  };
}

module.exports = new DiscountController();
