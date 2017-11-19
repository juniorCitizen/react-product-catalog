const db = require('../../controllers/database')
const routerResponse = require('../../controllers/routerResponse')

module.exports = (() => {
  return [(req, res) => {
    return db.Countries
      .findAll({
        attributes: ['region'],
        group: 'region'
      })
      .then(data => routerResponse.json({
        req, res, statusCode: 200, data
      }))
      .catch(error => routerResponse.json({
        req, res, statusCode: 500, error, message: 'failure reading regions data'
      }))
  }]
})()
