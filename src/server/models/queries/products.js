const db = require('../../controllers/database')
const logging = require('../../controllers/logging')

module.exports = {
  getSeriesProducts
}

// find products by seriesId
function getSeriesProducts (seriesId) {
  if (!seriesId) return Promise.resolve(null)
  return db.Series
    .findById(seriesId, {
      include: [{
        model: db.Products,
        include: [
          { model: db.Tags },
          { model: db.Photos }
        ]
      }],
      order: [
        [db.Products, 'code'],
        [db.Products, db.Tags, 'name'],
        [db.Products, db.Photos, 'primary', 'desc']
      ]
    })
    .then(series => Promise.resolve(series.products))
    .catch(error => {
      logging.error(error, '/models/queries/products.getSeriesProducts() errored')
      return Promise.reject(error)
    })
}
