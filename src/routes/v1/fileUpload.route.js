const express = require('express');
const multer = require('multer');

const { uploadFileToS3 } = require('../../modules/fileUpload/fileUpload.service');
const httpStatus = require('http-status');

const router = express.Router();
const upload = multer();

router.post('/add', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send('No file uploaded.');
    }
    const fileLocation = await uploadFileToS3(req.file);
    if (!fileLocation) {
      throw new Error('File upload failed or no location returned.');
    }
    res.json({
      status: httpStatus.OK,
      isSuccess: true,
      location: fileLocation
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).send('Error uploading file.');
  }
});

module.exports = router;
