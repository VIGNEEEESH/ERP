const express = require("express");
const { check } = require("express-validator");
const router = express.Router();
const taskControllers = require("../Controllers/Task-Controllers");
const checkAuth = require("../Middleware/check-auth");
const imageUpload = require("../Middleware/image-upload");

router.get(
  "/get/all/tasks",
  checkAuth(["CEO", "HR", "DeptHead", "Employee"]),
  taskControllers.getAllTasks
);
router.get(
  "/get/task/byid/:id",
  checkAuth(["CEO", "HR", "DeptHead", "Employee"]),
  taskControllers.getTaskById
);
router.get(
  "/get/tasks/bydepartmentandid/:id",
  checkAuth(["CEO", "HR", "DeptHead", "Employee"]),
  taskControllers.getTasksByDepartmentAndId
);
router.get(
  "/get/tasks/byemail/:email",
  checkAuth(["CEO", "HR", "DeptHead", "Employee"]),
  taskControllers.getTasksByEmail
);

router.post(
  "/create/task",
  checkAuth(["CEO", "HR", "DeptHead"]),
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
  [
    check("taskName").isLength({ min: 2, max: 255 }).optional(),
    check("taskDescription").isLength({ min: 2 }).optional(),
    check("members").isLength({ min: 2 }).optional().optional(),
    check("deadline").isLength({ min: 2, max: 255 }).optional(),
    check("assignedDate").isLength({ min: 2, max: 255 }).optional(),
    check("progress").isLength({ min: 2 }).optional(),
    check("department").isLength({ min: 2 }).optional(),
  ],
  taskControllers.updateTaskById
);
router.patch(
  "/update/taskprogress/byid/:id",
  [check("progress").isLength({ min: 1 })],
  checkAuth(["CEO", "HR", "DeptHead"]),
  taskControllers.updateTaskProgressById
);
router.delete(
  "/delete/task/byid/:id",
  checkAuth(["CEO", "HR", "DeptHead"]),
  taskControllers.deleteTaskById
);

module.exports = router;
