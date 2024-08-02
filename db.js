const { MongoClient } = require("mongodb");

let dbConnection;
let uri = 'get-actual-mongo-uri'

module.exports = {
  connectToDb: (cb) => {
    // MongoClient.connect(uri) // if using Mongo Atlas
    MongoClient.connect("mongodb://localhost:27017/bookstore") // Connect to bookstore db
      .then((client) => {
        dbConnection = client.db(); // Store db in dbConnection
        return cb()
      })
      .catch((err) => {
        console.log(err);
        return cb(err)
      });
  },
  getDb: () => dbConnection,
};
