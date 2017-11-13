const db = require('../../controllers/database')
const routerResponse = require('../../controllers/routerResponse')

module.exports = {
  setEmptyQueryParameters: setEmptyQueryParameters,
  setFindDetailLevel: setFindDetailLevel,
  filterBodyData: filterBodyData
}

function setEmptyQueryParameters (req, res, next) {
  req.queryParameters = {}
  next()
}

function setFindDetailLevel (req, res, next) {
  if (req.query.hasOwnProperty('details')) {
    Object.assign(req.queryParameters, {
      include: [{
        model: db.Products,
        include: [{ model: db.Tags }, {
          model: db.Photos,
          attributes: { exclude: ['data'] }
        }]
      }, {
        model: db.Photos,
        attributes: { exclude: ['data'] }
      }],
      order: [
        'order',
        [db.Products, 'code'],
        [db.Products, db.Tags, 'name'],
        [db.Products, db.Photos, 'primary', 'DESC']
      ]
    })
  } else {
    Object.assign(req.queryParameters, { order: ['order'] })
  }
  next()
}

function filterBodyData (req, res, next) {
  req.filteredData = {}
  let expectedFields = ['name', 'order', 'publish']
  expectedFields.forEach(fieldName => {
    if (req.body.hasOwnProperty(fieldName)) {
      req.filteredData[fieldName] = req.body[fieldName]
    }
  })
  if (
    Object.keys(req.filteredData).length === 0 &&
    req.filteredData.constructor === Object
  ) {
    // client did not pass any field to update
    return routerResponse.json({
      req,
      res,
      statusCode: 400,
      message: 'at least one of the following fields must be present in the request body: \'name\', \'order\', \'publish\''
    })
  } else {
    next()
  }
}
