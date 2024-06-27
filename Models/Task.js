const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const taskSchema = new Schema({
  taskName: { type: String, required: true },
  taskDescription: { type: String, required: true },
  members: [{ type: String }],
  deadline: { type: String },
  assignedDate: { type: String, required: true },
  progress: { type: String, default: "To Do" },
  department: { type: String, required: true },
  files: [{ type: String }],
});

module.exports = mongoose.model("Task", taskSchema);
