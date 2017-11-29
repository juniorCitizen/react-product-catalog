const db = require('../../controllers/database')

module.exports = [
  (req, res, next) => {
    return db.Products
      .findById(req.params.productId.toUpperCase(), {
        include: [
          { model: db.Tags },
          { model: db.Photos, attributes: { exclude: ['data'] } }
        ],
        order: [
          'code',
          [db.Tags, 'name'],
          [db.Photos, 'primary', 'desc']
        ]
      })
      .then(data => {
        req.resJson = { data }
        next()
        return Promise.resolve()
      })
      .catch(error => next(error))
  }
]
