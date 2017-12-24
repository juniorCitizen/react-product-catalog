module.exports = (req, res, next) => {
  if ((req.hostname === 'localhost') && (req.ip === '127.0.0.1')) {
    res.status(401)
    let error = new Error('Accessible only from localhost')
    return next(error)
  } else {
    return next()
  }
}
