const inventoryModel = require("../inventory.model");

const addInventory = async ({ productId, shopId, stock, location }) => {
  return await inventoryModel.create({
    inven_productId: productId,
    inven_stock: stock,
    inven_location: location,
    inven_shopId: shopId,
  });
};

module.exports = {
  addInventory,
};
