"use strict";

const express = require("express");
const asyncHandler = require("../../helper/asyncHandler");
const { authentication } = require("../../auth/authUltils");
const discountController = require("../../controllers/discount.controller");
const router = express.Router();

router.post("/amount", asyncHandler(discountController.getDiscountAmount));
router.get(
  "/list_product_code",
  asyncHandler(discountController.getAllProductsByDiscountCode)
);
router.get("", asyncHandler(discountController.getAllDiscountCodeByShopId));

router.use(authentication);

router.post("", asyncHandler(discountController.createDiscountCode));

router.delete("", asyncHandler(discountController.deleteDiscountCode));

module.exports = router;
