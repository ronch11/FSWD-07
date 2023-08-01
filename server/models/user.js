const { ObjectId } = require('mongodb');
const { BSONError } = require('bson');
const { client, dbName } = require('../config/mongodbconfig')

const users = client.db(dbName).collection("users");
const history = client.db(dbName).collection("history");


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

module.exports.getUsersByIds = async (userIds) => {
    try{
        const newIds = userIds.map(id => new ObjectId(id))
        return await users.find({_id : {$in : newIds}}).toArray()
    }
    catch(err){
        if (err instanceof BSONError){
            return []
        }
        throw err;
    }
}

module.exports.createUser = async (username, password, firstName, lastName, email, phone, isAdmin=false) => {
    const user = {username, firstName, lastName, password, email, phone, isAdmin, likeTags : {}}
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

module.exports.watchVideo = async (userId, videoId, date) => {
    const status = await history.insertOne({userId : new ObjectId(userId), videoId : new ObjectId(videoId), date : date})
    if (status.acknowledged){
        return true
    }else{
        return false
    }
}

module.exports.getHistory = async (userId, amount) => {
    try{
        return await history.find({userId : new ObjectId(userId)}).sort({date : -1}).limit(amount).toArray()
    }catch(err){
        if (err instanceof BSONError){
            return [];
        }
        throw err;
    }
}

module.exports.clearHistory = async (userId) => {
    try{
        return (await history.deleteMany({userId : new ObjectId(userId)})).deletedCount
    }catch(err){
        if (err instanceof BSONError){
            return 0;
        }
        throw err;
    }
}

module.exports.likeTags = async (userId, tags) => {
    // increment tags in user
    let user = await users.findOne({_id : new ObjectId(userId)})
    console.log(user)
    if (!user) return false
    if(user.likeTags === undefined) user.likeTags = {}
    console.log(tags)
    for (let tag of tags){
        if (user.likeTags[tag]){
            user.likeTags[tag]++
        }else{
            user.likeTags[tag] = 1
        }
    }
    console.log(user.likeTags)
    const status = await users.updateOne({_id : new ObjectId(userId)}, {$set : {likeTags : user.likeTags}})
    if (!status.acknowledged) return false
    return true
}
