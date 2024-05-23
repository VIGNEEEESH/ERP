const HttpError = require("../Middleware/http-error");
const { validationResult } = require("express-validator");
const User = require("../Models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const nodemailer = require("nodemailer");

const inviteUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: "Invalid inputs passed, please try again",
      errors: errors.array(),
    });
  }
  const { email, role } = req.body;
  let user;

  try {
    user = await User.findOne({ email: email.toLowerCase() });
  } catch (err) {
    const error = new HttpError(
      "Something went wrong while fetching the data, please try again",
      500
    );
    return next(error);
  }
  if (user) {
    const error = new HttpError("Email already exists, please try again", 500);
    return next(error);
  }

  const createdUser = new User({
    email: email.toLowerCase(),
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
    salary,
    pan,
    aadhar,
  } = req.body;
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
  if (!user) {
    const error = new HttpError("No user found, please try again", 500);
    return next(error);
  }
  if (user.password) {
    const error = new HttpError(
      "User already got signed up, please try signing in",
      500
    );
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
  (user.salary = salary), (user.pan = pan), (user.aadhar = aadhar);
  try {
    await user.save();
  } catch (err) {
    console.log(err);
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
const getUsersByRole = async (req, res, next) => {
  const role = req.params.role;
  let users;
  try {
    users = await User.find({ role: role });
  } catch (err) {
    const error = new HttpError(
      "Something went wrong while fetching the data, please try again",
      500
    );
    return next(error);
  }
  res.status(200).json({ users: users });
};
const login = async (req, res, next) => {
  const { email, password } = req.body;
  console.log(email);
  let user;
  try {
    user = await User.findOne({ email: email.toLowerCase() });
  } catch (err) {
    const error = new HttpError(
      "Something went wrong while fetching the data, please try again",
      500
    );
    return next(error);
  }
  if (!user) {
    const error = new HttpError("User not found, please try again", 500);
    return next(error);
  }
  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, user.password);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong while verification of the password, please try again",
      500
    );
    return next(error);
  }
  if (!isValidPassword) {
    const error = new HttpError("Invalid crudentials, please try again", 401);
    return next(error);
  }
  let token;
  try {
    token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
      },
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
  res.status(200).json({
    userId: user.id,
    email: user.email,
    role: user.role,
    token,
  });
};
const forgotPassword = async (req, res, next) => {
  const { password, newPassword, userId, confirmPassword } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ _id: userId });
  } catch (err) {
    const error = new HttpError(
      "Something went wrong while verifying the user, please try again",
      500
    );
    return next(error);
  }

  if (!existingUser) {
    const error = new HttpError("Invalid email, please try again", 401);
    return next(error);
  }

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      "Something went wrong while verifying the password, please try again",
      500
    );
    return next(error);
  }

  if (!isValidPassword) {
    const error = new HttpError("Invalid credentials, please try again", 401);
    return next(error);
  }
  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(newPassword, 12);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong while encrypting the password, please try again",
      500
    );
    return next(error);
  }

  // Update the password
  existingUser.password = hashedPassword;

  try {
    // Save the updated admin document
    await existingUser.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong while updating the password, please try again",
      500
    );
    return next(error);
  }

  res.status(200).json({
    message: "Password updated successfully",
  });
};
const updateUserById = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new HttpError("Invalid inputs, please try again", 422);
    return next(error);
  }
  const id = req.params.id;
  const {
    firstName,
    lastName,
    mobile,
    email,
    address,
    pincode,
    state,
    country,
    salary,
    role,
    pan,
    aadhar,
  } = req.body;
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
  if (!user) {
    const error = new HttpError("User not found, please try again", 500);
    return next(error);
  }
  // let hashedPassword;
  // try {
  //   hashedPassword = await bcrypt.hash(password, 12);
  // } catch (err) {
  //   const error = new HttpError(
  //     "Something went wrong while encrypting the password, please try again",
  //     500
  //   );
  //   return next(error);
  // }
  if (req.file != null) {
    user.image = req.file.path;
  } else {
    user.image = user.image;
  }
  user.firstName = firstName ? firstName : user.firstName;
  user.lastName = lastName ? lastName : user.lastName;
  user.mobile = mobile ? mobile : user.mobile;
  user.email = email ? email : user.email;
  user.address = address ? address : user.address;
  user.pincode = pincode ? pincode : user.pincode;
  user.role = role ? role : user.role;
  user.state = state ? state : user.state;
  user.country = country ? country : user.country;
  user.salary = salary ? salary : user.salary;
  user.pan = pan ? pan : user.pan;
  user.aadhar = aadhar ? aadhar : user.aadhar;
  try {
    await user.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong while updating the data, please try again",
      500
    );
    return next(error);
  }

  res.status(201).json({ user: user });
};
const updateUserImageById = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new HttpError("Invalid inputs, please try again", 422);
    return next(error);
  }
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
  if (!user) {
    const error = new HttpError("User not found, please try again", 500);
    return next(error);
  }

  if (req.file != null) {
    user.image = req.file.path;
  } else {
    user.image = user.image;
  }

  try {
    await user.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong while updating the data, please try again",
      500
    );
    return next(error);
  }

  res.status(201).json({ user: user });
};
const deleteUserById = async (req, res, next) => {
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
  if (!user) {
    const error = new HttpError("User not found, please try again", 500);
    return next(error);
  }

  try {
    await user.deleteOne();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong while deleting the user, please try again",
      500
    );
    return next(error);
  }
  res.status(200).json({ message: "User deleted successfully" });
  if (user.image) {
    const imagePath = user.image;
    fs.unlink(imagePath, (err) => {
      console.log(err);
    });
  }
};
const resetPassword = async (req, res, next) => {
  const { email } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      "Something went wrong while fetching the user data, please try again",
      500
    );
    return next(error);
  }

  if (!existingUser) {
    const error = new HttpError("No user found with that email address", 404);
    return next(error);
  }

  // Generate a unique token
  const token = jwt.sign(
    { userId: existingUser.id, email: existingUser.email },
    process.env.JWT_KEY,
    { expiresIn: "1h" }
  );

  // Update the user's reset password token
  existingUser.resetPasswordToken = token;
  existingUser.resetPasswordTokenExpiration = Date.now() + 3600000; // 1 hour

  try {
    await existingUser.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong while updating the user data, please try again",
      500
    );
    return next(error);
  }

  // Create transporter using Outlook mail SMTP server
  const transporter = nodemailer.createTransport({
    host: "smtp.office365.com",
    port: 587,
    secure: false,
    auth: {
      user: "support@thecorrectsteps.com", // Replace with your Outlook email
      pass: "Sajaljain@390", // Replace with your Outlook password
    },
  });

  const mailOptions = {
    from: "support@thecorrectsteps.com", // Replace with your Outlook email
    to: email,
    subject: "Password Reset request for ERP",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2>Hello ${existingUser.firstName},</h2>
        <p>Please click on the following link to reset your password:</p>
        <a href="http://localhost:5173/reset-password?token=${token}" 
           style="display: inline-block; padding: 10px 20px; margin: 10px 0; 
                  font-size: 16px; color: #fff; background-color: #007bff; 
                  text-decoration: none; border-radius: 5px;">
          Reset Password
        </a>
        <p>If the button above does not work, please copy and paste the following link into your web browser:</p>
        <p><a href="http://localhost:5173/reset-password?token=${token}">
          http://localhost:5173/reset-password?token=${token}
        </a></p>
        <p>Thank you!</p>
      </div>
    `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
      const httpError = new HttpError(
        "Failed to send reset password email",
        500
      ); // Rename error variable
      return next(httpError);
    }
    console.log("Email sent:", info.response);
    res
      .status(200)
      .json({ message: "Reset password instructions sent to your email" });
  });
};

const updatePassword = async (req, res, next) => {
  const { email, newPassword } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      "Something went wrong while fetching the user data, please try again",
      500
    );
    return next(error);
  }

  if (!existingUser) {
    const error = new HttpError("No user found with that email", 404);
    return next(error);
  }

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(newPassword, 12);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong while encrypting the password, please try again",
      500
    );
    return next(error);
  }

  existingUser.password = hashedPassword;

  try {
    await existingUser.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong while updating the user data, please try again",
      500
    );
    return next(error);
  }

  res.status(200).json({ message: "Password updated successfully" });
};

exports.updatePassword = updatePassword;
exports.resetPassword = resetPassword;
exports.inviteUser = inviteUser;
exports.createUser = createUser;
exports.getAllUsers = getAllUsers;
exports.getUserById = getUserById;
exports.getUsersByRole = getUsersByRole;
exports.login = login;
exports.forgotPassword = forgotPassword;
exports.updateUserById = updateUserById;
exports.updateUserImageById = updateUserImageById;
exports.deleteUserById = deleteUserById;
