const express = require("express");
const { check } = require("express-validator");
const router = express.Router();
const chatControllers = require("../Controllers/Chat-Controllers");
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

router.post(
  "/access/chat",
  [
    check("userId").isLength({ min: 2 }),
    check("loggedInUser").isLength({ min: 2 }),
  ],
  chatControllers.accessChat
);
router.post(
  "/create/groupchat",
  [
    check("chatName").isLength({ min: 2 }),
    check("groupAdmin").isLength({ min: 2 }),
    check("users").isLength({ min: 2 }),
  ],
  chatControllers.createGroupChat
);
router.get(
  "/get/chat",
  [check("loggedInUser").isLength({ min: 2 })],
  chatControllers.fetchChats
);
router.put(
  "/rename/group",
  [
    check("chatId").isLength({ min: 2 }),
    check("chatName").isLength({ min: 2 }),
  ],
  chatControllers.renameGroup
);
router.put(
  "/add/togroup",
  [check("chatId").isLength({ min: 2 }), check("userId").isLength({ min: 2 })],
  chatControllers.addToGroup
);
router.put(
  "/remove/fromgroup",
  [check("chatId").isLength({ min: 2 }), check("userId").isLength({ min: 2 })],
  chatControllers.removeFromGroup
);

module.exports = router;
