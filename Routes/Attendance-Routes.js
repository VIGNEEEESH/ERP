const express = require("express");
const { check } = require("express-validator");
const router = express.Router();
const attendanceControllers = require("../Controllers/Attendance-Controllers");
const checkAuth = require("../Middleware/check-auth");

router.get("/get/all/attendance", attendanceControllers.getAllAttendance);
router.get(
  "/get/attendance/bydate/:date",
  attendanceControllers.getAttendanceByDate
);
router.get(
  "/get/attendance/bydateanduserid/:date/:userId",
  attendanceControllers.getAttendanceByDateAndUserId
);
router.post(
  "/create/attendance",
  [
    check("workStatus").isLength({ min: 2, max: 255 }),
    check("userId").notEmpty(),
    check("email").isEmail(),
  ],
  attendanceControllers.createAttendance
);
router.patch(
  "/update/workstatus",
  [check("workStatus").isLength({ min: 2, max: 255 })],
  attendanceControllers.updateWorkStatus
);
router.patch(
  "/add/loggedouttime",
  [check("userId").notEmpty()],
  attendanceControllers.addLoggedOutTime
);
module.exports = router;
