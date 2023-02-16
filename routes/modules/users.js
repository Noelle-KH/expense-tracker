const router = require('express').Router()
const { loginValidator, registerValidator } = require('../../middleware/validator')
const userController = require('../../controllers/user-controller')

router.get('/login', userController.loginPage)
router.post('/login', loginValidator, userController.login)
router.get('/register', userController.registerPage)
router.post('/register', registerValidator, userController.register)
router.get('/logout', userController.logout)

module.exports = router
