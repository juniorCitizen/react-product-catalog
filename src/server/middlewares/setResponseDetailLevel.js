const db = require('../controllers/database')

const detailedOptions = {
  series: () => {
    return {
      include: [{
        model: db.Products,
        include: [
          { model: db.Tags },
          { model: db.Photos, attributes: { exclude: ['data'] } }
        ]
      }, {
        model: db.Photos, attributes: { exclude: ['data'] }
      }],
      order: [
        'order',
        [db.Products, 'code'],
        [db.Products, db.Tags, 'name'],
        [db.Products, db.Photos, 'primary', 'DESC']
      ]
    }
  },
  countries: () => {
    return { order: ['region', 'name'] }
  },
  products: () => {
    return {
      include: [
        { model: db.Tags },
        { model: db.Photos, attributes: { exclude: ['data'] } }
      ],
      order: [
        'code',
        [db.Tags, 'name'],
        [db.Photos, 'primary', 'DESC']
      ]
    }
  }
}

module.exports = (modelReference) => {
  return (req, res, next) => {
    if ('details' in req.query) {
      if (modelReference in detailedOptions) {
        req.queryOptions = Object.assign({}, detailedOptions[modelReference]())
      } else {
        res.status(501)
        let error = new Error(`資料表模板 ${modelReference} 查詢選項尚未設置`)
        error.message = `資料表模板 ${modelReference} 查詢選項尚未設置`
        return next(error)
      }
    }
    return next()
  }
}
