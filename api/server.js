require("dotenv/config");
const express = require("express");
const bodyParser = require("body-parser");
const WebSocket = require("ws");
const Item = require("./models/item.js");
const fetch = require("node-fetch");

// Create websocket to receive new item postings from wf.m
const ws = new WebSocket("wss://warframe.market/socket");
ws.on("open", () => {
  // Send wf.m our request for socket data
  console.log("Opened connection to warframe websocket");
  ws.send('{"type": "@WS/SUBSCRIBE/MOST_RECENT"}');
});

// Whenever we receive a new item posting, store it in our database
ws.on("message", async data => {
  const json = JSON.parse(data);
  const { payload } = json;
  if (payload.order) {
    const { order } = payload;
    const item_id = order.item.url_name;
    try {
      // Check if item exists
      item = await Item.findOne({ item_id: item_id });
      if (!item) {
        // If no item with this id, then create a new item and add it
        const apiResponse = await fetch(
          `http://api.warframe.market/v1/items/${item_id}`
        );
        const apiJson = await apiResponse.json();
        const items = apiJson.payload.item.items_in_set;
        let item_ids = [];
        let ducats = 0;
        let trading_tax = 0;
        let relics = [];
        let mod_max_rank = 999999;
        let name = "";
        let thumbnail = "";
        let platinum = 0;
        items.forEach(item => {
          item_ids.push(item.url_name);
          if (item.en && item.url_name === item_id) {
            name = item.en.item_name;
            ducats = item.ducats || 0;
            trading_tax = item.trading_tax || 0;
            relics = item.en.drop || [];
            mod_max_rank = item.mod_max_rank || 999999;
            thumbnail = item.thumb || "";
          }
        });
        const db_item = new Item({
          item_id,
          name,
          img_url: `https://api.warframe.market/static/assets/${thumbnail}`,
          ducats: ducats,
          trading_tax: trading_tax,
          is_urgent: false,
          is_watched: false,
          needs_stats: false,
          items_in_set: item_ids,
          relics: relics,
          max_mod_rank: mod_max_rank,
          avg_price: 0,
          min_price: 100000,
          max_price: -1,
          order_history: []
        });

        await db_item.save();
      } else {
        // If the item exists already, update order history
        if (order.mod_rank && order.item.mod_max_rank) {
          if (order.mod_rank === order.mod_max_rank) {
            item.order_history.push(order.platinum);
            await item.save();
          } else {
            return { success: false };
          }
        } else {
          item.order_history.push(order.platinum);
          await item.save();
        }
      }
    } catch (err) {
      console.error(err);
    }
  }
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
