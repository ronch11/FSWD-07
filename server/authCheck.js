const jwt = require('jsonwebtoken');
const jwtSecretKey = require('./config/jwtconfig').secretKey
const Users = require('./models/user')
module.exports = async (req, alertMissing=true) => {
    let error = null;
    let user = null;
    const accessToken = req.headers.authorization.split(' ').pop(); // Assuming the access token is included in the `Authorization` header
    if (!accessToken) {
        if (alertMissing) return { error : { message: 'Access token not provided' }, user };
        return { error, user };
    }
    try{
        const decodedToken = jwt.verify(accessToken, jwtSecretKey);
        const userId = decodedToken.id;
        user = await Users.getUserById(userId)
        return { error, user };
    }
    catch(err){
        return { error : { message: 'Invalid token' }, user };
    }
    
}