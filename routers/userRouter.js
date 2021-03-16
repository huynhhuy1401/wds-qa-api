const express = require('express')
const expressAsyncHandler = require('express-async-handler')
const bcrypt = require('bcryptjs')
const userUtils = require('../utils/userUtils')
const { createUser, getUser, getAllUsers, insertMany } = userUtils
const { generateToken, isAdmin, isAuth } = require('../utils/authUtils')
const data = require('../data')

const userRouter = express.Router()

/**
 * @openapi
 * components:
 *   responses:
 *     NotFound:
 *       description: The specified resource was not found
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Error'
 *     Unauthorized:
 *       description: Unauthorized
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Error'
 *     BadRequest:
 *       description: BadRequest
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Error'
 */

/**
 * @openapi
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: The user ID.
 *           example: 0
 *         name:
 *           type: string
 *           description: The user's name.
 *           example: Leanne Graham
 *         username:
 *           type: string
 *           description: The user's username.
 *           example: username
 *         password:
 *           type: string
 *           description: The user's password.
 *           example: password
 *         isAdmin:
 *           type: boolean
 *           description: User is admin.
 *           example: false
 */

/**
 * @openapi
 * components:
 *   schemas:
 *     UserWithToken:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: The user ID.
 *           example: 0
 *         name:
 *           type: string
 *           description: The user's name.
 *           example: Leanne Graham
 *         username:
 *           type: string
 *           description: The user's username.
 *           example: username
 *         isAdmin:
 *           type: boolean
 *           description: User is admin.
 *           example: false
 *         token:
 *           type: string
 *           description: The user's token.
 *           example: string
 */

/**
 * @openapi
 * tags:
 *  name: Users
 *  description: API to manage your users.
 */

/**
 * @openapi
 * /users/seed:
 *   get:
 *     summary: Seeding users to database
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: A list of users.
 *         content:
 *           application/json:
 *            schema:
 *              type: array
 *              items:
 *                 $ref: '#/components/schemas/User'
 */
userRouter.get(
  '/seed',
  expressAsyncHandler(async (req, res) => {
    // await User.remove({});
    const createdUsers = await insertMany(data.users)
    res.send({ createdUsers })
  })
)

/**
 * @openapi
 * /users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: A list of users.
 *         content:
 *           application/json:
 *            schema:
 *              type: array
 *              items:
 *                 $ref: '#/components/schemas/User'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 * 
 *                
 */
userRouter.get(
  '/',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const users = await getAllUsers()
    res.send(users)
  })
)

/**
 * @openapi
 * /users/signin:
 *   post:
 *     summary: Sign in
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *              type: object
 *              properties:
 *                username:
 *                  type: string
 *                  example: username
 *                password:
 *                  type: string
 *                  example: password
 *     responses:
 *       200:
 *         description: New user with token.
 *         content:
 *           application/json:
 *            schema:
 *                 $ref: '#/components/schemas/UserWithToken'
 *       401:
 *         $ref: '#/components/responses/Unauthorized' 
 */
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

/**
 * @openapi
 * /users/register:
 *   post:
 *     summary: Register
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *              type: object
 *              properties:
 *                name:
 *                  type: string
 *                  example: name
 *                username:
 *                  type: string
 *                  example: username
 *                password:
 *                  type: string
 *                  example: password
 *     responses:
 *       200:
 *         description: New user with token.
 *         content:
 *           application/json:
 *            schema:
 *                 $ref: '#/components/schemas/UserWithToken'
 *       400:
 *          $ref: '#/components/responses/BadRequest' 
 */
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
    res.send({
      id: newUser.id,
      name: newUser.name,
      username: newUser.username,
      isAdmin: newUser.isAdmin,
      token: generateToken(newUser),
    })
    return
  })
)

module.exports = userRouter
