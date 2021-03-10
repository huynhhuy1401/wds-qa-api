const Category = require('../models/category')
const Question = require('../models/question')

const createQuestion = async ({ title, description, userId, categoryName }) => {
  const [category, created] = await Category.findOrCreate({
    where: {
      name: categoryName,
    },
    defaults: {
      name: categoryName,
    },
  })
  console.log(category)
  console.log(userId)
  return await Question.create({
    title,
    description,
    userId,
    categoryId: category.id,
  })
}

const updateQuestion = async ({ id, title, description }) => {
  const question = await Question.findByPk(id)
  question.title = title
  question.description = description
  await question.save()
}

const getAllQuestions = async () => {
  return await Question.findAll()
}

const getQuestion = async (id) => {
  return await Question.findByPk(id)
}

const getQuestionsByCategory = async (categoryName) => {
  const category = await Category.findOne({
    where: {
      name: categoryName,
    },
  })
  if (category) {
    const questions = await Question.findAll({
      where: {
        categoryId: category.id,
      },
    })
    return questions
  }
  return []
}

module.exports = {
  getQuestion,
  getAllQuestions,
  updateQuestion,
  createQuestion,
  getQuestionsByCategory,
}
