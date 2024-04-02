const HttpError = require("../Middleware/http-error");
const { validationResult } = require("express-validator");
const Client = require("../Models/Client");

const createClient = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new HttpError("Invalid inputs, please try again", 422);
    return next(error);
  }
  const { clientName, companyName, projects, mobile, email } = req.body;
  let existingClient;
  try {
    existingClient = await Client.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      "Something went wrong while fetching the data, please try again",
      500
    );
    return next(error);
  }
  if (existingClient) {
    const error = new HttpError("Email already exists, please try again", 500);
    return next(error);
  }

  const createdClient = new Client({
    clientName,
    companyName,
    projects,
    mobile,
    email,
  });
  try {
    await createdClient.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong while saving the data, please try again",
      500
    );
    return next(error);
  }
  res.status(201).json({ createdClient: createdClient });
};
const getAllClients = async (req, res, next) => {
  let clients;
  try {
    clients = await Client.find({});
  } catch (err) {
    const error = new HttpError(
      "Something went wrong while fetching the data, please try again",
      500
    );
    return next(error);
  }
  res.status(200).json({ clients: clients });
};
exports.createClient = createClient;
exports.getAllClients = getAllClients;
