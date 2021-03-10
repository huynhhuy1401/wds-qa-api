const sequelize = require('../config/db')
const { DataTypes } = require('sequelize')
const Category = require('./category')
const User = require('./user')

const Question = sequelize.define('Question', {
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: false },
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id',
    },
    onDelete: 'cascade',
    allowNull: false
  },
  categoryId: {
    type: DataTypes.INTEGER,
    references: {
      model: Category,
      key: 'id',
    },
    onDelete: 'set null',
  },
})

module.exports = Question
