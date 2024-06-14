const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  filename: String,
  contentType: String,
  fileId: mongoose.Schema.Types.ObjectId
});

module.exports = mongoose.model('File', fileSchema);
