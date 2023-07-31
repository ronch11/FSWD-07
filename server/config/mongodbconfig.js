const { MongoClient, ServerApiVersion } = require('mongodb');

const uri = process.env.MONGO_DB_CONNECTION_STRING
module.exports.uri = uri

module.exports.client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
});

module.exports.dbName = 'youbube'