const db = require('../../controllers/database')

module.exports = [
  (req, res, next) => {
    return db.Series
      .findAll({
        where: { id: req.params.seriesId.toUpperCase() },
        include: [{
          model: db.Products,
          include: [{
            model: db.Photos,
            attributes: { exclude: ['data'] }
          }]
        }],
        order: [
          [db.Products, 'code'],
          [db.Products, db.Photos, 'primary', 'desc']
        ]
      })
      .then((data) => {
        req.resJson = { data }
        next()
        return Promise.resolve()
      })
      .catch(error => next(error))
  }
]
