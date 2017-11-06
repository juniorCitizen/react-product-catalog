const db = require('../../controllers/database/database')
const routerResponse = require('../../controllers/routerResponse')

module.exports = (req, res) => {
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
