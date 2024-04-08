const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const attendanceSchema = new Schema({
  attendanceStatus: { type: String, required: true },
  date: { type: String, required: true, unique: false },
  loggedInTime: { type: String },
  loggedOutTime: { type: String },
  workStatus: { type: String },
  userId: { type: String, required: true },
  email: { type: String, required: true },
});
module.exports = mongoose.model("Attendance", attendanceSchema);
