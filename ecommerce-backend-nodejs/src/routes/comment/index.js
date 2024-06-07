"use strict";

const express = require("express");
const asyncHandler = require("../../helper/asyncHandler");
const { authentication } = require("../../auth/authUltils");
const commentController = require("../../controllers/comment.controller");
const router = express.Router();

router.get("", asyncHandler(commentController.getCommentsByParentId));
router.use(authentication);

router.post("", asyncHandler(commentController.createComment));
router.delete("/:id", asyncHandler(commentController.deleteCommentById));

module.exports = router;
