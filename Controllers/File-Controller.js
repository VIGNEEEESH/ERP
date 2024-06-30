const File = require("../models/file");
const fs = require("fs");
const path = require("path");

// Upload a file
const uploadFile = async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const existingFile = await File.findOne({ filename: file.originalname });
    if (existingFile) {
      return res
        .status(409)
        .json({ error: "File with the same name already exists" });
    }
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split("T")[0];

    const newFile = new File({
      filename: file.originalname,
      contentType: file.mimetype,
      path: file.path,
      date: formattedDate,
      size: file.size,
    });
    await newFile.save();
    res.status(200).json({ message: "File uploaded successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get all files
const getAllFiles = async (req, res) => {
  try {
    const files = await File.find({});
    res.status(200).json({ files });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Open a file
const openFile = async (req, res) => {
  try {
    const filename = req.params.filename;
    const file = await File.findOne({ filename });
    if (!file) {
      return res.status(404).json({ error: "File not found" });
    }
    res.sendFile(path.resolve(file.path));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Delete a file
const deleteFile = async (req, res) => {
  try {
    const fileId = req.params.id;
    const file = await File.findById(fileId);
    if (!file) {
      return res.status(404).json({ error: "File not found" });
    }

    fs.unlink(file.path, async (err) => {
      if (err) {
        console.error(err);
        return res
          .status(500)
          .json({ error: "Could not delete file from filesystem" });
      }

      try {
        await File.findByIdAndDelete(fileId);
        res.status(200).json({ message: "File deleted successfully" });
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  getAllFiles,
  uploadFile,
  deleteFile,
  openFile,
};
