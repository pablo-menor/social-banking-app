const AccountService = require('./account.service')
const accountService = new AccountService()
const UserService = require('./user.service')
const userService = new UserService()
const Transaction = require('../model/transaction.model')

class TransactionService {
  async doTransaction (senderId, receiverId, amount) {
    try {
      const sender = await userService.findById(senderId)
      const receiver = await userService.findById(receiverId)

      if (await accountService.getBalance(sender.account.number) < amount) {
        console.log('fdfd')
        return false
      }
      const isMoneySent = await accountService.sendMoney(
        sender.account.number,
        receiver.account.number,
        amount)

      if (isMoneySent) {
        // Save transaction
        const transaction = {
          sender: {
            id: sender.id,
            account: sender.account.number
          },
          receiver: {
            id: receiver.id,
            account: receiver.account.id
          },
          amount
        }

        const newTransaction = new Transaction(transaction)
        const savedTransaction = await newTransaction.save()

        // Add transaction to each user
        sender.transactions.push(savedTransaction.id)
        receiver.transactions.push(savedTransaction.id)

        await userService.updateUser(sender)
        await userService.updateUser(receiver)
        return true
      }
    } catch (error) {
      return false
    }
  }
}

module.exports = TransactionService
