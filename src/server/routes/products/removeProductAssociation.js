const db = require('../../controllers/database')

const validateJwt = require('../../middlewares/validateJwt')

module.exports = {
  fromTag: removeLabel(),
  fromSeries: removeSeriesId()
}

function removeLabel () {
  return [
    validateJwt({ admin: true }),
    (req, res, next) => {
      let queryOptions = {
        include: [
          { model: db.Tags },
          {
            model: db.Photos,
            attributes: { exclude: ['data'] }
          }
        ],
        order: [
          'code',
          [db.Tags, 'name'],
          [db.Photos, 'primary', 'desc']
        ],
        where: { active: true }
      }
      let targetProductId = req.params.productId.toUpperCase()
      let targetTagId = parseInt(req.params.tagId)
      return db.Labels.destroy({ where: { productId: targetProductId, tagId: targetTagId } })
        .then(() => db.Products.findById(targetProductId, queryOptions))
        .then((data) => {
          req.resJson = { data }
          next()
          return Promise.resolve()
        })
        .catch(error => next(error))
    }
  ]
}

function removeSeriesId () {
  return [
    validateJwt({ admin: true }),
    (req, res, next) => {
      let queryOptions = {
        include: [
          { model: db.Tags },
          {
            model: db.Photos,
            attributes: { exclude: ['data'] }
          }
        ],
        order: [
          'code',
          [db.Tags, 'name'],
          [db.Photos, 'primary', 'desc']
        ],
        where: { active: true }
      }
      let targetProductId = req.params.productId.toUpperCase()
      let targetSeriesId = req.params.seriesId.toUpperCase()
      return db.Products.update({ active: false, seriesId: null }, { where: { id: targetProductId, seriesId: targetSeriesId } })
        .then(() => db.Products.findById(targetProductId, queryOptions))
        .then((data) => {
          req.resJson = { data }
          next()
          return Promise.resolve()
        })
        .catch(error => next(error))
    }
  ]
}
