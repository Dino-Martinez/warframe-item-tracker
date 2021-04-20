require('dotenv/config')
const express = require('express')
const bodyParser = require("body-parser");


// Set db
require("./data/warframe-db");

// Configure app
const app = express()

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// All MiddleWare above this comment
const router = require("./routes/index.js");
app.use(router);

app.get('/', (req, res) => {
  res.send({"Hello": "World"})
})

app.listen(process.env.PORT, () => {
  console.log(`Listening on port ${process.env.PORT}!`)
})

module.exports = app
