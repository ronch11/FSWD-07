const { ObjectId } = require('mongodb');
const { client } = require('../config/mongodbconfig')

const playlists = client.db("youbube").collection("playlists");

// playlist will contain: playlist id, playlist's owner, playlist name, videos id list

module.exports.historyPlaylistName = 'History';

module.exports.getPlaylist = async (playlistId) => {
    return await playlists.findOne({ _id: ObjectId(playlistId) });
}

module.exports.getPlaylistByIdAndName = async (userId, playlistName) => {
    return await playlists.findOne({ userId: ObjectId(playlistId), name: playlistName });
}

module.exports.getPlaylists = async (userId) => {
    return await playlists.find({ owner: userId }).toArray();
}

module.exports.createPlaylist = async (userId, playlistName) => {
    // make sure owner doesnt have a playlist with the same name
    const playlist = module.exports.getPlaylist(userId, playlistName);
    //TODO: take care of case playlist exists
    if(playlist) return null;
    return await playlists.insertOne({
        owner: ObjectId(userId),
        name: playlistName,
        videos: []
    });
}

module.exports.addToPlaylist = async (playlistId, newVids) => {
    const playlist = module.exports.getPlaylist(ObjectId(playlistId))
    const videos = playlist.videos
    videos.push(...newVids)
    return await playlists.updateOne({ _id: ObjectId(playlistId) }, { $set: { videos: videos } })
}

module.exports.removeFromPlaylist = async (playlistId, vidsToRemove) => {
    const playlist = module.exports.getPlaylist(ObjectId(playlistId))
    const videos = playlist.videos
    const newVideos = videos.filter(vid => !vidsToRemove.includes(vid))
    return await playlists.updateOne({ _id: ObjectId(playlistId) }, { $set: { videos: newVideos } })
}

module.exports.clearPlaylist = async (playlistId) => {
    return await playlists.updateOne({ _id: ObjectId(playlistId) }, { $set: { videos: [] } })
}

module.exports.deletePlaylist = async (playlistId) => {
    return await playlists.deleteOne({ _id: ObjectId(playlistId) });
}
