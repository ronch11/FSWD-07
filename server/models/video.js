const { ObjectId } = require('mongodb');
const { BSONError } = require('bson');
const { client, dbName } = require('../config/mongodbconfig')

const defaultVideoDetails = {
    title : "video title",
    description : "video description",
    tags : [],
    fileName : "video",
    fileType : "mp4",
    views : 0,
    visibility : "public",
}
 //TODO: change to privatecd

const videos = client.db(dbName).collection("videos");

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

module.exports.getVideosByIds = async (videoIds) => {
    try{
        const objVideoIds = videoIds.map(id => new ObjectId(id))
        let videos = await videos.find({_id : {$in : objVideoIds}}).toArray()
        if (!videos) return null
        return videos
    }
    catch(err){
        if (err instanceof BSONError){
            return null
        }
        throw err;
    }
};

module.exports.updateVideo = async (videoId, changes) => {
    return await videos.updateOne({_id : new ObjectId(videoId)}, {$set : changes})
}

module.exports.deleteVideo = async (videoId) => {
    return (await videos.deleteOne({_id : new ObjectId(videoId)})).deletedCount
}

module.exports.addView = async (videoId) => {
    return await videos.updateOne({_id : new ObjectId(videoId)}, {$inc : {views : 1}})
}

module.exports.getVideosBy = async (userId) => {
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

module.exports.getMostViewed = async (amount=10, onlyPublic=true) => {
    if (onlyPublic){
        return await videos.find({visibility : "public"}).sort({views : -1}).limit(amount).toArray()
    }else{
        return await videos.find().sort({views : -1}).limit(amount).toArray()
    }
}

module.exports.getVideosForTags = async (tags, amount=10, onlyPublic=true) => {
    if(!tags) return []
    const searchTags = Object.keys(tags);
    const findParams = {
        tags: { $in: searchTags }
    };

    if (onlyPublic) {
        findParams.visibility = 'public';
    }
    
    // Query the videos collection
    let videos = await videos.find(findParams).toArray();

    // Sort by user likes
    videos.sort((a, b) => {
        let aScore = a.tags.reduce((total, tag) => { return total + (tags[tag] || 0) }, 0);
        let bScore = b.tags.reduce((total, tag) => { return total + (tags[tag] || 0) }, 0);
        return bScore - aScore;
    });

    return videos.slice(0, amount);
}

