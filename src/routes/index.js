const authRouter = require('./auth.router')
const userRouter = require('./user.router')

function routerApi (app) {
  app.use('/api/auth', authRouter)
  app.use('/api/user', userRouter)
}

module.exports = routerApi
