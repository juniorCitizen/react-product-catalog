const routerResponse = require('../controllers/routerResponse')

module.exports = (parameterNameArray) => {
  return (req, res, next) => {
    parameterNameArray.forEach((parameterName) => {
      if (!req.query.hasOwnProperty(parameterName)) {
        routerResponse.json({
          req,
          res,
          statusCode: 400,
          message: `required url query parameter '${parameterName}' is missing`
        })
        next('QUERY_PARAMETERS_MISSING_FROM_URL')
      }
    })
    next()
  }
}
