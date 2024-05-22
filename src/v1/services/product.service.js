"use strict";

const { BadRequestResponse } = require("../core/error.response");

const {
  productModel,
  clothingModel,
  electronicModel,
} = require("../models/product.model");
const {
  findAllDraftProuctsByShop,
  findAllPublishedProuctsForShop,
  publishProductByShop,
  unPublishProductByShop,
  searchProduct,
  findAllProucts,
  findProductById,
} = require("../models/resitories/product.repo");

class ProductFactory {
  static productRegistry = {};
  static registProducts(type, className) {
    this.productRegistry[type] = className;
  }

  static createProduct(type, payload) {
    const productClass = this.productRegistry[type];
    if (!productClass) throw new BadRequestResponse("Invalid product type");
    return new productClass(payload).createProduct();
  }
  static async findAllProucts({
    limit = 50,
    sort = "ctime",
    page = 1,
    filter = { isPublished: true },
    select = ["product_name", "product_price", "product_thumb", "product_shop"],
  }) {
    return await findAllProucts({
      limit,
      sort,
      page,
      filter,
      select,
    });
  }

  static async findProductById({
    product_id,
    unselect = ["__v", "product_variation"],
  }) {
    return await findProductById({ product_id, unselect });
  }

  static async findAllDraftProuctsForShop({
    product_shop,
    limit = 50,
    skip = 0,
  }) {
    const querry = { product_shop, isDraft: true };
    return await findAllDraftProuctsByShop({ querry, limit, skip });
  }

  static async findAllPublishedProuctsForShop({
    product_shop,
    limit = 50,
    skip = 0,
  }) {
    const querry = { product_shop, isPublished: true };
    return await findAllPublishedProuctsForShop({ querry, limit, skip });
  }

  static async publishProductByShop({ product_shop, product_id }) {
    return await publishProductByShop({ product_shop, product_id });
  }

  static async unPublishProductByShop({ product_shop, product_id }) {
    return await unPublishProductByShop({ product_shop, product_id });
  }

  static async searchProduct({ keySearch, limit, skip }) {
    return await searchProduct({ keySearch, limit, skip });
  }
}

// Define the product class
class Product {
  constructor({
    product_name,
    product_thumb,
    product_description,
    product_price,
    product_quantity,
    product_type,
    product_shop,
    product_attribute,
  }) {
    this.product_name = product_name;
    this.product_thumb = product_thumb;
    this.product_description = product_description;
    this.product_price = product_price;
    this.product_quantity = product_quantity;
    this.product_type = product_type;
    this.product_shop = product_shop;
    this.product_attribute = product_attribute;
  }
  // Create a product
  async createProduct() {
    const productCreated = await productModel.create(this);
    return productCreated;
  }
}

// Define the clothing class extending the product class
class Clothing extends Product {
  async createProduct() {
    // Create a product
    const newProduct = await super.createProduct();
    if (!newProduct) throw new BadRequestResponse("Create product failed");
    // Create a electronic product with id of the product
    const clothing = await clothingModel.create({
      _id: newProduct._id,
      product_shop: this.product_shop,
      ...this.product_attribute,
    });
    if (!clothing) throw new BadRequestResponse("Create product failed");
    return newProduct;
  }
}

// Define the electronic class extending the product class
class Electronic extends Product {
  async createProduct() {
    // Create a product
    const newProduct = await super.createProduct();
    if (!newProduct) throw new BadRequestResponse("Create product failed");
    // Create a electronic product with id of the product
    const electronic = await electronicModel.create({
      _id: newProduct._id,
      product_shop: this.product_shop,
      ...this.product_attribute,
    });
    if (!electronic) throw new BadRequestResponse("Create product failed");
    return newProduct;
  }
}

// Define the furniture class extending the product class
class Furniture extends Product {
  async createProduct() {
    // Create a product
    const newProduct = await super.createProduct();
    if (!newProduct) throw new BadRequestResponse("Create product failed");
    // Create a electronic product with id of the product
    const furniture = await furnitureModel.create({
      _id: newProduct._id,
      product_shop: this.product_shop,
      ...this.product_attribute,
    });
    if (!furniture) throw new BadRequestResponse("Create product failed");
  }
}

// Register the product classes
ProductFactory.registProducts("Clothing", Clothing);
ProductFactory.registProducts("Electronic", Electronic);
ProductFactory.registProducts("Furniture", Furniture);

module.exports = { ProductFactory };
