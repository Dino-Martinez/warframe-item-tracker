const express = require("express")
const usersRoutes = require("./users.js")

const router = express.Router()

router.use("/users", usersRoutes)

module.exports = router
