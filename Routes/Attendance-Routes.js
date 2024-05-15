const express = require("express");
const { check } = require("express-validator");
const router = express.Router();
const attendanceControllers = require("../Controllers/Attendance-Controllers");
const checkAuth = require("../Middleware/check-auth");
const redis = require("redis");
const client = redis.createClient();

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
  "/get/all/attendance",
  checkAuth(["CEO", "HR", "DeptHead", "Employee"]),
  cacheMiddleware,
  attendanceControllers.getAllAttendance
);
router.get(
  "/get/attendance/bydate/:date",
  checkAuth(["CEO", "HR", "DeptHead", "Employee"]),
  cacheMiddleware,
  attendanceControllers.getAttendanceByDate
);
router.get(
  "/get/attendance/bydateanduserid/:date/:userId",
  checkAuth(["CEO", "HR", "DeptHead", "Employee"]),
  cacheMiddleware,
  attendanceControllers.getAttendanceByDateAndUserId
);
router.get(
  "/get/attendance/byuserId/:userId",
  checkAuth(["CEO", "HR", "DeptHead", "Employee"]),
  cacheMiddleware,
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
