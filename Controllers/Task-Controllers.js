const HttpError = require("../Middleware/http-error");
const { validationResult } = require("express-validator");
const Task = require("../Models/Task");
const Department = require("../Models/Department");
const fs = require("fs");
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
    department,
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
  console.log(req.files);

  const filePaths = req.files.map((file) => file.path);
  const createdTask = new Task({
    taskName,
    taskDescription,
    members,
    deadline,
    assignedDate,
    progress,
    department,
    files: filePaths,
  });
  try {
    await createdTask.save();
  } catch (err) {
    console.log(err);
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
const getTasksByDepartmentAndId = async (req, res, next) => {
  const id = req.params.id;
  try {
    const department = await Department.findOne({ userId: id }).lean();
    if (!department) {
      throw new HttpError("Department not found", 404);
    }

    const tasks = await Task.find({ department: department.departmentName })
      .lean()
      .populate("department", "name");

    res.status(200).json({ tasks: tasks });
  } catch (err) {
    console.error(err.message);
    const error = new HttpError(
      "Something went wrong while fetching the data, please try again",
      500
    );
    return next(error);
  }
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
    department,
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

  if (req.files) {
    const filePaths = req.files.map((file) => file.path);
    task.files.push(...filePaths);
  }

  task.taskName = taskName ? taskName : task.taskName;
  task.taskDescription = taskDescription
    ? taskDescription
    : task.taskDescription;
  task.members = members ? members : task.members;
  task.deadline = deadline ? deadline : task.deadline;
  task.assignedDate = assignedDate ? assignedDate : task.assignedDate;
  task.progress = progress ? progress : task.progress;
  task.department = department ? department : task.department;

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
const addTaskFileById = async (req, res, next) => {
  const id = req.params.id;
  let task;

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

  task.files.push(...req.files);

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
      "Something went wrong while finding the task, please try again",
      500
    );
    return next(error);
  }

  if (!task) {
    const error = new HttpError("Task not found, please try again", 404);
    return next(error);
  }

  const filePaths = task.files; // Get file paths associated with the task
  try {
    await task.deleteOne(); // Delete task from the database
    // Unlink (delete) associated files
    filePaths.forEach((filePath) => {
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error("Error deleting file:", err);
        } else {
          console.log("File deleted successfully:", filePath);
        }
      });
    });
  } catch (err) {
    const error = new HttpError(
      "Something went wrong while deleting the task, please try again",
      500
    );
    return next(error);
  }

  res.status(200).json({ message: "Task deleted successfully" });
};

exports.createTask = createTask;
exports.addTaskFileById = addTaskFileById;
exports.getAllTasks = getAllTasks;
exports.getTaskById = getTaskById;
exports.getTasksByEmail = getTasksByEmail;
exports.getTasksByDepartmentAndId = getTasksByDepartmentAndId;
exports.updateTaskById = updateTaskById;
exports.updateTaskProgressById = updateTaskProgressById;
exports.deleteTaskById = deleteTaskById;
