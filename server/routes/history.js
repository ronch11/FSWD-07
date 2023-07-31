const express = require('express');
const router = express.Router()
const authCheck = require('../authCheck')
const Users = require('../models/user')
const Videos = require('../models/video')
module.exports = router

router.get('/', async (req, res) => {
    const { err, user } = await authCheck(req);
    if(err) return res.status(401).json(err)
    if(!user) return res.status(404).json("User not found")
    const history = await Users.getHistory(user._id, 30);
    const videos = history.map((video) => { return { _id : video.videoId, date : video.date } });
    // const videos = await Promise.all(history.map(async (video) => { 
    //     const videoDetails = await Videos.getVideoById(video.videoId);
    //     return { ...videoDetails, date : video.date }
    // }));
    //TODO: decide whether to return only names and ids, without all videos in all playlist
    return res.status(200).json(videos);
});

router.delete('/', async (req, res) => {
    const { err, user } = await authCheck(req);
    if(err) return res.status(401).json(err);
    if(!user) return res.status(404).json("User not found");

    await Users.clearHistory(user._id);
    return res.status(200).json("History cleared");
    
    //TODO: add other cases
    return res.status(500);
});