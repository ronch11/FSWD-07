const { ObjectId } = require('mongodb');
const { BSONError } = require('bson');
const { client } = require('../config/mongodbconfig')

const playlists = client.db("youbube").collection("playlists");

// playlist will contain: playlist id, playlist's owner, playlist name, videos id list

module.exports.getPlaylist = async (playlistId) => {
    try{
        return await playlists.findOne({ _id: new ObjectId(playlistId) });
    }
    catch(err){
        if (err instanceof BSONError){
            return null
        }
        throw err;
    }
}

module.exports.getPlaylistByIdAndName = async (userId, playlistName) => {
    return await playlists.findOne({ userId: new ObjectId(userId), name: playlistName });
}

module.exports.getPlaylists = async (userId) => {
    return await playlists.find({ userId: userId }).toArray();
}

module.exports.createPlaylist = async (userId, playlistName) => {
    // make sure owner doesnt have a playlist with the same name
    const playlist = await module.exports.getPlaylistByIdAndName(userId, playlistName);
    //TODO: take care of case playlist exists
    if(playlist) return null;
    const result = await playlists.insertOne({
        userId: new ObjectId(userId),
        name: playlistName,
        videos: []
    });
    if (result.acknowledged) {
        playlist._id = result.insertedId;
        return playlist;
    } else {
        return false;
    }
}

module.exports.addToPlaylist = async (playlistId, newVids) => {
    const playlist = module.exports.getPlaylist(new ObjectId(playlistId))
    const videos = playlist.videos
    videos.push(...newVids)
    return await playlists.updateOne({ _id: new ObjectId(playlistId) }, { $set: { videos: videos } })
}

module.exports.removeFromPlaylist = async (playlistId, vidsToRemove) => {
    const playlist = module.exports.getPlaylist(new ObjectId(playlistId))
    const videos = playlist.videos
    const newVideos = videos.filter(vid => !vidsToRemove.includes(vid))
    return await playlists.updateOne({ _id: new ObjectId(playlistId) }, { $set: { videos: newVideos } })
}

module.exports.clearPlaylist = async (playlistId) => {
    return await playlists.updateOne({ _id: new ObjectId(playlistId) }, { $set: { videos: [] } })
}

module.exports.deletePlaylist = async (playlistId) => {
    return await playlists.deleteOne({ _id: new ObjectId(playlistId) });
}
