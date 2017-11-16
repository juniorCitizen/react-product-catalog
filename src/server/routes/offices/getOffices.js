const db = require('../../controllers/database')
const routerResponse = require('../../controllers/routerResponse')

module.exports = (() => {
  return [(req, res) => {
    return db.Offices.findAll({
      include: [{
        model: db.Countries
      }, {
        model: db.Users,
        attributes: { exclude: ['loginId', 'password', 'salt'] }
      }]
    }).then(data => routerResponse.json({
      req, res, statusCode: 200, data
    })).catch(error => routerResponse.json({
      req, res, statusCode: 500, error
    }))
  }]
})()
