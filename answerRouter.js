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
      userId: req.user.Id,
      questionId: req.body.questionId,
    }
    const answer = await createAnswer(answerInfo)
    res.status(201).send()
    // Lay data tu req.body
    // Tao answer moi
    // Gui ve thong tin cua answer vua tao res.status(201).send(...)
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
      await answer.deleteAnswer()
      res.send({ message: 'Success' })
    } else {
      res.status(403).send({ message: "You can't delete this answer" })
    }
    // Kiem tra user co phai la nguoi tao ra answer hoac admin hay ko (thong tin co trong user)
    // Neu dung thi cho xoa deleteAnswer(...)
    // Neu khong thi res.status(403).send({ message: "You can't delete this question" })
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
      await answer.updateAnswer({ id, answerText })
      res.send({ message: 'Success' })
    } else {
      res.status(403).send({ message: "You can't change this answer" })
    }
    // Kiem tra user co phai la nguoi tao ra answer hoac admin hay ko (thong tin co trong user)
    // Neu dung thi lay thong tin tu req.body cho sua updateAnswer(...)
    // Neu khong thi res.status(403).send({ message: "You can't change this question" })
  })
)
