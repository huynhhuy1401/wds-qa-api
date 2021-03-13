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
    // Kiem tra user co phai la nguoi tao ra answer hoac admin hay ko (thong tin co trong user)
    // Neu dung thi lay thong tin tu req.body cho sua updateAnswer(...)
    // Neu khong thi res.status(403).send({ message: "You can't change this question" })
  })
)
