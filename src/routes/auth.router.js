const express = require('express')
const router = express.Router()
// const verifyToken = require('./verifyToken')
const UserService = require('../service/user.service')
const userService = new UserService()

router.post('/signup', async (req, res) => {
  if (await userService.signup(req.body)) {
    res.json({ message: 'Signup successful' })
  } else {
    res.json({ message: 'Signup failed' })
  }
})

router.post('/login', async (req, res) => {
  const { name, password } = req.body
  const token = await userService.login({ name, password })
  if (token) {
    res.json({ name, token })
  } else {
    res.status(401).json({ message: 'Bad credentials' })
  }
})

module.exports = router
