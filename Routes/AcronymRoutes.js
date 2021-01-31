const express = require('express')

// authenticateJWT is an jwt method to verify user information
const { authenticateJWT } = require('../helpers/authentication')

const acronymRouter = express.Router({ mergeParams: true })

// acronymContoller is the container of the acronym related operations
const acronymContoller = require('../Controllers/AcronymController')

// getAllAcronyms route to bring all results and search by multiple params
acronymRouter.get('/acronyms', acronymContoller.getAllAcronyms)

// getAcronymByName route to bring a acronym by name
acronymRouter.get('/acronym/:acronym?', acronymContoller.getAcronymByName)

// getRandomAcronyms route to bring random acronyms
acronymRouter.get('/random/:count?', acronymContoller.getRandomAcronyms)

// createAcronym route to create new acronym
acronymRouter.post('/acronym', acronymContoller.createAcronym)

// Add authenticateJWT middleware to validate auth token in put acronym by name method
acronymRouter.put('/acronym/:acronym', authenticateJWT, acronymContoller.putAcronymByName)

// Add authenticateJWT middleware to validate auth token in delete acronym by name method
acronymRouter.delete('/acronym/:acronym', authenticateJWT, acronymContoller.deleteAcronymByName)

module.exports = acronymRouter
