const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const workSchema = new Schema({
  date: { type: String, required: true },
  workDone: { type: String, required: true },
  userId: { type: String, required: true },
});

workSchema.index({ date: 1, userId: 1 }, { unique: true });
module.exports = mongoose.model("Work", workSchema);
