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
const getClientById = async (req, res, next) => {
  const id = req.params.id;
  let client;
  try {
    client = await Client.find({ _id: id });
  } catch (err) {
    const error = new HttpError(
      "Something went wrong while fetching the data, please try again",
      500
    );
    return next(error);
  }
  res.status(200).json({ client: client });
};
const updateClientById = async (req, res, next) => {
  const id = req.params.id;
  let client;
  const { clientName, companyName, mobile, projects } = req.body;
  try {
    client = await Client.findOne({ _id: id });
  } catch (err) {
    const error = new HttpError(
      "Something went wrong while fetching the data, please try again",
      500
    );
    return next(error);
  }
  if (!client) {
    const error = new HttpError("Client not found, please try again", 500);
    return next(error);
  }
  client.clientName = clientName ? clientName : client.clientName;
  client.companyName = companyName ? companyName : client.companyName;
  client.mobile = mobile ? mobile : client.mobile;
  client.projects = projects
    ? [...client.projects, ...projects]
    : client.projects;

  try {
    client.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong while saving the data, please try again",
      500
    );
    return next(error);
  }
  res.status(201).json({ client: client });
};
const deleteClientById = async (req, res, next) => {
  const id = req.params.id;
  let client;
  try {
    client = await Client.findOne({ _id: id });
  } catch (err) {
    const error = new HttpError(
      "Something went wrong while saving the data, please try again",
      500
    );
    return next(error);
  }
  if (!client) {
    const error = new HttpError("Client not found, please try again", 500);
    return next(error);
  }
  try {
    await client.deleteOne();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong while deleting the data, please try again",
      500
    );
    return next(error);
  }
  res.status(200).json({ message: "Client deleted successfully" });
};
exports.createClient = createClient;
exports.getAllClients = getAllClients;
exports.getClientById = getClientById;
exports.updateClientById = updateClientById;
exports.deleteClientById = deleteClientById;
