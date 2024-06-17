const express = require("express");
const fileUpload = require("../Middleware/image-upload");
const fileController = require("../Controllers/File-Controller");
const router = express.Router();
const checkAuth = require("../Middleware/check-auth");
const redis = require("redis");
const redisClient = require("./redisClient");

// Middleware function to cache responses for GET requests
const cacheMiddleware = (req, res, next) => {
  const key = req.originalUrl;
  redisClient.get(key, (err, data) => {
    if (err) throw err;

    if (data !== null) {
      res.send(JSON.parse(data));
    } else {
      next();
    }
  });
};

router.post(
  "/upload/file",
  fileUpload.single("file"),
  checkAuth(["CEO", "HR"]),
  fileController.uploadFile
);
router.get(
  "/get/all/files",
  checkAuth(["CEO", "HR"]),
  cacheMiddleware,
  fileController.getAllFiles
);
router.get(
  "/open/file/:filename",
  checkAuth(["CEO", "HR"]),
  cacheMiddleware,
  fileController.openFile
);
router.delete(
  "/delete/file/:id",
  checkAuth(["CEO", "HR"]),
  fileController.deleteFile
);

module.exports = router;
