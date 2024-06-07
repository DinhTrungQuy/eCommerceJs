const mongoose = require("mongoose"); // Erase if already required

const DOCUMENT_NAME = "Order";
const COLLECTION_NAME = "Orders";
// Declare the Schema of the Mongo model
var orderSchema = new mongoose.Schema(
  {
    order_user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Shop",
    },
    order_checkout: {
      type: Object,
      default: {},
    },
    order_shipping: {
      type: Object,
      default: {},
    },
    order_payment: {
      type: Object,
      default: {},
    },
    order_products: {
      type: Array,
      default: [],
      required: true,
    },
    order_status: {
      type: String,
      required: true,
      default: "pending",
      enum: ["pending", "complete", "failed", "shipped", "cancelled"],
    },
  },
  { timestamps: true, collection: COLLECTION_NAME }
);

//Export the model
module.exports = mongoose.model(DOCUMENT_NAME, orderSchema);
