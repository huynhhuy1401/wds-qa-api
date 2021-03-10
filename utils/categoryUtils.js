const Category = require('../models/category')

const getAllCategories = async () => {
  return await Category.findAll()
}

const getCategory = async (id) => {
  return await Category.findByPk(id)
}

module.exports = {
  getAllCategories,
}
