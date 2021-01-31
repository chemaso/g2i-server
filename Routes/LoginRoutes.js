const express = require('express')

const loginRouter = express.Router({ mergeParams: true })

// loginController is the container of the login related operations
const loginController = require('../Controllers/LoginController')

// mocked login method to generate a jwt valid token
loginRouter.post('/login', loginController.postAuthToken)

module.exports = loginRouter
