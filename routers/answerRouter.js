const express = require('express')
const expressAsyncHandler = require('express-async-handler')
const answerUtils = require('../utils/answerUtils')
const { isAuth } = require('../utils/authUtils')
const {
  deleteAnswer,
  updateAnswer,
  createAnswer,
} = answerUtils

const answerRouter = express.Router()

// Tao answer moi
answerRouter.post(
  '/create',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const user = req.user
    const answerInfo = {
      answerText: req.body.answerText,
      userId: user.id,
      questionId: req.body.questionId,
    }
    const answer = await createAnswer(answerInfo)
    res.status(201).send(answer)
  })
)

// Xoa answer
answerRouter.delete(
  '/:id',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const user = req.user
    const answer = await Answer.findByPk(id)
    console.log(answer.userId === req.user.id)
    if (answer.userId === req.user.id || req.user.isAdmin) {
      await deleteAnswer()
      res.send({ message: 'Success' })
    } else {
      res.status(403).send({ message: "You can't delete this answer" })
    }
  })
)

// Chinh sua cau tra loi
answerRouter.patch(
  '/:id',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const user = req.user
    const { answerText } = req.body
    const answer = await Answer.findByPk(id)
    console.log(answer.userId === req.user.id)
    if (question.userId === req.user.id || req.user.isAdmin) {
      await updateAnswer({ id, answerText })
      res.send({ message: 'Success' })
    } else {
      res.status(403).send({ message: "You can't change this answer" })
    }
  })
)

module.exports = answerRouter