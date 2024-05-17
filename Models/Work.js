const mongoose = require("mongoose");

const workSchema = new mongoose.Schema({
  date: { type: String, required: true },
  workDone: { type: String, required: true },
  userId: { type: String, required: true },
});

// Add a compound unique index on date and userId

module.exports = mongoose.model("Work", workSchema);
