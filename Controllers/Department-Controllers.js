const HttpError = require("../Middleware/http-error");
const { validationResult } = require("express-validator");
const Department = require("../Models/Department");

const createDepartment = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new HttpError("Invalid inputs, please try again", 422);
    return next(error);
  }
  const { DepartmentName, userId } = req.body;
  let existingDepartment;
  try {
    existingDepartment = await Department.findOne({
      DepartmentName: DepartmentName,
    });
  } catch (err) {
    const error = new HttpError(
      "Something went wrong while fetching the data, please try again",
      500
    );
    return next(error);
  }
  if (existingDepartment) {
    const error = new HttpError(
      "Department already exists, please try again",
      500
    );
    return next(error);
  }

  const createdDepartment = new Department({
    DepartmentName,
    userId,
  });
  try {
    await createdDepartment.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong while saving the data, please try again",
      500
    );
    return next(error);
  }
  res.status(201).json({ createdDepartment: createdDepartment });
};
const getAllDepartments = async (req, res, next) => {
  let departments;
  try {
    departments = await Department.find({});
  } catch (err) {
    const error = new HttpError(
      "Something went wrong while fetching the data, please try again",
      500
    );
    return next(error);
  }
  res.status(200).json({ departments: departments });
};
const getDepartmentById = async (req, res, next) => {
  const id = req.params.id;
  let department;
  try {
    department = await Department.find({ _id: id });
  } catch (err) {
    const error = new HttpError(
      "Something went wrong while fetching the data, please try again",
      500
    );
    return next(error);
  }
  res.status(200).json({ department: department });
};
const updateDepartmentById = async (req, res, next) => {
  const id = req.params.id;
  let department;
  const { departmentName, userId } = req.body;
  try {
    department = await Department.findOne({ _id: id });
  } catch (err) {
    const error = new HttpError(
      "Something went wrong while fetching the data, please try again",
      500
    );
    return next(error);
  }
  if (!department) {
    const error = new HttpError("Department not found, please try again", 500);
    return next(error);
  }
  department.departmentName = departmentName
    ? departmentName
    : department.departmentName;
  department.userId = userId ? userId : department.userId;
  try {
    department.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong while saving the data, please try again",
      500
    );
    return next(error);
  }
  res.status(201).json({ department: department });
};
const deleteDepartmentById = async (req, res, next) => {
  const id = req.params.id;
  let department;
  try {
    department = await Department.findOne({ _id: id });
  } catch (err) {
    const error = new HttpError(
      "Something went wrong while saving the data, please try again",
      500
    );
    return next(error);
  }
  if (!department) {
    const error = new HttpError("Department not found, please try again", 500);
    return next(error);
  }
  try {
    await department.deleteOne();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong while deleting the data, please try again",
      500
    );
    return next(error);
  }
  res.status(200).json({ message: "Department deleted successfully" });
};

exports.createDepartment = createDepartment;
exports.getAllDepartments = getAllDepartments;
exports.getDepartmentById = getDepartmentById;
exports.updateDepartmentById = updateDepartmentById;
exports.deleteDepartmentById = deleteDepartmentById;
