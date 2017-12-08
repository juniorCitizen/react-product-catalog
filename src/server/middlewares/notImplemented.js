module.exports = (req, res, next) => {
  res.status(501)
  let error = new Error('Not implemented')
  return next(error)
}
