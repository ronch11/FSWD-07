require('dotenv').config();
const express = require('express');
const Joi = require('joi')
const router = express.Router()
const Comments = require('../models/comment')
const Videos = require('../models/video')
const authCheck = require('../authCheck')

module.exports = router

router.get('/:videoId', async (req, res) => {
    try{
        const { error, user } = await authCheck(req, false)
        const video = await Videos.getVideo(req.params.videoId);
        if(!video) return res.status(404).json("Video not found")
        if(video.visibility == 'private' && (!user || user._id.toString() !== video.userId.toString())) return res.status(401).json("Not authorized")
        const comments = await Comments.getComments(req.params.videoId)
        res.status(200).json(comments)
    }
    catch(error){
        console.log(error)
        res.status(500).json()
    }
});

router.post('/:videoId', async (req, res) => {
    try{
        const { error, user } = await authCheck(req)
        if(error) return res.status(401).json(error)
        const video = await Videos.getVideo(req.params.videoId);
        if(!video) return res.status(404).json("Video not found")
        if(video.visibility == 'private' && (!user || user._id.toString() !== video.userId.toString())) return res.status(401).json("Not authorized")
        const bodySchema = Joi.object({
            body : Joi.string().required()
        })
        const { error: bodyError, value } = bodySchema.validate(req.body)
        if(bodyError) return res.status(403).json(bodyError.details[0].message)
        const { body } = value
        const comment = await Comments.createComment(req.params.videoId, user._id, new Date(), body)
        res.status(200).json(comment)
    }
    catch(error){
        console.log(error)
        res.status(500).json()
    }
});