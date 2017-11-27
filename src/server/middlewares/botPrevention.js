module.exports = (req, res, next) => {
  if (req.body.botPrevention === '') return next()
  res.status(401)
  let error = new Error('bot-like activity detected')
  return next(error)
}
