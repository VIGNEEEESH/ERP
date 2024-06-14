const express = require("express");
const { check } = require("express-validator");
const router = express.Router();
const departmentControllers = require("../Controllers/Department-Controllers");
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
router.get(
  "/get/all/departments",
  checkAuth(["CEO", "HR", "DeptHead", "Employee"]),
  cacheMiddleware,
  departmentControllers.getAllDepartments
);
router.get(
  "/get/department/byid/:id",
  checkAuth(["CEO", "HR", "DeptHead", "Employee"]),
  cacheMiddleware,
  departmentControllers.getDepartmentById
);
router.get(
  "/get/department/byuserid/:userId",
  checkAuth(["CEO", "HR", "DeptHead", "Employee"]),
  cacheMiddleware,
  departmentControllers.getDepartmentByUserId
);

router.post(
  "/create/department",
  checkAuth(["CEO", "HR"]),
  [
    check("departmentName").isLength({ min: 2, max: 255 }),
    check("userId").notEmpty(),
  ],
  departmentControllers.createDepartment
);
router.patch(
  "/update/department/byid/:id",
  checkAuth(["CEO", "HR"]),
  [
    check("departmentName").isLength({ min: 2, max: 255 }).optional(),
    check("userId").notEmpty().optional(),
  ],
  departmentControllers.updateDepartmentById
);
router.delete(
  "/delete/department/byid/:id",
  checkAuth(["CEO", "HR"]),
  departmentControllers.deleteDepartmentById
);

module.exports = router;
