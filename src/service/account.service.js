const Account = require('../model/account.model')

class AccountService {
  async createAccount (balance) {
    try {
      const number = this.generateAccount() // Generates a random 10 digit account
      const newAccount = new Account({ number, balance })
      return await newAccount.save()
    } catch (err) {
      console.log('Error when creating account')
    }
  }

  async getBalance (accountNumber) {
    try {
      const { balance } = await Account.findOne({ number: accountNumber })
      return balance
    } catch (error) {
      return null
    }
  }

  async sendMoney (accountOriginN, accountDestinationN, amount) {
    try {
      const accountOrigin = await Account.findOne({ number: accountOriginN })
      const accountDestination = await Account.findOne({ number: accountDestinationN })

      accountOrigin.balance = accountOrigin.balance - amount
      accountDestination.balance = accountDestination.balance + amount

      // Update accounts
      await Account.updateOne({ number: accountOriginN }, accountOrigin)
      await Account.updateOne({ number: accountDestinationN }, accountDestination)
      return true
    } catch (error) {
      return false
    }
  }

  // Returns a random 10 digit account
  generateAccount () {
    let randomAccount = ''
    for (let i = 0; i < 10; i++) {
      randomAccount += Math.floor(Math.random() * 10)
    }
    return randomAccount
  }
}

module.exports = AccountService
