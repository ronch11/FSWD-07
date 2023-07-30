const express = require('express');
const router = express.Router()
const authCheck = require('../authCheck')
const Users = require('../models/user')

module.exports = router

router.get('/', async (req, res) => {
    const { err, user } = await authCheck(req);
    if(err) return res.status(401).json(err)
    if(!user) return res.status(404).json("User not found")
    const history = await Users.getHistory(user._id, 50);
    //TODO: decide whether to return only names and ids, without all videos in all playlist
    return res.status(200).json(history);
});

router.delete('/', async (req, res) => {
    const { err, user } = await authCheck(req);
    if(err) return res.status(401).json(err);
    if(!user) return res.status(404).json("User not found");

    await Users.clearHistory(user._id);
    return res.status(200);
    //TODO: add other cases
    return res.status(500);
});