const express = require('express')
const expressAsyncHandler = require('express-async-handler')
const Answer = require('../models/answer')
const answerUtils = require('../utils/answerUtils')
const { isAuth } = require('../utils/authUtils')
const {
  deleteAnswer,
  updateAnswer,
  createAnswer,
} = answerUtils

const answerRouter = express.Router()

/**
 * @openapi
 * tags:
 *  name: Answers
 *  description: API to manage answers.
 */

/**
 * @openapi
 * components:
 *   schemas:
 *     Answer:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: The answer ID.
 *           example: 1
 *         answerText:
 *           type: string
 *           description: Answer text.
 *           example: string
 *         userId:
 *           type: integer
 *           description: User Id.
 *           example: 1
 *         questionId:
 *           type: integer
 *           description: Question Id.
 *           example: 1
 */

/**
 * @openapi
 * components:
 *   schemas:
 *     AnswerWithUser:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: The answer ID.
 *           example: 1
 *         answerText:
 *           type: string
 *           description: Answer text.
 *           example: string
 *         userId:
 *           type: integer
 *           description: User Id.
 *           example: 1
 *         questionId:
 *           type: integer
 *           description: Question Id.
 *           example: 1
 *         user:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *               example: string
 *             username:
 *               type: string
 *               example: string
 */

// Tao answer moi
/**
 * @openapi
 * /answers/create:
 *   post:
 *     summary: Create new answer for question with questionId
 *     tags: [Answers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *              type: object
 *              properties:
 *                answerText:
 *                  type: string
 *                  description: Question title.
 *                  example: string
 *                questionId:
 *                  type: integer
 *                  description: Question id 
 *                  example: 1
 *     responses:
 *       201:
 *         description: New answer for question.
 *         content:
 *           application/json:
 *            schema:
 *              $ref: '#/components/schemas/Answer' 
 *                
 */
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
/**
 * @openapi
 * /answers/{id}:
 *   delete:
 *     summary: Delete answer with id
 *     tags: [Answers]
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
answerRouter.delete(
  '/:id',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const user = req.user
    const { id } = req.params
    const answer = await Answer.findByPk(id)
    if (answer.userId === req.user.id || req.user.isAdmin) {
      await deleteAnswer(id)
      res.send({ message: 'Success' })
    } else {
      res.status(403).send({ message: "You can't delete this answer" })
    }
  })
)

// Chinh sua cau tra loi
/**
 * @openapi
 * /answers/{id}:
 *   patch:
 *     summary: Update answer
 *     tags: [Answers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *              type: object
 *              properties:
 *                answerText:
 *                  type: string
 *                  description: Answer text to update.
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
answerRouter.patch(
  '/:id',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const user = req.user
    const { id } = req.params
    const { answerText } = req.body
    const answer = await Answer.findByPk(id)
    if (answer.userId === req.user.id || req.user.isAdmin) {
      await updateAnswer({ id, answerText })
      res.send({ message: 'Success' })
    } else {
      res.status(403).send({ message: "You can't change this answer" })
    }
  })
)

module.exports = answerRouter