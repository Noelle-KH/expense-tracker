const { body } = require('express-validator')

const validator = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('名稱是必填欄位'),
  body('email')
    .trim()
    .isEmail()
    .withMessage('請填入有效Email資訊')
    .notEmpty()
    .withMessage('Email是必填欄位'),
  body('password')
    .trim()
    .isLength({ min: 6, max: 20 })
    .withMessage('密碼長度請介於 6 - 20 位')
    .notEmpty()
    .withMessage("密碼為必填欄位"),
  body('confirmPassword')
    .trim()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('兩次密碼不相符，請確認輸入的密碼')
      }
      return true
    })
]

module.exports = validator
