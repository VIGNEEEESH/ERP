const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const projectSchema = new Schema({
  projectName: { type: String, required: true },
  projectDescription: { type: String, required: true },
  members: [{ type: String, required: true }],
  deadline: { type: String, required: true },
  assignedDate: { type: String, required: true },
  progress: { type: String, required: true },
});

module.exports = mongoose.model("Project", projectSchema);
