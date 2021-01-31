const express = require('express')

// import acronym endpoints router
const acronymRouter = require('./AcronymRoutes')

// import login endpoints router
const loginRouter = require('./LoginRoutes')

const router = express.Router({ mergeParams: true })

router.use('/', acronymRouter)
router.use('/', loginRouter)

module.exports = router
