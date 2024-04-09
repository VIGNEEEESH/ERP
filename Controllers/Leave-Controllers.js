const HttpError = require("../Middleware/http-error");
const { validationResult } = require("express-validator");
const Leave = require("../Models/Leave");

const createLeave = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new HttpError("Invalid inputs, please try again", 422);
    return next(error);
  }
  const { firstName, lastName, email, reason, startDate, endDate } = req.body;

  const createdLeave = new Leave({
    firstName,
    lastName,
    email,
    reason,
    startDate,
    endDate,
    status: "Requested",
  });
  try {
    await createdLeave.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong while saving the data, please try again",
      500
    );
    return next(error);
  }
  res.status(201).json({ createdLeave: createdLeave });
};
const getAllLeaves = async (req, res, next) => {
  let leaves;
  try {
    leaves = await Leave.find({});
  } catch (err) {
    const error = new HttpError(
      "Something went wrong while fetching the data, please try again",
      500
    );
    return next(error);
  }
  res.status(200).json({ leaves: leaves });
};
const getLeaveById = async (req, res, next) => {
  const id = req.params.id;
  let leave;
  try {
    leave = await Leave.findOne({ _id: id });
  } catch (err) {
    const error = new HttpError(
      "Something went wrong while fetching the data, please try again",
      500
    );
    return next(error);
  }
  res.status(200).json({ leave: leave });
};
const getLeaveByEmail = async (req, res, next) => {
  const email = req.params.email;
  let leaves;
  try {
    leaves = await Leave.find({ email: email });
  } catch (err) {
    const error = new HttpError(
      "Something went wrong while fetching the data, please try again",
      500
    );
    return next(error);
  }
  res.status(200).json({ leaves: leaves });
};
const updateLeaveStatus = async (req, res, next) => {
  const id = req.params.id;
  let leave;
  const { status } = req.body;
  try {
    leave = await Leave.findOne({ _id: id });
  } catch (err) {
    const error = new HttpError(
      "Something went wrong while fetching the data, please try again",
      500
    );
    return next(error);
  }
  if (!leave) {
    const error = new HttpError("Leave not found, please try again", 500);
    return next(error);
  }
  leave.status = status ? status : leave.status;

  try {
    leave.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong while saving the data , please try again",
      500
    );
    return next(error);
  }
  res.status(201).json({ leave: leave });
};
exports.createLeave = createLeave;
exports.getAllLeaves = getAllLeaves;
exports.getLeaveById = getLeaveById;
exports.getLeaveByEmail = getLeaveByEmail;
exports.updateLeaveStatus = updateLeaveStatus;
