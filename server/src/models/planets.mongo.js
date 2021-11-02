const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const planetsSchema = new mongoose.Schema({
  keplerName: {
    type: String,
    required: true
  },
})

module.exports = mongoose.model(
  'Planets', // mongo will lowercase it and pluralize it
  planetsSchema
)
