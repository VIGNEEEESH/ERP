const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const uniqueValidator = require("mongoose-unique-validator");

const workSchema = new Schema({
  date: { type: String, required: true },
  workDone: { type: String, required: true },
  userId: { type: String, required: true },
});
workSchema.plugin(uniqueValidator);
module.exports = mongoose.model("Work", workSchema);
