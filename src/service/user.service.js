
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../model/user.model')
const AccountService = require('./account.service')
const accountService = new AccountService()

class UserService {
  async signup (user) {
    try {
      // Create new account
      const { _id, number } = await accountService.createAccount(user.balance)

      user.password = await bcrypt.hash(user.password, 6)
      user = {
        name: user.name,
        lastName: user.lastName,
        age: user.age,
        password: user.password,
        account: {
          number,
          id: _id
        }
      }
      const newUser = new User(user)
      await newUser.save()

      return _id
    } catch (err) {
      console.log('Error when saving user')
      console.log(err)
      return null
    }
  }

  async login ({ name, password }) {
    try {
      const user = await User.findOne({ name })
      if (user && await bcrypt.compare(password, user.password)) {
        return jwt.sign({
          name,
          id: user.id
        }, process.env.JWT_SECRET)
      } else {
        return null
      }
    } catch (error) {
      console.log(error)
      return null
    }
  }
}

module.exports = UserService
