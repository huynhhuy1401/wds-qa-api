const sequelize = require('../config/db')
const { DataTypes } = require('sequelize')

const Answer = sequelize.define('Answer', {
  answerText: { type: DataTypes.TEXT, allowNull: false },
})

Answer.sync()
  .then(() => console.log('Answer table created successfully'))
  .catch((err) => console.log('Failed to create Answer table:', err))

module.exports = Answer