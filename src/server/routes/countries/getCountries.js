const db = require('../../controllers/database')
const routerResponse = require('../../controllers/routerResponse')

module.exports = (() => {
  return [(req, res) => {
    return db.Countries
      .findAll({ order: ['name'] })
      .then((data) => {
        return routerResponse.json({ res, req, statusCode: 200, data })
      })
      .catch((error) => {
        return routerResponse.json({
          req, res, statusCode: 500, error, message: 'failure getting country dataset'
        })
      })
  }]
})()
