const express = require("express");
const { check } = require("express-validator");
const router = express.Router();
const attendanceControllers = require("../Controllers/Attendance-Controllers");
const checkAuth = require("../Middleware/check-auth");

router.get(
  "/get/all/attendance",
  checkAuth(["CEO", "HR", "DeptHead", "Employee"]),
  attendanceControllers.getAllAttendance
);
router.get(
  "/get/attendance/bydate/:date",
  checkAuth(["CEO", "HR", "DeptHead", "Employee"]),
  attendanceControllers.getAttendanceByDate
);
router.get(
  "/get/attendance/bydateanduserid/:date/:userId",
  checkAuth(["CEO", "HR", "DeptHead", "Employee"]),
  attendanceControllers.getAttendanceByDateAndUserId
);
router.get(
  "/get/attendance/byuserId/:userId",
  checkAuth(["CEO", "HR", "DeptHead", "Employee"]),
  attendanceControllers.getAttendanceByUserId
);
router.post(
  "/create/attendance",
  checkAuth(["CEO", "HR", "DeptHead", "Employee"]),
  [
    check("attendanceStatus").isLength({ min: 2, max: 255 }),
    check("userId").notEmpty(),
    check("email").isEmail(),
  ],
  attendanceControllers.createAttendance
);
router.patch(
  "/update/workstatus",
  checkAuth(["CEO", "HR", "DeptHead", "Employee"]),
  [
    check("workStatus").isLength({ min: 2, max: 255 }),
    check("userId").notEmpty(),
    check("date").isEmail(),
  ],
  attendanceControllers.updateWorkStatus
);
router.patch(
  "/add/loggedouttime",
  checkAuth(["CEO", "HR", "DeptHead", "Employee"]),
  [check("userId").notEmpty()],
  attendanceControllers.addLoggedOutTime
);
module.exports = router;
