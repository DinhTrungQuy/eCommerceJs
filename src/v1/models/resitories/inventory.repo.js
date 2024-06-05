const inventoryModel = require("../inventory.model");

const addInventory = async ({ productId, shopId, stock, location }) => {
  return await inventoryModel.create({
    inven_productId: productId,
    inven_stock: stock,
    inven_location: location,
    inven_shopId: shopId,
  });
};

const reservationInventory = async ({ product_id, quantity, cart_id }) => {
  const query = {
    inven_productId: product_id,
    inven_stock: { $gte: quantity },
  };
  const update = {
    $inc: {
      inven_stock: -quantity,
    },
    $push: {
      inven_reservation: {
        cart_id,
        quantity,
        createdAt: new Date(),
      },
    },
  };
  const options = { upsert: true, new: true };
  return await inventoryModel.updateOne(query, update, options);
};

module.exports = {
  addInventory,
  reservationInventory,
};
