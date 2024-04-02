const HttpError = require("../Middleware/http-error");
const { validationResult } = require("express-validator");
const Product = require("../Models/Product");

const createProduct = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new HttpError("Invalid inputs, please try again", 422);
    return next(error);
  }
  const { productName, productDescription } = req.body;
  let existingProduct;
  try {
    existingProduct = await Product.findOne({
      productName: productName,
    });
  } catch (err) {
    const error = new HttpError(
      "Something went wrong while fetching the data, please try again",
      500
    );
    return next(error);
  }
  if (existingProduct) {
    const error = new HttpError(
      "Product already exists, please try again",
      500
    );
    return next(error);
  }

  const createdProduct = new Product({
    productName,
    productDescription,
    image: req.file.path,
  });
  try {
    await createdProduct.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong while saving the data, please try again",
      500
    );
    return next(error);
  }
  res.status(201).json({ createdProduct: createdProduct });
};
const getAllProducts = async (req, res, next) => {
  let products;
  try {
    products = await Product.find({});
  } catch (err) {
    const error = new HttpError(
      "Something went wrong while fetching the data, please try again",
      500
    );
    return next(error);
  }
  res.status(200).json({ products: products });
};
const getProductById = async (req, res, next) => {
  const id = req.params.id;
  let product;
  try {
    product = await Product.find({ _id: id });
  } catch (err) {
    const error = new HttpError(
      "Something went wrong while fetching the data, please try again",
      500
    );
    return next(error);
  }
  res.status(200).json({ product: product });
};
const updateProductById = async (req, res, next) => {
  const id = req.params.id;
  let product;
  const { productName, productDescription } = req.body;
  try {
    product = await Product.findOne({ _id: id });
  } catch (err) {
    const error = new HttpError(
      "Something went wrong while fetching the data, please try again",
      500
    );
    return next(error);
  }
  if (!product) {
    const error = new HttpError("Product not found, please try again", 500);
    return next(error);
  }
  if (req.file.path != null) {
    user.image = req.file.path;
  } else {
    user.image = user.image;
  }
  product.productName = productName ? productName : product.productName;
  product.productDescription = productDescription
    ? productDescription
    : product.productDescription;
  product.image = image ? image : product.image;
  try {
    product.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong while saving the data, please try again",
      500
    );
    return next(error);
  }
  res.status(201).json({ product: product });
};
const deleteProductById = async (req, res, next) => {
  const id = req.params.id;
  let product;
  try {
    product = await product.findOne({ _id: id });
  } catch (err) {
    const error = new HttpError(
      "Something went wrong while saving the data, please try again",
      500
    );
    return next(error);
  }
  if (!product) {
    const error = new HttpError("Product not found, please try again", 500);
    return next(error);
  }
  try {
    await Product.deleteOne();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong while deleting the data, please try again",
      500
    );
    return next(error);
  }
  res.status(200).json({ message: "Product deleted successfully" });
};
exports.createProduct = createProduct;
exports.getAllProducts = getAllProducts;
exports.getProductById = getProductById;
exports.updateProductById = updateProductById;
exports.deleteProductById = deleteProductById;
