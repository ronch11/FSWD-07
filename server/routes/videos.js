require('dotenv').config();
const express = require('express');
const Joi = require('joi')
const router = express.Router()
const Videos = require('../models/video')
const Reactions = require('../models/reaction')
const jwt = require('jsonwebtoken');
const fs = require('fs');
const authCheck = require('../authCheck')
const jwtSecretKey = require('../config/jwtconfig').secretKey

module.exports = router

router.post('/upload', async (req, res) => {  
    const {error, user} = await authCheck(req)
    if(error) return res.status(403).json(error)
    const userId = user._id

    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send('No files were uploaded.');
    }

    try {
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
          res.status(200).json(newVideo)
        });

        // Perform database lookup or any further operations using the user ID
        // Example: const user = await User.findOne({ _id: userId });

        // Return the user object or any relevant information
    } catch (error) {
        console.log(error)
        return res.status(403).json({ message: 'Invalid token' });
    }
  });

const viewsMap = {};
router.get('/watch/:videoId', async (req, res) => {
    try
    {
        const video = await Videos.getVideoById(req.params.videoId)
        if(!video) return res.status(404).json("Video not found")
        // TODO: check if user is allowed to watch the video, if not return 403
        const videoPath = __dirname + '/../uploads/' + video.userId + '/' + video._id + '.' + video.fileType; //adjust the path as needed
        console.log(videoPath);
        

        // take care of views
        const userIp = req.ip; // get the user's IP address
        const currentTime = new Date().getTime();
        const lastViewTime = viewsMap[`${userIp}:${req.params.videoId}`] || 0; 

        if (currentTime - lastViewTime > 1000 * 10) { // if difference is more than 10 second
            await Videos.addView(req.params.videoId);
            viewsMap[`${userIp}:${req.params.videoId}`] = currentTime; // jot down the time
        }

        // stream the video
        const stat = fs.statSync(videoPath)
        const fileSize = stat.size
        const range = req.headers.range
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

router.put('/update/:videoId', async (req, res) => {
    const {error, user} = await authCheck(req)
    if(error) return res.status(403).json(error)
    const userId = user._id
    const bodySchema = Joi.object({
        title : Joi.string(),
        description : Joi.string(),
        tags : Joi.array().items(Joi.string()),
        visibility : Joi.string().valid('public', 'private', 'unlisted'),
    })
    const { error: bodyError, value } = bodySchema.validate(req.body)
    if(bodyError) return res.status(400).json(bodyError.details[0].message)
    const changes = value
    try{
        const video = await Videos.getVideoById(req.params.videoId)
        if(!video) return res.status(404).json("Video not found")
        if(video.userId !== userId) return res.status(403).json("You are not allowed to edit this video")
        await Videos.updateVideo(req.params.videoId, changes)
        res.status(200).json("Video updated")
    }
    catch (error){
        console.log(error)
        res.status(500).json()
    }
});

router.get('/details/:videoId', async (req, res) => {
    try
    {
        const video = await Videos.getVideoById(req.params.videoId)
        if(!video) return res.status(404).json("Video not found")
        video.reactions = {}
        video.reactions.like = await Reactions.getReactionCount(req.params.videoId, 'like')
        video.reactions.dislike = await Reactions.getReactionCount(req.params.videoId, 'dislike')
        res.status(200).json(video)
    }
    catch (error){
        console.log(error)
        res.status(500).json()
    }
});

router.post('/react/:videoId', async (req, res) => {
    const {error, user} = await authCheck(req)
    if(error) return res.status(403).json(error)
    const userId = user._id
    const bodySchema = Joi.object({
        reaction : Joi.string().valid('like', 'dislike', '').required()
    })
    const { error: bodyError, value } = bodySchema.validate(req.body)
    if(bodyError) return res.status(400).json(bodyError.details[0].message)
    const { reaction } = value
    try{
      const existReaction = await Reactions.getReaction(req.params.videoId, userId)
      if(existReaction && reaction === '') {
        await Reactions.deleteReaction(req.params.videoId, userId)
        return res.status(200).json('Reaction removed')
      }
      await Reactions.react(req.params.videoId, userId, reaction)
      return res.status(200).json('Reaction updated')
    }
    catch(error){
        console.log(error)
        res.status(500).json()
    }
});
// TODO: check file name doesnt contain forbidden characters (e.g. /, '..', etc.)