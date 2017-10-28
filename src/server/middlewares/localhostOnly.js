import routerResponse from '../controllers/routerResponse'

module.exports = (req, res, next) => {
  if (req.hostname === 'localhost') {
    next()
  } else {
    let error = new Error('protected routes are being accessed from unauthorized locations')
    error.name = 'onlyLocalhostAllowed'
    return routerResponse.json({
      pendingResponse: res,
      originalRequest: req,
      statusCode: 500,
      success: false,
      error: error.name,
      message: error.message
    })
  }
}
