const express = require("express");
const { check } = require("express-validator");
const router = express.Router();
const workControllers = require("../Controllers/Work-Controllers");
const checkAuth = require("../Middleware/check-auth");
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
router.get("/get/all/works", cacheMiddleware, workControllers.getAllWorks);
router.get(
  "/get/work/bydate/:date",
  cacheMiddleware,
  workControllers.getWorkByDate
);
router.get(
  "/get/work/byuserid/:userId",
  cacheMiddleware,
  workControllers.getWorkByUserId
);

router.post(
  "/create/work",
  [
    check("workDone").isLength({ min: 2 }),
    check("userId").isLength({ min: 2 }),
  ],
  workControllers.createWork
);
router.patch(
  "/update/work/byid/:id",
  [check("workDone").isLength({ min: 2 })],
  workControllers.updateWorkById
);
router.delete("/delete/work/byid/:id", workControllers.deleteWorkById);

module.exports = router;
