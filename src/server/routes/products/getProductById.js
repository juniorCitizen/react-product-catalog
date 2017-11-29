const db = require('../../controllers/database')

module.exports = [
  (req, res, next) => {
    let queryOptions = {
      include: [
        { model: db.Tags },
        { model: db.Photos, attributes: { exclude: ['data'] } }
      ],
      order: [
        'code',
        [db.Tags, 'name'],
        [db.Photos, 'primary', 'desc']
      ],
      where: { active: true }
    }
    // get inactive product records
    if ('inactive' in req.query) delete queryOptions.where
    return db.Products
      .findById(req.params.productId.toUpperCase(), queryOptions)
      .then(data => {
        req.resJson = { data }
        next()
        return Promise.resolve()
      })
      .catch(error => next(error))
  }
]
