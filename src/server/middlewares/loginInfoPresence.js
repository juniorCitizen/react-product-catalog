module.exports = (req, res, next) => {
  let expectedFields = ['email', 'loginId', 'password', 'botPrevention']
  expectedFields.forEach((fieldName) => {
    if (!(fieldName in req.body)) {
      res.status(400)
      req.resJson = {
        message: 'login info is incomplete'
      }
      next()
    }
  })
  next()
}
