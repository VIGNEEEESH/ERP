const bcrypt = require('bcryptjs');
const File = require('../Models/File');

// Function to encrypt file data
const encryptFileData = async (data) => {
    const salt = await bcrypt.genSalt(10);
    const encrypted = await bcrypt.hash(data.toString('base64'), salt);
    return encrypted;
};

// Function to upload file
const uploadFile = async (req, res) => {
    try {
        const { originalname, mimetype, buffer } = req.file;

        const encryptedName = await encryptFileData(originalname);
        const encryptedData = await encryptFileData(buffer);

        const newFile = new File({
            originalName: originalname,
            encryptedName,
            data: Buffer.from(encryptedData, 'base64'),
            contentType: mimetype,
        });

        await newFile.save();
        res.status(201).json({ message: 'File uploaded successfully' });
    } catch (error) {
        console.error('Error uploading file:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Function to get all files
const getFiles = async (req, res) => {
    try {
        const files = await File.find().select('-data');
        res.status(200).json(files);
    } catch (error) {
        console.error('Error fetching files:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const getFile = async (req, res) => {
    try {
        const file = await File.findById(req.params.id);
        if (!file) {
            return res.status(404).json({ message: 'File not found' });
        }
        res.set('Content-Type', file.contentType);
        res.send(file.data);
    } catch (error) {
        console.error('Error fetching file:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    uploadFile,
    getFiles,
    getFile
};