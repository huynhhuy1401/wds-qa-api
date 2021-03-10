const sequelize = require('../config/db')
const { DataTypes } = require('sequelize')

const Category = sequelize.define('Category', {
  name: { type: DataTypes.STRING, allowNull: false },
})

module.exports = Category
