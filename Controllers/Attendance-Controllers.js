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
const getAllAttendance = async (req, res, next) => {
  let attendance;
  try {
    attendance = await Attendance.find({});
  } catch (err) {
    const error = new HttpError(
      "Something went wrong while fetching the data, please try again",
      500
    );
    return next(error);
  }
  res.status(200).json({ attendance: attendance });
};
const getAttendanceByDate = async (req, res, next) => {
  const date = req.params.date;
  let attendance;
  try {
    attendance = await Attendance.find({ date: date });
  } catch (err) {
    const error = new HttpError(
      "Something went wrong while fetching the data, please try again",
      500
    );
    return next(error);
  }
  res.status(200).json({ attendance: attendance });
};
const getAttendanceByDateAndUserId = async (req, res, next) => {
  const date = req.params.date;
  const userId = req.params.userId;
  let attendance;
  try {
    attendance = await Attendance.findOne({ date: date, userId: userId });

    if (!attendance || attendance.length === 0) {
      return res.status(404).json({
        message: "Attendance data not found for the provided date and user ID",
      });
    }

    res.status(200).json({ attendance: attendance });
  } catch (err) {
    console.error(err);
    const error = new HttpError(
      "Something went wrong while fetching the data, please try again",
      500
    );
    return next(error);
  }
};

const updateWorkStatus = async (req, res, next) => {
  const { date, userId, workStatus } = req.body;
  let attendance;
  try {
    attendance = await Attendance.findOne({ date: date, userId: userId });
  } catch (err) {
    const error = new HttpError(
      "Something went wrong while fetching the data, please try again",
      500
    );
    return next(error);
  }
  if (!attendance) {
    const error = new HttpError("Attendance not found, please try again", 500);
    return next(error);
  }
  attendance.workStatus = workStatus;
  try {
    await attendance.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong while saving the data, please try again",
      500
    );
    return next(error);
  }
  res.status(201).json({ attendance: attendance });
};
const addLoggedOutTime = async (req, res, next) => {
  const { date, userId, loggedOutTime } = req.body;
  let attendance;
  try {
    attendance = await Attendance.findOne({ date: date, userId: userId });
  } catch (err) {
    const error = new HttpError(
      "Something went wrong while fetching the data, please try again",
      500
    );
    return next(error);
  }
  if (!attendance) {
    const error = new HttpError("Attendance not found, please try again", 500);
    return next(error);
  }
  attendance.loggedOutTime = loggedOutTime;
  try {
    await attendance.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong while saving the data, please try again",
      500
    );
    return next(error);
  }
  res.status(201).json({ attendance: attendance });
};

exports.createAttendance = createAttendance;
exports.getAllAttendance = getAllAttendance;
exports.getAttendanceByDate = getAttendanceByDate;
exports.getAttendanceByDateAndUserId = getAttendanceByDateAndUserId;
exports.updateWorkStatus = updateWorkStatus;
exports.addLoggedOutTime = addLoggedOutTime;
