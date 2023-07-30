require('dotenv').config();
const express = require('express');
const Users = require('../models/user')
const Joi = require('joi')
const router = express.Router()
const jwt = require('jsonwebtoken');
const jwtSecretKey = require('../config/jwtconfig').secretKey
const authCheck = require('../authCheck')
// const accessToken = req.headers.authorization; // Assuming the access token is included in the `Authorization` header

//   if (!accessToken) {
//     return res.status(401).json({ message: 'Access token not provided' });
//   }

//   try {
//     const decodedToken = jwt.verify(accessToken, 'your_secret_key');
//     const userId = decodedToken.id;


// const crypto = require('crypto');

// const jwtSecretKey = crypto.randomBytes(64).toString('hex');


router.post('/login', async (req, res) => {
    const bodySchema = Joi.object({
        password : Joi.string().required(),
        username : Joi.string().required()
    })
    const { error, value } = bodySchema.validate(req.body)
    if(error) return res.status(400).json(error.details[0].message)
    const { username, password } = value
    try{
        let user = await Users.getUser(username, password)
        if(!user) return res.status(404).json("User not found")
        signed_user = { id: user._id }; // This usually would be a user object
        const accessToken = jwt.sign(signed_user, jwtSecretKey, { expiresIn: '1h' }); // Create JWT token with user data and secret key
        res.cookie('access_token', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Set to true in production
            maxAge: 3600000, // 1 hour
          });
        // delete password from user object
        delete user.password
        res.status(200).json({ success: true, user, accessToken }); // Send the token to the client
    }
    catch(error){
        console.log(error)
        res.status(500).json()
    }
    
});

router.get('/user', async (req, res) => {
    try
    {
        const { error, user } = await authCheck(req)
        if(error) return res.status(401).json(error)
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
        const result = await Users.createUser(username, password,email, firstName, lastName, phone);
        console.log('new user', value)
        res.status(201).json(result)

    }catch{
        res.status(500)
    }
})

router.get('/reset-password', async (req, res) => {
    alert("reset password");

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