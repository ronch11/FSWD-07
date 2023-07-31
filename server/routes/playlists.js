const express = require('express');
const router = express.Router()
const authCheck = require('../authCheck')
const Users = require('../models/user');
const Videos = require('../models/video');
const Playlists = require('../models/playlist');
const Joi = require('joi');
module.exports = router

router.get('/', async (req, res) => {
    const { err, user } = await authCheck(req);
    if(err) return res.status(401).json(err)
    if(!user) return res.status(404).json("User not found")
    const playlists = (await Playlists.getPlaylists(user._id)).map((playlist) => { return { _id : playlist._id, name : playlist.name, thumbVid : playlist.videos[0] } });
    return res.status(200).json(playlists);
});

router.get('/light/:playlistId', async (req, res) => {
    const { err, user } = await authCheck(req);
    if(err) return res.status(401).json(err)
    if(!user) return res.status(404).json("User not found")
    const playlist = await Playlists.getPlaylist(req.params.playlistId);
    if(!playlist) return res.status(404).json("Playlist not found");
    if(!playlist.userId.equals(user._id)) return res.status(403).json("Forbidden");
    return res.status(200).json(playlist);
});

router.get('/full/:playlistId', async (req, res) => {
    const { err, user } = await authCheck(req);
    if(err) return res.status(401).json(err)
    if(!user) return res.status(404).json("User not found")
    const playlist = await Playlists.getPlaylist(req.params.playlistId);
    if(!playlist) return res.status(404).json("Playlist not found");
    if(!playlist.userId.equals(user._id)) return res.status(403).json("Forbidden");
    const videos = await Promise.all(playlist.videos.map(async (video) => {
        const videoDetails = await Videos.getVideoById(video);
        return videoDetails;
    }));
    return res.status(200).json(videos);
});

router.post('/', async (req, res) => {
    const { err, user } = await authCheck(req);
    if(err) return res.status(401).json(err);
    if(!user) return res.status(404).json("User not found");
    const bodySchema = Joi.object({
        name : Joi.string().max(25).required(),
    });
    const { error, value } = bodySchema.validate(req.body);
    if(error) return res.status(400).json(error.details[0].message);
    const { name } = value;
    const result = await Playlists.createPlaylist(user._id, name);
    console.log('new playlist', result);
    if(result === null) return res.status(409).json("Playlist already exists");
    if(!result) return res.status(500).json("Failed to create playlist");
    return res.status(201).json(result);
});

router.post('/add/:playlistId', async (req, res) => {
    const { err, user } = await authCheck(req);
    if(err) return res.status(401).json(err);
    if(!user) return res.status(404).json("User not found");

    const bodySchema = Joi.object({
        videos : Joi.array().items(Joi.string().required()).required()
    });
    
    const { error, value } = bodySchema.validate(req.body);
    if(error) return res.status(400).json(error.details[0].message);
    const { videos } = value;
    const playlist = await Playlists.getPlaylist(req.params.playlistId);
    if(!playlist) return res.status(404).json("Playlist not found");
    if(!playlist.userId.equals(user._id)) return res.status(403).json("Forbidden");
    const fullVideos = await Videos.getVideosByIds(videos);
    fullVideos.forEach((video) => {
        if(video.visibility === 'private' && !video.userId.equals(user._id)) return res.status(403).json("Forbidden");
    });
    const result = await Playlists.addToPlaylist(req.params.playlistId, videos);
    if(!result) return res.status(500).json("Failed to add videos to playlist");
    return res.status(200).json(result);
});

router.delete('/remove/:playlistId/:videoId', async (req, res) => {
    const videoId = req.params.videoId;
    const playlistId = req.params.playlistId;

    const { err, user } = await authCheck(req);
    if(err) return res.status(401).json(err);
    if(!user) return res.status(404).json("User not found");
    const playlist = await Playlists.getPlaylist(playlistId);
    if(!playlist) return res.status(404).json("Playlist not found");
    if(!playlist.userId.equals(user._id)) return res.status(403).json("Forbidden");
    const result = await Playlists.removeFromPlaylist(playlistId, [videoId]);
    if(!result) return res.status(500).json("Failed to remove video from playlist");
    return res.status(200).json(result);
});