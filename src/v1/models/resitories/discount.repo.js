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
  await discountModel.create({
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

const updateDiscount = async () => {
  const {} = discountModel.findByIdAndUpdate();
};

const getAllDiscountCodesWithProduct = async ({
  discount_code,
  discount_shopId,
}) => {};

const findAllDiscountCodesUnSelect = async ({
  limit,
  page,
  sort = "ctime",
  filter,
  unSelect,
}) => {
  const skip = limit * (page - 1);
  const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };
  return await discountModel
    .find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(unGetSelectData(unSelect))
    .lean()
    .exec();
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
  return await discountModel
    .find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getSelectData(select))
    .lean()
    .exec();
};

module.exports = {
  findDiscount,
  addDiscount,
  updateDiscount,
  getAllDiscountCodesWithProduct,
  findAllDiscountCodesUnSelect,
  findAllDiscountCodesSelect,
};
