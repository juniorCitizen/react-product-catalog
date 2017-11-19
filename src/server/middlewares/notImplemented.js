module.exports = (req, res, next) => {
  res.status(501)
  let error = new Error('Not implemented')
  error.message = 'A API endpoint or function stub is called'
  return next(error)
}
