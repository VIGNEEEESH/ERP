const express = require("express");
const { check } = require("express-validator");
const router = express.Router();
const productControllers = require("../Controllers/Product-Controllers");
const checkAuth = require("../Middleware/check-auth");
const imageUpload = require("../Middleware/image-upload");

router.get(
  "/get/all/products",
  checkAuth(["CEO", "HR", "DeptHead", "Employee"]),
  productControllers.getAllProducts
);
router.get(
  "/get/product/byid/:id",
  checkAuth(["CEO", "HR", "DeptHead", "Employee"]),
  productControllers.getProductById
);

router.post(
  "/create/product",
  checkAuth(["CEO", "HR"]),
  imageUpload.single("image"),
  [
    check("productName").isLength({ min: 2, max: 255 }),
    check("productDescription").isLength({ min: 2 }),
  ],
  productControllers.createProduct
);
router.patch(
  "/update/product/byid/:id",
  checkAuth(["CEO", "HR"]),
  imageUpload.single("image"),
  [
    check("productName").isLength({ min: 2, max: 255 }).optional(),
    check("productDescription").isLength({ min: 2 }).optional(),
  ],
  productControllers.updateProductById
);
router.delete(
  "/delete/product/byid/:id",
  checkAuth(["CEO", "HR"]),
  productControllers.deleteProductById
);

module.exports = router;
