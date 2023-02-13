if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express')
const exphbs = require('express-handlebars')
const session = require('express-session')
const flash = require('connect-flash')

const app = express()
require('./config/mongoose')
const passport = require('./config/passport')
const routes = require('./routes')
const PORT = process.env.PORT || 3000

app.engine('handlebars', exphbs.engine({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')
app.use(express.urlencoded({ extended: true }))
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}))
app.use(flash())
app.use(passport.initialize())
app.use(passport.session())
app.use((req, res, next) => {
  res.locals.user = req.user
  res.locals.isAuthenticate = req.isAuthenticated()
  res.locals.success_message = req.flash('success_message')
  res.locals.warning_message = req.flash('warning_message')
  next()
})
app.use(routes)

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
