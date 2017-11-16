const db = require('../../controllers/database')
const routerResponse = require('../../controllers/routerResponse')

module.exports = (() => {
  return [(req, res) => {
    return db.Products
      .findAndCountAll()
      .then(result => routerResponse.json({
        req, res, statusCode: 200, data: result.count
      }))
      .catch(error => routerResponse.json({
        req, res, statusCode: 500, error
      }))
  }]
})()
