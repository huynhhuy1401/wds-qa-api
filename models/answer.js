const sequelize = require('../config/db')
const { DataTypes } = require('sequelize')
const Question = require('./question')
const User = require('./user')

const Answer = sequelize.define('Answer', {
  answerText: { type: DataTypes.TEXT, allowNull: false },
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id',
    },
    onDelete: 'cascade',
  },
  questionId: {
    type: DataTypes.INTEGER,
    references: {
      model: Question,
      key: 'id',
    },
    onDelete: 'cascade',
  },
})

module.exports = Answer
