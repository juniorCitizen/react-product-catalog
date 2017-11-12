const db = require('../../controllers/database')
const routerResponse = require('../../controllers/routerResponse')

const validateJwt = require('../../middlewares/validateJwt')

const productQueryParameters = require('../../models/ormQueryParameters/products')

module.exports = ((req, res) => {
  return [
    validateJwt,
    filterBodyData,
    (req, res) => {
      return db.Products
        .update(req.filteredData, { where: { id: req.body.id.toUpperCase() } })
        .then(() => db.Products.findById(
          req.body.id.toUpperCase(),
          req.query.hasOwnProperty('details')
            ? productQueryParameters.details()
            : productQueryParameters.simple()
        ))
        .then(data => routerResponse.json({
          req,
          res,
          statusCode: 200,
          data
        }))
        .catch(error => routerResponse.json({
          req,
          res,
          statusCode: 500,
          error
        }))
    }]
})()

// check field data presented in req.body and put in custom 'filteredData' object in req
// to avoid unexpected behaviors during update
function filterBodyData (req, res, next) {
  req.filteredData = {}
  let expectedFields = ['code', 'name', 'specification', 'description', 'publish', 'seriesId']
  expectedFields.forEach(fieldName => {
    if (req.body.hasOwnProperty(fieldName)) {
      req.filteredData[fieldName] = req.body[fieldName]
    }
  })
  if (Object.keys(req.filteredData).length === 0 && req.filteredData.constructor === Object) {
    // client did not pass any field to update
    return routerResponse.json({
      req,
      res,
      statusCode: 400,
      message: 'at least one of the following fields must be present in the request body: \'code\', \'name\', \'specification\', \'description\', \'publish\', \'seriesId\''
    })
  } else {
    next()
  }
}
