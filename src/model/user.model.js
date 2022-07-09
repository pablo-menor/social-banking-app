const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
  name: {
    required: true,
    type: String
  },
  lastName: {
    required: true,
    type: String
  },
  password: {
    required: true,
    type: String
  },
  age: {
    required: true,
    type: Number
  },
  account: {
    number: {
      required: true,
      type: String
    },
    id: {
      required: true,
      type: String
    }
  },
  contacts: [
    {
      name: String,
      account: String,
      age: Number
    }
  ],
  requests: [
    {
      senderId: String,
      name: String,
      account: String
    }
  ],
  transactions: [String]

})

module.exports = mongoose.model('User', userSchema)
