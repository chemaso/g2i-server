const mongoose = require('mongoose')

// import fuzzy search engine library
const mongoose_fuzzy_searching = require('mongoose-fuzzy-searching')

// AcronymSchema is the document structure
const AcronymSchema = new mongoose.Schema({
  name: {
    type: String
  },
  value: {
    type: String
  }
})

// plug fuzzy search engine to schema
AcronymSchema.plugin(mongoose_fuzzy_searching, { fields: ['name'] })

module.exports = mongoose.model('Acronym', AcronymSchema, 'acronym')
