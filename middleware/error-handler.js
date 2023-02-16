module.exports = {
  errorHandler: (error, req, res, next) => {
    if (error instanceof Error) {
      req.flash('warning_message', `${error.name}: ${error.message}`)
    } else {
      req.flash('warning_message', `${error}`)
    }
    res.redirect('back')
    next(error)
  }
}
