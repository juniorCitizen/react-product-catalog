const routerResponse = require('../controllers/routerResponse')

module.exports = (modelReference) => {
  return (req, res, next) => {
    switch (modelReference) {
      case 'series':
        req.queryOptions = { order: ['order'] }
        break
      case 'products':
        req.queryOptions = { order: ['code'] }
        break
      default:
        routerResponse.json({
          req,
          res,
          statusCode: 501,
          message: `base query options hasn't been implemented for ${modelReference} model`
        })
        next('BASE_QUERY_OPTIONS_UNIMPLEMENTED')
    }
    next()
  }
}
