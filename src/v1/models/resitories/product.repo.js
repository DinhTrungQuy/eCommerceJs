"use strict";

const { BadRequestResponse } = require("../../core/error.response");
const {
  clothingModel,
  electronicModel,
  furnitureModel,
  productModel,
} = require("../../models/product.model");

const { Types } = require("mongoose");
const { getSelectData, unGetSelectData } = require("../../utils");

const querryProduct = async ({ querry, limit, skip }) => {
  return await productModel
    .find(querry)
    .populate("product_shop", "name email -_id")
    .skip(skip)
    .limit(limit)
    .lean()
    .exec();
};
const findAllProucts = async ({ limit, sort, page, filter, select }) => {
  const skip = limit * (page - 1);
  const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };
  const products = await productModel
    .find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getSelectData(select))
    .lean()
    .exec();
  return products;
};

const findProductById = async ({ product_id, unselect }) => {
  return await productModel
    .findById(product_id)
    .select(unGetSelectData(unselect))
    .lean()
    .exec();
};

const findAllDraftProuctsByShop = async ({ querry, limit = 50, skip = 0 }) => {
  return await querryProduct({ querry, limit, skip });
};

const findAllPublishedProuctsForShop = async ({
  querry,
  limit = 50,
  skip = 0,
}) => {
  return await querryProduct({ querry, limit, skip });
};

const publishProductByShop = async ({ product_shop, product_id }) => {
  const foundShop = await productModel.findOne({
    product_shop: Types.ObjectId.createFromHexString(product_shop),
    _id: Types.ObjectId.createFromHexString(product_id),
  });
  if (!foundShop) throw new BadRequestResponse("Product not found");
  const { modifiedCount } = await productModel.updateOne({
    isPublished: true,
    isDraft: false,
  });
  return modifiedCount;
};

const unPublishProductByShop = async ({ product_shop, product_id }) => {
  const foundShop = await productModel.findOne({
    product_shop: Types.ObjectId.createFromHexString(product_shop),
    _id: Types.ObjectId.createFromHexString(product_id),
  });
  if (!foundShop) throw new BadRequestResponse("Product not found");
  const { modifiedCount } = await productModel.updateOne({
    isPublished: false,
    isDraft: true,
  });
  return modifiedCount;
};

const searchProduct = async ({ keySearch, limit, skip }) => {
  const regexSearch = new RegExp(keySearch, "i");
  const result = await productModel
    .find(
      {
        $text: {
          $search: regexSearch,
        },
        isPublished: true,
      },
      { score: { $meta: "textScore" } }
    )
    .sort({ score: { $meta: "textScore" } })
    .skip(skip)
    .limit(limit)
    .lean()
    .exec();
  return result;
};

const updateProductById = async ({
  productId,
  payload,
  model,
  isNew = true,
}) => {
  return await model.findByIdAndUpdate(productId, payload, {
    new: isNew,
  });
};

module.exports = {
  findAllProucts,
  findProductById,
  findAllDraftProuctsByShop,
  findAllPublishedProuctsForShop,
  publishProductByShop,
  unPublishProductByShop,
  searchProduct,
  updateProductById,
};
