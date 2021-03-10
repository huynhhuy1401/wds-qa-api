const sequelize = require('../config/db')
const { DataTypes } = require('sequelize')
const Question = require('./question')

const Category = sequelize.define('Category', {
  name: { type: DataTypes.STRING, allowNull: false },
})

Category.hasMany(Question, {
  onDelete: 'SET NULL',
  foreignKey: {
    name: 'categoryId',
    allowNull: true,
  },
})

Category.sync()
  .then(() => console.log('Category table created successfully'))
  .catch((err) => console.log('Failed to create Category table:', err))

module.exports = Category
