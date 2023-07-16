const { ObjectId } = require('mongodb');
const { uri, client } = require('../config/mongodbconfig')

const defaultVideoDetails = {
    title : "video title",
    description : "video description",
    tags : [],
    fileName : "video",
    fileType : "mp4",
    views : 0,
    likes : 0,
    dislikes : 0,
    state : "private",
}

const videos = client.db("youbube").collection("videos");

module.exports.createVideo = async (userId, fileType, originalName) => {
    const video = {userId : userId, ...defaultVideoDetails, fileType : fileType, originalName : originalName}
    const status = await videos.insertOne(video)
    if (status.acknowledged){
        return video
    }else{
        return null
    }
}