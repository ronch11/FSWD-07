require('dotenv').config();
const express = require('express');
const Joi = require('joi')
const router = express.Router()
const Videos = require('../models/video')
const Users = require('../models/user')
const Reactions = require('../models/reaction')
const jwt = require('jsonwebtoken');
const fs = require('fs');
const authCheck = require('../authCheck')
const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
// ffmpeg.setFfmpegPath(ffmpegPath);


module.exports = router

function getMediaFilePath(userId, videoId, fileType) {
    return __dirname + '/../uploads/' + userId + '/' + videoId + '.' + fileType;
}

async function generateThumbnail(videoPath, thumbnailPath) {
  const folder =  path.dirname(thumbnailPath);
  const filename = path.basename(thumbnailPath);
  return ffmpeg(videoPath)
      .thumbnail({
          timestamps: ['50%'],
          folder,
          filename,
          size: '320x240',
      });
}


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
          // generate thumbnail
          const thumbPath = dirPath + '/' + newVideo._id + '.png';
          generateThumbnail(uploadPath, thumbPath)
          .then(() => console.log('Thumnail generated successfully'))
          .catch((err) => console.error(err));
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
        const {error, user} = await authCheck(req, false);
        if(error) return res.status(403).json(error);
        const video = await Videos.getVideoById(req.params.videoId)
        if(!video) return res.status(404).json("Video not found")
        if(video.visibility === 'private' && (!user || video.userId.toString() !== user._id.toString())) return res.status(403).json("You are not allowed to watch this video")
        await Users.watchVideo(video.userId, video._id, new Date())
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
              'Content-Type': `video/${video.fileType}`,
              'Content-Disposition' : `inline; filename="${video.title}.${video.fileType}"`
            };
        
            res.writeHead(206, head);
            file.pipe(res);
          } else {
            const head = {
              'Content-Length': fileSize,
              'Content-Disposition' : `inline; filename="${video.title}.${video.fileType}"`,
              'Content-Type' : `video/${video.fileType}`
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

router.get('/preview/:videoId', async (req, res) => {
    try
    {
      const video = await Videos.getVideoById(req.params.videoId)
      if(!video) return res.status(404).json("Video not found")
      const videoPath = __dirname + '/../uploads/' + video.userId + '/' + video._id + '.' + video.fileType; //adjust the path as needed
      console.log(videoPath);
      const stat = fs.statSync(videoPath)
      const fileSize = stat.size
      
      const start = 0;
      const end = 40000000;
      const file = fs.createReadStream(videoPath, { start, end });
  
      res.setHeader('Content-Type', 'video/mp4');
      res.setHeader('Content-Disposition', `inline; filename="${video.title}.${video.fileType}"`);
      // res.setHeader('Content-Range', `bytes ${start}-${end}/${fs.statSync(videoPath).size}`);
      // res.setHeader('Accept-Ranges', 'bytes');

      // Stream the partial content to the response
      file.pipe(res);
          
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
        if(video.userId.toString() !== userId.toString()) return res.status(403).json("You are not allowed to edit this video")
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
        video.channel = {}
        const channelPromise = Users.getUserById(video.userId).then((user) =>{
          video.channel.name = user.username;
        })
        const likesPromise = Reactions.getReactionCount(req.params.videoId, 'like').then((count) => {
          video.reactions.like = count;
        });
        const dislikesPromise = Reactions.getReactionCount(req.params.videoId, 'dislike').then((count) => {
          video.reactions.dislike = count;
        });
        // promise all
        await Promise.all([channelPromise, likesPromise, dislikesPromise])
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
    const { reaction } = value;
    const video = await Videos.getVideoById(req.params.videoId);
    if (reaction === 'like') Users.likeTags(userId, video.tags);
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

router.get('/postedBy/:userId', async (req, res) => {
    try
    {
        const videos = await Videos.getVideosBy(req.params.userId)
        res.status(200).json(videos)
    }
    catch (error){
        console.log(error)
        res.status(500).json()
    }
  });

router.get('/thumb/:videoId', async (req, res) => {
    try
    {
        console.log(req.params.videoId)
        const video = await Videos.getVideoById(req.params.videoId)
        if(!video) return res.status(404).json("Video not found")
        console.log(video)
        const thumbPath = getMediaFilePath(video.userId, video._id, 'png');
        console.log(thumbPath)
        // res.writeHead(200, head);
        fs.access(thumbPath, fs.constants.F_OK, (err) => {
          if (err) {
            res.status(404).send('File not found');
          } else {
            const stat = fs.statSync(thumbPath)
            const fileSize = stat.size
            res.setHeader('Content-Type', 'image/png');
            res.setHeader('Content-Disposition', `inline; filename="${video.title}.png"`);
            res.setHeader('Content-Length', fileSize);
            // res.sendFile(thumbPath);
            fs.createReadStream(thumbPath).pipe(res);
          }
        });
    }
    catch (error){
        console.log(error)
        res.status(500).json()
    }
});

router.get('/recommendations', async (req, res) => {
    try
    {
      const vidsAmount = 20;
      const {error, user} = await authCheck(req, false);
      console.log(user)
      if(error) return res.status(403).json(error);
      if(user){
        const videos = await Videos.getVideosForTags(user.likedTags, vidsAmount)
        if (videos.length < vidsAmount) {
          const moreVideos = await Videos.getMostViewed(vidsAmount - videos.length, onlyPublic=true)
          videos.push(...moreVideos)
        }
        console.log(videos)
        res.status(200).json(videos)
      }else{
        // get most viewed videos
        const videos = await Videos.getMostViewed(vidsAmount, onlyPublic=false)
        console.log(videos)
        res.status(200).json(videos)
      }
    }
    catch (error){
        console.log(error)
        res.status(500).json()
    }
});

// TODO: check file name doesnt contain forbidden characters (e.g. /, '..', etc.)