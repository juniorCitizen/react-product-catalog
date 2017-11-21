const db = require('../../controllers/database')

module.exports = (() => {
  return [(req, res, next) => {
    return db.Offices.findAll({
      include: [{
        model: db.Countries
      }, {
        model: db.Users,
        attributes: { exclude: ['loginId', 'password', 'salt', 'admin'] }
      }]
    }).then(data => {
      req.resJson = { data }
      return next()
    }).catch(error => next(error))
  }]
})()
