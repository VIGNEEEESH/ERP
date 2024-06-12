const express = require("express");
const { check } = require("express-validator");
const router = express.Router();
const projectControllers = require("../Controllers/Project-Controllers");
const checkAuth = require("../Middleware/check-auth");
const imageUpload = require("../Middleware/image-upload");
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
router.get(
  "/get/all/projects",
  checkAuth(["CEO", "HR", "DeptHead", "Employee"]),
  cacheMiddleware,
  projectControllers.getAllProjects
);
router.get(
  "/get/project/byid/:id",
  checkAuth(["CEO", "HR", "DeptHead", "Employee"]),
  cacheMiddleware,
  projectControllers.getProjectById
);
router.get(
  "/get/projects/byEmail/:email",
  checkAuth(["CEO", "HR", "DeptHead", "Employee"]),
  cacheMiddleware,
  projectControllers.getProjectsByEmail
);
router.get(
  "/get/projects/bydepartmentandid/:id",
  checkAuth(["CEO", "HR", "DeptHead", "Employee"]),
  cacheMiddleware,
  projectControllers.getProjectsByDepartmentAndId
);

router.post(
  "/create/project",
  checkAuth(["CEO", "HR", "DeptHead"]),
  imageUpload.any("files"),
  [
    check("projectName").isLength({ min: 2, max: 255 }),
    check("projectDescription").isLength({ min: 2 }),
    check("members").isLength({ min: 2 }).optional(),
    check("deadline").isLength({ min: 2, max: 255 }).optional(),
    check("assignedDate").isLength({ min: 2, max: 255 }),
    check("progress").isLength({ min: 2, max: 255 }).optional(),
    check("department").isLength({ min: 2, max: 255 }).optional(),
  ],
  projectControllers.createProject
);
router.patch(
  "/update/project/byid/:id",
  checkAuth(["CEO", "HR", "DeptHead"]),
  imageUpload.any("files"),
  [
    check("projectName").isLength({ min: 2, max: 255 }).optional(),
    check("projectDescription").isLength({ min: 2 }).optional(),
    check("members").isLength({ min: 2 }).optional().optional(),
    check("deadline").isLength({ min: 2, max: 255 }).optional(),
    check("assignedDate").isLength({ min: 2, max: 255 }).optional(),
    check("progress").isLength({ min: 2 }).optional(),
    check("department").isLength({ min: 2 }).optional(),
  ],
  projectControllers.updateProjectById
);
router.patch(
  "/add/project/files/byid/:id",
  checkAuth(["CEO", "HR", "DeptHead"]),
  imageUpload.any("files"),
  projectControllers.addProjectFileById
);
router.patch(
  "/update/projectprogress/byid/:id",
  checkAuth(["CEO", "HR", "DeptHead"]),
  [check("progress").isLength({ min: 1 })],
  projectControllers.updateProjectProgressById
);
router.delete(
  "/delete/project/byid/:id",
  checkAuth(["CEO", "HR", "DeptHead"]),
  projectControllers.deleteProjectById
);

module.exports = router;
