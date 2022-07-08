const express = require('express')
const app = express()
const dotenv = require('dotenv')

dotenv.config()
const PORT = process.env.PORT || 4000

// Mongo connection
const mongoose = require('mongoose')
mongoose.connect(`mongodb+srv://${process.env.USER}:${process.env.MONGO_PASSWORD}@cluster0.zw28c.mongodb.net/?retryWrites=true&w=majority`)
  .then(db => console.log('Connected to MongoDB'))
  .catch(err => console.log(err))

app.get('/', (req, res) => {
  res.send('All endpoints need /api prefix')
})

// Middlewares
const cors = require('cors')
app.use(cors({ origin: '*' }))
app.use(express.json())

// Routes
const routerApi = require('./routes/index')
routerApi(app)

app.listen(PORT, () => console.log(`Server ready on port:  ${PORT}`))
