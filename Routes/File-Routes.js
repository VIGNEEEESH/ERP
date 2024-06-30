const express = require("express");
const fileUpload = require("../Middleware/image-upload");
const fileController = require("../Controllers/File-Controller");
const router = express.Router();
const checkAuth = require("../Middleware/check-auth");
const redis = require("redis");
const redisClient = require("./redisClient");
const User = require("../Models/User");

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
  checkAuth(["CEO"]),
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

router.post("/verify-password", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    res.status(200).json({ message: "Password verified" });
  } catch (error) {
    console.error("Error verifying password:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
