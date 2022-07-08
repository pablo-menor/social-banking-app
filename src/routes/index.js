const authRouter = require('./auth.router')

function routerApi (app) {
  app.use('/api/auth', authRouter)
  // app.use('/api/companies', companyRouter)
  // app.use('/api/auth', authRouter)
  // app.use('/api/offers', offerRouter)
  // app.use('/api/challenges', challengeRouter)
}

module.exports = routerApi
