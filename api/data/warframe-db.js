/* Mongoose Connection */
const mongoose = require('mongoose')
const assert = require('assert')

const url = 'mongodb://localhost/warframe-db'

mongoose.Promise = global.Promise
mongoose.connect(
  url,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
  },
  function (err, db) {
    assert.equal(null, err)
    console.log('Connected successfully to database')

    // db.close(); turn on for testing
  }
)
mongoose.connection.on(
  'error',
  console.error.bind(console, 'MongoDB connection Error:')
)
mongoose.set('debug', false)

module.exports = mongoose.connection
