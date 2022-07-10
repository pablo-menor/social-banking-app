const express = require('express')
const router = express.Router()
const verifyToken = require('./verifyToken')
const UserService = require('../service/user.service')

const userService = new UserService()

router.post('/add/:accountNumber', verifyToken, async (req, res) => {
  const userInvited = await userService.findByAccount(req.params.accountNumber)
  if (userInvited && await userService.requestConnection(req.user, userInvited)) {
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

router.post('/remove/:userId', verifyToken, async (req, res) => {
  if (await userService.removeConnection(req.params.userId, req.user.id)) {
    res.json({ message: 'Connection removed.' })
  } else {
    res.status(400).json({ message: 'Could not removed connection.' })
  }
})
router.get('/contacts', verifyToken, async (req, res) => {
  const contactList = await userService.getContactList(req.user.id)
  if (contactList) {
    res.json(contactList)
  } else {
    res.status(400).json({ message: 'Something went wrong.' })
  }
})

router.get('/:userId', verifyToken, async (req, res) => {
  const user = await userService.findById(req.params.userId)
  if (user) {
    delete user.password
    res.json(user)
  } else {
    res.status(400).json({ message: 'Something went wrong.' })
  }
})
module.exports = router
