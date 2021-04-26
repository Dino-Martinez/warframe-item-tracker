const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
  res.send('Hello world')
})

router.get('/tristan', (req, res) => {
  res.send('Tristan')
})

module.exports = router
