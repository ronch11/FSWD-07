const { ObjectId } = require('mongodb');
const { client } = require('../config/mongodbconfig')

const comments = client.db("youbube").collection("comments");

module.exports.getComments = async (videoId) => {
    // get last 50 comments, sorted by date
    return await comments.find({ videoId : new ObjectId(videoId) }).sort({ date : -1 }).limit(50).toArray();
}

module.exports.getComment = async (videoId, commentId) => {
    return await comments.findOne({ videoId, _id : new ObjectId(commentId) });
}

module.exports.createComment = async (videoId, userId, author, date, body) => {
    comment = { videoId : new ObjectId(videoId), userId : new ObjectId(userId), author, body, date }
    const res = await comments.insertOne(comment);
    return comment
}

module.exports.updateComment = async (postId, commentId, name, body) => {
    comment = { postId : postId, name, body, _id : new ObjectId(commentId) }
    const res = await comments.updateOne({_id : new ObjectId(commentId)}, { $set : comment});
    console.log(res)
    return comment
}

module.exports.deleteComment = async (commentId) => {
    const results = await comments.deleteOne({_id: new ObjectId(commentId)});
    return results.deletedCount;
}
    