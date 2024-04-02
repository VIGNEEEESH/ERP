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
const createUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: "Invalid inputs passed, please try again",
      errors: errors.array(),
    });
  }
  const {
    id,
    firstName,
    lastName,
    password,
    mobile,
    address,
    pincode,
    state,
    country,
  } = req.body;
  let user;
  try {
    user = await findOne({ _id: id });
  } catch (err) {
    const error = new HttpError(
      "Something went wrong while fetching the data, please try again",
      500
    );
    return next(error);
  }
  if (!user) {
    const error = new HttpError("No user found, please try again", 500);
    return next(error);
  }
  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong while encrypting the password, please try again",
      500
    );
    return next(error);
  }
  user.firstName = firstName;
  user.lastName = lastName;
  user.password = hashedPassword;
  user.mobile = mobile;
  user.address = address;
  user.pincode = pincode;
  user.state = state;
  user.country = country;
  user.image = req.file.path;
  try {
    await user.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong while saving the user, please try again",
      500
    );
    return next(error);
  }
  try {
    token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_KEY,
      { expiresIn: "1h" }
    );
  } catch (err) {
    const error = new HttpError(
      "Something went wrong while generating the JWT token, please try again",
      500
    );
    return next(error);
  }
  res.status(201).json({
    userId: user.id,
    email: user.email,
    role: user.role,
    token: token,
  });
};
const getAllUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, "-password");
  } catch (err) {
    const error = new HttpError(
      "Something went wrong while fetching the data, please try again",
      500
    );
    return next(error);
  }
  res.status(200).json({ users: users });
};
const getUserById = async (req, res, next) => {
  const id = req.params.id;
  let user;
  try {
    user = await User.findOne({ _id: id });
  } catch (err) {
    const error = new HttpError(
      "Something went wrong while fetching the data, please try again",
      500
    );
    return next(error);
  }
  res.status(200).json({ user: user });
};
exports.inviteUser = inviteUser;
exports.createUser = createUser;
exports.getAllUsers = getAllUsers;
exports.getUserById = getUserById;
