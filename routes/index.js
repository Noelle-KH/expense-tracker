const router = require('express').Router()
const users = require('./modules/users')
const records = require('./modules/records')
const { authenticator } = require('../middleware/auth')

router.use('/records', authenticator, records)
router.use('/users', users)
router.get('/', authenticator, (req, res) => res.redirect('/records'))

module.exports = router
