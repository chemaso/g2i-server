const jwt = require('jsonwebtoken')
const { ErrorHandler } = require('../helpers/error')
const logger = require('../helpers/logger')
const { UNAUTHORIZED } = require('../helpers/constants')
const { mockUser, jwtsecret } = require('../helpers/authentication')

exports.postAuthToken = async (req, res, next) => {
  try {
    // read username and password from request body
    const { username, password } = req.body

    // filter user from the users array by username and password
    const user = mockUser.username === username && mockUser.password === password
    // return error message if user is incorrect
    if (!user) {
      logger.error(`postAuthToken error: ${UNAUTHORIZED}`)
      throw new ErrorHandler(403, UNAUTHORIZED)
    }
    // generate an access token
    const accessToken = jwt.sign({ username: user.username, role: user.role }, jwtsecret)
    res.json({
      accessToken
    })
  } catch (e) {
    next(e)
  }
}
