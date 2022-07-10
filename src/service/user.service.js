
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

  async updateUser (user) {
    return await User.updateOne({ _id: user.id }, user)
  }

  async findByAccount (accountNumber) {
    try {
      const user = await User.findOne({ 'account.number': accountNumber })
      return user
    } catch (error) {
      return null
    }
  }

  async findById (userId) {
    try {
      const user = await User.findOne({ _id: userId })
      return user
    } catch (error) {
      return null
    }
  }

  /**
   *
   * @param {string} userRequesting
   * @param {string} userRequested
   * @returns {User}
   */
  async requestConnection (userRequesting, userRequested) {
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

  /**
   *
   * @param {string} userRequestingId
   * @param {string} userRequestedId
   * @returns
   */
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

  async removeConnection (id1, id2) {
    try {
      const user1 = await User.findById({ _id: id1 })
      const user2 = await User.findById({ _id: id2 })

      user1.contacts = user1.contacts.filter(contact => contact.account !== user2.account.number)
      user2.contacts = user2.contacts.filter(contact => contact.account !== user1.account.number)

      await User.updateOne({ _id: user1.id }, user1)
      await User.updateOne({ _id: user2.id }, user2)

      return true
    } catch (error) {
      return false
    }
  }

  // Checks if both users have each other as a connection
  async checkConnection (user1Id, user2Id) {
    const user1 = await User.findById({ _id: user1Id })
    const user2 = await User.findById({ _id: user2Id })
    let isAConnection1 = false
    let isAConnection2 = false
    user1.contacts.forEach(contact => {
      if (contact.account === user2.account.number) {
        isAConnection1 = true
      }
    })

    user2.contacts.forEach(contact => {
      if (contact.account === user1.account.number) {
        isAConnection2 = true
      }
    })

    if (isAConnection1 && isAConnection2) {
      return true
    }

    return false
  }

  async getContactList (userId) {
    try {
      const user = await User.findOne({ _id: userId })
      return user.contacts
    } catch (error) {
      return null
    }
  }
}

module.exports = UserService
