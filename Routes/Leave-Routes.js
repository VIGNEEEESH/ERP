const express = require("express");
const { check } = require("express-validator");
const router = express.Router();
const leaveControllers = require("../Controllers/Leave-Controllers");
const checkAuth = require("../Middleware/check-auth");
const redis = require("redis");
const client = redis.createClient({
  password: "nJGerjQelfiQztvkIbyFvUOaXhFLdrTv",
  host: "redis-12902.c330.asia-south1-1.gce.redns.redis-cloud.com",
  port: 12902,
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
  "/get/all/leaves",
  checkAuth(["CEO", "HR", "DeptHead", "Employee"]),
  cacheMiddleware,
  leaveControllers.getAllLeaves
);
router.get(
  "/get/leave/byid/:id",
  checkAuth(["CEO", "HR", "DeptHead", "Employee"]),
  cacheMiddleware,
  leaveControllers.getLeaveById
);
router.get(
  "/get/leave/byemail/:email",
  checkAuth(["CEO", "HR", "DeptHead", "Employee"]),
  cacheMiddleware,
  leaveControllers.getLeaveByEmail
);

router.post(
  "/create/leave",
  checkAuth(["CEO", "HR", "DeptHead", "Employee"]),
  [
    check("firstName").isLength({ min: 2, max: 255 }),
    check("lastName").isLength({ min: 2, max: 255 }),
    check("reason").isLength({ min: 2, max: 255 }),
    check("startDate").isLength({ min: 2, max: 255 }),
    check("endDate").isLength({ min: 2, max: 255 }),
    check("email").isEmail(),
  ],
  leaveControllers.createLeave
);
router.patch(
  "/update/leavestatus/byid/:id",
  checkAuth(["CEO", "HR"]),
  [check("status").isLength({ min: 2, max: 255 })],
  leaveControllers.updateLeaveStatus
);

module.exports = router;
