const { ObjectId } = require('mongodb');
const { BSONError } = require('bson');
const { client } = require('../config/mongodbconfig')

const defaultVideoDetails = {
    title : "video title",
    description : "video description",
    tags : [],
    fileName : "video",
    fileType : "mp4",
    views : 0,
    visibility : "private",
}

const videos = client.db("youbube").collection("videos");

module.exports.createVideo = async (userId, fileType, fileName) => {
    const video = {userId : userId, ...defaultVideoDetails, fileType : fileType, fileName : fileName}
    const status = await videos.insertOne(video)
    if (status.acknowledged){
        return video
    }else{
        return null
    }
}

module.exports.getVideoById = async (videoId) => {
    try{
        let video = await videos.findOne({_id : new ObjectId(videoId)})
        if (!video) return null
        return video
    }
    catch(err){
        if (err instanceof BSONError){
            return null
        }
        throw err;
    }
    
}

module.exports.updateVideo = async (videoId, changes) => {
    return await videos.updateOne({_id : new ObjectId(videoId)}, {$set : changes})
}

module.exports.deleteVideo = async (videoId) => {
    return (await videos.deleteOne({_id : new ObjectId(videoId)})).deletedCount
}

module.exports.addView = async (videoId) => {
    return await videos.updateOne({_id : new ObjectId(videoId)}, {$inc : {views : 1}})
}

module.exports.getVideos = async (userId) => {
    console.log(userId)
    try{
        return await videos.find({userId : new ObjectId(userId)}).toArray()

    }catch(err){
        if (err instanceof BSONError){
            return [];
        }
        throw err;

    }
}

