const express = require('express')

// create express server instance
const app = express()

const bodyParser = require('body-parser')
const httpLogger = require('./helpers/middleware')
const { handleError } = require('./helpers/error')
const routes = require('./Routes')

// use winston based logger to show info about the app
app.use(httpLogger)

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// add default headers to all requests
app.use((req, res, next) => {
  res.append('Access-Control-Allow-Origin', ['*'])
  res.append('Access-Control-Allow-Headers', 'Content-Type')
  next()
})

// add application routes
app.use('/api', routes)

// use custom error handler to create error objects
app.use((err, req, res, next) => {
  handleError(err, res)
})

module.exports = app
