const passport = require('passport')

const authController = {
  facebookLogin: passport.authenticate('facebook', {
    scope: ['email', 'public_profile']
  }),
  facebookCallback: passport.authenticate('facebook', {
    successRedirect: '/',
    failureRedirect: '/users/login'
  }),
  googleLogin: passport.authenticate('google', {
    scope: ['email', 'profile']
  }),
  googleCallback: passport.authenticate('google', {
    successRedirect: '/',
    failureRedirect: '/users/login'
  })
}

module.exports = { authController }
