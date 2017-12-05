const db = require('../../controllers/database')

module.exports = [(req, res, next) => {
  return db.Companies.findAll({
    where: { host: true },
    attributes: { exclude: ['host', 'countryId'] },
    include: [{
      model: db.Countries,
      attributes: { exclude: ['flagSvg'] }
    }, {
      model: db.Contacts,
      attributes: { exclude: ['id', 'hashedPassword', 'salt', 'admin', 'companyId'] }
    }]
  }).then(data => {
    req.resJson = { data }
    next()
    return Promise.resolve()
  }).catch(error => next(error))
}]
