const jwt = require('jsonwebtoken')
const { UNAUTHORIZED } = require('./constants')
const { ErrorHandler } = require('./error')
const logger = require('./logger')

// the only user available, so, use it to generate auth token
const mockUser = { username: 'test', password: 'test-password' }

// secret token is saved on env vars
const jwtsecret = process.env.JWT_SECRET

// authenticateJWT is a method to validate user information
const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization

  if (authHeader) {
    const token = authHeader.split(' ')[1]

    // verifies if the user token is valid
    jwt.verify(token, jwtsecret, (err, user) => {
      if (err) {
        logger.error(`authenticateJWT error: ${UNAUTHORIZED}`)
        throw new ErrorHandler(401, UNAUTHORIZED)
      }

      req.user = user
      next()
    })
  } else {
    logger.error(`authenticateJWT error: ${UNAUTHORIZED}`)
    throw new ErrorHandler(403, UNAUTHORIZED)
  }
}

module.exports = {
  mockUser,
  jwtsecret,
  authenticateJWT
}
