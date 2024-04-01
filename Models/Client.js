const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const clientSchema = new Schema({
  clientName: { type: String, required: true },
  companyName: { type: String, required: true },
  projects: [{ type: String, required: true }],
});

module.exports = mongoose.model("Client", clientSchema);
