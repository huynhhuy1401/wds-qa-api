const express = require('express')
const expressAsyncHandler = require('express-async-handler')
const questionUtils = require('../utils/questionUtils')
const answerUtils = require('../utils/answerUtils')
const {
  getQuestion,
  getAllQuestions,
  deleteQuestion,
  updateQuestion,
  createQuestion,
  getQuestionsByCategory,
} = questionUtils
const { getAllAnswersOfQuestion } = answerUtils
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
    const answers = await getAllAnswersOfQuestion(id)
    const data = {
      ...question.dataValues,
      answers: answers
    }
    if (question) {
      res.send(data)
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
      categoryName: req.body.categoryName,
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

questionRouter.patch(
  '/id',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const { id } = req.params
    const { title, description, categoryName } = req.body
    const question = await Question.findByPk(id)
    console.log(question.userId === req.user.id)
    if (question.userId === req.user.id || req.user.isAdmin) {
      await updateQuestion({ id, title, description, categoryName })
      res.send({ message: 'Success' })
    } else {
      res.status(403).send({ message: "You can't change this question" })
    }
  })
)

module.exports = questionRouter
