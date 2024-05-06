const express = require("express");
const { check } = require("express-validator");
const router = express.Router();
const departmentControllers = require("../Controllers/Department-Controllers");
const checkAuth = require("../Middleware/check-auth");

router.get(
  "/get/all/departments",
  checkAuth(["CEO", "HR", "DeptHead", "Employee"]),
  departmentControllers.getAllDepartments
);
router.get(
  "/get/department/byid/:id",
  checkAuth(["CEO", "HR", "DeptHead", "Employee"]),
  departmentControllers.getDepartmentById
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
