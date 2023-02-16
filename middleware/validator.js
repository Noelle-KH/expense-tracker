const { body } = require('express-validator')

module.exports = {
  loginValidator: (req, res, next) => {
    const { email, password } = req.body

    if (!email || !password) {
      req.flash('warning_message', '請填寫信箱和密碼')
      return res.redirect('/users/login')
    }
    next()
  },
  registerValidator: [
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
  ],
  recordValidator: [
    body('name')
      .notEmpty()
      .withMessage('支出名稱為必填欄位'),
    body('date')
      .notEmpty()
      .withMessage('日期為必填欄位'),
    body('categoryId')
      .notEmpty()
      .withMessage('類別為必填欄位'),
    body('amount')
      .notEmpty()
      .withMessage('金額為必填欄位')
      .custom(value => {
        if (value <= 0) {
          throw new Error('金額不得小於 0')
        }
        return true
      })
  ]
}
