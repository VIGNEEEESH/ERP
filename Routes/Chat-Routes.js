const express = require("express");
const { check } = require("express-validator");
const router = express.Router();
const chatControllers = require("../Controllers/Chat-Controllers");
const checkAuth = require("../Middleware/check-auth");
const redisClient = require("./redisClient");
// Middleware function to cache responses for GET requests
const cacheMiddleware = (req, res, next) => {
  const key = req.originalUrl; // Using the request URL as the cache key
  redisClient.get(key, (err, data) => {
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
  [check("chatName").isLength({ min: 2 }), check("users").isLength({ min: 2 })],
  chatControllers.createGroupChat
);
router.get(
  "/get/chat/:loggedInUser",
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
