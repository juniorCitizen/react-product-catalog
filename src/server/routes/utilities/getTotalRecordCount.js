const db = require('../../controllers/database')

module.exports = (() => {
  let compositeRecordsets = ['regions']
  return [
    checkModelAvailability(compositeRecordsets),
    getRegionsRecordCount,
    (req, res, next) => {
      // skip operation on existing models
      // if operation is already done on the composite recordsets
      if ('resJson' in req) return next()
      let model = req.params.modelReference.charAt(0).toUpperCase() + req.params.modelReference.slice(1)
      return db[model]
        .findAndCountAll()
        .then(result => {
          req.resJson = { data: result.count }
          next()
          return Promise.resolve()
        })
        .catch(error => next(error))
    }]
})()

function checkModelAvailability (compositeRecordsets) {
  return (req, res, next) => {
    let modelReference = req.params.modelReference
    if (
      (modelReference in db.sequelize.models) ||
      (compositeRecordsets.indexOf(modelReference) >= 0)
    ) {
      return next()
    } else {
      res.status(400)
      let error = new Error(`Model: '${req.params.modelReference}' does not exist`)
      return next(error)
    }
  }
}

function getRegionsRecordCount (req, res, next) {
  if (!(req.params.modelReference === 'regions')) {
    return next()
  }
  return db.Countries
    .findAll({
      attributes: ['region'],
      group: 'region'
    })
    .then(data => {
      req.resJson = { data: data.length }
      next()
      return Promise.resolve()
    })
    .catch(error => next(error))
}
