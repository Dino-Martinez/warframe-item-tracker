const express = require('express')
const usersRoutes = require('./users.js')
const apiRoutes = require('./api.js')

const router = express.Router()

router.use('/users', usersRoutes)
router.use('/api', apiRoutes)

module.exports = router
