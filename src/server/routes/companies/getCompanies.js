const db = require('../../controllers/database')

module.exports = (() => {
  return [(req, res, next) => {
    return db.Companies.findAll({
      include: [{
        model: db.Countries
      }, {
        model: db.Contacts,
        attributes: { exclude: ['loginId', 'password', 'salt', 'admin'] }
      }]
    }).then(data => {
      req.resJson = { data }
      return next()
    }).catch(error => next(error))
  }]
})()
