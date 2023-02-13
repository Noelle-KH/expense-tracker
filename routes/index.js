const router = require('express').Router()
const home = require('./modules/home')
const users = require('./modules/users')
const records = require('./modules/records')

router.use('/users', users)
router.use('/records', records)
router.use('/', home)

module.exports = router
