require('dotenv').config();
const express = require('express');
const Joi = require('joi')
const router = express.Router()
const Videos = require('../models/video')
const jwt = require('jsonwebtoken');
const fs = require('fs');
const jwtSecretKey = require('../config/jwtconfig').secretKey

module.exports = router

router.post('/upload', async (req, res) => {  
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send('No files were uploaded.');
    }
    const accessToken = req.headers.authorization; // Assuming the access token is included in the `Authorization` header

    if (!accessToken) {
        return res.status(401).json({ message: 'Access token not provided' });
    }

    try {
        const decodedToken = jwt.verify(accessToken, jwtSecretKey);
        const userId = decodedToken.id;
        console.log(userId)
        const videoFile = req.files.video;

        const fileType = videoFile.name.split('.').pop()
        const newVideo = await Videos.createVideo(userId, fileType, videoFile.name.split('.')[0])
        if(!newVideo) return res.status(500).json("Error creating video")
        // create a directory for the video
        const dirPath = __dirname + '/../uploads/' + userId;
        fs.mkdirSync(dirPath, { recursive: true });
        const uploadPath = dirPath + '/' + newVideo._id + '.' + newVideo.fileType; //adjust the path as needed
        console.log(uploadPath);
        videoFile.mv(uploadPath, (err) => {
          if (err) {
            return res.status(500).send(err);
          }
          console.log('File uploaded to ' + uploadPath);
          res.send('File uploaded to ' + uploadPath);
        });

        // Perform database lookup or any further operations using the user ID
        // Example: const user = await User.findOne({ _id: userId });

        // Return the user object or any relevant information
    } catch (error) {
        console.log(error)
        return res.status(403).json({ message: 'Invalid token' });
    }
  });


router.get('/watch/:videoId', async (req, res) => {
    try
    {
        const video = await Videos.getVideoById(req.params.videoId)
        if(!video) return res.status(404).json("Video not found")
        // TODO: check if user is allowed to watch the video, if not return 403
        const videoPath = __dirname + '/../uploads/' + video.userId + '/' + video._id + '.' + video.fileType; //adjust the path as needed
        console.log(videoPath);
        // stream the video
        const stat = fs.statSync(videoPath)
        const fileSize = stat.size
        const range = req.headers.range
        await Videos.addView(req.params.videoId)
        if (range) {
            const parts = range.replace(/bytes=/, "").split("-");
            const start = parseInt(parts[0], 10);
            const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
            const chunkSize = (end - start) + 1;
            const file = fs.createReadStream(videoPath, { start, end });
        
            const head = {
              'Content-Range': `bytes ${start}-${end}/${fileSize}`,
              'Accept-Ranges': 'bytes',
              'Content-Length': chunkSize,
              'Content-Type': `video/${video.fileType}`
            };
        
            res.writeHead(206, head);
            file.pipe(res);
          } else {
            const head = {
              'Content-Length': fileSize,
              'Content-Type': `video/${video.fileType}`
            };
        
            res.writeHead(200, head);
            fs.createReadStream(videoPath).pipe(res);
        }
    }
    catch (error){
        console.log(error)
        res.status(500).json()
    }
});
// TODO: check file name doesnt contain forbidden characters (e.g. /, '..', etc.)