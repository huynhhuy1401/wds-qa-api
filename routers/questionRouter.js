const express = require('express')
const expressAsyncHandler = require('express-async-handler')
const questionUtils = require('../utils/questionUtils')
const {
  getQuestion,
  getAllQuestions,
  deleteQuestion,
  updateQuestion,
  createQuestion,
  getQuestionsByCategory,
} = questionUtils
const { isAuth } = require('../utils/authUtils')
const Question = require('../models/question')

const questionRouter = express.Router()

questionRouter.get(
  '/',
  expressAsyncHandler(async (req, res) => {
    const { category } = req.query
    if (category) {
      const questions = await getQuestionsByCategory(category)
      res.send(questions)
    } else {
      const questions = await getAllQuestions()
      res.send(questions)
    }
  })
)

questionRouter.get(
  '/:id',
  expressAsyncHandler(async (req, res) => {
    const { id } = req.params

    const question = await getQuestion(id)
    if (question) {
      res.send(question)
    } else {
      res.status(404).send({ message: 'Not found' })
    }
  })
)

questionRouter.post(
  '/create',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const questionInfo = {
      title: req.body.title,
      description: req.body.description,
      userId: req.user.id,
      categoryName: req.body.categoryName,
    }
    const question = await createQuestion(questionInfo)
    const resInfo = {
      ...question.dataValues,
      categoryName: req.body.categoryName
    }
    res.status(201).send(resInfo)
  })
)

questionRouter.delete(
  '/:id',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const { id } = req.params
    const question = await Question.findByPk(id)
    console.log(question.userId === req.user.id)
    if (question.userId === req.user.id || req.user.isAdmin) {
      await question.destroy()
      res.send({ message: 'Success' })
    } else {
      res.status(403).send({ message: "You can't delete this question" })
    }
  })
)

module.exports = questionRouter