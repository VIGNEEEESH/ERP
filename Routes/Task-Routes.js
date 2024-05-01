const express = require("express");
const { check } = require("express-validator");
const router = express.Router();
const taskControllers = require("../Controllers/Task-Controllers");
const checkAuth = require("../Middleware/check-auth");
const imageUpload = require("../Middleware/image-upload");

router.get("/get/all/tasks", taskControllers.getAllTasks);
router.get("/get/task/byid/:id", taskControllers.getTaskById);

router.post(
  "/create/task",
  [
    check("taskName").isLength({ min: 2, max: 255 }),
    check("taskDescription").isLength({ min: 2 }),
    check("members").isLength({ min: 2 }).optional(),
    check("deadline").isLength({ min: 2, max: 255 }).optional(),
    check("assignedDate").isLength({ min: 2, max: 255 }),
    check("progress").isLength({ min: 2, max: 255 }).optional(),
  ],
  taskControllers.createTask
);
router.patch(
  "/update/task/byid/:id",
  [
    check("taskName").isLength({ min: 2, max: 255 }).optional(),
    check("taskDescription").isLength({ min: 2 }).optional(),
    check("members").isLength({ min: 2 }).optional().optional(),
    check("deadline").isLength({ min: 2, max: 255 }).optional(),
    check("assignedDate").isLength({ min: 2, max: 255 }).optional(),
    check("progress").isLength({ min: 2 }).optional(),
  ],
  taskControllers.updateTaskById
);
router.patch(
  "/update/projectprogress/byid/:id",
  [check("progress").isLength({ min: 1 })],
  taskControllers.updateTaskProgressById
);
router.delete("/delete/task/byid/:id", taskControllers.deleteTaskById);

module.exports = router;
