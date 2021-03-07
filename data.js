const bcrypt = require('bcryptjs')

const data = {
  users: [
    {
      name: 'Basir',
      username: 'basir',
      password: bcrypt.hashSync('1234', 8),
      isAdmin: true,
    },
    {
      name: 'John',
      username: 'john',
      password: bcrypt.hashSync('1234', 8),
      isAdmin: false,
    },
  ],
}
module.exports = data
