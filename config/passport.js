const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')
const User = require('../models/user')

passport.use(new LocalStrategy({ usernameField: 'email', passReqToCallback: true }, (req, email, password, done) => {
  return User.findOne({ email })
    .then(user => {
      if (!user) return done(null, false, req.flash('warning_message', '此信箱尚未註冊'))

      return bcrypt.compare(password, user.password)
        .then(isMatch => {
          if (!isMatch) return done(null, false, req.flash('warning_message', '信箱或密碼錯誤'))
          return done(null, user)
        })
        .catch(error => done(error))
    })
    .catch(error => done(error))
}))


passport.serializeUser((user, done) => {
  done(null, user.id)
})

passport.deserializeUser((id, done) => {
  return User.findById(id)
    .lean()
    .then(user => done(null, user))
    .catch(error => done(error))
})

module.exports = passport
