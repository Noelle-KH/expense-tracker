const router = require('express').Router()
const { validationResult } = require('express-validator')
const dayjs = require('dayjs')
const validator = require('../../middleware/validator').newRecordValidator
const Category = require('../../models/category')
const Record = require('../../models/record')

router.get('/', (req, res) => {
  const userId = req.user._id
  return Record.find({ userId })
    .populate('categoryId')
    .lean()
    .sort({ date: -1, _id: -1 })
    .then(records => {
      if (!records.length) {
        return res.render('index')
      }
      records.forEach(record => record.date = dayjs(record.date).format('YYYY-MM-DD'))
      res.render('index', { records })
    })
    .catch(error => console.log(error))
})

router.get('/new', (req, res) => {
  return Category.find({})
    .lean()
    .then(category => res.render('new', { category }))
    .catch(error => console.log(error))
})

router.post('/', validator, (req, res) => {
  const userId = req.user._id
  const { name, date, categoryId, amount } = req.body
  const errors = validationResult(req)
  const errorMessages = errors.array().map(error => error.msg)
  return Category.find({})
    .lean()
    .then(category => {
      if (!errors.isEmpty()) {
        return res.render('new', { category, name, date, categoryId, amount, errorMessages })
      }
      return Record.create({ name, date, amount, userId, categoryId })
        .then(() => {
          req.flash('success_message', '新增支出項目成功')
          res.redirect('/')
        })
        .catch(error => console.log(error))
    })
    .catch(error => console.log(error))
})

router.get('/edit', (req, res) => {
  res.render('edit')
})

module.exports = router
