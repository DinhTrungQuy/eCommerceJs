"use strict";

const { OK, Created } = require("../core/success.response");
const { ProductFactory } = require("../services/product.service");

class ProductController {
  createProduct = async (req, res, next) => {
    let product = await ProductFactory.createProduct(req.body.product_type, {
      ...req.body,
      product_shop: req.userId,
    });
    return new Created({
      metadata: product,
      message: "Successfully created product",
    }).send(res);
  };

  getAllProducts = async (req, res, next) => {
    const products = await ProductFactory.findAllProucts({});
    return new OK({ metadata: products, message: "Get All Products" }).send(
      res
    );
  };

  getProduct = async (req, res, next) => {
    const product = await ProductFactory.findProductById({
      product_id: req.params.product_id,
    });
    return new OK({ metadata: product, message: "Get Product" }).send(res);
  };

  getAllDraftForShop = async (req, res, next) => {
    const products = await ProductFactory.findAllDraftProuctsForShop({
      product_shop: req.userId,
    });
    return new OK({ metadata: products }).send(res);
  };

  getAllPublishedForShop = async (req, res, next) => {
    const products = await ProductFactory.findAllPublishedProuctsForShop({
      product_shop: req.userId,
    });
    return new OK({ metadata: products }).send(res);
  };

  publishProductByShop = async (req, res, next) => {
    const product = await ProductFactory.publishProductByShop({
      product_shop: req.userId,
      product_id: req.params.product_id,
    });
    return new OK({
      metadata: product,
      message: "Published Product Successfully",
    }).send(res);
  };

  unPublishProductByShop = async (req, res, next) => {
    const product = await ProductFactory.unPublishProductByShop({
      product_shop: req.userId,
      product_id: req.params.product_id,
    });
    return new OK({
      metadata: product,
      message: "unPublished Product Successfully",
    }).send(res);
  };

  searchProduct = async (req, res, next) => {
    const products = await ProductFactory.searchProduct({
      keySearch: req.params.keySearch,
    });
    return new OK({
      metadata: products,
      message: "List products from search key",
    }).send(res);
  };
}

module.exports = new ProductController();
