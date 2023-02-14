const router = require('express').Router()
const { validationResult } = require('express-validator')
const passport = require('passport')
const bcrypt = require('bcryptjs')
const validator = require('../../middleware/validator').registerValidator
const User = require('../../models/user')

router.get('/login', (req, res) => {
  res.render('login')
})

router.post('/login', (req, res, next) => {
  const { email, password } = req.body
  if (!email || !password) {
    req.flash('warning_message', '請填寫信箱和密碼')
    return res.redirect('/users/login')
  }
  next()
}, passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/users/login'
}))

router.get('/register', (req, res) => {
  res.render('register')
})

router.post('/register', validator, (req, res) => {
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
        .catch(error => console.log(error))
    })
    .catch(error => console.log(error))
})

router.get('/logout', (req, res, next) => {
  req.logout(error => {
    if (error) return next(error)
    req.flash('success_message', '您已成功登出')
    res.redirect('/users/login');
  })
})

module.exports = router
