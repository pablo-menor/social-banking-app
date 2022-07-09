const jwt = require('jsonwebtoken')

module.exports = function (req, res, next) {
  const auth = req.headers.authorization
  if (!auth) return res.status(401).send({ message: 'Access denied. No token provided.' })

  const token = auth.split(' ')[1]

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET)
    req.user = verified
    next()
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' })
  }
}
