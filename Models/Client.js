const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const clientSchema = new Schema({
  clientName: { type: String, required: true },
  companyName: { type: String },
  mobile: { type: String },
  email: { type: String, required: true },
  projects: [{ type: String }],
});

module.exports = mongoose.model("Client", clientSchema);
