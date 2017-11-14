const db = require('../controllers/database')
const routerResponse = require('../controllers/routerResponse')

module.exports = (modelReference) => {
  return (req, res, next) => {
    if (req.query.hasOwnProperty('details')) {
      switch (modelReference) {
        case 'series':
          Object.assign(req.queryOptions, {
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
          })
          break
        case 'products':
          Object.assign(req.queryOptions, {
            include: [
              { model: db.Tags },
              { model: db.Photos, attributes: { exclude: ['data'] } }
            ],
            order: [
              'code',
              [db.Tags, 'name'],
              [db.Photos, 'primary', 'DESC']
            ]
          })
          break
        default:
          routerResponse.json({
            req,
            res,
            statusCode: 501,
            message: `detailed query options hasn't been implemented for ${modelReference} model`
          })
          next('DETAILED_QUERY_OPTIONS_UNIMPLEMENTED')
      }
    }
    next()
  }
}
