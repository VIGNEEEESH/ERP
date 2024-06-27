const express = require("express");
const { check } = require("express-validator");
const router = express.Router();
const taskControllers = require("../Controllers/Task-Controllers");
const checkAuth = require("../Middleware/check-auth");
const imageUpload = require("../Middleware/image-upload");
const redisClient = require("./redisClient");

const cacheMiddleware = (req, res, next) => {
  const key = req.originalUrl;
  redisClient.get(key, (err, data) => {
    if (err) throw err;
    if (data !== null) {
      res.send(JSON.parse(data));
    } else {
      next();
    }
  });
};

router.get(
  "/get/all/tasks",
  checkAuth(["CEO", "HR", "DeptHead", "Employee"]),
  cacheMiddleware,
  taskControllers.getAllTasks
);
router.get(
  "/get/task/byid/:id",
  checkAuth(["CEO", "HR", "DeptHead", "Employee"]),
  cacheMiddleware,
  taskControllers.getTaskById
);
router.get(
  "/get/tasks/bydepartmentandid/:id",
  checkAuth(["CEO", "HR", "DeptHead", "Employee"]),
  cacheMiddleware,
  taskControllers.getTasksByDepartmentAndId
);
router.get(
  "/get/tasks/byemail/:email",
  checkAuth(["CEO", "HR", "DeptHead", "Employee"]),
  cacheMiddleware,
  taskControllers.getTasksByEmail
);

router.post(
  "/create/task",
  checkAuth(["CEO", "HR", "DeptHead"]),
  imageUpload.any("files"),
  [
    check("taskName").isLength({ min: 2, max: 255 }),
    check("taskDescription").isLength({ min: 2 }),
    check("members").isLength({ min: 2 }).optional(),
    check("deadline").isLength({ min: 2, max: 255 }).optional(),
    check("assignedDate").isLength({ min: 2, max: 255 }),
    check("progress").isLength({ min: 2, max: 255 }).optional(),
    check("department").isLength({ min: 2, max: 255 }).optional(),
  ],
  taskControllers.createTask
);

router.patch(
  "/update/task/byid/:id",
  checkAuth(["CEO", "HR", "DeptHead"]),
  imageUpload.any("files"),
  [
    check("taskName").isLength({ min: 2, max: 255 }).optional(),
    check("taskDescription").isLength({ min: 2 }).optional(),
    check("members").isLength({ min: 2 }).optional(),
    check("deadline").isLength({ min: 2, max: 255 }).optional(),
    check("assignedDate").isLength({ min: 2, max: 255 }).optional(),
    check("progress").isLength({ min: 2 }).optional(),
    check("department").isLength({ min: 2 }).optional(),
  ],
  taskControllers.updateTaskById
);

router.patch(
  "/update/taskprogress/byid/:id",
  check("progress").isLength({ min: 1 }),
  taskControllers.updateTaskProgressById
);
router.patch(
  "/add/project/files/byid/:id",
  imageUpload.any("files"),
  checkAuth(["CEO", "HR", "DeptHead"]),
  taskControllers.addTaskFileById
);

router.delete(
  "/delete/task/byid/:id",
  checkAuth(["CEO", "HR", "DeptHead"]),
  taskControllers.deleteTaskById
);

module.exports = router;
