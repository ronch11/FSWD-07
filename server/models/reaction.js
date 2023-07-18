// for like/dislike

const { ObjectId } = require('mongodb');
const { client } = require('../config/mongodbconfig')

const reactions = client.db("youbube").collection("reactions");

module.exports.react = async (videoId, userId, reaction) => {
    const existReaction = await reactions.findOne({ videoId : new ObjectId(videoId), userId : userId })
    if (existReaction){
        await reactions.updateOne({ videoId : new ObjectId(videoId), userId : userId }, { $set : { reaction : reaction }})
        return { videoId : new ObjectId(videoId), userId : userId, reaction : reaction }
    }
    else{
        const newReaction = { videoId : new ObjectId(videoId), userId : userId, reaction : reaction }
        const res = await reactions.insertOne(newReaction);
        return newReaction
    }
}

module.exports.getReaction = async (videoId, userId) => {
    return await reactions.findOne({ videoId : new ObjectId(videoId), userId : userId })
}

module.exports.getReactionCount = async (videoId, reaction) => {
    return await reactions.countDocuments({ videoId : new ObjectId(videoId), reaction })
}


module.exports.getReactions = async (videoId) => {
    return await reactions.find({ videoId : new ObjectId(videoId) }).toArray();
}

module.exports.deleteReaction = async (videoId, userId) => {
    const results = await reactions.deleteOne({ videoId : new ObjectId(videoId), userId : userId });
    return results.deletedCount;
}

module.exports.deleteReactions = async (videoId) => {
    const results = await reactions.deleteMany({ videoId : new ObjectId(videoId) });
    return results.deletedCount;
}
