const express = require("express");
const { check } = require("express-validator");
const router = express.Router();
const workControllers = require("../Controllers/Work-Controllers");
const checkAuth = require("../Middleware/check-auth");

router.get("/get/all/works", workControllers.getAllWorks);
router.get("/get/work/bydate/:date", workControllers.getWorkByDate);
router.get("/get/work/byuserid/:userId", workControllers.getWorkByUserId);

router.post(
  "/create/work",
  [
    check("date").isLength({ min: 2, max: 255 }),
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
