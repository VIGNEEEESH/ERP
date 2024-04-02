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

exports.createDepartment = createDepartment;
