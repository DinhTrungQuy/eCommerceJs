"use strict";

const express = require("express");
const { apiKey, permissions } = require("../auth/checkAuth");
const asyncHandler = require("../helper/asyncHandler");
const router = express.Router();

// check api token
router.use(asyncHandler(apiKey));

// check permissions
router.use(permissions("0000"));

router.use("/api/product", require("./product"));
router.use("/api/discount", require("./discount"));
router.use("/api/cart", require("./cart"));
router.use("/api/checkout", require("./checkout"));
router.use("/api/comments", require("./comment"));
router.use("/api", require("./access"));

module.exports = router;
