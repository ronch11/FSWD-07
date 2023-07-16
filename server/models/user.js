const { ObjectId } = require('mongodb');
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
    // return await getCollection(async (users) => {
        let user = await users.findOne({_id : new ObjectId(userId)})
        if (!user) return null
        delete user.password
        return user
    // })
}

module.exports.createUser = async (username, password, firstName, lastName, email, phone) => {
    const user = {username : username, firstName : firstName, lastName : lastName, password : password, email : email, phone : phone}
    const status = await users.insertOne(user)
    if (status.acknowledged){
        delete user.password
        return user
    }else{
        return null
    }
}

module.exports.deleteUser = async (userId) => {
    return (await users.deleteOne({_id : new ObjectId(userId)})).deletedCount
}


