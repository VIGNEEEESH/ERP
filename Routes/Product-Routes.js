const express = require("express");
const { check } = require("express-validator");
const router = express.Router();
const productControllers = require("../Controllers/Product-Controllers");
const checkAuth = require("../Middleware/check-auth");
const imageUpload = require("../Middleware/image-upload");

router.get("/get/all/products", productControllers.getAllProducts);
router.get("/get/product/byid/:id", productControllers.getProductById);

router.post(
  "/create/product",
  imageUpload.single("image"),
  [
    check("productName").isLength({ min: 2, max: 255 }),
    check("productDescription").isLength({ min: 2 }),
  ],
  productControllers.createProduct
);
router.patch(
  "/update/product/byid/:id",
  imageUpload.single("image"),
  [
    check("productName").isLength({ min: 2, max: 255 }).optional(),
    check("productDescription").isLength({ min: 2 }).optional(),
  ],
  productControllers.updateProductById
);
router.delete("/delete/product/byid/:id", productControllers.deleteProductById);

module.exports = router;
