const router = require('express').Router()
const { validationResult } = require('express-validator')
const dayjs = require('dayjs')
const validator = require('../../middleware/validator').recordValidator
const Category = require('../../models/category')
const Record = require('../../models/record')

router.get('/', (req, res) => {
  const userId = req.user._id
  const selectedCategory = req.query.selectedCategory || 'all'
  const query = { userId }
  
  if (selectedCategory !== 'all') {
    query.categoryId = selectedCategory
  }

  return Category.find({})
    .lean()
    .then(category => {
      return Record.find(query)
        .populate('categoryId')
        .lean()
        .sort({ date: -1, _id: -1 })
        .then(records => {
          if (!records.length) {
            return res.render('index', { category })
          }
          records.forEach(record => record.date = dayjs(record.date).format('YYYY-MM-DD'))
          const totalAmount = records.reduce((total, record) => total + record.amount, 0)
          res.render('index', { category, selectedCategory, records, totalAmount })
        })
        .catch(error => console.log(error))
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

router.get('/:_id/edit', (req, res) => {
  const userId = req.user._id
  const _id = req.params._id
  return Promise.all([
    Category.find({}).lean(),
    Record.findOne({ _id, userId })
  ])
    .then(([category, record]) => {
      const { name, amount, categoryId } = record
      const date = dayjs(record.date).format('YYYY-MM-DD')
      res.render('edit', { category, _id, name, date, amount, categoryId })
    })
    .catch(error => console.log(error))
})

router.put('/:_id', validator, (req, res) => {
  const userId = req.user._id
  const _id = req.params._id
  const { name, date, categoryId, amount } = req.body
  const errors = validationResult(req)
  const errorMessages = errors.array().map(error => error.msg)

  if (!errors.isEmpty()) {
    return Category.find({})
      .lean()
      .then(category => res.render('edit', { category, _id, name, date, categoryId, amount, errorMessages }))
      .catch(error => console.log(error))
  }

  return Record.findOneAndUpdate({ _id, userId }, { name, date, amount, userId, categoryId })
    .then(() => {
      req.flash('success_message', '更新支出項目成功')
      res.redirect('/')
    })
    .catch(error => console.log(error))
})

router.delete('/:_id', (req, res) => {
  const userId = req.user._id
  const _id = req.params._id
  return Record.findOneAndDelete({ _id, userId })
    .then(() => {
      req.flash('success_message', '刪除支出項目成功')
      res.redirect('/')
    })
    .catch(error => console.log(error))
})

module.exports = router
