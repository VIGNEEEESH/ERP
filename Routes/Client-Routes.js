const express = require("express");
const { check } = require("express-validator");
const router = express.Router();
const clientControllers = require("../Controllers/Client-Controllers");
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
  "/get/all/clients",
  checkAuth(["CEO", "HR", "DeptHead", "Employee"]),
  cacheMiddleware,
  clientControllers.getAllClients
);
router.get(
  "/get/client/byid/:id",
  checkAuth(["CEO", "HR", "DeptHead", "Employee"]),
  cacheMiddleware,
  clientControllers.getClientById
);

router.post(
  "/create/client",
  checkAuth(["CEO", "HR"]),
  [
    check("clientName").isLength({ min: 2, max: 255 }),
    check("companyName").isLength({ min: 2, max: 255 }).optional(),
    check("projects").isLength({ min: 2 }).optional(),
    check("mobile").isLength({ min: 6, max: 12 }).optional(),
    check("email").isEmail(),
  ],
  clientControllers.createClient
);
router.patch(
  "/update/client/byid/:id",
  checkAuth(["CEO", "HR"]),
  [
    check("clientName").isLength({ min: 2, max: 255 }).optional(),
    check("companyName").isLength({ min: 2, max: 255 }).optional(),
    check("projects").isLength({ min: 2 }).optional(),
    check("mobile").isLength({ min: 6, max: 12 }).optional(),
  ],
  clientControllers.updateClientById
);
router.delete(
  "/delete/client/byid/:id",
  checkAuth(["CEO", "HR"]),
  clientControllers.deleteClientById
);

module.exports = router;
