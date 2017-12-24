const db = require('../../controllers/database')

const supportedParamMethods = [{
  queryMethod: 'recordCount',
  routeHandler: getRecordCount
}]

module.exports = [
  (req, res, next) => {
    let matchingMethod = supportedParamMethods.find(methodElement => {
      return methodElement.queryMethod === Object.keys(req.query)[0]
    })
    if (matchingMethod) {
      return matchingMethod.routeHandler(req, res, next)
    } else {
      res.status(400)
      let error = new Error('Did not find supported method directive in the query elements')
      return next(error)
    }
  }
]

function getRecordCount (req, res, next) {
  let lookupQuery = null
  if (req.params.modelReference === 'regions') {
    lookupQuery = db.Countries
      .findAll({ attributes: ['region'], group: 'region' })
      .then(data => Promise.resolve(data.length))
  } else {
    let model = req.params.modelReference.charAt(0).toUpperCase() + req.params.modelReference.slice(1)
    lookupQuery = db[model].getRecordCount()
  }
  return lookupQuery
    .then(data => {
      req.resJson = { data }
      next()
      return Promise.resolve()
    })
    .catch(error => next(error))
}
