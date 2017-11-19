module.exports = (req, res, next) => {
  if (req.body.botPrevention === '') next()
  res.status(401)
  req.resJson = {
    message: 'bot-like activity detected'
  }
  next()
}
