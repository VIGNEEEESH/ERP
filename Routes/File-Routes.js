// File routes (file.routes.js)
const express = require('express');
const router = express.Router();
const fileController = require('../Controllers/File-Controller');
const multer = require('multer');
const upload = multer({ dest: 'uploads/images/' });

router.post('/upload', upload.single('file'), fileController.uploadFile);
router.get('/', fileController.getAllFiles);
router.delete('/:id', fileController.deleteFile);
router.get('/:filename', fileController.openFile);

module.exports = router;
