"use strict";

const express = require("express");
const asyncHandler = require("../../helper/asyncHandler");
const { authentication } = require("../../auth/authUltils");
const CartController = require("../../controllers/cart.controller");
const router = express.Router();

router.use(authentication);
router.get("", asyncHandler(CartController.getUserCart));
router.post("", asyncHandler(CartController.addToCart));
router.post("/update", asyncHandler(CartController.updateUserCart));
router.delete(
  "/:product_id",
  asyncHandler(CartController.deleteProductInUserCart)
);

module.exports = router;
