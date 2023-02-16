const { validationResult } = require('express-validator')
const bcrypt = require('bcryptjs')
const passport = require('passport')
const User = require('../models/user')

const userController = {
  loginPage: (req, res) => {
    res.render('login')
  },
  login: passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/users/login'
  }),
  registerPage: (req, res) => {
    res.render('register')
  },
  register: (req, res) => {
    const { name, email, password, confirmPassword } = req.body
    const errors = validationResult(req)
    const errorMessages = errors.array().map(error => error.msg)

    if (!errors.isEmpty()) {
      return res.render('register', { name, email, password, confirmPassword, errorMessages })
    }

    return User.findOne({ email })
      .then(user => {
        if (user) {
          req.flash('warning_message', 'Email 顯示已是會員，請使用登入功能')
          return res.redirect('/users/login')
        }

        return User.create({ name, email, password: bcrypt.hashSync(password, bcrypt.genSaltSync(10)) })
          .then(() => {
            req.flash('success_message', '註冊成功，請重新登入會員')
            res.redirect('/users/login')
          })
          .catch(error => next(error))
      })
      .catch(error => next(error))
  },
  logout: (req, res, next) => {
    req.logout(error => {
      if (error) return next(error)

      req.flash('success_message', '您已成功登出')
      res.redirect('/users/login');
    })
  }
}

module.exports = userController
