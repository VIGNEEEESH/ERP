const HttpError = require("../Middleware/http-error");
const { validationResult } = require("express-validator");
const Attendance = require("../Models/Attendance");

const createAttendance = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new HttpError("Invalid inputs, please try again", 500);
    return next(error);
  }
  const {
    attendanceStatus,
    date,
    loggenIntime,
    loggedOutTime,
    workStatus,
    userId,
    email,
  } = req.body;
  const createdAttendance = new Attendance({
    attendanceStatus,
    date,
    loggenIntime,
    loggedOutTime,
    workStatus,
    userId,
    email,
  });
  try {
    await createdAttendance.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong while saving the data, please try again",
      500
    );
    return next(error);
  }
  res.status(201).json({ attendance: createAttendance });
};
exports.createAttendance = createAttendance;
