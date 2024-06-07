"use strict";

const commentModel = require("../models/comment.model");
const { BadRequestResponse } = require("../core/error.response");
const { convertToObjectIdMongodb } = require("../utils");
class CommentService {
  static async createComment({ comment, parentId, userId, productId }) {
    let rightValue = 0;
    const commentCreated = await commentModel.create({
      comment_content: comment,
      comment_parentId: parentId,
      comment_userId: userId,
      comment_productId: convertToObjectIdMongodb(productId),
    });
    //check if the comment has a parent
    if (parentId) {
      const foundParentComment = await commentModel.findById(parentId);
      if (!foundParentComment) {
        throw new BadRequestResponse("Parent comment not found");
      }
      // get right value of the parent comment
      rightValue = foundParentComment.comment_right;
      console.log(rightValue);
      // update right and left value of the parent comment
      await commentModel.updateMany(
        {
          comment_productId: convertToObjectIdMongodb(productId),
          comment_right: { $gte: rightValue },
        },
        {
          $inc: {
            comment_right: 2,
          },
        }
      );
      await commentModel.updateMany(
        {
          comment_productId: convertToObjectIdMongodb(productId),
          comment_left: { $gt: rightValue },
        },
        {
          $inc: {
            comment_left: 2,
          },
        }
      );
      commentCreated.comment_right = rightValue + 1;
      commentCreated.comment_left = rightValue;
      await commentCreated.save();
      return commentCreated;
    }
    // get greatest right value of the comments
    const foundComment = await commentModel.findOne(
      {
        comment_parentId: parentId,
      },
      "comment_right",
      { sort: { comment_right: -1 } }
    );
    if (foundComment) {
      rightValue = foundComment.comment_right + 1;
    } else {
      rightValue = 1;
    }
    commentCreated.comment_right = rightValue + 1;
    commentCreated.comment_left = rightValue;
    await commentCreated.save();
    return commentCreated;
  }
  static async getCommentsByParentId({
    parentId,
    productId,
    limit = 50,
    offset = 0,
  }) {
    if (parentId) {
      const parentComment = await commentModel.findById(parentId);
      if (!parentComment) {
        throw new BadRequestResponse("Parent comment not found");
      }
      const comments = await commentModel
        .find({
          comment_parentId: convertToObjectIdMongodb(parentId),
          comment_productId: convertToObjectIdMongodb(productId),
          comment_left: { $gt: parentComment.comment_left },
          comment_right: { $lt: parentComment.comment_right },
        })
        .limit(limit)
        .skip(offset);
      return comments;
    }
    const comments = await commentModel
      .find({
        comment_parentId: null,
        comment_productId: convertToObjectIdMongodb(productId),
      })
      .limit(limit)
      .skip(offset);
    return comments;
  }

  static async deleteCommentById({ commentId }) {
    const foundComment = await commentModel.findById(
      convertToObjectIdMongodb(commentId)
    );
    if (!foundComment) {
      throw new BadRequestResponse("Comment not found");
    }
    const width = foundComment.comment_right - foundComment.comment_left + 1;
    const result = await commentModel.deleteMany({
      comment_productId: foundComment.comment_productId,
      comment_left: { $gte: foundComment.comment_left },
      comment_right: { $lte: foundComment.comment_right },
    });
    await commentModel.updateMany(
      {
        comment_productId: foundComment.comment_productId,
        comment_right: { $gte: foundComment.comment_right },
      },
      {
        $inc: {
          comment_right: -width,
        },
      }
    );
    await commentModel.updateMany(
      {
        comment_productId: foundComment.comment_productId,
        comment_left: { $gt: foundComment.comment_right },
      },
      {
        $inc: {
          comment_left: -width,
        },
      }
    );
    return result;
  }
}

module.exports = CommentService;
