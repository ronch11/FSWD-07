const { ObjectId } = require('mongodb');
const { BSONError } = require('bson');
const { client } = require('../config/mongodbconfig')

const users = client.db("youbube").collection("users");




module.exports.getUser = async (username, password) => {
    // return await getCollection(async (users) => {
        let user = await users.findOne({username : username, password : password})
        if (!user) return null
        delete user.password
        return user
    // })
}

module.exports.getUserById = async (userId) => {
    try{
        let user = await users.findOne({_id : new ObjectId(userId)})
        if (!user) return null
        delete user.password
        return user
    }
    catch(err){
        if (err instanceof BSONError){
            return null
        }
        throw err;
    }
}

module.exports.createUser = async (username, password, firstName, lastName, email, phone, isAdmin=false) => {
    const user = {username, firstName, lastName, password, email, phone, isAdmin}
    const status = await users.insertOne(user)
    if (status.acknowledged){
        delete user.password
        return user
    }else{
        return null;
    }
}

module.exports.deleteUser = async (userId) => {
    try{
        return (await users.deleteOne({_id : new ObjectId(userId)})).deletedCount
    }
    catch(err){
        if (err instanceof BSONError){
            return 0;
        }
        throw err;
    }
}


