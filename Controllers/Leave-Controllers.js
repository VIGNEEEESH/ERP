const HttpError = require("../Middleware/http-error");
const { validationResult } = require("express-validator");
const Leave = require("../Models/Leave");

const createLeave = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new HttpError("Invalid inputs, please try again", 422);
    return next(error);
  }
  const { firstName, lastName, email, reason, startDate, endDate, status } =
    req.body;

  const createdLeave = new Leave({
    firstName,
    lastName,
    email,
    reason,
    startDate,
    endDate,
    status,
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
exports.createLeave = createLeave;
