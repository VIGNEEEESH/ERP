const HttpError = require("../Middleware/http-error");
const { validationResult } = require("express-validator");
const Task = require("../Models/Task");

const createTask = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new HttpError("Invalid inputs, please try again", 422);
    return next(error);
  }
  const {
    taskName,
    taskDescription,
    members,
    deadline,
    assignedDate,
    progress,
  } = req.body;
  let existingTask;
  try {
    existingTask = await Task.findOne({
      taskName: taskName,
    });
  } catch (err) {
    const error = new HttpError(
      "Something went wrong while fetching the data, please try again",
      500
    );
    return next(error);
  }
  if (existingTask) {
    const error = new HttpError("Task already exists, please try again", 500);
    return next(error);
  }

  const createdTask = new Task({
    taskName,
    taskDescription,
    members,
    deadline,
    assignedDate,
    progress,
  });
  try {
    await createdTask.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong while saving the data, please try again",
      500
    );
    return next(error);
  }
  res.status(201).json({ createdTask: createdTask });
};
const getAllTasks = async (req, res, next) => {
  let tasks;
  try {
    tasks = await Task.find({});
  } catch (err) {
    const error = new HttpError(
      "Something went wrong while fetching the data, please try again",
      500
    );
    return next(error);
  }
  res.status(200).json({ tasks: tasks });
};
const getTaskById = async (req, res, next) => {
  const id = req.params.id;
  let task;
  try {
    task = await Task.find({ _id: id });
  } catch (err) {
    const error = new HttpError(
      "Something went wrong while fetching the data, please try again",
      500
    );
    return next(error);
  }
  res.status(200).json({ task: task });
};
const getTasksByEmail = async (req, res, next) => {
  const email = req.params.email;
  let tasks;
  try {
    tasks = await Task.find({ members: email });
  } catch (err) {
    const error = new HttpError(
      "Something went wrong while fetching the data, please try again",
      500
    );
    return next(error);
  }
  res.status(200).json({ tasks: tasks });
};
const updateTaskById = async (req, res, next) => {
  const id = req.params.id;
  let task;
  const {
    taskName,
    taskDescription,
    members,
    deadline,
    assignedDate,
    progress,
  } = req.body;
  try {
    task = await Task.findOne({ _id: id });
  } catch (err) {
    const error = new HttpError(
      "Something went wrong while fetching the data, please try again",
      500
    );
    return next(error);
  }
  if (!task) {
    const error = new HttpError("Task not found, please try again", 500);
    return next(error);
  }

  task.taskName = taskName ? taskName : task.taskName;
  task.taskDescription = taskDescription
    ? taskDescription
    : task.taskDescription;
  task.members = members ? members : task.members;
  task.deadline = deadline ? deadline : task.deadline;
  task.assignedDate = assignedDate ? assignedDate : task.assignedDate;
  task.progress = progress ? progress : task.progress;

  try {
    task.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong while saving the data, please try again",
      500
    );
    return next(error);
  }
  res.status(201).json({ task: task });
};
const updateTaskProgressById = async (req, res, next) => {
  const id = req.params.id;
  let task;
  const { progress } = req.body;
  try {
    task = await Task.findOne({ _id: id });
  } catch (err) {
    const error = new HttpError(
      "Something went wrong while fetching the data, please try again",
      500
    );
    return next(error);
  }
  if (!task) {
    const error = new HttpError("Task not found, please try again", 500);
    return next(error);
  }

  task.progress = progress ? progress : task.progress;

  try {
    task.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong while saving the data, please try again",
      500
    );
    return next(error);
  }
  res.status(201).json({ task: task });
};
const deleteTaskById = async (req, res, next) => {
  const id = req.params.id;
  let task;
  try {
    task = await Task.findOne({ _id: id });
  } catch (err) {
    const error = new HttpError(
      "Something went wrong while saving the data, please try again",
      500
    );
    return next(error);
  }
  if (!task) {
    const error = new HttpError("Task not found, please try again", 500);
    return next(error);
  }
  try {
    await task.deleteOne();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong while deleting the data, please try again",
      500
    );
    return next(error);
  }
  res.status(200).json({ message: "Task deleted successfully" });
};
exports.createTask = createTask;
exports.getAllTasks = getAllTasks;
exports.getTaskById = getTaskById;
exports.getTasksByEmail = getTasksByEmail;
exports.updateTaskById = updateTaskById;
exports.updateTaskProgressById = updateTaskProgressById;
exports.deleteTaskById = deleteTaskById;
