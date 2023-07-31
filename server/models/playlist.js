const { ObjectId } = require('mongodb');
const { BSONError } = require('bson');
const { client, dbName } = require('../config/mongodbconfig')

const playlists = client.db(dbName).collection("playlists");

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
    const newPlaylist = { userId: new ObjectId(userId), name: playlistName, videos: [] }
    const result = await playlists.insertOne(newPlaylist);
    if (result.acknowledged) {
        newPlaylist._id = result.insertedId;
        return newPlaylist;
    } else {
        return false;
    }
}

module.exports.addToPlaylist = async (playlistId, newVids) => {
    const playlist = await module.exports.getPlaylist(new ObjectId(playlistId))
    console.log(playlist)
    const thevideos = playlist.videos
    thevideos.push(...newVids)
    const result = await playlists.updateOne({ _id: new ObjectId(playlistId) }, { $set: { videos: thevideos } })
    console.log(result)
    return result.modifiedCount > 0;
}

module.exports.removeFromPlaylist = async (playlistId, vidsToRemove) => {
    const playlist = await module.exports.getPlaylist(new ObjectId(playlistId))
    const thevideos = playlist.videos
    const newVideos = thevideos.filter(vid => !(vidsToRemove.includes(vid)))
    const result = await playlists.updateOne({ _id: new ObjectId(playlistId) }, { $set: { videos: newVideos } })
    return result.modifiedCount > 0;
}

module.exports.clearPlaylist = async (playlistId) => {
    return await playlists.updateOne({ _id: new ObjectId(playlistId) }, { $set: { videos: [] } })
}

module.exports.deletePlaylist = async (playlistId) => {
    return await playlists.deleteOne({ _id: new ObjectId(playlistId) });
}
