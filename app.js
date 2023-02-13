if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express')
const exphbs = require('express-handlebars')

const app = express()
require('./config/mongoose')
const PORT = process.env.PORT || 3000

app.engine('handlebars', exphbs.engine({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
  res.render('index')
})

app.get('/records/new', (req, res) => {
  res.render('new')
})

app.get('/records/edit', (req, res) => {
  res.render('edit')
})

app.get('/users/login', (req, res) => {
  res.render('login')
})

app.get('/users/register', (req, res) => {
  res.render('register')
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
