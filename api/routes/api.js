const express = require("express")
const router = express.Router()
const Item = require("../models/item")


router.post("/items/track/:item_id", (req, res) => {
  /** Route to start tracking an item for updates */
  Item.findById(req.params.id).exec(function (err, item) {
    item.needs_stats = true
    item.save()

    res.status(200)
  })
})

router.post("/items/untrack/:item_id", (req, res) => {
  /** Route to stop tracking an item for updates */
  Item.findById(req.params.id).exec(function (err, item) {
    item.needs_stats = false
    item.save()

    res.status(200)
  })
})

router.get("/items/test", (req, res) => {
  /**test route for adding an item*/
  const item = new Item()
  item.item_id = "test_id"
  item.name = "test_name"
  item.needs_stats =

  item
    .save()
    .then((item) => {
      res.send({"status": 200})
    })
})

module.exports = router;
