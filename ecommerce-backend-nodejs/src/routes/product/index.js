"use strict";

const express = require("express");
const asyncHandler = require("../../helper/asyncHandler");
const { authentication } = require("../../auth/authUltils");
const productController = require("../../controllers/product.controller");
const router = express.Router();

router.get("/search/:keySearch", asyncHandler(productController.searchProduct));

router.get("", asyncHandler(productController.getAllProducts));

router.get("/:product_id", asyncHandler(productController.getProduct));

router.use(authentication);

router.post("", asyncHandler(productController.createProduct));

router.get("/draft/all", asyncHandler(productController.getAllDraftForShop));

router.get(
  "/published/all",
  asyncHandler(productController.getAllPublishedForShop)
);

router.post(
  "/publish/:product_id",
  asyncHandler(productController.publishProductByShop)
);
router.post(
  "/unpublish/:product_id",
  asyncHandler(productController.unPublishProductByShop)
);

router.patch("/:product_id", asyncHandler(productController.updateProduct));

module.exports = router;
