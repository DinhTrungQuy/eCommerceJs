const mongoose = require("mongoose"); // Erase if already required

const DOCUMENT_NAME = "Comment";
const COLLECTION_NAME = "Comments";
// Declare the Schema of the Mongo model
var commentSchema = new mongoose.Schema(
  {
    comment_productId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Product",
    },
    comment_userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Shop",
    },
    comment_content: {
      type: String,
      required: true,
    },
    comment_left: {
      type: Number,
      default: 0,
    },
    comment_right: {
      type: Number,
      default: 0,
    },
    comment_parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
      default: null,
    },
    isDeleted: {
      type: Boolean,
      default: false,
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

//Export the model
module.exports = mongoose.model(DOCUMENT_NAME, commentSchema);
