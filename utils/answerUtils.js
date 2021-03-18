const Answer = require('../models/answer')
const User = require('../models/user')

const createAnswer = async ({ answerText, questionId, userId }) => {
  return await Answer.create({
    answerText,
    questionId,
    userId,
  })
}

const deleteAnswer = async ( id ) => {
  const answer = await Answer.findByPk(id)
  await answer.destroy()
}

const updateAnswer = async ({ id, answerText }) => {
  const answer = await Answer.findByPk(id)
  answer.answerText = answerText
  await answer.save()
}

const getAllAnswersOfQuestion = async (questionId) => {
  return await Answer.findAll({
    where: {
      questionId: questionId,
    },
    include: [{
      model: User,
      as: 'user',
      attributes: ['username', 'name']
    }]
  })
}

const getAnswer = async (id) => {
  return await Answer.findByPk(id)
}

module.exports = {
  getAnswer,
  getAllAnswersOfQuestion,
  deleteAnswer,
  updateAnswer,
  createAnswer,
}
