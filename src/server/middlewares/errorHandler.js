const eVars = require('../config/eVars')

const cannedMessage = {
  400: '400 Bad Request',
  401: '401 Unauthorized',
  403: '403 Forbidden',
  404: '404 Not Found',
  500: '500 Internal Server Error',
  501: '501 Not Implemented',
  503: '503 Service Unavailable',
  505: '505 Permission Denied'
}

module.exports = (error, req, res, next) => {
  res.status(error.status)
  res.type('application/json;charset=utf-8')
  let resJson = {
    method: req.method,
    endpoint: `${req.protocol}://${req.hostname}:${eVars.PORT}${req.originalUrl}`,
    statusCode: res.statusCode,
    error: error,
    message: error.message ? error.message : cannedMessage[error.res.statusCode.toString()]
  }
  if ('data' in error) { resJson.data = error.data }
  res.json(resJson)
}
