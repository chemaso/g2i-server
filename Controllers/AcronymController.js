const mongoose = require('mongoose')
const { isEmpty, get } = require('lodash')
const { ErrorHandler } = require('../helpers/error')
const logger = require('../helpers/logger')
const { NOT_FOUND, BAD_REQUEST } = require('../helpers/constants')

const Acronym = mongoose.model('Acronym')

// getAllAcronyms can return all acronyms and filter by received params
exports.getAllAcronyms = async (req, res, next) => {
  try {
    // query params
    let from = get(req, 'query.from', '')
    let limit = get(req, 'query.limit', '')
    // the search value to fuzzy search
    const search = get(req, 'query.search', '')

    if (!isEmpty(limit)) {
      limit = parseInt(limit, 10)
    }
    if (!isEmpty(from)) {
      from = parseInt(from, 10)
    }

    // fuzzySearch trigger the search in acronym document with available params
    const acronym = await Acronym.fuzzySearch(search).skip(from).limit(limit)

    // trigger error message is acronym is not available
    if (!acronym || isEmpty(acronym)) {
      logger.error(`getAllAcronyms error: ${NOT_FOUND}`)
      throw new ErrorHandler(404, NOT_FOUND)
    }

    // count the total documents that partially match the search value
    const count = await Acronym.fuzzySearch(search).countDocuments()

    // assign a propper format to results
    const data = acronym.map((item) => ({
      // eslint-disable-next-line no-underscore-dangle
      id: item._id,
      name: item.name,
      value: item.value
    }))

    // standard result message
    const message = {
      status: req.responseStatus || 200,
      success: true,
      data: {
        count: acronym.length,
        total: count,
        results: data
      }
    }

    logger.info('getAllAcronyms response created successfully')
    res.append('Access-Control-Allow-Methods', 'GET')
    res.json(message)
  } catch (e) {
    // move to error handler
    next(e)
  }
}

// getAcronymByName returns the acronym that match the param passed
exports.getAcronymByName = async (req, res, next) => {
  try {
    // acronym name
    let q = get(req, 'params.acronym', '')
    if (isEmpty(q)) {
      q = get(req, 'url', '')
      if (isEmpty(q)) {
        logger.error(`getAcronymByName error: ${BAD_REQUEST}`)
        throw new ErrorHandler(400, BAD_REQUEST)
      } else {
        // to search also special characters
        q = q.replace('/acronym/', '')
      }
    }

    // trigger the specified acronym search
    const acronym = await Acronym.find({ name: q })

    if (!acronym || isEmpty(acronym)) {
      logger.error(`getAllAcronyms error: ${NOT_FOUND}`)
      throw new ErrorHandler(404, NOT_FOUND)
    }
    const message = {
      status: req.responseStatus || 200,
      success: true,
      results: acronym
    }
    logger.info('getAllAcronyms response created successfully')
    res.append('Access-Control-Allow-Methods', 'GET')
    res.json(message)
  } catch (e) {
    next(e)
  }
}

// getRandomAcronyms returns a random list of acronyms with a count param
exports.getRandomAcronyms = async (req, res, next) => {
  try {
    // total of random acronyms to filter
    const q = get(req, 'params.count', '')
    if (isEmpty(q)) {
      logger.error(`getAcronymByName error: ${BAD_REQUEST}`)
      throw new ErrorHandler(400, BAD_REQUEST)
    }
    // convert q to number value
    const count = parseInt(q, 10)
    // trigger acronyms search
    const acronym = await Acronym.aggregate([{ $sample: { size: count } }])
    if (!acronym || isEmpty(acronym)) {
      logger.error(`getRandomAcronyms error: ${NOT_FOUND}`)
      throw new ErrorHandler(404, NOT_FOUND)
    }
    // standard response message
    const message = {
      status: req.responseStatus || 200,
      success: true,
      data: {
        count: acronym.length,
        // eslint-disable-next-line no-underscore-dangle
        results: acronym.map((item) => ({ id: item._id, name: item.name, value: item.value }))
      }
    }
    logger.info('getRandomAcronyms response created successfully')
    res.append('Access-Control-Allow-Methods', 'GET')
    res.json(message)
  } catch (e) {
    next(e)
  }
}

// createAcronym create and save a new acronym in document
exports.createAcronym = async (req, res, next) => {
  try {
    // use Schema to generate new value
    const newAcronym = new Acronym(req.body)
    if (!newAcronym) {
      logger.error('createAcronym error: error creating new acronym')
      throw new ErrorHandler(400, BAD_REQUEST)
    }
    // save new data in document
    const data = await newAcronym.save()
    if (!data) {
      logger.error('createAcronym error: error saving new acronym')
      throw new ErrorHandler(400, BAD_REQUEST)
    }
    // send a success message in response
    const response = {
      message: 'Acronym created successfully',
      data
    }
    res.append('Access-Control-Allow-Methods', 'POST')
    res.json(response)
  } catch (e) {
    next(e)
  }
}

// putAcronymByName updates the selected acronym by name param - uses auth method to check if user have access
exports.putAcronymByName = async (req, res, next) => {
  try {
    // body and query params
    const selected = get(req, 'params.acronym', '')
    const updates = get(req, 'body', {})

    // validate params conditions
    if (!selected) {
      logger.error('putAcronymByName error: missing acronym name')
      throw new ErrorHandler(400, BAD_REQUEST)
    }
    if (!updates) {
      logger.error('putAcronymByName error: missing data in payload')
      throw new ErrorHandler(400, BAD_REQUEST)
    }

    // find the selected acronym then update it
    const data = await Acronym.findOneAndUpdate({ name: selected }, updates)
    if (!data) {
      logger.error('putAcronymByName error: error saving changes on acronym')
      throw new ErrorHandler(400, BAD_REQUEST)
    }

    // standard success message response
    const response = {
      message: 'Acronym updated successfully',
      data
    }
    res.append('Access-Control-Allow-Methods', 'PUT')
    res.json(response)
  } catch (e) {
    next(e)
  }
}

// deleteAcronymByName remove the selected acronym from document - uses auth method to check if user have access
exports.deleteAcronymByName = async (req, res, next) => {
  try {
    // query params
    const selected = get(req, 'params.acronym', '')
    if (!selected) {
      logger.error('putAcronymByName error: missing acronym name')
      throw new ErrorHandler(400, BAD_REQUEST)
    }

    // delete the acronym by name
    const data = await Acronym.deleteOne({ name: selected })
    if (!data) {
      logger.error('putAcronymByName error: error saving changes on acronym')
      throw new ErrorHandler(400, BAD_REQUEST)
    }
    const response = {
      message: 'Acronym deleted successfully',
      data
    }
    res.append('Access-Control-Allow-Methods', 'DELETE')
    res.json(response)
  } catch (e) {
    next(e)
  }
}
