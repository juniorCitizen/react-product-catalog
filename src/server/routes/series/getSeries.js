const db = require('../../controllers/database/database')
const routerResponse = require('../../controllers/routerResponse')

module.exports = {
  preventDoubleQueryParameters: preventDoubleQueryParameters,
  getSeries: getSeries
}

function getSeries (req, res) {
  let queryParameter = defaultQueryParameter()
  processIdentifierQuery(req.query, queryParameter, 'id')
  processIdentifierQuery(req.query, queryParameter, 'name')
  processIdentifierQuery(req.query, queryParameter, 'products')
  return db.Series
    .findAll(queryParameter)
    .then((series) => {
      return routerResponse.json({
        req: req,
        res: res,
        statusCode: 200,
        data: series
      })
    })
    .catch(error => routerResponse.json({
      req: req,
      res: res,
      statusCode: 500,
      error: error
    }))
}

function preventDoubleQueryParameters (req, res, next) {
  if ((req.query.id !== undefined) && (req.query.name !== undefined)) {
    return routerResponse.json({
      req: req,
      res: res,
      statusCode: 400,
      message: '不接受同時存在 id & name query 條件'
    })
  }
  next()
}

function defaultQueryParameter () {
  return {
    attributes: {
      exclude: [
        'createdAt',
        'updatedAt',
        'deletedAt'
      ]
    },
    order: ['displaySequence']
  }
}

function processIdentifierQuery (requestQueries, currentQueryParameters, identifier) {
  if (
    ((identifier === 'products') && (requestQueries[identifier] === 'true')) ||
    (requestQueries[identifier] !== undefined)
  ) {
    return Object.assign(
      currentQueryParameters,
      queryComponents(requestQueries, identifier)
    )
  }
}

function queryComponents (requestQueries, identifier) {
  console.log(requestQueries.limit)
  let queryComponents = {
    id: { where: { id: requestQueries.id } },
    name: { where: { name: requestQueries.name } },
    products: {
      include: [{
        model: db.Products,
        attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
        include: [{
          model: db.Tags,
          attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] }
        }, {
          model: db.Photos,
          attributes: { exclude: ['data', 'createdAt', 'updatedAt', 'deletedAt'] }
        }]
      }, {
        model: db.Photos,
        attributes: { exclude: ['data', 'createdAt', 'updatedAt', 'deletedAt'] }
      }],
      order: [
        'displaySequence',
        [db.Products, 'code'],
        [db.Products, db.Tags, 'name'],
        [db.Products, db.Photos, 'primary', 'DESC']
      ]
    }
  }
  return queryComponents[identifier]
}
