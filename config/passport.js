const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const FacebookStrategy = require('passport-facebook').Strategy
const GoogleStrategy = require('passport-google-oauth2').Strategy
const bcrypt = require('bcryptjs')
const User = require('../models/user')

const verifyCallback = (accessToken, refreshToken, profile, done) => {
  const { name, email } = profile._json
  return User.findOne({ email })
    .then(user => {
      if (user) return done(null, user)
      const randomPassword = Math.random().toString(36).slice(-8)
      return User.create({ name, email, password: bcrypt.hashSync(randomPassword, bcrypt.genSaltSync(10)) })
        .then(user => done(null, user))
        .catch(error => done(error))
    })
}

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

passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_ID,
  clientSecret: process.env.FACEBOOK_SECRET,
  callbackURL: process.env.FACEBOOK_CALLBACK,
  profileFields: ['email', 'displayName']
}, verifyCallback))

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_ID,
  clientSecret: process.env.GOOGLE_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK
}, verifyCallback))


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
