const { MongoClient } = require('mongodb')


let dbConnection

module.exports = {
  connectToDb: (cb) => {
    MongoClient.connect('mongodb://localhost:27017/first_practice')
      .then((client) => {
        dbConnection = client.db()
        cb()
      })
      .catch(err => {
        console.log(err)
        cb(err)
      })
  },
  getDb: () => dbConnection

}
