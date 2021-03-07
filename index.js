const express = require('express')
const db = require('./config/db')
const userRouter = require('./routers/userRouter')
require('dotenv').config()

// start db
db.authenticate()
  .then((result) => {
    console.log('Connection established.')
  })
  .catch((error) => {
    console.log('Unable to connect to db: ', error)
  })

// start app
const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api/users', userRouter)

app.use((err, req, res, next) => {
  res.status(500).send({ message: err.message })
})

const port = process.env.PORT || 5000
app.listen(port, () => {
  console.log(`Serve at http://localhost:${port}`)
})
