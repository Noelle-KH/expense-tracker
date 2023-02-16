const { validationResult } = require('express-validator')
const dayjs = require('dayjs')
const Category = require('../models/category')
const Record = require('../models/record')

const recordController = {
  getRecords: (req, res) => {
    const userId = req.user._id
    const selectedCategory = req.query.selectedCategory || 'all'
    const query = { userId }

    if (selectedCategory !== 'all') {
      query.categoryId = selectedCategory
    }

    return Category.find({})
      .lean()
      .then(categories => {
        return Record.find(query)
          .populate('categoryId')
          .lean()
          .sort({ date: -1, _id: -1 })
          .then(records => {
            if (!records.length) {
              return res.render('index', { categories, selectedCategory })
            }

            const totalAmount = records.reduce((total, record) => total + record.amount, 0)
            records.forEach(record => record.date = dayjs(record.date).format('YYYY-MM-DD'))
            res.render('index', { categories, selectedCategory, records, totalAmount })
          })
          .catch(error => console.log(error))
      })
      .catch(error => console.log(error))
  },
  newRecord: (req, res) => {
    return Category.find({})
      .lean()
      .then(categories => res.render('new', { categories }))
      .catch(error => console.log(error))
  },
  postRecord: (req, res) => {
    const userId = req.user._id
    const { name, date, categoryId, amount } = req.body
    const errors = validationResult(req)
    const errorMessages = errors.array().map(error => error.msg)

    if (!errors.isEmpty()) {
      return Category.find({})
        .lean()
        .then(categories => res.render('new', { categories, name, date, categoryId, amount, errorMessages }))
        .catch(error => console.log(error))
    }

    return Record.create({ name, date, amount, userId, categoryId })
      .then(() => {
        req.flash('success_message', '新增支出項目成功')
        res.redirect('/')
      })
      .catch(error => console.log(error))
  },
  editRecord: (req, res) => {
    const userId = req.user._id
    const _id = req.params._id

    return Promise.all([
      Category.find({}).lean(),
      Record.findOne({ _id, userId })
    ])
      .then(([categories, record]) => {
        const { name, amount, categoryId } = record
        const date = dayjs(record.date).format('YYYY-MM-DD')
        res.render('edit', { categories, _id, name, date, amount, categoryId })
      })
      .catch(error => console.log(error))
  },
  putRecord: (req, res) => {
    const userId = req.user._id
    const _id = req.params._id
    const { name, date, categoryId, amount } = req.body
    const errors = validationResult(req)
    const errorMessages = errors.array().map(error => error.msg)

    if (!errors.isEmpty()) {
      return Category.find({})
        .lean()
        .then(categories => res.render('edit', { categories, _id, name, date, categoryId, amount, errorMessages }))
        .catch(error => console.log(error))
    }

    return Record.findOneAndUpdate({ _id, userId }, { name, date, amount, userId, categoryId })
      .then(() => {
        req.flash('success_message', '更新支出項目成功')
        res.redirect('/')
      })
      .catch(error => console.log(error))
  },
  deleteRecord: (req, res) => {
    const userId = req.user._id
    const _id = req.params._id

    return Record.findOneAndDelete({ _id, userId })
      .then(() => {
        req.flash('success_message', '刪除支出項目成功')
        res.redirect('/')
      })
      .catch(error => console.log(error))
  }
}

module.exports = recordController
