const db = require('../../config/mongoose')
const Category = require('../category')
const categoryData = require('./category.json')

db.once('open', () => {
  return Category.insertMany(categoryData)
    .then(() => {
      console.log('category seed insert done')
    })
    .catch(error => console.log(error))
    .finally(() => {
      db.close()
    })
})
