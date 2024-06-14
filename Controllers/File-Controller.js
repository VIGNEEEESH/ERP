// File controller (file.controller.js)
const mongoose = require("mongoose");
const Grid = require("gridfs-stream");
const File = require("../Models/File");

let gfs;

mongoose.connection.once("open", () => {
  gfs = Grid(mongoose.connection.db, mongoose.mongo);
  gfs.collection("uploads");
});

// Upload a file
exports.uploadFile = async (req, res) => {
  try {
    const file = req.file;
    const newFile = new File({
      filename: file.originalname,
      contentType: file.mimetype,
      fileId: file.id,
    });
    await newFile.save();
    res.status(200).json({ message: "File uploaded successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get all files
exports.getAllFiles = async (req, res) => {
  try {
    const files = await File.find();
    res.status(200).json(files);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Delete a file
exports.deleteFile = async (req, res) => {
  try {
    const fileId = req.params.id;
    await gfs.files.deleteOne({ _id: mongoose.Types.ObjectId(fileId) });
    await File.findOneAndDelete({ fileId });
    res.status(200).json({ message: "File deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Open a file
exports.openFile = async (req, res) => {
  try {
    const filename = req.params.filename;
    const file = await gfs.files.findOne({ filename });
    if (!file) {
      return res.status(404).json({ error: "File not found" });
    }
    const readstream = gfs.createReadStream({ filename });
    readstream.pipe(res);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};
