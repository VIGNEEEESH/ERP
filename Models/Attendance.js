const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const uniqueValidator = require("mongoose-unique-validator");

const attendanceSchema = new Schema({
  attendanceStatus: { type: String, required: true },
  date: { type: String, required: true, unique: true },
  loggedInTime: { type: String, required: true },
  loggedOutTime: { type: String, required: true },
  workStatus: { type: String, required: true },
  userId: { type: String, required: true },
  email: { type: String, required: true },
});
attendanceSchema.plugin(uniqueValidator);
module.exports = mongoose.model("Attendance", attendanceSchema);
