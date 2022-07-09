const express = require('express')
const router = express.Router()
const verifyToken = require('./verifyToken')
const UserService = require('../service/user.service')

const userService = new UserService()

router.post('/add/:accountNumber', verifyToken, async (req, res) => {
  const userInvited = await userService.findByAccount(req.params.accountNumber)

  if (userInvited && userService.requestConnection(req.user, userInvited)) {
    res.json({ message: 'Invitation sent.' })
  } else {
    res.status(400).json({ message: 'Something went wrong.' })
  }
})

router.post('/accept/:userId', verifyToken, async (req, res) => {
  if (await userService.acceptConnection(req.params.userId, req.user.id)) {
    res.json({ message: 'Connection added.' })
  } else {
    res.status(400).json({ message: 'Could not add connection.' })
  }
})

module.exports = router
