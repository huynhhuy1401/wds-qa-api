const Sequelize = require('sequelize')

const db = new Sequelize({
  dialect: 'sqlite',
  storage: 'qa.sqlite3',
})

module.exports = db
