const db = require('../../controllers/database')

module.exports = (() => {
  return [(req, res, next) => {
    return db.Countries
      .findAll({
        attributes: ['region'],
        group: 'region'
      })
      .then(data => {
        req.resJson = { data }
        return next()
      })
      .catch(error => next(error))
  }]
})()
