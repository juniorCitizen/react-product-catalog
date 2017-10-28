import routerResponse from '../controllers/routerResponse'

module.exports = (req, res, next) => {
  if (
    (!req.body.password) ||
    ((req.body.password.length < 8) || (req.body.password.length > 20))
  ) {
    let error = new Error('password is not valid')
    error.name = 'passwordNotValid'
    return routerResponse.json({
      pendingResponse: res,
      originalRequest: req,
      statusCode: 500,
      success: false,
      error: error.name,
      message: error.message
    })
  }
  next()
}
