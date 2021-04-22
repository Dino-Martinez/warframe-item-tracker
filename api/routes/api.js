const express = require('express')
const router = express.Router()
const Item = require('../models/item')

router.get('/items/track/:item_id', (req, res) => {
  /** Route to start tracking an item for updates */
  Item.findOne({ item_id: req.params.item_id }).exec(function (err, item) {
    item.needs_stats = true
    item.save()

    res.status(200)
  })
})

router.get('/items/untrack/:item_id', (req, res) => {
  /** Route to stop tracking an item for updates */
  Item.findOne({ item_id: req.params.item_id }).exec(function (err, item) {
    item.needs_stats = false
    item.save()

    res.status(200)
  })
})

router.get('/items/:item_id', (req, res) => {
  /** Route to provide information on a single item */

  Item.findOne({ item_id: req.params.item_id }).exec(function (err, item) {
    res.json(item)
  })
})

router.get('/watchlist/add/:item_id', (req, res) => {
  /** Route to add an item to our watchlist */

  Item.findOneAndUpdate(
    { item_id: req.params.item_id },
    { is_watched: true }
  ).exec(function (err, item) {
    if (item) res.json({ status: 200 })
  })
})

router.get('/watchlist/remove/:item_id', (req, res) => {
  /** Route to add an item to our watchlist */

  Item.findOneAndUpdate(
    { item_id: req.params.item_id },
    { is_watched: false }
  ).exec(function (err, item) {
    if (item) res.json({ status: 200 })
  })
})

router.get('/watchlist/list', (req, res) => {
  /** Route to deliver all watched items */

  Item.find({ is_watched: true })
    .lean()
    .then(items => {
      res.json(items)
    })
    .catch(err => {
      console.log(err.message)
    })
})

router.get('/items', (req, res) => {
  /** Route to deliver all items */

  Item.find()
    .lean()
    .then(items => {
      res.json(items)
    })
    .catch(err => {
      console.log(err.message)
    })
})

router.get('/items_tests', (req, res) => {
  /** test route for adding an item */
  const item = new Item()
  item.item_id = 'test_id'
  item.name = 'test_name'
  item.needs_stats = false

  item.save().then(item => {
    res.send({ status: 200 })
  })
})

module.exports = router
