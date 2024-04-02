const HttpError = require("../Middleware/http-error");
const { validationResult } = require("express-validator");
const Work = require("../Models/Work");

const createWork = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new HttpError("Invalid inputs, please try again", 422);
    return next(error);
  }
  const { date, workDone, userId } = req.body;

  const createdWork = new Work({
    date,
    workDone,
    userId,
  });
  try {
    await createdWork.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong while saving the data, please try again",
      500
    );
    return next(error);
  }
  res.status(201).json({ createdWork: createdWork });
};
const getAllWorks = async (req, res, next) => {
  let works;
  try {
    works = await Work.find({});
  } catch (err) {
    const error = new HttpError(
      "Something went wrong while fetching the data, please try again",
      500
    );
    return next(error);
  }
  res.status(200).json({ works: works });
};
const getWorkByUserId = async (req, res, next) => {
  const userId = req.params.userId;
  let work;
  try {
    work = await Work.find({ userId: userId });
  } catch (err) {
    const error = new HttpError(
      "Something went wrong while fetching the data, please try again",
      500
    );
    return next(error);
  }
  res.status(200).json({ work: work });
};
const getWorkByDate = async (req, res, next) => {
  const date = req.params.date;
  let work;
  try {
    work = await Work.find({ date: date });
  } catch (err) {
    const error = new HttpError(
      "Something went wrong while fetching the data, please try again",
      500
    );
    return next(error);
  }
  res.status(200).json({ work: work });
};
const updateWorkById = async (req, res, next) => {
  const id = req.params.id;
  let work;
  const { workDone } = req.body;
  try {
    work = await Work.findOne({ _id: id });
  } catch (err) {
    const error = new HttpError(
      "Something went wrong while fetching the data, please try again",
      500
    );
    return next(error);
  }
  if (!work) {
    const error = new HttpError("Work not found, please try again", 500);
    return next(error);
  }

  work.workDone = workDone ? workDone : work.workDone;

  try {
    work.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong while saving the data, please try again",
      500
    );
    return next(error);
  }
  res.status(201).json({ work: work });
};
const deleteWorkById = async (req, res, next) => {
  const id = req.params.id;
  let work;
  try {
    work = await Work.findOne({ _id: id });
  } catch (err) {
    const error = new HttpError(
      "Something went wrong while saving the data, please try again",
      500
    );
    return next(error);
  }
  if (!work) {
    const error = new HttpError("Work not found, please try again", 500);
    return next(error);
  }
  try {
    await Work.deleteOne();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong while deleting the data, please try again",
      500
    );
    return next(error);
  }
  res.status(200).json({ message: "Work deleted successfully" });
};
exports.createWork = createWork;
exports.getAllWorks = getAllWorks;
exports.getWorkByDate = getWorkByDate;
exports.getWorkByUserId = getWorkByUserId;
exports.updateWorkById = updateWorkById;
exports.deleteWorkById = deleteWorkById;
