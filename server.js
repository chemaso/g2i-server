const mongoose = require('mongoose')
const logger = require('./helpers/logger')
require('dotenv').config({ path: '.env' })

// Options added to enhace compatibility with fuzzy search library
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
}

// Connect Database
mongoose.connect(process.env.DATABASE, options)

// if mongoose connection fails it will generate a log
mongoose.connection.on('error', (err) => {
  logger.error(`error connecting database ${err.message}`)
})

// add Models to app
require('./Models/Acronym')

const app = require('./app')

const server = app.listen(8001, () => {
  logger.info(`app listening on ${server.address().port}`)
})
