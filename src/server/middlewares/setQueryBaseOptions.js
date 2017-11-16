const routerResponse = require('../controllers/routerResponse')

const baseOptions = {
  series: { order: ['order'] },
  products: { order: ['code'] },
  countries: { order: ['name'] }
}

module.exports = (modelReference) => {
  return (req, res, next) => {
    if (!(modelReference in baseOptions)) {
      routerResponse.json({
        req,
        res,
        statusCode: 501,
        message: `base query options hasn't been implemented for ${modelReference} model`
      })
      next('BASE_QUERY_OPTIONS_UNIMPLEMENTED')
    }
    req.queryOptions = baseOptions[modelReference]
    next()
  }
}
