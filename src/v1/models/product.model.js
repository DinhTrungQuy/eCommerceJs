const { lowerCase } = require("lodash");
const mongoose = require("mongoose");
const slugify = require("slugify");

const DOCUMENT_NAME = "Product";
const COLLECTION_NAME = "Products";

var productSchema = new mongoose.Schema(
  {
    product_name: {
      type: String,
      required: true,
    },
    product_thumb: {
      type: String,
      required: true,
    },
    product_slug: {
      type: String,
    },
    product_description: {
      type: String,
      required: true,
    },
    product_price: {
      type: Number,
      required: true,
    },
    product_quantity: {
      type: Number,
      required: true,
    },
    product_type: {
      type: String,
      required: true,
      enum: ["Electronic", "Clothing", "Furniture"],
    },
    product_shop: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Shop",
    },
    product_attribute: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    product_rating: {
      type: Number,
      default: 1,
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating must be less than or equal to 5"],
      set: (v) => Math.round(v * 10) / 10,
    },
    product_variation: {
      type: Array,
      default: [],
    },
    isDraft: {
      type: Boolean,
      default: true,
      index: true,
      select: false,
    },
    isPublished: {
      type: Boolean,
      default: false,
      index: true,
      select: false,
    },
  },
  { timestamps: true, collection: COLLECTION_NAME }
);
//Create Index
productSchema.index({ product_name: "text", product_description: "text" });

productSchema.pre("save", function (next) {
  this.product_slug = slugify(this.product_name, { lowerCase: true });
  next();
});

var electronicSchema = new mongoose.Schema(
  {
    manufracture: {
      type: String,
      required: true,
    },
    size: {
      type: String,
      required: true,
    },
    color: {
      type: String,
    },
    product_shop: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Shop",
    },
  },
  { timestamps: true, collection: "Electronics" }
);

var clothingSchema = new mongoose.Schema(
  {
    brand: {
      type: String,
      required: true,
    },
    size: {
      type: String,
      required: true,
    },
    material: {
      type: String,
    },
    product_shop: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Shop",
    },
  },
  { timestamps: true, collection: "Clothes" }
);

var furnitureSchema = new mongoose.Schema(
  {
    brand: {
      type: String,
      required: true,
    },
    size: {
      type: String,
      required: true,
    },
    material: {
      type: String,
    },
    product_shop: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Shop",
    },
  },
  { timestamps: true, collection: "Furnitures" }
);

module.exports = {
  productModel: mongoose.model(DOCUMENT_NAME, productSchema),
  electronicModel: mongoose.model("Electronic", electronicSchema),
  clothingModel: mongoose.model("Clothing", clothingSchema),
  furnitureModel: mongoose.model("Furniture", furnitureSchema),
};
