const express = require("express");
const { check } = require("express-validator");
const router = express.Router();
const productControllers = require("../Controllers/Product-Controllers");
const checkAuth = require("../Middleware/check-auth");
const imageUpload = require("../Middleware/image-upload");
const redisClient = require("./redisClient");

const cacheMiddleware = (req, res, next) => {
  const key = req.originalUrl; // Using the request URL as the cache key
  redisClient.get(key, (err, data) => {
    if (err) throw err;

    if (data !== null) {
      res.send(JSON.parse(data));
    } else {
      next();
    }
  });
};

router.get(
  "/get/all/products",
  checkAuth(["CEO", "HR", "DeptHead", "Employee"]),
  cacheMiddleware,
  productControllers.getAllProducts
);

// GET route to get product by ID with Redis caching
router.get(
  "/get/product/byid/:id",
  checkAuth(["CEO", "HR", "DeptHead", "Employee"]),
  cacheMiddleware,
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
