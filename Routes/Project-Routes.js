const express = require("express");
const { check } = require("express-validator");
const router = express.Router();
const projectControllers = require("../Controllers/Project-Controllers");
const checkAuth = require("../Middleware/check-auth");
const imageUpload = require("../Middleware/image-upload");

router.get("/get/all/projects", projectControllers.getAllProjects);
router.get("/get/project/byid/:id", projectControllers.getProjectById);

router.post(
  "/create/project",
  [
    check("projectName").isLength({ min: 2, max: 255 }),
    check("projectDescription").isLength({ min: 2 }),
    check("members").isLength({ min: 2 }).optional(),
    check("deadline").isLength({ min: 2, max: 255 }).optional(),
    check("assignedDate").isLength({ min: 2, max: 255 }),
    check("progress").isLength({ min: 2, max: 255 }).optional(),
  ],
  projectControllers.createProject
);
router.patch(
  "/update/project/byid/:id",
  [
    check("projectName").isLength({ min: 2, max: 255 }).optional(),
    check("projectDescription").isLength({ min: 2 }).optional(),
    check("members").isLength({ min: 2 }).optional().optional(),
    check("deadline").isLength({ min: 2, max: 255 }).optional(),
    check("assignedDate").isLength({ min: 2, max: 255 }).optional(),
    check("progress").isLength({ min: 2 }).optional(),
  ],
  projectControllers.updateProjectById
);
router.patch(
  "/update/projectprogress/byid/:id",
  [check("progress").isLength({ min: 1 })],
  projectControllers.updateProjectProgressById
);
router.delete("/delete/project/byid/:id", projectControllers.deleteProjectById);

module.exports = router;
