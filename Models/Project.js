const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const projectSchema = new Schema({
  projectName: { type: String, required: true },
  projectDescription: { type: String, required: true },
  members: [{ type: String }],
  deadline: { type: String },
  assignedDate: { type: String, required: true },
  progress: { type: String },
  department: { type: String, required: true },
  files: [{ type: String }],
});

module.exports = mongoose.model("Project", projectSchema);
