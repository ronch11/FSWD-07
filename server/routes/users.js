require('dotenv').config();
const express = require('express');
const Users = require('../models/user')
const Joi = require('joi')
const router = express.Router()


router.get('/:userId', async (req, res) => {
    try
    {
        const user = await Users.getUserById(req.params.userId)
        if(!user) return res.status(404).json("User not found")
        res.status(200).json(user)
    }
    catch{
        res.status(500).json()
    }
})

router.post('/CreateUser', async (req, res) => {
    const bodySchema = Joi.object({
        username : Joi.string().required(),
        firstName : Joi.string().required(),
        lastName : Joi.string().required(),
        password : Joi.string().required(),
        email : Joi.string().required(),
        phone : Joi.string().required()
    })
    const {error, value} = bodySchema.validate(req.body)
    if(error) return res.status(400).json(error.details[0].message)
    const { username, password, firstName, lastName, email, phone } = value
    try{
        if (await Users.getUser(username, password)) return res.status(409).json("User already exists");
        const result = await Users.createUser(username, password, firstName, lastName, email, phone);
        res.status(201).json(result)
    }catch{
        res.status(500)
    }
})

router.delete('/:userId', async (req, res) => {
    const userId = req.params.userId;
    console.log(userId);
    const success = await Users.deleteUser(req.params.userId);
    if (success){
        res.status(200).json({userId})
    }else{
        res.status(404).json()
    }
    
})

module.exports = router