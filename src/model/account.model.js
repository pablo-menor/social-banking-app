const mongoose = require('mongoose')

const accountSchema = mongoose.Schema({
  number: {
    required: true,
    type: String
  },
  balance: {
    required: true,
    type: Number
  }
})

module.exports = mongoose.model('Account', accountSchema)
