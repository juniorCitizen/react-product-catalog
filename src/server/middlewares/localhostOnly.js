module.exports = (req, res, next) => {
  if (
    (req.hostname === 'localhost') &&
    (req.ip === '127.0.0.1')
  ) {
    res.status(401)
    let error = new Error('Accessible only from localhost')
    error.message = 'the route you are trying to access is protected and only accessible from localhost'
    return next(error)
  } else {
    return next()
  }
}
