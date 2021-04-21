require("dotenv/config");
const express = require("express");
const bodyParser = require("body-parser");
const WebSocket = require("ws");

// Create websocket to receive new item postings from wf.m
const ws = new WebSocket("wss://warframe.market/socket");
ws.on("open", () => {
  // Send wf.m our request for socket data
  console.log("Opened connection");
  ws.send('{"type": "@WS/SUBSCRIBE/MOST_RECENT"}');
});

// Whenever we receive a new item posting, store it in our database
ws.on("message", data => {
  console.log(data);
});

// Set db
require("./data/warframe-db");

// Configure app
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// All MiddleWare above this comment
const router = require("./routes/index.js");
app.use(router);

app.get("/", (req, res) => {
  res.send({ Hello: "World" });
});

app.listen(process.env.PORT, () => {
  console.log(`Listening on port ${process.env.PORT}!`);
});

module.exports = app;
