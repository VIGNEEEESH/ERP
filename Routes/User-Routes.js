const express = require("express");
const { check } = require("express-validator");
const router = express.Router();
const userControllers = require("../Controllers/User-Controllers");
const checkAuth = require("../Middleware/check-auth");
const imageUpload = require("../Middleware/image-upload");

router.get("/get/all/users", userControllers.getAllUsers);
router.get("/get/user/byid/:id", userControllers.getUserById);
router.get("/get/users/byrole/:role", userControllers.getUsersByRole);

router.post(
  "/invite/user",
  [check("role").isLength({ min: 2, max: 255 }), check("email").isEmail()],
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
  imageUpload.single("image"),

  userControllers.updateUserImageById
);
router.patch("/forgotpassword", userControllers.forgotPassword);
router.delete("/delete/user/byid/:id", userControllers.deleteUserById);

module.exports = router;
