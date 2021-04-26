/* eslint-disable camelcase */
// require('dotenv/config')
const serverless = require('serverless-http')
const express = require('express')
const bodyParser = require('body-parser')
const WebSocket = require('ws')
const Item = require('./models/item.js')
let open = false
// Create websocket to receive new item postings from wf.m
const ws = new WebSocket('wss://warframe.market/socket')
ws.on('open', () => {
  // Send wf.m our request for socket data
  console.log('Opened connection to warframe websocket')
  open = true
  ws.send('{"type": "@WS/SUBSCRIBE/MOST_RECENT"}')
})

// Whenever we receive a new item posting, store it in our database
ws.on('message', async data => {
  const json = JSON.parse(data)
  console.log(json.type)
  const { payload } = json
  if (payload.order) {
    const { order } = payload
    const item_id = order.item.url_name
    try {
      // Check if item exists
      const item = await Item.findOne({ item_id: item_id })
      if (item) {
        // If the item exists already, update order history
        if (order.mod_rank && order.item.mod_max_rank) {
          if (order.mod_rank === order.mod_max_rank) {
            item.order_history.push(order.platinum)
            console.log('Updating an existing item')
            await item.save()
          } else {
            return { success: false }
          }
        } else {
          item.order_history.push(order.platinum)
          console.log('Updating an existing item')
          await item.save()
        }
      } else {
        console.error('API item does not exist!')
      }
    } catch (err) {
      console.error(err)
    }
  }
})

// Set db
require('./data/warframe-db')

// Configure app
const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

// All MiddleWare above this comment
const router = require('./routes/index.js')
app.use(router)

app.get('/', (req, res) => {
  console.log(open)
  const item = Item({
    item_id: 1,
    name: 'name',
    img_url: 'bruh',
    ducats: 0,
    trading_tax: 0,
    is_urgent: false,
    is_watched: false,
    needs_stats: false,
    items_in_set: [],
    relics: [],
    max_mod_rank: 0,
    avg_price: 0,
    min_price: 100000,
    max_price: -1,
    order_history: []
  })
  item.save().then(() => {
    res.send('Hello World')
  })
})

module.exports.handler = serverless(app)
