const Category = require('../models/category')
const Answer = require('../models/Answer')

const createAnswer = async ({ answerText, questionId, userId }) => {
  return await Answer.create({
    answerText,
    questionId,
    userId,
  })
}

const deleteAnswer = async ({ id }) => {
  const answer = await Answer.findByPk(id)
  await answer.destroy()
}

const updateAnswer = async ({ id, answerText }) => {
  const answer = await Answer.findByPk(id)
  answer.answerText = answerText
  await answer.save()
}

const getAllAnswers = async () => {
  return await Answer.findAll()
}

const getAnswer = async (obj) => {
  return await Answer.findOne({
    where: obj,
  })
}

module.exports = {
  getAnswer,
  getAllAnswers,
  deleteAnswer,
  updateAnswer,
  createAnswer,
}
