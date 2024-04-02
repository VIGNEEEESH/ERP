const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const departmentSchema = new Schema({
  departmentName: { type: String, required: true },
  userId: { [type: String, required: true ]},
});

module.exports = mongoose.model("Department", departmentSchema);
