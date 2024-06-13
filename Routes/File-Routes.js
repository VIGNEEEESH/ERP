const express = require('express');
const multer = require('multer');
const { uploadFile, getFiles, getFile } = require('../Controllers/File-Controller');

const router = express.Router();
const upload = multer();

router.post('/upload', upload.single('file'), uploadFile);
router.get('/', getFiles);
router.get('/:id', getFile);

module.exports = router;
