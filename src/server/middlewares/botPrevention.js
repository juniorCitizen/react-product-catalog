import routerResponse from '../controllers/routerResponse'

module.exports = (req, res, next) => {
  if (req.body.botPrevention === '') {
    next()
  } else {
    let error = new Error('bot-like activities detected')
    error.name = 'botPrevention'
    return routerResponse.json({
      pendingResponse: res,
      originalRequest: req,
      statusCode: 500,
      success: false,
      error: error,
      message: error.message
    })
  }
}
