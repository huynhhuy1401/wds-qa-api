const User = require('../models/user')

const createUser = async ({ name, username, password }) => {
  return await User.create({ name, username, password })
}

const getAllUsers = async () => {
  return await User.findAll()
}

const getUser = async (obj) => {
  return await User.findOne({
    where: obj,
  })
}

const insertMany = async (users) => {
  return await User.bulkCreate(users)
}

module.exports = {
  createUser,
  getAllUsers,
  getUser,
  insertMany,
}
