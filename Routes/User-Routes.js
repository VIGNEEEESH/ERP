const express = require("express");
const { check } = require("express-validator");
const router = express.Router();
const userControllers = require("../Controllers/User-Controllers");
const checkAuth = require("../Middleware/check-auth");
const imageUpload = require("../Middleware/image-upload");
const redis = require("redis");
const client = redis.createClient({
  password: "BqNAC2mcNfO4GnVwVv0jNrRbDYkANFM7",
  host: "redis-16938.c301.ap-south-1-1.ec2.redns.redis-cloud.com",
  port: 16938,
});

client.on("connect", () => {
  console.log("Client connected to redis");
});
client.on("error", (err) => {
  console.log(err.message);
});
// Middleware function to cache responses for GET requests
const cacheMiddleware = (req, res, next) => {
  const key = req.originalUrl; // Using the request URL as the cache key
  client.get(key, (err, data) => {
    if (err) throw err;

    if (data !== null) {
      // If data exists in cache, return it
      res.send(JSON.parse(data));
    } else {
      // If data doesn't exist in cache, proceed to the route handler
      next();
    }
  });
};
router.get(
  "/get/all/users",
  checkAuth(["CEO", "HR", "DeptHead", "Employee"]),
  cacheMiddleware,
  userControllers.getAllUsers
);
router.get(
  "/get/all/users/search/:loggedInUser",
  // checkAuth(["CEO", "HR", "DeptHead", "Employee"]),
  cacheMiddleware,
  userControllers.allUsers
);
router.get(
  "/get/user/byid/:id",
  checkAuth(["CEO", "HR", "DeptHead", "Employee"]),
  cacheMiddleware,
  userControllers.getUserById
);
router.get(
  "/get/users/byrole/:role",
  checkAuth(["CEO", "HR", "DeptHead", "Employee"]),
  cacheMiddleware,
  userControllers.getUsersByRole
);
router.post(
  "/invite/user",
  checkAuth(["CEO", "HR"]),
  [(check("role").isLength({ min: 2, max: 255 }), check("email").isEmail())],
  userControllers.inviteUser
);
router.post(
  "/login",

  [check("email").isEmail(), check("password").notEmpty()],
  userControllers.login
);
router.patch(
  "/create/user",
  imageUpload.single("image"),
  [
    check("id").isLength({ min: 2 }),
    check("firstName").isLength({ min: 2, max: 255 }),
    check("lastName").isLength({ min: 2, max: 255 }),
    check("password").isLength({ min: 2, max: 255 }),
    check("mobile").isLength({ min: 6, max: 10 }),
    check("address").isLength({ min: 2, max: 255 }),
    check("pincode").isLength({ min: 2, max: 255 }),
    check("state").isLength({ min: 2, max: 255 }),
    check("country").isLength({ min: 2, max: 255 }),

    check("pan").isLength({ min: 2, max: 255 }),
    check("aadhar").isLength({ min: 2, max: 255 }),
  ],
  userControllers.createUser
);
router.patch(
  "/update/user/byid/:id",
  checkAuth(["CEO", "HR"]),
  imageUpload.single("image"),
  [
    check("firstName").isLength({ min: 2, max: 255 }).optional(),
    check("lastName").isLength({ min: 2, max: 255 }).optional(),
    check("mobile").isLength({ min: 2, max: 255 }).optional(),
    check("address").isLength({ min: 2, max: 255 }).optional(),
    check("pincode").isLength({ min: 2, max: 255 }).optional(),
    check("state").isLength({ min: 2, max: 255 }).optional(),
    check("country").isLength({ min: 2, max: 255 }).optional(),
    check("salary").isLength({ min: 1, max: 255 }).optional(),
    check("pan").isLength({ min: 2, max: 255 }).optional(),
    check("aadhar").isLength({ min: 2, max: 255 }).optional(),
  ],
  userControllers.updateUserById
);
router.patch(
  "/update/image/byid/:id",
  checkAuth(["CEO", "HR", "DeptHead", "Employee"]),
  imageUpload.single("image"),

  userControllers.updateUserImageById
);
router.patch(
  "/forgotpassword",
  checkAuth(["CEO", "HR", "DeptHead", "Employee"]),
  userControllers.forgotPassword
);
router.delete(
  "/delete/user/byid/:id",
  checkAuth(["CEO", "HR"]),
  userControllers.deleteUserById
);
router.post(
  "/reset-password",
  [check("email").normalizeEmail().isEmail()],
  userControllers.resetPassword
);

router.post("/update-password", userControllers.updatePassword);

module.exports = router;
