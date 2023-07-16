require('dotenv').config();
const express = require('express');
const Joi = require('joi')
const router = express.Router()
module.exports = router

router.post('/upload', (req, res) => {  
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send('No files were uploaded.');
    }
  
    const videoFile = req.files.video;
  
    const uploadPath = __dirname + '/../uploads/' + videoFile.name; //adjust the path as needed
  
    videoFile.mv(uploadPath, (err) => {
      if (err) {
        return res.status(500).send(err);
      }
      console.log('File uploaded to ' + uploadPath);
      res.send('File uploaded to ' + uploadPath);
    });
  });