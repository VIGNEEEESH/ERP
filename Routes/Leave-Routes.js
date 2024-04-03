const express = require("express");
const { check } = require("express-validator");
const router = express.Router();
const leaveControllers = require("../Controllers/Leave-Controllers");
const checkAuth = require("../Middleware/check-auth");

router.get("/get/all/leaves", leaveControllers.getAllLeaves);
router.get("/get/leave/byid/:id", leaveControllers.getLeaveById);
router.get("/get/leave/byemail/:email", leaveControllers.getLeaveByEmail);

router.post(
  "/create/leave",
  [
    check("firstName").isLength({ min: 2, max: 255 }),
    check("lastName").isLength({ min: 2, max: 255 }),
    check("reason").isLength({ min: 2, max: 255 }),
    check("startDate").isLength({ min: 2, max: 255 }),
    check("endDate").isLength({ min: 2, max: 255 }),
    check("status").isLength({ min: 2, max: 255 }),
    check("email").isEmail(),
  ],
  leaveControllers.createLeave
);
router.patch(
  "/update/leavestatus/byid/:id",
  [check("status").isLength({ min: 2, max: 255 })],
  leaveControllers.updateLeaveStatus
);

module.exports = router;
