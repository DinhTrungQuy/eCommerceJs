"use strict";

const express = require("express");
const router = express.Router();

router.get("/v1/api", require("./access"));

module.exports = router;
