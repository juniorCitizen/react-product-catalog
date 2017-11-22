const db = require('../../controllers/database')

module.exports = [(req, res, next) => {
  return db.Flags.create({
    id: req.body.id.toLowerCase(),
    data: req.body.data
  }).then(data => {
    req.resJson = { data }
    next()
    return Promise.resolve()
  }).catch(next)
}]
