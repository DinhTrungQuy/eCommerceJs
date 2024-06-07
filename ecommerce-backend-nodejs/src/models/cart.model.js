const mongoose = require("mongoose");

const DOCUMENT_NAME = "Cart";
const COLLECTION_NAME = "Carts";

var cartSchema = new mongoose.Schema(
  {
    cart_userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shop",
      required: true,
    },
    cart_state: {
      type: String,
      required: true,
      default: "active",
      enum: ["active", "complete", "pending", "failed"],
    },
    // Include the productId and quantity
    cart_products: {
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

//Export the model
module.exports = mongoose.model(DOCUMENT_NAME, cartSchema);
