const Account = require('../model/account.model')

class AccountService {
  async createAccount (balance) {
    try {
      const number = this.generateAccount() // Generates a ramdom 10 digit account
      const newAccount = new Account({ number, balance })
      return await newAccount.save()
    } catch (err) {
      console.log('Error when creating account')
    }
  }

  generateAccount () {
    let randomAccount = ''
    for (let i = 0; i < 10; i++) {
      randomAccount += Math.floor(Math.random() * 10)
    }
    return randomAccount
  }
}

module.exports = AccountService
