const HttpError = require("../Middleware/http-error");
const { validationResult } = require("express-validator");
const Project = require("../Models/Project");

const createProject = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new HttpError("Invalid inputs, please try again", 422);
    return next(error);
  }
  const {
    projectName,
    projectDescription,
    members,
    deadline,
    assignedDate,
    progress,
  } = req.body;
  let existingProject;
  try {
    existingProject = await Project.findOne({
      projectName: projectName,
    });
  } catch (err) {
    const error = new HttpError(
      "Something went wrong while fetching the data, please try again",
      500
    );
    return next(error);
  }
  if (existingProject) {
    const error = new HttpError(
      "Project already exists, please try again",
      500
    );
    return next(error);
  }

  const createdProject = new Project({
    projectName,
    projectDescription,
    members,
    deadline,
    assignedDate,
    progress,
  });
  try {
    await createdProject.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong while saving the data, please try again",
      500
    );
    return next(error);
  }
  res.status(201).json({ createdProject: createdProject });
};
const getAllProjects = async (req, res, next) => {
  let projects;
  try {
    projects = await Project.find({});
  } catch (err) {
    const error = new HttpError(
      "Something went wrong while fetching the data, please try again",
      500
    );
    return next(error);
  }
  res.status(200).json({ projects: projects });
};
const getProjectById = async (req, res, next) => {
  const id = req.params.id;
  let project;
  try {
    project = await Project.find({ _id: id });
  } catch (err) {
    const error = new HttpError(
      "Something went wrong while fetching the data, please try again",
      500
    );
    return next(error);
  }
  res.status(200).json({ project: project });
};
const updateProjectById = async (req, res, next) => {
  const id = req.params.id;
  let project;
  const {
    projectName,
    projectDescription,
    members,
    deadline,
    assignedDate,
    progress,
  } = req.body;
  try {
    project = await Project.findOne({ _id: id });
  } catch (err) {
    const error = new HttpError(
      "Something went wrong while fetching the data, please try again",
      500
    );
    return next(error);
  }
  if (!project) {
    const error = new HttpError("Project not found, please try again", 500);
    return next(error);
  }

  project.projectName = projectName ? projectName : project.projectName;
  project.projectDescription = projectDescription
    ? projectDescription
    : project.projectDescription;
  project.members = members ? members : project.members;
  project.deadline = deadline ? deadline : project.deadline;
  project.assignedDate = assignedDate ? assignedDate : project.assignedDate;
  project.progress = progress ? progress : project.progress;

  try {
    project.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong while saving the data, please try again",
      500
    );
    return next(error);
  }
  res.status(201).json({ project: project });
};
const updateProjectProgressById = async (req, res, next) => {
  const id = req.params.id;
  let project;
  const { progress } = req.body;
  try {
    project = await Project.findOne({ _id: id });
  } catch (err) {
    const error = new HttpError(
      "Something went wrong while fetching the data, please try again",
      500
    );
    return next(error);
  }
  if (!project) {
    const error = new HttpError("Project not found, please try again", 500);
    return next(error);
  }

  project.progress = progress ? progress : project.progress;

  try {
    project.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong while saving the data, please try again",
      500
    );
    return next(error);
  }
  res.status(201).json({ project: project });
};
const deleteProjectById = async (req, res, next) => {
  const id = req.params.id;
  let project;
  try {
    project = await Project.findOne({ _id: id });
  } catch (err) {
    const error = new HttpError(
      "Something went wrong while saving the data, please try again",
      500
    );
    return next(error);
  }
  if (!project) {
    const error = new HttpError("Project not found, please try again", 500);
    return next(error);
  }
  try {
    await Project.deleteOne();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong while deleting the data, please try again",
      500
    );
    return next(error);
  }
  res.status(200).json({ message: "Project deleted successfully" });
};
exports.createProject = createProject;
exports.getAllProjects = getAllProjects;
exports.getProjectById = getProjectById;
exports.updateProjectById = updateProjectById;
exports.updateProjectProgressById = updateProjectProgressById;
exports.deleteProjectById = deleteProjectById;
