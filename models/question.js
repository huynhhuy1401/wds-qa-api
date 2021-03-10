const sequelize = require('../config/db')
const { DataTypes } = require('sequelize')

const Question = sequelize.define('Question', {
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
})

Question.hasMany(Answer, {
  onDelete: 'cascade',
  foreignKey: {
    name: 'questionId',
    allowNull: false,
  }
})

Question.sync()
  .then(() => console.log('Question table created successfully'))
  .catch((err) => console.log('Failed to create Question table:', err))

module.exports = Question
