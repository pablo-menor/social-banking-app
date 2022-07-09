const authRouter = require('./auth.router')
const userRouter = require('./user.router')
const transactionRouter = require('./transaction.router')

function routerApi (app) {
  app.use('/api/auth', authRouter)
  app.use('/api/user', userRouter)
  app.use('/api/transactions', transactionRouter)
}

module.exports = routerApi
