const mongoose = require('mongoose')

const transactionSchema = mongoose.Schema({
  sender: {
    id: String,
    account: String
  },
  receiver: {
    id: String,
    account: String
  },
  amount: Number
})

module.exports = mongoose.model('Transaction', transactionSchema)
