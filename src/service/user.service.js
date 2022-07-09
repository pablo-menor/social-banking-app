
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../model/user.model')
const AccountService = require('./account.service')
const accountService = new AccountService()

class UserService {
  async signup(user) {
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

  async login({ name, password }) {
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

  async findByAccount(accountNumber) {
    try {
      const user = await User.findOne({ 'account.number': accountNumber })
      return user
    } catch (error) {
      return null
    }
  }

  async requestConnection(userRequesting, userRequested) {
    const { account } = await User.findById({ _id: userRequesting.id })
    const requestedUser = await User.findById({ _id: userRequested.id })
    requestedUser.requests.push({
      senderId: userRequesting.id,
      name: userRequesting.name,
      account
    })
    try {
      return await User.updateOne({ _id: userRequested.id }, requestedUser)
    } catch (error) {
      return null
    }
  }

  async acceptConnection (userRequestingId, userRequestedId) {
    try {
      const userRequesting = await User.findById({ _id: userRequestingId }) // User 1
      const userRequested = await User.findById({ _id: userRequestedId }) // User 2

      // Update user 1
      userRequesting.contacts.push({
        name: userRequested.name,
        account: userRequested.account.number,
        age: userRequested.age
      })
      await User.updateOne({ _id: userRequesting.id }, userRequesting)

      // Update user 2
      userRequested.contacts.push({
        name: userRequesting.name,
        account: userRequesting.account.number,
        age: userRequesting.age
      })

      userRequested.requests = userRequested.requests.filter(user => {
        console.log(user.senderId)
        console.log(userRequesting.id)
        return user.senderId !== userRequesting.id
      })
      await User.updateOne({ _id: userRequested.id }, userRequested)
      return true
    } catch (error) {
      return false
    }
  }
}

module.exports = UserService
