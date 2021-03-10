const express = require('express')
const expressAsyncHandler = require('express-async-handler')
const bcrypt = require('bcryptjs')
const userUtils = require('../utils/userUtils')
const { createUser, getUser, getAllUsers, insertMany } = userUtils
const { generateToken, isAdmin, isAuth } = require('../utils/authUtils')
const data = require('../data')

const userRouter = express.Router()

userRouter.get(
  '/seed',
  expressAsyncHandler(async (req, res) => {
    // await User.remove({});
    const createdUsers = await insertMany(data.users)
    res.send({ createdUsers })
  })
)

userRouter.get(
  '/',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const users = await getAllUsers()
    res.send(users)
  })
)

userRouter.post(
  '/signin',
  expressAsyncHandler(async (req, res) => {
    const user = await getUser({
      username: req.body.username,
    })
    if (user) {
      if (bcrypt.compareSync(req.body.password, user.password)) {
        res.send({
          id: user.id,
          name: user.name,
          username: user.username,
          isAdmin: user.isAdmin,
          token: generateToken(user),
        })
        return
      }
    }
    res.status(401).send({ message: 'Invalid username or password' })
  })
)

userRouter.post(
  '/register',
  expressAsyncHandler(async (req, res) => {
    const userInfo = {
      name: req.body.name,
      username: req.body.username,
      password: bcrypt.hashSync(req.body.password, 8),
    }
    const user = await getUser({
      username: req.body.username,
    })
    if (user) {
      res.status(400).send({ message: 'Username is not available' })
      return
    }
    const newUser = await createUser(userInfo)
    res.send(newUser)
  })
)

module.exports = userRouter
