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

/**
 * @openapi
 * components:
 *   schemas:
 *     Question:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: The question ID.
 *           example: 1
 *         title:
 *           type: string
 *           description: Question title.
 *           example: string
 *         description:
 *           type: string
 *           description: Question description.
 *           example: string
 *         userId:
 *           type: integer
 *           description: User Id.
 *           example: 1
 *         categoryId:
 *           type: integer
 *           description: Category Id.
 *           example: 1
 */

/**
 * @openapi
 * tags:
 *  name: Questions
 *  description: API to manage questions.
 */

/**
 * @openapi
 * /questions:
 *   get:
 *     summary: Get all questions
 *     tags: [Questions]
 *     parameters:
 *       - in: query
 *         name: categoryName
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of questions.
 *         content:
 *           application/json:
 *            schema:
 *              $ref: '#/components/schemas/Question'
 */
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

/**
 * @openapi
 * /questions/{id}:
 *   get:
 *     summary: Get question with id
 *     tags: [Questions]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: A list of questions.
 *         content:
 *           application/json:
 *            schema:
 *             type: object
 *             properties:
 *               question:
 *                 $ref: '#/components/schemas/Question'
 *               answers:
 *                 type: array
 *                 items: 
 *                   $ref: '#/components/schemas/Answer'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
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

/**
 * @openapi
 * /questions/create:
 *   post:
 *     summary: Create new question
 *     tags: [Questions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *              type: object
 *              properties:
 *                title:
 *                  type: string
 *                  description: Question title.
 *                  example: string
 *                description:
 *                  type: string
 *                  description: Question description.
 *                  example: string
 *                categoryName:
 *                  type: string
 *                  description: Category Name.
 *                  example: string
 *     responses:
 *       201:
 *         description: New user with category name.
 *         content:
 *           application/json:
 *            schema:
 *              type: object
 *              properties:
 *                id:
 *                  type: integer
 *                  description: The question ID.
 *                  example: 1
 *                title:
 *                  type: string
 *                  description: Question title.
 *                  example: string
 *                description:
 *                  type: string
 *                  description: Question description.
 *                  example: string
 *                userId:
 *                  type: integer
 *                  description: User Id.
 *                  example: 1
 *                categoryId:
 *                  type: integer
 *                  description: Category Id.
 *                  example: 1
 *                categoryName:
 *                   type: string
 *                   description: Category Name.
 *                   example: string
 */
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

/**
 * @openapi
 * /questions/{id}:
 *   delete:
 *     summary: Delete question with id
 *     tags: [Questions]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *            schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 example: Success
 *       403:
 *         $ref: '#/components/responses/Forbiden'
 */
questionRouter.delete(
  '/:id',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const { id } = req.params
    const question = await Question.findByPk(id)
    if (question.userId === req.user.id || req.user.isAdmin) {
      await question.destroy()
      res.send({ message: 'Success' })
    } else {
      res.status(403).send({ message: "You can't delete this question" })
    }
  })
)

/**
 * @openapi
 * /questions/{id}:
 *   patch:
 *     summary: Update question
 *     tags: [Questions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *              type: object
 *              properties:
 *                title:
 *                  type: string
 *                  description: Question title.
 *                  example: string
 *                description:
 *                  type: string
 *                  description: Question description.
 *                  example: string
 *                categoryName:
 *                  type: string
 *                  description: Category Name.
 *                  example: string
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *            schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 example: Success
 *       403:
 *         $ref: '#/components/responses/Forbiden'
 */
questionRouter.patch(
  '/:id',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const { id } = req.params
    const { title, description, categoryName } = req.body
    const question = await Question.findByPk(id)
    if (question.userId === req.user.id || req.user.isAdmin) {
      await updateQuestion({ id, title, description, categoryName })
      res.send({ message: 'Success' })
    } else {
      res.status(403).send({ message: "You can't change this question" })
    }
  })
)

module.exports = questionRouter
