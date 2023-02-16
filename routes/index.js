const router = require('express').Router()
const users = require('./modules/users')
const records = require('./modules/records')
const auth = require('./modules/auth')
const { authenticator } = require('../middleware/auth')
const { errorHandler } = require('../middleware/error-handler')

router.use('/auth', auth)
router.use('/records', authenticator, records)
router.use('/users', users)
router.get('/', authenticator, (req, res) => res.redirect('/records'))
router.use('/', errorHandler)

module.exports = router
