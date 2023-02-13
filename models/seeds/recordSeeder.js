const bcrypt = require('bcryptjs')
const db = require('../../config/mongoose')
const Category = require('../category')
const Record = require('../record')
const User = require('../user')
const recordData = require('./record.json')

const USER_SEED = {
  name: "廣志",
  email: "user@example.com",
  password: "123456"
}

db.once('open', () => {
  return Promise.all([
    Category.find({}).lean(),
    User.create({
      name: USER_SEED.name,
      email: USER_SEED.email,
      password: bcrypt.hashSync(USER_SEED.password, bcrypt.genSaltSync(10))
    })
  ])
    .then(([categories, user]) => {
      const records = recordData.map(data => {
        const { name, date, amount, category } = data
        const userId = user._id
        const categoryId = categories.find(cat => cat.name === category)._id
        const record = { name, date, amount, userId, categoryId }
        return Record.create(record)
      })

      return Promise.all(records)
    })
    .then(() => {
      console.log('user and record seed insert done')
      process.exit()
    })
    .catch(error => console.log(error))
})
