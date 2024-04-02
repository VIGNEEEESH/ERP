const HttpError = require("../Middleware/http-error");
const { validationResult } = require("express-validator");
const User = require("../Models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fs = require("fs");

const inviteUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return resolveSoa.status(422).json({
      message: "Invalid inputs passed, please try again",
      errors: errors.array(),
    });
  }
  const { email, role } = req.body;
  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      "Something went wrong while fetching the data, please try again",
      500
    );
    return next(error);
  }
  if (existingUser) {
    const error = new HttpError("Email already exists, please try again", 500);
    return next(error);
  }

  const createdUser = new User({
    email,
    role,
  });
  try {
    await createdUser.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong while creating the user, please try again",
      500
    );
    return next(error);
  }
  res.status(201).json({ userId: createdUser.id });
};

exports.inviteUser = inviteUser;
