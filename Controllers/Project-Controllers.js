const HttpError = require("../Middleware/http-error");
const { validationResult } = require("express-validator");
const Project = require("../Models/Project");
const Department = require("../Models/Department");
const fs = require("fs");
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

    department,
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
  const filePaths = req.files.map((file) => file.path);
  const createdProject = new Project({
    projectName,
    projectDescription,
    members,
    deadline,
    assignedDate,
    progress,
    department,
    files: filePaths,
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
    project = await Project.findOne({ _id: id });
  } catch (err) {
    const error = new HttpError(
      "Something went wrong while fetching the data, please try again",
      500
    );
    return next(error);
  }
  res.status(200).json({ project: project });
};
const getProjectsByEmail = async (req, res, next) => {
  const email = req.params.email;
  let projects;
  try {
    projects = await Project.find({ members: email });
  } catch (err) {
    const error = new HttpError(
      "Something went wrong while fetching the data, please try again",
      500
    );
    return next(error);
  }
  res.status(200).json({ projects: projects });
};
const getProjectsByDepartmentAndId = async (req, res, next) => {
  const id = req.params.id;
  try {
    const department = await Department.findOne({ userId: id }).lean();
    if (!department) {
      throw new HttpError("Department not found", 404);
    }

    const projects = await Project.find({
      department: department.departmentName,
    })
      .lean()
      .populate("department", "name");

    res.status(200).json({ projects: projects });
  } catch (err) {
    console.error(err.message);
    const error = new HttpError(
      "Something went wrong while fetching the data, please try again",
      500
    );
    return next(error);
  }
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
    department,
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
  if (req.files) {
    project.files.push(...req.files);
  }

  project.projectName = projectName ? projectName : project.projectName;
  project.projectDescription = projectDescription
    ? projectDescription
    : project.projectDescription;
  project.members = members ? members : project.members;
  project.deadline = deadline ? deadline : project.deadline;
  project.assignedDate = assignedDate ? assignedDate : project.assignedDate;
  project.progress = progress ? progress : project.progress;
  project.department = department ? department : project.department;

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
const addProjectFileById = async (req, res, next) => {
  const id = req.params.id;
  let project;

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

  project.files.push(...req.files);

  try {
    project.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong while saving the data, please try again",
      500
    );
    return next(error);
  }
  res.status(201).json({ task: task });
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
  const filePaths = project.files;
  try {
    await Project.deleteOne();
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
      "Something went wrong while deleting the data, please try again",
      500
    );
    return next(error);
  }
  res.status(200).json({ message: "Project deleted successfully" });
};
exports.createProject = createProject;
exports.addProjectFileById = addProjectFileById;
exports.getAllProjects = getAllProjects;
exports.getProjectById = getProjectById;
exports.getProjectsByEmail = getProjectsByEmail;
exports.getProjectsByDepartmentAndId = getProjectsByDepartmentAndId;
exports.updateProjectById = updateProjectById;
exports.updateProjectProgressById = updateProjectProgressById;
exports.deleteProjectById = deleteProjectById;
