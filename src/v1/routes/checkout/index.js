"use strict";

const express = require("express");
const asyncHandler = require("../../helper/asyncHandler");
const { authentication } = require("../../auth/authUltils");
const checkoutController = require("../../controllers/checkout.controller");
const router = express.Router();

router.use(authentication);

router.post("", asyncHandler(checkoutController.checkoutReview));

module.exports = router;
