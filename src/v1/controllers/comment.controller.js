"use strict";

const { OK, Created } = require("../core/success.response");
const CommentService = require("../services/comment.service");

class CommentController {
  createComment = async (req, res, next) => {
    let comment = await CommentService.createComment({
      userId: req.userId,
      ...req.body,
    });
    return new Created({
      metadata: comment,
    }).send(res);
  };

  getCommentsByParentId = async (req, res, next) => {
    let comments = await CommentService.getCommentsByParentId(req.params);
    return new OK({
      metadata: comments,
    }).send(res);
  };
}

module.exports = new CommentController();
