const sequelize = require('../config/db')
const { DataTypes } = require('sequelize')
const Question = require('./question')
const Answer = require('./answer')

const User = sequelize.define('User', {
  name: { type: DataTypes.STRING, allowNull: false },
  username: { type: DataTypes.STRING, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false },
  isAdmin: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
})

User.hasMany(Question, {
  onDelete: 'cascade',
  foreignKey: {
    name: 'userId',
    allowNull: false,
  }
})

User.hasMany(Answer, {
  onDelete: 'cascade',
  foreignKey: {
    name: 'userId',
    allowNull: false,
  }
})

User.sync()
  .then(() => console.log('User table created successfully'))
  .catch((err) => console.log('Failed to create User table:', err))

module.exports = User
