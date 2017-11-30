const db = require('../../controllers/database')

const validateJwt = require('../../middlewares/validateJwt')

module.exports = {
  toTags: assignTagId(),
  toSeries: assignSeriesId()
}

function assignTagId () {
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
      return db.Labels.findOrCreate({ where: { productId: targetProductId, tagId: targetTagId } })
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

function assignSeriesId () {
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
      return db.Products.update({ seriesId: targetSeriesId }, { where: { id: targetProductId } })
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
