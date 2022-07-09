const express = require('express')
const router = express.Router()
const verifyToken = require('./verifyToken')
const TransactionService = require('../service/transaction.service')
const transactionService = new TransactionService()

router.post('/', verifyToken, async (req, res) => {
  const { receiverId, amount } = req.body
  if (await transactionService.doTransaction(req.user.id, receiverId, amount)) {
    res.json({ message: 'Money sent.' })
  } else {
    res.json({ message: 'Error when sending money.' })
  }
})

module.exports = router
