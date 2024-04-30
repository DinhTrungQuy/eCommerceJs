"use strict";

const express = require("express");
const { apiKey, permissions } = require("../auth/checkAuth");
const router = express.Router();

// check api token
router.use(apiKey);

// check permissions
router.use(permissions("0000"));


router.use("/v1/api", require("./access/index"));

module.exports = router;
