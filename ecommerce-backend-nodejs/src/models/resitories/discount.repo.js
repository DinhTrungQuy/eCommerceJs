const discountModel = require("../discount.model");
const {
  convertToObjectIdMongodb,
  getSelectData,
  unGetSelectData,
} = require("../../utils");

const findDiscount = async ({ discount_code, discount_shopId }) => {
  return await discountModel.findOne({
    discount_code,
    discount_shopId: convertToObjectIdMongodb(discount_shopId),
  });
};

const addDiscount = async ({
  discount_name,
  discount_description,
  discount_value,
  discount_code,
  discount_start_date,
  discount_end_date,
  discount_max_uses,
  discount_max_uses_per_user,
  discount_min_order_value,
  discount_shopId,
  discount_is_active,
  discount_appiles_to,
  discount_product_ids,
}) => {
  return await discountModel.create({
    discount_name,
    discount_description,
    discount_value,
    discount_code,
    discount_start_date,
    discount_end_date,
    discount_max_uses,
    discount_max_uses_per_user,
    discount_min_order_value,
    discount_shopId: convertToObjectIdMongodb(discount_shopId),
    discount_is_active,
    discount_appiles_to,
    discount_product_ids,
  });
};

const getAllDiscountCodesWithProduct = async ({
  discount_code,
  discount_shopId,
}) => {};

const findAllDiscountCodesUnSelect = async ({
  limit,
  page,
  sort = "ctime",
  filter = {},
  unSelect,
}) => {
  const skip = limit * (page - 1);
  const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };
  const result = await discountModel
    .find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(unGetSelectData(unSelect))
    .lean()
    .exec();
  return result;
};

const findAllDiscountCodesSelect = async ({
  limit,
  page,
  sort,
  filter,
  select,
}) => {
  const skip = limit * (page - 1);
  const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };
  const result = await discountModel
    .find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getSelectData(select))
    .lean()
    .exec();
  return result;
};

const deleteDiscountCode = async ({ discount_shopId, discount_code }) => {
  return await discountModel.findOneAndDelete({
    discount_code,
    discount_shopId: convertToObjectIdMongodb(discount_shopId),
  });
};

const cancelDiscountCode = async ({ shopId, discount_code, userId }) => {
  const foundDiscount = await findDiscount({
    discount_code,
    discount_shopId: convertToObjectIdMongodb(shopId),
  });
  if (!foundDiscount) {
    throw new Error("Discount code not found");
  }
  if (foundDiscount.discount_appiles_to === "all") {
    return await discountModel.findByIdAndUpdate({});
  }
  const result = await discountModel.findByIdAndUpdate({
    $pull: {
      discount_users_used: userId,
    },
    $inc: {
      discount_max_uses: 1,
      discount_uses_count: -1,
    },
  });
  return result;
};

module.exports = {
  findDiscount,
  addDiscount,
  getAllDiscountCodesWithProduct,
  findAllDiscountCodesUnSelect,
  findAllDiscountCodesSelect,
  deleteDiscountCode,
  cancelDiscountCode,
};
