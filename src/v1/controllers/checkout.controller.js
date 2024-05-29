"use strict";

const { OK, Created } = require("../core/success.response");
const CheckoutService = require("../services/checkout.service");

class CheckoutController {
  checkoutReview = async (req, res, next) => {
    let checkoutReview = await CheckoutService.checkoutReview({
      userId: req.userId,
      ...req.body,
    });
    return new OK({
      metadata: checkoutReview,
      message: "Checkout review successfully",
    }).send(res);
  };
}

module.exports = new CheckoutController();
