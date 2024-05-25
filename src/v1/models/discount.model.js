const mongoose = require("mongoose"); // Erase if already required

const DOCUMENT_NAME = "Discount";
const COLLECTION_NAME = "Discounts";
// Declare the Schema of the Mongo model
var discountSchema = new mongoose.Schema(
  {
    discount_name: {
      type: String,
      require: true,
    },
    discount_description: {
      type: String,
      require: true,
    },
    discount_type: {
      type: String,
      default: "fixed_amount",
    },
    discount_value: {
      type: Number,
      require: true,
    },
    discount_code: {
      type: String,
      require: true,
      unique: true,
    },
    discount_start_date: {
      type: Date,
      require: true,
    },
    discount_end_date: {
      type: Date,
      require: true,
    },
    discount_max_uses: {
      type: Number,
      require: true,
    },
    // Store the number of times the discount has been used
    discount_uses_count: {
      type: Number,
      default: 0,
    },
    discount_users_used: {
      type: Array,
      default: [],
    },
    discount_max_uses_per_user: {
      type: Number,
      require: true,
    },
    discount_min_order_value: {
      type: Number,
      require: true,
    },
    discount_shopId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Shop",
    },
    discount_is_active: {
      type: Boolean,
      default: true,
    },
    discount_appiles_to: {
      type: String,
      required: true,
      enum: ["all", "specific"],
    },
    discount_product_ids: {
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
module.exports = mongoose.model(DOCUMENT_NAME, discountSchema);
